import { getProductBySlug } from "@/lib/shopify";
import { notFound } from "next/navigation";
import ProductView from "./view";

export default async function Page() {
  const product = await getProductBySlug(
    "optilifetech-pain-relief-ergonomic-pillow"
  );
  if (!product) return notFound();

  return <ProductView data={product} />;
}

export const revalidate = 60;
