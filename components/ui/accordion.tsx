"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center text-left justify-between py-4 font-semibold transition-all  [&[data-state=open]>svg.plus-icon]:hidden [&[data-state=closed]>svg.minus-icon]:hidden",
        className
      )}
      {...props}
    >
      {children}
      <MinusIcon
        strokeWidth={1}
        className="h-8 w-8 minus-icon text-gray-900 shrink-0 transition-transform duration-500"
      />
      <PlusIcon
        strokeWidth={1}
        className="h-8 w-8 plus-icon text-gray-900 shrink-0 transition-transform duration-500"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const AccordionTriggerCustom = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center text-left py-4 font-semibold transition-all  [&[data-state=open]>svg.plus-icon]:hidden [&[data-state=closed]>svg.minus-icon]:hidden",
        className
      )}
      {...props}
    >
      <MinusIcon
        strokeWidth={1}
        className="mr-2 h-5 w-5 minus-icon text-black shrink-0 transition-transform duration-500"
      />
      <PlusIcon
        strokeWidth={1}
        className="mr-2 h-5 w-5 plus-icon text-black shrink-0 transition-transform duration-500"
      />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTriggerCustom.displayName = AccordionPrimitive.Trigger.displayName;

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionTriggerCustom,
};
