import AuthGuard from "@/auth/auth-guard";

import { ReactNode } from "react";
import AuthLayout from "../layouts/auth-layout";
import DashboardLayout from "./dashboard";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout>
      <AuthGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthGuard>
      ;
    </AuthLayout>
  );
}
