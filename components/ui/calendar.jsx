"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import {
  format,
  setMonth,
  setYear,
  addYears,
  subYears,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
} from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { normalizeLocalNoon } from "@/utils/dateHelpers";

const calendarBtnReset =
  "hover:!bg-slate-100 hover:!text-slate-900 aria-expanded:!bg-slate-100 aria-expanded:!text-slate-900 focus-visible:!ring-[#00264D]/20";
const calendarNavBtnClass = cn(
  "h-7 w-7 cursor-pointer text-slate-600",
  calendarBtnReset,
);
const calendarNavLabelClass = cn(
  "h-7 px-2 text-sm font-semibold text-slate-800 hover:!text-[#00264D] aria-expanded:!text-[#00264D]",
  calendarBtnReset,
);
const calendarSelectedClass =
  "!bg-[#00264D] !text-white hover:!bg-[#00264D]/90 hover:!text-white aria-expanded:!bg-[#00264D] aria-expanded:!text-white focus-visible:!text-white";
const calendarGridBtnClass = cn(
  "cursor-pointer h-12 text-sm text-slate-700 transition-all",
  calendarBtnReset,
);
const calendarOutlineBtnClass = cn(
  "h-7 w-7 cursor-pointer !bg-white !shadow-none border-slate-200 text-slate-700",
  calendarBtnReset,
);

function isDateDisabled(disabled, day) {
  if (!disabled) return false;
  if (typeof disabled === "boolean") return disabled;
  if (typeof disabled === "function") return !!disabled(day);
  if (disabled instanceof Date) return isSameDay(disabled, day);
  if (Array.isArray(disabled)) {
    return disabled.some((item) => isDateDisabled(item, day));
  }
  return false;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  mode = "single",
  month,
  onMonthChange,
  disabled,
  initialFocus,
  fromYear,
  toYear,
  ...props
}) {
  const [view, setView] = React.useState("days");
  const selectedDate = selected instanceof Date ? selected : undefined;
  const [currentMonth, setCurrentMonth] = React.useState(
    month || selectedDate || new Date(),
  );

  React.useEffect(() => {
    const next = month instanceof Date ? month : selectedDate;
    if (!(next instanceof Date) || isNaN(next.getTime())) return;
    setCurrentMonth((prev) => {
      if (
        prev.getFullYear() === next.getFullYear() &&
        prev.getMonth() === next.getMonth()
      ) {
        return prev;
      }
      return next;
    });
  }, [month, selectedDate]);

  const updateMonth = (nextMonth) => {
    setCurrentMonth(nextMonth);
    if (onMonthChange) onMonthChange(nextMonth);
  };

  const handleDaySelect = React.useCallback(
    (newDate) => {
      if (!newDate || isDateDisabled(disabled, newDate)) return;
      const safeDate = normalizeLocalNoon(newDate);
      if (!safeDate) return;
      if (onSelect) onSelect(safeDate);
    },
    [disabled, onSelect],
  );

  const handleMonthSelect = (monthIndex) => {
    updateMonth(setMonth(currentMonth, monthIndex));
    setView("days");
  };

  const handleYearSelect = (year) => {
    updateMonth(setYear(currentMonth, year));
    setView("months");
  };

  const handleTodayClick = () => {
    const today = normalizeLocalNoon(new Date());
    if (!today) return;
    updateMonth(today);
    setView("days");
    handleDaySelect(today);
  };

  const CalendarDay = React.useCallback(
    ({ date, displayMonth }) => {
      const isOutside = date.getMonth() !== displayMonth.getMonth();
      const dayDisabled = isDateDisabled(disabled, date);
      const isSelected = selectedDate && isSameDay(selectedDate, date);
      const isTodayDate = isToday(date);

      if (isOutside && !showOutsideDays) {
        return <span className="invisible block h-9">{"\u00a0"}</span>;
      }

      return (
        <button
          type="button"
          name="day"
          disabled={dayDisabled}
          aria-current={isTodayDate ? "date" : undefined}
          aria-selected={isSelected || undefined}
          className={cn(
            "h-9 w-full p-0 font-normal rounded-md text-sm text-slate-700",
            !dayDisabled &&
              "cursor-pointer hover:bg-slate-100 hover:text-slate-900",
            isOutside && !isSelected && !isTodayDate && "text-slate-400",
            dayDisabled &&
              !isTodayDate &&
              "text-slate-400 cursor-not-allowed hover:bg-transparent hover:text-slate-400",
            isTodayDate &&
              !isSelected &&
              "bg-[#E8EEF4] text-[#00264D] font-bold ring-1 ring-inset ring-[#00264D]",
            isSelected &&
              "bg-[#00264D] text-white hover:bg-[#00264D]/90 hover:text-white",
          )}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (dayDisabled) return;
            handleDaySelect(date);
          }}
        >
          {date.getDate()}
        </button>
      );
    },
    [disabled, selectedDate, showOutsideDays, handleDaySelect],
  );

  const currentYear = currentMonth.getFullYear();
  const startYear = Math.floor(currentYear / 10) * 10;
  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const isYearDisabled = (year) => {
    if (fromYear && year < fromYear) return true;
    if (toYear && year > toYear) return true;
    return false;
  };

  return (
    <div
      className={cn(
        "p-3 bg-white text-slate-800 w-[280px] flex flex-col",
        view === "days" ? "space-y-4" : "gap-3",
        className,
      )}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {view === "days" && (
        <>
          <div className="flex items-center justify-between px-1 relative">
            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={calendarNavBtnClass}
                onClick={() => updateMonth(subYears(currentMonth, 1))}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={calendarNavBtnClass}
                onClick={() => updateMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                className={calendarNavLabelClass}
                onClick={() => setView("months")}
              >
                {format(currentMonth, "MMM")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={calendarNavLabelClass}
                onClick={() => setView("years")}
              >
                {format(currentMonth, "yyyy")}
              </Button>
            </div>

            <div className="flex items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={calendarNavBtnClass}
                onClick={() => updateMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={calendarNavBtnClass}
                onClick={() => updateMonth(addYears(currentMonth, 1))}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DayPicker
            {...props}
            mode={mode}
            selected={selected}
            onSelect={handleDaySelect}
            month={currentMonth}
            onMonthChange={updateMonth}
            showOutsideDays={showOutsideDays}
            initialFocus={initialFocus}
            disabled={disabled}
            fromYear={fromYear}
            toYear={toYear}
            className="group/calendar w-full"
            classNames={{
              months: "relative flex flex-col w-full",
              month: "flex w-full flex-col",
              caption: "hidden",
              nav: "hidden",
              table: "w-full border-collapse table-fixed",
              head_row: "",
              head_cell:
                "w-[14.285%] h-8 p-0 text-center text-[0.8rem] font-medium text-slate-500 select-none",
              row: "",
              cell: "w-[14.285%] h-9 p-0 text-center relative",
              day: "h-9 w-full p-0",
              day_hidden: "invisible",
              ...classNames,
            }}
            components={{
              Day: CalendarDay,
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
          />

          <div className="flex justify-center border-t border-slate-200 pt-2">
            <Button
              type="button"
              variant="link"
              className="text-xs font-medium hover:no-underline cursor-pointer !text-[#00264D] hover:!text-[#00264D]/80"
              onClick={handleTodayClick}
            >
              Today
            </Button>
          </div>
        </>
      )}

      {view === "months" && (
        <div className="w-full">
          <div className="flex items-center justify-between px-1">
            <Button
              type="button"
              variant="ghost"
              className="h-8 text-sm font-bold !text-[#00264D] cursor-pointer hover:!bg-[#00264D]/8 hover:!text-[#00264D]"
              onClick={() => setView("years")}
            >
              {format(currentMonth, "yyyy")}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {months.map((monthName, index) => (
              <Button
                type="button"
                key={monthName}
                variant="ghost"
                className={cn(
                  calendarGridBtnClass,
                  currentMonth.getMonth() === index && calendarSelectedClass,
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {monthName}
              </Button>
            ))}
          </div>
        </div>
      )}

      {view === "years" && (
        <div className="w-full">
          <div className="flex items-center justify-between px-1">
            <Button
              type="button"
              variant="ghost"
              className="h-8 text-sm font-bold text-[#00264D]"
              disabled
            >
              {startYear} - {startYear + 9}
            </Button>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={calendarOutlineBtnClass}
                onClick={() => updateMonth(subYears(currentMonth, 10))}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={calendarOutlineBtnClass}
                onClick={() => updateMonth(addYears(currentMonth, 10))}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {years.map((year) => (
              <Button
                type="button"
                key={year}
                variant="ghost"
                disabled={isYearDisabled(year)}
                className={cn(
                  calendarGridBtnClass,
                  currentYear === year && calendarSelectedClass,
                  (year < startYear || year > startYear + 9) && "opacity-30",
                )}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
