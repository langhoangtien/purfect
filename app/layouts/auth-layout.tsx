import { AuthProvider } from "@/context/auth/auth-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naturaeon Blend",
  description: "Naturaeon Blend",
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
