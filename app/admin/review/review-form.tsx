"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UploadCloud, XIcon } from "lucide-react";
import { API_URL } from "@/config-global";
import { uploadImages } from "@/lib/common";
import { convertIDToURL, convertURLToID } from "@/lib/utils";
import { DatePicker2 } from "@/components/ui/date-picker";

// ✅ Định nghĩa schema validation bằng Zod
const reviewSchema = z.object({
  customer: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  productId: z.string().min(1, "Product ID không được để trống"),
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  body: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
  rating: z.coerce.number().min(1).max(5),
  images: z.array(z.string().url("URL hình ảnh không hợp lệ")),
  videos: z.array(z.string().url("URL video không hợp lệ")),
  imageUploads: z.array(z.string()),
  createdAt: z.string(),
});

export default function ReviewForm({ id }: { id: string | null }) {
  const fetchReview = async (id: string) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");
      const res = await fetch(`${API_URL}/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Có lỗi xảy ra khi lấy dữ liệu");
      const data = await res.json();

      const imageUploads = data.imageUploads?.map((img: string) =>
        convertIDToURL(img)
      );
      const dataClone = { ...data, imageUploads };
      setFormData(dataClone);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy dữ liệu review, thử lại sau!");
    }
  };
  useEffect(() => {
    if (id) {
      fetchReview(id);
    }
  }, [id]);
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    customer: "",
    productId: "",
    title: "",
    body: "",
    createdAt: new Date().toISOString(),
    rating: 5,
    images: [] as string[],
    videos: [] as string[],
    imageUploads: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Xử lý khi người dùng nhập dữ liệu
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true); // Thêm trạng thái loading

    const imagesUpload = await uploadImages(e);
    if (!imagesUpload) {
      setIsUploading(false);
      return;
    }
    setFormData({
      ...formData,
      imageUploads: [...formData.imageUploads, ...imagesUpload],
    });
    setIsUploading(false);
  };

  // Xử lý thêm URL ảnh
  const addImage = () => {
    if (imageUrl.trim() !== "") {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()],
      });
      setImageUrl("");
    }
  };

  const removeImage = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
    e.preventDefault();
  };

  const removeImageUpload = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    setFormData({
      ...formData,
      imageUploads: formData.imageUploads.filter((_, i) => i !== index),
    });
    e.preventDefault();
  };
  const removeVideo = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
    e.preventDefault();
  };
  // Xử lý thêm URL video
  const addVideo = () => {
    if (videoUrl.trim() !== "") {
      setFormData({
        ...formData,
        videos: [...formData.videos, videoUrl.trim()],
      });
      setVideoUrl("");
    }
  };

  // Xử lý gửi form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate dữ liệu bằng Zod
    const result = reviewSchema.safeParse(formData);

    if (!result.success) {
      // Nếu lỗi, cập nhật errors state
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    try {
      // Gửi dữ liệu lên API
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");
      const dataClone = {
        ...result.data,
        imageUploads: result.data.imageUploads.map((img) =>
          convertURLToID(img)
        ),
      };
      const res = await fetch(`${API_URL}/reviews${id ? `/${id}` : ""}`, {
        method: id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataClone),
      });

      if (!res.ok) throw new Error("Có lỗi xảy ra khi gửi dữ liệu");

      toast.success("Thêm review thành công!");
      setFormData({
        customer: "",
        productId: "",
        title: "",
        body: "",
        rating: 5,
        createdAt: "",
        images: [],
        videos: [],
        imageUploads: [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Không thể gửi review, thử lại sau!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Thêm Review Mới</h2>
      <form onSubmit={handleSubmit} className=" grid gap-4 grid-cols-2">
        {/* Customer Name */}
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="customer">Tên khách hàng</Label>
          <Input
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Nhập tên"
          />
          {errors.customer && (
            <p className="text-destructive text-sm">{errors.customer}</p>
          )}
        </div>

        {/* Product ID */}
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="productId">Product ID</Label>
          <Input
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="Nhập ID sản phẩm"
          />
          {errors.productId && (
            <p className="text-destructive text-sm">{errors.productId}</p>
          )}
        </div>

        {/* Title */}
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề"
          />
          {errors.title && (
            <p className="text-destructive text-sm">{errors.title}</p>
          )}
        </div>

        {/* Ngày tạo */}
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="createdAt">Ngày tạo</Label>
          <DatePicker2
            value={
              formData.createdAt ? new Date(formData.createdAt) : undefined
            }
            setValue={(date: Date | undefined) =>
              setFormData({
                ...formData,
                createdAt: date ? date.toISOString() : "",
              })
            }
            className={errors.createdAt ? "border-red-500" : ""}
          />

          {errors.createdAt && (
            <p className="text-destructive text-sm">{errors.createdAt}</p>
          )}
        </div>

        {/* Body */}
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="body">Nội dung</Label>
          <Textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Nhập nội dung"
          />
          {errors.body && (
            <p className="text-destructive text-sm">{errors.body}</p>
          )}
        </div>

        {/* Rating */}
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="rating">Đánh giá</Label>
          <Input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
          />
          {errors.rating && (
            <p className="text-destructive text-sm">{errors.rating}</p>
          )}
        </div>

        {/* Image URLs */}
        <div className="col-span-2 md:col-span-1">
          <Label>Hình ảnh (URL)</Label>
          <div className="flex gap-2 items-center">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Nhập URL hình ảnh"
            />
            <Button type="button" onClick={addImage}>
              Thêm
            </Button>
            <label htmlFor="images-upload">
              <input
                id="images-upload"
                className="hidden"
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handleUploadImages}
                multiple
              />
              <span className="bg-primary flex items-center justify-center text-white p-2 rounded-md size-10 cursor-pointer">
                <UploadCloud size={16} />
              </span>
            </label>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.images.map((img, index) => (
              <div className="relative" key={index}>
                <button
                  onClick={(e) => removeImage(e, index)}
                  className="absolute z-10 top-1  right-1 bg-background p-1 rounded-full"
                >
                  <XIcon size={16} />
                </button>
                <img
                  key={index}
                  src={img}
                  alt="Hình ảnh"
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
            ))}
            {formData.imageUploads?.map((img, index) => (
              <div className="relative" key={index}>
                <button
                  onClick={(e) => removeImageUpload(e, index)}
                  className="absolute z-10 top-1  right-1 bg-background p-1 rounded-full"
                >
                  <XIcon size={16} />
                </button>
                <img
                  key={index}
                  src={img}
                  alt="Hình ảnh"
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
          {errors.images && (
            <p className="text-destructive text-sm">{errors.images}</p>
          )}
        </div>

        {/* Video URLs */}
        <div className="col-span-2 md:col-span-1">
          <Label>Videos (URL)</Label>
          <div className="flex gap-2 items-center">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Nhập URL video"
            />
            <Button type="button" onClick={addVideo}>
              Thêm
            </Button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.videos.map((vid, index) => (
              <div className="relative" key={index}>
                <button
                  onClick={(e) => removeVideo(e, index)}
                  className="absolute z-10 top-1  right-1 bg-background p-1 rounded-full"
                >
                  <XIcon size={16} />
                </button>
                <video
                  key={index}
                  src={vid}
                  controls
                  className="w-32 h-20 rounded-md"
                />
              </div>
            ))}
          </div>
          {errors.videos && (
            <p className="text-destructive text-sm">{errors.videos}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-span-2">
          <Button type="submit">Gửi Review</Button>
        </div>
      </form>
    </div>
  );
}
