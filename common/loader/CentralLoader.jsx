"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import BrandMark from "@/common/BrandMark";
import { cn } from "@/lib/utils";

const FULLSCREEN_STYLE = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  minHeight: "100dvh",
  maxWidth: "none",
  margin: 0,
  zIndex: 99999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const LoaderVisual = ({ fullScreen = false, className }) => (
  <div
    data-central-loader={fullScreen ? "fullscreen" : "inline"}
    className={cn(
      "flex flex-col items-center justify-center overflow-hidden",
      !fullScreen && "relative h-full min-h-[180px] w-full sm:min-h-[240px]",
      className,
    )}
    style={fullScreen ? FULLSCREEN_STYLE : undefined}
    role="status"
    aria-label="Loading"
    aria-live="polite"
  >
    {/* Full-bleed blur + wash — must cover entire overlay */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{ background: "rgba(234, 244, 252, 0.55)" }}
    />

    <div className="relative z-10 flex w-full max-w-[min(100%,22rem)] flex-col items-center justify-center gap-4 px-4 sm:max-w-md sm:gap-6 sm:px-6">
      <div className="flex w-full justify-center sm:hidden">
        <BrandMark compact />
      </div>
      <div className="hidden w-full justify-center sm:flex">
        <BrandMark />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <p className="text-base font-medium tracking-wide text-gray-700 sm:text-lg">
          Loading
        </p>
        <div className="flex items-center gap-2 sm:gap-2.5" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="inline-block h-2 w-2 rounded-full bg-[#1B74D6] sm:h-2.5 sm:w-2.5"
              style={{
                animation: "central-loader-dot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes central-loader-dot {
        0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
        40% { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </div>
);

const CentralLoader = ({ className, fullScreen = false }) => {
  const [portalReady, setPortalReady] = useState(false);

  useLayoutEffect(() => {
    if (!fullScreen) return undefined;

    setPortalReady(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      setPortalReady(false);
    };
  }, [fullScreen]);

  const visual = (
    <LoaderVisual fullScreen={fullScreen} className={className} />
  );

  // Must portal to <body> — `body > main` is CSS-scaled on laptops, which
  // traps position:fixed and makes the loader look left-aligned / not fullscreen.
  if (fullScreen) {
    if (!portalReady || typeof document === "undefined") return null;
    return createPortal(visual, document.body);
  }

  return visual;
};

export default CentralLoader;
