import AuthLayout from "../layouts/auth-layout";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
