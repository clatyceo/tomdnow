import { NextRequest, NextResponse } from "next/server";
import { proxySessionPost } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.headers.get("x-session-token");
    if (!sessionToken) {
      return NextResponse.json({ error: "Missing session token" }, { status: 401 });
    }

    return await proxySessionPost("/api/v1/keys/regenerate", request);
  } catch (err) {
    console.error("Key regenerate proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Backend service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
