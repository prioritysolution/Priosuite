"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────
const loanIssuedData = [
  { month: "Apr", value: 3 },
  { month: "May", value: 14 },
  { month: "Jun", value: 25 },
  { month: "Jul", value: 10 },
  { month: "Aug", value: 13 },
  { month: "Sep", value: 4 },
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 21 },
  { month: "Jan", value: 0 },
  { month: "Feb", value: 2 },
  { month: "Mar", value: 8 },
];

const collectionData = [
  { month: "Apr", collected: 58.33, due: 41.67 },
  { month: "May", collected: 42.61, due: 57.39 },
  { month: "Jun", collected: 100, due: 0 },
  { month: "Jul", collected: 28.57, due: 71.43 },
  { month: "Aug", collected: 99.07, due: 0.93 },
  { month: "Sep", collected: 100, due: 0 },
  { month: "Oct", collected: 100, due: 0 },
  { month: "Nov", collected: 100, due: 0 },
  { month: "Dec", collected: 74.57, due: 25.43 },
  { month: "Jan", collected: 100, due: 0 },
  { month: "Feb", collected: 100, due: 0 },
  { month: "Mar", collected: 58.06, due: 41.94 },
];

const customerData = [
  { label: "Individual", value: 6250 },
  { label: "SHG", value: 200 },
  { label: "Staff", value: 6 },
];

// ── Custom label inside stacked bar ───────────────────────────────
const StackedLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (!value || value <= 0) return null;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2 + 1}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#fff"
      fontSize={9}
      fontWeight="700"
    >
      {`${value}%`}
    </text>
  );
};

// Outside label (due %) right of bar
const DueLabel = (props) => {
  const { x, y, width, height, value } = props;
  if (!value || value <= 0) return null;
  return (
    <text
      x={x + width + 4}
      y={y + height / 2 + 1}
      dominantBaseline="central"
      fill="#6b7280"
      fontSize={9}
      fontWeight="600"
    >
      {`${value}%`}
    </text>
  );
};

const CARD = {
  border: "1.5px solid #c8d6e0",
  background: "#fff",
  borderRadius: 6,
};

// ── Panel 1: Loan Issued ──────────────────────────────────────────
function LoanIssuedChart({ height }) {
  return (
    <div style={{ ...CARD, height, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px 2px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              backgroundColor: "#22d3ee",
              borderRadius: 2,
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
            Loan Issued
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            border: "1.5px solid #9ca3af",
            borderRadius: 4,
            padding: "1px 7px",
            fontWeight: 700,
            color: "#374151",
          }}
        >
          Amt
        </span>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={loanIssuedData}
            layout="vertical"
            margin={{ top: 2, right: 34, left: 4, bottom: 10 }}
            barSize={11}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />
            <XAxis
              type="number"
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickCount={6}
            />
            <YAxis
              type="category"
              dataKey="month"
              tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              formatter={(v) => [v, "Loans"]}
              contentStyle={{
                fontSize: 11,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
              }}
            />
            <Bar dataKey="value" fill="#22d3ee" radius={[0, 2, 2, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="value"
                position="right"
                style={{ fill: "#374151", fontSize: 9, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Panel 2: Collection Status ────────────────────────────────────
function CollectionChart({ height }) {
  return (
    <div style={{ ...CARD, height, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px 2px",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 14,
                height: 14,
                backgroundColor: "#22c55e",
                borderRadius: 2,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
              Collected
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 14,
                height: 14,
                backgroundColor: "#3b4fd8",
                borderRadius: 2,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
              Collection Due
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: 10,
            border: "1.5px solid #9ca3af",
            borderRadius: 4,
            padding: "1px 7px",
            fontWeight: 700,
            color: "#374151",
          }}
        >
          Amt
        </span>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={collectionData}
            layout="vertical"
            margin={{ top: 2, right: 36, left: 4, bottom: 10 }}
            barSize={11}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="month"
              tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              formatter={(v, name) => [
                `${v}%`,
                name === "collected" ? "Collected" : "Collection Due",
              ]}
              contentStyle={{
                fontSize: 11,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
              }}
            />
            {/* Collected segment */}
            <Bar dataKey="collected" stackId="s" fill="#22c55e" isAnimationActive={false}>
              <LabelList dataKey="collected" content={<StackedLabel />} />
            </Bar>
            {/* Due segment */}
            <Bar dataKey="due" stackId="s" fill="#3b4fd8" radius={[0, 2, 2, 0]} isAnimationActive={false}>
              <LabelList dataKey="due" content={<StackedLabel />} />
              <LabelList dataKey="due" content={<DueLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Panel 3: Loan By Customer ─────────────────────────────────────
function LoanByCustomerChart({ height }) {
  return (
    <div style={{ ...CARD, height, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px 2px",
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            backgroundColor: "#2563eb",
            borderRadius: 2,
            display: "inline-block",
          }}
        />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
          Loan By Customer
        </span>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={customerData}
            margin={{ top: 16, right: 12, left: 0, bottom: 6 }}
            barSize={40}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip
              formatter={(v) => [v.toLocaleString(), "Amount"]}
              contentStyle={{
                fontSize: 11,
                borderRadius: 6,
                border: "1px solid #e5e7eb",
              }}
            />
            <Bar dataKey="value" fill="#2563eb" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              <LabelList
                dataKey="value"
                position="top"
                style={{ fill: "#374151", fontSize: 10, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function LoanChart() {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const check = () =>
      setCols(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const chartH = 400;

  return (
    <div
      // style={{
      //   width: "100%",
      //   padding: 10,
      //   background: "#f9fafb",
      //   boxSizing: "border-box",
      // }}
      className="border mt-2 rounded-md"
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 10,
        }}
      >
        <LoanIssuedChart height={chartH} />
        <CollectionChart height={chartH} />
        <LoanByCustomerChart height={chartH} />
      </div>
    </div>
  );
}
