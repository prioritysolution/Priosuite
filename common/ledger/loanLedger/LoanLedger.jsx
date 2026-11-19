import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRef } from "react";
import { IoPrint } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import LoanLedgerPreview from "./LoanLedgerPreview";

const formatDateSafe = (dateVal, formatStr = "dd-MM-yyyy") => {
  if (!dateVal) return "";
  try {
    const parsedDate = new Date(dateVal);
    if (isNaN(parsedDate.getTime())) return "";
    return format(parsedDate, formatStr);
  } catch (error) {
    return "";
  }
};

const money = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return amount.toFixed(2);
};

const InfoItem = ({ label, value, className = "" }) => (
  <div className={`min-w-0 flex gap-1 text-sm ${className}`}>
    <p className="font-semibold shrink-0 text-slate-700">{label}</p>
    <p className="break-words text-slate-900">{value || "—"}</p>
  </div>
);

const LoanLedger = ({
  showLedger,
  setShowLedger,
  fromDate,
  toDate,
  userName,
  currentDate,
  currentTime,
  totalDisburse,
  totalPrincipalRefund,
  totalInterestRefund,
  ledgerHeaderData,
  ledgerTableData,
  loading,
}) => {
  const printRef = useRef(null);

  const handleGeneratePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `LoanLedger-${formatDateSafe(fromDate)}-${formatDateSafe(toDate)}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
        }
      }
    `,
  });

  const rows = Array.isArray(ledgerTableData) ? ledgerTableData : [];

  return (
    <Dialog open={showLedger} onOpenChange={setShowLedger}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-5xl flex flex-col h-[min(92dvh,820px)] overflow-hidden p-3 sm:p-5 gap-3">
        <DialogHeader className="shrink-0 pr-8">
          <DialogTitle className="text-center text-base sm:text-lg leading-snug">
            Loan Ledger From {formatDateSafe(fromDate)} to{" "}
            {formatDateSafe(toDate)}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 w-full flex items-center justify-center min-h-[200px]">
            <ClipLoader color="#00264d" size={50} speedMultiplier={0.7} />
          </div>
        ) : (
          <ScrollArea className="w-full min-h-0 flex-1 rounded-lg border border-primary/20">
            <div className="py-3 px-3 sm:px-4 w-full flex flex-col gap-4">
              <div className="w-full border border-primary/30 bg-secondary rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 p-3 sm:p-4">
                <InfoItem
                  label="Member Name :"
                  value={ledgerHeaderData?.Full_Name}
                />
                <InfoItem
                  label="Guardian Name :"
                  value={ledgerHeaderData?.Relation_Name}
                />
                <InfoItem
                  label="Product Name :"
                  value={ledgerHeaderData?.Product_Name}
                />
                <InfoItem
                  label="Address :"
                  value={ledgerHeaderData?.Address}
                  className="sm:col-span-2 lg:col-span-3"
                />
                <InfoItem
                  label="Account No. :"
                  value={ledgerHeaderData?.Account_No}
                />
                <InfoItem
                  label="Ref. Ac. No. :"
                  value={ledgerHeaderData?.Ref_Ac_No}
                />
                <InfoItem
                  label="Disbursement Amount :"
                  value={money(ledgerHeaderData?.Disb_Amt)}
                />
                <InfoItem
                  label="Disbursement Date :"
                  value={formatDateSafe(ledgerHeaderData?.Disb_Date)}
                />
                <InfoItem
                  label="Repay Within :"
                  value={formatDateSafe(ledgerHeaderData?.Repay_Within)}
                />
                <InfoItem label="ROI :" value={ledgerHeaderData?.Roi} />
                <InfoItem
                  label="Repay Mode :"
                  value={ledgerHeaderData?.Repay_Mode}
                />
              </div>

              <div className="w-full overflow-x-auto rounded-lg border border-primary">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow className="bg-primary text-white hover:bg-primary">
                      <TableHead className="text-white text-center w-12 px-2">
                        Serial No
                      </TableHead>
                      <TableHead className="text-white border-l border-white/30 w-[110px] px-2">
                        Date
                      </TableHead>
                      <TableHead className="text-white border-l border-white/30 text-center px-2">
                        Particulars
                      </TableHead>
                      <TableHead className="text-white border-l border-white/30 text-center px-2">
                        Disburse
                      </TableHead>
                      <TableHead className="text-white border-l border-white/30 text-center px-2">
                        Principal Refund
                      </TableHead>
                      <TableHead className="text-white border-l border-white/30 text-center px-2">
                        Interest Refund
                      </TableHead>
                      <TableHead className="text-white border-l border-white/30 text-center px-2">
                        Balance
                      </TableHead>
                      <TableHead className="text-white border-l border-white/30 text-center px-2">
                        Due Interest
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No ledger transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium border border-secondary text-center px-2">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border border-secondary whitespace-nowrap px-2">
                            {formatDateSafe(data?.Trans_Date)}
                          </TableCell>
                          <TableCell className="border border-secondary px-2">
                            {data?.Particular || ""}
                          </TableCell>
                          <TableCell className="border border-secondary text-right px-2">
                            {money(data?.Disb_Amt)}
                          </TableCell>
                          <TableCell className="border border-secondary text-right px-2">
                            {money(data?.Prn_Ref)}
                          </TableCell>
                          <TableCell className="border border-secondary text-right px-2">
                            {money(data?.Intt_Ref)}
                          </TableCell>
                          <TableCell className="border border-secondary text-right px-2">
                            {money(data?.Balance)}
                          </TableCell>
                          <TableCell className="border border-secondary text-right px-2">
                            {money(data?.Due_Intt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="font-semibold px-2 border border-secondary"
                      >
                        Grand Total
                      </TableCell>
                      <TableCell className="text-right font-semibold px-2 border border-secondary">
                        {money(totalDisburse)}
                      </TableCell>
                      <TableCell className="text-right font-semibold px-2 border border-secondary">
                        {money(totalPrincipalRefund)}
                      </TableCell>
                      <TableCell className="text-right font-semibold px-2 border border-secondary">
                        {money(totalInterestRefund)}
                      </TableCell>
                      <TableCell className="border border-secondary" />
                      <TableCell className="border border-secondary" />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] sm:text-xs text-muted-foreground px-1">
                <p className="shrink-0">Generated By : {userName || "—"}</p>
                <p className="text-center italic">
                  This is computer generated report and does not require
                  signature.
                </p>
                <p className="shrink-0 sm:text-right">
                  Generated On : {currentDate} {currentTime}
                </p>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        <div className="hidden">
          <LoanLedgerPreview
            printRef={printRef}
            fromDate={fromDate}
            toDate={toDate}
            totalDisburse={totalDisburse}
            totalPrincipalRefund={totalPrincipalRefund}
            totalInterestRefund={totalInterestRefund}
            ledgerHeaderData={ledgerHeaderData}
            ledgerTableData={ledgerTableData}
          />
        </div>

        <DialogFooter className="w-full shrink-0 sm:justify-end">
          <Button
            type="button"
            onClick={handleGeneratePDF}
            disabled={loading || rows.length === 0}
            className="w-full sm:w-auto gap-2"
          >
            <IoPrint className="text-lg" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoanLedger;
