import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
interface Input2Props extends React.ComponentProps<"input"> {
  label?: string;
}

const Input2 = React.forwardRef<HTMLInputElement, Input2Props>(
  ({ className, type, id, label, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          type={type}
          id={id}
          className={cn(
            "block rounded-lg px-2.5 pb-2 pt-4 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700  border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-gray-500 focus:outline-none focus:ring-0 focus:border-gray-600 peer",
            className
          )}
          placeholder=" "
        />
        <label
          htmlFor={id}
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-3.5 z-10 origin-[0] start-2.5 peer-focus:text-gray-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
        >
          {label}
        </label>
      </div>
    );
  }
);
Input2.displayName = "Input2";

export { Input2 };
