"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, PlusIcon, Trash, Trash2Icon, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { uploadImage, uploadImages } from "@/lib/common";
import Image from "next/image";

import { API_URL } from "@/config-global";
import { convertIDToURL, convertURLToID, toSlug } from "@/lib/utils";
import { Product, Variant } from "./page";
import VariantOptionValuesInput from "./variant-option";
import UploadIllustration from "@/assets/illustrations/upload-illustration";
import { STORAGE_KEY } from "@/lib/contanst";

const variantZodSchema = z
  .object({
    attributes: z.array(z.object({ name: z.string(), value: z.string() })),
    price: z.number().nonnegative(),
    salePrice: z.number().nonnegative(),
    image: z.string().max(200).optional(),
    stock: z.number().int().nonnegative(),
    sku: z.string().optional(),
    _id: z.string().optional(),
  })
  .superRefine((variant, ctx) => {
    if (variant.salePrice > variant.price) {
      ctx.addIssue({
        code: "custom",
        message: "Sale price must be less than or equal to price",
        path: ["salePrice"],
      });
    }
  });

const productSchema = z.object({
  name: z.string().max(200),
  image: z.string().max(200).optional(),
  slug: z.string().max(100).optional(),
  categories: z.array(z.string()).optional().default([]),
  images: z.array(z.string().max(200)).optional().default([]),
  description: z.string().max(200).optional(),

  variantOptions: z
    .array(
      z.object({
        values: z.array(z.string()).min(1),
        name: z.string().max(50),
      })
    )
    .optional()
    .default([]),

  variants: z.array(variantZodSchema).min(1),
});
interface VariantOption {
  name: string;
  values: string[];
}
const INIT_FORM_DATA = {
  _id: "",
  name: "",
  slug: "",
  images: [],
  description: "",
  variantOptions: [],
  variants: [
    { attributes: [], price: 0, stock: 0, sku: "", salePrice: 0, image: "" },
  ],
  image: "",
};
export default function ProductForm({ id }: { id: string | null }) {
  const [formData, setFormData] = useState<Product>(INIT_FORM_DATA);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const validateForm = () => {
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errorMap[err.path.join(".")] = err.message;
      });
      setErrors(errorMap);
      console.log(errorMap);

      return false;
    }
    setErrors({});
    return true;
  };

  const fetchData = async (id: string | null) => {
    if (!id) return;
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");
      const res = await fetch(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
      const data = await res.json();
      const dataClone = {
        ...data,
        image: convertIDToURL(data.image),
        variants: data.variants.map((variant: Variant) => ({
          ...variant,
          image: convertIDToURL(variant.image),
        })),
        images: data.images.map((img: string) => convertIDToURL(img)),
      };
      setFormData(dataClone);
      setVariantOptions(data.variantOptions || []);
      // setImages(data.images?.map((img: string) => convertIDToURL(img)) || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy dữ liệu review, thử lại sau!");
    }
  };
  useEffect(() => {
    if (id) {
      fetchData(id);
    } else {
      setFormData(INIT_FORM_DATA);
      setVariantOptions([]);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = await uploadImage(e);
    if (!url) return;
    setFormData((prev) => ({ ...prev, image: url }));
  };
  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const imageUpload = await uploadImage(e);
    if (!imageUpload) return;
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], image: imageUpload };
      return { ...prev, variants: newVariants };
    });
  };
  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true); // Thêm trạng thái loading

    const imagesUpload = await uploadImages(e);
    if (!imagesUpload) {
      setIsUploading(false);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imagesUpload],
    }));
    setIsUploading(false);
  };

  const handleVariantChange = (
    index: number,
    key: string,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [key]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const generateVariants = () => {
    const filterVariantOptions = variantOptions.filter(
      (option) => option.name.trim() !== "" && option.values.length > 0
    );
    if (filterVariantOptions.length === 0) {
      setFormData((prev) => ({ ...prev, variantOptions: [] }));
      setVariantOptions([]);
      return [{ attributes: [], price: 0, salePrice: 0, stock: 0, sku: "" }];
    }

    // Lấy danh sách thuộc tính và các giá trị tương ứng
    const keys = filterVariantOptions.map((option) => option.name);
    const valuesList = filterVariantOptions.map((option) => option.values);

    // Hàm sinh tổ hợp
    const generateCombinations = (
      attrs: string[][],
      index = 0,
      current: { name: string; value: string }[] = []
    ): { name: string; value: string }[][] => {
      if (index === attrs.length) return [current];

      return attrs[index].flatMap((value) =>
        generateCombinations(attrs, index + 1, [
          ...current,
          { name: keys[index], value },
        ])
      );
    };

    const variants = generateCombinations(valuesList).map((attributes) => ({
      attributes,
      price: 0,
      salePrice: 0,
      stock: 0,
      sku: "",
      image: "",
    }));
    setVariantOptions(filterVariantOptions);
    setFormData((prev) => ({
      ...prev,
      variantOptions: filterVariantOptions,
      variants,
    }));
  };

  // SUBMIT
  // SUBMIT FORM
  const onSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      if (!token) throw new Error("Unauthorized: No token found");
      const imgs = formData.images.map((img) => convertURLToID(img));
      const slug = formData.slug || toSlug(formData.name);

      const payload = { ...formData, images: imgs, slug };

      const res = await fetch(`${API_URL}/products${id ? `/${id}` : ""}`, {
        method: id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      toast.success(`${id ? "Cập nhật" : "Tạo mới"} thành công`);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-background rounded-lg">
      <fieldset disabled={loading} className="grid grid-cols-2 gap-8 ">
        <div className="space-y-4 col-span-2 md:col-span-1 ">
          <h3 className="font-bold text-xl">Thông tin</h3>
          <div className="flex justify-center flex-col items-center space-y-2">
            <label
              htmlFor="image"
              className="cursor-pointer border-dashed border border-border rounded-full  "
              title="Chọn ảnh bìa"
            >
              <Image
                width={128}
                height={128}
                src={formData.image || "/no-img.svg"}
                alt="cover"
                className="w-32 h-32  object-contain rounded-full"
              />
              <input
                onChange={handleChangeImage}
                id="image"
                name="images"
                type="file"
                className="hidden"
              />
            </label>

            <Button
              onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
              variant={"outline"}
              size="icon"
              className="cursor-pointer"
            >
              <Trash2Icon strokeWidth={1} />
            </Button>
          </div>
          <div className="space-y-2">
            {" "}
            <Label>
              Tên sản phẩm <span className="text-destructive">*</span>
            </Label>
            <Input
              className={`${
                errors.name
                  ? "border-destructive bg-destructive-foreground"
                  : ""
              }`}
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            {" "}
            <Label>URL</Label>
            <Input
              className={`${errors.slug ? "border-destructive" : ""}`}
              name="slug"
              placeholder="Ví dụ: product-name"
              value={formData.slug}
              onChange={handleChange}
            />
            {errors.slug && (
              <p className="text-destructive text-sm">{errors.slug}</p>
            )}
          </div>
          <div className="space-y-2">
            {" "}
            <Label>Mô tả</Label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="cover-photo"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Cover photo
            </label>

            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-4 ">
              <div className="flex text-sm/6 ">
                <label
                  htmlFor="files-upload"
                  className="relative cursor-pointer rounded-md font-semibold space-y-2  flex flex-col items-center justify-center"
                >
                  <UploadIllustration hideBackground className="w-48" />

                  <p className="text-xs/5 ">
                    Định dạng PNG, JPG, JPEG, WEBP tối đa 2MB mỗi ảnh
                  </p>
                  <input
                    disabled={isUploading}
                    onChange={handleUploadImages}
                    id="files-upload"
                    name="images"
                    multiple
                    type="file"
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 py-2 my-4 ">
              {formData.images?.map((image, index) => (
                <div
                  className="size-20 relative border border-border rounded-md"
                  key={index}
                >
                  {" "}
                  <Image
                    width={80}
                    height={80}
                    src={image}
                    alt="cover"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <span
                    onClick={() => {
                      setFormData((prev) => {
                        const newImages = prev.images.filter(
                          (_, i) => i !== index
                        );
                        return { ...prev, images: newImages };
                      });
                    }}
                    className="cursor-pointer size-5 flex justify-center items-center absolute top-1 right-1 rounded-full bg-accent"
                  >
                    {" "}
                    <X strokeWidth={1} size={16} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4 col-span-2 md:col-span-1">
          <h3 className="font-bold text-xl">Thuộc tính biến thể</h3>
          <div className="flex justify-end">
            <Button
              size="sm"
              type="button"
              onClick={() =>
                setVariantOptions((prev) => [...prev, { name: "", values: [] }])
              }
            >
              <PlusIcon strokeWidth={1} className="mr-2" />
              Thêm thuộc tính
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Thuộc tính</TableHead>
                <TableHead>Giá trị</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variantOptions.map((option, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={option.name}
                      onChange={(e) => {
                        setVariantOptions((prev) => {
                          const newVariantOptions = [...prev];
                          newVariantOptions[index] = {
                            ...newVariantOptions[index],
                            name: e.target.value,
                          };
                          return newVariantOptions;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <VariantOptionValuesInput
                        handleChangeVariantOptionValues={(values) => {
                          setVariantOptions((prev) => {
                            const newVariantOptions = [...prev];
                            newVariantOptions[index] = {
                              ...newVariantOptions[index],
                              values,
                            };
                            return newVariantOptions;
                          });
                        }}
                        values={option.values}
                      ></VariantOptionValuesInput>
                      <Button
                        className="shrink-0"
                        onClick={() =>
                          setVariantOptions((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        size="icon"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end">
            {variantOptions.length > 0 && (
              <Button onClick={generateVariants}>Tạo biến thể </Button>
            )}
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          {" "}
          <Label>Variants</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Thuộc tính</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Giá khuyến mãi</TableHead>
                <TableHead>Kho hàng</TableHead>
                <TableHead>SKU</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.variants.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <label
                        htmlFor={`variant-image${index}`}
                        className="cursor-pointer"
                      >
                        <Image
                          width={48}
                          height={48}
                          src={variant.image || "/no-img.svg"}
                          alt="variant"
                          className="w-10 h-10 object-cover rounded-md"
                        />

                        <input
                          onChange={(e) => handleUploadImage(e, index)}
                          className="hidden"
                          id={`varianr-image${index}`}
                          type="file"
                        />
                      </label>
                    </div>
                  </TableCell>
                  <TableCell>
                    {variant.attributes?.map((attr) => (
                      <span key={attr.name} className="mr-2">
                        <strong>{attr.name}:</strong> {attr.value}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={variant.salePrice}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "salePrice",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stock",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={variant.sku}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "sku",
                          Number(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </fieldset>
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={loading} type="submit">
          {loading && <Loader2 strokeWidth={1.25} className="animate-spin" />}{" "}
          Lưu lại
        </Button>
      </div>
    </div>
  );
}
