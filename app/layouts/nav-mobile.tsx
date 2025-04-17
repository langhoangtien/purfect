import Logo from "@/components/logo";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import Link from "next/link";
import Cart from "./cart-header";
import { menu } from "./nav-desktop";

export default function NavMobile() {
  return (
    <div className="flex justify-between items-center space-x-1 bg-white py-2 px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Menu strokeWidth={1} className="size-6 text-gray-800"></Menu>
        </SheetTrigger>
        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} side={"left"}>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="flex flex-col space-y-4 p-4 ">
            {menu.map((item) => (
              <Link
                key={item.name}
                className="text-lg font-semibold text-gray-800"
                href={item.link}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Logo />
      <span className="flex space-x-2 items-center">
        {/* <SearchHeader /> */}
        <Cart />
      </span>
    </div>
  );
}
