import { Product } from "@/context/cart/cart-context";
import { MinusIcon, PlusIcon, X } from "lucide-react";
import Image from "next/image";

interface ProductCartProps extends Product {
  updateQuantity: (id: string, newQuantity: number) => void;
  removeProduct: (id: string) => void;
}

export const ProductCart: React.FC<ProductCartProps> = ({
  image,
  quantity,
  name,
  price,
  id,
  title,
  updateQuantity,
  removeProduct,
}) => {
  return (
    <div className="flex relative items-center space-x-4 border-b py-2">
      <X
        strokeWidth={1}
        className="absolute right-0.5 top-0.5 size-4 cursor-pointer"
        onClick={() => removeProduct(id)}
      />
      <div className="flex-shrink-0 size-20 md:size-28">
        <Image
          className="rounded-md  object-cover"
          alt={name}
          src={image}
          width={100}
          height={100}
        />
      </div>
      <div className="flex flex-1 text-sm justify-center space-y-2 flex-col">
        <span className="text-sm font-semibold">{name}</span>
        <span className="text-gray-500">{title}</span>
        <span className="flex text-sm justify-between font-semibold">
          <QuantityCart
            quantity={quantity}
            updateQuantity={(newQuantity) => updateQuantity(id, newQuantity)}
          />
          <span className="text-sm font-semibold">
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(price * quantity)}
          </span>
        </span>
      </div>
    </div>
  );
};

interface QuantityCartProps {
  quantity: number;
  updateQuantity: (newQuantity: number) => void;
}

export const QuantityCart: React.FC<QuantityCartProps> = ({
  quantity,
  updateQuantity,
}) => {
  return (
    <div className="relative flex items-center max-w-[6rem]">
      <button
        type="button"
        disabled={quantity === 1}
        onClick={() => updateQuantity(Math.max(1, quantity - 1))}
        className="border border-gray-300 text-gray-200 rounded-s-lg p-2 h-8 hover:bg-gray-200"
      >
        <MinusIcon
          className={`w-3 h-3 ${
            quantity === 1 ? "text-gray-500" : "text-gray-900"
          }`}
        />
      </button>
      <input
        type="text"
        value={quantity}
        readOnly
        className="border-y-[1px] border-gray-300 h-8 text-center text-gray-900 text-sm font-normal w-full py-2.5"
      />
      <button
        type="button"
        onClick={() => updateQuantity(quantity + 1)}
        className="border border-gray-300 rounded-e-lg p-2 h-8 hover:bg-gray-200"
      >
        <PlusIcon className="w-3 h-3 text-gray-900" />
      </button>
    </div>
  );
};
