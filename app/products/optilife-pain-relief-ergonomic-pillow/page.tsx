import { getProductBySlug } from "@/lib/shopify";
import { notFound } from "next/navigation";
import ProductView from "./view";

export default async function Page() {
  const product = await getProductBySlug(
    "optilife-pain-relief-ergonomic-pillow"
  );
  console.log("Product data:", product);

  if (!product) return notFound();

  return <ProductView data={product} />;
}

export const revalidate = 60;
