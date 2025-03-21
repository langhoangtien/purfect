import { getProducts, Product, ProductVariant } from "@/lib/shopify";

import Image from "next/image";
import Link from "next/link";

const ProductsPage = async () => {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold my-4">🎯 Product</h1>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 ">
        {products.map((product: Product) => (
          <li
            className="flex flex-col space-y-4 shadow-sm p-2"
            key={product.id}
          >
            <Image
              width={160}
              height={160}
              src={product.images.edges[0].node.url}
              className="w-full aspect-square object-cover rounded-xl"
              alt={product.title}
            />
            <Link
              className="font-semibold"
              href={`/products/${product.handle}`}
            >
              {product.title}
            </Link>
            <div className="flex flex-wrap gap-2">
              {product.variants.edges.map(
                (variant: { node: ProductVariant }) => (
                  <div key={variant.node.id}>
                    {variant.node.title} - {variant.node.priceV2.amount}{" "}
                    {variant.node.priceV2.currencyCode}
                  </div>
                )
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
export const revalidate = 60;
