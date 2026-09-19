"use client";

import BrandMark from "@/common/BrandMark";
import { cn } from "@/lib/utils";

const CentralLoader = ({ className, fullScreen = false }) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden",
        fullScreen ? "fixed inset-0 z-[100] h-screen w-screen" : "h-full min-h-[240px]",
        className,
      )}
      role="status"
      aria-label="Loading"
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-white/55"
        style={{
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />

      {/* Soft blue wash so it still feels like the home loader */}
      <div className="absolute inset-0 bg-[#eaf4fc]/45" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6">
        <BrandMark />
        {/* rounded-2xl border border-white/60 bg-white/70 px-6 py-4 shadow-sm */}
        <div className="flex items-center gap-4 ">
          <p className="text-lg font-medium tracking-wide text-gray-700">
            Loading
          </p>
          <div className="flex items-center gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="inline-block h-2.5 w-2.5 rounded-full bg-[#1B74D6]"
                style={{
                  animation: "bounce-dot 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default CentralLoader;
