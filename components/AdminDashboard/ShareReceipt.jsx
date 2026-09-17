// import { Button } from "@/components/ui/button";
// import getCookieData from "@/utils/getCookieData";
// import { Divider } from "@heroui/divider";
// import {
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
// } from "@heroui/modal";
// import Image from "next/image";
// import { useEffect, useRef, useState } from "react";
// import { useReactToPrint } from "react-to-print";

// import CustomerCategoryChart from "@/common/chart/CustomerCategoryChart";
// import DepositStatusChart from "@/common/chart/DepositStatusChart";
// import LoanStatusChart from "@/common/chart/LoanStatusChart";
// import CollectionStatusChart from "@/common/chart/CollectionStatusChart";
// import DepositChart from "@/common/chart/DepositChart";
// import LoanChart from "@/common/chart/LoanChart";

// /* ── helpers ─────────────────────────────────────────────────── */
// const SectionHeading = ({ children }) => (
//   <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200">
//     {children}
//   </h3>
// );

// const Card = ({ children, className = "" }) => (
//   <div
//     className={`rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${className}`}
//   >
//     {children}
//   </div>
// );

// const amtColor = (label) => {
//   if (label === "Received") return "text-emerald-600";
//   if (label === "Receivable") return "text-rose-500";
//   return "text-indigo-600";
// };

// /* ── component ───────────────────────────────────────────────── */
// const ShareReceipt = ({
//   isOpen,
//   setIsOpen,
//   depositData,
//   showDepositChart = false, // ← mirrored from AdminDashboard state
//   showLoanChart = false, // ← mirrored from AdminDashboard state
// }) => {
//   const [orgName, setOrgName] = useState(null);
//   const [orgBranch, setOrgBranch] = useState(null);
//   const [orgAddress, setOrgAddress] = useState(null);
//   const [orgReg, setOrgReg] = useState(null);
//   const [orgLogo, setOrgLogo] = useState("");
//   const [currentDate, setCurrentDate] = useState("");
//   const [currentTime, setCurrentTime] = useState("");

//   const printRef = useRef(null);

//   const generatePDF = useReactToPrint({
//     contentRef: printRef,
//     documentTitle: "Deposit Details Receipt",
//     pageStyle: `
//       @page { size: A4 portrait; margin: 12mm; }
//       body  { font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5; }
//       .no-print { display: none !important; }
//       .recharts-wrapper, .recharts-surface { overflow: visible !important; }
//     `,
//   });

//   useEffect(() => {
//     const now = new Date();
//     const pad = (n) => String(n).padStart(2, "0");
//     const h24 = now.getHours();
//     const ampm = h24 >= 12 ? "PM" : "AM";
//     const h12 = pad(h24 % 12 || 12);
//     setCurrentDate(
//       `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`,
//     );
//     setCurrentTime(
//       `${h12}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}`,
//     );
//   }, []);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setOrgName(getCookieData("userOrgName"));
//       setOrgBranch(getCookieData("userBranchName"));
//       setOrgAddress(getCookieData("userOrgAddress"));
//       setOrgReg(getCookieData("userOrgRegistration"));
//       setOrgLogo(getCookieData("userOrgLogo") || "");
//     }
//   }, []);

//   return (
//     <Modal
//       scrollBehavior="outside"
//       isOpen={isOpen}
//       onOpenChange={setIsOpen}
//       backdrop="blur"
//       size="5xl"
//       hideCloseButton
//       isDismissable={false}
//     >
//       <ModalContent className="max-h-[92vh]">
//         {/* modal title */}
//         <ModalHeader className="justify-center gap-2 text-xl font-semibold text-slate-700 py-4">
//           <svg
//             className="w-5 h-5 text-indigo-500 flex-shrink-0"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M9 17v-2m3 2v-4m3 4v-6M4 21h16M3 7l9-4 9 4M4 7v10"
//             />
//           </svg>
//           Deposit Details Receipt
//         </ModalHeader>

//         <Divider />

//         {/* scrollable content */}
//         <ModalBody className="overflow-y-auto px-5 py-6 sm:px-8">
//           <div ref={printRef} className="w-full space-y-5 bg-white">
//             {/* ══ REPORT HEADER ══════════════════════════════════════ */}
//             <div
//               className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-slate-50
//                             border border-indigo-100 px-6 py-5 text-center"
//             >
//               {orgLogo && (
//                 <div className="flex justify-center mb-3">
//                   <Image
//                     src={orgLogo}
//                     alt="Logo"
//                     height={56}
//                     width={56}
//                     className="rounded-full ring-2 ring-indigo-200 shadow"
//                   />
//                 </div>
//               )}
//               <h2 className="text-base font-extrabold uppercase tracking-widest text-slate-800">
//                 {orgName || "Organization Name"}
//               </h2>
//               <p className="text-xs text-slate-500 mt-0.5">
//                 {[orgBranch, orgAddress].filter(Boolean).join(" · ")}
//               </p>
//               {orgReg && (
//                 <p className="text-[11px] text-slate-400 mt-0.5">{orgReg}</p>
//               )}

//               <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
//                 <span className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
//                   Deposit Details Report
//                 </span>
//                 <span
//                   className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1
//                                  text-[11px] text-slate-500"
//                 >
//                   {currentDate} · {currentTime}
//                 </span>

//                 {/* live badges — mirror dashboard expand state */}
//                 {showDepositChart && (
//                   <span
//                     className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1
//                                    text-[11px] font-semibold text-indigo-600"
//                   >
//                     ✦ Deposit Details included
//                   </span>
//                 )}
//                 {showLoanChart && (
//                   <span
//                     className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1
//                                    text-[11px] font-semibold text-emerald-600"
//                   >
//                     ✦ Loan Details included
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* ══ CUSTOMER CATEGORY ══════════════════════════════════ */}
//             <Card className="p-5">
//               <SectionHeading>Customer by Social Category</SectionHeading>
//               <CustomerCategoryChart />
//             </Card>

//             {/* ══ 3-COL STATUS GRID ══════════════════════════════════ */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               <Card className="p-4">
//                 <SectionHeading>Deposit Status</SectionHeading>
//                 <DepositStatusChart />
//               </Card>
//               <Card className="p-4">
//                 <SectionHeading>Loan Status</SectionHeading>
//                 <LoanStatusChart />
//               </Card>
//               <Card className="p-4">
//                 <SectionHeading>Collection Status</SectionHeading>
//                 <CollectionStatusChart />
//               </Card>
//             </div>

//             {/* ══ DEPOSIT DETAILS — only when expanded on dashboard ══ */}
//             {showDepositChart && (
//               <Card className="p-5 border-indigo-200 bg-indigo-50/30">
//                 <SectionHeading>Deposit Details</SectionHeading>
//                 <DepositChart />
//               </Card>
//             )}

//             {/* ══ LOAN DETAILS — only when expanded on dashboard ════ */}
//             {showLoanChart && (
//               <Card className="p-5 border-emerald-200 bg-emerald-50/30">
//                 <SectionHeading>Loan Details</SectionHeading>
//                 <LoanChart />
//               </Card>
//             )}

//             {/* ══ DEPOSIT SUMMARY TABLE ══════════════════════════════ */}
//             {/* {depositData?.depositDetails?.length > 0 && (
//               <Card className="p-5">
//                 <SectionHeading>Deposit Summary</SectionHeading>
//                 <div className="divide-y divide-slate-100">
//                   {depositData.depositDetails.map((detail, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center gap-3 py-2.5 px-1 hover:bg-slate-50
//                                  transition-colors rounded-lg"
//                     >
//                       <span
//                         className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50
//                                        flex items-center justify-center"
//                       >
//                         <svg
//                           className="w-3 h-3 text-indigo-500"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                           strokeWidth={3}
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </span>
//                       <span className="flex-1 text-sm font-medium text-slate-700">
//                         {detail.label}
//                       </span>
//                       <span
//                         className={`text-sm font-bold tabular-nums ${amtColor(detail.label)}`}
//                       >
//                         {detail.value}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}

//             <div className="text-center pb-2 space-y-0.5">
//               <p className="text-[11px] text-slate-400">
//                 Computer-generated report · No signature required
//               </p>
//               <p className="text-[11px] text-slate-400">
//                 E. &amp; O.E. (Errors and Omissions Excepted)
//               </p>
//             </div> */}
//           </div>
//         </ModalBody>

//         <Divider />

//         {/* action buttons */}
//         <ModalFooter className="gap-3 py-4">
//           <Button
//             variant="flat"
//             onClick={() => setIsOpen(false)}
//             size="lg"
//             radius="sm"
//             className="w-32 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
//           >
//             Cancel
//           </Button>
//           <Button
//             size="lg"
//             radius="sm"
//             className="w-40 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
//             onClick={() => generatePDF()}
//           >
//             <svg
//               className="w-4 h-4 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <polyline points="6 9 6 2 18 2 18 9" />
//               <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
//               <rect x="6" y="14" width="12" height="8" rx="1" />
//             </svg>
//             Print / PDF
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ShareReceipt;

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import getCookieData from "@/utils/getCookieData";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import CustomerCategoryChart from "@/common/chart/CustomerCategoryChart";
import DepositStatusChart from "@/common/chart/DepositStatusChart";
import LoanStatusChart from "@/common/chart/LoanStatusChart";
import CollectionStatusChart from "@/common/chart/CollectionStatusChart";
import DepositChart from "@/common/chart/DepositChart";
import LoanChart from "@/common/chart/LoanChart";

/* ── tiny UI helpers ──────────────────────────────────────────────────── */

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-4 w-1 rounded-full bg-indigo-500" />
    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
      {children}
    </h3>
  </div>
);

const Panel = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}
  >
    {children}
  </div>
);

const amtColor = (label) => {
  if (label === "Received") return "text-emerald-600";
  if (label === "Receivable") return "text-rose-500";
  return "text-indigo-600";
};

/* ── component ────────────────────────────────────────────────────────── */

const ShareReceipt = ({
  isOpen,
  setIsOpen,
  depositData,
  showDepositChart = false,
  showLoanChart = false,
  selectedBranch,
}) => {
  const [orgName, setOrgName] = useState("");
  const [orgBranch, setOrgBranch] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgReg, setOrgReg] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [stamp, setStamp] = useState("");

  const contentRef = useRef(null);

  /* one-time timestamp when modal mounts */
  useEffect(() => {
    if (!isOpen) return;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const h24 = now.getHours();
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = pad(h24 % 12 || 12);
    setStamp(
      `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}  ${h12}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}`,
    );
  }, [isOpen]);

  /* org info */
  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrgName(getCookieData("userOrgName") || "");
    setOrgBranch(getCookieData("userBranchName") || "");
    setOrgAddress(getCookieData("userOrgAddress") || "");
    setOrgReg(getCookieData("userOrgRegistration") || "");
    setOrgLogo(getCookieData("userOrgLogo") || "");
  }, []);

  /* react-to-print — most reliable approach */
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: "Deposit-Details-Receipt",
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 15mm;
      }
      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { 
          margin: 0; 
          font-family: Arial, sans-serif;
          -webkit-transform: none !important;
          transform: none !important;
        }
        .recharts-wrapper { 
          overflow: visible !important;
          -webkit-transform: none !important;
          transform: none !important;
        }
        .recharts-surface { 
          overflow: visible !important;
          -webkit-transform: none !important;
          transform: none !important;
        }
        svg {
          -webkit-transform: none !important;
          transform: none !important;
        }
      }
    `,
  });

  /* ── JSX ──────────────────────────────────────────────────────────── */
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl max-h-[95dvh] p-0 overflow-y-auto">
        {/* ── sticky header ── */}
        {/* <ModalHeader className="flex items-center justify-center gap-2 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
          <svg
            className="w-5 h-5 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2m3 2v-4m3 4v-6M4 21h16M3 7l9-4 9 4M4 7v10"
            />
          </svg>
          <span className="text-lg font-semibold text-slate-700">
            Deposit Details Receipt
          </span>
        </ModalHeader> */}

        {/* ── scrollable body ── */}
        <div className="px-6 py-4">
          {/* ════ PRINT AREA ══════════════════════════════════════════════ */}
          <div
            ref={contentRef}
            className="bg-white px-4 py-4 space-y-4"
            style={{ maxWidth: "210mm", margin: "0 auto" }}
          >
            {/* ── letterhead ── */}
            <div className="text-center border-b-2 border-slate-200 pb-4">
              {/* {orgLogo && (
                <div className="flex justify-center mb-2">
                  <Image
                    src={orgLogo}
                    alt="Logo"
                    height={52}
                    width={52}
                    className="rounded-full ring-2 ring-indigo-200 shadow-sm"
                  />
                </div>
              )} */}
              <h1 className="text-sm font-extrabold uppercase tracking-widest text-slate-800">
                {orgName || "Organization Name"}
              </h1>
              {(orgBranch || orgAddress) && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {[orgBranch, orgAddress].filter(Boolean).join("  ·  ")}
                </p>
              )}
              {orgReg && <p className="text-[10px] text-slate-400">{orgReg}</p>}

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {selectedBranch && (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-[11px] text-slate-500">
                    Branch Name:- {selectedBranch}
                  </span>
                )}
                {/* <span className="rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-semibold text-white">
                  Deposit Details Report
                </span> */}
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-0.5 text-[11px] text-slate-500">
                  {stamp}
                </span>
                {/* {showDepositChart && (
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-[11px] font-medium text-indigo-600">
                    + Deposit Details
                  </span>
                )}
                {showLoanChart && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-[11px] font-medium text-emerald-600">
                    + Loan Details
                  </span>
                )} */}
              </div>
            </div>

            {/* ── customer category ── */}
            <Panel className="page-break-inside-avoid">
              <SectionTitle>Customer by Social Category</SectionTitle>
              <CustomerCategoryChart />
            </Panel>

            {/* ── 3-col status row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 page-break-inside-avoid">
              <Panel>
                <SectionTitle>Deposit Status</SectionTitle>
                <DepositStatusChart />
              </Panel>
              <Panel>
                <SectionTitle>Loan Status</SectionTitle>
                <LoanStatusChart />
              </Panel>
              <Panel>
                <SectionTitle>Collection Status</SectionTitle>
                <CollectionStatusChart />
              </Panel>
            </div>

            {/* ── deposit detail (only if open on dashboard) ── */}
            {showDepositChart && (
              <Panel className="border-indigo-200 bg-indigo-50/20 page-break-inside-avoid">
                <SectionTitle>Deposit Details</SectionTitle>
                <DepositChart />
              </Panel>
            )}

            {/* ── loan detail (only if open on dashboard) ── */}
            {showLoanChart && (
              <Panel className="border-emerald-200 bg-emerald-50/20 page-break-inside-avoid">
                <SectionTitle>Loan Details</SectionTitle>
                <LoanChart />
              </Panel>
            )}

            {/* ── summary table ── */}
            {/* {depositData?.depositDetails?.length > 0 && (
              <Panel className="page-break-inside-avoid">
                <SectionTitle>Deposit Summary</SectionTitle>
                <div className="divide-y divide-slate-100">
                  {depositData.depositDetails.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <span
                        className="w-5 h-5 flex-shrink-0 rounded-full bg-indigo-50
                                       flex items-center justify-center"
                      >
                        <svg
                          className="w-3 h-3 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="flex-1 text-sm font-medium text-slate-700">
                        {d.label}
                      </span>
                      <span
                        className={`text-sm font-bold tabular-nums ${amtColor(d.label)}`}
                      >
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

          
            <div className="text-center pt-3 border-t border-slate-200 space-y-0.5">
              <p className="text-[10px] text-slate-400">
                Computer-generated report · No signature required
              </p>
              <p className="text-[10px] text-slate-400">
                E. &amp; O.E. (Errors and Omissions Excepted)
              </p>
            </div> */}
          </div>
          {/* end print area */}
        </div>

        {/* ── sticky footer buttons ── */}
        <Divider />
        <DialogFooter className="gap-3 py-3 bg-white sticky bottom-0">
          <Button
            variant="flat"
            size="lg"
            radius="sm"
            className="w-32 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            radius="sm"
            className="w-44 bg-indigo-600 text-white hover:bg-indigo-700 shadow"
            onClick={handlePrint}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" rx="1" />
            </svg>
            Print / PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReceipt;
