"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(
  ({ className, children, type = "auto", ...props }, ref) => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      type={type}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none z-20 bg-[#e8eef5]/80",
        orientation === "vertical" &&
          "h-full w-3 border-l border-l-transparent p-[2px]",
        orientation === "horizontal" &&
          "h-3 flex-col border-t border-t-transparent p-[2px]",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-[#8fa3b8] hover:bg-[#5b738b] active:bg-[#00264d]" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
