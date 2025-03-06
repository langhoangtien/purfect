"use client";
import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { API_URL, PAYPAL_CLIENT_ID } from "@/config-global";
import { useRouter } from "next/navigation";
import useCart from "@/context/cart/use-cart";

// Renders errors or successfull transactions on the screen.
function Message({ content }: { content: string }) {
  return <p>{content}</p>;
}

interface PaymentProps {
  voucher?: string;
  products: {
    slug: string;
    id: string;
    attributes: { title: string };
    quantity: number;
  }[];
}

export default function Payment({ voucher, products }: PaymentProps) {
  const cartContext = useCart();
  const { setProducts } = cartContext;
  const router = useRouter();
  const initialOptions = {
    clientId: PAYPAL_CLIENT_ID,
    "enable-funding": "venmo",
    "disable-funding": "",
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  const [message, setMessage] = useState("");

  return (
    <div className="App">
      <PayPalButtons
        style={{
          shape: "rect",
          layout: "vertical",
          color: "gold",
          label: "paypal",
        }}
        createOrder={async () => {
          try {
            const response = await fetch(`${API_URL}/payment/paypal`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              // use the "body" param to optionally pass additional order information
              // like product ids and quantities
              body: JSON.stringify({
                products: products.map((product) => ({
                  slug: product.slug,
                  quantity: product.quantity,
                  attributes: { title: product.attributes.title },
                  id: product.id,
                })),
                voucher,
              }),
            });

            const orderData = await response.json();
            console.log("orderData", orderData);

            if (orderData.id) {
              return orderData.id;
            } else {
              const errorDetail = orderData?.details?.[0];
              const errorMessage = errorDetail
                ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                : JSON.stringify(orderData);

              throw new Error(errorMessage);
            }
          } catch (error) {
            console.error(error);
            setMessage(`Could not initiate PayPal Checkout...${error}`);
          }
        }}
        onApprove={async (data, actions) => {
          try {
            const response = await fetch(
              `${API_URL}/payment/paypal/${data.orderID}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const orderData = await response.json();
            // Three cases to handle:
            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            //   (2) Other non-recoverable errors -> Show a failure message
            //   (3) Successful transaction -> Show confirmation or thank you message

            const errorDetail = orderData?.details?.[0];

            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
              // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
              return actions.restart();
            } else if (errorDetail) {
              // (2) Other non-recoverable errors -> Show a failure message
              throw new Error(
                `${errorDetail.description} (${orderData.debug_id})`
              );
            } else {
              // (3) Successful transaction -> Show confirmation or thank you message
              // Or go to another URL:  actions.redirect('thank_you.html');
              const transaction =
                orderData.purchase_units[0].payments.captures[0];
              setMessage(
                `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
              );
              console.log(
                "Capture result",
                orderData,
                JSON.stringify(orderData, null, 2)
              );
            }
            setProducts([]);
            router.push("/order-complete");
          } catch (error) {
            console.error(error);
            setMessage(
              `Sorry, your transaction could not be processed...${error}`
            );
          }
        }}
      />

      <Message content={message} />
    </div>
  );
}
