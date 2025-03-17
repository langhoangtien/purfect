import { getProductBySlug } from "@/lib/shopify";
import { notFound } from "next/navigation";

import ProductView from "./view";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return <ProductView data={product} />;
}

export const revalidate = 60;
