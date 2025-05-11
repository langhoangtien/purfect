"use client";

import { Product, ProductVariant } from "@/lib/shopify";
import { useEffect, useState } from "react";

import useCart from "@/context/cart/use-cart";
import ProductDetailCarousel from "../optilife-blend/views/product-carosel";
import Image from "next/image";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { ArrowLeftRightIcon, CheckIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTriggerCustom,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Comparison } from "@/components/comparison";
import TextAndImage from "@/components/text-and-image";
import { useIsTablet } from "@/hooks/use-is-mobile";
import { PRODUCT_NAME } from "@/config-global";

const tabs = ["Neck Pain", "Insomnia", "Snoring", "Shoulder Pain"];

const testimonials = [
  {
    tab: "Neck Pain",
    name: "Michelle​ L.",
    review:
      "This pillow exceeded my expectations! I've struggled with C5-C6 neck pain for a long time, and this is the first product that truly provides relief. The quality is excellent, and it’s so easy to use. I wake up with less stiffness and discomfort, feeling more refreshed. Highly recommend for anyone dealing with neck pain — it’s worth every penny!",
    rating: 5,
    image: "/purfect/comment1.webp",
  },
  {
    tab: "Insomnia",
    name: "Melissa G.",
    review:
      "Getting a full night’s sleep used to feel impossible, but this pillow has been a complete game-changer. I fall asleep faster, wake up less often, and finally feel truly rested in the morning. The comfort and support help me relax, and the high-quality design makes it a joy to use. It’s rare to find something that actually helps with insomnia, but this does exactly what I needed. Highly recommend!",
    rating: 5,
    image: "/purfect/comment2.webp",
  },
  {
    tab: "Shoulder pain",
    name: "Kimberly V.",
    review:
      "Dealing with shoulder pain every morning was my reality until I found this pillow. The support is perfectly balanced, relieving pressure on my shoulders and helping me sleep deeper through the night. It’s comfortable, well–made, and incredibly effective at reducing my pain. I finally feel like I’m waking up without that constant ache. If you struggle with shoulder pain, this is 100% worth it!",
    rating: 5,
    image: "/purfect/comment3.webp",
  },
  {
    tab: "Snoring",
    name: "David B.",
    review:
      "I never thought a pillow could make such a difference, but this one truly has! My snoring used to wake me (and my partner) up multiple times a night, but since using this, I sleep so much more peacefully. The support keeps my head and neck in the perfect position, helping me breathe better and reducing snoring significantly. The quality is fantastic, and it’s so comfortable. If you struggle with snoring, this is absolutely worth trying!",
    rating: 5,
    image: "/purfect/comment4.webp",
  },
];

const acc = [
  {
    title: "Shipping times & Returns",
    content: (
      <div className="space-y-2 text-base">
        <p>
          <strong>Shipping</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Secured shipping includes (Track &amp; Trace code)</li>
          <li>
            Orders are delivered to your home within 7-11 business days with
            track and trace code
            <br />
          </li>
        </ul>
        <p>
          <strong>Returns</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            We love our product and we&apos;re confident you will too! If
            you&apos;re not completely satisfied, you can easily return it
            within 100 days.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "Sleep Shouldn’t Hurt",
    content: (
      <div className="space-y-2 text-base">
        <p>
          That’s why we created the
          <strong> {PRODUCT_NAME} Premium Ergonomic Pillow</strong> — a sleep
          solution designed for{" "}
          <strong>people who are tired of waking up in pain.</strong>
        </p>
        <p>
          We didn’t just guess. This pillow is built on{" "}
          <strong>
            years of research, real-world testing, and feedback from people just
            like you.
          </strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Soft, adaptive memory foam</strong> gently supports your
            neck and shoulders all night.
          </li>
          <li>
            <strong>An ergonomic shape</strong> keeps your spine aligned —
            whether you sleep on your back, side, or toss and turn.
          </li>
          <li>
            <strong>A hollow center</strong> helps reduce ear pressure (great
            for side sleepers).
          </li>
          <li>
            <strong>Arm grooves</strong> let you rest comfortably without waking
            up with tingling or tension.
          </li>
          <li>
            <strong>
              And yes — it helps reduce snoring and sleep interruptions too.
            </strong>
          </li>
        </ul>
        <p>
          It’s soft. It’s breathable. And it comes with a removable, washable
          cover — because comfort shouldn’t be complicated.
        </p>
      </div>
    ),
  },
];

const acc2 = [
  {
    title: `Is ${PRODUCT_NAME} really different than other pillows?`,
    content: (
      <p>
        Yes. The <strong>{PRODUCT_NAME} pillow</strong> isn’t a generic pillow
        with a new cover — it was engineered specifically for alignment,
        comfort, and long-term relief.
      </p>
    ),
  },
  {
    title: "Does my purchase include a pillowcase?",
    content: (
      <p>
        Yes, the pillow comes with a pillowcase already fitted. If you’d like an
        additional one for convenience while the original is being washed, you
        can easily order an extra pillowcase.
      </p>
    ),
  },
  {
    title: "Can I use my own pillowcase?",
    content: (
      <p>
        Yes, you can use your own pillowcase. Keep in mind that it may not fit
        as snugly as the provided one, which could lead to a less tailored
        appearance.
      </p>
    ),
  },
  {
    title: "Not satisfied with the pillow? No problem!",
    content: (
      <p>
        We offer a 100-night trial. If you’re not completely satisfied, you can
        return the <strong>{PRODUCT_NAME} Pillow</strong> risk-free.
      </p>
    ),
  },
];

const options = [
  {
    title: "Buy 1 Pillow",
    description: "SALE ENDS TODAY",
    number: 0,
    tag: "",
    extra: 0,
  },
  {
    title: "Buy 2 Pillow",
    description: "+ FREE SHIPPING",
    number: 1,
    tag: "Most Popular",
    extra: 0.2,
  },
  {
    title: "Family Pack (3 Pillows)",
    description: "+ FREE SHIPPING",
    number: 2,
    tag: "Best Value",
    extra: 0.3,
  },
];

const benifests = [
  "Reduces Neck, Back, and Shoulder Pain",
  "Keeps your Spine in Alignment — All night",
  "Soft, Cooling memory foam",
];
export default function ProductView(data: { data: Product }) {
  const product = data.data;
  const { addProducts } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({ [product.options[0].name]: product.options[0].values[0] });

  const [variantSelected, setVariantSelected] = useState<ProductVariant | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("Neck Pain");

  const [optionNumber, setOptionNumber] = useState<{
    number: number;
    values: string[];
  }>({
    number: 0,
    values: [],
  });
  const isMobile = useIsTablet();
  const number = isMobile ? 1 : 3;
  useEffect(() => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant) {
      setSelectedOptions((prev) => ({
        ...prev,
        [product.options[0].name]: selectedVariant.selectedOptions[0].value,
      }));
      setVariantSelected(selectedVariant);
      setOptionNumber((prev) => ({
        ...prev,
        number: selectedVariant.selectedOptions.length - 1,
        values: selectedVariant.selectedOptions.map(
          (option: { name: string; value: string }) => option.value
        ),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!product) return null;

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev: Record<string, string>) => ({
      ...prev,
      [name]: value,
    }));
    setVariantSelected(getSelectedVariant());
    setOptionNumber((prev) => {
      const newValues = prev.values.fill(value);

      return {
        ...prev,
        values: newValues,
      };
    });
  };

  const getSelectedVariant = () => {
    if (!product) return null;

    const matchedVariant = product.variants.edges.find(
      (variant: { node: ProductVariant }) =>
        variant.node.selectedOptions.every(
          (opt: { name: string; value: string }) =>
            selectedOptions[opt.name] === opt.value
        )
    );

    return matchedVariant?.node || null;
  };

  const handleAddToCart = () => {
    const grouped: Record<
      string,
      {
        id: string;
        name: string;
        quantity: number;
        title: string;
        price: number;
        image: string;
        special: boolean;
        compareAtPrice?: number;
      }
    > = {};

    optionNumber.values.forEach((value) => {
      const selectedVariant = product.variants.edges.find(
        (variant: { node: ProductVariant }) =>
          variant.node.selectedOptions[0].value === value
      )?.node;

      if (!selectedVariant) return;

      const id = selectedVariant.id.split("/").pop() || "";

      if (grouped[id]) {
        grouped[id].quantity += 1;
      } else {
        grouped[id] = {
          id,
          name: product.title,
          quantity: 1,
          title: selectedVariant.title || "",
          price: parseFloat(selectedVariant.priceV2.amount || "0"),
          image: selectedVariant.image?.url || "",
          special: true,
          compareAtPrice: parseFloat(
            selectedVariant.compareAtPriceV2?.amount || "0"
          ),
        };
      }
    });

    const products = Object.values(grouped);

    addProducts(products);
  };

  // const productCart = {
  //   id: variant.node.id.split("/").pop() || "",
  //   name: product.title,
  //   price: parseFloat(variant.node.priceV2.amount),
  //   image: variant.node.image?.url || "",
  //   quantity: 1,
  //   title: variant.node.title,
  //   special: true,
  // };
  const getColor = (color: string) => {
    if (color.toLowerCase().includes("black")) return "bg-black";
    if (color.toLowerCase().includes("white")) return "bg-white";
    return "bg-gray-300";
  };

  const caculatePrice = (price: string, quantity: number, extra = 0) => {
    const priceNumber = parseFloat(price);
    return (priceNumber * quantity * (1 - extra)).toFixed(2);
  };

  const calculaSetOptionNumber = (number: number, value: string) => {
    if (number === optionNumber.number) return;
    if (number === 0) {
      setOptionNumber({
        number: 0,
        values: [value],
      });
    }
    if (number === 1) {
      setOptionNumber({
        number: 1,
        values: [value, value],
      });
    }
    if (number === 2) {
      setOptionNumber({
        number: 2,
        values: [value, value, value],
      });
    }
  };
  return (
    <div className="text-[#102a3e] ">
      <div className="rounded-lg">
        <div className="grid grid-cols-12 space-x-6 space-y-16">
          <div className="grid max-w-7xl p-4 col-span-12 mx-auto grid-cols-12">
            <section className="col-span-12  md:col-span-8">
              <ProductDetailCarousel
                slides={product.images.edges.map(
                  (img: { node: { url: string } }) => img.node.url
                )}
              />
            </section>

            <section className="flex flex-col  space-y-4 col-span-12 md:col-span-4">
              <div className="flex gap-1 text-xs">
                <span className="excellent" style={{ color: "#102A3E" }}>
                  &quot;EXCELLENT&quot;
                </span>
                <span className="stars">★★★★★</span>
                <span className="rating-text">
                  <b>4.8/5</b> | 9,250+ Reviews
                </span>
              </div>

              <h1 className="text-[#102a3e] text-4xl">{product.title}</h1>
              <div className="flex gap-2 items-center bg-gray-100 p-2 rounded-md">
                <Image
                  src="/purfect/linda.avif"
                  alt="Linda"
                  width={100}
                  height={100}
                  className="rounded-full object-cover size-12"
                />
                <div className="flex gap-1 flex-col ">
                  <p className="text-xs font-semibold">Linda Harris</p>
                  <span className="text-[#102a3e]  text-[10px] italic">
                    &quot;I’m 59 and used to wake up sore every morning. I’ve
                    tried at least six pillows, and none of them made a
                    difference. This one did — the very first night.&quot;
                  </span>
                </div>
              </div>
              <p className="flex gap-2 items-center">
                <span className="text-gray-400 text-sm font-semibold line-through">
                  {variantSelected?.compareAtPriceV2?.amount} USD
                </span>
                <span className="text-[#102a3e] text-2xl font-semibold">
                  {variantSelected?.priceV2.amount} USD
                </span>

                <span className="flex justify-center text-sm font-semibold items-center px-4 py-1 text-white bg-[#102A3E] rounded-full">
                  Flash Sale
                </span>
              </p>
              <div className="flex gap-2 flex-col text-sm">
                {benifests.map((item) => (
                  <div className="flex gap-2 items-center" key={item}>
                    <span className="flex gap-2 items-center justify-center size-4 rounded-full bg-[#102A3E]">
                      <CheckIcon
                        className="text-white size-3"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="text-[#102a3e]">{item}</span>
                  </div>
                ))}
              </div>
              <div>
                <span className="inline-flex text-xs items-center gap-1 p-2 bg-gray-100 rounded-md">
                  <CheckIcon
                    className="text-[#102A3E]"
                    strokeWidth={3}
                    size={16}
                  />{" "}
                  <strong>FREE</strong> Pillow Cover with every pillow!
                </span>
              </div>
              <h3 className="text-xl font-semibold"></h3>
              {product.options.map(
                (option: { id: string; name: string; values: string[] }) => (
                  <div className="space-y-4" key={option.name}>
                    <h4 className="text-base">
                      {" "}
                      Cover color - {selectedOptions[option.name]}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value: string) => (
                        <span
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`size-12 duration-500 transition-transform  flex items-center cursor-pointer  justify-center rounded-full text-base font-normal ${
                            selectedOptions[option.name] === value
                              ? " border-gray-800 border-2  "
                              : ""
                          }`}
                        >
                          <span
                            className={`size-10 block border-gray-200 border rounded-full ${getColor(
                              value
                            )} `}
                          ></span>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
              <p className="text-orange-500 flex items-center gap-2">
                <span className="inline-flex size-3 rounded-full bg-orange-500 animate-pulse "></span>
                <span>Limited stock - only 6 items available</span>
              </p>
              <p className=" flex items-center gap-2 ">
                <span className="h-0.5 flex-grow bg-gray-300"> </span>
                <span className="text-xs font-semibold text-[#102a3e] ">
                  FLASH SALE ENDS TODAY
                </span>
                <span className="h-0.5 flex-grow bg-gray-300"> </span>
              </p>

              {/* <h3> Description:</h3>
            {/* <h3> Price:</h3>
            {product.variants.edges.map((variant: { node: ProductVariant }) => (
              <p key={variant.node.id}>
                {variant.node.title} - {variant.node.priceV2.amount} USD
              </p>
            ))} */}
              {options.map((item, index) => (
                <label
                  onClick={() =>
                    calculaSetOptionNumber(
                      item.number,
                      selectedOptions[product.options[0].name]
                    )
                  }
                  className={`flex flex-col gap-1 relative bg-blue-50 cursor-pointer  text-[#102a3e] rounded-md   p-4 ${
                    item.number === optionNumber.number
                      ? "dark:border-gray-300 border border-gray-800 "
                      : "dark:border-gray-100 border border-gray-300"
                  }`}
                  key={item.number}
                  htmlFor={item.title}
                >
                  {!!item.tag && <CustomTag title={item.tag} />}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center relative space-x-4">
                      <RadioCustom
                        checked={item.number === optionNumber.number}
                      />
                      <div className="space-y-1">
                        {" "}
                        <p className="flex flex-wrap gap-1 items-center ">
                          <span className="text-lg">{item.title}</span>
                          <span className="bg-blue-100 px-2 py-1 text-xs rounded-lg">
                            {getDescription(item.extra)}
                          </span>
                        </p>
                        <p className="text-xs">{item.description}</p>
                      </div>
                    </div>
                    <div>
                      {" "}
                      <p className=" text-xl">
                        $
                        {caculatePrice(
                          variantSelected?.priceV2.amount || "0",
                          item.number + 1,
                          item.extra
                        )}
                      </p>
                      <p className="line-through text-gray-500 text-sm">
                        $
                        {(index + 1) *
                          parseFloat(
                            variantSelected?.compareAtPriceV2?.amount || "0"
                          )}
                      </p>
                    </div>
                  </div>
                  {item.number === optionNumber.number && !!item.number && (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs">Cover color</p>
                      {Array.from({ length: item.number + 1 }).map(
                        (_, index) => (
                          <div
                            className="flex gap-1 text-sm items-center"
                            key={index}
                          >
                            <span>#{index + 1}</span>
                            <Select
                              value={optionNumber.values[index]}
                              onValueChange={(value) =>
                                setOptionNumber((prev) => {
                                  const newValues = [...prev.values];
                                  newValues[index] = value;
                                  return {
                                    ...prev,
                                    values: newValues,
                                  };
                                })
                              }
                            >
                              <SelectTrigger className="w-[100px] h-8">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {product.options[0].values.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </label>
              ))}
              <Button className="h-12" onClick={handleAddToCart}>
                Add to cart
              </Button>
              <div className="flex justify-center">
                <span className="flex items-center text-sm gap-1">
                  <ArrowLeftRightIcon strokeWidth={3} size={18} /> Try it
                  risk-free for 100 nights
                </span>
              </div>
              <div className="pl-1 bg-red-500 rounded-md">
                <div className="bg-red-100 rounded-md text-red-500 text-[15px] p-4">
                  🚨 <strong>Watch out for Replicas</strong>. Only{" "}
                  <strong>{PRODUCT_NAME} </strong> guarantees the real pillow
                  trusted by thousands for pain relief.
                </div>
              </div>
              <div>
                <Accordion type="single" collapsible className="w-full">
                  {acc.map((item, index) => (
                    <AccordionItem key={item.title} value={`item-${index}`}>
                      <AccordionTriggerCustom className="text-2xl">
                        {item.title}
                      </AccordionTriggerCustom>
                      <AccordionContent>{item.content}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          </div>
          <section className="col-span-12 flex justify-center text-2xl">
            <h2 className="text-center">
              {" "}
              Over <strong>9250+</strong> Customers{" "}
              <span className="italic-part">
                <em>
                  <strong>Transformed</strong>
                </em>
                <em></em>
              </span>
              <em> </em>their sleep!{" "}
            </h2>
          </section>
          <section className="col-span-12 ">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center flex-wrap w-full md:gap-4 gap-2 mb-6">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    variant={activeTab === tab ? "default" : "outline"}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonials
                  .sort((a, b) => {
                    const aMatch = a.tab
                      .toLowerCase()
                      .includes(activeTab.toLowerCase());
                    const bMatch = b.tab
                      .toLowerCase()
                      .includes(activeTab.toLowerCase());

                    if (aMatch && !bMatch) return -1;
                    if (!aMatch && bMatch) return 1;
                    return 0;
                  })
                  .slice(0, number)
                  .map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md  "
                    >
                      <div className="flex gap-2 flex-col">
                        <span className="flex space-x-1"> ★★★★★</span>
                        <span className="text-[#102a3e] text-base font-semibold">
                          {item.tab}
                        </span>
                        <div className="flex gap-1 flex-col ">
                          <span className="text-[#102a3e]  text-sm italic">
                            &quot;{item.review}&quot;
                          </span>
                        </div>
                        <div className="flex mt-8 md:mt-16 space-x-2">
                          {" "}
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                            className="rounded-full object-cover size-12"
                          />
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="flex space-x-1 items-center text-sm">
                              <svg
                                className="mr-1"
                                width={13}
                                height={15}
                                viewBox="0 0 13 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5847 1.98343C11.8867 2.04983 12.1563 2.21913 12.3472 2.46237C12.5382 2.7056 12.6386 3.00763 12.6314 3.31677V6.00343C12.631 7.76098 12.1035 9.478 11.1171 10.9326C10.1307 12.3873 8.73071 13.5127 7.09807 14.1634C6.79712 14.2759 6.46569 14.2759 6.16474 14.1634C4.5321 13.5127 3.13214 12.3873 2.14574 10.9326C1.15934 9.478 0.631843 7.76098 0.631406 6.00343V3.2901C0.624193 2.98096 0.724652 2.67893 0.915588 2.4357C1.10652 2.19247 1.37606 2.02316 1.67807 1.95677L6.34474 0.923432C6.53301 0.876841 6.7298 0.876841 6.91807 0.923432L11.5847 1.98343Z"
                                  fill="#0E283C"
                                />
                                <path
                                  d="M6.11807 9.4301C5.94412 9.43115 5.77665 9.36416 5.6514 9.24343L4.1314 7.7501C4.06892 7.68813 4.01932 7.61439 3.98548 7.53315C3.95163 7.45191 3.9342 7.36478 3.9342 7.27677C3.9342 7.18876 3.95163 7.10162 3.98548 7.02038C4.01932 6.93914 4.06892 6.86541 4.1314 6.80343C4.25631 6.67927 4.42528 6.60957 4.6014 6.60957C4.77753 6.60957 4.94649 6.67927 5.0714 6.80343L6.12474 7.83677L8.86474 5.1701C8.92733 5.10838 9.00147 5.05959 9.08292 5.02652C9.16438 4.99346 9.25154 4.97675 9.33945 4.97737C9.42736 4.97799 9.51428 4.99592 9.59526 5.03013C9.67623 5.06434 9.74968 5.11417 9.8114 5.17677C9.87312 5.23936 9.92191 5.3135 9.95498 5.39496C9.98805 5.47641 10.0047 5.56357 10.0041 5.65148C10.0035 5.73939 9.98558 5.82631 9.95137 5.90729C9.91716 5.98827 9.86733 6.06171 9.80474 6.12343L6.59807 9.27677C6.46429 9.38871 6.29197 9.44375 6.11807 9.4301Z"
                                  fill="white"
                                />
                              </svg>
                              <span>Verified Buyer</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
          <section className="col-span-12 ">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8  bg-white text-gray-800">
              {/* Text Section */}
              <div className="w-full lg:w-1/2">
                <p className="text-sm text-gray-500 uppercase mb-2">
                  Only available at {PRODUCT_NAME}
                </p>
                <h2 className="text-2xl lg:text-4xl font-bold mb-4">
                  Wake Up Without the Aches and Pains
                </h2>
                <p className="mb-4">
                  Neck and shoulder pain. Waking up with tension or headaches.
                  Struggling to fall — or stay — asleep.
                </p>
                <p className="font-semibold mb-4">
                  If that sounds familiar, you’re not alone.
                </p>
                <p className="mb-4">
                  For so many people, the real problem is alignment. When your
                  head, neck, and spine aren&apos;t supported properly during
                  the night,
                  <span className="font-semibold">
                    {" "}
                    your body stays tense — and you never get the rest you need.
                  </span>
                </p>
                <p className="mb-4">
                  That’s why we created the {PRODUCT_NAME} Premium Ergonomic
                  Pillow:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    <strong>Relieves neck and shoulder pain</strong> caused by
                    poor sleep posture
                  </li>
                  <li>
                    <strong>Supports healthy alignment</strong> — no matter how
                    you sleep
                  </li>
                  <li>
                    <strong>Reduces tension</strong> that leads to morning
                    headaches and restlessness
                  </li>
                  <li>
                    <strong>Helps minimize snoring</strong> and sleep
                    interruptions
                  </li>
                  <li>
                    <strong>Gentle armrest design</strong> prevents shoulder
                    pressure and numbness
                  </li>
                  <li>
                    <strong>Soft, high-quality memory foam</strong> for
                    all-night comfort
                  </li>
                </ul>
                <p className="mt-6">
                  Invest in your health and enjoy better sleep with the{" "}
                  {PRODUCT_NAME}
                  Pillow.
                </p>
              </div>

              {/* Image Section */}
              <div className="w-full lg:w-1/2">
                <Image
                  width={800}
                  height={800}
                  src="/purfect/pillow1.webp"
                  alt={`Woman resting on ${PRODUCT_NAME} pillow`}
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          </section>
          <section className="col-span-12 space-y-4">
            <h2 className="text-4xl text-center font-semibold">
              Save Your Neck
            </h2>
            <div className="space-y-4 text-center">
              {" "}
              <p>
                <strong>{PRODUCT_NAME}</strong> is made to finally take the
                pressure off your neck — with gentle, targeted support that
                actually lasts through the night. When your neck is aligned
                properly, you don’t wake up stiff, sore, or tense.
                <br />
                <br />
                You feel rested. You feel like yourself again.
              </p>
              <p>
                By keeping your head and spine in a natural position,{" "}
                <strong>{PRODUCT_NAME}</strong> helps reduce the daily strain
                that causes pain, tension, and poor sleep — so every night
                becomes part of your healing routine.
              </p>
            </div>
          </section>
          <section className="col-span-12">
            <div className="max-w-7xl mx-auto">
              <Comparison
                before="/purfect/pillow-before.png"
                after="/purfect/pillow-after.png"
              />
            </div>
          </section>
          <section className="col-span-12 space-y-4 ">
            <TextAndImage
              src="/purfect/pillow2.png"
              alt="d"
              description={`What Makes the ${PRODUCT_NAME} Pillow So Special`}
              title=""
              content={
                <p>
                  Unlike standard pillows, <strong>{PRODUCT_NAME} </strong>holds
                  its form and keeps your neck supported all night.
                  <br />
                  <br />
                  The difference? You feel it the moment you wake up.
                </p>
              }
            />
          </section>
          <section className="col-span-12  space-y-4">
            <TextAndImage
              src="/purfect/pillow3.webp"
              alt="d"
              description="— Dr. M. Levinson, Sleep Health Specialist"
              title=""
              content={
                <div className="space-y-4">
                  <p>
                    After <strong>26 years </strong>treating patients
                    <strong>
                      {" "}
                      with chronic neck pain, poor sleep, and shoulder tension
                    </strong>
                    , I hit a turning point —{" "}
                    <strong>when my own sleep was affected too.</strong>
                  </p>
                  <p>
                    That’s why I <strong>helped design this pillow</strong>: to
                    keep the neck in alignment without forcing the body into a
                    position it can’t maintain.
                  </p>
                  <p>
                    It&apos;s{" "}
                    <strong>
                      simple, supportive, and made to relieve pain{" "}
                    </strong>
                    — not manage it. My patients say it’s the{" "}
                    <strong>first real relief they’ve had in years.</strong>
                  </p>
                </div>
              }
            />
          </section>
          <section className="col-span-3 hidden md:block space-y-4"></section>
          <section className="col-span-12 md:col-span-6  space-y-4">
            <h2 className="text-4xl text-center font-semibold">
              HAVE QUESTIONS? WE&apos;RE HERE TO HELP!
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {acc2.map((item, index) => (
                <AccordionItem key={item.title} value={`item-${index}`}>
                  <AccordionTriggerCustom className="text-2xl">
                    {item.title}
                  </AccordionTriggerCustom>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          <section className="col-span-3 hidden md:block space-y-4"></section>
        </div>
      </div>
    </div>
  );
}

const getDescription = (extra: number) => {
  if (extra) return `EXTRA ${extra * 100} % OFF`;
  return "70% SALE";
};

const CustomTag = ({ title }: { title: string }) => {
  return (
    <span className="absolute text-white top-[-12px] right-1 inline-flex ">
      <span className="inline-block w-0 h-0 border-solid border-t-0 border-r-0 border-l-[12px] border-b-[12px] border-l-transparent border-r-transparent border-t-transparent border-b-[#102a3e]"></span>
      <span className="bg-[#102a3e] py-0.5 px-2 rounded-b-md"> {title}</span>
      <span className="inline-block w-0 h-0 border-solid border-t-[12px] border-r-0 border-l-[12px] border-b-0 border-l-[#102a3e] border-r-transparent border-t-transparent border-b-transparent"></span>
    </span>
  );
};

const RadioCustom = ({ checked }: { checked: boolean }) => {
  return (
    <div
      className={`flex border-2 shrink-0  items-center justify-center rounded-full size-6 ${
        checked ? "border-accent-foreground/80" : "border-accent-foreground/40"
      }`}
    >
      <span
        className={`${
          checked ? "size-3 bg-accent-foreground/80" : ""
        } rounded-full`}
      ></span>
    </div>
  );
};
