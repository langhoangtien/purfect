"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNextCustom,
  CarouselPreviousCustom,
} from "@/components/ui/carousel";

import NavMobile from "./nav-mobile";
import { useIsTablet } from "@/hooks/use-is-mobile";
import NavDesktop from "./nav-desktop";

export default function Header() {
  const isMobile = useIsTablet();
  return (
    <header className="w-full text-white">
      {/* <CarouselHeader /> */}
      <div className="mx-auto max-w-7xl p-4">
        {" "}
        {isMobile ? <NavMobile /> : <NavDesktop />}
      </div>
    </header>
  );
}

export function CarouselHeader() {
  return (
    <div className="flex bg-gray-900 justify-center">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}
        className="max-w-6xl mx-auto"
      >
        <CarouselContent>
          {[
            "USA Made",
            "30 Day Money Back Guarantee",
            "Up To 50% OFF + Free Shipping",
            "Total Wellness In a Bottle",
            "Ancient Blend",
          ].map((text) => (
            <CarouselItem key={text}>
              <p className="text-center p-2">{text}</p>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPreviousCustom className="text-gray-400" />
        <CarouselNextCustom className="text-gray-400" />
      </Carousel>
    </div>
  );
}
