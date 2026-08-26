"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getMemberSummaryCards } from "./memberDashboardData";

const SummaryCard = ({ card }) => {
  const [visible, setVisible] = useState(true);
  const Icon = card.icon;

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-xs font-medium sm:text-sm",
              card.labelColor || "text-slate-500",
            )}
          >
            {card.label}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <p
              className={cn(
                "truncate text-lg font-semibold tracking-tight sm:text-xl",
                card.valueColor || "text-slate-900",
              )}
            >
              {visible ? card.value : "₹ ••••••"}
            </p>
            {card.maskable && (
              <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="shrink-0 text-slate-400 hover:text-slate-700"
                aria-label={visible ? "Hide balance" : "Show balance"}
              >
                {visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <p className="mt-1 truncate text-xs text-slate-500">{card.subtext}</p>
        </div>

        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12",
            card.iconBg,
          )}
        >
          <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", card.iconColor)} />
        </div>
      </CardContent>
    </Card>
  );
};

const MemberSummaryCards = ({ dashboardItemData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[108px] rounded-xl" />
        ))}
      </div>
    );
  }

  const cards = getMemberSummaryCards(dashboardItemData);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard key={card.id} card={card} />
      ))}
    </div>
  );
};

export default MemberSummaryCards;
