import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  ({ className, type, autoComplete, readOnly, onFocus, ...props }, ref) => {
    const isPassword = type === "password";
    const [passwordUnlocked, setPasswordUnlocked] = React.useState(!isPassword);

    return (
      <input
        type={type}
        autoComplete={isPassword ? "new-password" : autoComplete}
        readOnly={Boolean(readOnly) || (isPassword && !passwordUnlocked)}
        data-lpignore={isPassword ? "true" : undefined}
        data-1p-ignore={isPassword ? "true" : undefined}
        onFocus={(event) => {
          if (isPassword && !readOnly) setPasswordUnlocked(true);
          onFocus?.(event);
        }}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
