"use client";

import * as React from "react";
import {
  format,
  isAfter,
  isBefore,
  startOfDay,
  isValid,
  getYear,
  subDays,
} from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getCookieData from "@/utils/getCookieData";
import {
  parseLocalDate,
  normalizeLocalNoon,
} from "@/utils/dateHelpers";

const parseFlexDate = (dStr) => parseLocalDate(dStr);

const toStartOfDay = (value) => {
  const parsed = parseFlexDate(value);
  return parsed ? startOfDay(parsed) : null;
};

function DatePickerControl({
  formField,
  fieldState,
  label,
  placeholder = "Select date",
  disabled = false,
  className,
  dateFormat = "dd-MM-yyyy",
  allowClear = true,
  isRequired = false,
  disablePastAndFuture = false,
  disableFuture = false,
  disableBeforeStartDate = false,
  showCurrentDate = false,
  onChange,
  isManualInput = false,
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  disabledDateBefore,
  disabledDateAfter,
  isBackDate = false,
  horizonLabel = false,
  onPopover = false,
  defaultValue,
}) {
  const [open, setOpen] = React.useState(false);
  const [startDateFromCookie, setStartDateFromCookie] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const cookieVal =
      getCookieData("fin_start_date") || getCookieData("beg_date");
    if (cookieVal) {
      const d = parseFlexDate(cookieVal);
      if (d) setStartDateFromCookie(startOfDay(d));
    }
  }, []);

  React.useEffect(() => {
    if (showCurrentDate && !formField.value) {
      formField.onChange(normalizeLocalNoon(new Date()));
    }
  }, [showCurrentDate, formField.value, formField.onChange]);

  React.useEffect(() => {
    const parsed = parseFlexDate(formField.value);
    if (parsed && isValid(parsed)) {
      setInputValue(format(parsed, dateFormat));
    } else {
      setInputValue("");
    }
  }, [formField.value, dateFormat]);

  React.useEffect(() => {
    if (defaultValue) {
      const parsedDate = parseFlexDate(defaultValue);
      if (parsedDate && !parseFlexDate(formField.value)) {
        formField.onChange(parsedDate);
      }
    }
  }, [defaultValue, formField.value, formField.onChange]);

  const parsedStartYear =
    startYear instanceof Date ? getYear(startYear) : Number(startYear);
  const parsedEndYear =
    endYear instanceof Date ? getYear(endYear) : Number(endYear);
  const safeStartYear = Number.isFinite(parsedStartYear)
    ? parsedStartYear
    : getYear(new Date()) - 100;
  const safeEndYear = Number.isFinite(parsedEndYear)
    ? parsedEndYear
    : isBackDate && startDateFromCookie
      ? getYear(startDateFromCookie)
      : getYear(new Date()) + 100;

  const disabledDate = (d) => {
    const today = startOfDay(new Date());
    const target = startOfDay(d);

    if (disableFuture && isAfter(target, today)) return true;
    if (
      disablePastAndFuture &&
      (isAfter(target, today) || isBefore(target, today))
    ) {
      return true;
    }

    if (
      disableBeforeStartDate &&
      startDateFromCookie &&
      isBefore(target, startDateFromCookie)
    ) {
      return true;
    }

    const beforeLimit = toStartOfDay(disabledDateBefore);
    if (beforeLimit && isBefore(target, beforeLimit)) return true;

    const afterLimit = isBackDate
      ? startDateFromCookie
        ? startOfDay(subDays(startDateFromCookie, 1))
        : toStartOfDay(disabledDateAfter)
      : toStartOfDay(disabledDateAfter);
    if (afterLimit && isAfter(target, afterLimit)) return true;

    const year = target.getFullYear();
    if (year < safeStartYear) return true;
    if (year > safeEndYear) return true;

    return false;
  };

  const date = parseFlexDate(formField.value);

  const applyDate = (newDate) => {
    if (!newDate) return;
    const finalDate = normalizeLocalNoon(newDate) || parseFlexDate(newDate);
    if (!finalDate) return;
    formField.onChange(finalDate);
    if (onChange) onChange(finalDate);
  };

  const handleSelect = (newDate) => {
    if (!newDate) return;
    applyDate(newDate);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    formField.onChange(null);
    setInputValue("");
    if (onChange) onChange(null);
  };

  const handleInputChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    let formattedValue = "";

    if (digits.length > 0) {
      formattedValue += digits.substring(0, 2);
      if (digits.length >= 3) {
        formattedValue += "-" + digits.substring(2, 4);
        if (digits.length >= 5) {
          formattedValue += "-" + digits.substring(4, 8);
        }
      }
    }

    setInputValue(formattedValue);

    if (formattedValue.length === 10) {
      const parsedDate = parseLocalDate(formattedValue);
      if (parsedDate && isValid(parsedDate) && !disabledDate(parsedDate)) {
        formField.onChange(parsedDate);
        if (onChange) onChange(parsedDate);
      }
    }
  };

  const handleInputBlur = () => {
    if (date && isValid(date)) {
      setInputValue(format(date, dateFormat));
    } else {
      setInputValue("");
    }
  };

  const isFieldLocked = !!(disabled || onPopover);

  const fieldTriggerClassName = cn(
    "w-full justify-between text-left font-normal h-11 px-3 relative transition-all duration-150 cursor-pointer",
    "bg-white border-slate-200 text-slate-800 shadow-none",
    "focus-visible:border-[#00264D] focus-visible:ring-2 focus-visible:ring-[#00264D]/20",
    fieldState.error &&
      "border-destructive focus-visible:ring-destructive/20",
    isFieldLocked
      ? "cursor-not-allowed bg-slate-50 text-slate-800 hover:bg-slate-50 hover:text-slate-800"
      : "hover:bg-slate-50 hover:text-slate-900",
    "disabled:!opacity-100 disabled:text-slate-800",
    !date && !isFieldLocked && "text-muted-foreground",
    className,
  );

  const fieldInputClassName = cn(
    "w-full pr-20 h-11 transition-all duration-150",
    "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400",
    "focus-visible:border-[#00264D] focus-visible:ring-2 focus-visible:ring-[#00264D]/20",
    fieldState.error &&
      "border-destructive focus-visible:ring-destructive/20",
    isFieldLocked && "cursor-not-allowed bg-slate-50 text-slate-800",
    "disabled:!opacity-100 disabled:text-slate-800 disabled:bg-slate-50",
    className,
  );

  const lastAllowedDate = isBackDate
    ? startDateFromCookie
      ? startOfDay(subDays(startDateFromCookie, 1))
      : toStartOfDay(disabledDateAfter)
    : toStartOfDay(disabledDateAfter);

  const calendarMonth = date || lastAllowedDate || new Date();

  return (
    <FormItem
      className={cn("w-full", {
        "grid grid-cols-[3fr_7fr] items-center": horizonLabel,
      })}
    >
      {label && (
        <FormLabel>
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      <Popover
        modal
        open={open && !onPopover}
        onOpenChange={(isOpen) => {
          if (onPopover) return;
          setOpen(isOpen);
        }}
      >
        {isManualInput ? (
          <PopoverAnchor asChild>
            <div className="relative group w-full">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="dd-mm-yyyy"
                disabled={isFieldLocked}
                className={fieldInputClassName}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {allowClear && date && !disabled && !onPopover && (
                  <button
                    type="button"
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={handleClear}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    disabled={isFieldLocked}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer disabled:opacity-100"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
              </div>
            </div>
          </PopoverAnchor>
        ) : (
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={fieldTriggerClassName}
              disabled={isFieldLocked}
              type="button"
              suppressHydrationWarning
            >
              <span
                className={cn(
                  "truncate",
                  !date && "text-slate-400",
                  isFieldLocked && date && "text-slate-800",
                )}
              >
                {mounted && date ? format(date, dateFormat) : placeholder}
              </span>
              <div className="flex items-center gap-2">
                {allowClear && date && !disabled && !onPopover && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleClear(e);
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
                <CalendarIcon className="h-4 w-4 text-slate-400" />
              </div>
            </Button>
          </PopoverTrigger>
        )}
        <PopoverContent
          className="w-auto p-0 shadow-xl border border-slate-200 bg-white text-slate-800 z-[200]"
          align="start"
          side="bottom"
          sideOffset={4}
          avoidCollisions={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => {
            const target = e.target;
            if (
              target instanceof Element &&
              target.closest("[data-date-picker-calendar]")
            ) {
              e.preventDefault();
            }
          }}
        >
          <div
            data-date-picker-calendar
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={date || undefined}
              onSelect={handleSelect}
              disabled={disabledDate}
              month={calendarMonth}
              fromYear={safeStartYear}
              toYear={safeEndYear}
              className="bg-white text-slate-800 p-0"
            />
          </div>
        </PopoverContent>
      </Popover>
      <FormMessage className={cn("", { "col-span-2": horizonLabel })} />
    </FormItem>
  );
}

export function DatePickerField({
  control,
  name,
  defaultValue,
  isRequired = false,
  ...props
}) {
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{
        required: isRequired ? "This field is required" : false,
        validate: isRequired
          ? (value) => {
              const parsed = parseFlexDate(value);
              return parsed ? true : "Please select a date";
            }
          : undefined,
      }}
      render={({ field, fieldState }) => (
        <DatePickerControl
          formField={field}
          fieldState={fieldState}
          defaultValue={defaultValue}
          isRequired={isRequired}
          {...props}
        />
      )}
    />
  );
}

export const DatePicker = DatePickerField;
