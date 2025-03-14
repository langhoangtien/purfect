import { getProductById } from "@/lib/shopify";

type Props = {
  params: {
    id: string;
  };
};

const ProductDetailPage = async ({ params }: Props) => {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>

      {product.images.edges.map((img: any, index: number) => (
        <img key={index} src={img.node.url} width={200} />
      ))}

      <h3>💰 Giá:</h3>
      {product.variants.edges.map((variant: any) => (
        <p key={variant.node.id}>
          {variant.node.title} - {variant.node.priceV2.amount} USD
        </p>
      ))}
    </div>
  );
};

export default ProductDetailPage;
