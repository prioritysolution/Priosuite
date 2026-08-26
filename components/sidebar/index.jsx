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

const Sidebar = ({ loading, onClose }) => {
  const [expandedLink, setExpandedLink] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const sidebarData = useSelector((state) => state.sidebar.sidebarData);
  const endDate = getCookieData("fin_end_date");

  const handleExpandedLink = (title) => {
    setExpandedLink((prev) => (prev !== title ? title : ""));
  };

  const handlePriosuiteV2Click = () => {
    const cookies = document.cookie;
    const cookieArray = cookies.split('; ');
    const params = new URLSearchParams();
    
    cookieArray.forEach(cookie => {
      const [key, ...rest] = cookie.split('=');
      if (key) {
        const trimmedKey = key.trim();
        params.append(`priosuite_Ims_${trimmedKey}`, rest.join('=') || '');
      }
    });
    
    const baseUrl = process.env.NEXT_PUBLIC_IMS_URL || 'http://localhost:3000';
    const url = `${baseUrl}?${params.toString()}`;
    window.open(
      url,
      '_blank',
      'width=1200,height=800,left=100,top=100,resizable=yes,scrollbars=yes'
    );
  };

  return (
    <div className="w-64 h-full flex flex-col bg-[#00264D]">
      {/* ── Logo header ── */}
      <div className="h-[64px] min-h-[64px] max-h-[64px] flex items-center flex-shrink-0 border-b border-white/10 overflow-hidden relative px-3">
        <div className="relative w-full h-full flex justify-left">
          <Image
            src="/logobg.png"
            alt="Logo"
            fill
            className="object-cover object-left px-2 py-1"
            priority
          />
        </div>
        <span className="hidden  absolute right-1 top-12 text-white/30 text-xs">
          v1.0.1
        </span>
        <span className="lg:hidden absolute right-8 top-12 text-white/30 text-xs">
          v1.0.1
        </span>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden flex-shrink-0 ml-2 p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10"
          aria-label="Close sidebar"
        >
          <MdOutlineClose className="text-xl" />
        </button>
      </div>

      {/* ── Scrollable nav list ── */}
      <ScrollArea className="flex-1 [&>[data-orientation=vertical]_.relative]:bg-white/20 [&>[data-orientation=vertical]_.relative]:hover:bg-white/40 [&>[data-orientation=vertical]]:w-1.5">
        <nav className="py-3 px-2 space-y-1">
          {loading || !sidebarData || !sidebarData.length
            ? /* Loading skeletons */
              Array.from({ length: 12 }).map((_, i) => (
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
                  <div key={id}>
                    {/* ── Parent nav item ── */}
                    <button
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
                        "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-[#14B8A6] text-white shadow-sm"
                          : "text-white/85 hover:bg-white/10 hover:text-white border border-white/20",
                      )}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span
                          className={cn(
                            "text-[20px] flex-shrink-0 transition-colors",
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
                        <span className="truncate text-[15px]">
                          {link.title}
                        </span>
                      </span>

                      {hasChildren && (
                        <span className="flex-shrink-0 text-white/60">
                          {isExpanded ? (
                            <FiChevronUp className="text-base" />
                          ) : (
                            <FiChevronDown className="text-base" />
                          )}
                        </span>
                      )}
                    </button>

                    {/* ── Child nav items ── */}
                    {hasChildren && isExpanded && (
                      <div
                        className={cn(
                          "relative mb-1.5",
                          // vertical connector bar
                          "before:absolute before:left-[18px] before:top-0 before:h-full before:w-[1.5px] before:rounded-sm before:bg-white/20",
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
                              key={idx}
                              onClick={() => {
                                if (item.Page_Allies) {
                                  router.push(item.Page_Allies);
                                  onClose?.();
                                }
                              }}
                              className={cn(
                                "w-full text-left pl-9 pr-8 py-[9px] rounded-md transition-all duration-150 relative",
                                // horizontal tick from vertical bar
                                "before:absolute before:left-[18px] before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-[1.5px] before:bg-white/20",
                                isChildActive
                                  ? [
                                      "text-white",
                                      // ◄ triangle marker on the right
                                      "after:absolute after:right-2.5 after:top-1/2 after:-translate-y-1/2 after:content-['◄'] after:text-[10px] after:text-white/70",
                                    ]
                                  : "text-white/70 hover:bg-white/6 hover:text-white",
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[13.5px] tracking-wide",
                                  isChildActive
                                    ? "font-semibold"
                                    : "font-medium",
                                )}
                              >
                                {item.Menue_Name}
                              </span>
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

      <div className="px-3 py-2 border-t border-white/10">
        <button
          onClick={handlePriosuiteV2Click}
          className="w-full bg-[#14B8A6] text-white py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors"
        >
          priosuite V2
        </button>
      </div>

      {/* ── Bottom brand bar ── */}
      <div className="flex-shrink-0 border-t border-white/10 px-4 h-10 flex items-center">
        <Link
          href="https://prioritysolutions.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 text-xs font-medium tracking-widest uppercase"
        >
          {/* EziCBS <span className="text-white/30">v1.0.1</span> */}
          By Priority Solutions
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
