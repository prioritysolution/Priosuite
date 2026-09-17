"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NpaCards({ metrics }) {
  return (
    <Card className="border-slate-200/80 shadow-sm">
      <CardContent className="space-y-4 p-5">
        {metrics.map((metric) => {
          const isDanger = metric.tone === "danger";
          return (
            <div
              key={metric.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {metric.label}
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {metric.value}
                </p>
                {metric.subLabel ? (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {metric.subLabel}
                  </p>
                ) : null}
              </div>
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  isDanger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600",
                )}
              >
                {isDanger ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
