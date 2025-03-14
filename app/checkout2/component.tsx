export type CartItem = {
  variantId: string;
  quantity: number;
};

type CheckoutResponse = {
  data: {
    checkoutCreate: {
      checkout: {
        webUrl: string;
      };
    };
  };
};

export const createCheckoutOnShopify = async (
  cartItems: CartItem[]
): Promise<string | null> => {
  console.log("URL", process.env.SHOPIFY_STORE_URL);

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
          checkoutCreate(input: {
            lineItems: [
              ${cartItems
                .map(
                  (item) => `
                {
                  variantId: "gid://shopify/ProductVariant/${item.variantId}",
                  quantity: ${item.quantity}
                }
              `
                )
                .join(",")}
            ]
          }) {
            checkout {
              webUrl
            }
          }
        }
      `,
      }),
    }
  );

  const data: CheckoutResponse = await response.json();

  return data?.data?.checkoutCreate?.checkout?.webUrl || null;
};
