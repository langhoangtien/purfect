"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Hàm giúp merge classnames
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Order", icon: ShoppingCart, href: "/admin/order" },
  { name: "User", icon: Users, href: "/admin/user" },
  { name: "Product", icon: Package, href: "/admin/product" },
  { name: "Customer", icon: Users, href: "/admin/customer" },
  { name: "Review", icon: Package, href: "/admin/review" },
  { name: "Option", icon: Settings, href: "/admin/option" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "h-screen bg-gray-900 text-white p-4 transition-all",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 flex items-center justify-center w-full py-2 bg-gray-800 rounded-md"
      >
        <LayoutDashboard strokeWidth={0.5} className="h-6 w-6 text-white" />
      </button>

      {/* Menu Items */}
      <nav className="space-y-2">
        {menuItems.map(({ name, icon: Icon, href }) => {
          const isActive = pathname.startsWith(href); // Kiểm tra đường dẫn hiện tại

          return (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex items-center px-4 py-2 rounded-md transition-colors",
                collapsed ? "justify-center px-2" : "space-x-2",
                isActive
                  ? "bg-[#00cba9] text-white font-semibold" // Highlight active link
                  : "hover:bg-gray-700 text-gray-300"
              )}
            >
              <Icon strokeWidth={1} className="w-5 h-5" />
              {!collapsed && <span>{name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
