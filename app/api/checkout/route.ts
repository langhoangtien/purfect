import { NextRequest, NextResponse } from "next/server";

type CartItem = {
  variantId: string;
  quantity: number;
};

type ShopifyCartResponse = {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      };
    };
  };
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cartItems } = body as { cartItems: CartItem[] };

  const response = await fetch(
    `${process.env.SHOPIFY_STORE_URL}/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        query: `
        mutation {
          cartCreate(input: {
            lines: [
              ${cartItems
                .map(
                  (item) => `
                {
                  merchandiseId: "gid://shopify/ProductVariant/${item.variantId}",
                  quantity: ${item.quantity}
                }
              `
                )
                .join(",")}
            ]
          }) {
            cart {
              id
              checkoutUrl
            }
          }
        }
      `,
      }),
    }
  );

  const data: ShopifyCartResponse = await response.json();

  const checkoutUrl = data?.data?.cartCreate?.cart?.checkoutUrl || null;

  return NextResponse.json({ checkoutUrl });
}
