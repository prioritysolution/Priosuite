"use client";

import {
  FormField,
  FormItem,
  FormControl,
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

const SearchDropdownField = ({
  label,
  options,
  className,
  optionLabelKey = "Label",
  loading,
  loadMore, // Prop for loading more data from the parent
  handleSearch,
  input,
  setInput,
  value,
  onChange,
  disabled,
  readOnly = false, // Added readonly prop
  isRequired = false,
}) => {
  const handleScroll = () => {
    const listbox = document.querySelector(".auto-listbox");
    if (listbox) {
      const { scrollTop, scrollHeight, clientHeight } = listbox;

      // Check if the user is close to the bottom of the list
      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading) {
        // console.log("Triggering loadMore");
        loadMore();
      }
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 500); // Delay search by 500ms
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
            disabled={disabled || loading}
          >
            <SelectTrigger className={cn("w-full", className)}>
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
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
