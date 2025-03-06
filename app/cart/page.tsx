"use client";

import { MinusIcon, PlusIcon, ShoppingCartIcon, X } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/context/cart/cart-context";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Product {
  image: string;
  quantity: number;
  name: string;
  price: number;
  id: string;
  title: string;
}

export default function Cart() {
  const cartContext = useContext(CartContext);
  const router = useRouter();
  const handleCheckout = () => {
    if (cartContext.products.length) {
      router.push("/checkout");
    }
  };
  const { products, updateQuantity, removeProduct, subtotal } = cartContext;
  const CartEmpty = () => {
    return (
      <div className="flex flex-col h-screen min-h-80 justify-center items-center  space-y-3">
        <ShoppingCartIcon strokeWidth={1} className="w-16 h-16 text-gray-500" />
        <span className="text-gray-500 text-lg">Your cart is empty</span>
        <span className="text-green-900 text-base font-semibold uppercase">
          Look like you haven’t made your choice yet
        </span>
        <Link href="/">
          <Button className="w-full rounded-full">Continue shopping</Button>
        </Link>
      </div>
    );
  };
  const CartProduct = () => {
    return (
      <div className="grid grid-cols-12 ">
        <div className="flex-1 overflow-y-auto md:col-span-8 col-span-12 p-4">
          {products.map((product: Product) => (
            <ProductCart
              key={product.id}
              {...product}
              updateQuantity={updateQuantity}
              removeProduct={removeProduct}
            />
          ))}
        </div>
        <div className="p-4 border-t font-semibold text-lg flex flex-col justify-between items-center space-y-2 bg-white sticky bottom-0 col-span-12 md:col-span-4">
          <div className="flex justify-between w-full">
            <span>Subtotal</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(subtotal)}
            </span>
          </div>

          <Button className="w-full rounded-full" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex justify-center my-2">
        {" "}
        <p className="bg-blue-100 rounded-md inline-block py-0.5">
          Running low on stock.Cart has been reserved for:{" "}
          <strong>01:55 minutes!</strong>
        </p>
      </div>

      {products.length ? <CartProduct /> : <CartEmpty />}
    </div>
  );
}

interface ProductCartProps {
  image: string;
  quantity: number;
  name: string;
  price: number;
  id: string;
  title: string;
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

const QuantityCart: React.FC<QuantityCartProps> = ({
  quantity,
  updateQuantity,
}) => {
  return (
    <div className="relative flex items-center max-w-[6rem]">
      <button
        type="button"
        onClick={() => updateQuantity(Math.max(1, quantity - 1))}
        className="border border-gray-300 rounded-s-lg p-2 h-8 hover:bg-gray-200"
      >
        <MinusIcon className="w-3 h-3 text-gray-900" />
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
