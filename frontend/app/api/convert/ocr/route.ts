import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";
const BACKEND_TIMEOUT = 45000; // 45s (OCR can be slower than regular conversion)

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT);

  try {
    const formData = await request.formData();

    const backendRes = await fetch(`${BACKEND_URL}/convert/ocr`, {
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
      console.error("OCR backend request timed out");
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
