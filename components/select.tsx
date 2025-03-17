import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import React from "react";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        required
        ref={ref}
        {...props}
        className={`${cn(
          className,
          "appearance-none w-full bg-white text-ellipsis  overflow-hidden  h-12 border border-input rounded-lg  focus:border-gray-600 "
        )}`}
      >
        {props.children}
      </select>

      <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
        <ChevronDownIcon size={16} strokeWidth={1} />
      </div>
    </div>
  );
});
Select.displayName = "Select";
