import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Info,
} from "lucide-react";
import { CartProvider } from "@/context/cart/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiLife",
  description: "OptiLife is a wellness brand that offers premium supplements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <CartProvider>{children}</CartProvider>
        <Toaster
          icons={{
            success: <CheckCircle size={16} className="text-green-500 mt-1" />,
            info: <Info size={16} className="text-blue-500 mt-1" />,
            warning: (
              <AlertTriangle size={16} className="text-yellow-500 mt-1" />
            ),
            error: <XCircle size={16} className="text-red-500 mt-1" />,
            loading: <Loader2 size={16} className="animate-spin mt-1" />,
          }}
        />
      </body>
    </html>
  );
}
