"use client";

import { useSelector } from "react-redux";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";

const Footer = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [branchName, setBranchName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBranchName(getCookieData("userBranchName"));
    setStartDate(getCookieData("fin_start_date") || "");
    setEndDate(getCookieData("fin_end_date") || "");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex-shrink-0 h-10 w-full bg-[#00264D] border-t border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4 overflow-hidden">
      {/* Developer credit */}
      <div className="text-white/50 text-[10px] sm:text-xs whitespace-nowrap">
        Branch:{"  "}
        <span className="font-semibold text-white/70">
          {branchName ? (
            branchName
          ) : (
            <Skeleton className="inline-block w-10 h-3 bg-white/15 rounded align-middle" />
          )}
        </span>
      </div>

      {/* Financial Year — center */}
      <div className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-xs">
        <span className="whitespace-nowrap">FY:</span>
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
      <div className="flex items-center gap-1.5 text-white/50 text-[10px] sm:text-xs">
        <span className="whitespace-nowrap hidden sm:inline">
          Current Date & Time:
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
    </footer>
  );
};

export default Footer;
