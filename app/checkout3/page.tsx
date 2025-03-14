"use client";
import React from "react";

const Cart = () => {
  const handleCheckout = async () => {
    const cartItems = [{ variantId: "45907128844529", quantity: 2 }];

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems }),
    });

    const data = await res.json();
    console.log("DATA", data);

    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl; // Redirect sang Shopify
    }
  };

  return <button onClick={handleCheckout}>Thanh toán với Shopify</button>;
};

export default Cart;
