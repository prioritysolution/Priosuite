"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const COLORS = ["#137547", "#59FFA0"];

const DoubleBarChart = ({ className, data = [], label }) => {
  if (data.length !== 2) {
    return (
      <div className="text-center text-red-500 text-sm font-semibold py-4">
        Chart requires exactly 2 data items.
      </div>
    );
  }

  const formattedData = [
    {
      category: "Summary",
      [data[0].label]: parseFloat(String(data[0].value).replace(/,/g, "")) || 0,
      [data[1].label]: parseFloat(String(data[1].value).replace(/,/g, "")) || 0,
    },
  ];

  const chartConfig = {
    [data[0].label]: { label: data[0].label, color: COLORS[0] },
    [data[1].label]: { label: data[1].label, color: COLORS[1] },
  };

  const formatValue = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">
          {label}
        </h2>
      )}

      <ChartContainer
        config={chartConfig}
        className={cn("w-full", className ?? "h-[160px]")}
      >
        <BarChart
          data={formattedData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="20%"
          barGap={4}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#f0f0f0"
          />

          <XAxis dataKey="category" hide />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v}`}
            width={48}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
          />

          <ChartTooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            content={
              <ChartTooltipContent
                formatter={(value, name) => [formatValue(value), name]}
              />
            }
          />

          <Bar
            dataKey={data[0].label}
            fill={COLORS[0]}
            radius={[6, 6, 0, 0]}
            maxBarSize={72}
            isAnimationActive
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar
            dataKey={data[1].label}
            fill={COLORS[1]}
            radius={[6, 6, 0, 0]}
            maxBarSize={72}
            isAnimationActive
            animationBegin={120}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ChartContainer>

      <div className="flex justify-center gap-4 mt-1">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-[11px] text-slate-600"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: COLORS[i] }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoubleBarChart;
