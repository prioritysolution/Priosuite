"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { premiumFieldShell } from "./fieldStyles";

const TextareaField = ({
  control,
  name,
  label,
  placeholder,
  className,
  disabled = false,
  readOnly = false,
  rows = 3,
  maxLength,
  isRequired = false,
  formItemClassName,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState?.error;

        return (
          <FormItem className={cn("w-full min-w-0", formItemClassName)}>
            {label && (
              <FormLabel className="text-sm font-medium text-foreground">
                {label}
                {"  "}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                rows={rows}
                maxLength={maxLength}
                className={premiumFieldShell({
                  hasError,
                  disabled,
                  readOnly,
                  className: cn(
                    "w-full min-h-[80px] resize-none px-3.5 py-2.5 text-sm font-medium",
                    "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-muted-foreground/70 placeholder:font-normal",
                    className,
                  ),
                })}
                {...field}
              />
            </FormControl>

            <FormMessage className="text-xs text-destructive" />
          </FormItem>
        );
      }}
    />
  );
};

export default TextareaField;
