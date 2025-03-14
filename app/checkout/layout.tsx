import CheckoutLayout from "../layouts/checkout-layout";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <CheckoutLayout>{children}</CheckoutLayout>;
}
