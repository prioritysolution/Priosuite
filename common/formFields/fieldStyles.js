import { cn } from "@/lib/utils";

/** Shared premium control shell — Input / Dropdown / Date / Textarea / etc. */
export const premiumFieldShell = ({
  hasError = false,
  disabled = false,
  readOnly = false,
  className,
} = {}) =>
  cn(
    "rounded-lg border",
    "bg-gradient-to-b from-[#f4f7fb] to-white",
    "border-[#c8d5e6]",
    "shadow-[0_1px_2px_rgba(15,40,80,0.06),0_4px_10px_rgba(15,40,80,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]",
    "transition-all duration-150",
    !(disabled || readOnly) &&
      "hover:border-[#b4c6dd] focus-within:border-ring focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring/40 focus-within:shadow-[0_1px_2px_rgba(15,40,80,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]",
    hasError &&
      "border-destructive focus-within:ring-destructive/30 focus-within:border-destructive",
    (disabled || readOnly) &&
      "cursor-not-allowed from-[#eef1f5] to-[#e8ecf1] border-[#c5ced9] shadow-none opacity-95",
    className,
  );

export const premiumFieldTrigger = ({
  hasError = false,
  disabled = false,
  readOnly = false,
  className,
} = {}) =>
  cn(
    premiumFieldShell({ hasError, disabled, readOnly }),
    "flex h-10 w-full min-w-0 items-center px-3.5 text-sm font-medium text-foreground",
    "placeholder:text-muted-foreground/70 placeholder:font-normal",
    "focus:outline-none focus-visible:outline-none focus-visible:ring-0",
    // Override shadcn Button/Input defaults that fight the premium shell
    "hover:bg-gradient-to-b hover:from-[#f4f7fb] hover:to-white",
    "disabled:cursor-not-allowed disabled:opacity-100",
    className,
  );

export const premiumTabsList = (className) =>
  cn(
    "inline-flex h-11 w-full items-center justify-center gap-1 rounded-lg p-1",
    "bg-[#eef2f7] border border-[#d0dae8]",
    className,
  );

/** Use explicit white/#00264D so active label contrast never fails */
export const premiumTabsTrigger = (activeOrClassName, maybeClassName) => {
  const className =
    typeof activeOrClassName === "string"
      ? activeOrClassName
      : maybeClassName;
  const forceActive = activeOrClassName === true;

  return cn(
    "inline-flex flex-1 items-center justify-center whitespace-nowrap",
    "h-9 rounded-md px-3 text-sm font-medium transition-all duration-150",
    "text-slate-600 hover:bg-white/70 hover:text-slate-900",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00264D]/25",
    "data-[state=active]:!bg-[#00264D] data-[state=active]:!text-white",
    "data-[state=active]:shadow-sm",
    "data-[state=active]:hover:!bg-[#00264D] data-[state=active]:hover:!text-white",
    forceActive && "!bg-[#00264D] !text-white shadow-sm",
    className,
  );
};

export const premiumRadioGroup = (className) =>
  cn(
    premiumFieldShell({
      className: cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 px-3.5 py-2.5 h-auto",
        className,
      ),
    }),
  );
