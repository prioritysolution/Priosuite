"use client";

import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { memberQuickActions } from "./memberDashboardData";

const MemberQuickActions = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader className="px-4 py-4 sm:px-6">
        <CardTitle className="text-sm font-semibold text-slate-800 sm:text-base">
          {t("dashboard.quickActions")}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2 pb-4 sm:px-3">
        <nav className="flex flex-col">
          {memberQuickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => router.push(action.href)}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 sm:px-3"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    action.iconBg,
                  )}
                >
                  <Icon className={cn("h-4 w-4", action.iconColor)} />
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                  {action.id === "fund-transfer"
                  ? t("dashboard.fundTransfer")
                  : action.id === "open-fd"
                    ? t("dashboard.openFixedDeposit")
                    : action.id === "apply-loan"
                      ? t("dashboard.applyForLoan")
                      : action.id === "download-passbook"
                        ? t("dashboard.downloadPassbook")
                        : action.id === "update-kyc"
                          ? t("dashboard.updateKyc")
                          : action.label}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default MemberQuickActions;
