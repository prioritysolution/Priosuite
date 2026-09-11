import { useState, useEffect, useRef } from "react";
import {
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
  FormField,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const getOptionValue = (item, optionLabelKey, optionValueKey) => {
  if (!item || typeof item !== "object") return "";
  if (
    optionValueKey &&
    item[optionValueKey] !== undefined &&
    item[optionValueKey] !== null &&
    item[optionValueKey] !== ""
  ) {
    return item[optionValueKey];
  }
  return (
    item.Id ??
    item.id ??
    item.value ??
    item.Cat_Id ??
    item.Head_Id ??
    item.Type_Id ??
    item[optionLabelKey] ??
    ""
  );
};

const DropdownFieldInner = ({
  label,
  value,
  onChange,
  options = [],
  optionLabelKey = "Option_Value",
  optionValueKey,
  disabled = false,
  readOnly = false,
  errorMessage = "",
  variant = "bordered",
  radius = "sm",
  size = "md",
  loading = false,
  fixedDropdownWidth = false,
  searchable = false, // Keep prop for compatibility, though we always search
  isRequired = false,
  searchPlaceholder = "",
  control,
  name,
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuWidth, setMenuWidth] = useState(0);
  const selectingRef = useRef(false);
  const anchorRef = useRef(null);

  // Find the label for the current value to display
  const getDisplayLabel = (val) => {
    if (val === null || val === undefined || val === "") return "";
    const found = options.find(
      (opt) =>
        String(getOptionValue(opt, optionLabelKey, optionValueKey)) ===
          String(val) || String(opt?.[optionLabelKey] ?? "") === String(val),
    );
    return found ? String(found[optionLabelKey] ?? "") : "";
  };

  const [searchVal, setSearchVal] = useState(() => getDisplayLabel(value));

  // Sync input text with external value changes
  useEffect(() => {
    setSearchVal(getDisplayLabel(value));
  }, [value, options]);

  useEffect(() => {
    if (!open) return;

    const updateWidth = () => {
      const fieldWidth = anchorRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = Math.max(window.innerWidth - 24, 160);
      const preferred = fixedDropdownWidth
        ? Math.min(500, maxWidth)
        : fieldWidth;
      setMenuWidth(Math.min(preferred || fieldWidth, maxWidth));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [open, fixedDropdownWidth]);

  const isInteractive = !disabled && !loading && !readOnly;

  // Determine if we are actively filtering the list
  const isSearching = searchVal !== "" && searchVal !== getDisplayLabel(value);

  const filteredOptions = isSearching
    ? (options || []).filter((item) => {
        const labelText = String(item?.[optionLabelKey] ?? "").toLowerCase();
        return labelText.includes(searchVal.toLowerCase());
      })
    : options || [];

  // Reset active key navigation index when options or open state changes
  useEffect(() => {
    if (filteredOptions.length > 0) {
      const selectedIndex = filteredOptions.findIndex(
        (opt) =>
          String(getOptionValue(opt, optionLabelKey, optionValueKey)) ===
          String(value),
      );
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setActiveIndex(-1);
    }
  }, [open, filteredOptions.length, value]);

  const handleSelectOption = (item) => {
    const itemValue = getOptionValue(item, optionLabelKey, optionValueKey);
    const itemLabel = String(item?.[optionLabelKey] ?? "");

    selectingRef.current = true;
    setSearchVal(itemLabel);
    setOpen(false);

    if (itemValue === null || itemValue === undefined || itemValue === "") {
      onChange("");
    } else {
      const numValue = Number(itemValue);
      onChange(
        !isNaN(numValue) && String(itemValue).trim() !== ""
          ? numValue
          : String(itemValue),
      );
    }
  };

  const handleOpenChange = (newOpen) => {
    if (!isInteractive) return;
    setOpen(newOpen);
    if (!newOpen && !selectingRef.current) {
      setSearchVal(getDisplayLabel(value));
    }
    if (!newOpen) {
      selectingRef.current = false;
    }
  };

  const handleInputChange = (e) => {
    if (!isInteractive) return;
    setSearchVal(e.target.value);
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!isInteractive) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
        handleSelectOption(filteredOptions[activeIndex]);
      } else if (filteredOptions.length > 0) {
        // Fallback: select first match if user hits enter and nothing is highlighted
        handleSelectOption(filteredOptions[0]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <FormItem className="w-full min-w-0">
      {label && (
        <FormLabel className="text-sm font-medium text-foreground">
          {label}
          {"  "} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      <Popover modal open={open && isInteractive} onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Anchor asChild>
          <div ref={anchorRef} className="relative w-full min-w-0 cursor-text">
            <FormControl>
              <input
                type="text"
                value={searchVal}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={disabled || loading}
                readOnly={readOnly}
                placeholder={
                  searchPlaceholder || `Select ${label?.toLowerCase()}`
                }
                className={cn(
                  "flex h-10 w-full min-w-0 rounded-md border border-input bg-background pl-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 truncate",
                  errorMessage && "border-destructive focus:ring-destructive",
                )}
              />
            </FormControl>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {loading && <Spinner size="sm" />}
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="p-1 hover:bg-slate-100 rounded-md transition-colors focus:outline-none"
                  disabled={disabled || loading}
                >
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
            </div>
          </div>
        </PopoverPrimitive.Anchor>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={4}
          collisionPadding={8}
          className="p-0 overflow-hidden bg-popover text-popover-foreground border shadow-md rounded-md z-[200] max-w-[calc(100vw-1.5rem)]"
          style={{
            width: menuWidth ? `${menuWidth}px` : undefined,
          }}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-1 max-h-[min(300px,50vh)] overflow-y-auto overflow-x-hidden">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-sm text-slate-500 text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map((item, index) => {
                const itemVal = String(
                  getOptionValue(item, optionLabelKey, optionValueKey),
                );
                const isSelected = String(value) === itemVal;
                const isHighlighted = activeIndex === index;

                return (
                  <button
                    key={itemVal || `opt-${index}`}
                    type="button"
                    ref={(el) => {
                      if (el && isHighlighted) {
                        el.scrollIntoView({
                          behavior: "auto",
                          block: "nearest",
                        });
                      }
                    }}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelectOption(item);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className={cn(
                      "relative flex w-full min-w-0 items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-left outline-none select-none cursor-pointer",
                      isSelected
                        ? "bg-accent/40 text-accent-foreground font-medium"
                        : "text-foreground",
                      isHighlighted
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50",
                    )}
                  >
                    {isSelected && (
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    <span className="block min-w-0 truncate">
                      {String(item?.[optionLabelKey] ?? "")}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {control && name ? (
        <FormMessage />
      ) : errorMessage ? (
        <p className="text-xs text-destructive mt-1">{errorMessage}</p>
      ) : null}
    </FormItem>
  );
};

const DropdownField = (props) => {
  if (props.control && props.name) {
    return (
      <FormField
        control={props.control}
        name={props.name}
        rules={props.rules}
        render={({ field, fieldState }) => (
          <DropdownFieldInner
            {...props}
            value={field.value}
            onChange={field.onChange}
            errorMessage={fieldState.error?.message || props.errorMessage}
          />
        )}
      />
    );
  }
  return <DropdownFieldInner {...props} />;
};

export default DropdownField;
