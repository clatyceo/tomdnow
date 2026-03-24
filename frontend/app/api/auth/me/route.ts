import { NextRequest, NextResponse } from "next/server";
import { proxyGet } from "@/lib/proxy";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.headers.get("x-session-token");
    if (!sessionToken) {
      return NextResponse.json({ error: "Missing session token" }, { status: 401 });
    }

    return await proxyGet("/api/v1/auth/me", request);
  } catch (err) {
    console.error("Auth me proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Backend service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
