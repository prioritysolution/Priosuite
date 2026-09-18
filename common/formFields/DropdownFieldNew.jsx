"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { FieldValues, Control, Path } from "react-hook-form";
import { Search } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DropdownFieldNew = ({
  control,
  name,
  label = "Option",
  className,
  options,
  optionLabelKey = "Option_Value",
  optionValueKey,
  disabled = false,
  loading = false,
  hint,
  onChange,
  disableSorting = false,
  isSearch = false,
  defaultValue,
  sortValue,
  isRequired = false,
  startContent,
  placeholder,
}) => {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const getItemId = (item) => {
    if (!item) return "";

    // If optionValueKey is specified, use it
    if (optionValueKey && item[optionValueKey] !== undefined) {
      return item[optionValueKey]?.toString() ?? "";
    }

    // Otherwise, use the default priority order
    return (
      (
        item.Opt_Code ??
        item.Branch_Id ??
        item.Id ??
        item.id ??
        item.value ??
        item.Rank_Id ??
        item[optionLabelKey]
      )?.toString() ?? ""
    );
  };

  const sortedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];

    const valid = options.filter((item) => {
      let id;

      // If optionValueKey is specified, use it
      if (optionValueKey && item[optionValueKey] !== undefined) {
        id = item[optionValueKey];
      } else {
        // Otherwise, use the default priority order
        id =
          item.Opt_Code ??
          item.Branch_Id ??
          item.Id ??
          item.id ??
          item.value ??
          item.Rank_Id ??
          item[optionLabelKey];
      }

      return id !== undefined && id !== null && id !== "";
    });

    // Only filter/search if isSearch is enabled
    if (isSearch && search) {
      const q = search.toLowerCase();
      const filtered = valid.filter((item) =>
        item[optionLabelKey]?.toLowerCase().includes(q),
      );

      if (disableSorting) return filtered;

      return [...filtered].sort((a, b) => {
        // Sort by sortValue if provided and available
        if (
          sortValue &&
          a[sortValue] !== undefined &&
          b[sortValue] !== undefined
        ) {
          if (
            typeof a[sortValue] === "number" &&
            typeof b[sortValue] === "number"
          ) {
            return a[sortValue] - b[sortValue];
          }
          return a[sortValue].toString().localeCompare(b[sortValue].toString());
        }

        const aLabel = a[optionLabelKey]?.toLowerCase() ?? "";
        const bLabel = b[optionLabelKey]?.toLowerCase() ?? "";
        const aStarts = aLabel.startsWith(q);
        const bStarts = bLabel.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aLabel.localeCompare(bLabel);
      });
    }

    if (disableSorting) return valid;

    return [...valid].sort((a, b) => {
      // Sort by sortValue if provided and available
      if (
        sortValue &&
        a[sortValue] !== undefined &&
        b[sortValue] !== undefined
      ) {
        if (
          typeof a[sortValue] === "number" &&
          typeof b[sortValue] === "number"
        ) {
          return a[sortValue] - b[sortValue];
        }
        return a[sortValue].toString().localeCompare(b[sortValue].toString());
      }

      const aLabel = a[optionLabelKey]?.toLowerCase() ?? "";
      const bLabel = b[optionLabelKey]?.toLowerCase() ?? "";
      return aLabel.localeCompare(bLabel);
    });
  }, [options, search, optionLabelKey, disableSorting, isSearch, sortValue]);

  // Clear search when component unmounts or dependencies change
  useEffect(() => {
    return () => setSearch("");
  }, [search]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState?.error;

        // Set default value
        useEffect(() => {
          if (defaultValue && !field.value && Array.isArray(options)) {
            const defaultItem = options.find(
              (item) => getItemId(item) === defaultValue.toString(),
            );
            if (defaultItem) {
              field.onChange(defaultValue.toString());
            }
          }
        }, [defaultValue, options, field]);

        const selectedItem =
          (Array.isArray(options) &&
            options?.find(
              (item) => getItemId(item) === field.value?.toString(),
            )) ||
          null;
        const displayLabel = selectedItem
          ? selectedItem[optionLabelKey]?.toString()
          : undefined;

        return (
          <FormItem className={cn("flex flex-col w-full gap-1.5", className)}>
            {label && (
              <FormLabel
                className={cn(
                  "text-[13px] tracking-widest font-medium",
                  hasError && "text-destructive",
                  disabled && "opacity-45",
                )}
              >
                {label}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onChange?.(value);
                }}
                disabled={disabled || loading}
              >
                <div className="relative">
                  {startContent && (
                    <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
                      {startContent}
                    </span>
                  )}
                  <SelectTrigger
                    className={cn(
                      "font-normal text-[15px] w-full",
                      "border-[1.5px] rounded-md h-auto py-2.5 px-4",
                      "transition-all duration-150",
                      "focus-visible:ring-4",
                      startContent && "pl-9",
                      hasError
                        ? "border-destructive focus-visible:ring-destructive/15"
                        : "border-border focus-visible:border-ring focus-visible:ring-ring/18",
                      disabled &&
                        "bg-slate-50 cursor-not-allowed border-slate-300 text-slate-900",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        loading
                          ? "Loading..."
                          : placeholder || `Select ${label.toLowerCase()}`
                      }
                    />
                  </SelectTrigger>
                </div>
                <SelectContent className="max-h-80 min-w-[250px]">
                  {/* Search - only show if isSearch is true */}
                  {isSearch && (
                    <div className="p-2.5 border-b border-border sticky top-0 bg-popover z-10">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          ref={searchRef}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search..."
                          className={cn(
                            "pl-8 h-9 text-[14px]",
                            "border-[1.5px] rounded-lg",
                            "focus-visible:ring-3 focus-visible:ring-ring/18",
                            "focus-visible:border-ring",
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  {sortedOptions.length === 0 ? (
                    <div className="py-5 text-center text-[13px] text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    sortedOptions.map((item) => {
                      const id = getItemId(item);
                      return (
                        <SelectItem
                          key={id}
                          value={id}
                          className="text-[14px] py-2.5"
                        >
                          {item[optionLabelKey]?.toString()}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </FormControl>

            {hint && !hasError && (
              <p className="text-xs text-muted-foreground/70 mt-0.5">{hint}</p>
            )}
            <FormMessage className="text-xs mt-0.5" />
          </FormItem>
        );
      }}
    />
  );
};

export default DropdownFieldNew;
