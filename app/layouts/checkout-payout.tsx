import type { Metadata } from "next";
import Header from "./header";
import Footer from "./footer";
import Newsletter from "@/components/news-letter";

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
      <Header />
      {children}
      <Newsletter />
      <Footer />
    </>
  );
}
