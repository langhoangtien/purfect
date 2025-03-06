import Logo from "@/components/logo";
import Link from "next/link";

import Cart from "./cart";
import { usePathname } from "next/navigation";

export const menu = [
  { name: "About Us", link: "/about-us" },
  { name: "Buy", link: "/products/purfect-fuel-blend" },
  { name: "Contact", link: "/contact" },
  { name: "Track Order", link: "/track-order" },
];

export default function NavDesktop() {
  const currentPath = usePathname();

  return (
    <div className="flex flex-col justify-center space-y-8">
      <div className="flex justify-between items-center space-x-1 py-2 px-4">
        <Logo />
        <div className="flex space-x-8 justify-center">
          {menu.map((item) => (
            <Link
              key={item.name}
              className={`text-base font-normal border-b-2  hover:border-gray-700 text-gray-700 py-1 ${
                currentPath === item.link
                  ? "border-gray-700"
                  : "border-transparent"
              }`}
              href={item.link}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <Cart />
      </div>
    </div>
  );
}
