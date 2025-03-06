"use client";
import { useState } from "react";

interface Variant {
  _id: string;
  attributes: { [key: string]: string }; // ví dụ: { Màu: "Đỏ", Size: "M" }
  price: number;
  stock: number;
  image: string;
}

interface Product {
  title: string;
  description: string;
  slug: string;
  images: string[];
  minPrice: number;
  variantOptions: Record<string, string[]>;
  variants: Variant[];
}

const product: Product = {
  title: "Áo Sơ Mi Nam Cổ Bẻ",
  description: "Áo sơ mi nam cao cấp, chất liệu cotton thoáng mát.",
  slug: "ao-so-mi-nam-co-be",
  images: [
    "https://example.com/images/ao-so-mi-1.jpg",
    "https://example.com/images/ao-so-mi-2.jpg",
  ],
  variantOptions: {
    Màu: ["Đỏ", "Xanh"],
    Size: ["M", "L"],
  },
  variants: [
    {
      _id: "variant1",
      attributes: { Màu: "Đỏ", Size: "M" },
      price: 199000,
      stock: 10,
      image: "https://example.com/images/ao-so-mi-red.jpg",
    },
    {
      _id: "variant2",
      attributes: { Màu: "Đỏ", Size: "L" },
      price: 209000,
      stock: 5,
      image: "https://example.com/images/ao-so-mi-blue.jpg",
    },
    {
      _id: "variant3",
      attributes: { Màu: "Xanh", Size: "M" },
      price: 199000,
      stock: 7,
      image: "https://example.com/images/ao-so-mi-green.jpg",
    },
    {
      _id: "variant4",
      attributes: { Màu: "Xanh", Size: "L" },
      price: 209000,
      stock: 0,
      image: "https://example.com/images/ao-so-mi-green.jpg",
    },
  ],
  minPrice: 199000,
};

export default function ProductDetail() {
  // State lưu các lựa chọn của người dùng: key là tên thuộc tính, value là lựa chọn
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Hàm xử lý chọn option cho thuộc tính
  const handleOptionSelect = (attribute: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attribute]: prev[attribute] === value ? "" : value,
    }));
  };

  // Hàm kiểm tra tính khả dụng của một option cho attribute dựa trên các lựa chọn khác và stock
  const isOptionAvailable = (attribute: string, option: string): boolean => {
    // Lấy các lựa chọn hiện tại của các thuộc tính khác (ngoại trừ attribute đang xét)
    const otherSelections = { ...selectedOptions };
    delete otherSelections[attribute];

    // Tìm xem có variant nào thỏa mãn:
    // - Giá trị của attribute hiện tại phải bằng option
    // - Các attribute khác (nếu có lựa chọn) phải khớp
    // - Và variant phải có stock > 0
    return product.variants.some((variant) => {
      if (variant.attributes[attribute] !== option) return false;
      // Kiểm tra các lựa chọn còn lại
      for (const key in otherSelections) {
        if (
          otherSelections[key] &&
          variant.attributes[key] !== otherSelections[key]
        ) {
          return false;
        }
      }
      return variant.stock > 0;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Tiêu đề sản phẩm */}
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <div className="flex flex-col md:flex-row">
        {/* Ảnh sản phẩm */}
        <div className="w-full md:w-1/2">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-auto rounded"
          />
        </div>
        {/* Thông tin và lựa chọn variant */}
        <div className="w-full md:w-1/2 md:pl-6 mt-4 md:mt-0">
          <p className="text-lg mb-2">{product.description}</p>
          <div className="mb-4">
            <span className="text-xl font-semibold">
              {product.minPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>
          {/* Hiển thị các lựa chọn variantOptions động */}
          {Object.entries(product.variantOptions).map(
            ([attribute, options]) => (
              <div key={attribute} className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                  Chọn {attribute}:
                </h2>
                <div className="flex gap-2">
                  {options.map((option) => {
                    const available = isOptionAvailable(attribute, option);
                    return (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(attribute, option)}
                        disabled={!available}
                        className={`border rounded px-4 py-2 ${
                          selectedOptions[attribute] === option
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300"
                        } ${!available && "opacity-50 cursor-not-allowed"}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}
          {/* Hiển thị lựa chọn đã chọn */}
          <div className="mb-4">
            <h2 className="font-semibold">Lựa chọn của bạn:</h2>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(selectedOptions, null, 2)}
            </pre>
          </div>
          {/* Nút thêm vào giỏ hàng */}
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}
