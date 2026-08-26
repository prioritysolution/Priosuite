"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { accountDetails } from "./memberDashboardData";

const AccountSummary = () => {
  const router = useRouter();

  return (
    <Card className="flex h-full flex-col border-none shadow-sm">
      <CardHeader className="space-y-0 px-4 py-4 sm:px-6">
        <CardTitle className="text-sm font-semibold text-slate-800 sm:text-base">
          Account Summary
        </CardTitle>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-slate-700">Savings Account</p>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Primary
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-4 pb-5 sm:px-6">
        <dl className="space-y-3">
          {accountDetails.map((detail, index) => (
            <div key={detail.label}>
              <div className="flex items-center justify-between gap-4 text-sm">
                <dt className="text-slate-500">{detail.label}</dt>
                <dd
                  className={cn(
                    "truncate text-right font-medium text-slate-800",
                    detail.highlight && "text-emerald-600",
                  )}
                >
                  {detail.value}
                </dd>
              </div>
              {index < accountDetails.length - 1 && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
            onClick={() => router.push("/report/accountLedger")}
          >
            View Statement
          </Button>
          <Button
            type="button"
            className="flex-1 bg-emerald-700 text-white hover:bg-emerald-800"
            onClick={() => router.push("/membership/memberProfile")}
          >
            Account Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSummary;
