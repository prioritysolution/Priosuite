"use client";

import {
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { premiumFieldTrigger, premiumFieldShell } from "./fieldStyles";

const SearchDropdownField = ({
  label,
  options,
  className,
  optionLabelKey = "Label",
  loading,
  loadMore,
  handleSearch,
  input,
  setInput,
  value,
  onChange,
  disabled,
  readOnly = false,
  isRequired = false,
}) => {
  const handleScroll = () => {
    const listbox = document.querySelector(".auto-listbox");
    if (listbox) {
      const { scrollTop, scrollHeight, clientHeight } = listbox;
      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [input]);

  return (
    <FormItem className="w-full mt-2 flex-1">
      {label && (
        <FormLabel className="text-sm font-medium text-foreground">
          {label}
          {"  "} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      <FormControl>
        <div className="relative">
          <Select
            value={value ? String(value) : ""}
            onValueChange={onChange}
            disabled={disabled || loading || readOnly}
          >
            <SelectTrigger
              className={premiumFieldTrigger({
                disabled: disabled || loading || readOnly,
                readOnly,
                className: cn("w-full justify-between", className),
              })}
            >
              <SelectValue placeholder={`Select ${label?.toLowerCase()}`} />
              {loading && <Spinner size="sm" className="ml-2" />}
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <input
                  type="text"
                  placeholder={`Search ${label?.toLowerCase()}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={premiumFieldShell({
                    className:
                      "w-full h-9 px-3 text-sm focus:outline-none",
                  })}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div
                className="max-h-60 overflow-y-auto auto-listbox"
                onScroll={handleScroll}
              >
                {options.map((item) => (
                  <SelectItem key={item.Id} value={item.Id.toString()}>
                    {item[optionLabelKey].toString()}
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default SearchDropdownField;
