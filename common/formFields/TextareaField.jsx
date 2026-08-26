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

const TextareaField = ({
  control,
  name,
  label,
  placeholder,
  className,
  disabled = false,
  readOnly = false,
  rows = 3,
  isRequired = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState?.error;

        return (
          <FormItem className="flex flex-col w-full gap-1.5">
            {label && (
              <FormLabel className="text-sm font-medium text-foreground">
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                rows={rows}
                className={cn(
                  "w-full resize-none transition-colors duration-200",
                  hasError
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-input",
                  disabled && "cursor-not-allowed bg-muted/80",
                  className
                )}
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
