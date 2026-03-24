import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { BACKEND_URL } from "@/lib/proxy";

export async function POST(request: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") || "";

  // Parse Paddle signature format: ts=...; h1=...
  const parts = signature.split(";").reduce((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {} as Record<string, string>);

  const ts = parts.ts;
  const h1 = parts.h1;

  if (!ts || !h1) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const signedPayload = `${ts}:${rawBody}`;
  const computed = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(h1))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event_type) {
    case "subscription.activated":
    case "subscription.created": {
      const email = event.data?.customer?.email;
      if (email) {
        await fetch(`${BACKEND_URL}/api/v1/keys/upgrade`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, tier: "pro" }),
        });
      }
      break;
    }
    case "subscription.canceled": {
      const email = event.data?.customer?.email;
      if (email) {
        await fetch(`${BACKEND_URL}/api/v1/keys/upgrade`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, tier: "free" }),
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
