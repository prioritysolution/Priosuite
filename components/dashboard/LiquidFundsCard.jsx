"use client";

import { formatINR } from "@/lib/format";

export default function LiquidFundsCard({ data }) {
  return (
    <div
      className="flex h-full min-h-[260px] w-full flex-col justify-between rounded-xl p-6 shadow-sm"
      style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
    >
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "#34d399" }}
        >
          {data.totalLabel}
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white">
          {formatINR(data.total)}
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: "#34d399" }}
            />
            <span style={{ color: "#e2e8f0" }}>
              Cash In Hand (Branch Vaults):{" "}
              <span className="font-semibold text-white">
                {formatINR(data.cashInHand)}
              </span>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: "#38bdf8" }}
            />
            <span style={{ color: "#e2e8f0" }}>
              Bank Balances (Commercial Banks):{" "}
              <span className="font-semibold text-white">
                {formatINR(data.bankBalance)}
              </span>
            </span>
          </li>
        </ul>
      </div>
      <div
        className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t pt-4"
        style={{ borderColor: "rgba(255,255,255,0.1)" }}
      >
        <span className="text-xs" style={{ color: "#94a3b8" }}>
          {data.footerLabel}
        </span>
        <button
          type="button"
          className="text-sm font-medium hover:opacity-90"
          style={{ color: "#34d399" }}
        >
          {data.footerLinkText}
        </button>
      </div>
    </div>
  );
}
