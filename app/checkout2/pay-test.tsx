import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  PayPalScriptProvider,
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  usePayPalHostedFields,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import { API_URL, PAYPAL_CLIENT_ID } from "@/config-global";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  address: string;
  apartment?: string;
  postalCode: string;
  city: string;
  phone: string;
};

export default function Paymenttest() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [formError, setFormError] = useState<string | null>(null);
  const [clientToken, setClientToken] = useState(null);
  useEffect(() => {
    (async () => {
      const response = await (
        await fetch(`${API_URL}/payment/paypal2/generate-client-token`)
      ).json();
      setClientToken(response?.clientToken || null);
    })();
  }, []);
  async function validateForm() {
    const isValid = await trigger();
    if (!isValid) setFormError("Please fill in all required fields.");
    else setFormError(null);
    return isValid;
  }

  async function createOrder(): Promise<any> {
    const valid = await validateForm();
    if (!valid) return;

    const customerInfo = getValues();
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: [{ sku: "1blwyeo8", quantity: 2 }],
        customer: customerInfo,
      }),
    });

    const data = await response.json();
    return data.id;
  }

  if (!clientToken) return <p>Loading...</p>;
  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        components: "buttons,hosted-fields",
        dataClientToken: clientToken,
        intent: "capture",
        vault: false,
      }}
    >
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Delivery Information
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            error={errors.firstName}
            {...register("firstName", { required: "First Name is required" })}
          />
          <Input
            label="Last Name"
            error={errors.lastName}
            {...register("lastName", { required: "Last Name is required" })}
          />
        </div>

        <Input
          label="Email"
          type="email"
          error={errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: /^\S+@\S+$/i,
          })}
        />
        <Input
          label="Country"
          error={errors.country}
          {...register("country", { required: "Country is required" })}
        />
        <Input
          label="Address"
          error={errors.address}
          {...register("address", { required: "Address is required" })}
        />
        <Input
          label="Apartment, suite, etc. (Optional)"
          {...register("apartment")}
        />
        <Input
          label="Postal Code"
          error={errors.postalCode}
          {...register("postalCode", { required: "Postal Code is required" })}
        />
        <Input
          label="City"
          error={errors.city}
          {...register("city", { required: "City is required" })}
        />
        <Input
          label="Phone"
          type="tel"
          error={errors.phone}
          {...register("phone", { required: "Phone is required" })}
        />

        {/* Payment Method */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-700">Payment Method</h3>
          <div className="flex gap-4">
            <RadioButton
              label="Credit Card"
              value="card"
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
            <RadioButton
              label="PayPal"
              value="paypal"
              selected={paymentMethod}
              onChange={setPaymentMethod}
            />
          </div>
        </div>

        {formError && <p className="text-red-500 text-sm">{formError}</p>}

        {paymentMethod === "card" ? (
          <PayPalHostedFieldsProvider createOrder={createOrder}>
            <div className="space-y-4">
              <PayPalHostedField
                hostedFieldType="number"
                options={{
                  selector: "#card-number",
                  placeholder: "Card Number",
                }}
                className="input-field"
              />
              <PayPalHostedField
                hostedFieldType="expirationDate"
                options={{ selector: "#expiration-date", placeholder: "MM/YY" }}
                className="input-field"
              />
              <PayPalHostedField
                hostedFieldType="cvv"
                options={{ selector: "#cvv", placeholder: "CVV" }}
                className="input-field"
              />
              <SubmitCardPayment />
            </div>
          </PayPalHostedFieldsProvider>
        ) : (
          <PayPalButtons createOrder={createOrder} />
        )}
      </form>
    </PayPalScriptProvider>
  );
}

// 📌 Input Component với Tailwind
const Input = ({
  label,
  error,
  ...props
}: {
  label: string;
  error?: any;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

// 📌 Radio Button Component
const RadioButton = ({
  label,
  value,
  selected,
  onChange,
}: {
  label: string;
  value: string;
  selected: string;
  onChange: (val: "card" | "paypal") => void;
}) => (
  <label
    className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
      selected === value ? "border-blue-500 bg-blue-100" : "border-gray-300"
    }`}
  >
    <input
      type="radio"
      value={value}
      checked={selected === value}
      onChange={() => onChange(value as "card" | "paypal")}
      className="hidden"
    />
    <span className="text-gray-700">{label}</span>
  </label>
);

// 📌 Submit Button for Hosted Fields
const SubmitCardPayment = () => {
  const hostedFields = usePayPalHostedFields();
  const [cardError, setCardError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!hostedFields || !hostedFields.cardFields) {
      setCardError("PayPal Hosted Fields not available.");
      return;
    }

    const formState = await hostedFields.cardFields.getState();
    if (!formState?.isFormValid) {
      setCardError("Credit card form is invalid.");
      return;
    }

    setCardError(null);
    hostedFields.cardFieldssubmit().catch(() => {
      setCardError("Payment failed.");
    });
  };

  return (
    <div className="space-y-2">
      {cardError && <p className="text-red-500 text-sm">{cardError}</p>}
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={handleClick}
      >
        Pay with Credit Card
      </button>
    </div>
  );
};
