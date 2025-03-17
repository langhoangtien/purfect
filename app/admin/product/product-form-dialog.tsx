"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Product } from "./page";
import { STORAGE_KEY } from "@/lib/contanst";
import { API_URL } from "@/config-global";
import { PlusIcon, Trash2Icon, TrashIcon, X } from "lucide-react";
import { convertIDToURL, convertURLToID, toSlug } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { uploadImage, uploadImages } from "@/lib/common";
import Image from "next/image";

const variantZodSchema = z
  .object({
    attributes: z.array(z.object({ name: z.string(), value: z.string() })),
    price: z.number().nonnegative(),
    salePrice: z.number().nonnegative(),
    image: z.string().min(2).max(200).optional(),
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
  name: z.string().min(2).max(200),
  image: z.string().min(2).max(200).optional(),
  slug: z.string().max(100).optional(),
  categories: z.array(z.string()).optional().default([]),
  images: z.array(z.string().min(2).max(200)).optional().default([]),
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
interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}
type ProductFormData = z.infer<typeof productSchema> & { _id?: string };

export default function ProductFormDialog({
  open,
  onClose,
  product,
  onSuccess,
}: ProductFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("slug", product.slug);
      setValue("description", product.description);
      setValue("variantOptions", []);
      setValue("image", product.image || "");
      setValue("variants", product.variants || []);
      setVariantOptions(product.variantOptions || []);
      setImages(product.images?.map((img) => convertIDToURL(img)) || []);
    } else {
      setVariantOptions([]);
      setImages([]);
      reset();
      setValue("variants", [
        { attributes: [], price: 0, stock: 0, sku: "", salePrice: 0 },
      ]);
    }
  }, [product, setValue, reset]);

  const addNewVariantOptions = (e: React.MouseEvent) => {
    setVariantOptions((prev) => [...prev, { name: "", values: [] }]);

    e.preventDefault();
  };

  const handleChangeVariantOptionName = (index: number, value: string) => {
    const newVariantOptions = variantOptions.map((option, i) =>
      i === index ? { ...option, name: value } : option
    );
    setVariantOptions(newVariantOptions);
  };

  const handleChangeVariantOptionValues = (index: number, values: string[]) => {
    const newVariantOptions = variantOptions.map((option, i) =>
      i === index ? { ...option, values } : option
    );

    setVariantOptions(newVariantOptions);
  };

  // Tạo biến thể giống Shopify
  const generateVariants = () => {
    const filterVariantOptions = variantOptions.filter(
      (option) => option.name.trim() !== "" && option.values.length > 0
    );
    if (filterVariantOptions.length === 0) {
      setValue("variantOptions", []);
      setVariantOptions([]);
      return [{ attributes: [], price: 0, salePrice: 0, stock: 0, sku: "" }];
    }

    setVariantOptions(filterVariantOptions);
    setValue("variantOptions", filterVariantOptions);
    // Lấy danh sách thuộc tính và các giá trị tương ứng
    const keys = filterVariantOptions.map((option) => option.name); // Danh sách tên thuộc tính
    const valuesList = filterVariantOptions.map((option) => option.values); // Danh sách các giá trị

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

    return generateCombinations(valuesList).map((attributes) => ({
      attributes,
      price: 0,
      salePrice: 0,
      stock: 0,
      sku: "",
    }));
  };

  const removeVariantOption = (index: number) => {
    const newValue = variantOptions.filter((_, i) => i !== index);
    setVariantOptions(newValue);
  };

  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const imageUpload = await uploadImage(e);
    if (!imageUpload) return;
    setValue(`variants.${index}.image`, imageUpload);
  };
  //UPLOAD IMAGES
  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true); // Thêm trạng thái loading

    const imagesUpload = await uploadImages(e);
    if (!imagesUpload) {
      setIsUploading(false);
      return;
    }
    setImages((prev) => [...prev, ...imagesUpload]);
    setIsUploading(false);
  };

  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = await uploadImage(e);
    if (!url) return;
    setValue("image", url);
  };
  // SUBMIT FORM
  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      if (!token) throw new Error("Unauthorized: No token found");
      const imgs = images.map((img) => convertURLToID(img));
      const slug = data.slug || toSlug(data.name);

      const payload = { ...data, images: imgs, slug };

      const res = await fetch(
        `${API_URL}/products${product ? `/${product._id}` : ""}`,
        {
          method: product ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save product");

      toast.success(`Product ${product ? "updated" : "created"} successfully`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const variants = watch("variants");
  const image = watch("image");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90%] min-h-[90vh] p-8 ">
        <DialogHeader>
          <DialogTitle>
            {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[80vh] overflow-y-auto p-4 "
        >
          <div className="grid grid-cols-2 gap-8 ">
            <div className="space-y-4 col-span-2 md:col-span-1 ">
              <h3 className="font-bold text-xl">Thông tin</h3>
              <div className="flex justify-center flex-col items-center space-y-2">
                <label
                  htmlFor="image"
                  className="cursor-pointer bg-gray-200 rounded-full p-4 "
                  title="Chọn ảnh bìa"
                >
                  <Image
                    width={128}
                    height={128}
                    src={image || "/no-img.svg"}
                    alt="cover"
                    className="w-32 h-32 object-cover  rounded-full"
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
                  variant={"outline"}
                  onClick={(e) => {
                    setValue("image", "");
                    e.preventDefault();
                  }}
                  className="cursor-pointer"
                >
                  Xóa ảnh
                  <Trash2Icon strokeWidth={1} size={24} />
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Tên sản phẩm <span className="text-destructive">*</span>
                </Label>
                <Input {...register("name")} placeholder="Name" />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input {...register("slug")} placeholder="Slug" />
                {errors.slug && (
                  <p className="text-red-500">{errors.slug.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  {...register("description")}
                  type="text"
                  placeholder="description"
                />
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Cover photo
                </label>

                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ">
                  <div className="text-center">
                    <svg
                      className="mx-auto size-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="files-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                      >
                        <span>Tải lên ảnh</span>
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
                      <p className="pl-1">định dạng</p>
                    </div>
                    <p className="text-xs/5 text-gray-600">
                      PNG, JPG, JPEG, WEBP tối đa 2MB mỗi ảnh
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 py-2 my-4 ">
                  {images?.map((image, index) => (
                    <div
                      className="size-20 relative border border-gray-300 rounded-md"
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
                        onClick={() =>
                          setValue(
                            "images",
                            images.filter((_, i) => i !== index)
                          )
                        }
                        className="cursor-pointer size-5 flex justify-center items-center absolute top-1 right-1 rounded-full bg-gray-500 text-white"
                      >
                        {" "}
                        <X strokeWidth={1} size={16} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Quản lý thuộc tính và biến thể */}
            <div className="space-y-4 col-span-2 md:col-span-1">
              <h3 className="font-bold text-xl">Thuộc tính biến thể</h3>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  type="button"
                  onClick={addNewVariantOptions}
                  className="h-8"
                >
                  <PlusIcon strokeWidth={1} className="mr-2" />
                  Thêm thuộc tính
                </Button>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {variantOptions.map((variantOption, index) => (
                  <VariantOption
                    removeVariantOption={() => removeVariantOption(index)}
                    handleChangeVariantOptionName={(value) =>
                      handleChangeVariantOptionName(index, value)
                    }
                    handleChangeVariantOptionValues={(values) =>
                      handleChangeVariantOptionValues(index, values)
                    }
                    key={index}
                    index={index.toString()}
                    name={variantOption.name}
                    options={variantOption.values}
                  />
                ))}
              </Accordion>
              <div>
                {variantOptions.length !== 0 && (
                  <Button
                    className="h-8"
                    variant="secondary"
                    onClick={(e) => {
                      setValue("variants", generateVariants());
                      e.preventDefault();
                    }}
                  >
                    Xác nhận
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4 col-span-2">
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
                {variants?.map((variant, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <label
                          htmlFor={`varianr-image${index}`}
                          className="cursor-pointer"
                        >
                          <Image
                            width={48}
                            height={48}
                            src={variant.image || "/no-img.svg"}
                            alt="variant"
                            className="w-12 h-12 object-cover rounded-md"
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
                      {variant.attributes.map((attr) => (
                        <span key={attr.name} className="mr-2">
                          <strong>{attr.name}:</strong> {attr.value}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`variants.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Price"
                        className="w-40 h-8"
                        step="0.01"
                      />
                      {errors.variants?.[index]?.price && (
                        <p className="text-red-500">
                          {errors.variants[index].price.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`variants.${index}.salePrice`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="salePrice"
                        className="w-40 h-8"
                        step="0.01"
                      />
                      {errors.variants?.[index]?.salePrice && (
                        <p className="text-red-500">
                          {errors.variants[index].salePrice.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`variants.${index}.stock`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Stock"
                        className="w-40 h-8"
                      />
                      {errors.variants?.[index]?.stock && (
                        <p className="text-red-500">
                          {errors.variants[index].stock.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`variants.${index}.sku`)}
                        placeholder="SKU"
                        className="w-40 h-8"
                      />
                      {errors.variants?.[index]?.sku && (
                        <p className="text-red-500">
                          {errors.variants[index].sku.message}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface VariantOptionProps {
  name: string;
  options: string[];
  index: string;
  removeVariantOption: () => void;
  handleChangeVariantOptionName: (value: string) => void;
  handleChangeVariantOptionValues: (values: string[]) => void;
}
const VariantOption = ({
  name,
  options,
  index,
  removeVariantOption,
  handleChangeVariantOptionName,
  handleChangeVariantOptionValues,
}: VariantOptionProps) => {
  const [value, setValue] = useState("");

  const removeVariantOptionValue = (index: number) => {
    const newValue = options.filter((_, i) => i !== index);
    handleChangeVariantOptionValues(newValue);
  };

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleChangeVariantOptionName(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      if (!options.includes(value))
        handleChangeVariantOptionValues([...options, value]);

      setValue("");
      e.preventDefault();
    } else if (e.key === "Backspace" && value === "") {
      handleChangeVariantOptionValues(options.slice(0, options.length - 1));
    }
  };
  const handleRemoveVariantOption = () => {
    removeVariantOption();
  };
  return (
    <AccordionItem value={index}>
      <AccordionTrigger>{name ? name : "[no_value]"}</AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4 bg-gray-50 rounded-md p-4 ">
          <div className="font-semibold flex justify-between">
            <span> Thuộc tính </span>
            <span
              className="cursor-pointer p-2"
              onClick={handleRemoveVariantOption}
            >
              <TrashIcon strokeWidth={1} size={16} />
            </span>
          </div>
          <Input
            placeholder="Name"
            onChange={handleChangeName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            value={name}
          />
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Giá trị</label>
            <div className="flex flex-wrap gap-2 min-h-12 border bg-white border-gray-300 p-2 rounded-md">
              {options.map((option, index) => (
                <button
                  key={index}
                  className="bg-gray-200 text-sm px-2 py-1 mr-2 rounded inline-flex items-center justify-center"
                >
                  {option}
                  <X
                    strokeWidth={1}
                    size={16}
                    className="ml-2 cursor-pointer"
                    onClick={() => removeVariantOptionValue(index)}
                  />
                </button>
              ))}
              <input
                placeholder="Gõ và nhân Enter để thêm giá trị"
                className="border-none focus:outline-none flex-grow"
                value={value}
                onChange={handleChangeValue}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
