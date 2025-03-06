import CheckoutLayout from "../layouts/checkout-payout";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <CheckoutLayout>{children}</CheckoutLayout>;
}
