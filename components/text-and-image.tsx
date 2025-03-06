import Link from "next/link";
import Image from "next/image";

interface TextAndImageProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  content: React.ReactNode;
  imgFirst?: boolean;
}

export default function TextAndImage({
  src,
  alt,
  title,
  description,
  content,
  imgFirst = false,
}: TextAndImageProps) {
  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Phần chữ */}
        <div className="flex items-center justify-center">
          <div>
            <div className="flex flex-col space-y-4 justify-start">
              <p className="text-blue-600 text-lg font-semibold">{title}</p>
              <p className="text-3xl font-bold">{description}</p>
              {content}
            </div>
          </div>
        </div>
        {/* Hình ảnh */}
        <div className={`flex-1 ${imgFirst ? "order-1" : ""}`}>
          <Image
            src={src}
            alt={alt}
            width={500}
            height={500}
            className="w-full rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
