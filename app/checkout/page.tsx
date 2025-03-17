"use client";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { CartContext } from "@/context/cart/cart-context";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { markets, states } from "@/assets/data";
import { Select, Input } from "@/components/custom-ui";
import Image from "next/image";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  city: string;
  state?: string;
  postalCode: string;
  phone: string;
  country: string;
  discountCode: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingAddress2: string;
  billingCity: string;
  billingState?: string;
  billingPostalCode: string;
  billingPhone: string;
  billingCountry: string;
}
interface IState {
  name: string;
  code: string;
}
const STATES: {
  US: IState[];
  CA: IState[];
} = states;
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
    watch,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const addressData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      address2: data.address2,
      city: data.city,
      state: ["US", "CA"].includes(data.country) ? data.state : "",
      postalCode: data.postalCode,
      phone: data.phone,
      country: data.country,
    };

    localStorage.setItem("deliveryAddress", JSON.stringify(addressData));
    if (sameAsDelivery === "yes") {
      localStorage.setItem("billingAddress", JSON.stringify(addressData));
    } else {
      const billingData = {
        email: data.email,
        firstName: data.billingFirstName,
        lastName: data.billingLastName,
        address: data.billingAddress,
        address2: data.billingAddress2,
        city: data.billingCity,
        state: ["US", "CA"].includes(data.billingCountry),
        postalCode: data.billingPostalCode,
        phone: data.billingPhone,
        country: data.billingCountry,
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
      setValue("firstName", data.firstName);
      setValue("lastName", data.lastName);
      setValue("address", data.address);
      setValue("address2", data.address2);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("postalCode", data.postalCode);
      setValue("phone", data.phone);
      setValue("country", data.country);
    }
    const billingAddress = localStorage.getItem("billingAddress");
    if (billingAddress) {
      const data = JSON.parse(billingAddress);
      setValue("billingFirstName", data.firstName);
      setValue("billingLastName", data.lastName);
      setValue("billingAddress", data.address);
      setValue("billingAddress2", data.address2);
      setValue("billingCity", data.city);
      setValue("billingState", data.state);
      setValue("billingPostalCode", data.postalCode);
      setValue("billingPhone", data.phone);
      setValue("billingCountry", data.country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const country = watch("country");
  const billingCountry = watch("billingCountry");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 px-4">
          <Link className="text-gray-400" href="/cart">
            Cart
          </Link>
          <span>/</span>
          <span>Information</span>
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="p-4 rounded-xl  col-span-12 md:col-span-7  ">
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
                <Select
                  id="country"
                  {...register("country", { required: "Country is required" })}
                  defaultValue="US"
                  label="Country/Region"
                >
                  {markets.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </Select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    className={errors.firstName ? "border-red-500" : ""}
                    id="firstName"
                    {...register("firstName")}
                    placeholder="First name (optional)"
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
                  id="address"
                  className={errors.address ? "border-red-500" : ""}
                  {...register("address", { required: "Address is required" })}
                  placeholder="Address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  id="address2"
                  className={errors.address2 ? "border-red-500" : ""}
                  {...register("address2")}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="grid md:grid-cols-3 grid-cols-1  gap-4">
                <div className="order-1">
                  <Input
                    id="city"
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
                {["US", "CA"].includes(country) && (
                  <div className="order-2">
                    <Select
                      id="state"
                      label="State"
                      {...register("state", { required: "State is required" })}
                    >
                      {STATES[country as "US" | "CA"].map((item: IState) => (
                        <option key={item.code} value={item.code}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="order-3">
                  <Input
                    id="postalCode"
                    className={errors.postalCode ? "border-red-500" : ""}
                    {...register("postalCode", {
                      required: "ZIP code is required",
                    })}
                    placeholder="ZIP code"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Input
                  id="phone"
                  className={errors.phone ? "border-red-500" : ""}
                  {...register("phone", {
                    pattern: {
                      value: /^\+?[0-9][0-9().\-\s]{6,14}[0-9]$/,
                      message: "Phone is invalid",
                    },
                  })}
                  placeholder="Phone (optional)"
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
                    <Select
                      id="billingCountry"
                      {...register("billingCountry", {
                        required: "Country is required",
                      })}
                      defaultValue="US"
                      label="Country/Region"
                    >
                      {markets.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.label}
                        </option>
                      ))}
                    </Select>
                    {errors.billingCountry && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.billingCountry.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        className={
                          errors.billingFirstName ? "border-red-500" : ""
                        }
                        id="billingFirstName"
                        {...register("billingFirstName")}
                        placeholder="First name (optional)"
                      />
                    </div>
                    <div>
                      <Input
                        className={
                          errors.billingLastName ? "border-red-500" : ""
                        }
                        id="billingLastName"
                        {...register("billingLastName", {
                          required: "Last name is required",
                        })}
                        placeholder="Last name"
                      />
                      {errors.billingLastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Input
                      className={errors.billingAddress ? "border-red-500" : ""}
                      {...register("billingAddress", {
                        required: "Address is required",
                      })}
                      placeholder="Address"
                    />
                    {errors.billingAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.billingAddress.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      className={errors.billingAddress2 ? "border-red-500" : ""}
                      {...register("billingAddress2")}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                    <div className="order-1">
                      <Input
                        className={errors.billingCity ? "border-red-500" : ""}
                        {...register("billingCity", {
                          required: "City is required",
                        })}
                        placeholder="City"
                      />
                      {errors.billingCity && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingCity.message}
                        </p>
                      )}
                    </div>
                    {["US", "CA"].includes(billingCountry) && (
                      <div className="order-2">
                        <Select
                          id="billingState"
                          label="State"
                          {...register("state", {
                            required: "State is required",
                          })}
                        >
                          {STATES[billingCountry as "US" | "CA"].map(
                            (item: IState) => (
                              <option key={item.code} value={item.code}>
                                {item.name}
                              </option>
                            )
                          )}
                        </Select>
                        {errors.billingCountry && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billingCountry.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="order-3">
                      <Input
                        id="billingPostalCode"
                        className={
                          errors.billingPostalCode ? "border-red-500" : ""
                        }
                        {...register("billingPostalCode", {
                          required: "ZIP code is required",
                        })}
                        placeholder="ZIP code"
                      />
                      {errors.billingPostalCode && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingPostalCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Input
                      id="billingPhone"
                      className={errors.billingPhone ? "border-red-500" : ""}
                      {...register("billingPhone", {
                        pattern: {
                          value: /^\+?[0-9][0-9().\-\s]{6,14}[0-9]$/,
                          message: "Phone is invalid",
                        },
                      })}
                      placeholder="Phone (optional)"
                    />
                    {errors.billingPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.billingPhone.message}
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
          </div>
          <div className="col-span-12 md:col-span-5 px-8 flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              {" "}
              <p className="text-center font-semibold">
                Free Shipping Unlocked!
              </p>
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
    </form>
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
        <Image
          width={64}
          height={64}
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
