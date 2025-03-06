import { CheckCheck } from "lucide-react";
import Image from "next/image";

interface TextAndImageListProps {
  showButton?: boolean;
  src: string;
  title: string;
  description: string;
  content: React.ReactNode;
  list: { id: string; content: React.ReactNode; highlight?: string }[];
  imageFirst?: boolean;
}

export default function TextAndImageList({
  showButton = false,
  src,
  title,
  description,
  content,
  list,
  imageFirst = true,
}: TextAndImageListProps) {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 ">
        {/* Image Section */}
        <div className={`order-1 ${imageFirst ? "md:order-1" : "md:order-3"}`}>
          <div className="aspect-square">
            <Image
              src={src}
              alt="Laser Cap"
              width={500}
              height={500}
              className="w-full rounded-lg object-contain shadow-md"
            />
          </div>
        </div>
        {/* Text Section */}
        <div className="md:text-left flex flex-col justify-center space-y-4 order-2">
          <h3 className="text-blue-600 font-semibold">{title}</h3>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{description}</h1>
          {content}
          <div className="space-y-1 text-gray-700">
            {list.map((item) => (
              <div key={item.id} className="flex flex-row ">
                <span className="text-blue-600 size-16 mr-2 flex items-start">
                  <CheckCheck size={30} />
                </span>
                <p>
                  <strong>{item.highlight}</strong>
                  {item.content}
                </p>
              </div>
            ))}
          </div>
          {showButton && (
            <button className="mt-6 bg-blue-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-blue-700">
              Order Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
