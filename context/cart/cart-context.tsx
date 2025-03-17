"use client";
import { createContext, useEffect, useState, ReactNode } from "react";

export interface Product {
  image: string;
  quantity: number;
  name: string;
  price: number;
  id: string;
  title: string;
}

interface CartContextType {
  products: Product[];
  updateQuantity: (id: string, newQuantity: number) => void;
  removeProduct: (id: string) => void;
  subtotal: number;
  sheet: boolean;
  setSheet: (value: boolean) => void;
  addToCart: (product: Product) => void;
  setProducts: (products: Product[]) => void;
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType>({
  products: [],
  updateQuantity: () => {},
  removeProduct: () => {},
  subtotal: 0,
  sheet: false,
  setSheet: () => {},
  addToCart: () => {},
  setProducts: () => {},
});

export function CartProvider({ children }: CartProviderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setProducts(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(products));
  }, [products]);

  const updateQuantity = (id: string, newQuantity: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(newQuantity, 1) } : p
      )
    );
  };

  const addToCart = (product: Product) => {
    setProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity }
            : p
        );
      } else {
        return [...prev, product];
      }
    });
    setSheet(true);
  };
  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        products,
        updateQuantity,
        removeProduct,
        subtotal,
        sheet,
        setSheet,
        addToCart,
        setProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
