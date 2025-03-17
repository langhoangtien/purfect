/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

interface PaymentProps {
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
}

export default function PaypalButtonPayment({
  createOrder,
  onApprove,
}: PaymentProps) {
  return (
    <div className="App">
      <PayPalButtons
        style={{
          shape: "rect",
          layout: "vertical",
          color: "blue",
          label: "checkout",
          disableMaxWidth: false,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </div>
  );
}
