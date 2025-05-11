import { PRODUCT_NAME } from "@/config-global";
import Image from "next/image";
import Link from "next/link";

export default function SectionOne() {
  return (
    <div className="grid max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 gap-4">
      <Image
        width={800}
        height={800}
        src="/purfect/pillow4.webp"
        alt="Section One"
        className="w-full h-auto"
      />
      <div className="space-y-4 flex flex-col justify-center items-center p-8 text-center">
        <h2 className="text-5xl font-semibold">Unmatched Sleep Awaits.</h2>
        <h2 className="text-2xl font-">
          {PRODUCT_NAME}: Unmatched quality, designed for superior sleep.
        </h2>
        <div>
          <Link href="/products/optilifetech-pain-relief-ergonomic-pillow">
            <span className="flex group flex-col space-y-1">
              {" "}
              <span>Shop now</span>
              <span className="w-full group-hover:bg-primary h-0.5 bg-transparent"></span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
