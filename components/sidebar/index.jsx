"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { ScrollArea } from "../ui/scroll-area";
import IconDisplay from "@/common/IconDisplay";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import getCookieData from "@/utils/getCookieData";
import { getMenuLabelParts } from "@/utils/menuLabel";

const MenuLabelStack = ({ name, nameLang, primaryClassName, secondaryClassName }) => {
  const { primary, secondary } = getMenuLabelParts(name, nameLang);
  if (!primary) return null;

  return (
    <span className="min-w-0 flex-1 flex flex-col items-start gap-0.5 text-left">
      <span className={primaryClassName}>{primary}</span>
      {secondary ? (
        <span className={secondaryClassName}>{secondary}</span>
      ) : null}
    </span>
  );
};

const Sidebar = ({ loading, onClose }) => {
  const [expandedLink, setExpandedLink] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const sidebarData = useSelector((state) => state.sidebar.sidebarData);
  const endDate = getCookieData("fin_end_date");

  const handleExpandedLink = (title) => {
    setExpandedLink((prev) => (prev !== title ? title : ""));
  };

  return (
    <div className="w-full h-full max-w-full flex flex-col bg-[#00264D]">
      {/* ── Logo header ── */}
      <div className="h-[64px] min-h-[64px] max-h-[64px] flex items-center flex-shrink-0 border-b border-white/10 overflow-hidden relative px-2 sm:px-3">
        <div className="relative w-full h-full flex justify-left min-w-0">
          <Image
            src="/logobg.png"
            alt="Logo"
            fill
            className="object-cover object-left px-1 sm:px-2 py-1"
            priority
          />
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden flex-shrink-0 ml-1 p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors z-10 cursor-pointer"
          aria-label="Close sidebar"
        >
          <MdOutlineClose className="text-xl" />
        </button>
      </div>

      {/* ── Scrollable nav list ── */}
      <ScrollArea className="flex-1 min-h-0 [&>[data-orientation=vertical]]:w-2.5 [&>[data-orientation=vertical]]:bg-white/10 [&>[data-orientation=vertical]_.relative]:bg-white/45 [&>[data-orientation=vertical]_.relative]:hover:bg-white/70">
        <nav className="py-2 sm:py-3 px-1.5 sm:px-2 space-y-1">
          {loading || !sidebarData || !sidebarData.length
            ? Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full h-10 rounded-lg bg-white/10"
                />
              ))
            : sidebarData.map((link, id) => {
                const isActive =
                  link.path === pathname ||
                  link.childLinks?.some((c) => c.Page_Allies === pathname);
                const isExpanded = link.title === expandedLink;
                const hasChildren = link.childLinks?.length > 0;

                return (
                  <div key={id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasChildren) {
                          handleExpandedLink(link.title);
                        } else {
                          handleExpandedLink("");
                          if (link.path) {
                            router.replace(link.path);
                            onClose?.();
                          }
                        }
                      }}
                      className={cn(
                        "w-full flex items-start justify-between gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer min-w-0",
                        isActive
                          ? "bg-[#14B8A6] text-white shadow-sm"
                          : "text-white/85 hover:bg-white/10 hover:text-white border border-white/20",
                      )}
                    >
                      <span className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                        <span
                          className={cn(
                            "text-[18px] sm:text-[20px] flex-shrink-0 mt-0.5 transition-colors",
                            isActive
                              ? "text-white"
                              : "text-white group-hover:text-white",
                          )}
                        >
                          <IconDisplay
                            iconName={link.Icon}
                            iconSet={link.Icon?.slice(0, 2).toLowerCase()}
                          />
                        </span>
                        <MenuLabelStack
                          name={link.title}
                          nameLang={link.title_lang}
                          primaryClassName="text-[13px] sm:text-[14px] lg:text-[15px] leading-snug whitespace-normal break-words font-medium"
                          secondaryClassName="text-[11px] sm:text-[12px] leading-snug whitespace-normal break-words text-white/65 font-normal"
                        />
                      </span>

                      {hasChildren && (
                        <span className="flex-shrink-0 text-white/60 mt-0.5">
                          {isExpanded ? (
                            <FiChevronUp className="text-base" />
                          ) : (
                            <FiChevronDown className="text-base" />
                          )}
                        </span>
                      )}
                    </button>

                    {hasChildren && isExpanded && (
                      <div
                        className={cn(
                          "relative mb-1.5 min-w-0",
                          "before:absolute before:left-3 sm:before:left-[18px] before:top-0 before:h-full before:w-[1.5px] before:rounded-sm before:bg-white/20",
                        )}
                      >
                        {link.childLinks.map((item, idx) => {
                          const isChildActive = item.Page_Allies === pathname;
                          const isHidden =
                            item.Page_Allies === "/voucher/adjustmentVoucher" &&
                            new Date(endDate) > new Date();

                          if (isHidden) return null;

                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                if (item.Page_Allies) {
                                  router.push(item.Page_Allies);
                                  onClose?.();
                                }
                              }}
                              className={cn(
                                "w-full text-left pl-7 sm:pl-9 pr-6 sm:pr-8 py-2 rounded-md transition-all duration-150 relative cursor-pointer min-w-0",
                                "before:absolute before:left-3 sm:before:left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-[1.5px] before:bg-white/20",
                                isChildActive
                                  ? [
                                      "text-white",
                                      "after:absolute after:right-1.5 sm:after:right-2.5 after:top-1/2 after:-translate-y-1/2 after:content-['◄'] after:text-[10px] after:text-white/70",
                                    ]
                                  : "text-white/70 hover:bg-white/6 hover:text-white",
                              )}
                            >
                              <MenuLabelStack
                                name={item.Menue_Name}
                                nameLang={item.Menue_Name_Lang}
                                primaryClassName={cn(
                                  "text-[12px] sm:text-[13px] lg:text-[13.5px] tracking-wide leading-snug whitespace-normal break-words",
                                  isChildActive
                                    ? "font-semibold text-white"
                                    : "font-medium",
                                )}
                                secondaryClassName={cn(
                                  "text-[10px] sm:text-[11px] leading-snug whitespace-normal break-words",
                                  isChildActive
                                    ? "text-white/75"
                                    : "text-white/50",
                                )}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
        </nav>
      </ScrollArea>

      <div className="flex-shrink-0 border-t border-white/10 px-3 sm:px-4 h-10 flex items-center min-w-0">
        <Link
          href="https://prioritysolutions.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 text-[10px] sm:text-[11px] font-medium tracking-widest uppercase cursor-pointer hover:text-white/80 truncate"
        >
          Powered By Priority Solutions
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
