import PaymentMethods from "@/components/paymnet-methods";
import { COMPANY_NAME } from "@/config-global";
import Image from "next/image";
import Link from "next/link";

const MENU = [
  {
    title: "MER INFORMATION",
    items: [
      { title: "Spåra beställning", link: "/track-order" },
      { title: "Om oss", link: "/about-us" },
      // { title: "Blogg", link: "/blogs" },
      { title: "Kontakta oss", link: "/contact-us" },
      { title: "Vanliga frågor (FAQs)", link: "/faqs" },
    ],
  },
  {
    title: "POLICY",
    items: [
      { title: "Användarvillkor", link: "/terms-of-service" },
      { title: "Integritetspolicy", link: "/privacy-policy" },
      { title: "Fraktpolicy", link: "/shipping-policy" },
      {
        title: "Retur- och återbetalningspolicy",
        link: "/refund-and-cancellation-policy",
      },
      {
        title: "Faktureringsvillkor",
        link: "/billing-terms-and-conditions",
      },
      { title: "Ansvarsfriskrivning", link: "/disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 text-gray-200 bg-primary py-8 px-4 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Företagsinformation */}
        <div className="space-y-4 md:mr-4">
          <p>
            På {COMPANY_NAME} har vi designat en kudde som hjälper dig att sova
            djupare, vakna mer utvilad och må bättre. Säg hej då till oroliga
            nätter – och hej till bättre sömn! 🌙
          </p>
          <Image
            width={100}
            height={100}
            style={{
              borderWidth: 0,
              borderStyle: "solid",
              borderColor: "rgba(var(--color-4), 1)",
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
              borderRadius: 100,
            }}
            className="image p-0 w-auto object-contain size-32 bg-white  aspect-square"
            draggable="false"
            alt=""
            decoding="async"
            data-loaded="false"
            src="/logo.png"
          />

          <h2 className="text-2xl font-bold">Naturaeon LLC.</h2>
          <p className="text-sm mt-2">E-post: contact@naturaeon.com</p>
        </div>

        {/* Mer information + Policys */}
        {MENU.map((item) => (
          <div key={item.title}>
            <h3 className="text-lg mb-2 font-semibold">{item.title}</h3>
            <ul className="mt-2 space-y-4 text-gray-300 text-base">
              {item.items.map((subItem) => (
                <li
                  key={subItem.title}
                  className="hover:underline cursor-pointer"
                >
                  <Link href={subItem.link} key={subItem.title}>
                    {subItem.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer nederdel */}
      <div className="mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={16}
              viewBox="0 0 640 480"
            >
              <path fill="#005293" d="M0 0h640v480H0z" />
              <path
                fill="#fecb00"
                d="M176 0v192H0v96h176v192h96V288h368v-96H272V0z"
              />
            </svg>
          </span>
          <span>Svenska (SV) | SEK</span>
        </div>

        <div className="flex space-x-2 mt-2 md:mt-0">
          <p className="mt-2 md:mt-0 text-gray-400">Drivs av Naturaeon</p>
          <PaymentMethods />
        </div>
      </div>
    </footer>
  );
}
