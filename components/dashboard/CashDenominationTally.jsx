"use client";

import { useTranslation } from "react-i18next";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function CashDenominationTally({ data }) {
  const { t } = useTranslation();
  const [counts, setCounts] = useState(() =>
    Object.fromEntries(data.denominations.map((d) => [d.id, d.count])),
  );

  const rows = useMemo(
    () =>
      data.denominations.map((d) => {
        const noteValue = Number(d.id) || 0;
        const count = Number(counts[d.id]) || 0;
        return { ...d, count, total: noteValue * count };
      }),
    [counts, data.denominations],
  );

  const totalCounted = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg text-slate-900">
            {t("dashboard.cashTallyTitle")}
          </CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            {t("dashboard.cashNoteCount")}
          </p>
        </div>
        {data.isReconciled ? (
          <Badge className="border-0 bg-emerald-50 font-medium text-emerald-700">
            {t("dashboard.reconciledZero")}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-lg border border-slate-200 bg-slate-50/80 p-3"
            >
              <p className="text-xs font-medium text-slate-500">
                {row.id === "500"
                  ? t("dashboard.notes500")
                  : row.id === "200"
                    ? t("dashboard.notes200")
                    : row.id === "100"
                      ? t("dashboard.notes100")
                      : row.id === "50"
                        ? t("dashboard.notes50")
                        : row.id === "20"
                          ? t("dashboard.notes20")
                          : row.id === "10"
                            ? t("dashboard.notes10")
                            : row.label}
              </p>
              <Input
                type="number"
                min={0}
                value={counts[row.id]}
                onChange={(e) =>
                  setCounts((prev) => ({
                    ...prev,
                    [row.id]: e.target.value,
                  }))
                }
                className="mt-2 h-9 bg-white text-center font-semibold"
              />
              <p className="mt-2 text-center text-xs font-medium text-slate-600">
                {formatINR(row.total, 0)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-900">
            {t("dashboard.totalPhysicalCash")} {formatINR(totalCounted)}
          </p>
          <Badge
            className={cn(
              "border-0 font-medium",
              data.variance === 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-800",
            )}
          >
            {t("dashboard.varianceBalanced", { amount: formatINR(data.variance) })}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
