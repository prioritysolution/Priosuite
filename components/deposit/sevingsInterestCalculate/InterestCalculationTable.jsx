// // import React from "react";
// // import { ArrowUpDown, Search } from "lucide-react";

// // // ── Column definitions ────────────────────────────────────────────────────────
// // const COLUMNS = [
// //   { label: "#", key: null, cls: "w-12 text-center" },
// //   { label: "Account No.", key: "Account_No", cls: "min-w-[120px]" },
// //   { label: "Ref. Account No.", key: "Ref_Ac_No", cls: "min-w-[120px]" },
// //   { label: "Member Name", key: "Full_Name", cls: "min-w-[200px]" },
// //   { label: "Current Balance", key: "Curr_Balance", cls: "min-w-[130px] text-right" },
// //   { label: "Interest Amount", key: "interest_amount", cls: "min-w-[130px] text-right" },
// //   { label: "Total", key: "total", cls: "min-w-[150px] text-right" },
// // ];

// // // ── Utils ─────────────────────────────────────────────────────────────────────
// // const formatCurrency = (amount) => {
// //   const n = typeof amount === "string" ? parseFloat(amount) : amount;
// //   return new Intl.NumberFormat("en-IN", {
// //     minimumFractionDigits: 2,
// //     maximumFractionDigits: 2,
// //   }).format(n || 0);
// // };

// // const getInitials = (name) =>
// //   name
// //     ?.split(" ")
// //     .slice(0, 2)
// //     .map((w) => w[0])
// //     .join("")
// //     .toUpperCase() || "?";

// // const AVATAR_COLORS = [
// //   "bg-violet-100 text-violet-700",
// //   "bg-sky-100 text-sky-700",
// //   "bg-emerald-100 text-emerald-700",
// //   "bg-amber-100 text-amber-700",
// //   "bg-rose-100 text-rose-700",
// //   "bg-teal-100 text-teal-700",
// // ];

// // const avatarColor = (name) =>
// //   AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// // // ── Empty State ───────────────────────────────────────────────────────────────
// // const EmptyState = ({ search }) => (
// //   <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
// //     <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
// //       <svg
// //         className="w-5 h-5 text-slate-400"
// //         fill="none"
// //         stroke="currentColor"
// //         viewBox="0 0 24 24"
// //       >
// //         <path
// //           strokeLinecap="round"
// //           strokeLinejoin="round"
// //           strokeWidth={1.5}
// //           d="M9 12h6m-3-3v6M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
// //         />
// //       </svg>
// //     </div>
// //     <p className="text-sm font-medium text-slate-500">
// //       {search ? `No results for "${search}"` : "No records found"}
// //     </p>
// //     {search && (
// //       <p className="text-xs text-slate-400">Try adjusting your search</p>
// //     )}
// //   </div>
// // );

// // // ── Sort Icon ─────────────────────────────────────────────────────────────────
// // const SortIcon = ({ active, dir }) => (
// //   <ArrowUpDown
// //     className={`ml-1.5 h-3 w-3 shrink-0 transition-all ${
// //       active
// //         ? "opacity-100 text-blue-500"
// //         : "opacity-0 group-hover/th:opacity-40"
// //     }`}
// //   />
// // );

// // const InterestCalculationTable = ({ interestDetails = [] }) => {
// //   // Local state for sorting and search
// //   const [searchTerm, setSearchTerm] = React.useState("");
// //   const [sortKey, setSortKey] = React.useState("");
// //   const [sortDir, setSortDir] = React.useState("asc");

// //   // Handle Sort
// //   const handleSort = (key) => {
// //     if (sortKey === key) {
// //       setSortDir(sortDir === "asc" ? "desc" : "asc");
// //     } else {
// //       setSortKey(key);
// //       setSortDir("asc");
// //     }
// //   };

// //   // Filter & Sort rows
// //   const filteredRows = React.useMemo(() => {
// //     let result = [...interestDetails];
// //     if (searchTerm.trim()) {
// //       const lowSearch = searchTerm.toLowerCase();
// //       result = result.filter(
// //         (row) =>
// //           String(row.Full_Name || "").toLowerCase().includes(lowSearch) ||
// //           String(row.Account_No || "").toLowerCase().includes(lowSearch) ||
// //           String(row.Ref_Ac_No || "").toLowerCase().includes(lowSearch)
// //       );
// //     }
// //     if (sortKey) {
// //       result.sort((a, b) => {
// //         let valA = a[sortKey];
// //         let valB = b[sortKey];

// //         if (sortKey === "Curr_Balance" || sortKey === "interest_amount" || sortKey === "Account_No") {
// //           valA = parseFloat(valA) || 0;
// //           valB = parseFloat(valB) || 0;
// //         } else if (sortKey === "total") {
// //           valA = (parseFloat(a.Curr_Balance) || 0) + (parseFloat(a.interest_amount) || 0);
// //           valB = (parseFloat(b.Curr_Balance) || 0) + (parseFloat(b.interest_amount) || 0);
// //         } else {
// //           valA = String(valA || "").toLowerCase();
// //           valB = String(valB || "").toLowerCase();
// //         }

// //         if (valA < valB) return sortDir === "asc" ? -1 : 1;
// //         if (valA > valB) return sortDir === "asc" ? 1 : -1;
// //         return 0;
// //       });
// //     }
// //     return result;
// //   }, [interestDetails, searchTerm, sortKey, sortDir]);

// //   // ── Desktop Table ─────────────────────────────────────────────────────────
// //   const DesktopTable = () => (
// //     <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
// //       <table className="w-full border-collapse text-sm">
// //         <thead>
// //           <tr className="bg-slate-50 border-b border-slate-100">
// //             {COLUMNS.map(({ label, key, cls }) => (
// //               <th
// //                 key={label}
// //                 onClick={() => key && handleSort(key)}
// //                 className={`
// //                   group/th py-3 px-4 text-[11px] font-semibold uppercase tracking-wider
// //                   text-slate-400 whitespace-nowrap select-none text-left
// //                   first:pl-5 last:pr-5
// //                   ${key ? "cursor-pointer hover:text-slate-600 hover:bg-slate-100/60 transition-colors" : ""}
// //                   ${cls.includes("text-right") ? "text-right" : ""}
// //                   ${cls.includes("text-center") ? "text-center" : ""}
// //                 `}
// //               >
// //                 <span className="inline-flex items-center">
// //                   {label}
// //                   {key && <SortIcon active={sortKey === key} dir={sortDir} />}
// //                 </span>
// //               </th>
// //             ))}
// //           </tr>
// //         </thead>
// //         <tbody className="divide-y divide-slate-50 bg-white">
// //           {filteredRows.length === 0 ? (
// //             <tr>
// //               <td colSpan={COLUMNS.length}>
// //                 <EmptyState search={searchTerm} />
// //               </td>
// //             </tr>
// //           ) : (
// //             filteredRows.map((row, i) => {
// //               const currentBalance = parseFloat(row.Curr_Balance) || 0;
// //               const interestAmount = parseFloat(row.interest_amount) || 0;
// //               const totalAmount = currentBalance + interestAmount;

// //               return (
// //                 <tr
// //                   key={row.Id || i}
// //                   className="group hover:bg-blue-50/40 transition-colors duration-100"
// //                 >
// //                   {/* Sl. No. */}
// //                   <td className="py-3.5 px-4 pl-5 text-center">
// //                     <span className="font-mono text-[11px] text-slate-300 tabular-nums">
// //                       {String(i + 1).padStart(2, "0")}
// //                     </span>
// //                   </td>

// //                   {/* Account No. */}
// //                   <td className="py-3.5 px-4 font-mono text-[13px] text-slate-700">
// //                     {row.Account_No || "—"}
// //                   </td>

// //                   {/* Ref. Account No. */}
// //                   <td className="py-3.5 px-4 font-mono text-[13px] text-slate-500">
// //                     {row.Ref_Ac_No || "—"}
// //                   </td>

// //                   {/* Member Name */}
// //                   <td className="py-3.5 px-4">
// //                     <div className="flex items-center gap-3">
// //                       <div
// //                         className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${avatarColor(row.Full_Name || "")}`}
// //                       >
// //                         {getInitials(row.Full_Name || "")}
// //                       </div>
// //                       <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[180px]">
// //                         {row.Full_Name || "—"}
// //                       </span>
// //                     </div>
// //                   </td>

// //                   {/* Current Balance */}
// //                   <td className="py-3.5 px-4 text-right">
// //                     <span className="font-mono text-[13px] font-medium text-slate-600">
// //                       ₹{formatCurrency(currentBalance)}
// //                     </span>
// //                   </td>

// //                   {/* Interest Amount */}
// //                   <td className="py-3.5 px-4 text-right">
// //                     <span className="font-mono text-[13px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
// //                       ₹{formatCurrency(interestAmount)}
// //                     </span>
// //                   </td>

// //                   {/* Total */}
// //                   <td className="py-3.5 px-4 pr-5 text-right">
// //                     <span className="font-mono text-[13px] font-bold text-slate-800">
// //                       ₹{formatCurrency(totalAmount)}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               );
// //             })
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );

// //   // ── Mobile Cards ──────────────────────────────────────────────────────────
// //   const MobileCards = () => {
// //     if (filteredRows.length === 0) return null;

// //     return (
// //       <div className="flex flex-col gap-3 p-1 sm:hidden">
// //         {filteredRows.map((row, i) => {
// //           const currentBalance = parseFloat(row.Curr_Balance) || 0;
// //           const interestAmount = parseFloat(row.interest_amount) || 0;
// //           const totalAmount = currentBalance + interestAmount;

// //           return (
// //             <div
// //               key={row.Id || i}
// //               className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
// //             >
// //               {/* Card Header */}
// //               <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-50">
// //                 <div className="flex items-center gap-3">
// //                   <div
// //                     className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${avatarColor(row.Full_Name || "")}`}
// //                   >
// //                     {getInitials(row.Full_Name || "")}
// //                   </div>
// //                   <div>
// //                     <p className="text-[14px] font-semibold text-slate-800 leading-tight">
// //                       {row.Full_Name || "—"}
// //                     </p>
// //                     <p className="text-[11px] text-slate-400 font-mono leading-tight mt-0.5">
// //                       Ac No: {row.Account_No || "—"}
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <span className="font-mono text-[11px] text-slate-300">
// //                   #{String(i + 1).padStart(3, "0")}
// //                 </span>
// //               </div>

// //               {/* Total Banner */}
// //               <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 flex items-center justify-between">
// //                 <span className="text-[11px] text-blue-100 font-medium uppercase tracking-wide">
// //                   Total (Bal + Interest)
// //                 </span>
// //                 <span className="font-mono text-white font-bold text-[15px]">
// //                   ₹{formatCurrency(totalAmount)}
// //                 </span>
// //               </div>

// //               {/* Details Grid */}
// //               <div className="grid grid-cols-2 gap-px bg-slate-100">
// //                 <div className="bg-white px-3.5 py-2.5">
// //                   <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
// //                     Ref. Account No.
// //                   </p>
// //                   <p className="text-[12px] font-semibold text-slate-700 font-mono">
// //                     {row.Ref_Ac_No || "—"}
// //                   </p>
// //                 </div>
// //                 <div className="bg-white px-3.5 py-2.5">
// //                   <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
// //                     Current Balance
// //                   </p>
// //                   <p className="text-[12px] font-semibold text-slate-700 font-mono">
// //                     ₹{formatCurrency(currentBalance)}
// //                   </p>
// //                 </div>
// //                 <div className="bg-white px-3.5 py-2.5 col-span-2">
// //                   <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
// //                     Interest Amount
// //                   </p>
// //                   <p className="text-[13px] font-bold text-emerald-600 font-mono">
// //                     ₹{formatCurrency(interestAmount)}
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="w-full flex flex-col gap-4 mt-2">
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
// //         <div>
// //           <h4 className="text-lg font-bold text-slate-800">
// //             Calculated Interest Records
// //           </h4>
// //           <p className="text-xs text-slate-400 mt-0.5">
// //             Found {filteredRows.length} matches of {interestDetails.length} records total
// //           </p>
// //         </div>

// //         {/* Local Search input */}
// //         <div className="relative w-full sm:w-72 shrink-0">
// //           <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
// //             <Search className="w-4 h-4" />
// //           </span>
// //           <input
// //             type="text"
// //             placeholder="Search name or account no..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
// //           />
// //         </div>
// //       </div>

// //       {/* Table rendering */}
// //       <DesktopTable />
// //       <MobileCards />
// //     </div>
// //   );
// // };

// // export default InterestCalculationTable;

// import React from "react";

// // ── Column definitions ────────────────────────────────────────────────────────
// const COLUMNS = [
//   { label: "#", key: null, cls: "w-12 text-center" },
//   { label: "Account No.", key: "Account_No", cls: "min-w-[120px]" },
//   { label: "Ref. Account No.", key: "Ref_Ac_No", cls: "min-w-[120px]" },
//   { label: "Member Name", key: "Full_Name", cls: "min-w-[200px]" },
//   {
//     label: "Current Balance",
//     key: "Curr_Balance",
//     cls: "min-w-[140px] text-right",
//   },
//   {
//     label: "Interest Amount",
//     key: "interest_amount",
//     cls: "min-w-[140px] text-right",
//   },
//   { label: "Total", key: "total", cls: "min-w-[150px] text-right" },
// ];

// // ── Utils ─────────────────────────────────────────────────────────────────────
// const formatCurrency = (amount) => {
//   const n = typeof amount === "string" ? parseFloat(amount) : amount;
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(n || 0);
// };

// const getInitials = (name) =>
//   name
//     ?.split(" ")
//     .slice(0, 2)
//     .map((w) => w[0])
//     .join("")
//     .toUpperCase() || "?";

// const AVATAR_COLORS = [
//   "bg-violet-100 text-violet-700",
//   "bg-sky-100 text-sky-700",
//   "bg-emerald-100 text-emerald-700",
//   "bg-amber-100 text-amber-700",
//   "bg-rose-100 text-rose-700",
//   "bg-teal-100 text-teal-700",
// ];

// const avatarColor = (name) =>
//   AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// // ── Sort Icon ─────────────────────────────────────────────────────────────────
// const SortIcon = ({ active, dir }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={`ml-1.5 h-3 w-3 shrink-0 transition-all inline-block ${
//       active
//         ? "opacity-100 text-blue-500"
//         : "opacity-0 group-hover/th:opacity-40"
//     }`}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     {active && dir === "asc" ? (
//       <>
//         <line x1="12" y1="20" x2="12" y2="4" />
//         <polyline points="6 10 12 4 18 10" />
//       </>
//     ) : active && dir === "desc" ? (
//       <>
//         <line x1="12" y1="4" x2="12" y2="20" />
//         <polyline points="6 14 12 20 18 14" />
//       </>
//     ) : (
//       <>
//         <polyline points="7 15 12 20 17 15" />
//         <polyline points="7 9 12 4 17 9" />
//       </>
//     )}
//   </svg>
// );

// // ── Search Icon ───────────────────────────────────────────────────────────────
// const SearchIcon = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="w-4 h-4"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth={2}
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//   </svg>
// );

// // ── Empty State ───────────────────────────────────────────────────────────────
// const EmptyState = ({ search }) => (
//   <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
//     <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
//       <svg
//         className="w-5 h-5 text-slate-400"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={1.5}
//           d="M9 12h6m-3-3v6M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
//         />
//       </svg>
//     </div>
//     <p className="text-sm font-medium text-slate-500">
//       {search ? `No results for "${search}"` : "No records found"}
//     </p>
//     {search && (
//       <p className="text-xs text-slate-400">Try adjusting your search</p>
//     )}
//   </div>
// );

// // ── Main Component ────────────────────────────────────────────────────────────
// const InterestCalculationTable = ({ interestDetails = [] }) => {
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [sortKey, setSortKey] = React.useState("");
//   const [sortDir, setSortDir] = React.useState("asc");

//   const handleSort = (key) => {
//     if (!key) return;
//     if (sortKey === key) {
//       setSortDir((d) => (d === "asc" ? "desc" : "asc"));
//     } else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//   };

//   const filteredRows = React.useMemo(() => {
//     let result = [...interestDetails];
//     if (searchTerm.trim()) {
//       const low = searchTerm.toLowerCase();
//       result = result.filter(
//         (row) =>
//           String(row.Full_Name || "")
//             .toLowerCase()
//             .includes(low) ||
//           String(row.Account_No || "")
//             .toLowerCase()
//             .includes(low) ||
//           String(row.Ref_Ac_No || "")
//             .toLowerCase()
//             .includes(low),
//       );
//     }
//     if (sortKey) {
//       result.sort((a, b) => {
//         let valA, valB;
//         if (["Curr_Balance", "interest_amount"].includes(sortKey)) {
//           valA = parseFloat(a[sortKey]) || 0;
//           valB = parseFloat(b[sortKey]) || 0;
//         } else if (sortKey === "total") {
//           valA =
//             (parseFloat(a.Curr_Balance) || 0) +
//             (parseFloat(a.interest_amount) || 0);
//           valB =
//             (parseFloat(b.Curr_Balance) || 0) +
//             (parseFloat(b.interest_amount) || 0);
//         } else if (sortKey === "Account_No") {
//           valA = parseInt(String(a[sortKey] || "").replace(/\D/g, "")) || 0;
//           valB = parseInt(String(b[sortKey] || "").replace(/\D/g, "")) || 0;
//         } else {
//           valA = String(a[sortKey] || "").toLowerCase();
//           valB = String(b[sortKey] || "").toLowerCase();
//         }
//         if (valA < valB) return sortDir === "asc" ? -1 : 1;
//         if (valA > valB) return sortDir === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return result;
//   }, [interestDetails, searchTerm, sortKey, sortDir]);

//   // ── Summary Totals ────────────────────────────────────────────────────────
//   const grandBalance = filteredRows.reduce(
//     (sum, r) => sum + (parseFloat(r.Curr_Balance) || 0),
//     0,
//   );
//   const grandInterest = filteredRows.reduce(
//     (sum, r) => sum + (parseFloat(r.interest_amount) || 0),
//     0,
//   );
//   const grandTotal = grandBalance + grandInterest;

//   // ── Desktop Table ─────────────────────────────────────────────────────────
//   const DesktopTable = () => (
//     <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
//       <table className="w-full border-collapse text-sm">
//         <thead>
//           <tr className="bg-slate-50 border-b border-slate-100">
//             {COLUMNS.map(({ label, key, cls }) => {
//               const isRight = cls.includes("text-right");
//               const isCenter = cls.includes("text-center");
//               const isActive = sortKey === key;
//               return (
//                 <th
//                   key={label}
//                   onClick={() => handleSort(key)}
//                   className={[
//                     "group/th py-3 px-4 text-[11px] font-semibold uppercase tracking-wider",
//                     "text-slate-400 whitespace-nowrap select-none",
//                     "first:pl-5 last:pr-5",
//                     key
//                       ? "cursor-pointer hover:text-slate-600 hover:bg-slate-100/60 transition-colors"
//                       : "",
//                     isRight ? "text-right" : "",
//                     isCenter ? "text-center" : "text-left",
//                   ]
//                     .filter(Boolean)
//                     .join(" ")}
//                 >
//                   <span className="inline-flex items-center gap-0.5">
//                     {label}
//                     {key && <SortIcon active={isActive} dir={sortDir} />}
//                   </span>
//                 </th>
//               );
//             })}
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-slate-50 bg-white">
//           {filteredRows.length === 0 ? (
//             <tr>
//               <td colSpan={COLUMNS.length}>
//                 <EmptyState search={searchTerm} />
//               </td>
//             </tr>
//           ) : (
//             <>
//               {filteredRows.map((row, i) => {
//                 const bal = parseFloat(row.Curr_Balance) || 0;
//                 const int = parseFloat(row.interest_amount) || 0;
//                 const tot = bal + int;
//                 return (
//                   <tr
//                     key={row.Id || i}
//                     className="hover:bg-blue-50/40 transition-colors duration-100"
//                   >
//                     <td className="py-3.5 px-4 pl-5 text-center">
//                       <span className="font-mono text-[11px] text-slate-300 tabular-nums">
//                         {String(i + 1).padStart(2, "0")}
//                       </span>
//                     </td>
//                     <td className="py-3.5 px-4 font-mono text-[13px] text-slate-700">
//                       {row.Account_No || "—"}
//                     </td>
//                     <td className="py-3.5 px-4 font-mono text-[13px] text-slate-500">
//                       {row.Ref_Ac_No || "—"}
//                     </td>
//                     <td className="py-3.5 px-4">
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${avatarColor(
//                             row.Full_Name || "",
//                           )}`}
//                         >
//                           {getInitials(row.Full_Name || "")}
//                         </div>
//                         <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[180px]">
//                           {row.Full_Name || "—"}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="py-3.5 px-4 text-right">
//                       <span className="font-mono text-[13px] font-medium text-slate-600">
//                         ₹{formatCurrency(bal)}
//                       </span>
//                     </td>
//                     <td className="py-3.5 px-4 text-right">
//                       <span className="font-mono text-[13px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
//                         ₹{formatCurrency(int)}
//                       </span>
//                     </td>
//                     <td className="py-3.5 px-4 pr-5 text-right">
//                       <span className="font-mono text-[13px] font-bold text-slate-800">
//                         ₹{formatCurrency(tot)}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {/* Grand Total Footer Row */}
//               <tr className="bg-slate-50 border-t border-slate-200">
//                 <td colSpan={4} className="py-3 px-4 pl-5">
//                   <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                     Grand Total ({filteredRows.length} records)
//                   </span>
//                 </td>
//                 <td className="py-3 px-4 text-right font-mono text-[13px] font-bold text-slate-700">
//                   ₹{formatCurrency(grandBalance)}
//                 </td>
//                 <td className="py-3 px-4 text-right font-mono text-[13px] font-bold text-emerald-700">
//                   ₹{formatCurrency(grandInterest)}
//                 </td>
//                 <td className="py-3 px-4 pr-5 text-right font-mono text-[13px] font-bold text-blue-700">
//                   ₹{formatCurrency(grandTotal)}
//                 </td>
//               </tr>
//             </>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // ── Mobile Cards ──────────────────────────────────────────────────────────
//   const MobileCards = () => (
//     <div className="flex flex-col gap-3 sm:hidden">
//       {filteredRows.length === 0 ? (
//         <EmptyState search={searchTerm} />
//       ) : (
//         <>
//           {filteredRows.map((row, i) => {
//             const bal = parseFloat(row.Curr_Balance) || 0;
//             const int = parseFloat(row.interest_amount) || 0;
//             const tot = bal + int;
//             return (
//               <div
//                 key={row.Id || i}
//                 className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
//               >
//                 {/* Header */}
//                 <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-50">
//                   <div className="flex items-center gap-3">
//                     <div
//                       className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${avatarColor(
//                         row.Full_Name || "",
//                       )}`}
//                     >
//                       {getInitials(row.Full_Name || "")}
//                     </div>
//                     <div>
//                       <p className="text-[14px] font-semibold text-slate-800 leading-tight">
//                         {row.Full_Name || "—"}
//                       </p>
//                       <p className="text-[11px] text-slate-400 font-mono leading-tight mt-0.5">
//                         Ac No: {row.Account_No || "—"}
//                       </p>
//                     </div>
//                   </div>
//                   <span className="font-mono text-[11px] text-slate-300">
//                     #{String(i + 1).padStart(3, "0")}
//                   </span>
//                 </div>

//                 {/* Total Banner */}
//                 <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 flex items-center justify-between">
//                   <span className="text-[11px] text-blue-100 font-medium uppercase tracking-wide">
//                     Total (Bal + Interest)
//                   </span>
//                   <span className="font-mono text-white font-bold text-[15px]">
//                     ₹{formatCurrency(tot)}
//                   </span>
//                 </div>

//                 {/* Details Grid */}
//                 <div className="grid grid-cols-2 gap-px bg-slate-100">
//                   <div className="bg-white px-3.5 py-2.5">
//                     <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
//                       Ref. Account No.
//                     </p>
//                     <p className="text-[12px] font-semibold text-slate-700 font-mono">
//                       {row.Ref_Ac_No || "—"}
//                     </p>
//                   </div>
//                   <div className="bg-white px-3.5 py-2.5">
//                     <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
//                       Current Balance
//                     </p>
//                     <p className="text-[12px] font-semibold text-slate-700 font-mono">
//                       ₹{formatCurrency(bal)}
//                     </p>
//                   </div>
//                   <div className="bg-white px-3.5 py-2.5 col-span-2">
//                     <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
//                       Interest Amount
//                     </p>
//                     <p className="text-[13px] font-bold text-emerald-600 font-mono">
//                       ₹{formatCurrency(int)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {/* Mobile Grand Total Card */}
//           <div className="bg-blue-50 rounded-2xl border border-blue-100 px-4 py-3 flex flex-col gap-1">
//             <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">
//               Grand Total — {filteredRows.length} records
//             </p>
//             <div className="grid grid-cols-3 gap-2 mt-1">
//               <div>
//                 <p className="text-[9px] text-blue-400 uppercase tracking-wide mb-0.5">
//                   Balance
//                 </p>
//                 <p className="text-[12px] font-bold text-blue-700 font-mono">
//                   ₹{formatCurrency(grandBalance)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[9px] text-blue-400 uppercase tracking-wide mb-0.5">
//                   Interest
//                 </p>
//                 <p className="text-[12px] font-bold text-emerald-600 font-mono">
//                   ₹{formatCurrency(grandInterest)}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[9px] text-blue-400 uppercase tracking-wide mb-0.5">
//                   Total
//                 </p>
//                 <p className="text-[12px] font-bold text-blue-800 font-mono">
//                   ₹{formatCurrency(grandTotal)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="w-full flex flex-col gap-4 mt-2">
//       {/* Header Row */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//         <div>
//           <h4 className="text-lg font-bold text-slate-800">
//             Calculated Interest Records
//           </h4>
//           <p className="text-xs text-slate-400 mt-0.5">
//             {filteredRows.length === interestDetails.length
//               ? `${interestDetails.length} records total`
//               : `${filteredRows.length} of ${interestDetails.length} records`}
//           </p>
//         </div>

//         {/* Search */}
//         <div className="relative w-full sm:w-72 shrink-0">
//           <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
//             <SearchIcon />
//           </span>
//           <input
//             type="text"
//             placeholder="Search name or account no..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-white"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="absolute inset-y-0 right-3 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
//               aria-label="Clear search"
//             >
//               ×
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Table (desktop) */}
//       <DesktopTable />

//       {/* Cards (mobile) */}
//       <MobileCards />
//     </div>
//   );
// };

// export default InterestCalculationTable;

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
    { label: "Account No.", key: "Account_No" },
    { label: "Ref. Account No.", key: "Ref_Ac_No" },
    { label: "Member Name", key: "Full_Name" },
    { label: "Current Balance", key: "Curr_Balance", right: true },
    { label: "Interest Amount", key: "interest_amount", right: true },
    { label: "Total", key: "total", right: true },
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
                  label: "Balance",
                  value: grandBalance,
                  color: "text-slate-700",
                },
                {
                  label: "Interest",
                  value: grandInterest,
                  color: "text-emerald-600",
                },
                { label: "Total", value: grandTotal, color: "text-blue-700" },
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
            Calculated Interest Records
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
            placeholder="Search name or account…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-slate-300 hover:text-slate-500 text-lg leading-none"
              aria-label="Clear"
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
