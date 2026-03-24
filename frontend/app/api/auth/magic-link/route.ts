import { NextRequest } from "next/server";
import { proxyJsonPost } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  try {
    return await proxyJsonPost("/api/v1/auth/magic-link", request);
  } catch (err) {
    console.error("Magic link proxy error:", err);
    return new Response(
      JSON.stringify({ error: "Backend service unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
