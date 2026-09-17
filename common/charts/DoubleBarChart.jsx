"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const COLORS = ["#137547", "#59FFA0"]; // Use your preferred fallback colors

const DoubleBarChart = ({ className, data = [], label }) => {
  if (data.length !== 2) {
    return (
      <div className="text-center text-red-500 font-semibold">
        Chart requires exactly 2 data items.
      </div>
    );
  }

  // Normalize data
  const formattedData = data.map((item, index) => ({
    category: item.label,
    value: Number(item.value),
    fill: COLORS[index],
    color: COLORS[index], // for legends or tooltip if needed
  }));

  // Generate chartConfig dynamically (for ChartContainer or legends)
  const chartConfig = formattedData.reduce((acc, item, index) => {
    acc[`bar${index}`] = {
      label: item.category,
      color: item.color,
    };
    return acc;
  }, {});

  return (
    <div className="w-full max-w-full mx-auto">
      <h2 className="text-xl font-medium text-center mb-2">{label}</h2>
      <ChartContainer config={chartConfig} className={cn("", className)}>
        <BarChart data={formattedData}>
          <XAxis
            dataKey="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value) => [
                  `Amount ₹ ${Number(value).toFixed(2).toLocaleString("en-IN")}`,
                ]}
              />
            }
          />
          <Bar
            dataKey="value"
            barSize={200}
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1000} // 1s
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default DoubleBarChart;
