import { COMPANY_NAME } from "@/config-global";
import Image from "next/image";
import Link from "next/link";

export default function SectionOne() {
  return (
    <div className="grid max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 gap-4">
      <Image
        width={800}
        height={800}
        src="/purfect/pillow4.webp"
        alt="Sektion Ett"
        className="w-full h-auto"
      />
      <div className="space-y-4 flex flex-col justify-center items-center p-8 text-center">
        <h2 className="text-5xl font-semibold">Oöverträffad sömn väntar.</h2>
        <h2 className="text-2xl">
          {COMPANY_NAME}: Enastående kvalitet, designad för överlägsen sömn.
        </h2>
        <div>
          <Link href="/products/naturaeon-pain-relief-ergonomic-pillow">
            <span className="flex group flex-col space-y-1">
              <span>Handla nu</span>
              <span className="w-full bg-primary h-0.5 "></span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
