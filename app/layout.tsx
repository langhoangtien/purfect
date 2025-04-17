/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
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
import Script from "next/script";

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
        {/* Facebook Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
              !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
      n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1393158791704032');
    fbq('init', '3741128446126361');
    fbq('track', 'PageView');
          `}
        </Script>

        {/* Facebook Pixel NoScript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1393158791704032&ev=PageView&noscript=1"
          />
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=3741128446126361&ev=PageView&noscript=1"
          />
        </noscript>
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
