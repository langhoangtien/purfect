import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "bg-[#46755f] py-4 px-6 text-white font-semibold text-base rounded-3xl",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
