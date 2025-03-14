"use client";
import { CartItem, createCheckoutOnShopify } from "./component";

export default function Checkout2Page() {
  const handleCheckout = async () => {
    const cartItems: CartItem[] = [
      { variantId: "45907128844529", quantity: 2 },
    ];

    const checkoutUrl = await createCheckoutOnShopify(cartItems);
    if (checkoutUrl) {
      window.location.href = checkoutUrl; // Redirect sang Shopify
    }
  };
  return <button onClick={handleCheckout}>checkout</button>;
}
