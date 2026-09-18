"use client";

import { useTranslation } from "react-i18next";

import { Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function FieldAgentTable({ agents }) {
  const { t } = useTranslation();
  return (
    <Card className="w-full min-w-0 overflow-hidden border-slate-200/80 shadow-sm">
      <CardHeader className="flex flex-col gap-3 space-y-0 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-base text-slate-900 sm:text-lg">
              {t("dashboard.fieldAgentTitle")}
            </CardTitle>
            <CardDescription className="mt-1">
              {t("dashboard.fieldAgentDesc")}
            </CardDescription>
          </div>
        </div>
        <Badge className="w-fit shrink-0 border-0 bg-blue-50 font-medium text-blue-700">
          {t("dashboard.fieldAgentsActive", { count: agents.length })}
        </Badge>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="pl-6 text-xs font-medium text-slate-500">
                {t("dashboard.agentName")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.assignedKendras")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.todayTarget")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.collected")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.liveFieldWallet")}
              </TableHead>
              <TableHead className="pr-6 text-xs font-medium text-slate-500">
                {t("dashboard.status")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id} className="border-slate-100">
                <TableCell className="pl-6">
                  <div className="font-medium text-slate-900">{agent.name}</div>
                  <div className="text-xs text-slate-500">{agent.code}</div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {agent.assignedKendras}
                </TableCell>
                <TableCell className="text-slate-700">
                  {formatINR(agent.todayTarget, 0)}
                </TableCell>
                <TableCell className="font-medium text-emerald-600">
                  {formatINR(agent.collected, 0)}
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {formatINR(agent.liveFieldWallet, 0)}
                </TableCell>
                <TableCell className="pr-6">
                  <Badge
                    className={cn(
                      "border-0 font-medium",
                      agent.status === "In Field"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-orange-50 text-orange-700",
                    )}
                  >
                    {agent.status === "In Field"
                      ? t("dashboard.inField")
                      : agent.status === "Returning to Vault"
                        ? t("dashboard.returningToVault")
                        : agent.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
