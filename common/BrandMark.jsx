"use client";

import Image from "next/image";

const BrandMark = ({
  compact = false,
  className = "",
  hideSubtitle = false,
}) => (
  <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
    <Image
      src="/pristlogo.png"
      alt="PrioSuite"
      width={compact ? 56 : 68}
      height={compact ? 56 : 68}
      className={
        compact
          ? "h-12 w-12 object-contain sm:h-14 sm:w-14"
          : "h-14 w-14 object-contain sm:h-16 sm:w-16 md:h-[68px] md:w-[68px]"
      }
      priority
    />
    <div className="flex min-w-0 flex-col">
      <div className="flex items-center gap-2 sm:gap-2.5">
        <span
          className={
            compact
              ? "text-[22px] font-extrabold leading-none tracking-tight text-[#163A5F] sm:text-[26px]"
              : "text-[28px] font-extrabold leading-none tracking-tight text-[#163A5F] sm:text-[32px] md:text-[36px]"
          }
        >
          PrioSuite
        </span>
        <span
          className={
            compact
              ? "shrink-0 rounded-md bg-[#1B74D6] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white sm:text-[11px]"
              : "shrink-0 rounded-md bg-[#1B74D6] px-2.5 py-1 text-[11px] font-bold tracking-wide text-white sm:px-3 sm:text-[12px]"
          }
        >
          CBS
        </span>
      </div>
      {!hideSubtitle && (
        <p
          className={
            compact
              ? "mt-1.5 text-[12px] font-medium tracking-wide text-[#7A93B0] sm:text-[13px]"
              : "mt-1.5 text-[13px] font-medium tracking-wide text-[#7A93B0] sm:text-[14px] md:text-[15px]"
          }
        >
          Core Banking Solution
        </p>
      )}
    </div>
  </div>
);

export default BrandMark;
