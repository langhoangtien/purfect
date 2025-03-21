import StarIcon from "@/components/star-icon";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const works = [
  {
    image: "/purfect/img8.avif",
    description: "Take your dosage",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0840/0158/7493/files/handsome-man-with-medicines-and-glass-of-water-is-2023-11-27-05-00-36-utc_copy_2.png?v=1712073082",
    description: "Absortion & nutrient delivery",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0840/0158/7493/files/Hue_Saturation_2.png?v=1712073082",
    description: "Biological effects",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0840/0158/7493/files/happy-shirtless-guy-smiling-while-posing-with-cott-2023-11-27-05-20-03-utc.png?v=1712073082",
    description: "Enjoy the benefits of an enhanced life",
  },
];
const sources = [
  {
    image:
      "https://cdn.shopify.com/s/files/1/0840/0158/7493/files/Layer_18.png?v=1712073082",
    description:
      "Seamoss provides an array of essential minerals vital for overall bodily functions, supporting everything from bone health to enzyme activity.",
    title: "Mineral Support",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0840/0158/7493/files/Layer_20.png?v=1712073082",
    description:
      "Shilajit facilitates the regulation of hormonal balance, particularly in the male testosterone levels, contributing to well-being and equilibrium",
    title: "Testosterone Enhancement",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0840/0158/7493/files/ashwagandha-2023-11-27-04-59-36-utc_485d58ec-3eca-4b3b-bfd6-8e2b0f4979b7.png?v=1712085430",
    description:
      "Ashwagandha aids in stress reduction and supports cognitive function, enhancing focus and mental clarity.",
    title: "Stress & Cognitive Support",
  },
  {
    image:
      "https://cdn.shopify.com/s/files/1/0840/0158/7493/files/Fresh_Ginseng_Root.J14.2k.png?v=1712073083",
    description:
      "Ginseng boosts energy levels and reduces fatigue, supporting endurance and stamina throughout the day... and night.",
    title: "Energy Booster",
  },
];
interface ProductCardProps {
  image: string;
  rating: string;
  reviews: string;
  title: string;
  description: string;
  benefits: string[];
  buttonColor: string;
  checkColor: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  rating,
  reviews,
  title,
  description,
  benefits,
  buttonColor,
  checkColor,
}) => {
  return (
    <div className="p-6 border rounded-lg space-y-4 ">
      <div className="flex justify-center">
        <Image
          src={image}
          alt={title}
          width={2000}
          height={2000}
          quality={80}
          className="w-full aspect-square rounded-xl "
        />
      </div>
      <div className="flex items-center space-x-2 justify-center">
        <span className="text-green-900 text-lg flex space-x-1">
          <StarIcon className="size-4" />
          <StarIcon className="size-4" />
          <StarIcon className="size-4" />
          <StarIcon className="size-4" />
          <StarIcon className="size-4" />
        </span>
        <span className="text-gray-700">({rating})</span>
        <a href="#" className="text-gray-500 underline">
          {reviews}
        </a>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 text-center">{title}</h2>
      <p className="text-gray-600 text-center">{description}</p>
      <ul className="space-y-2 text-gray-600">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center text-lg space-x-2">
            <Check strokeWidth={3.5} className={checkColor} size={28} />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <Link
          href="/products/optilife-blend"
          className={`md:px-16 px-6 py-4 ${buttonColor} text-white rounded-full text-lg font-medium hover:opacity-90 transition`}
        >
          Try Now
        </Link>
        <Link
          href="/products/optilife-blend"
          className="text-green-700 hover:text-primary px-2 hover:border-primary font-semibold border-b-2"
        >
          Learn <br /> more
        </Link>
      </div>
    </div>
  );
};

export default function SectionFour() {
  return (
    <div className="w-full flex flex-col space-y-16 max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <ProductCard
          image="/purfect/img5.avif"
          rating="4.9"
          reviews="30,405"
          title="24 in 1 - Dynamic Vitality Bundle"
          description="Crafted with precision, our Dynamic Vitality Bundle is formulated to provide you with a comprehensive solution for optimal health and vitality. Here's what it includes:"
          benefits={[
            "Promotes overall wellness",
            "Enhances energy levels",
            "Boosts immune system",
          ]}
          buttonColor="bg-primary"
          checkColor="text-green-900"
        />
        <ProductCard
          image="/purfect/img7.avif"
          rating="4.8"
          reviews="12,839"
          title="16 In 1 - Sea Moss Bundle"
          description="Our Sea Moss Bundle combines the power of nature's superfoods to support your health and well-being. Here's what it offers:"
          benefits={[
            "Promotes overall wellness",
            "Supports healthy glowing skin",
            "Supports Healthy Testosterone",
          ]}
          buttonColor="bg-black"
          checkColor="text-gray-900"
        />
      </div>
      <div className="w-full max-w-xl flex flex-col space-y-6 text-black justify-center items-center mx-auto">
        <p className="text-xl italic font-sans text-gray-700 ">
          “I’m a guy who struggled with low testosterone and this stuff gives me
          an unreal kick to life”
        </p>
        <Image
          width={200}
          height={200}
          alt="Mark W."
          className="size-20 object-contain rounded-full "
          src="https://cdn.shopify.com/s/files/1/0840/0158/7493/files/gfsd.png?v=1712073082"
        />
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-lg font-semibold text-center  text-gray-900">
            Mark W.
          </h2>
          <div className="text-gray-600 flex flex-row space-x-1">
            {" "}
            <StarIcon className="text-primary size-4" />
            <StarIcon className="text-primary size-4" />
            <StarIcon className="text-primary size-4" />
            <StarIcon className="text-primary size-4" />
            <StarIcon className="text-primary size-4" />
            <span>5.0/5 Rating</span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl flex flex-col space-y-8 mx-auto">
        <p className="text-5xl text-gray-800 text-left">
          Here&apos;s how OptiLife ™ works
        </p>
        <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-4 gap-8">
          {works.map((item) => (
            <div
              key={item.image}
              className="flex flex-col items-center space-y-4 font-semibold text-gray-700"
            >
              <Image
                width={1500}
                height={1500}
                alt="OptiLife ™ works"
                className="rounded-full w-full aspect-square"
                src={item.image}
              />
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-6xl flex flex-col space-y-8 mx-auto">
        <p className="text-5xl text-left text-gray-800">
          Sourced from the earth’s most powerful superfoods
        </p>
        <p className="text-xl text-left text-gray-800">
          Harnessing the power of nature, our supplements provide a natural
          source of essential minerals and nutrients for optimal health and
          vitality.
        </p>
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-8">
          {sources.map((item) => (
            <div
              key={item.image}
              className="flex flex-col rounded-3xl items-center space-y-4 font-semibold bg-[#ccc] text-gray-700"
            >
              <Image
                width={1500}
                height={1500}
                alt={item.title}
                className="rounded-t-xl w-full object-cover aspect-[4:3]"
                src={item.image}
              />
              <div className="flex flex-col p-4 space-y-2 text-left">
                <h2 className="text-2xl text-gray-900">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
