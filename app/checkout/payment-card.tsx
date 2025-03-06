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

const CUSTOM_CLASS =
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
const SubmitPayment = ({
  validateFields,
}: {
  validateFields: () => boolean;
}) => {
  const [paying, setPaying] = useState(false);
  const cardHolderName = useRef<HTMLInputElement>(null);
  const hostedField = usePayPalHostedFields();

  const handleClick = () => {
    if (!hostedField?.cardFields) {
      const childErrorMessage =
        "Unable to find any child components in the <PayPalHostedFieldsProvider />";
      console.log(childErrorMessage);
      return;
    }
    const isFormInvalid =
      Object.values(hostedField.cardFields.getState().fields).some(
        (field) => !field.isValid
      ) || !cardHolderName?.current?.value;

    const isValidFiels = validateFields();

    if (!isValidFiels) {
      return null;
    }
    if (isFormInvalid) {
      return alert("The payment form is invalid");
    }
    setPaying(true);
    hostedField.cardFields
      .submit({
        cardholderName: cardHolderName?.current?.value,
      })
      .then((data) => {
        // Your logic to capture the transaction
        fetch("url_to_capture_transaction", {
          method: "POST",
        })
          .then((response) => response.json())
          .then((data) => {
            // Here use the captured info
          })
          .catch((err) => {
            // Here handle error
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
      <div>
        <Label
          className="block mb-1"
          title="This represents the full name as shown in the card"
        >
          Card Holder Name
        </Label>
        <input
          id="card-holder"
          ref={cardHolderName}
          className={CUSTOM_CLASS}
          type="text"
          placeholder="Full name"
        />
      </div>
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

export default function Payment() {
  const [clientToken, setClientToken] = useState(null);
  const hostedField = usePayPalHostedFields();

  const [errors, setErrors] = useState<FormErrors>({});

  const validateFields = () => {
    const newErrors: FormErrors = {};

    const ccvError = hostedField?.cardFields?.getState().fields.cvv.isValid;
    if (!ccvError) {
      newErrors.ccv = "Invalid CCV";
    }
    const cardNumberError =
      hostedField?.cardFields?.getState().fields.number.isValid;
    if (!cardNumberError) {
      newErrors.cardNumber = "Invalid card number";
    }
    const expirationDateError =
      hostedField?.cardFields?.getState().fields.expirationDate.isValid;
    if (!expirationDateError) {
      newErrors.expirationDate = "Invalid expiration date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    (async () => {
      const response = await (
        await fetch(`${API_URL}/payment/paypal2/generate-client-token`)
      ).json();
      setClientToken(response?.clientToken || "");
    })();
  }, []);

  return (
    <>
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
            createOrder={function () {
              return fetch(`${API_URL}/payment/paypal2`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  purchase_units: [
                    {
                      amount: {
                        value: "2", // Here change the amount if needed
                        currency_code: "USD", // Here change the currency if needed
                      },
                    },
                  ],
                  intent: "capture",
                }),
              })
                .then((response) => response.json())
                .then((order) => {
                  // Your code here after create the order
                  return order.id;
                })
                .catch((err) => {
                  alert(err);
                });
            }}
          >
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
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm">Invalid card number</p>
                )}
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

                {errors.ccv && (
                  <p className="text-red-500 text-sm">Invalid CVV</p>
                )}
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
                {errors.expirationDate && (
                  <p className="text-red-500 text-sm">
                    Invalid Expiration date{" "}
                  </p>
                )}
              </div>
              <SubmitPayment validateFields={validateFields} />
            </div>
          </PayPalHostedFieldsProvider>
        </PayPalScriptProvider>
      ) : (
        <h1>Loading token...</h1>
      )}
    </>
  );
}
