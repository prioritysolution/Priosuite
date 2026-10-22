"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ChevronRight, LayoutGrid, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { quickActionGroups } from "./dashboardData";
import getCookieData from "@/utils/getCookieData";

const QuickActions = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(Number(getCookieData("Is_Main_Dash")) === 1);

    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const handleNavigate = (href) => {
    setOpen(false);
    router.push(href);
  };

  if (!isAdmin) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isDesktop ? "right" : "bottom"}
      shouldScaleBackground={false}
    >
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex shrink-0">
              <DrawerTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/75 transition-all duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90 sm:h-9 sm:w-9"
                  aria-label={t("dashboard.quickActions")}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </DrawerTrigger>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="sm:block">
            {t("dashboard.quickActions")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DrawerContent className="flex h-[min(90dvh,720px)] md:h-full md:max-h-none md:w-[min(100%,26rem)] lg:w-[min(100%,30rem)]">
        <DrawerHeader className="relative border-b border-slate-100 px-4 pb-3 pr-12 text-left sm:px-5 sm:pr-14">
          <DrawerTitle className="text-slate-800">
            {t("dashboard.quickActions")}
          </DrawerTitle>
          <DrawerDescription>
            {t("dashboard.quickActionsDesc")}
          </DrawerDescription>
          <DrawerClose asChild>
            <button
              type="button"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 sm:right-4 sm:top-3.5"
              aria-label={t("dashboard.close")}
            >
              <X className="h-4 w-4" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-5 p-3 sm:gap-6 sm:p-5">
            {quickActionGroups.map((group) => (
              <section key={group.id} className="space-y-2.5">
                <h4 className="px-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 gap-2 xs:grid-cols-2">
                  {group.items.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => handleNavigate(action.href)}
                        className="group flex min-h-12 items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-left shadow-sm transition-all duration-150 hover:border-primary/35 hover:bg-[#f8fafc] hover:shadow-md active:scale-[0.99]"
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-150 group-hover:scale-105",
                            action.iconBg,
                          )}
                        >
                          <Icon
                            className={cn("h-4 w-4", action.iconColor)}
                          />
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-slate-800">
                          {action.label}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-primary xs:hidden" />
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-slate-100 p-3 sm:p-4 md:hidden">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="h-10 w-full">
              {t("dashboard.close")}
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QuickActions;
