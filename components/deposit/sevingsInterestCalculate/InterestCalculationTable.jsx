import { useTranslation } from "react-i18next";


import React from "react";

const AVATAR_COLORS = [
  { bg: "#EEEDFE", text: "#3C3489" },
  { bg: "#E6F1FB", text: "#0C447C" },
  { bg: "#E1F5EE", text: "#085041" },
  { bg: "#FAEEDA", text: "#633806" },
  { bg: "#FAECE7", text: "#712B13" },
  { bg: "#FBEAF0", text: "#72243E" },
];

const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const getInitials = (name) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

const formatCurrency = (value) =>
  "₹" +
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(value) || 0);

// ── Sort Icon ─────────────────────────────────────────────────────────────────
const SortIcon = ({ active, dir }) => {
  if (!active) return <span className="ml-1 text-[10px] opacity-30">↕</span>;
  return (
    <span className="ml-1 text-[10px] text-blue-500">
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ search }) => (
  <tr>
    <td colSpan={7}>
      <div className="flex flex-col items-center justify-center py-14 gap-2 text-slate-400">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" strokeWidth={1.5} />
          <path strokeWidth={1.5} strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
        <p className="text-sm text-slate-500">
          {search ? `No results for "${search}"` : "No records found"}
        </p>
      </div>
    </td>
  </tr>
);

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 32 }) => {
  const { bg, text } = avatarColor(name || "");
  return (
    <div
      style={{
        width: size,
        height: size,
        background: bg,
        color: text,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size < 36 ? 11 : 13,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {getInitials(name || "")}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const InterestCalculationTable = ({ interestDetails = [] }) => {
  const { t } = useTranslation();
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState("");
  const [sortDir, setSortDir] = React.useState("asc");

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredRows = React.useMemo(() => {
    let rows = [...interestDetails];
    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.Full_Name || "").toLowerCase().includes(s) ||
          (r.Account_No || "").toLowerCase().includes(s) ||
          (r.Ref_Ac_No || "").toLowerCase().includes(s),
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        let va, vb;
        if (["Curr_Balance", "interest_amount"].includes(sortKey)) {
          va = parseFloat(a[sortKey]) || 0;
          vb = parseFloat(b[sortKey]) || 0;
        } else if (sortKey === "total") {
          va =
            (parseFloat(a.Curr_Balance) || 0) +
            (parseFloat(a.interest_amount) || 0);
          vb =
            (parseFloat(b.Curr_Balance) || 0) +
            (parseFloat(b.interest_amount) || 0);
        } else {
          va = (a[sortKey] || "").toLowerCase();
          vb = (b[sortKey] || "").toLowerCase();
        }
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return rows;
  }, [interestDetails, search, sortKey, sortDir]);

  const grandBalance = filteredRows.reduce(
    (s, r) => s + (parseFloat(r.Curr_Balance) || 0),
    0,
  );
  const grandInterest = filteredRows.reduce(
    (s, r) => s + (parseFloat(r.interest_amount) || 0),
    0,
  );
  const grandTotal = grandBalance + grandInterest;

  const COLS = [
    { label: "#", key: null },
    { label: t("deposit.fields.accountNo"), key: "Account_No" },
    { label: t("deposit.fields.refAccountNo"), key: "Ref_Ac_No" },
    { label: t("deposit.fields.memberName"), key: "Full_Name" },
    { label: t("deposit.fields.availableBalance"), key: "Curr_Balance", right: true },
    { label: t("deposit.fields.interestAmount"), key: "interest_amount", right: true },
    { label: t("deposit.fields.total"), key: "total", right: true },
  ];

  // ── Desktop Table ─────────────────────────────────────────────────────────
  const DesktopTable = () => (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            {COLS.map(({ label, key, right }) => (
              <th
                key={label}
                onClick={() => handleSort(key)}
                className={[
                  "py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap select-none",
                  right ? "text-right" : !key ? "text-center" : "text-left",
                  key
                    ? "cursor-pointer hover:text-slate-600 hover:bg-slate-100/60 transition-colors"
                    : "",
                ].join(" ")}
              >
                {label}
                {key && <SortIcon active={sortKey === key} dir={sortDir} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 bg-white">
          {filteredRows.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            filteredRows.map((row, i) => {
              const bal = parseFloat(row.Curr_Balance) || 0;
              const int = parseFloat(row.interest_amount) || 0;
              const tot = bal + int;
              return (
                <tr
                  key={row.Id || i}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono text-[11px] text-slate-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[13px] text-slate-700">
                    {row.Account_No || "—"}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[13px] text-slate-500">
                    {row.Ref_Ac_No || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={row.Full_Name} size={32} />
                      <span className="text-[13px] font-medium text-slate-800 truncate max-w-[170px]">
                        {row.Full_Name || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[13px] text-slate-600">
                    {formatCurrency(bal)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono text-[12px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {formatCurrency(int)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[13px] font-medium text-slate-800">
                    {formatCurrency(tot)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        {filteredRows.length > 0 && (
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td colSpan={4} className="py-3 px-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                  Grand total · {filteredRows.length} record
                  {filteredRows.length !== 1 ? "s" : ""}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-mono text-[13px] font-medium text-slate-700">
                {formatCurrency(grandBalance)}
              </td>
              <td className="py-3 px-4 text-right font-mono text-[13px] font-medium text-emerald-700">
                {formatCurrency(grandInterest)}
              </td>
              <td className="py-3 px-4 text-right font-mono text-[13px] font-medium text-blue-700">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );

  // ── Mobile / Tablet Cards ─────────────────────────────────────────────────
  const MobileCards = () => (
    <div className="flex flex-col gap-3 md:hidden">
      {filteredRows.length === 0 ? (
        <div className="py-14 text-center text-sm text-slate-400">
          {search ? `No results for "${search}"` : "No records found"}
        </div>
      ) : (
        <>
          {filteredRows.map((row, i) => {
            const bal = parseFloat(row.Curr_Balance) || 0;
            const int = parseFloat(row.interest_amount) || 0;
            const tot = bal + int;
            return (
              <div
                key={row.Id || i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <Avatar name={row.Full_Name} size={40} />
                    <div>
                      <p className="text-[14px] font-medium text-slate-800 leading-tight">
                        {row.Full_Name || "—"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Ac: {row.Account_No || "—"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-300">
                    #{String(i + 1).padStart(3, "0")}
                  </span>
                </div>

                {/* Total banner */}
                <div className="bg-blue-50 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-blue-500 font-medium uppercase tracking-wide">
                    Total (bal + interest)
                  </span>
                  <span className="font-mono text-[15px] font-medium text-blue-700">
                    {formatCurrency(tot)}
                  </span>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-50">
                  <div className="px-4 py-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mb-1">
                      Ref. account no.
                    </p>
                    <p className="text-[12px] font-medium text-slate-700 font-mono">
                      {row.Ref_Ac_No || "—"}
                    </p>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mb-1">
                      Current balance
                    </p>
                    <p className="text-[12px] font-medium text-slate-700 font-mono">
                      {formatCurrency(bal)}
                    </p>
                  </div>
                  <div className="px-4 py-3 col-span-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mb-1">
                      Interest amount
                    </p>
                    <p className="text-[13px] font-medium text-emerald-600 font-mono">
                      {formatCurrency(int)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Grand total card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 px-4 py-3.5">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mb-3">
              Grand total · {filteredRows.length} record
              {filteredRows.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: t("deposit.common.balance"),
                  value: grandBalance,
                  color: "text-slate-700",
                },
                {
                  label: t("deposit.fields.interest"),
                  value: grandInterest,
                  color: "text-emerald-600",
                },
                { label: t("deposit.fields.total"), value: grandTotal, color: "text-blue-700" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-[10px] text-slate-400 mb-1">{label}</p>
                  <p className={`text-[12px] font-medium font-mono ${color}`}>
                    {formatCurrency(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-4 mt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="text-lg font-semibold text-slate-800">
            {t("deposit.common.calculatedInterestRecords")}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {filteredRows.length === interestDetails.length
              ? `${interestDetails.length} records total`
              : `${filteredRows.length} of ${interestDetails.length} records`}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <path
                strokeWidth={2}
                strokeLinecap="round"
                d="M21 21l-4.35-4.35"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder={t("deposit.placeholders.searchNameOrAccount") + "…"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-slate-300 hover:text-slate-500 text-lg leading-none"
              aria-label={t("deposit.buttons.clear")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Table on md+, Cards on mobile */}
      <DesktopTable />
      <MobileCards />
    </div>
  );
};

export default InterestCalculationTable;
