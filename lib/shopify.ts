const domain = process.env.SHOPIFY_STORE_URL;
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_STOREFRONT_API_VERSION;

const ShopifyFetch = async (query: string) => {
  const response = await fetch(`${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken || "",
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 360 },
  });

  const data = await response.json();

  return data;
};

export const getProducts = async () => {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
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
  console.log("RESPONSE", response.data.products.edges[0].node.variants);

  return response.data.products.edges.map((edge: any) => edge.node);
};

export const getProductById = async (id: string) => {
  const query = `
    {
      product(id: "gid://shopify/Product/${id}") {
        id
        title
        description
        collections(first: 5) {
          edges {
            node {
              id
              title
            }
          }
  }    
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
        images(first: 3) {
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

export const getProductsByCollection = async (collectionId: string) => {
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
