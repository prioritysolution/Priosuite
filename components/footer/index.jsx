"use client";

import { useSelector } from "react-redux";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { parseLocalDate } from "@/utils/dateHelpers";
import { useTranslation } from "react-i18next";

const formatOpenDate = (value) => {
  const parsed = parseLocalDate(value);
  return parsed ? format(parsed, "dd MMM yyyy") : "";
};

const Footer = ({ finYearCookieVersion = 0 }) => {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [branchName, setBranchName] = useState("");
  const [begDate, setBegDate] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  const reduxBegDate = useSelector((state) => state?.login?.beg_date);
  const openDateLabel =
    formatOpenDate(begDate) || formatOpenDate(reduxBegDate) || "—";

  useEffect(() => {
    setMounted(true);
    setBranchName(getCookieData("userBranchName"));
    setStartDate(getCookieData("fin_start_date") || "");
    setEndDate(getCookieData("fin_end_date") || "");
    setBegDate(getCookieData("beg_date"));
  }, [reduxBegDate, finYearCookieVersion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex-shrink-0 w-full bg-[#00264D] border-t border-white/10 px-3 sm:px-6 py-1.5 lg:py-0 lg:h-10">
      <div className="h-full grid grid-cols-2 lg:grid-cols-4 items-center gap-x-3 gap-y-1 text-white/50 text-[10px] sm:text-xs">
        {/* Branch */}
        <div className="min-w-0 flex items-center gap-1 overflow-hidden">
          <span className="whitespace-nowrap flex-shrink-0">
            {t("footer.branch")}:
          </span>
          <span className="font-semibold text-white/70 truncate">
            {branchName ? (
              branchName
            ) : (
              <Skeleton className="inline-block w-16 h-3 bg-white/15 rounded align-middle" />
            )}
          </span>
        </div>

        {/* Working Date */}
        <div className="min-w-0 flex items-center gap-1.5 justify-end lg:justify-center overflow-hidden">
          <span className="whitespace-nowrap flex-shrink-0">
            <span className="sm:hidden">{t("footer.open")}:</span>
            <span className="hidden sm:inline">
              {t("footer.openDate")}:
            </span>
          </span>
          {!mounted ? (
            <Skeleton className="inline-block w-20 h-3 bg-white/15 rounded align-middle" />
          ) : (
            <span className="font-semibold text-white/70 truncate">
              {openDateLabel}
            </span>
          )}
        </div>

        {/* Financial Year */}
        <div className="flex items-center gap-1.5 lg:justify-center">
          <span className="whitespace-nowrap">{t("footer.fy")}:</span>
          <span className="font-semibold text-white/70">
            {startDate ? (
              startDate.slice(0, 4)
            ) : (
              <Skeleton className="inline-block w-10 h-3 bg-white/15 rounded align-middle" />
            )}
            {" – "}
            {endDate ? (
              endDate.slice(0, 4)
            ) : (
              <Skeleton className="inline-block w-10 h-3 bg-white/15 rounded align-middle" />
            )}
          </span>
        </div>

        {/* Current date and time */}
        <div className="flex items-center gap-1.5 justify-end overflow-hidden">
          <span className="whitespace-nowrap hidden md:inline">
            {t("footer.currentDateTime")}:
          </span>
          <span className="font-semibold text-white/70 whitespace-nowrap">
            {mounted ? (
              <>
                {currentTime.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}{" "}
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </>
            ) : (
              <Skeleton className="inline-block w-[140px] h-3 bg-white/15 rounded align-middle" />
            )}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
