import { useContext } from "react";
import { CartContext } from "./cart-context"; // Adjust the import path as necessary

const useCart = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const {
    products,
    updateQuantity,
    removeProduct,
    subtotal,
    sheet,
    setSheet,
    addToCart,
    setProducts,
  } = cartContext;

  return {
    products,
    updateQuantity,
    removeProduct,
    subtotal,
    sheet,
    setSheet,
    addToCart,
    setProducts,
  };
};

export default useCart;
