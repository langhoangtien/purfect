import { AuthProvider } from "@/context/auth/auth-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purfect Fuel Blend",
  description: "Purfect Fuel Blend",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  );
}
