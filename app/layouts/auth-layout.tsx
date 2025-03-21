import { AuthProvider } from "@/context/auth/auth-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OptiLife Blend",
  description: "OptiLife Blend",
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
