import React from "react";
import { cn } from "@/lib/utils";

const Spinner = ({ className }) => {
  return (
    <div
      className={cn(
        "w-12 h-12 border-4 border-primary border-b-transparent rounded-full animate-spin",
        className,
      )}
    />
  );
};

export default Spinner;
