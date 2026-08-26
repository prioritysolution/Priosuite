"use client";

import { ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { pendingApprovals } from "./dashboardData";

const PendingApprovals = () => {
  const router = useRouter();

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="px-4 py-4 sm:px-6">
        <CardTitle className="text-sm font-semibold text-slate-800 sm:text-base">
          Pending Approvals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-5 sm:px-6">
        {pendingApprovals.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => router.push(item.href)}
              className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${item.iconColor}`} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                {item.label}
              </span>
              <span
                className={`inline-flex min-w-6 shrink-0 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${item.badgeClass}`}
              >
                {item.count}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PendingApprovals;
