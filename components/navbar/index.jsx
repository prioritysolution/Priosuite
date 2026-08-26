"use client";

import {
  MdCall,
  MdNotifications,
  MdOutlineArrowDropDown,
  MdMenu,
  MdPerson,
  MdLogout,
} from "react-icons/md";
import { useEffect, useState } from "react";
import getCookieData from "../../utils/getCookieData";
import { FaCalculator } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isValid, parse } from "date-fns";
import { useSelector } from "react-redux";

const parseOpenDate = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return isValid(value) ? value : null;

  if (typeof value === "number") {
    const fromNumber = new Date(value);
    return isValid(fromNumber) ? fromNumber : null;
  }

  const str = String(value)
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/[–—]/g, "-");
  if (!str || str === "null" || str === "undefined") return null;

  const match = str.match(/^(\d{1,4})[-/.](\d{1,2})[-/.](\d{1,4})/);
  if (match) {
    const first = parseInt(match[1], 10);
    const second = parseInt(match[2], 10);
    const third = parseInt(match[3], 10);
    const [year, month, day] =
      match[1].length === 4 ? [first, second, third] : [third, second, first];

    if (year >= 1900 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const parsed = new Date(year, month - 1, day, 12, 0, 0, 0);
      if (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      ) {
        return parsed;
      }
    }
  }

  const fromPattern = parse(str.slice(0, 10), "dd-MM-yyyy", new Date());
  if (isValid(fromPattern)) return fromPattern;

  const native = new Date(str);
  return isValid(native) ? native : null;
};

const formatOpenDate = (value) => {
  const parsed = parseOpenDate(value);
  return parsed ? format(parsed, "dd MMM yyyy") : "";
};

const Navbar = ({ logoutLoading, handleLogout, onMenuToggle }) => {
  const [orgName, setOrgName] = useState("");
  const [userName, setUserName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [begDate, setBegDate] = useState("");
  const [showCashBalance, setShowCashBalance] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const reduxBegDate = useSelector((state) => state?.login?.beg_date);
  const openDateLabel =
    formatOpenDate(begDate) || formatOpenDate(reduxBegDate) || "—";

  useEffect(() => {
    setOrgName(getCookieData("userOrgName"));
    setUserName(getCookieData("userName"));
    setBranchName(getCookieData("userBranchName"));
    setBegDate(getCookieData("beg_date"));
    setMounted(true);
  }, [reduxBegDate]);

  return (
    /* ── height matches sidebar logo area exactly ── */
    <header className="h-[64px] w-full bg-[#00264D] flex-shrink-0 flex items-center px-3 sm:px-5 gap-3 shadow-md">
      {/* ── Hamburger — mobile only ── */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex-shrink-0 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Toggle sidebar"
      >
        <MdMenu className="text-2xl" />
      </button>

      <div className="flex justify-between items-center w-full">

      {/* ── Org & Branch info ── grows to fill space ── */}
      <div className="flex-1 flex flex-col sm:flex-row justify-center sm:justify-start md:justify-between sm:items-center gap-0.5 sm:gap-6 min-w-0 overflow-hidden">
        {/* Organisation */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-white/60 text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0">
            Organisation:
          </span>
          {/* max-w-[160px] md:max-w-[220px] lg:max-w-xs */}
          {orgName ? (
            <span className="text-white text-xs sm:text-sm font-semibold truncate">
              {orgName}
            </span>
          ) : (
            <Skeleton className="w-28 h-3 sm:h-4 bg-white/15 rounded" />
          )}
        </div>

        {/* Open Date */}
        <div className="flex md:hidden items-center gap-1.5 min-w-0">
          <span className="text-white/60 text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0">
            Open Date:
          </span>
          {!mounted ? (
            <Skeleton className="w-24 h-3 sm:h-4 bg-white/15 rounded" />
          ) : (
            <span className="text-white text-xs sm:text-sm font-semibold truncate">
              {openDateLabel}
            </span>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-1.5 min-w-0">
          <span className="text-white/60 text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0">
            Open Date:
          </span>
          {!mounted ? (
            <Skeleton className="w-24 h-3 sm:h-4 bg-white/15 rounded" />
          ) : (
            <span className="text-white text-xs sm:text-sm font-semibold truncate">
              {openDateLabel}
            </span>
          )}
        </div>
        </div>

      {/* ── Action icons ── */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
       

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Notifications"
        >
          <MdNotifications className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-primary" />
        </button>

        {/* Call — hidden on small screens */}
        <button
          className="hidden sm:flex p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Call"
        >
          <MdCall className="text-xl" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-white/20 mx-1 flex-shrink-0" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            {/* Trigger: show skeleton until mounted so SSR and client-first render match */}
            {!mounted ? (
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
                <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
              </div>
            ) : userName ? (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                {/* Name — hidden on small screens */}
                <span className="hidden md:block text-white text-sm font-medium max-w-[100px] truncate">
                  {userName}
                </span>
                <MdOutlineArrowDropDown className="hidden md:block text-white/60 text-lg group-hover:text-white transition-colors" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1.5">
                <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
                <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 border border-gray-200 shadow-xl rounded-xl mt-2 p-1"
          >
            <DropdownMenuLabel className="px-3 py-2">
              <p className="text-xs text-gray-400 font-normal">Signed in as</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userName}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-primary/8 focus:bg-primary/10 transition-colors"
            >
              <MdPerson className="text-base text-primary/70" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={!logoutLoading ? handleLogout : undefined}
              disabled={logoutLoading}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors"
            >
              <MdLogout className="text-base" />
              {logoutLoading ? "Logging out…" : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
