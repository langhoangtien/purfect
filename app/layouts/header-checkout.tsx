"use client";
import * as React from "react";

import Logo from "@/components/logo";

export default function HeaderCheckout() {
  return (
    <header className="w-full text-white">
      <div className="mx-auto max-w-7xl p-4">
        {" "}
        <div className="flex flex-col justify-center space-y-8">
          <div className="flex justify-between items-center space-x-1 py-2 px-4">
            <Logo />
          </div>
        </div>
      </div>
    </header>
  );
}
