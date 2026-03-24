"use client";

import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

interface PaddleCheckoutButtonProps {
  priceId: string;
  label: string;
  className?: string;
}

export function CheckoutButton({ priceId, label, className }: PaddleCheckoutButtonProps) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") || "sandbox",
      token,
    }).then((instance) => {
      if (instance) setPaddle(instance);
    });
  }, []);

  const handleClick = () => {
    if (!paddle) return;
    setLoading(true);

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        displayMode: "overlay",
        theme: "light",
        successUrl: `${window.location.origin}/pricing?success=true`,
      },
    });

    setLoading(false);
  };

  if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
    return (
      <button disabled className={className}>
        {label}
      </button>
    );
  }

  return (
    <button onClick={handleClick} disabled={loading || !paddle} className={className}>
      {loading ? "..." : label}
    </button>
  );
}
