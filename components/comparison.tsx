"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

import React, { useState, useRef, useEffect } from "react";

interface ComparisonProps {
  before: string;
  after: string;
}

export function Comparison({ before, after }: ComparisonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLImageElement>(null);

  const updatePosition = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));

    if (afterRef.current) {
      afterRef.current.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    }
    if (barRef.current) {
      barRef.current.style.left = `${position}%`;
    }
    if (buttonRef.current) {
      buttonRef.current.style.left = `${position}%`;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) updatePosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const stopDragging = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", stopDragging);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopDragging);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-md bg-blue-50">
      <div
        ref={sliderRef}
        className="comparison-slider aspect-square relative w-full"
      >
        {/* Before Image */}
        <Image
          width={800}
          height={800}
          src={after}
          className="absolute w-full h-full object-cover"
          alt="Before"
        />
        {/* After Image */}
        <Image
          width={800}
          height={800}
          ref={afterRef}
          src={before}
          className="absolute w-full h-full object-cover clip-right"
          alt="After"
        />
        {/* Slider Bar */}
        <div
          ref={barRef}
          className="slider-bar absolute w-0.5 bg-black h-full left-1/2 top-0 transform -translate-x-1/2"
        />
        {/* Drag Button */}
        <div
          ref={buttonRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="slider-button absolute size-9 border-2  grid place-content-center bg-black border-none rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-ew-resize"
        >
          <span className="flex space-x-0 w-full p-1 justify-center h-full rounded-full ">
            <ChevronLeft size={16} className="text-white" />
            <ChevronRight size={16} className="text-white" />
          </span>
        </div>
      </div>
      {/* Review Section */}
      <span className="absolute top-2 left-2 p-1  bg-gray-100 ">Before</span>
      <span className="absolute bottom-2 right-2 p-1 bg-gray-100">After</span>
    </div>
  );
}
