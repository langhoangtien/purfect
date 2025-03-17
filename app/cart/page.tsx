"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useContext, useState } from "react";
import { CartContext } from "@/context/cart/cart-context";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { UKOSplashScreen } from "@/components/splash-screen";
import { ProductCart } from "./view";

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

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const cartItems = products.map((product: Product) => ({
        id: product.id,
        quantity: product.quantity,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
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
  if (isLoading) return <UKOSplashScreen />;
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
