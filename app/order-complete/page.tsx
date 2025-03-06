"use client";
import OrderCompleteIllustration from "@/assets/illustrations/order-complete-illustration";
import { MotionContainer } from "@/components/animate/motion-container";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, CloudDownloadIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-80 h-screen">
      <MotionContainer>
        <h1 className="text-3xl text-center font-bold">
          Thank you for your purchase!
        </h1>

        <OrderCompleteIllustration />
        <p>Thanks for placing order</p>
        <p className="text-center text-gray-500">
          We will send you a notification within 5 days when it ships. If you
          have any question or queries then fell to get in contact us. All the
          best,
        </p>
        <div className="flex space-x-8">
          <Link href="/">
            <Button variant="outline">
              <ChevronLeftIcon strokeWidth={1.5} /> Continue shopping
            </Button>
          </Link>
          <Button>
            Download as PDF <CloudDownloadIcon strokeWidth={1.5} />
          </Button>
        </div>
      </MotionContainer>
    </div>
  );
}
