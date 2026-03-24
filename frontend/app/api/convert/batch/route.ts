import { NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/proxy";

const BACKEND_TIMEOUT = 60000; // 60s for batch (longer than single file)

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT);

  try {
    const formData = await request.formData();

    const backendRes = await fetch(`${BACKEND_URL}/convert/batch`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error("Batch backend request timed out");
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
