import CartIcon from "@/components/cart-icon";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TagIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";
import { CartContext, Product } from "@/context/cart/cart-context";

import { QuantityCart } from "../cart/view";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

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
      setSheet(false);
      window.location.href = data.checkoutUrl;
    }
  };
  const { products, updateQuantity, removeProduct, subtotal, sheet, setSheet } =
    cartContext;
  const CartEmpty = () => {
    return (
      <div className="flex flex-col justify-center items-center h-full space-y-2">
        <span className="text-gray-500 text-lg">Din varukorg är tom</span>
        <span className="text-green-900 text-base font-semibold uppercase">
          Utforska våra bästsäljare
        </span>
      </div>
    );
  };
  const CartProduct = () => {
    const tottalSpecial = products.reduce(
      (acc: number, p: Product) => acc + (p.special ? p.quantity : 0),
      0
    );

    return (
      <div className="flex flex-col h-full">
        <span className=" w-full text-center text-sm p-4">
          Grattis! Du får <strong>FRI</strong> frakt
        </span>
        <div className="justify-center flex">
          <span className="bg-yellow-400 w-[90%] px-4 h-2 mb-8 rounded-md"></span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {products.map((product: Product) => (
            <ProductCart
              key={product.id}
              {...product}
              updateQuantity={updateQuantity}
              removeProduct={removeProduct}
              tottalSpecial={tottalSpecial}
            />
          ))}
        </div>
        <div className="p-4 border-t font-semibold text-lg flex flex-col justify-between items-center space-y-2 bg-white sticky bottom-0">
          <div className="flex justify-between w-full">
            <span>Delsumma</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <Button className="w-full" onClick={handleCheckout}>
            Till kassan
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div
        onClick={() => cartContext.setSheet(true)}
        className="relative inline-block cursor-pointer"
      >
        <CartIcon className="size-11 text-gray-800" />
        <span className="absolute size-4 right-0 bottom-2 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center">
          {products.reduce((acc: number, p: Product) => acc + p.quantity, 0)}
        </span>
      </div>
      <Sheet onOpenChange={setSheet} open={sheet}>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="p-4">
              Varukorg{" "}
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
  tottalSpecial: number;
}

const ProductCart: React.FC<ProductCartProps> = ({
  image,
  quantity,
  name,
  price,
  compareAtPrice,
  id,
  title,
  updateQuantity,
  removeProduct,
  tottalSpecial,
}) => {
  return (
    <div className="flex relative space-x-4 border-b pt-6 pb-2">
      <Trash2Icon
        strokeWidth={1}
        className="absolute right-0 top-0.5 size-4 cursor-pointer"
        onClick={() => removeProduct(id)}
      />
      <Image
        className="rounded-md size-[80px] md:size-[100px] object-cover"
        alt={name}
        src={image}
        width={100}
        height={100}
      />
      <div className="flex flex-1 justify-center space-y-4 flex-col">
        <span className="text-sm font-semibold line-clamp-1">{name}</span>
        <span className="text-gray-500">{title}</span>
        <span className="flex text-sm justify-between font-semibold">
          <QuantityCart
            quantity={quantity}
            updateQuantity={(newQuantity) => updateQuantity(id, newQuantity)}
          />
          <div className="flex items-center flex-col space-y-2">
            <div className="flex space-x-2">
              {!!compareAtPrice && (
                <span className="text-sm line-through text-gray-500">
                  {formatCurrency(compareAtPrice * quantity)}
                </span>
              )}

              <span className="text-sm font-semibold">
                {formatCurrency(price * quantity * getExtra(tottalSpecial))}
              </span>
            </div>
            {!!compareAtPrice && (
              <span className="text-sm text-green-500">
                {"SPARA ("}
                {formatCurrency(
                  compareAtPrice * quantity -
                    price * quantity * getExtra(tottalSpecial)
                )}
                {")"}
              </span>
            )}
            <span>{getNameSpecial(tottalSpecial)}</span>{" "}
          </div>
        </span>
      </div>
    </div>
  );
};

const getExtra = (totalSpecial: number) => {
  if (totalSpecial === 2) return 0.9;
  if (totalSpecial >= 3) return 0.8;
  return 1;
};
const getNameSpecial = (totalSpecial: number) => {
  if (totalSpecial === 2)
    return (
      <Button className="h-6" variant="outline">
        <TagIcon /> Köp 2 kuddar
      </Button>
    );
  if (totalSpecial >= 3)
    return (
      <Button className="h-6" variant="outline">
        <TagIcon /> Familjepaket (3 kuddar)
      </Button>
    );
  return null;
};
