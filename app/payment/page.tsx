"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { API_URL, PAYPAL_CLIENT_ID } from "@/config-global";
import { useEffect, useState } from "react";
import {
  PayPalHostedFieldsProvider,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import CardPayment, { SubmitPayment } from "./card-payment";
import PaypalButtonPayment from "./button-payment";
import Link from "next/link";
import useCart from "@/context/cart/use-cart";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type OnApproveData = {
  billingToken?: string | null;
  facilitatorAccessToken?: string;
  orderID: string;
  payerID?: string | null;
  paymentID?: string | null;
  subscriptionID?: string | null;
  authCode?: string | null;
};
interface ICart {
  products: {
    id: string;
    quantity: number;
  }[];
  voucher?: string;
  email: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    fullName: string;
    phone: string;
    address: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
}
export default function SelectPayment() {
  const [, setMessage] = useState<string>("");

  const router = useRouter();
  const cart = useCart();
  const { products, setProducts } = cart;
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [clientToken, setClientToken] = useState(null);
  const [address, setAddress] = useState<string>("");
  const [order, setOrder] = useState<ICart | null>(null);

  useEffect(() => {
    try {
      const addressJson = localStorage.getItem("deliveryAddress");
      if (!addressJson) {
        toast.error("Please provide a delivery address");
        router.push("/checkout");
        return;
      }
      const productJson = localStorage.getItem("cart");
      if (!productJson) {
        toast.error("Please add some products to the cart");
        router.push("/products");
        return;
      }
      const productsData = JSON.parse(productJson);
      const addresData = JSON.parse(addressJson);
      const billingAddressJson = localStorage.getItem("billingAddress");
      if (!billingAddressJson) {
        toast.error("Please provide a billing address");
        router.push("/checkout");
        return;
      }
      const billingAddress = JSON.parse(billingAddressJson);

      const { address, address2, city, state, postalCode, country } =
        addresData;

      // Nếu không có state, bỏ dấu phẩy phía trước
      const add = `${address2} ${address}, ${city}${
        state ? `, ${state}` : ""
      } ${postalCode ? postalCode : ""}, ${country}`.trim();

      setAddress(add);
      console.log("PRODUCTS", products);

      const orderData = {
        products: productsData.map(
          (product: { quantity: number; id: string }) => ({
            quantity: product.quantity,
            id: product.id,
          })
        ),
        email: addresData.email,
        shippingAddress: {
          ...addresData,
          phone: addresData.phone || undefined,
          fullName: [addresData.firstName, addresData.lastName]
            .filter(Boolean)
            .join(" "),
        },
        billingAddress: {
          ...billingAddress,
          phone: billingAddress.phone || undefined,
          fullName: [billingAddress.firstName, billingAddress.lastName]
            .filter(Boolean)
            .join(" "),
        },
      };
      setOrder(orderData);
      (async () => {
        const response = await (
          await fetch(`${API_URL}/payment/paypal2/generate-client-token`)
        ).json();
        setClientToken(response?.clientToken || null);
      })();
    } catch (error) {
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/payment/paypal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // use the "body" param to optionally pass additional order information
        // like product ids and quantities
        body: JSON.stringify(order),
      });

      const orderData = await response.json();

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
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onApprove = async (data: OnApproveData, actions: any) => {
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
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        const transaction = orderData.purchase_units[0].payments.captures[0];
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
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };
  return (
    <div className="bg-gray-100 max-w-7xl mx-auto flex flex-col space-y-4 rounded-2xl p-4">
      <h2 className="text-2xl font-semibold">Select Payment Method</h2>
      <p>Address</p>
      <div className="flex flex-col">
        <div className="flex border borrder-gray-300 rounded-lg p-2 justify-between items-center">
          <div>
            {" "}
            <p className="text-gray-500">Contact</p>
            <p>{order?.email}</p>
          </div>
          <Link href="/checkout" className="ml-4 underline">
            Change
          </Link>
        </div>
        <div className="flex border borrder-gray-300 rounded-lg p-2  justify-between items-center">
          <div>
            {" "}
            <p className="text-gray-500">Ship to</p>
            <p>{address}</p>
          </div>
          <Link href="/checkout" className="ml-4 underline">
            Change
          </Link>
        </div>
      </div>
      {clientToken ? (
        <PayPalScriptProvider
          options={{
            clientId: PAYPAL_CLIENT_ID,
            components: "buttons,hosted-fields",
            dataClientToken: clientToken,
            intent: "capture",
            vault: false,
          }}
        >
          <PayPalHostedFieldsProvider
            styles={{
              ".valid": { color: "#28a745" },
              ".invalid": { color: "#dc3545" },
              input: { "font-family": "monospace", "font-size": "16px" },
            }}
            createOrder={createOrder}
          >
            <RadioGroup defaultValue="card" onValueChange={setPaymentMethod}>
              <label
                htmlFor="radio-card"
                className="flex md:space-x-2 space-x-1 justify-between border    border-gray-200 p-4 rounded-lg cursor-pointer items-center"
              >
                <div className="flex space-x-2 items-center">
                  <RadioGroupItem
                    className="rounded-full"
                    id="radio-card"
                    value="card"
                  />
                  <span>Credit Card</span>
                </div>
                <ul className="flex justify-center px-2 flex-wrap gap-2 ">
                  <li>
                    <svg
                      viewBox="0 0 38 24"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      width={38}
                      height={24}
                      aria-labelledby="pi-visa"
                    >
                      <title id="pi-visa">Visa</title>
                      <path
                        opacity=".07"
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      />
                      <path
                        fill="#fff"
                        d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                      />
                      <path
                        d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z"
                        fill="#142688"
                      />
                    </svg>
                  </li>
                  <li>
                    <svg
                      viewBox="0 0 38 24"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      width={38}
                      height={24}
                      aria-labelledby="pi-master"
                    >
                      <title id="pi-master">Mastercard</title>
                      <path
                        opacity=".07"
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      />
                      <path
                        fill="#fff"
                        d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                      />
                      <circle fill="#EB001B" cx={15} cy={12} r={7} />
                      <circle fill="#F79E1B" cx={23} cy={12} r={7} />
                      <path
                        fill="#FF5F00"
                        d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"
                      />
                    </svg>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-labelledby="pi-american_express"
                      viewBox="0 0 38 24"
                      width={38}
                      height={24}
                    >
                      <title id="pi-american_express">American Express</title>
                      <path
                        fill="#000"
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"
                        opacity=".07"
                      />
                      <path
                        fill="#006FCF"
                        d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z"
                      />
                      <path
                        fill="#FFF"
                        d="M22.012 19.936v-8.421L37 11.528v2.326l-1.732 1.852L37 17.573v2.375h-2.766l-1.47-1.622-1.46 1.628-9.292-.02Z"
                      />
                      <path
                        fill="#006FCF"
                        d="M23.013 19.012v-6.57h5.572v1.513h-3.768v1.028h3.678v1.488h-3.678v1.01h3.768v1.531h-5.572Z"
                      />
                      <path
                        fill="#006FCF"
                        d="m28.557 19.012 3.083-3.289-3.083-3.282h2.386l1.884 2.083 1.89-2.082H37v.051l-3.017 3.23L37 18.92v.093h-2.307l-1.917-2.103-1.898 2.104h-2.321Z"
                      />
                      <path
                        fill="#FFF"
                        d="M22.71 4.04h3.614l1.269 2.881V4.04h4.46l.77 2.159.771-2.159H37v8.421H19l3.71-8.421Z"
                      />
                      <path
                        fill="#006FCF"
                        d="m23.395 4.955-2.916 6.566h2l.55-1.315h2.98l.55 1.315h2.05l-2.904-6.566h-2.31Zm.25 3.777.875-2.09.873 2.09h-1.748Z"
                      />
                      <path
                        fill="#006FCF"
                        d="M28.581 11.52V4.953l2.811.01L32.84 9l1.456-4.046H37v6.565l-1.74.016v-4.51l-1.644 4.494h-1.59L30.35 7.01v4.51h-1.768Z"
                      />
                    </svg>
                  </li>

                  <li>
                    <svg
                      viewBox="0 0 38 24"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      width={38}
                      height={24}
                      aria-labelledby="pi-diners_club"
                    >
                      <title id="pi-diners_club">Diners Club</title>
                      <path
                        opacity=".07"
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      />
                      <path
                        fill="#fff"
                        d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"
                      />
                      <path
                        d="M12 12v3.7c0 .3-.2.3-.5.2-1.9-.8-3-3.3-2.3-5.4.4-1.1 1.2-2 2.3-2.4.4-.2.5-.1.5.2V12zm2 0V8.3c0-.3 0-.3.3-.2 2.1.8 3.2 3.3 2.4 5.4-.4 1.1-1.2 2-2.3 2.4-.4.2-.4.1-.4-.2V12zm7.2-7H13c3.8 0 6.8 3.1 6.8 7s-3 7-6.8 7h8.2c3.8 0 6.8-3.1 6.8-7s-3-7-6.8-7z"
                        fill="#3086C8"
                      />
                    </svg>
                  </li>
                  <li>
                    <svg
                      viewBox="0 0 38 24"
                      width={38}
                      height={24}
                      role="img"
                      aria-labelledby="pi-discover"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title id="pi-discover">Discover</title>
                      <path
                        fill="#000"
                        opacity=".07"
                        d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"
                      />
                      <path
                        d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32z"
                        fill="#fff"
                      />
                      <path
                        d="M3.57 7.16H2v5.5h1.57c.83 0 1.43-.2 1.96-.63.63-.52 1-1.3 1-2.11-.01-1.63-1.22-2.76-2.96-2.76zm1.26 4.14c-.34.3-.77.44-1.47.44h-.29V8.1h.29c.69 0 1.11.12 1.47.44.37.33.59.84.59 1.37 0 .53-.22 1.06-.59 1.39zm2.19-4.14h1.07v5.5H7.02v-5.5zm3.69 2.11c-.64-.24-.83-.4-.83-.69 0-.35.34-.61.8-.61.32 0 .59.13.86.45l.56-.73c-.46-.4-1.01-.61-1.62-.61-.97 0-1.72.68-1.72 1.58 0 .76.35 1.15 1.35 1.51.42.15.63.25.74.31.21.14.32.34.32.57 0 .45-.35.78-.83.78-.51 0-.92-.26-1.17-.73l-.69.67c.49.73 1.09 1.05 1.9 1.05 1.11 0 1.9-.74 1.9-1.81.02-.89-.35-1.29-1.57-1.74zm1.92.65c0 1.62 1.27 2.87 2.9 2.87.46 0 .86-.09 1.34-.32v-1.26c-.43.43-.81.6-1.29.6-1.08 0-1.85-.78-1.85-1.9 0-1.06.79-1.89 1.8-1.89.51 0 .9.18 1.34.62V7.38c-.47-.24-.86-.34-1.32-.34-1.61 0-2.92 1.28-2.92 2.88zm12.76.94l-1.47-3.7h-1.17l2.33 5.64h.58l2.37-5.64h-1.16l-1.48 3.7zm3.13 1.8h3.04v-.93h-1.97v-1.48h1.9v-.93h-1.9V8.1h1.97v-.94h-3.04v5.5zm7.29-3.87c0-1.03-.71-1.62-1.95-1.62h-1.59v5.5h1.07v-2.21h.14l1.48 2.21h1.32l-1.73-2.32c.81-.17 1.26-.72 1.26-1.56zm-2.16.91h-.31V8.03h.33c.67 0 1.03.28 1.03.82 0 .55-.36.85-1.05.85z"
                        fill="#231F20"
                      />
                      <path
                        d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                        fill="url(#pi-paint0_linear)"
                      />
                      <path
                        opacity=".65"
                        d="M20.16 12.86a2.931 2.931 0 100-5.862 2.931 2.931 0 000 5.862z"
                        fill="url(#pi-paint1_linear)"
                      />
                      <path
                        d="M36.57 7.506c0-.1-.07-.15-.18-.15h-.16v.48h.12v-.19l.14.19h.14l-.16-.2c.06-.01.1-.06.1-.13zm-.2.07h-.02v-.13h.02c.06 0 .09.02.09.06 0 .05-.03.07-.09.07z"
                        fill="#231F20"
                      />
                      <path
                        d="M36.41 7.176c-.23 0-.42.19-.42.42 0 .23.19.42.42.42.23 0 .42-.19.42-.42 0-.23-.19-.42-.42-.42zm0 .77c-.18 0-.34-.15-.34-.35 0-.19.15-.35.34-.35.18 0 .33.16.33.35 0 .19-.15.35-.33.35z"
                        fill="#231F20"
                      />
                      <path
                        d="M37 12.984S27.09 19.873 8.976 23h26.023a2 2 0 002-1.984l.024-3.02L37 12.985z"
                        fill="#F48120"
                      />
                      <defs>
                        <linearGradient
                          id="pi-paint0_linear"
                          x1="21.657"
                          y1="12.275"
                          x2="19.632"
                          y2="9.104"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F89F20" />
                          <stop offset=".25" stopColor="#F79A20" />
                          <stop offset=".533" stopColor="#F68D20" />
                          <stop offset=".62" stopColor="#F58720" />
                          <stop offset=".723" stopColor="#F48120" />
                          <stop offset={1} stopColor="#F37521" />
                        </linearGradient>
                        <linearGradient
                          id="pi-paint1_linear"
                          x1="21.338"
                          y1="12.232"
                          x2="18.378"
                          y2="6.446"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F58720" />
                          <stop offset=".359" stopColor="#E16F27" />
                          <stop offset=".703" stopColor="#D4602C" />
                          <stop offset=".982" stopColor="#D05B2E" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </li>
                </ul>
              </label>
              <div className={paymentMethod === "card" ? "block" : "hidden"}>
                <CardPayment />
                <div className="mt-3">
                  <Label
                    className="block mb-1"
                    title="This represents the full name as shown in the card"
                  >
                    Card Holder Name
                  </Label>
                  <input
                    id="card-holder"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    type="text"
                    placeholder="Full name"
                  />
                </div>
              </div>

              <label
                htmlFor="radio-paypal"
                className="flex space-x-2 justify-between border border-gray-200 p-4 rounded-lg cursor-pointer items-center"
              >
                <div className="flex space-x-2 items-center">
                  <RadioGroupItem
                    className="rounded-full"
                    id="radio-paypal"
                    value="paypal"
                  />
                  <span>Paypal</span>
                </div>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="36"
                    height="22"
                    viewBox="0 0 256 302"
                  >
                    <path
                      fill="#27346a"
                      d="M217.168 23.507C203.234 7.625 178.046.816 145.823.816h-93.52A13.39 13.39 0 0 0 39.076 12.11L.136 259.077c-.774 4.87 2.997 9.28 7.933 9.28h57.736l14.5-91.971l-.45 2.88c1.033-6.501 6.593-11.296 13.177-11.296h27.436c53.898 0 96.101-21.892 108.429-85.221c.366-1.873.683-3.696.957-5.477q-2.334-1.236 0 0c3.671-23.407-.025-39.34-12.686-53.765"
                    />
                    <path
                      fill="#27346a"
                      d="M102.397 68.84a11.7 11.7 0 0 1 5.053-1.14h73.318c8.682 0 16.78.565 24.18 1.756a102 102 0 0 1 6.177 1.182a90 90 0 0 1 8.59 2.347c3.638 1.215 7.026 2.63 10.14 4.287c3.67-23.416-.026-39.34-12.687-53.765C203.226 7.625 178.046.816 145.823.816H52.295C45.71.816 40.108 5.61 39.076 12.11L.136 259.068c-.774 4.878 2.997 9.282 7.925 9.282h57.744L95.888 77.58a11.72 11.72 0 0 1 6.509-8.74"
                    />
                    <path
                      fill="#2790c3"
                      d="M228.897 82.749c-12.328 63.32-54.53 85.221-108.429 85.221H93.024c-6.584 0-12.145 4.795-13.168 11.296L61.817 293.621c-.674 4.262 2.622 8.124 6.934 8.124h48.67a11.71 11.71 0 0 0 11.563-9.88l.474-2.48l9.173-58.136l.591-3.213a11.71 11.71 0 0 1 11.562-9.88h7.284c47.147 0 84.064-19.154 94.852-74.55c4.503-23.15 2.173-42.478-9.739-56.054c-3.613-4.112-8.1-7.508-13.327-10.28c-.283 1.79-.59 3.604-.957 5.477"
                    />
                    <path
                      fill="#1f264f"
                      d="M216.952 72.128a90 90 0 0 0-5.818-1.49a110 110 0 0 0-6.177-1.174c-7.408-1.199-15.5-1.765-24.19-1.765h-73.309a11.6 11.6 0 0 0-5.053 1.149a11.68 11.68 0 0 0-6.51 8.74l-15.582 98.798l-.45 2.88c1.025-6.501 6.585-11.296 13.17-11.296h27.444c53.898 0 96.1-21.892 108.428-85.221c.367-1.873.675-3.688.958-5.477q-4.682-2.47-10.14-4.279a83 83 0 0 0-2.77-.865"
                    />
                  </svg>
                </span>
              </label>
            </RadioGroup>
            <div className={paymentMethod === "card" ? "block" : "hidden"}>
              <SubmitPayment />
            </div>
          </PayPalHostedFieldsProvider>
          <div
            className={paymentMethod === "paypal" ? "block w-full" : "hidden"}
          >
            {" "}
            <PaypalButtonPayment
              onApprove={onApprove}
              createOrder={createOrder}
            />
          </div>
        </PayPalScriptProvider>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
