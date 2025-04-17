import CartIcon from "@/components/cart-icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/context/cart/cart-context";
import Link from "next/link";
import { QuantityCart } from "../cart/view";

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

  const handleCheckout = async () => {
    const cartItems = cartContext.products.map((product) => ({
      id: product.id,
      quantity: product.quantity,
    }));

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems }),
    });

    const data = await res.json();

    if (data.checkoutUrl) {
      setSheet(false); // Đóng giỏ hàng
      window.location.href = data.checkoutUrl; // Redirect sang Shopify Checkout
    }
  };
  const { products, updateQuantity, removeProduct, subtotal, sheet, setSheet } =
    cartContext;
  const CartEmpty = () => {
    return (
      <div className="flex flex-col justify-center items-center h-full space-y-2">
        <span className="text-gray-500 text-lg">Your cart is empty</span>
        <span className="text-green-900 text-base font-semibold uppercase">
          Shop Our Best sellers
        </span>
      </div>
    );
  };
  const CartProduct = () => {
    return (
      <div className="flex flex-col h-full">
        <span className="bg-sky-100 w-full text-center font-medium p-4">
          This Product Is In Demand! We Have Reserved It In Your Cart For 05:30
        </span>
        <div className="flex-1 overflow-y-auto p-4">
          {products.map((product: Product) => (
            <ProductCart
              key={product.id}
              {...product}
              updateQuantity={updateQuantity}
              removeProduct={removeProduct}
            />
          ))}
        </div>
        <div className="p-4 border-t font-semibold text-lg flex flex-col justify-between items-center space-y-2 bg-white sticky bottom-0">
          <div className="flex justify-between w-full">
            <span>Subtotal</span>
            <span>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(subtotal)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="bg-green-900 w-full text-white px-4 py-2 rounded-full"
          >
            Checkout
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="p-4">
      {" "}
      <Link href="/cart" className="relative inline-block cursor-pointer">
        <CartIcon className="size-11  text-gray-800" />
        <span className="absolute size-4 right-0 bottom-2 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">
          {products.reduce((acc: number, p: Product) => acc + p.quantity, 0)}
        </span>
      </Link>
      <Sheet onOpenChange={setSheet} open={sheet}>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="p-4">
              Cart{" "}
              {!!products.length && (
                <span className="text-gray-500">{products.length}</span>
              )}
            </SheetTitle>
          </SheetHeader>
          {products.length ? <CartProduct /> : <CartEmpty />}
          <SheetFooter>
            <SheetClose asChild></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface ProductCartProps extends Product {
  updateQuantity: (id: string, newQuantity: number) => void;
  removeProduct: (id: string) => void;
}

const ProductCart: React.FC<ProductCartProps> = ({
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
    <div className="flex relative space-x-4 border-b py-2">
      <X
        strokeWidth={1}
        className="absolute right-0 top-0 size-4 cursor-pointer"
        onClick={() => removeProduct(id)}
      />
      <Image
        className="rounded-md object-cover"
        alt={name}
        src={image}
        width={100}
        height={100}
      />
      <div className="flex flex-1 justify-center space-y-4 flex-col">
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
