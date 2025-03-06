import { useState, useEffect, useRef } from "react";
import {
  PayPalScriptProvider,
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  usePayPalHostedFields,
} from "@paypal/react-paypal-js";
import { API_URL, PAYPAL_CLIENT_ID } from "@/config-global";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Circle, CircleHelpIcon, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import useCart from "@/context/cart/use-cart";

export const CUSTOM_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";
const INVALID_COLOR = {
  color: "#dc3545",
};

interface FormErrors {
  holderName?: string;
  cardNumber?: string;
  ccv?: string;
  expirationDate?: string;
}

// Example of custom component to handle form submit
export const SubmitPayment = () => {
  const [paying, setPaying] = useState(false);
  const router = useRouter();
  const cart = useCart();
  const { setProducts } = cart;
  const hostedField = usePayPalHostedFields();

  const handleClick = () => {
    const cardHolderName = (
      document.getElementById("card-holder") as HTMLInputElement
    )?.value;
    if (!hostedField?.cardFields) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalHostedFieldsProvider />";
      console.log(childErrorMessage);
      return;
    }
    const isFormInvalid =
      Object.values(hostedField.cardFields.getState().fields).some(
        (field) => !field.isValid
      ) || !cardHolderName;

    if (isFormInvalid) {
      return alert("The payment form is invalid");
    }
    setPaying(true);
    hostedField.cardFields
      .submit({
        cardholderName: cardHolderName,
      })
      .then((data) => {
        // Your logic to capture the transaction
        fetch(`${API_URL}/payment/paypal/${data.orderId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "COMPLETED") {
              setProducts([]);
              router.push("/order-complete");
            }
          })
          .catch((err) => {
            console.log("Error:", err);
          })
          .finally(() => {
            setPaying(false);
          });
      })
      .catch((err) => {
        // Here handle error
        setPaying(false);
      });
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleClick}
        disabled={paying}
        type="submit"
        className="my-2 w-full bg-yellow-400 text-black hover:bg-yellow-300"
      >
        {paying && <Loader2 className="animate-spin" />} Payment
      </Button>
    </div>
  );
};

export default function CardPayment() {
  const [cardHolderName, setCardHolderName] = useState<string>("");

  return (
    <>
      <div className="space-y-4 mt-4">
        <div>
          <Label className="block mb-1" htmlFor="card-number">
            Card Number
            <span style={INVALID_COLOR}>*</span>
          </Label>
          <div className="relative">
            <PayPalHostedField
              id="card-number"
              className={CUSTOM_CLASS}
              hostedFieldType="number"
              options={{
                selector: "#card-number",
                placeholder: "4111 1111 1111 1111",
              }}
            />
            <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div>
          <Label className="block mb-1" htmlFor="cvv">
            CVV<span style={INVALID_COLOR}>*</span>
          </Label>

          <div className="relative">
            <PayPalHostedField
              id="cvv"
              className={CUSTOM_CLASS}
              hostedFieldType="cvv"
              options={{
                selector: "#cvv",
                placeholder: "123",
                maskInput: true,
              }}
            />
            <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
              <CircleHelpIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        <div>
          <Label className="block mb-1" htmlFor="expiration-date">
            Expiration Date
            <span style={INVALID_COLOR}>*</span>
          </Label>
          <div className="relative">
            <PayPalHostedField
              id="expiration-date"
              className={CUSTOM_CLASS}
              hostedFieldType="expirationDate"
              options={{
                selector: "#expiration-date",
                placeholder: "MM/YYYY",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
