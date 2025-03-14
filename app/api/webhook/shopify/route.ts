import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-shopify-hmac-sha256") || "";

  const hash = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET || "")
    .update(rawBody, "utf8")
    .digest("base64");

  if (hash !== signature) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = JSON.parse(rawBody);

  const orderId = data.id;

  // Tạo URL redirect
  const redirectUrl = `${process.env.DOMAIN}order-success?orderId=${orderId}`;

  return NextResponse.redirect(redirectUrl);
}
