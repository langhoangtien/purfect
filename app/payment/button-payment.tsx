"use client";
import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

// Renders errors or successfull transactions on the screen.
function Message({ content }: { content: string }) {
  return <p>{content}</p>;
}

interface PaymentProps {
  createOrder: (data: any, actions: any) => Promise<string>;
  onApprove: (data: any, actions: any) => Promise<void>;
}

export default function PaypalButtonPayment({
  createOrder,
  onApprove,
}: PaymentProps) {
  const [message, setMessage] = useState("");

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

      <Message content={message} />
    </div>
  );
}
