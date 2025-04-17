"use client";

import useCart from "@/context/cart/use-cart";
import { Product } from "@/context/cart/cart-context";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductVariant, Product as ProductShopify } from "@/lib/shopify";
import { Badge } from "@/components/ui/badge";

export default function AddToCart(product: Product) {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
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
    compareAtPrice?: number;
  } | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

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
        compareAtPrice: parseFloat(
          matchedVariant.node.compareAtPriceV2?.amount ?? "0"
        ),
        image: matchedVariant.node.image?.url,
        quantity: 1,
        name: product.title,
      });
    }
  };

  const handleSetVariant = (id: string) => {
    const newVariant = product.variants.edges.find(
      (variant: { node: ProductVariant }) => variant.node.id === id
    );
    if (newVariant) {
      setVariant({
        id: newVariant.node.id,
        title: newVariant.node.title,
        price: parseFloat(newVariant.node.priceV2.amount),
        compareAtPrice: parseFloat(
          newVariant.node.compareAtPriceV2?.amount ?? "0"
        ),
        image: newVariant.node.image?.url,
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
        compareAtPrice: parseFloat(
          firstVariant.compareAtPriceV2?.amount ?? "0"
        ),
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
    <div>
      <div className="mt-4 rounded-lg">
        <div className=" flex space-x-3 items-center ">
          {!!variant?.compareAtPrice && (
            <span className="line-through text-xl  ">
              ${variant?.compareAtPrice ?? ""}
            </span>
          )}

          <span className="font-normal text-4xl text-accent-foreground ">
            {" "}
            ${variant?.price ?? ""}
          </span>

          <Badge>Sale</Badge>
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        <p> 🔥 24-In-1 Supplement Superblend</p>

        <p>✅ Boosts energy</p>
        <p>✅ Enhances focus</p>
        <p>✅ 2024 best seller</p>
        <p>✅ Natural ingredients</p>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {product.variants.edges.map((item: { node: ProductVariant }, index) => (
          <label
            onClick={() => handleSetVariant(item.node.id)}
            className={`flex text-background justify-between cursor-pointer items-center duration-300 transition-all rounded-full border h-[76px] py-6 px-4 border-border ${
              item.node.id === variant?.id
                ? "dark:bg-gray-300 bg-gray-900 "
                : "dark:bg-gray-100 bg-gray-600"
            }`}
            key={item.node.id}
            htmlFor={item.node.id}
          >
            <div className="flex items-center relative space-x-4">
              <RadioCustom checked={item.node.id === variant?.id} />
              <div className="space-y-0.5">
                {" "}
                <p className="text-xl ">{item.node.title}</p>
                <p className="text-sm">{(index + 1) * 2} bottles</p>
              </div>
            </div>
            <div>
              {" "}
              <p className=" text-xl">${item.node.priceV2.amount}</p>
              <p className="line-through text-gray-500 text-sm">
                ${item.node.compareAtPriceV2?.amount}
              </p>
            </div>
          </label>
        ))}
        <div className="space-y-4">
          <Button
            onClick={handleAddToCart}
            className="w-full rounded-full h-12 mt-4 text-base font-semibold"
          >
            Add To Cart | 50% OFF ➜
          </Button>
        </div>
      </div>
    </div>
  );
}

const RadioCustom = ({ checked }: { checked: boolean }) => {
  return (
    <div className="flex border-2 border-background/80 items-center  justify-center rounded-full size-6">
      <span
        className={`${checked ? "size-3 bg-accent/80" : ""} rounded-full`}
      ></span>
    </div>
  );
};
