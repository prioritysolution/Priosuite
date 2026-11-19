"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 w-full items-center justify-center gap-1 rounded-lg p-1",
      "bg-[#eef2f7] border border-[#d0dae8]",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex flex-1 items-center justify-center whitespace-nowrap",
      "h-9 rounded-md px-3 text-sm font-medium",
      "transition-all duration-150",
      "text-slate-600 hover:bg-white/70 hover:text-slate-900",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00264D]/25",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-[#00264D] data-[state=active]:text-white",
      "data-[state=active]:shadow-sm",
      "data-[state=active]:hover:bg-[#00264D] data-[state=active]:hover:text-white",
      "data-[state=active]:focus-visible:text-white",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
