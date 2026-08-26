"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { formatCurrency, memberTransactions } from "./memberDashboardData";

const MemberTransactionTable = () => {
  const router = useRouter();

  return (
    <Card className="flex h-full min-h-0 flex-col border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-4 sm:px-6">
        <CardTitle className="text-sm font-semibold text-slate-800 sm:text-base">
          Recent Transactions
        </CardTitle>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0 text-sm text-emerald-600"
          onClick={() => router.push("/report/daybook")}
        >
          View All
        </Button>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Description</TableHead>
                <TableHead className="whitespace-nowrap">A/c No.</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="whitespace-nowrap text-right">Amount</TableHead>
                <TableHead className="whitespace-nowrap text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberTransactions.map((txn) => {
                const isCredit = txn.type === "credit";
                return (
                  <TableRow key={txn.id}>
                    <TableCell className="whitespace-nowrap text-slate-500">
                      {txn.date}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-slate-800">
                      {txn.description}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-500">
                      {txn.accountNo}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-medium",
                          isCredit ? "text-emerald-600" : "text-red-500",
                        )}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        )}
                        {isCredit ? "Credit" : "Debit"}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-nowrap text-right font-medium",
                        isCredit ? "text-emerald-600" : "text-red-500",
                      )}
                    >
                      {isCredit ? "+ " : "- "}
                      {formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right text-slate-500">
                      {formatCurrency(txn.balance)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MemberTransactionTable;
