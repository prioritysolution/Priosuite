"use client";

import { useTranslation } from "react-i18next";

import DropdownField from "@/common/formFields/DropdownField";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatINR } from "@/lib/format";

export default function BranchLiquidityTable({
  branches,
  form,
  openingLedgerBranchData,
}) {
  const { t } = useTranslation();
  return (
    <Card className="w-full min-w-0 border-slate-200/80 shadow-sm">
      <CardHeader className="flex flex-col gap-3 space-y-0 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-lg text-slate-900">
            {t("dashboard.branchLiquidityTitle")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.branchLiquidityDesc")}
          </CardDescription>
        </div>
        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
          {form ? (
            <div className="w-full min-w-0 sm:w-52">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="branchName"
                  render={({ field }) => (
                    <DropdownField
                      label={t("common.branch")}
                      value={field.value}
                      onChange={field.onChange}
                      options={openingLedgerBranchData}
                      optionLabelKey="Branch_Name"
                      placeholder={t("dashboard.selectBranch")}
                      searchPlaceholder={t("dashboard.searchBranch")}
                      labeldisable={true}
                      searchable={true}
                    />
                  )}
                />
              </Form>
            </div>
          ) : null}
          <span className="text-sm font-medium text-slate-500">
            {t("dashboard.activeBranches", { count: branches.length })}
          </span>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto px-0 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="pl-6 text-xs font-medium text-slate-500">
                {t("dashboard.branchName")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.activeLoanBook")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.todaysCollection")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.branchVaultCash")}
              </TableHead>
              <TableHead className="text-xs font-medium text-slate-500">
                {t("dashboard.openLoans")}
              </TableHead>
              <TableHead className="pr-6 text-xs font-medium text-slate-500">
                {t("dashboard.recoveryPct")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id} className="border-slate-100">
                <TableCell className="pl-6">
                  <div className="font-medium text-slate-900">{branch.name}</div>
                  {branch.localName ? (
                    <div className="text-xs text-slate-500">
                      ({branch.localName})
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="text-slate-700">
                  {formatINR(branch.activeLoanBook)}
                </TableCell>
                <TableCell className="text-slate-700">
                  {formatINR(branch.todaysCollection)}
                </TableCell>
                <TableCell className="text-slate-700">
                  {formatINR(branch.branchVaultCash)}
                </TableCell>
                <TableCell className="text-slate-700">
                  {branch.openLoans}
                </TableCell>
                <TableCell className="pr-6">
                  <Badge className="border-0 bg-emerald-50 font-medium text-emerald-700">
                    {branch.recoveryPct.toFixed(1)}%
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
