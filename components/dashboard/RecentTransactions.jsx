"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { recentTransactions } from "./dashboardData";

const RecentTransactions = () => {
  const router = useRouter();

  return (
    <Card className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-3 space-y-0 px-4 py-4 sm:px-5">
        <CardTitle className="truncate text-sm font-semibold text-slate-800 sm:text-base">
          Recent Transactions
        </CardTitle>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto shrink-0 p-0 text-sm text-blue-600"
          onClick={() => router.push("/report/daybook")}
        >
          View All
        </Button>
      </CardHeader>

      <CardContent className="min-h-0 min-w-0 flex-1 overflow-hidden px-4 pb-4 sm:px-5">
        <ul className="h-[280px] space-y-0 overflow-y-auto overflow-x-hidden xl:h-[300px]">
          {recentTransactions.map((tx) => {
            const Icon = tx.icon;
            return (
              <li
                key={tx.id}
                className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-3 border-b border-slate-100 py-3.5 last:border-b-0 first:pt-0"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${tx.iconColor}`} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {tx.title}
                  </p>
                  <p className="truncate text-xs text-slate-500">{tx.account}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-slate-800">
                    {tx.amount}
                  </p>
                  <p className="text-[11px] leading-4 text-slate-400">
                    {tx.time}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
