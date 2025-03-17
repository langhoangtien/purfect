const domain = process.env.SHOPIFY_STORE_URL;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = "2025-01";

// Type cho từng variant
export type ProductVariant = {
  id: string;
  title: string;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  compareAtPriceV2?: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: {
    url: string;
  };
};

// Type cho Product
export type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  variants: {
    edges: { node: ProductVariant }[];
  };
  images: {
    edges: {
      node: {
        url: string;
      };
    }[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
};

// Type cho Cart Item
export type CartItem = {
  id: string;
  quantity: number;
};

// Type cho Cart Response
export type ShopifyCartResponse = {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      };
    };
  };
};

// Type cho Collection
export type ShopifyCollection = {
  title: string;
  products: {
    edges: { node: Product }[];
  };
};

// Shopify Fetch
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ShopifyFetch = async (query: string, variables?: Record<string, any>) => {
  console.log("ShopifyFetch", domain, query, variables);

  const response = await fetch(`${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken || "",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  const data = await response.json();

  return data;
};

// Lấy danh sách sản phẩm
export const getProducts = async (): Promise<Product[]> => {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyFetch(query);

  return response.data.products.edges.map(
    (edge: { node: Product }) => edge.node
  );
};

// Lấy sản phẩm theo ID
export const getProductById = async (id: string): Promise<Product> => {
  const query = `
    {
      product(id: "gid://shopify/Product/${id}") {
        id
        title
        description
        variants(first: 20) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyFetch(query);
  return response.data.product;
};

// Lấy danh sách sản phẩm trong Collection
export const getProductsByCollection = async (
  collectionId: string
): Promise<ShopifyCollection> => {
  const query = `
    {
      collection(id: "gid://shopify/Collection/${collectionId}") {
        title
        products(first: 10) {
          edges {
            node {
              id
              title
              description
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await ShopifyFetch(query);
  return response.data.collection;
};

// Lấy sản phẩm theo slug (handle)
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 30) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                url
              }
            }
          }
        }
      }
    }
  `;

  const data = await ShopifyFetch(query, { handle: slug });
  return data?.data?.productByHandle;
};

// Tạo giỏ hàng
export const cartCreate = async (
  cartItems: CartItem[]
): Promise<string | null> => {
  const query = `
    mutation {
      cartCreate(input: {
        lines: [
          ${cartItems
            .map(
              (item) => `{
                merchandiseId: "gid://shopify/ProductVariant/${item.id}",
                quantity: ${item.quantity}
              }`
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
  `;

  const data: ShopifyCartResponse = await ShopifyFetch(query);

  return data?.data?.cartCreate?.cart?.checkoutUrl || null;
};
