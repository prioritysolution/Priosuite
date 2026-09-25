"use client";

import * as React from "react";
import { Clock, X } from "lucide-react";
import { useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const HOURS_12 = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const PERIODS = ["AM", "PM"];

const to24Hour = (hour12, minute, period) => {
  let hour = Number(hour12) % 12;
  if (String(period).toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${minute}`;
};

const split12Hour = (value) => {
  const hour24 = Number(String(value).slice(0, 2));
  const minute = String(value).slice(3, 5);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return {
    hour: String(hour12).padStart(2, "0"),
    minute,
    period,
  };
};

const format12Hour = (value) => {
  if (!value) return "";
  const parts = split12Hour(value);
  return `${parts.hour}:${parts.minute} ${parts.period}`;
};

const normalizeTime = (value) => {
  if (value == null || value === "") return "";
  const raw = String(value).trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*(AM|PM))?$/i);
  if (!match) return "";
  const minute = match[2];
  if (Number(minute) > 59) return "";

  if (match[3]) {
    const hour12 = Number(match[1]);
    if (hour12 < 1 || hour12 > 12) return "";
    return to24Hour(String(hour12).padStart(2, "0"), minute, match[3]);
  }

  const hour = Number(match[1]);
  if (hour < 0 || hour > 23) return "";
  return `${String(hour).padStart(2, "0")}:${minute}`;
};

export function TimePickerField({
  control,
  name,
  label,
  placeholder = "Select time",
  disabled = false,
  className,
  allowClear = true,
  isRequired = false,
  isManualInput = false,
  hint,
  clearLabel = "Clear time",
  onChange,
  rules,
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: isRequired ? "This field is required" : false,
      ...rules,
    },
  });

  const time = normalizeTime(field.value);
  const now = new Date();
  const fallback = split12Hour(
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
  );
  const selected = time ? split12Hour(time) : fallback;
  const hour = selected.hour;
  const minute = selected.minute;
  const period = selected.period;

  React.useEffect(() => {
    setInputValue(format12Hour(time));
  }, [time]);

  const applyTime = (nextHour, nextMinute, nextPeriod) => {
    const next = to24Hour(nextHour, nextMinute, nextPeriod);
    field.onChange(next);
    onChange?.(next);
    setInputValue(format12Hour(next));
  };

  const handleClear = (event) => {
    event.preventDefault();
    event.stopPropagation();
    field.onChange("");
    onChange?.(null);
    setInputValue("");
  };

  const handleInputChange = (event) => {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 2);
      if (digits.length >= 3) {
        formatted += `:${digits.slice(2, 4)}`;
      }
    }
    setInputValue(formatted);

    if (formatted.length === 5) {
      const normalized = normalizeTime(formatted);
      if (normalized) {
        field.onChange(normalized);
        onChange?.(normalized);
      }
    } else if (!formatted) {
      field.onChange("");
      onChange?.(null);
    }
  };

  const handleInputBlur = () => {
    const normalized = normalizeTime(inputValue);
    if (normalized) {
      field.onChange(normalized);
      onChange?.(normalized);
      setInputValue(normalized);
      return;
    }
    setInputValue(time);
  };

  const pickerPanel = (
    <>
      <div className="grid grid-cols-[1fr_1fr_4.5rem]">
        <div className="min-w-0 border-r border-border">
          <p className="px-2 pt-2 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Hour
          </p>
          <ScrollArea className="h-40 w-full sm:h-44">
            <div className="flex flex-col gap-0.5 p-1.5">
              {HOURS_12.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "h-8 w-full cursor-pointer rounded-md text-sm tabular-nums transition-colors",
                    item === hour
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                  onClick={() => applyTime(item, minute, period)}
                >
                  {item}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="min-w-0 border-r border-border">
          <p className="px-2 pt-2 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Min
          </p>
          <ScrollArea className="h-40 w-full sm:h-44">
            <div className="flex flex-col gap-0.5 p-1.5">
              {MINUTES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "h-8 w-full cursor-pointer rounded-md text-sm tabular-nums transition-colors",
                    item === minute
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                  onClick={() => applyTime(hour, item, period)}
                >
                  {item}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="min-w-0">
          <p className="px-2 pt-2 text-center text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            AM/PM
          </p>
          <div className="flex flex-col gap-1 p-1.5">
            {PERIODS.map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "h-8 w-full cursor-pointer rounded-md text-sm transition-colors",
                  item === period
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
                onClick={() => applyTime(hour, minute, item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-2"
          onClick={() => {
            const current = new Date();
            const currentParts = split12Hour(
              `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}`,
            );
            applyTime(currentParts.hour, currentParts.minute, currentParts.period);
          }}
        >
          Now
        </Button>
        <Button
          type="button"
          size="sm"
          className="h-8 min-w-16 rounded-md"
          onClick={() => setOpen(false)}
        >
          Done
        </Button>
      </div>
    </>
  );

  return (
    <div className="grid w-full min-w-0 gap-1.5">
      {label ? (
        <label className="flex items-center px-1 text-[13px] font-medium tracking-wide text-primary">
          {label}
          {isRequired ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        {isManualInput ? (
          <PopoverAnchor asChild>
            <div className="relative w-full min-w-0">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder={placeholder === "Select time" ? "HH:MM" : placeholder}
                disabled={disabled}
                inputMode="numeric"
                autoComplete="off"
                className={cn(
                  "h-10 w-full pr-20 sm:h-11",
                  error && "border-destructive focus-visible:ring-destructive/50",
                  disabled && "cursor-not-allowed bg-slate-50",
                  className,
                )}
              />
              <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center gap-1.5">
                {allowClear && time && !disabled ? (
                  <button
                    type="button"
                    className="cursor-pointer rounded-full p-1 transition-colors hover:bg-muted"
                    onClick={handleClear}
                    aria-label={clearLabel}
                  >
                    <X className="h-3.5 w-3.5 opacity-50" />
                  </button>
                ) : null}
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "text-muted-foreground hover:text-foreground",
                      disabled ? "cursor-not-allowed" : "cursor-pointer",
                    )}
                    aria-label="Open time picker"
                    disabled={disabled}
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
              </div>
            </div>
          </PopoverAnchor>
        ) : (
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "relative h-10 w-full min-w-0 justify-between px-3 text-left font-normal sm:h-11",
                !time && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive/50",
                disabled && "cursor-not-allowed bg-slate-50",
                className,
              )}
            >
              <span className="truncate text-sm">
                {format12Hour(time) || placeholder}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {allowClear && time && !disabled ? (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={clearLabel}
                    className="rounded-full p-1 transition-colors hover:bg-muted"
                    onClick={handleClear}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        handleClear(event);
                      }
                    }}
                  >
                    <X className="h-3.5 w-3.5 opacity-50" />
                  </span>
                ) : null}
                <Clock className="h-4 w-4 opacity-70" />
              </span>
            </Button>
          </PopoverTrigger>
        )}

        <PopoverContent
          className="z-[100] w-64 gap-0 border-border bg-popover p-0 shadow-xl sm:w-72"
          align="center"
          side="bottom"
          sideOffset={8}
        >
          {pickerPanel}
        </PopoverContent>
      </Popover>

      {error ? (
        <p className="px-1 text-[0.8rem] font-medium text-destructive">
          {error.message}
        </p>
      ) : hint ? (
        <p className="px-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export const TimePicker = TimePickerField;
export default TimePickerField;
