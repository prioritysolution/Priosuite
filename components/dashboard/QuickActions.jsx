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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { quickActions } from "./dashboardData";

const QuickActions = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
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

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isDesktop ? "right" : "bottom"}
      shouldScaleBackground={false}
    >
      <DrawerTrigger asChild>
        <Button
          type="button"
          className="h-10 w-full shrink-0 min-[480px]:w-auto"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="ml-2">Quick Actions</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex h-full max-h-[85dvh] md:max-h-none">
        <DrawerHeader className="border-b border-slate-100 px-4 pb-4 text-left sm:px-6">
          <DrawerTitle className="text-slate-800">Quick Actions</DrawerTitle>
          <DrawerDescription>
            Jump to the most used banking tasks
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 sm:gap-3 sm:p-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleNavigate(action.href)}
                  className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-slate-50 active:scale-[0.99] sm:min-h-[5.5rem] sm:flex-col sm:items-start sm:p-4"
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      action.iconBg,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", action.iconColor)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {action.label}
                    </span>
                    {action.description ? (
                      <span className="mt-0.5 block text-xs leading-snug text-slate-500">
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

        <div className="border-t border-slate-100 p-4 sm:hidden">
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
