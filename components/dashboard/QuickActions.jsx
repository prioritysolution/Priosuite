"use client";

import { useEffect, useState } from "react";
import { ChevronRight, LayoutGrid } from "lucide-react";
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
import { quickActions } from "./dashboardData";
import getCookieData from "@/utils/getCookieData";

const QuickActions = () => {
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
                  aria-label="Quick Actions"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </DrawerTrigger>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="sm:block">
            Quick Actions
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DrawerContent className="flex h-[min(88dvh,640px)] md:h-full md:max-h-none md:w-[min(100%,24rem)] lg:w-[min(100%,28rem)]">
        <DrawerHeader className="border-b border-slate-100 px-4 pb-3 text-left sm:px-5">
          <DrawerTitle className="text-slate-800">Quick Actions</DrawerTitle>
          <DrawerDescription>
            Jump to the most used banking tasks
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid grid-cols-1 gap-2 p-3 xs:grid-cols-2 sm:gap-3 sm:p-5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleNavigate(action.href)}
                  className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-slate-50 active:scale-[0.99] sm:min-h-[5.25rem] sm:flex-col sm:items-start sm:p-4"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10",
                      action.iconBg,
                    )}
                  >
                    <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", action.iconColor)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {action.label}
                    </span>
                    {action.description ? (
                      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 sm:text-xs">
                        {action.description}
                      </span>
                    ) : null}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 sm:hidden" />
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="border-t border-slate-100 p-3 sm:p-4 md:hidden">
          <DrawerClose asChild>
            <Button type="button" variant="outline" className="h-10 w-full">
              Close
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QuickActions;
