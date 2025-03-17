import { cartCreate } from "@/lib/shopify";
import { NextRequest, NextResponse } from "next/server";

type CartItem = {
  id: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cartItems } = body as { cartItems: CartItem[] };

  const checkoutUrl = await cartCreate(cartItems);

  return NextResponse.json({ checkoutUrl });
}
