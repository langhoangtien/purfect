import { ChevronDownIcon } from "lucide-react";
import React from "react";
import "./custom-ui.css";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select"> & { label?: string }
>(({ label = "Select", ...props }, ref) => {
  return (
    <div className="relative">
      <select
        required
        ref={ref}
        id={props.id}
        {...props}
        className="appearance-none w-full bg-white text-ellipsis pb-0 overflow-hidden pl-[16px] focus:pl-[15px] pr-[37px] h-14 border border-input pt-[18px] rounded-lg focus:border-2 focus:border-gray-600 "
      >
        <option value="" />
        {props.children}
      </select>

      <label
        htmlFor={props.id}
        className="absolute text-[17px] text-gray-500  duration-300 transform scale-100 top-1/2 left-4 -translate-y-1/2 z-10 origin-[0] transition-all"
      >
        {label}
      </label>

      <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none">
        <ChevronDownIcon size={16} strokeWidth={1} />
      </div>
    </div>
  );
});
Select.displayName = "Select";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          ref={ref}
          id={props.id}
          {...props}
          className={cn(
            "block h-14 w-full rounded-lg px-4 focus:pl-[15px] pb-0  pt-[18px] text-[17px] border border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-gray-600 focus:border-2 peer",
            className
          )}
          placeholder=" "
        />
        <label
          htmlFor={props.id}
          className="absolute text-[17px] text-gray-500  duration-300 transform -translate-y-3 scale-[0.8] top-4 z-10 origin-[0] start-4  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-[0.8] peer-focus:-translate-y-3 "
        >
          {props.placeholder}
        </label>
      </div>
    );
  }
);
Input.displayName = "Input";
export { Select, Input };
