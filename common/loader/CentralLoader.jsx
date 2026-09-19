"use client";

import { ClipLoader } from "react-spinners";
import { cn } from "@/lib/utils";

const CentralLoader = ({
  className,
  size = 50,
  fullScreen = false,
  color = "#00264d",
}) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center",
        fullScreen
          ? "fixed inset-0 z-[100] bg-white/70 backdrop-blur-[1px]"
          : "h-full min-h-[240px]",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      <ClipLoader color={color} size={size} speedMultiplier={0.7} />
    </div>
  );
};

export default CentralLoader;
