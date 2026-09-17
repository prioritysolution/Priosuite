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
} from "recharts";

// ── Data ──────────────────────────────────────────────────────────
const newAccountData = [
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

const paymentData = [
  { month: "Apr", payment: 58.33, payables: 41.67 },
  { month: "May", payment: 42.61, payables: 57.39 },
  { month: "Jun", payment: 100, payables: 0 },
  { month: "Jul", payment: 28.57, payables: 71.43 },
  { month: "Aug", payment: 99.07, payables: 0.93 },
  { month: "Sep", payment: 100, payables: 0 },
  { month: "Oct", payment: 100, payables: 0 },
  { month: "Nov", payment: 100, payables: 0 },
  { month: "Dec", payment: 74.57, payables: 25.43 },
  { month: "Jan", payment: 100, payables: 0 },
  { month: "Feb", payment: 100, payables: 0 },
  { month: "Mar", payment: 58.06, payables: 41.94 },
];

const receivedData = [
  { month: "Apr", received: 0, receivable: 0 },
  { month: "May", received: 0, receivable: 0 },
  { month: "Jun", received: 0, receivable: 0 },
  { month: "Jul", received: 0, receivable: 0.58 },
  { month: "Aug", received: 0, receivable: 50 },
  { month: "Sep", received: 0, receivable: 0 },
  { month: "Oct", received: 0, receivable: 0 },
  { month: "Nov", received: 0, receivable: 4.63 },
  { month: "Dec", received: 0, receivable: 0 },
  { month: "Jan", received: 0, receivable: 100 },
  { month: "Feb", received: 0, receivable: 0 },
  { month: "Mar", received: 20.83, receivable: 4 },
];

// ── Shared ────────────────────────────────────────────────────────
const CARD = {
  border: "1.5px solid #c8d6e0",
  background: "#fff",
  borderRadius: 6,
  display: "flex",
  flexDirection: "column",
};

const LegendDot = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
    <span
      style={{
        width: 13,
        height: 13,
        backgroundColor: color,
        borderRadius: 2,
        display: "inline-block",
        flexShrink: 0,
      }}
    />
    <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>
      {label}
    </span>
  </div>
);

const AmtBtn = () => (
  <span
    style={{
      fontSize: 10,
      border: "1.5px solid #9ca3af",
      borderRadius: 4,
      padding: "1px 7px",
      fontWeight: 700,
      color: "#374151",
      flexShrink: 0,
    }}
  >
    Amt
  </span>
);

// Label inside stacked segment
const InnerLabel = ({ x, y, width, height, value }) => {
  if (!value || value <= 0 || width < 20) return null;
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

// Label outside right of bar
const OuterLabel = ({ x, y, width, height, value }) => {
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
      {value}%
    </text>
  );
};

// ── Panel 1: New Account ──────────────────────────────────────────
function NewAccountChart({ height }) {
  return (
    <div style={{ ...CARD, height }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px 2px",
        }}
      >
        <LegendDot color="#22d3ee" label="New Account" />
        <AmtBtn />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={newAccountData}
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
              width={30}
              tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v) => [v, "New Account"]}
              contentStyle={{ fontSize: 11, borderRadius: 6 }}
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

// ── Panel 2: Payment / Payables ───────────────────────────────────
function PaymentChart({ height }) {
  return (
    <div style={{ ...CARD, height }}>
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
        <div style={{ display: "flex", gap: 12 }}>
          <LegendDot color="#22c55e" label="Payment" />
          <LegendDot color="#3b4fd8" label="Payables" />
        </div>
        <AmtBtn />
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={paymentData}
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
              width={30}
              tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v, n) => [
                `${v}%`,
                n === "payment" ? "Payment" : "Payables",
              ]}
              contentStyle={{ fontSize: 11, borderRadius: 6 }}
            />
            <Bar dataKey="payment" stackId="s" fill="#22c55e" isAnimationActive={false}>
              <LabelList dataKey="payment" content={<InnerLabel />} />
            </Bar>
            <Bar
              dataKey="payables"
              stackId="s"
              fill="#3b4fd8"
              radius={[0, 2, 2, 0]}
              isAnimationActive={false}
            >
              <LabelList dataKey="payables" content={<InnerLabel />} />
              <LabelList dataKey="payables" content={<OuterLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Panel 3: Received / Receivable ────────────────────────────────
function ReceivedChart({ height }) {
  return (
    <div style={{ ...CARD, height }}>
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
        <div style={{ display: "flex", gap: 12 }}>
          <LegendDot color="#f472b6" label="Received" />
          <LegendDot color="#22c55e" label="Receivable" />
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={receivedData}
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
              width={30}
              tick={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v, n) => [
                `${v}%`,
                n === "received" ? "Received" : "Receivable",
              ]}
              contentStyle={{ fontSize: 11, borderRadius: 6 }}
            />
            {/* Received = pink, shown first (left) */}
            <Bar
              dataKey="received"
              stackId="s"
              fill="#f472b6"
              radius={[0, 0, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList dataKey="received" content={<InnerLabel />} />
            </Bar>
            {/* Receivable = green, shown second (right) */}
            <Bar
              dataKey="receivable"
              stackId="s"
              fill="#22c55e"
              radius={[0, 2, 2, 0]}
              isAnimationActive={false}
            >
              <LabelList dataKey="receivable" content={<InnerLabel />} />
              <LabelList dataKey="receivable" content={<OuterLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function DepositChart() {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const check = () =>
      setCols(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        <NewAccountChart height={420} />
        <PaymentChart height={420} />
        <ReceivedChart height={420} />
      </div>
    </div>
  );
}
