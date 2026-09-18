"use client";

import { useTranslation } from "react-i18next";

import {
  AlertTriangle,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap = {
  wallet: Wallet,
  "trending-up": TrendingUp,
  "alert-triangle": AlertTriangle,
  users: Users,
};

const accentMap = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    border: "border-t-blue-500",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600",
    border: "border-t-emerald-500",
  },
  orange: {
    icon: "bg-amber-50 text-amber-500",
    border: "border-t-amber-400",
  },
  purple: {
    icon: "bg-violet-50 text-violet-600",
    border: "border-t-violet-500",
  },
};

export default function MicrofinanceStatCard({ card }) {
  const { t } = useTranslation();
  const Icon = iconMap[card.icon] || Wallet;
  const accent = accentMap[card.accentColor] || accentMap.blue;

  return (
    <Card
      className={cn(
        "overflow-hidden border-slate-200/80 border-t-4 shadow-sm",
        accent.border,
      )}
    >
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-slate-500">
            {card.id === "glp"
              ? t("dashboard.grossLoanPortfolio")
              : card.id === "collection"
                ? t("dashboard.collectionEfficiency")
                : card.id === "par"
                  ? t("dashboard.par30")
                  : card.id === "borrowers"
                    ? t("dashboard.activeBorrowers")
                    : card.label}
          </p>
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {card.id === "borrowers" ? t("dashboard.clients1") : card.value}
          </p>
          {card.subLabel ? (
            <p className="text-xs text-slate-500">
              {card.id === "glp"
                ? t("dashboard.disbursed")
                : card.id === "collection"
                  ? t("dashboard.mtd")
                  : card.id === "par"
                    ? t("dashboard.par90")
                    : card.id === "borrowers"
                      ? t("dashboard.kendras1")
                      : card.subLabel}
            </p>
          ) : null}
          {card.extraLabel ? (
            <p className="text-xs text-slate-500">
              {card.id === "collection"
                ? t("dashboard.todayAmt")
                : card.id === "borrowers"
                  ? t("dashboard.activeJlgs1")
                  : card.extraLabel}
            </p>
          ) : null}
          {card.badge ? (
            <Badge
              className={cn(
                "mt-1 border-0 font-medium",
                card.badge.tone === "success" &&
                  "bg-emerald-50 text-emerald-700",
              )}
            >
              {card.id === "glp"
                  ? t("dashboard.qualifying100")
                  : card.id === "par"
                    ? t("dashboard.healthyAsset")
                    : card.badge.text}
            </Badge>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            accent.icon,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
