// import React from 'react'

// const CustomRadioField = () => {
//   return (
//     <div>CustomRadioField</div>
//   )
// }

// export default CustomRadioField





import React from "react";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { premiumFieldShell } from "./fieldStyles";

const CustomRadioField = ({
    value,
    onChange,
    options,
    disabled = false,
    readOnly = false,
    className,
    label = "",
    customStyle = false,
}) => {
    return (
        <FormItem className={cn("w-full mt-2 flex-1", className)}>
            {label && <FormLabel className="text-sm sm:text-base">{label}</FormLabel>}

            <FormControl>
                <RadioGroup
                    onValueChange={onChange}
                    value={value}
                    className={
                        customStyle
                            ? "flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 lg:gap-4"
                            : "flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3"
                    }
                    disabled={disabled}
                >
                    {options.map((option) => {
                        const isOptionDisabled = disabled || option.disabled;

                        // ---------------- CUSTOM STYLE VERSION ----------------
                        if (customStyle) {
                            return (
                                <label
                                    key={option.value}
                                    htmlFor={option.value}
                                    className={cn(
                                        premiumFieldShell({
                                          disabled: isOptionDisabled,
                                          className:
                                            "flex items-center gap-2.5 px-3 py-2.5 sm:px-4 sm:py-2.5 select-none text-xs sm:text-sm w-full sm:w-auto max-w-xs",
                                        }),
                                        isOptionDisabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer",
                                        value === option.value && !isOptionDisabled
                                            ? "border-primary from-primary/5 to-white text-primary font-semibold"
                                            : "text-muted-foreground",
                                    )}
                                    onClick={(e) => {
                                        if (isOptionDisabled || readOnly) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        disabled={isOptionDisabled}
                                    />
                                    <span className="truncate">{option.label}</span>
                                </label>
                            );
                        }

                        // ---------------- DEFAULT VERSION ----------------
                        return (
                            <div
                                className="flex items-center space-x-2 space-y-0 min-h-[20px]"
                                key={option.value}
                            >
                                <FormControl>
                                    <RadioGroupItem
                                        value={option.value}
                                        disabled={isOptionDisabled}
                                    />
                                </FormControl>
                                <FormLabel
                                    className={cn(
                                        "font-normal min-w-0 truncate text-xs sm:text-sm",
                                        isOptionDisabled && "opacity-50 cursor-not-allowed",
                                    )}
                                >
                                    {option.label}
                                </FormLabel>
                            </div>
                        );
                    })}
                </RadioGroup>
            </FormControl>

            <FormMessage />
        </FormItem>
    );
};

export default CustomRadioField;