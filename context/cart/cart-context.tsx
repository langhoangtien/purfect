"use client";
import { createContext, useEffect, useState, ReactNode } from "react";

export interface Product {
  image: string;
  quantity: number;
  name: string;
  price: number;
  id: string;
  title: string;
  special?: boolean;
  compareAtPrice?: number;
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
  addProducts: (products: Product[]) => void;
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
  addProducts: () => {},
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

  const addProducts = (items: Product[]) => {
    const grouped: Record<string, Product> = {};

    // Đầu tiên add các sản phẩm cũ vào grouped
    for (const product of products) {
      grouped[product.id] = { ...product };
    }

    // Tiếp theo gộp sản phẩm mới, nếu trùng id thì cộng quantity
    for (const item of items) {
      if (grouped[item.id]) {
        grouped[item.id].quantity += item.quantity;
      } else {
        grouped[item.id] = { ...item };
      }
    }

    const newProducts = Object.values(grouped);
    setProducts(newProducts);
    setSheet(true);
  };

  const subtotal = (() => {
    let normalTotal = 0;
    let specialTotal = 0;
    let specialCount = 0;

    for (const p of products) {
      const itemTotal = p.price * p.quantity;
      if (p.special) {
        specialTotal += itemTotal;
        specialCount += p.quantity;
      } else {
        normalTotal += itemTotal;
      }
    }

    let discount = 0;
    if (specialCount >= 3) {
      discount = 0.2;
    } else if (specialCount === 2) {
      discount = 0.1;
    }

    const discountedSpecialTotal = specialTotal * (1 - discount);
    return normalTotal + discountedSpecialTotal;
  })();

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
        addProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
