import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/proxy";

const BACKEND_TIMEOUT = 35000; // 35s (slightly more than backend's 30s conversion timeout)

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT);

  try {
    let backendRes: Response;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      backendRes = await fetch(`${BACKEND_URL}/convert/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } else {
      const formData = await request.formData();
      backendRes = await fetch(`${BACKEND_URL}/convert`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
    }

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error("Backend request timed out");
      return NextResponse.json(
        { error: "Backend request timed out", code: "TimeoutError" },
        { status: 504 }
      );
    }
    console.error("Backend service unavailable:", err);
    return NextResponse.json(
      { error: "Backend service unavailable", code: "BackendUnavailable" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
