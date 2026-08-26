import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const DashboardCard = ({ classname, label, count, icon: Icon }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden",
        "w-full min-w-0", // ← fluid, fills grid cell, no fixed width
        "rounded-2xl p-5 sm:p-6",
        "text-white select-none",
        "shadow-md hover:shadow-xl hover:-translate-y-1",
        "transition-all duration-500",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        classname,
      )}
    >
      {/* decorative blobs */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10 blur-xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-6 -left-4 h-20 w-20 rounded-full bg-black/10 blur-2xl"
      />
      {/* shimmer top line */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />

      {/* count + icon */}
      <div className="relative flex items-start justify-between gap-3">
        <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums drop-shadow-sm">
          {count ?? "—"}
        </h3>
        <div className="flex shrink-0 items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white/15 border border-white/25 shadow-inner text-xl sm:text-2xl">
          {Icon && <Icon />}
        </div>
      </div>

      {/* label */}
      <p className="relative mt-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/80">
        {label}
      </p>

      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-1 w-2/3 rounded-full bg-white/20"
      />
    </div>
  );
};

export default DashboardCard;
