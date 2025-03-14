"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { API_URL } from "@/config-global";
import { STORAGE_KEY } from "@/lib/contanst";
export const OrderStatusEnum = z.enum([
  "PENDING",
  "COMPLETE",
  "REFUNDED",
  "CANCELLED",
]);
export const PaymentMethodEnum = z.enum([
  "paypal",
  "credit_card",
  "bank_transfer",
  "cash_on_delivery",
]);

// Schema cho từng Order Item, sử dụng productId thay vì slug
const orderItemSchema = z.object({
  variantId: z.string().min(1, { message: "Variant ID is required" }), // Giả sử ID được truyền dưới dạng chuỗi
  name: z.string().max(200, { message: "Name must not exceed 200 characters" }),
  productId: z.string().min(1, { message: "Product ID is required" }),
  quantity: z
    .number()
    .int({ message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be a positive number" })
    .max(1000, { message: "Quantity must not exceed 1000" }),
  price: z
    .number()
    .nonnegative({ message: "Price must be a nonnegative number" }),
});

// Schema cho Order
export const orderSchema = z.object({
  products: z
    .array(orderItemSchema)
    .nonempty({ message: "Order must contain at least one product" }),
  voucher: z
    .string()
    .max(200, { message: "Voucher must not exceed 200 characters" })
    .nullable()
    .optional(),
  total: z
    .number()
    .nonnegative({ message: "Total must be a nonnegative number" }),
  email: z.string().email(),
  trackingNumber: z.string().optional(),
  logisticPartner: z.string().optional(),
  isSendEmail: z.boolean().optional(),
  name: z.string().optional(),

  // Nếu có user, có thể là string id (tùy vào cách bạn xử lý ObjectId)
  user: z.string().optional(),
  shippingAddress: z
    .object({
      fullName: z.string().min(1).max(200),
      address: z.string().min(1).max(200),
      address2: z.string().max(200).optional(),
      city: z.string().min(1).max(200),
      state: z.string().max(200).optional(),
      postalCode: z.string().min(1).max(200),
      country: z.string().min(2).max(2),
      phone: z.string().min(7).max(15).optional(),
    })
    .optional(),
  billingAddress: z
    .object({
      fullName: z.string().min(1).max(200),
      phone: z.string().min(7).max(15).optional(),
      address: z.string().min(1).max(200),
      address2: z.string().max(200).optional(),
      city: z.string().min(1).max(200),
      state: z.string().max(200).optional(),
      postalCode: z.string().min(1).max(200),
      country: z.string().min(2).max(2),
    })
    .optional(),
  status: OrderStatusEnum,
  paymentMethod: PaymentMethodEnum,
  // Timestamps có thể được validate nếu cần
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(`${API_URL}/products?page=${1}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      let variants: any[] = [];
      data.data.forEach((product: any) => {
        variants = [
          ...variants,
          ...product.variants.map((variant: any) => ({
            ...variant,
            name: product.name,
            productId: product._id,
            variantId: variant._id,
          })),
        ];
      });
      setProducts(variants);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const handleChosenProduct = (index: number, id: string) => {
    const variant = products.find((p) => p._id === id);
    console.log("ID:", id), products;

    console.log("Variant:", variant);

    if (variant) {
      setValue(`products.${index}.name`, variant.name);
      setValue(`products.${index}.productId`, variant._id);
      setValue(`products.${index}.variantId`, variant._id);
      setValue(`products.${index}.price`, 0);
      setValue(`products.${index}.quantity`, 1);
    }
  };

  const onSubmit = (data: OrderInput) => {
    console.log("Order Data:", data);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-2xl font-bold mb-6">Create New Order</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div className="space-y-4 col-span-1 md:col-span-2">
            {/* Products */}
            <div>
              <label className="block text-sm font-medium">Products</label>
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-2 mb-4 border-b pb-4">
                  <select
                    onChange={(e) => handleChosenProduct(index, e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    {products.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} (
                        {product.attributes
                          .map((att: any) => att.value)
                          .join(", ")}
                        )
                      </option>
                    ))}
                  </select>

                  <input
                    {...register(`products.${index}.variantId`)}
                    placeholder="Variant ID"
                    className="w-full p-2 border rounded-lg hidden"
                  />
                  <div className="flex space-x-2">
                    <input
                      {...register(`products.${index}.name`)}
                      placeholder="Product Name"
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      {...register(`products.${index}.productId`)}
                      placeholder="Product ID"
                      className="w-full p-2 border rounded-lg hidden"
                    />
                    <div>
                      <input
                        {...register(`products.${index}.quantity`)}
                        type="number"
                        placeholder="Quantity"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <input
                        {...register(`products.${index}.price`)}
                        type="number"
                        placeholder="Price"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  append({
                    variantId: "",
                    name: "",
                    productId: "",
                    quantity: 1,
                    price: 0,
                  })
                }
                className="text-blue-500 text-sm"
              >
                Add Product
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                {...register("name")}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full p-2 border rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Total */}
            <div>
              <label className="block text-sm font-medium">Total Amount</label>
              <input
                {...register("total")}
                type="number"
                className="w-full p-2 border rounded-lg"
              />
              {errors.total && (
                <p className="text-red-500 text-sm">{errors.total.message}</p>
              )}
            </div>

            {/* Voucher */}
            <div>
              <label className="block text-sm font-medium">Voucher</label>
              <input
                {...register("voucher")}
                type="text"
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium">Order Status</label>
              <select
                {...register("status")}
                className="w-full p-2 border rounded-lg"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETE">Complete</option>
                <option value="REFUNDED">Refunded</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium">
                Payment Method
              </label>
              <select
                {...register("paymentMethod")}
                className="w-full p-2 border rounded-lg"
              >
                <option value="paypal">Paypal</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
              </select>
            </div>

            {/* Logistic Partner */}
            <div>
              <label className="block text-sm font-medium">
                Logistic Partner
              </label>
              <input
                {...register("logisticPartner")}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Tracking Number */}
            <div>
              <label className="block text-sm font-medium">
                Tracking Number
              </label>
              <input
                {...register("trackingNumber")}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            {/* Is Send Email */}
            <div>
              <label className="block text-sm font-medium">Send Email</label>
              <input
                type="checkbox"
                {...register("isSendEmail")}
                className="mr-2"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Billing Address
              </label>
              <input
                {...register("billingAddress.fullName")}
                placeholder="Full Name"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <input
                {...register("billingAddress.phone")}
                placeholder="Phone"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <input
                {...register("billingAddress.address")}
                placeholder="Address"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <input
                {...register("billingAddress.address2")}
                placeholder="Address 2"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <input
                {...register("billingAddress.city")}
                placeholder="City"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <input
                {...register("billingAddress.state")}
                placeholder="State"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <input
                {...register("billingAddress.postalCode")}
                placeholder="Postal Code"
                className="w-full p-2 border rounded-lg mb-2"
              />
              <input
                {...register("billingAddress.country")}
                placeholder="Country (e.g., US)"
                className="w-full p-2 border rounded-lg mb-2"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          Create Order
        </button>
      </form>
    </div>
  );
}
