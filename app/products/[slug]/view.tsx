"use client";

import { Button } from "@/components/ui/button";
import { Product, ProductVariant } from "@/lib/shopify";
import { useState } from "react";
import ProductDetailCarousel from "../purfect-fuel-blend/views/product-carosel";
import { toast } from "sonner";

import useCart from "@/context/cart/use-cart";

export default function ProductView(data: { data: Product }) {
  const product = data.data;
  console.log("product", product);
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  if (!product) return null;

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev: Record<string, string>) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSelectedVariantId = () => {
    const matchedVariant = product.variants.edges.find(
      (variant: { node: ProductVariant }) =>
        variant.node.selectedOptions.every(
          (opt: { name: string; value: string }) =>
            selectedOptions[opt.name] === opt.value
        )
    );
    console.log("selectedOptions", selectedOptions);

    return matchedVariant?.node.id || null;
  };
  const selectedVariantId = getSelectedVariantId();

  const handleAddToCart = () => {
    if (!selectedVariantId) {
      toast.error("Please select an option");
      return;
    }
    const variant = product.variants.edges.find(
      (variant: { node: ProductVariant }) =>
        variant.node.id === selectedVariantId
    );

    if (!variant) {
      toast.error("Variant not found");
      return;
    }
    const productCart = {
      id: variant.node.id.split("/").pop() || "",
      name: product.title,
      price: parseFloat(variant.node.priceV2.amount),
      image: variant.node.image?.url || "",
      quantity: 1,
      title: variant.node.title,
    };
    addToCart(productCart);
  };
  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hình ảnh */}
          <div>
            <ProductDetailCarousel
              slides={product.images.edges.map(
                (img: { node: { url: string } }) => img.node.url
              )}
            />
          </div>

          <div className="flex flex-col space-y-4">
            <h1 className="font-semibold text-xl">{product.title}</h1>
            <p>{product.description}</p>

            <h3 className="text-xl font-semibold">💡 Option:</h3>
            {product.options.map(
              (option: { id: string; name: string; values: string[] }) => (
                <div className="space-y-4" key={option.name}>
                  <h4>{option.name}</h4>
                  {option.values.map((value: string) => (
                    <Button
                      variant="outline"
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
              )
            )}

            {/* <h3> Price:</h3>
            {product.variants.edges.map((variant: { node: ProductVariant }) => (
              <p key={variant.node.id}>
                {variant.node.title} - {variant.node.priceV2.amount} USD
              </p>
            ))} */}

            <Button className="h-14 rounded-full" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
