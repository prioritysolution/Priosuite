// "use client";

// import {
//   MdCall,
//   MdNotifications,
//   MdOutlineArrowDropDown,
//   MdMenu,
//   MdPerson,
//   MdLogout,
//   MdSearch,
// } from "react-icons/md";
// import { useEffect, useRef, useState } from "react";
// import getCookieData from "../../utils/getCookieData";
// import { useRouter } from "next/navigation";
// import { Skeleton } from "../ui/skeleton";
// import { Form } from "@/components/ui/form";
// import InputField from "@/common/formFields/InputField";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../ui/dropdown-menu";

// const Navbar = ({
//   logoutLoading,
//   handleLogout,
//   onMenuToggle,
//   searchForm,
//   searchValue,
//   suggestions = [],
//   showSuggestions,
//   setShowSuggestions,
//   handleSelectSuggestion,
//   hasMenuData,
// }) => {
//   const [orgName, setOrgName] = useState("");
//   const [userName, setUserName] = useState("");
//   const [mounted, setMounted] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const searchWrapRef = useRef(null);
//   const router = useRouter();

//   const query = String(searchValue || "").trim();
//   const isSuggestionsOpen = Boolean(showSuggestions && query);

//   useEffect(() => {
//     setOrgName(getCookieData("userOrgName"));
//     setUserName(getCookieData("userName"));
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     setActiveIndex(0);
//   }, [searchValue]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         searchWrapRef.current &&
//         !searchWrapRef.current.contains(event.target)
//       ) {
//         setShowSuggestions?.(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [setShowSuggestions]);

//   const handleSearchSubmit = (event) => {
//     event.preventDefault();
//     const selected = suggestions[activeIndex] || suggestions[0];
//     if (selected) handleSelectSuggestion?.(selected);
//   };

//   const handleSearchKeyDown = (event) => {
//     if (!isSuggestionsOpen || !suggestions.length) return;

//     if (event.key === "ArrowDown") {
//       event.preventDefault();
//       setActiveIndex((prev) => (prev + 1) % suggestions.length);
//     } else if (event.key === "ArrowUp") {
//       event.preventDefault();
//       setActiveIndex((prev) =>
//         prev === 0 ? suggestions.length - 1 : prev - 1,
//       );
//     } else if (event.key === "Escape") {
//       setShowSuggestions?.(false);
//     }
//   };

//   return (
//     /* ── height matches sidebar logo area exactly ── */
//     <header className="h-[64px] w-full bg-[#00264D] flex-shrink-0 flex items-center px-3 sm:px-5 gap-2 sm:gap-3 shadow-md">
//       {/* ── Hamburger — mobile only ── */}
//       <button
//         onClick={onMenuToggle}
//         className="lg:hidden flex-shrink-0 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
//         aria-label="Toggle sidebar"
//       >
//         <MdMenu className="text-2xl" />
//       </button>

//       {/* ── Org info ── */}
//       <div className="hidden md:flex items-center gap-1.5 min-w-0 max-w-[180px] lg:max-w-xs flex-shrink">
//         <span className="text-white/60 text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0">
//           Organisation:
//         </span>
//         {orgName ? (
//           <span className="text-white text-xs sm:text-sm font-semibold truncate">
//             {orgName}
//           </span>
//         ) : (
//           <Skeleton className="w-28 h-3 sm:h-4 bg-white/15 rounded" />
//         )}
//       </div>

     

//       {/* ── Action icons ── */}
//       <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
//       {/* ── Page search ── */}

//         <div
//           ref={searchWrapRef}
//           className="relative flex-1 min-w-0 sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto"
//         >
//           {searchForm ? (
//             <Form {...searchForm}>
//               <form
//                 onSubmit={handleSearchSubmit}
//                 onKeyDown={handleSearchKeyDown}
//                 onFocus={() => query && setShowSuggestions?.(true)}
//                 autoComplete="off"
//               >
//                 <InputField
//                   control={searchForm.control}
//                   name="search"
//                   placeholder="Search pages..."
//                   autoComplete="off"
//                   formItemClassName="gap-0 space-y-0 w-full"
//                   className="h-9 bg-white border-white/20 shadow-none"
//                   startContent={
//                     <MdSearch className="text-lg text-muted-foreground" />
//                   }
//                   onInput={() => setShowSuggestions?.(true)}
//                 />
//               </form>
//             </Form>
//           ) : null}

//           {isSuggestionsOpen && (
//             <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden">
//               {!hasMenuData ? (
//                 <p className="px-3 py-2.5 text-xs text-gray-500">Loading pages…</p>
//               ) : suggestions.length ? (
//                 <ul className="max-h-64 overflow-y-auto py-1">
//                   {suggestions.map((item, index) => (
//                     <li key={`${item.group}-${item.href}-${item.label}`}>
//                       <button
//                         type="button"
//                         onMouseDown={(event) => event.preventDefault()}
//                         onClick={() => handleSelectSuggestion?.(item)}
//                         className={`w-full text-left px-3 py-2 transition-colors ${
//                           index === activeIndex
//                             ? "bg-primary/10"
//                             : "hover:bg-gray-50"
//                         }`}
//                       >
//                         <p className="text-sm font-medium text-gray-800 truncate">
//                           {item.label}
//                         </p>
//                         <p className="text-[11px] text-gray-400 truncate">
//                           {item.group}
//                         </p>
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="px-3 py-2.5 text-xs text-gray-500">No pages found</p>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Notifications */}
//         <button
//           className="relative p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
//           aria-label="Notifications"
//         >
//           <MdNotifications className="text-xl" />
//           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-primary" />
//         </button>

//         {/* Call — hidden on small screens */}
//         <button
//           className="hidden sm:flex p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
//           aria-label="Call"
//         >
//           <MdCall className="text-xl" />
//         </button>

//         {/* Divider */}
//         <div className="h-6 w-px bg-white/20 mx-1 flex-shrink-0" />

//         {/* User dropdown */}
//         <DropdownMenu>
//           <DropdownMenuTrigger className="outline-none">
//             {/* Trigger: show skeleton until mounted so SSR and client-first render match */}
//             {!mounted ? (
//               <div className="flex items-center gap-2 px-2 py-1.5">
//                 <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
//                 <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
//               </div>
//             ) : userName ? (
//               <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
//                 {/* Avatar */}
//                 <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 shadow-sm">
//                   {userName.charAt(0).toUpperCase()}
//                 </div>
//                 {/* Name — hidden on small screens */}
//                 <span className="hidden md:block text-white text-sm font-medium max-w-[100px] truncate">
//                   {userName}
//                 </span>
//                 <MdOutlineArrowDropDown className="hidden md:block text-white/60 text-lg group-hover:text-white transition-colors" />
//               </div>
//             ) : (
//               <div className="flex items-center gap-2 px-2 py-1.5">
//                 <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
//                 <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
//               </div>
//             )}
//           </DropdownMenuTrigger>

//           <DropdownMenuContent
//             align="end"
//             className="w-52 border border-gray-200 shadow-xl rounded-xl mt-2 p-1"
//           >
//             <DropdownMenuLabel className="px-3 py-2">
//               <p className="text-xs text-gray-400 font-normal">Signed in as</p>
//               <p className="text-sm font-semibold text-gray-800 truncate">
//                 {userName}
//               </p>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator className="my-1" />
//             <DropdownMenuItem
//               onClick={() => router.push("/profile")}
//               className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-primary/8 focus:bg-primary/10 transition-colors"
//             >
//               <MdPerson className="text-base text-primary/70" />
//               Profile
//             </DropdownMenuItem>
//             <DropdownMenuItem
//               onClick={!logoutLoading ? handleLogout : undefined}
//               disabled={logoutLoading}
//               className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors"
//             >
//               <MdLogout className="text-base" />
//               {logoutLoading ? "Logging out…" : "Logout"}
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// };

// export default Navbar;


"use client";

import {
  MdCall,
  MdNotifications,
  MdOutlineArrowDropDown,
  MdMenu,
  MdPerson,
  MdLogout,
  MdSearch,
} from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import getCookieData from "../../utils/getCookieData";
import { useRouter } from "next/navigation";
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
  const searchWrapRef = useRef(null);
  const router = useRouter();

  const query = String(searchValue || "").trim();
  const isSuggestionsOpen = Boolean(showSuggestions && query);

  useEffect(() => {
    setOrgName(getCookieData("userOrgName"));
    setUserName(getCookieData("userName"));
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target)
      ) {
        setShowSuggestions?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowSuggestions]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const selected = suggestions[activeIndex] || suggestions[0];
    if (selected) handleSelectSuggestion?.(selected);
  };

  const handleSearchKeyDown = (event) => {
    if (!isSuggestionsOpen || !suggestions.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1,
      );
    } else if (event.key === "Escape") {
      setShowSuggestions?.(false);
    }
  };

  return (
    /* ── height matches sidebar logo area exactly ── */
    <header className="h-[64px] w-full bg-[#00264D] flex-shrink-0 flex items-center px-2 sm:px-4 lg:px-5 gap-1 sm:gap-2 lg:gap-3">
      {/* ── Hamburger — mobile only ── */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex-shrink-0 p-1.5 sm:p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out"
        aria-label="Toggle sidebar"
      >
        <MdMenu className="text-2xl" />
      </button>

      {/* ── Org info — truncates on small screens ── */}
      <div className="flex items-center gap-1 min-w-0 max-w-[34%] sm:max-w-[28%] md:max-w-[36%] lg:max-w-xs shrink">
        {/* <span className="hidden sm:inline text-white/60 text-[10px] sm:text-xs font-medium whitespace-nowrap">
          Organisation:
        </span> */}
        {orgName ? (
          <span className="text-white text-[11px] sm:text-sm font-semibold truncate">
            {orgName}
          </span>
        ) : (
          <Skeleton className="w-16 sm:w-28 h-3 sm:h-4 bg-white/15 rounded" />
        )}
      </div>

      {/* ── Search + Quick + actions ── */}
      <div className="flex items-center gap-0.5 sm:gap-1.5 flex-1 min-w-0 justify-end">
        {/* ── Page search ── */}
        <div
          ref={searchWrapRef}
          className="relative flex-1 min-w-0 max-w-[92px] min-[400px]:max-w-[140px] sm:max-w-xs md:max-w-sm lg:max-w-md ml-auto transition-all duration-200 ease-out"
        >
          {searchForm ? (
            <Form {...searchForm}>
              <form
                onSubmit={handleSearchSubmit}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => query && setShowSuggestions?.(true)}
                autoComplete="off"
              >
                <InputField
                  control={searchForm.control}
                  name="search"
                  placeholder="Search..."
                  autoComplete="off"
                  formItemClassName="gap-0 space-y-0 w-full"
                  className="h-9 bg-white border-white/20 shadow-none rounded-lg transition-all duration-200 ease-out focus:shadow-md focus:ring-2 focus:ring-white/30"
                  startContent={
                    <MdSearch className="text-lg text-muted-foreground" />
                  }
                  onInput={() => setShowSuggestions?.(true)}
                />
              </form>
            </Form>
          ) : null}

          {isSuggestionsOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 ease-out">
              {!hasMenuData ? (
                <p className="px-3 py-2.5 text-xs text-gray-500">
                  Loading pages…
                </p>
              ) : suggestions.length ? (
                <ul className="max-h-64 overflow-y-auto py-1">
                  {suggestions.map((item, index) => (
                    <li key={`${item.group}-${item.href}-${item.label}`}>
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelectSuggestion?.(item)}
                        className={`w-full text-left px-3 py-2 transition-colors duration-100 ease-out ${
                          index === activeIndex
                            ? "bg-primary/10"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {item.group}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2.5 text-xs text-gray-500">
                  No pages found
                </p>
              )}
            </div>
          )}
        </div>

        <QuickActions />

        {/* Notifications */}
        <button
          className="relative p-1.5 sm:p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out flex-shrink-0"
          aria-label="Notifications"
        >
          <MdNotifications className="text-xl" />
          <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 bg-red-400 rounded-full border border-[#00264D] animate-pulse" />
        </button>

        {/* Call — hidden on small screens */}
        <button
          className="hidden sm:flex p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 ease-out flex-shrink-0"
          aria-label="Call"
        >
          <MdCall className="text-xl" />
        </button>

        {/* Divider */}
        <div className="hidden xs:block h-6 w-px bg-white/20 mx-0.5 sm:mx-1 flex-shrink-0" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none flex-shrink-0">
            {/* Trigger: show skeleton until mounted so SSR and client-first render match */}
            {!mounted ? (
              <div className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5">
                <Skeleton className="w-8 h-8 rounded-full bg-white/15" />
                <Skeleton className="hidden md:block w-20 h-4 bg-white/15 rounded" />
              </div>
            ) : userName ? (
              <div className="flex items-center gap-2 px-1.5 sm:px-2 py-1.5 rounded-lg hover:bg-white/10 active:scale-95 transition-all duration-150 ease-out cursor-pointer group">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 shadow-sm transition-transform duration-200 ease-out group-hover:scale-105">
                  {userName.charAt(0).toUpperCase()}
                </div>
                {/* Name — hidden on small screens */}
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
              onClick={!logoutLoading ? handleLogout : undefined}
              disabled={logoutLoading}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors duration-150 ease-out"
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