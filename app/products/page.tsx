import { getProducts } from "@/lib/shopify";

const ProductsPage = async () => {
  const products = await getProducts();
  console.log("PRODUCTS", products);

  return (
    <div>
      <h1>🎯 Product Shopify</h1>
      <ul>
        {products.map((product: any) => (
          <li key={product.id}>
            <h2>{product.title}</h2>
            <img
              src={product.images.edges[0].node.url}
              className="w-40 h-40 object-cover"
              alt={product.title}
            />
            <p>{product.description}</p>
            {product.variants.edges.map((variant: any) => (
              <div key={variant.node.id}>
                {variant.node.title} - {variant.node.priceV2.amount}{" "}
                {variant.node.priceV2.currencyCode}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
