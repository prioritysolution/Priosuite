"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { accountsOverview, totalAccounts } from "./dashboardData";

const AccountsOverview = () => {
  const router = useRouter();

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-4 py-4 sm:px-6">
        <CardTitle className="text-sm font-semibold text-slate-800 sm:text-base">
          Accounts Overview
        </CardTitle>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 text-sm text-blue-600"
          onClick={() => router.push("/deposit/openDepositAccount")}
        >
          View All
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-5 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between xl:flex-col 2xl:flex-row">
          <div className="relative h-[168px] w-[168px] shrink-0 sm:h-[180px] sm:w-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accountsOverview}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={54}
                  outerRadius={78}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {accountsOverview.map((slice) => (
                    <Cell key={slice.id} fill={slice.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {totalAccounts.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-500">Total Accounts</span>
            </div>
          </div>

          <ul className="w-full space-y-3 sm:w-auto sm:min-w-[180px] xl:w-full">
            {accountsOverview.map((slice) => (
              <li
                key={slice.id}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="flex min-w-0 items-center gap-2 text-slate-500">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${slice.dotClass}`} />
                  <span className="truncate">{slice.label}</span>
                </span>
                <span className="shrink-0 font-medium text-slate-800">
                  {slice.value.toLocaleString("en-IN")}{" "}
                  <span className="text-slate-400">({slice.percent})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountsOverview;
