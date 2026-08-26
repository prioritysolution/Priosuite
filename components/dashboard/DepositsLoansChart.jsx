"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { depositsLoansTrend } from "./dashboardData";

const DepositsLoansChart = () => {
  return (
    <Card className="h-full border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 px-4 py-4 sm:px-6">
        <CardTitle className="text-sm font-semibold text-slate-800 sm:text-base">
          Deposits vs Loans Trend
        </CardTitle>
        <Select defaultValue="year">
          <SelectTrigger className="h-8 w-[118px] shrink-0 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pb-4 sm:px-6">
        <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-1 px-2 text-xs text-slate-500 sm:px-0">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Deposits (₹)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Loans (₹)
          </span>
        </div>

        <div className="h-[220px] w-full min-w-0 sm:h-[260px] xl:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={depositsLoansTrend}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                tickFormatter={(v) => `${v} Cr`}
                tickLine={false}
                axisLine={false}
                width={48}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `₹ ${value} Cr`,
                  name === "deposits" ? "Deposits" : "Loans",
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="deposits"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="loans"
                stroke="#16a34a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#16a34a", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositsLoansChart;
