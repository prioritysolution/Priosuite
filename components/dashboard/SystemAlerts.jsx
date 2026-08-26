"use client";

import { ChevronRight, TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { systemAlerts } from "./dashboardData";

const SystemAlerts = () => {
  const router = useRouter();

  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="px-4 py-4 sm:px-6">
        <CardTitle className="text-sm font-semibold text-slate-800 sm:text-base">
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-4 pb-5 sm:px-6">
        {systemAlerts.map((alert) => (
          <button
            key={alert.id}
            type="button"
            onClick={() => router.push(alert.href)}
            className="flex w-full items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-left transition-colors hover:bg-red-100"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
            <span className="flex-1 text-sm leading-snug text-red-800">
              {alert.message}
            </span>
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
