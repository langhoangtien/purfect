import type { Metadata } from "next";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import Newsletter from "@/components/news-letter";

export const metadata: Metadata = {
  title: "Purfect Fuel Blend",
  description: "Purfect Fuel Blend",
};

export default function MainLayout({
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
