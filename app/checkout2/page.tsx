"use client";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { CartContext } from "@/context/cart/cart-context";

import { Label } from "@/components/ui/label";

import { API_URL } from "@/config-global";

import { SelectPayment } from "./component";

import { COUNTRIES } from "@/lib/contanst";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Paymenttest from "./pay-test";

// Định nghĩa kiểu dữ liệu cho form
interface DeliveryForm {
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode?: string;
  phone: string;
  shippingMethod: "free" | "priority";
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  cardNumber?: string;
  ccv?: string;
  expirationDate?: string;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  country: string;
  discountCode: string;
}

export default function CheckoutForm() {
  const cartContext = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const { products, subtotal } = cartContext;
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>();
  const [rating] = useState<number>(0);

  const onSubmit = (data: FormData) => {
    console.log({ ...data, rating });
    alert("Checkout submitted successfully!");
  };

  const [isFormValid, setIsFormValid] = useState(false);

  async function validateForm() {
    const isValid = await trigger();
    setIsFormValid(isValid);
    return isValid;
  }
  // Tạo đơn hàng PayPal
  async function createOrder(): Promise<string | void> {
    const valid = await validateForm();
    if (!valid) {
      return;
    }

    // 📌 Lấy thông tin khách hàng từ form
    const customerInfo = getValues();

    // 📨 Gửi thông tin lên backend khi tạo đơn hàng
    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: [{ sku: "1blwyeo8", quantity: 2 }],
        customer: customerInfo, // ✅ Gửi thông tin khách hàng lên backend
      }),
    });

    const data = await response.json();
    return data.id;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-8">
        <div className="space-y-6 col-span-12 md:col-span-7 mt-4">
          {/* Delivery Section */}
          <div className="border p-4 rounded-md space-y-3 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Delivery</h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-4 border rounded-xl shadow-md col-span-12 md:col-span-7  "
            >
              <h1 className="text-center text-2xl font-bold mb-4">
                Express Checkout
              </h1>
              <div className="space-y-4">
                <div>
                  <Input
                    className={errors.email ? "border-red-500" : ""}
                    id="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="Email"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <select
                      {...register("country", {
                        required: "Country is required",
                      })}
                      className="peer p-4 pe-9 block w-full border-gray-200 border  rounded-lg text-sm focus:border-gray-500  disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
  focus:pt-6
  focus:pb-2
  [&:not(:placeholder-shown)]:pt-6
  [&:not(:placeholder-shown)]:pb-2
  autofill:pt-6
  autofill:pb-2"
                    >
                      <option value="" disabled hidden>
                        Select your country
                      </option>
                      <option value="US">United States</option>
                      <option value="DK">Denmark</option>
                      <option value="SE">Sweden</option>
                      <option value="FI">Finland</option>
                    </select>
                    <label
                      className="absolute top-0 start-0 p-4 h-full truncate pointer-events-none transition ease-in-out duration-100 border border-transparent  peer-disabled:opacity-50 peer-disabled:pointer-events-none
    peer-focus:text-xs
    peer-focus:-translate-y-1.5
    peer-focus:text-gray-500 
    peer-[:not(:placeholder-shown)]:text-xs
    peer-[:not(:placeholder-shown)]:-translate-y-1.5
    peer-[:not(:placeholder-shown)]:text-gray-500 "
                    >
                      Country
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      className={errors.firstName ? "border-red-500" : ""}
                      id="firstName"
                      {...register("firstName")}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Input
                      className={errors.lastName ? "border-red-500" : ""}
                      id="lastName"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      placeholder="Last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    className={errors.address ? "border-red-500" : ""}
                    {...register("address", {
                      required: "Address is required",
                    })}
                    placeholder="Address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Input
                      className={errors.city ? "border-red-500" : ""}
                      {...register("city", { required: "City is required" })}
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      className={errors.state ? "border-red-500" : ""}
                      {...register("state", { required: "State is required" })}
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      className={errors.zipCode ? "border-red-500" : ""}
                      {...register("zipCode", {
                        required: "ZIP code is required",
                      })}
                      placeholder="ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    className={errors.phone ? "border-red-500" : ""}
                    {...register("phone", { required: "Phone is required" })}
                    placeholder="Phone"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <Paymenttest />
              {/* <SelectPayment
                createOrder={createOrder}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                products={products}
              /> */}
              <div className="flex justify-between mt-6">
                <Button variant="outline" type="button">
                  Return to cart
                </Button>
                <Button type="submit" className="bg-yellow-400 text-black">
                  Continue to shipping
                </Button>
              </div>
            </form>
          </div>
          <h2 className="text-lg font-semibold mb-2">Payment</h2>
        </div>
        <div className="col-span-12 md:col-span-5 px-8 flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            {" "}
            <p className="text-center font-semibold">Free Shipping Unlocked!</p>
            <div className="h-3 w-full  rounded-md bg-green-800"></div>
          </div>

          <div className="flex flex-col space-y-2">
            {products.map((product) => (
              <ProductCart key={product.id} {...product} />
            ))}
          </div>
          <div className="flex w-full space-x-2">
            <input
              className="flex-1 h-10 border ps-2 rounded-md border-gray-200"
              placeholder="Discount"
            ></input>
            <Button variant="outline">Apply</Button>
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <div className="flex w-full space-x-2 justify-between">
              <p>Subtotal</p>
              <p>
                {" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(subtotal)}
              </p>
            </div>
            <div className="flex w-full space-x-2 justify-between">
              <p>Shipping</p>
              <p>FREE</p>
            </div>
            <div className="flex w-full space-x-2 justify-between">
              <p className="font-semibold text-lg">Total</p>
              <p className="font-semibold text-lg">
                {" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(subtotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductCartProps {
  image: string;
  quantity: number;
  name: string;
  price: number;
  id: string;
}

const ProductCart: React.FC<ProductCartProps> = ({
  image,
  quantity,
  name,
  price,
}) => {
  return (
    <div className="flex relative space-x-4 border-b items-center justify-between py-2">
      <div className="flex space-x-4 items-center">
        <img
          className="rounded-md md:size-16 size-12  object-contain"
          alt={name}
          src={image}
        />
        <div className="flex flex-1 justify-center space-y-4 flex-col">
          <span className="text-sm font-normal line-clamp-2">{name}</span>
        </div>
      </div>
      <span className="text-sm font-semibold">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price * quantity)}
      </span>
    </div>
  );
};
