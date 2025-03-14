import type { Metadata } from "next";

import Newsletter from "@/components/news-letter";

import Logo from "@/components/logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Purfect Fuel Blend",
  description: "Purfect Fuel Blend",
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="w-full text-white">
        <div className="mx-auto max-w-7xl p-4">
          {" "}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex justify-between items-center space-x-1 py-2 px-4">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      {children}
      <Newsletter />
      <footer className="bg-gray-100 text-gray-400">
        <div className="mx-auto max-w-7xl p-4">
          <ul className="flex flex-wrap gap-4 ">
            {/*[*/}
            <li>
              <Link className="underline" href="#">
                Refund policy
              </Link>
            </li>
            <li>
              <Link className="underline" href="#">
                Shipping policy
              </Link>
            </li>
            <li>
              <Link className="underline" href="#">
                Terms of service
              </Link>
            </li>
            {/*]*/}
            <li>
              <Link className="underline" href="#">
                DMCA
              </Link>
            </li>
            {/**/}
            <li>
              <span className="p3 mr-4">
                I consent to receive recurring automated marketing by text
                message through an automatic telephone dialing system. Consent
                is not a condition to purchase. STOP to cancel, HELP for help.
                Message and Data rates apply.
              </span>
              {/**/}
              <Link className="underline" href="#">
                View Privacy Policy
              </Link>
              <span className="p3 mr-4"> &amp; </span>
              <Link className="underline" href="#">
                ToS.{" "}
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
