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
import { ArrowLeftRightIcon, CheckIcon, XIcon } from "lucide-react";
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
import { useTranslation } from "next-i18next";

const tabs = ["Nacksmärta", "Sömnlöshet", "Snarkning", "Axelsmärta"];

const testimonials = [
  {
    tab: "Nacksmärta",
    name: "Lena Karlsson",
    review:
      "Denna kudde överträffade mina förväntningar! Jag har haft problem med smärta i C5-C6 under lång tid, och detta är den första produkten som verkligen lindrat det. Kvaliteten är fantastisk och den är så enkel att använda. Jag vaknar upp mindre stel och mer utvilad. Rekommenderas varmt till alla med nackproblem – den är värd varje krona!",
    rating: 5,
    image: "/purfect/comment1.webp",
  },
  {
    tab: "Sömnlöshet",
    name: "Emma Andersson",
    review:
      "Att få en hel natts sömn brukade kännas omöjligt, men denna kudde har förändrat allt. Jag somnar snabbare, vaknar mindre under natten och känner mig äntligen riktigt utvilad. Den är bekväm och ger ett skönt stöd, och kvalitén är hög. Det är ovanligt att något verkligen fungerar mot sömnproblem, men denna kudde gör det. Rekommenderas starkt!",
    rating: 5,
    image: "/purfect/comment2.webp",
  },
  {
    tab: "Axelsmärta",
    name: "Sofia Nilsson",
    review:
      "Jag vaknade varje morgon med axelsmärta – tills jag hittade denna kudde. Stödet är perfekt balanserat och minskar trycket på axlarna, vilket hjälper mig att sova djupare. Den är otroligt bekväm och välgjord, och verkligen effektiv. Om du har ont i axlarna är denna kudde ett måste!",
    rating: 5,
    image: "/purfect/comment3.webp",
  },
  {
    tab: "Snarkning",
    name: "Johan Eriksson",
    review:
      "Jag trodde inte att en kudde kunde göra sådan skillnad – men denna har verkligen hjälpt mig! Min snarkning brukade väcka både mig och min partner flera gånger varje natt. Nu sover jag mycket lugnare. Kudden håller huvudet och nacken i rätt position, vilket förbättrar andningen och minskar snarkning. Fantastisk kvalitet och väldigt bekväm!",
    rating: 5,
    image: "/purfect/comment4.webp",
  },
];

const acc = [
  {
    title: "Leveranstider & Returpolicy",
    content: (
      <div className="space-y-2 text-base">
        <p>
          <strong>Leverans</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Säker leverans med spårningskod (Track & Trace)</li>
          <li>
            Beställningar levereras hem till dig inom 7–11 arbetsdagar med
            spårningsinformation.
            <br />
          </li>
        </ul>
        <p>
          <strong>Returer</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Vi älskar vår produkt och vi är säkra på att du också kommer göra
            det! Om du inte är helt nöjd kan du enkelt returnera den inom 100
            dagar.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "Sömn ska inte göra ont",
    content: (
      <div className="space-y-2 text-base">
        <p>
          Det är därför vi skapade
          <strong> {PRODUCT_NAME} Premium Ergonomisk Kudde</strong> — en
          sömnlösning framtagen för{" "}
          <strong>personer som är trötta på att vakna med smärta.</strong>
        </p>
        <p>
          Vi gissade inte. Denna kudde bygger på{" "}
          <strong>
            år av forskning, praktiska tester och feedback från människor som
            du.
          </strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Mjuk, anpassningsbar minnesskum</strong> ger stöd åt din
            nacke och dina axlar hela natten.
          </li>
          <li>
            <strong>Ergonomisk form</strong> håller din ryggrad i rätt linje —
            oavsett om du sover på rygg, sida eller byter position ofta.
          </li>
          <li>
            <strong>Ihåligt centrum</strong> minskar trycket mot örat (perfekt
            för sidosovare).
          </li>
          <li>
            <strong>Armspår</strong> gör det bekvämt att vila utan att vakna med
            domningar eller spänningar.
          </li>
          <li>
            <strong>
              Och ja — den hjälper även till att minska snarkning och
              sömnavbrott.
            </strong>
          </li>
        </ul>
        <p>
          Den är mjuk. Den andas. Och den har ett avtagbart, tvättbart överdrag
          — för komfort ska inte vara komplicerat.
        </p>
      </div>
    ),
  },
];

const acc2 = [
  {
    title: `Är ${PRODUCT_NAME} verkligen annorlunda jämfört med andra kuddar?`,
    content: (
      <p>
        Ja. <strong>{PRODUCT_NAME}-kudden</strong> är inte en vanlig kudde med
        nytt överdrag — den är specifikt utformad för korrekt stöd, komfort och
        långsiktig smärtlindring.
      </p>
    ),
  },
  {
    title: "Ingår örngott i mitt köp?",
    content: (
      <p>
        Ja, kudden levereras med ett örngott redan påsatt. Om du vill ha ett
        extra örngott för bekvämlighet när det första tvättas, kan du enkelt
        beställa ett till.
      </p>
    ),
  },
  {
    title: "Kan jag använda mitt eget örngott?",
    content: (
      <p>
        Ja, du kan använda ditt eget örngott. Men tänk på rằng det kanske inte
        passar lika perfekt som det som medföljer, vilket kan ge ett mindre
        snyggt utseende.
      </p>
    ),
  },
  {
    title: "Inte nöjd med kudden? Inga problem!",
    content: (
      <p>
        Vi erbjuder 100 nätters provperiod. Om du inte är helt nöjd kan du
        returnera
        <strong> {PRODUCT_NAME}-kudden</strong> helt riskfritt.
      </p>
    ),
  },
];

const options = [
  {
    title: "Köp 1 kudde",
    description: "REA SLUTAR IDAG",
    number: 0,
    tag: "",
    extra: 0,
  },
  {
    title: "Köp 2 kuddar",
    description: "+ FRI FRAKT",
    number: 1,
    tag: "Mest populär",
    extra: 0.2,
  },
  {
    title: "Familjepaket (3 kuddar)",
    description: "+ FRI FRAKT",
    number: 2,
    tag: "Bästa värdet",
    extra: 0.3,
  },
];

const benifests = [
  "Minskar smärta i nacke, rygg och axlar",
  "Håller ryggraden i rätt position – hela natten",
  "Mjukt och svalkande minnesskum",
];
export default function ProductView(data: { data: Product }) {
  const product = data.data;
  const { addProducts } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({ [product.options[0].name]: product.options[0].values[0] });
  useTranslation();
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

  const caculatePrice = (price: string, quantity: number) => {
    const priceNumber = parseFloat(price);
    let extra = 0.3;
    if (quantity === 1) extra = 0;
    if (quantity === 2) extra = 0.2;
    if (quantity === 3) extra = 0.3;
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
        <div className="grid grid-cols-12 p-4 md:space-x-6 space-y-16">
          <div className="grid max-w-7xl  col-span-12 mx-auto grid-cols-12">
            <section className="col-span-12  md:col-span-8">
              <ProductDetailCarousel
                slides={product.images.edges.map(
                  (img: { node: { url: string } }) => img.node.url
                )}
              />
            </section>

            <section className="flex flex-col space-y-4 col-span-12 md:col-span-4">
              <div className="flex gap-1 text-xs">
                <span className="excellent" style={{ color: "#102A3E" }}>
                  &quot;Kundbetyg&quot;
                </span>
                <span className="stars">★★★★★</span>
                <span className="rating-text">
                  <b>4.8/5</b> | 9 250+ Recensioner
                </span>
              </div>

              <h1 className="text-[#102a3e] text-4xl uppercase">
                {product.title}
              </h1>

              <div className="flex gap-2 items-center bg-gray-100 p-2 rounded-md">
                <Image
                  src="/purfect/linda.avif"
                  alt="Linda"
                  width={100}
                  height={100}
                  className="rounded-full object-cover size-12"
                />
                <div className="flex gap-1 flex-col">
                  <p className="text-xs font-semibold">Eva Larsson</p>
                  <span className="text-[#102a3e] text-[10px] italic">
                    &quot;Jag är 59 och vaknade tidigare varje morgon med värk.
                    Jag har provat minst sex olika kuddar, och ingen fungerade —
                    förrän denna. Redan första natten gjorde skillnad.&quot;
                  </span>
                </div>
              </div>

              <p className="flex gap-2 items-center">
                <span className="text-gray-400 text-sm font-semibold line-through">
                  {parseFloat(
                    variantSelected?.compareAtPriceV2?.amount || "0"
                  ) *
                    (optionNumber.number + 1)}{" "}
                  USD
                </span>
                <span className="text-[#102a3e] text-2xl font-semibold">
                  {caculatePrice(
                    variantSelected?.priceV2.amount || "0",
                    optionNumber.number + 1
                  )}{" "}
                  USD
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

              {product.options.map((option) => (
                <div className="space-y-4" key={option.name}>
                  <h4 className="text-base">
                    {" "}
                    Välj färg - {selectedOptions[option.name]}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <span
                        key={value}
                        onClick={() => handleOptionChange(option.name, value)}
                        className={`size-12 duration-500 transition-transform flex items-center cursor-pointer justify-center rounded-full text-base font-normal ${
                          selectedOptions[option.name] === value
                            ? " border-gray-800 border-2 "
                            : ""
                        }`}
                      >
                        <span
                          className={`size-10 block border-gray-200 border rounded-full ${getColor(
                            value
                          )}`}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              <p className="text-orange-500 flex items-center gap-2">
                <span className="inline-flex size-3 rounded-full bg-orange-500 animate-pulse" />
                <span>Begränsat lager – endast 6 kvar</span>
              </p>

              <p className="flex items-center gap-2">
                <span className="h-0.5 flex-grow bg-gray-300" />
                <span className="text-xs font-semibold text-[#102a3e]">
                  BLIXTREA SLUTAR IDAG
                </span>
                <span className="h-0.5 flex-grow bg-gray-300" />
              </p>

              {options.map((item, index) => (
                <label
                  onClick={() =>
                    calculaSetOptionNumber(
                      item.number,
                      selectedOptions[product.options[0].name]
                    )
                  }
                  className={`flex flex-col gap-1 relative bg-blue-50 cursor-pointer text-[#102a3e] rounded-md p-4 ${
                    item.number === optionNumber.number
                      ? "dark:border-gray-300 border border-gray-800"
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
                        <p className="flex flex-wrap gap-1 items-center">
                          <span className="text-lg">{item.title}</span>
                          <span className="bg-blue-100 px-2 py-1 text-xs rounded-lg">
                            {getDescription(item.extra)}
                          </span>
                        </p>
                        <p className="text-xs">{item.description}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xl">
                        $
                        {caculatePrice(
                          variantSelected?.priceV2.amount || "0",
                          item.number + 1
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
                      <p className="text-xs">Färg på överdrag</p>
                      {Array.from({ length: item.number + 1 }).map(
                        (_, index) => (
                          <div
                            className="flex gap-1 text-sm items-center"
                            key={index}
                          >
                            <span>#{index + 1}</span>
                            <Select
                              value={optionNumber.values[index]}
                              onValueChange={(value) => {
                                const newValues = [...optionNumber.values];
                                newValues[index] = value;
                                setOptionNumber({
                                  ...optionNumber,
                                  values: newValues,
                                });
                              }}
                            >
                              <SelectTrigger className="w-[100px] h-8">
                                <SelectValue placeholder="Välj" />
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
                Lägg till i kundvagnen
              </Button>

              <div className="flex justify-center">
                <span className="flex items-center text-sm gap-1">
                  <ArrowLeftRightIcon strokeWidth={3} size={18} /> Prova
                  riskfritt i 100 nätter
                </span>
              </div>

              <div className="pl-1 bg-red-500 rounded-md">
                <div className="bg-red-100 rounded-md text-red-500 text-[15px] p-4">
                  🚨 <strong>Varning för kopior</strong>. Endast{" "}
                  <strong>{PRODUCT_NAME}</strong> garanterar den äkta kudden som
                  tusentals litar på för smärtlindring.
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
              Över <strong>9&nbsp;250+</strong> nöjda kunder har{" "}
              <span className="italic-part">
                <em>
                  <strong>förbättrat</strong>
                </em>
              </span>{" "}
              sin sömn!
            </h2>
          </section>

          <section className="col-span-12">
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
                      className="flex flex-col gap-2 bg-gray-100 p-4 rounded-md"
                    >
                      <div className="flex gap-2 flex-col">
                        <span className="flex space-x-1"> ★★★★★</span>
                        <span className="text-[#102a3e] text-base font-semibold">
                          {item.tab}
                        </span>
                        <div className="flex gap-1 flex-col ">
                          <span className="text-[#102a3e] text-sm italic">
                            &quot;{item.review}&quot;
                          </span>
                        </div>
                        <div className="flex mt-8 md:mt-16 space-x-2">
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
                              <span>Verifierad kund</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="col-span-12">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-8 bg-white text-gray-800">
              {/* Textdel */}
              <div className="w-full lg:w-1/2">
                <p className="text-sm text-gray-500 uppercase mb-2">
                  Endast tillgänglig hos {PRODUCT_NAME}
                </p>
                <h2 className="text-2xl lg:text-4xl font-bold mb-4">
                  Vakna utan värk och stelhet
                </h2>
                <p className="mb-4">
                  Nack- och axelsmärta. Du vaknar med spänningar eller
                  huvudvärk. Svårt att somna — eller att sova hela natten.
                </p>
                <p className="font-semibold mb-4">
                  Känns det bekant? Du är inte ensam.
                </p>
                <p className="mb-4">
                  För många är det verkliga problemet att kroppen inte är i rätt
                  linje. När huvud, nacke och ryggrad inte stöds korrekt under
                  natten
                  <span className="font-semibold">
                    blir kroppen spänd – och du får aldrig den vila du behöver.
                  </span>
                </p>
                <p className="mb-4">
                  Därför skapade vi {PRODUCT_NAME} Premium Ergonomisk Kudde:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    <strong>Lindrar smärta i nacke och axlar</strong> orsakad av
                    dålig sovställning
                  </li>
                  <li>
                    <strong>Stödjer en hälsosam kroppshållning</strong> –
                    oavsett hur du sover
                  </li>
                  <li>
                    <strong>Minskar spänningar</strong> som leder till huvudvärk
                    och rastlöshet på morgonen
                  </li>
                  <li>
                    <strong>Hjälper till att minska snarkning</strong> och
                    avbrott i sömnen
                  </li>
                  <li>
                    <strong>Skonsam armstödsdesign</strong> förhindrar tryck på
                    axlarna och domningar
                  </li>
                  <li>
                    <strong>Mjuk, högkvalitativt minnesskum</strong> för komfort
                    hela natten
                  </li>
                </ul>
                <p className="mt-6">
                  Investera i din hälsa och njut av bättre sömn med{" "}
                  {PRODUCT_NAME}-kudden.
                </p>
              </div>

              {/* Bilddel */}
              <div className="w-full lg:w-1/2">
                <Image
                  width={800}
                  height={800}
                  src="/purfect/pillow1.webp"
                  alt={`Kvinna som vilar på ${PRODUCT_NAME}-kudden`}
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          </section>

          <section className="col-span-12 space-y-4">
            <h2 className="text-4xl text-center font-semibold">
              Skona din nacke
            </h2>
            <div className="space-y-4 text-center">
              <p>
                <strong>{PRODUCT_NAME}</strong> är utformad för att äntligen
                avlasta din nacke — med skonsamt och riktat stöd som håller hela
                natten. När nacken ligger i rätt position vaknar du inte upp
                stel, öm eller spänd.
                <br />
                <br />
                Du känner dig utvilad. Du känner dig som dig själv igen.
              </p>
              <p>
                Genom att hålla huvudet och ryggraden i en naturlig ställning
                hjälper <strong>{PRODUCT_NAME}</strong> till att minska den
                dagliga belastningen som orsakar smärta, spänningar och dålig
                sömn — så att varje natt blir en del av din återhämtning.
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
          <section className="col-span-12 space-y-4">
            <div className="mt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Phần chữ */}
                <div className="flex items-center justify-center">
                  <div>
                    <div className="flex flex-col space-y-4 justify-start">
                      <p className="text-primary text-lg font-semibold"></p>
                      <p className="text-3xl font-bold">{`Vad gör ${PRODUCT_NAME}-kudden så unik?`}</p>
                      <p>
                        Till skillnad från vanliga kuddar behåller{" "}
                        <strong>{PRODUCT_NAME}</strong> sin form och ger stöd åt
                        nacken hela natten.
                        <br />
                        <br />
                        Skillnaden? Du känner den direkt när du vaknar.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Hình ảnh */}
                <div className={`flex-1`}>
                  <div className="bg-white rounded-md shadow border border-gray-300 ">
                    <h2 className="text-3xl md:text-4xl font-bold mt-4 text-center mb-8">
                      VARFÖR VI STICKER UT
                    </h2>
                    <div className="grid grid-cols-3  overflow-hidden ">
                      <div className="bg-white p-4 font-semibold text-sm sm:text-base">
                        <div className="py-3 border-b h-16 border-gray-300"></div>
                        {[
                          "Nackstöd",
                          "Tryckavlastning",
                          "Ryggradsjustering",
                          "Individuell passform",
                          "Tryckfördelning",
                          "Hållbarhet",
                          "Premiumkvalitet",
                        ].map((item, index) => (
                          <div
                            key={item}
                            className="py-3 border-b flex space-x-1 h-16 items-center border-gray-300"
                          >
                            <Image
                              alt={item}
                              className="size-10 object-cover"
                              width={100}
                              height={100}
                              src={`/purfect/${index + 1}.jpg`}
                            ></Image>{" "}
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-primary text-white p-4 text-center text-sm sm:text-base">
                        <div className="py-3 border-b h-16 border-gray-500 font-bold">
                          NATURAEON
                        </div>
                        {Array(7)
                          .fill(true)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="py-3 border-b-[1px] h-16 flex justify-center items-center  border-gray-500 "
                            >
                              <span className="size-7 flex justify-center items-center border text-white border-gray-200 rounded-full">
                                {" "}
                                <CheckIcon className="size-5" strokeWidth={3} />
                              </span>
                            </div>
                          ))}
                      </div>

                      <div className="bg-gray-50 text-gray-500 p-4 text-center text-sm sm:text-base">
                        <div className="py-3 border-b h-16 border-gray-200 font-semibold">
                          Vanlig kudde
                        </div>
                        {Array(7)
                          .fill(false)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="py-3 border-b flex h-16 justify-center items-center border-gray-200"
                            >
                              {" "}
                              <span className="size-7 flex justify-center items-center border text-gray-400 border-gray-400 rounded-full">
                                <XIcon className=" size-5" strokeWidth={3} />
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="col-span-12 space-y-4">
            <TextAndImage
              src="/purfect/pillow3.webp"
              alt="d"
              description="— Dr. M. Levinson, Specialist på sömnhälsa"
              title=""
              content={
                <div className="space-y-4">
                  <p>
                    Efter <strong>26 års</strong> behandling av patienter
                    <strong>
                      med kronisk nacksmärta, sömnproblem och spänningar i
                      axlarna
                    </strong>
                    kom en vändpunkt —{" "}
                    <strong>när min egen sömn började påverkas.</strong>
                  </p>
                  <p>
                    Det är därför jag{" "}
                    <strong>var med och tog fram den här kudden</strong>: för
                    att hålla nacken i rätt position utan att tvinga kroppen
                    till något onaturligt.
                  </p>
                  <p>
                    Den är{" "}
                    <strong>
                      enkel, stödjande och framtagen för att lindra smärta
                    </strong>{" "}
                    — inte bara hantera den. Mina patienter säger att det är
                    <strong>
                      den första riktiga lättnaden de upplevt på flera år.
                    </strong>
                  </p>
                </div>
              }
            />
          </section>
          <section className="col-span-3 hidden md:block space-y-4"></section>
          <section className="col-span-12 md:col-span-6 space-y-4">
            <h2 className="text-4xl text-center font-semibold">
              HAR DU FRÅGOR? VI FINNS HÄR FÖR DIG!
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
