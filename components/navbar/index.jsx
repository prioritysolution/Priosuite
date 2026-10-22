"use client";

import {
  MdCall,
  MdNotifications,
  MdSupportAgent,
  MdOutlineArrowDropDown,
  MdMenu,
  MdPerson,
  MdLogout,
  MdSearch,
  MdLanguage,
  MdClose,
} from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import getCookieData from "../../utils/getCookieData";
import { useRouter } from "next/navigation";
import { useSupportLive } from "@/container/support/SupportLiveProvider";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "@/i18n";
import { Skeleton } from "../ui/skeleton";
import { Form } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import QuickActions from "@/components/dashboard/QuickActions";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English", short: "EN" },
  { code: "bn", label: "Bengali", short: "BN" },
  { code: "hi", label: "Hindi", short: "HI" },
  { code: "or", label: "Odia", short: "OR" },
];

const Navbar = ({
  logoutLoading,
  handleLogout,
  onMenuToggle,
  searchForm,
  searchValue,
  suggestions = [],
  showSuggestions,
  setShowSuggestions,
  handleSelectSuggestion,
  hasMenuData,
}) => {
  const [orgName, setOrgName] = useState("");
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [desktopSuggestPos, setDesktopSuggestPos] = useState(null);
  const searchWrapRef = useRef(null);
  const searchInputRef = useRef(null);
  const suggestionsPanelRef = useRef(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const { unreadCount, notices, openTicket, markAllRead } = useSupportLive();
  const badge = unreadCount > 9 ? "9+" : unreadCount > 0 ? String(unreadCount) : "";

  const resolvedLang = (i18n.language || "en").split("-")[0];
  const currentLang =
    LANGUAGE_OPTIONS.find((lang) => lang.code === resolvedLang)?.code || "en";
  const currentLangOption =
    LANGUAGE_OPTIONS.find((lang) => lang.code === currentLang) ||
    LANGUAGE_OPTIONS[0];

  const query = String(searchValue || "").trim();
  const isSuggestionsOpen = Boolean(showSuggestions && query);
  const useFixedDesktopSuggestions =
    isSuggestionsOpen && !mobileSearchOpen && Boolean(desktopSuggestPos);

  useEffect(() => {
    setOrgName(getCookieData("userOrgName"));
    setUserName(getCookieData("userName"));
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchValue]);

  useEffect(() => {
    if (!isSuggestionsOpen || mobileSearchOpen) {
      setDesktopSuggestPos(null);
      return;
    }

    const updatePos = () => {
      const anchor =
        searchInputRef.current?.querySelector?.("input") ||
        searchInputRef.current ||
        searchWrapRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      setDesktopSuggestPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 240),
      });
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [isSuggestionsOpen, mobileSearchOpen, searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      const inSearch = searchWrapRef.current?.contains(target);
      const inSuggestions = suggestionsPanelRef.current?.contains(target);
      if (!inSearch && !inSuggestions) {
        setShowSuggestions?.(false);
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const timer = window.setTimeout(() => {
      searchInputRef.current?.querySelector?.("input")?.focus?.();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [mobileSearchOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (event) => {
      if (event.matches) setMobileSearchOpen(false);
    };
    onChange(mq);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const selected = suggestions[activeIndex] || suggestions[0];
    if (selected) {
      handleSelectSuggestion?.(selected);
      setMobileSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowSuggestions?.(false);
      setMobileSearchOpen(false);
      return;
    }

    if (!isSuggestionsOpen || !suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1,
      );
    }
  };

  const handleLanguageChange = (code) => {
    setAppLanguage(code || "en");
  };

  const handlePickSuggestion = (item) => {
    handleSelectSuggestion?.(item);
    setMobileSearchOpen(false);
  };

  return (
    <header className="relative z-40 h-[64px] w-full bg-[#00264D] flex-shrink-0 flex items-center px-2 sm:px-4 lg:px-5 gap-1 sm:gap-2 lg:gap-3 overflow-visible">
      <button
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out"
        aria-label="Toggle sidebar"
      >
        <MdMenu className="text-2xl" />
      </button>

      <div className="flex items-center gap-1 min-w-0 max-w-[48%] sm:max-w-[40%] lg:max-w-[220px] xl:max-w-xs shrink">
        {orgName ? (
          <span className="text-white text-[11px] sm:text-sm font-semibold truncate">
            {orgName}
          </span>
        ) : (
          <Skeleton className="w-16 sm:w-28 h-3 sm:h-4 bg-white/15 rounded" />
        )}
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1.5 flex-1 min-w-0 justify-end">
        {mobileSearchOpen ? (
          <button
            type="button"
            aria-label="Close search overlay"
            className="lg:hidden fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-150"
            onClick={() => {
              setMobileSearchOpen(false);
              setShowSuggestions?.(false);
            }}
          />
        ) : null}

        <div
          ref={searchWrapRef}
          className="relative z-[70] flex flex-shrink-0 items-center"
        >
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen((prev) => !prev);
              if (query) setShowSuggestions?.(true);
            }}
            className={cn(
              "cursor-pointer lg:hidden flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out",
              mobileSearchOpen && "bg-white/15 text-white ",
            )}
            aria-label="Search"
            aria-expanded={mobileSearchOpen}
          >
            <MdSearch className="text-xl" />
          </button>

          <div
            className={cn(
              mobileSearchOpen
                ? "fixed left-1/2 top-[68px] z-[70] w-[min(94vw,40rem)] -translate-x-1/2 rounded-2xl border border-[#00264D]/20 bg-white p-3.5 sm:p-4 shadow-[0_18px_50px_rgba(0,38,77,0.35)] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
                : "hidden",
              "lg:relative lg:left-auto lg:top-auto lg:z-[70] lg:flex lg:w-[240px] xl:w-[300px] lg:translate-x-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:animate-none",
            )}
          >
            {mobileSearchOpen ? (
              <p className="lg:hidden mb-2 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#00264D]/55">
                {t("navbar.searchPages", "Search pages")}
              </p>
            ) : null}

            {searchForm ? (
              <Form {...searchForm}>
                <form
                  onSubmit={handleSearchSubmit}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => query && setShowSuggestions?.(true)}
                  autoComplete="off"
                  className="min-w-0 w-full"
                >
                  <div ref={searchInputRef}>
                    <InputField
                      control={searchForm.control}
                      name="search"
                      placeholder={t("navbar.searchPages", "Search pages")}
                      autoComplete="off"
                      formItemClassName="gap-0 space-y-0 w-full"
                      className={cn(
                        "shadow-none rounded-xl transition-all duration-200 ease-out",
                        mobileSearchOpen
                          ? "h-12 bg-[#f4f7fb] border-[#00264D]/20 focus:ring-2 focus:ring-[#00264D]/25 focus:border-[#00264D]/40 text-[15px]"
                          : "h-9 bg-white border-white/20 focus:shadow-md focus:ring-2 focus:ring-white/30",
                      )}
                      startContent={
                        <MdSearch
                          className={cn(
                            "text-lg",
                            mobileSearchOpen
                              ? "text-[#00264D]/70"
                              : "text-muted-foreground",
                          )}
                        />
                      }
                      endContent={
                        query ? (
                          <button
                            type="button"
                            className="rounded-md p-0.5 text-[#00264D]/50 hover:text-[#00264D] hover:bg-[#00264D]/8"
                            aria-label="Clear search"
                            onClick={() => {
                              searchForm.setValue?.("search", "", {
                                shouldDirty: true,
                              });
                              setShowSuggestions?.(false);
                            }}
                          >
                            <MdClose className="text-base" />
                          </button>
                        ) : null
                      }
                      onInput={() => setShowSuggestions?.(true)}
                    />
                  </div>
                </form>
              </Form>
            ) : null}

            {isSuggestionsOpen && mobileSearchOpen ? (
              <div
                ref={suggestionsPanelRef}
                className="relative z-[80] mt-2.5 max-h-[min(60vh,22rem)] overflow-hidden rounded-xl border border-[#00264D]/12 bg-white animate-in fade-in slide-in-from-top-1 duration-150 ease-out"
              >
                {!hasMenuData ? (
                  <p className="px-3 py-3 text-xs text-gray-500">
                    Loading pages…
                  </p>
                ) : suggestions.length ? (
                  <ul className="max-h-[min(55vh,20rem)] overflow-y-auto py-1">
                    {suggestions.map((item, index) => (
                      <li key={`${item.group}-${item.href}-${item.label}`}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => handlePickSuggestion(item)}
                          className={cn(
                            "w-full border-l-[3px] px-3 py-2.5 text-left transition-colors duration-100 ease-out",
                            index === activeIndex
                              ? "border-[#00264D] bg-[#00264D]/08 text-[#00264D]"
                              : "border-transparent hover:bg-gray-50",
                          )}
                        >
                          <p className="truncate text-sm font-semibold">
                            {item.label}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-gray-500">
                            {item.group}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-3 py-3 text-xs text-gray-500">
                    No pages found
                  </p>
                )}
              </div>
            ) : mobileSearchOpen ? (
              <p className="mt-2 px-1 text-[11px] text-[#00264D]/45 lg:hidden">
                Type to find a menu page
              </p>
            ) : null}
          </div>

          {useFixedDesktopSuggestions ? (
            <div
              ref={suggestionsPanelRef}
              className="fixed z-[80] max-h-[min(60vh,22rem)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-150 ease-out"
              style={{
                top: desktopSuggestPos.top,
                left: desktopSuggestPos.left,
                width: desktopSuggestPos.width,
              }}
            >
              {!hasMenuData ? (
                <p className="px-3 py-3 text-xs text-gray-500">Loading pages…</p>
              ) : suggestions.length ? (
                <ul className="max-h-[min(55vh,20rem)] overflow-y-auto py-1">
                  {suggestions.map((item, index) => (
                    <li key={`${item.group}-${item.href}-${item.label}`}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handlePickSuggestion(item)}
                        className={cn(
                          "w-full border-l-[3px] px-3 py-2.5 text-left transition-colors duration-100 ease-out",
                          index === activeIndex
                            ? "border-[#00264D] bg-[#00264D]/08 text-[#00264D]"
                            : "border-transparent hover:bg-gray-50",
                        )}
                      >
                        <p className="truncate text-sm font-semibold">
                          {item.label}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-gray-500">
                          {item.group}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-3 text-xs text-gray-500">No pages found</p>
              )}
            </div>
          ) : null}
        </div>

        <QuickActions />

        <div className="flex items-center flex-shrink-0 gap-1 sm:gap-1.5">
          <div className="hidden xl:flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-lg text-white/80">
            <MdLanguage className="text-xl" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              {"EN"}
            </span>
          </div>

          <div className="hidden xl:block h-px w-4 sm:w-5 bg-white/40 flex-shrink-0" />

          <DropdownMenu>
            <DropdownMenuTrigger
              className="outline-none flex-shrink-0"
              aria-label="Change language"
            >
              <div className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-150 ease-out cursor-pointer">
                <MdLanguage className="text-xl" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  {mounted ? currentLangOption.short : "EN"}
                </span>
                <MdOutlineArrowDropDown className="hidden sm:block text-white/60 text-lg" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 border border-gray-200 shadow-xl rounded-xl mt-2 p-1 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 ease-out"
            >
              <DropdownMenuLabel className="px-3 py-2 text-xs text-gray-400 font-normal">
                Language
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              {LANGUAGE_OPTIONS.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors duration-150 ease-out ${
                    currentLang === lang.code
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-gray-700 hover:bg-primary/8 focus:bg-primary/10"
                  }`}
                >
                  <span>{lang.label}</span>
                  <span className="text-xs font-semibold tracking-wide">
                    {lang.short}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          type="button"
          data-support-icon
          data-count={unreadCount}
          onClick={() => router.push("/support")}
          className={`relative p-1.5 sm:p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out flex-shrink-0 ${
            unreadCount > 0 ? "has-news" : ""
          }`}
          aria-label={unreadCount > 0 ? `Support, ${unreadCount} new` : "Support"}
        >
          <MdSupportAgent className="text-xl" />
          {badge ? (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 font-bold text-center border border-[#00264D]">
              {badge}
            </span>
          ) : null}
        </button>

        <div className="relative flex-shrink-0">
          <button
            type="button"
            data-support-bell
            data-count={unreadCount}
            onClick={() => setBellOpen((open) => !open)}
            className={`relative p-1.5 sm:p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out ${
              unreadCount > 0 ? "has-news" : ""
            }`}
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} new` : "Notifications"}
          >
            <MdNotifications className="text-xl" />
            {badge ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 font-bold text-center border border-[#00264D]">
                {badge}
              </span>
            ) : null}
          </button>
          {bellOpen ? (
            <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <p className="text-sm font-semibold">Notifications</p>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#00264D]"
                  onClick={markAllRead}
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notices.length ? (
                  notices.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full flex-col gap-0.5 px-3 py-2 text-left hover:bg-slate-50"
                      onClick={() => {
                        setBellOpen(false);
                        openTicket(item.number);
                      }}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        {item.unread ? (
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                        ) : null}
                        {item.title || "Support update"}
                      </span>
                      <span className="text-xs text-slate-500">{item.number}</span>
                      {item.body ? (
                        <span className="text-xs text-slate-600 line-clamp-2">{item.body}</span>
                      ) : null}
                      <span className="text-[10px] text-slate-400">
                        {item.at ? new Date(item.at).toLocaleString() : ""}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-6 text-center text-sm text-slate-500">
                    No notifications yet
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="hidden sm:flex p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out flex-shrink-0"
          aria-label="Call"
        >
          <MdCall className="text-xl" />
        </button>

        <div className="hidden sm:block h-6 w-px bg-white/20 mx-0.5 sm:mx-1 flex-shrink-0" />

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none flex-shrink-0">
            {!mounted ? (
              <div className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5">
                <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
                <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
              </div>
            ) : userName ? (
              <div className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all duration-150 ease-out cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 shadow-sm transition-transform duration-200 ease-out group-hover:scale-105">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-white text-sm font-medium max-w-[100px] truncate">
                  {userName}
                </span>
                <MdOutlineArrowDropDown className="hidden md:block text-white/60 text-lg transition-transform duration-200 ease-out group-hover:text-white group-data-[state=open]:rotate-180" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5">
                <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
                <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-52 border border-gray-200 shadow-xl rounded-xl mt-2 p-1 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 ease-out"
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
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-primary/8 focus:bg-primary/10 transition-colors duration-150 ease-out"
            >
              <MdPerson className="text-base text-primary/70" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                if (!logoutLoading) {
                  setTimeout(() => setLogoutDialogOpen(true), 150);
                }
              }}
              disabled={logoutLoading}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors duration-150 ease-out"
            >
              <MdLogout className="text-base" />
              {logoutLoading ? "Logging out…" : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will end your current session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLogoutDialogOpen(false)} className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setLogoutDialogOpen(false);
                handleLogout();
              }}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Navbar;