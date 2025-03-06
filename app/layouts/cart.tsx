import CartIcon from "@/components/cart-icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MinusIcon, PlusIcon, X } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";
import { CartContext } from "@/context/cart/cart-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  image: string;
  quantity: number;
  name: string;
  price: number;
  id: string;
}

export default function Cart() {
  const cartContext = useContext(CartContext);
  const router = useRouter();
  const handleCheckout = () => {
    if (cartContext.products.length) {
      router.push("/checkout");
      setSheet(false);
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
            className="bg-green-900 w-full text-white px-4 py-2 rounded-md"
          >
            Checkout
          </button>
        </div>
      </div>
    );
  };
  return (
    <div>
      {" "}
      <Link href="/cart" className="relative inline-block cursor-pointer">
        <CartIcon className="size-11  text-gray-800" />
        <span className="absolute size-4 right-0 bottom-2 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">
          {products.reduce((acc: number, p: Product) => acc + p.quantity, 0)}
        </span>
      </Link>
      <Sheet onOpenChange={setSheet} open={sheet}>
        <SheetContent className="p-0 flex flex-col" side="right">
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

interface ProductCartProps {
  image: string;
  quantity: number;
  name: string;
  price: number;
  id: string;
  updateQuantity: (id: string, newQuantity: number) => void;
  removeProduct: (id: string) => void;
}

const ProductCart: React.FC<ProductCartProps> = ({
  image,
  quantity,
  name,
  price,
  id,
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
