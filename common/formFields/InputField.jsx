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
import { premiumFieldShell } from "./fieldStyles";

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
                className={premiumFieldShell({
                  hasError,
                  disabled,
                  readOnly,
                  className: cn(
                    "flex items-center w-full h-10",
                    startContent || endContent || isPassword ? "gap-2" : "",
                    className,
                  ),
                })}
              >
                {startContent && (
                  <div className="shrink-0 text-muted-foreground pl-3.5">
                    {startContent}
                  </div>
                )}

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
                    startContent || endContent || isPassword
                      ? "flex-1 min-w-0"
                      : "w-full",
                    "h-full p-0",
                    !startContent && "pl-3.5",
                    !endContent && !isPassword && "pr-3.5",
                    "border-0 border-none",
                    "bg-transparent",
                    "shadow-none",
                    "outline-none",
                    "ring-0 ring-offset-0",
                    "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                    "text-sm font-medium text-foreground placeholder:text-muted-foreground/70 placeholder:font-normal",
                    "disabled:cursor-not-allowed disabled:opacity-100",
                    readOnly && "cursor-not-allowed opacity-100",
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
                    if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
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
                  <div className="shrink-0 text-muted-foreground pr-3.5">
                    {endContent}
                  </div>
                )}

                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer shrink-0 text-muted-foreground hover:text-foreground transition-colors pr-3.5"
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
