import React, { useEffect, useState } from "react";
import CustomerCategoryChart from "@/common/chart/CustomerCategoryChart";
import DepositStatusChart from "@/common/chart/DepositStatusChart";
import LoanStatusChart from "@/common/chart/LoanStatusChart";
import CollectionStatusChart from "@/common/chart/CollectionStatusChart";
import DepositChart from "@/common/chart/DepositChart";
import LoanChart from "@/common/chart/LoanChart";
import { Form, FormField } from "@/components/ui/form";
import KYCDropdownField from "@/common/formFields/KYCDropdownField";
import ShareReceipt from "./ShareReceipt";

/* ── icons ──────────────────────────────────────────────────── */
const PrinterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

/* ── component ───────────────────────────────────────────────── */
const AdminDashboard = ({ form, openingLedgerBranchData }) => {
  const [showDepositChart, setShowDepositChart] = useState(false);
  const [showLoanChart, setShowLoanChart] = useState(false);
  const [now, setNow] = useState(new Date());
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [depositData, setDepositData] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const branchName = form.watch("branchName");

  const selectedBranch = openingLedgerBranchData?.find(
    (branch) => branch.Id === branchName,
  )?.Branch_Name;

  console.log("branchName=", branchName);
  console.log("selectedBranch=", selectedBranch);

  const formatted = now
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");

  const handleGenerateDepositReceipt = () => {
    const sampleDepositData = {
      customerCategories: [
        { name: "ST", value: "4,086" },
        { name: "SC", value: "762" },
        { name: "OBC", value: "658" },
        { name: "Gen", value: "607" },
        { name: "SHG", value: "450" },
      ],
      depositStatus: [
        { type: "SB", count: "1,234", percentage: "45" },
        { type: "RD", count: "856", percentage: "31" },
        { type: "FD", count: "423", percentage: "15" },
        { type: "MIS", count: "234", percentage: "9" },
      ],
      loanStatus: { percentage: "88%" },
      collectionStatus: { demandCollected: "92%", pending: "8%" },
      depositDetails: [
        { label: "New Account", value: "45" },
        { label: "Payment", value: "₹2,45,678" },
        { label: "Payables", value: "₹12,345" },
        { label: "Received", value: "₹2,33,333" },
        { label: "Receivable", value: "₹24,690" },
      ],
    };
    setDepositData(sampleDepositData);
    setIsReceiptOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ══ HEADER ══════════════════════════════════════════════ */}
      <header className="no-print sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
          <button
            // onClick={handlePrint}
            onClick={handleGenerateDepositReceipt}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2
                       text-sm font-semibold text-white shadow
                       hover:bg-indigo-700 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                       transition-all duration-150"
          >
            <PrinterIcon />
            Print / PDF
          </button>

          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <ClockIcon />
            <span>
              Data Last Updated:{" "}
              <span className="font-semibold text-slate-700 tabular-nums tracking-tight">
                {formatted}
              </span>
            </span>
          </div>

          <div className="min-w-52 shadow-md rounded-sm">
            <Form {...form}>
              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <KYCDropdownField
                    label="Branch"
                    value={field.value}
                    onChange={field.onChange}
                    options={openingLedgerBranchData}
                    optionLabelKey="Branch_Name"
                    placeholder="Select branch"
                    searchPlaceholder="Search branch..."
                    labeldisable={true}
                  />
                )}
              />
            </Form>
          </div>
        </div>
      </header>

      {/* ══ CONTENT ═════════════════════════════════════════════ */}
      <main className="px-6 py-5 space-y-5">
        {/* Customer category — full width */}
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <CustomerCategoryChart />
        </section>

        {/* 3-column status charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Deposit Status — clickable, toggles DepositChart */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              // setShowDepositChart((p) => !p);
              setShowDepositChart(true);
              setShowLoanChart(false);
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && setShowDepositChart((p) => !p)
            }
            className={[
              "relative rounded-2xl bg-white border p-1 cursor-pointer select-none",
              "transition-all duration-200",
              showDepositChart
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-slate-200 hover:border-indigo-300 hover:shadow-md",
            ].join(" ")}
          >
            <span
              className="no-print absolute top-3 right-3 flex items-center gap-1
                             rounded-full bg-indigo-50 px-2 py-0.5
                             text-[10px] font-semibold text-indigo-500"
            >
              {showDepositChart ? (
                <>
                  <ChevronUp /> Collapse
                </>
              ) : (
                <>
                  <ChevronDown /> Expand
                </>
              )}
            </span>
            <DepositStatusChart />
          </div>

          {/* Loan Status — clickable, toggles LoanChart */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              // setShowLoanChart((p) => !p);
              setShowLoanChart(true);
              setShowDepositChart(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && setShowLoanChart((p) => !p)}
            className={[
              "relative rounded-2xl bg-white border p-1 cursor-pointer select-none",
              "transition-all duration-200",
              showLoanChart
                ? "border-emerald-400 ring-2 ring-emerald-100"
                : "border-slate-200 hover:border-emerald-300 hover:shadow-md",
            ].join(" ")}
          >
            <span
              className="no-print absolute top-3 right-3 flex items-center gap-1
                             rounded-full bg-emerald-50 px-2 py-0.5
                             text-[10px] font-semibold text-emerald-500"
            >
              {showLoanChart ? (
                <>
                  <ChevronUp /> Collapse
                </>
              ) : (
                <>
                  <ChevronDown /> Expand
                </>
              )}
            </span>
            <LoanStatusChart />
          </div>

          {/* Collection Status */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-1">
            <CollectionStatusChart />
          </div>
        </section>

        {/* Expandable Deposit detail */}
        {showDepositChart && (
          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 shadow-inner p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-400">
              Deposit Details
            </p>
            <DepositChart />
          </section>
        )}

        {/* Expandable Loan detail */}
        {showLoanChart && (
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/50 shadow-inner p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-400">
              Loan Details
            </p>
            <LoanChart />
          </section>
        )}
      </main>

      {/* Deposit Receipt Modal — receives expand state as props */}
      <ShareReceipt
        isOpen={isReceiptOpen}
        setIsOpen={setIsReceiptOpen}
        depositData={depositData}
        showDepositChart={showDepositChart}
        showLoanChart={showLoanChart}
        selectedBranch={selectedBranch}
      />
    </div>
  );
};

export default AdminDashboard;
