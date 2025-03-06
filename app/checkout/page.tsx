"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CartContext } from "@/context/cart/cart-context";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { get } from "http";

interface FormData {
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  country: string;
  discountCode: string;
  billing_first_name: string;
  billing_last_name: string;
  billing_address1: string;
  billing_address2: string;
  billing_company_name: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_phone: string;
  billing_country: string;
}

export default function CheckoutForm() {
  const cartContext = useContext(CartContext);
  const [sameAsDelivery, setSameAsDelivery] = useState("yes");

  const router = useRouter();
  const { products, subtotal } = cartContext;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();
  const [rating] = useState<number>(0);

  const onSubmit = (data: FormData) => {
    localStorage.setItem("deliveryAddress", JSON.stringify(data));
    if (sameAsDelivery === "yes") {
      localStorage.setItem("billingAddress", JSON.stringify(data));
    } else {
      const billingData = {
        first_name: data.billing_first_name,
        last_name: data.billing_last_name,
        address1: data.billing_address1,
        address2: data.billing_address2,
        company_name: data.billing_company_name,
        city: data.billing_city,
        state: data.billing_state,
        zip: data.billing_zip,
        phone: data.billing_phone,
        country: data.billing_country,
      };
      localStorage.setItem("billingAddress", JSON.stringify(billingData));
    }
    router.push("/payment");
  };
  useEffect(() => {
    const deliveryAddress = localStorage.getItem("deliveryAddress");
    if (deliveryAddress) {
      const data = JSON.parse(deliveryAddress);
      setValue("email", data.email);
      setValue("first_name", data.first_name);
      setValue("last_name", data.last_name);
      setValue("address1", data.address1);
      setValue("address2", data.address2);
      setValue("company_name", data.company_name);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("zip", data.zip);
      setValue("phone", data.phone);
      setValue("country", data.country);
    }
    const billingAddress = localStorage.getItem("billingAddress");
    if (billingAddress) {
      const data = JSON.parse(billingAddress);
      setValue("billing_first_name", data.first_name);
      setValue("billing_last_name", data.last_name);
      setValue("billing_address1", data.address1);
      setValue("billing_address2", data.address2);
      setValue("billing_company_name", data.company_name);
      setValue("billing_city", data.city);
      setValue("billing_state", data.state);
      setValue("billing_zip", data.zip);
      setValue("billing_phone", data.phone);
      setValue("billing_country", data.country);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 rounded-xl  col-span-12 md:col-span-7  "
        >
          <h2 className="text-lg font-semibold my-4">Shipping address</h2>
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
                  {...register("country", { required: "Country is required" })}
                  className="peer p-4 pe-9 block w-full border-gray-200 border rounded-lg text-sm focus:border-gray-500  disabled:opacity-50 disabled:pointer-events-none  focus:pt-6
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
                  className={errors.first_name ? "border-red-500" : ""}
                  id="first_name"
                  {...register("first_name")}
                  placeholder="First name"
                />
              </div>
              <div>
                <Input
                  className={errors.last_name ? "border-red-500" : ""}
                  id="last_name"
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  placeholder="Last name"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Input
                className={errors.address1 ? "border-red-500" : ""}
                {...register("address1", { required: "Address is required" })}
                placeholder="Address"
              />
              {errors.address1 && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address1.message}
                </p>
              )}
            </div>
            <div>
              <Input
                className={errors.address2 ? "border-red-500" : ""}
                {...register("address2")}
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>
            <div>
              <Input
                className={errors.company_name ? "border-red-500" : ""}
                {...register("company_name")}
                placeholder="Company name (optional)"
              />
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
                  className={errors.zip ? "border-red-500" : ""}
                  {...register("zip", { required: "ZIP code is required" })}
                  placeholder="ZIP code"
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.zip.message}
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
          <h2 className="text-lg font-semibold my-4">Billing Address</h2>
          <div className="border-gray-200 mt-2 border rounded-xl">
            <RadioGroup defaultValue="yes" onValueChange={setSameAsDelivery}>
              <label
                htmlFor="radio-yes"
                className="flex md:space-x-2 space-x-1 justify-between border-b  p-4  cursor-pointer items-center"
              >
                <div className="flex space-x-2 items-center">
                  <RadioGroupItem
                    className="rounded-full"
                    id="radio-yes"
                    value="yes"
                  />
                  <span>Same as shipping address</span>
                </div>
              </label>
              <label
                htmlFor="radio-no"
                className="flex md:space-x-2 space-x-1 justify-between border-b   p-4  cursor-pointer items-center"
              >
                <div className="flex space-x-2 items-center">
                  <RadioGroupItem
                    className="rounded-full"
                    id="radio-no"
                    value="no"
                  />
                  <span>Use a different billing address</span>
                </div>
              </label>
            </RadioGroup>

            {sameAsDelivery === "no" && (
              <div className="space-y-4 p-4">
                <div>
                  <div className="relative">
                    <select
                      {...register("billing_country", {
                        required: "Country is required",
                      })}
                      className="peer p-4 pe-9 block w-full border-gray-200 border rounded-lg text-sm focus:border-gray-500  disabled:opacity-50 disabled:pointer-events-none  focus:pt-6
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
                      className={
                        errors.billing_first_name ? "border-red-500" : ""
                      }
                      id="billing_first_name"
                      {...register("billing_first_name")}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Input
                      className={
                        errors.billing_last_name ? "border-red-500" : ""
                      }
                      id="billing_last_name"
                      {...register("billing_last_name", {
                        required: "Last name is required",
                      })}
                      placeholder="Last name"
                    />
                    {errors.billing_last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.billing_last_name.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    className={errors.billing_address1 ? "border-red-500" : ""}
                    {...register("billing_address1", {
                      required: "Address is required",
                    })}
                    placeholder="Address"
                  />
                  {errors.billing_address1 && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.billing_address1.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    className={errors.billing_address2 ? "border-red-500" : ""}
                    {...register("billing_address2")}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
                <div>
                  <Input
                    className={
                      errors.billing_company_name ? "border-red-500" : ""
                    }
                    {...register("billing_company_name")}
                    placeholder="Company name (optional)"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Input
                      className={errors.billing_city ? "border-red-500" : ""}
                      {...register("billing_city", {
                        required: "City is required",
                      })}
                      placeholder="City"
                    />
                    {errors.billing_city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.billing_city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      className={errors.billing_state ? "border-red-500" : ""}
                      {...register("billing_state", {
                        required: "State is required",
                      })}
                      placeholder="State"
                    />
                    {errors.billing_state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.billing_state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      className={errors.billing_zip ? "border-red-500" : ""}
                      {...register("billing_zip", {
                        required: "ZIP code is required",
                      })}
                      placeholder="ZIP code"
                    />
                    {errors.billing_zip && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.billing_zip.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    className={errors.billing_phone ? "border-red-500" : ""}
                    {...register("billing_phone", {
                      required: "Phone is required",
                    })}
                    placeholder="Phone"
                  />
                  {errors.billing_phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.billing_phone.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:flex justify-between mt-6">
            <Link href="/cart">
              <Button variant="outline" type="button">
                <ChevronLeft className="h-5 w-5" />
                Return to cart
              </Button>
            </Link>
            <Button type="submit">
              Continue to payment
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </form>
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
          <div className="flex md:hidden justify-between mt-6">
            <Link href="/cart">
              <Button variant="outline" type="button">
                <ChevronLeft className="h-5 w-5" />
                Return to cart
              </Button>
            </Link>
            <Button type="submit">
              Continue to payment
              <ChevronRight className="h-5 w-5" />
            </Button>
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
  title: string;
}

const ProductCart: React.FC<ProductCartProps> = ({
  image,
  quantity,
  name,
  price,
  title,
}) => {
  return (
    <div className="flex relative space-x-4 border-b items-center justify-between py-2">
      <div className="flex space-x-4 items-center">
        <img
          className="rounded-md md:size-16 size-12  object-contain"
          alt={name}
          src={image}
        />
        <div className="flex flex-1 text-sm justify-center space-y-2 flex-col">
          <span className="text-sm font-normal line-clamp-2">{name}</span>
          <span className="text-gray-500">{title}</span>
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
