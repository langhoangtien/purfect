"use client";

import useCart from "@/context/cart/use-cart";
import { Product } from "@/context/cart/cart-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductVariant, Product as ProductShopify } from "@/lib/shopify";

export default function AddToCart(product: Product) {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    console.log("Add to cart", product);

    addToCart(product);
  };
  return (
    <Button
      onClick={handleAddToCart}
      className="w-full rounded-full h-12 text-base font-semibold"
    >
      Add To Cart | 50% OFF ➜
    </Button>
  );
}

export function AddToCartPurfectSection({
  product,
}: {
  product: ProductShopify;
}) {
  const { addToCart } = useCart();
  const [variant, setVariant] = useState<{
    id: string;
    title: string;
    price: number;
    image?: string;
    quantity: number;
    name: string;
  } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev: Record<string, string>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!variant) {
      toast.error("Please select a variant");
      return;
    }

    const id = variant.id.split("/").pop();
    if (!id) {
      toast.error("Invalid variant id");
      return;
    }
    addToCart({
      ...variant,
      id,
      image: variant.image || "",
    });
  };

  const getSelectedVariant = () => {
    const matchedVariant = product.variants.edges.find(
      (variant: { node: ProductVariant }) =>
        variant.node.selectedOptions.every(
          (opt: { name: string; value: string }) =>
            selectedOptions[opt.name] === opt.value
        )
    );
    if (matchedVariant) {
      setVariant({
        id: matchedVariant.node.id,
        title: matchedVariant.node.title,
        price: parseFloat(matchedVariant.node.priceV2.amount),
        image: matchedVariant.node.image?.url,
        quantity: 1,
        name: product.title,
      });
    }
  };

  // Chọn sẵn variant đầu tiên
  useEffect(() => {
    const firstVariant = product.variants.edges[0]?.node;

    if (firstVariant) {
      const defaultOptions = firstVariant.selectedOptions.reduce(
        (
          acc: Record<string, string>,
          option: {
            name: string;
            value: string;
          }
        ) => {
          acc[option.name] = option.value;
          return acc;
        },
        {}
      );

      setSelectedOptions(defaultOptions);
      setVariant({
        id: firstVariant.id,
        title: firstVariant.title,
        price: parseFloat(firstVariant.priceV2.amount),
        image: firstVariant.image?.url,
        quantity: 1,
        name: product.title,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Khi user chọn option, tự động cập nhật lại variant
  useEffect(() => {
    getSelectedVariant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);
  return (
    <div className="space-y-4">
      {product.options.map((option: { name: string; values: string[] }) => (
        <div className="mt-6 flex flex-col space-y-4" key={option.name}>
          <h4>{option.name}</h4>
          {option.values.map((value: string) => (
            <Button
              variant={"outline"}
              key={value}
              onClick={() => handleOptionChange(option.name, value)}
              className={`w-full rounded-full h-12 text-base font-normal ${
                selectedOptions[option.name] === value
                  ? "border-2 border-gray-800"
                  : "border-gray-300"
              }`}
            >
              {value}
            </Button>
          ))}
        </div>
      ))}

      <Button
        onClick={handleAddToCart}
        className="w-full rounded-full h-12 text-base font-semibold"
      >
        Add To Cart | 50% OFF ➜
      </Button>
    </div>
  );
}
