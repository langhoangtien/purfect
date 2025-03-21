import ReviewForm from "../review-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ReviewForm id={id} />;
}
