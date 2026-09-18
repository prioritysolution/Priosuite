"use client";

import { useState, useEffect, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { FieldValues, Control, Path, RegisterOptions } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const limitToTwoDecimals = (value) => {
  if (value == null) return "";
  let next = String(value).replace(/[^\d.-]/g, "");
  const isNegative = next.startsWith("-");
  next = next.replace(/-/g, "");
  const dotIndex = next.indexOf(".");
  let limited;
  if (dotIndex === -1) {
    limited = next;
  } else {
    const integerPart = next.slice(0, dotIndex);
    const decimalPart = next
      .slice(dotIndex + 1)
      .replace(/\./g, "")
      .slice(0, 2);
    limited = `${integerPart}.${decimalPart}`;
  }
  if (isNegative) {
    return limited ? `-${limited}` : "-";
  }
  return limited;
};

const InputField = ({
  control,
  name,
  label,
  type = "text",
  placeholder,
  className,
  endContent,
  startContent,
  disabled = false,
  hint,
  rules,
  isUpper = false,
  isRequired = false,
  isBlurUpdate = false,
  readOnly = false,
  maxLength,
  onInput,
  formItemClassName,
  autoComplete,
  displayValue,
  autoFocus,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState("");

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState?.error;

        useEffect(() => {
          if (isBlurUpdate) {
            setLocalValue(field.value ?? "");
          }
        }, [field.value, isBlurUpdate]);

        return (
          <FormItem
            className={cn("w-full min-w-0", formItemClassName)}
          >
            {label && (
              <FormLabel className="text-sm font-medium text-foreground">
                {label}
                {"  "}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div
                className={cn(
                  // ✅ Single unified background + border on the wrapper only
                  "flex items-center w-full rounded-md border bg-background h-10",
                  "transition-all duration-150",
                  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:border-ring",
                  hasError
                    ? "border-destructive focus-within:ring-destructive/30"
                    : "border-input",
                  disabled && "cursor-not-allowed bg-muted/80",
                  // ✅ Only add gap when there's start/end content
                  startContent || endContent ? "gap-2" : "",
                  className,
                )}
              >
                {startContent && (
                  <div className="shrink-0 text-muted-foreground pl-3">
                    {startContent}
                  </div>
                )}

                {/* ✅ KEY FIX: Input is fully transparent — no border, no bg, no shadow, no ring */}
                <Input
                  value={displayValue !== undefined ? displayValue : isBlurUpdate ? localValue : field.value || ""}
                  type={inputType}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  maxLength={maxLength}
                  step={type === "number" ? "0.01" : undefined}
                  inputMode={type === "number" ? "decimal" : undefined}
                  autoComplete={autoComplete}
                  autoFocus={autoFocus}
                  className={cn(
                    // ✅ Full width when no start/end content, flex-1 when there is content
                    startContent || endContent ? "flex-1 min-w-0" : "w-full",
                    "h-full p-0",
                    // ✅ Apply padding directly to input based on content presence
                    !startContent && "pl-3",
                    !endContent && "pr-3",
                    // Remove ALL default Input styles that cause the two-tone look
                    "border-0 border-none",
                    "bg-transparent",
                    "shadow-none",
                    "outline-none",
                    "ring-0 ring-offset-0",
                    "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-100",
                  )}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (type === "number") {
                      value = limitToTwoDecimals(value);
                      e.target.value = value;
                    }
                    if (isBlurUpdate) {
                      const upperValue = isUpper ? value.toUpperCase() : value;
                      setLocalValue(upperValue);
                    } else {
                      field.onChange(isUpper ? value.toUpperCase() : value);
                    }
                  }}
                  onBlur={() => {
                    if (isBlurUpdate) {
                      field.onChange(localValue);
                    }
                    field.onBlur();
                  }}
                  onKeyDown={(e) => {
                    if (type === "number" && ["e", "E", "+"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onInput={(e) => {
                    if (type === "number") {
                      const limited = limitToTwoDecimals(e.target.value);
                      if (e.target.value !== limited) {
                        e.target.value = limited;
                      }
                    }
                    onInput?.(e);
                  }}
                />

                {endContent && (
                  <div className="shrink-0 text-muted-foreground pr-3">
                    {endContent}
                  </div>
                )}

                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer shrink-0 text-muted-foreground hover:text-foreground transition-colors px-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </FormControl>

            {hint && !hasError && (
              <p className="text-xs text-muted-foreground text-red-500">
                {hint}
              </p>
            )}

            <FormMessage className="text-xs text-destructive" />
          </FormItem>
        );
      }}
    />
  );
};

export default InputField;
