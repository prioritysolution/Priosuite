import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoPrint } from "react-icons/io5";
import { format } from "date-fns";

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ClipLoader } from "react-spinners";
import DepositLedgerPreview from "./DepositLedgerPreview";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const DepositLedger = ({
  showLedgerDialog,
  setShowLedgerDialog,
  fromDate,
  toDate,
  userName,
  currentDate,
  currentTime,
  totalWithdrawn,
  totalDeposit,
  totalInterest,
  ledgerHeaderData,
  ledgerTableData,
  loading,
}) => {
  const printRef = useRef(null);

  const handleGeneratePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `DepositLedger-${
      fromDate && formatDateSafe(fromDate, "dd-MM-yyyy")
    }-${toDate && formatDateSafe(toDate, "dd-MM-yyyy")}`,
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

  return (
    <Dialog open={showLedgerDialog} onOpenChange={setShowLedgerDialog}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-5xl flex flex-col h-[min(92dvh,760px)] overflow-hidden p-3 sm:p-5 gap-3">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-center text-base sm:text-lg leading-snug">
            Deposit Ledger From{" "}
            {fromDate && formatDateSafe(fromDate, "dd-MM-yyyy")} to{" "}
            {toDate && formatDateSafe(toDate, "dd-MM-yyyy")}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-full w-full flex items-center justify-center ">
            <ClipLoader color="#00264d" size={50} speedMultiplier={0.7} />
          </div>
        ) : (
          <ScrollArea className="w-full min-h-0 flex-1 rounded-md border">
            <div className="py-3 px-3 flex flex-col gap-4">
              <div className="w-full border border-primary/30 bg-secondary rounded-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 p-3 sm:p-4 text-sm text-start">
                <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="min-w-0 flex gap-1">
                    <p className="font-semibold shrink-0">Member Name : </p>
                    <p className="break-words">{ledgerHeaderData?.Mem_Name || ""}</p>
                  </div>
                  <div className="min-w-0 flex gap-1">
                    <p className="font-semibold shrink-0">Guardian Name : </p>
                    <p className="break-words">{ledgerHeaderData?.Relation_Name || ""}</p>
                  </div>
                </div>
                <div className="w-full flex gap-1 col-span-full">
                  <p className="font-semibold text-nowrap">Address : </p>
                  <p>{ledgerHeaderData?.Address || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Product Name : </p>
                  <p>{ledgerHeaderData?.Product_Name || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Account No. : </p>
                  <p>{ledgerHeaderData?.Account_No || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Ref. Ac. No. : </p>
                  <p>{ledgerHeaderData?.Ref_Ac_No || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Ledger Folio : </p>
                  <p>{ledgerHeaderData?.Ledg_Folio || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Opening Date : </p>
                  <p>
                    {ledgerHeaderData?.Opening_Date
                      ? formatDateSafe(
                          ledgerHeaderData?.Opening_Date,
                          "dd-MM-yyyy",
                        )
                      : ""}
                  </p>
                </div>
                {ledgerHeaderData?.Installment_Amount ? (
                  <div className="w-full flex gap-1">
                    <p className="font-semibold text-nowrap">
                      Installment Amount :{" "}
                    </p>
                    <p>{ledgerHeaderData?.Installment_Amount || ""}</p>
                  </div>
                ) : null}
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">ROI : </p>
                  <p>{ledgerHeaderData?.ROI || ""}</p>
                </div>
                {ledgerHeaderData?.Maturity_Date ? (
                  <div className="w-full flex gap-1">
                    <p className="font-semibold text-nowrap">
                      Maturity Date :{" "}
                    </p>
                    <p>
                      {ledgerHeaderData?.Maturity_Date
                        ? formatDateSafe(
                            ledgerHeaderData?.Maturity_Date,
                            "dd-MM-yyyy",
                          )
                        : ""}
                    </p>
                  </div>
                ) : null}
                {ledgerHeaderData?.Maturity_Amount ? (
                  <div className="w-full flex gap-1">
                    <p className="font-semibold text-nowrap">
                      Maturity Amount :{" "}
                    </p>
                    <p>{ledgerHeaderData?.Maturity_Amount || ""}</p>
                  </div>
                ) : null}
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Operation Mode : </p>
                  <p>{ledgerHeaderData?.Oper_Mode || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Status : </p>
                  <p>{ledgerHeaderData?.Status || ""}</p>
                </div>
              </div>
             
              <div className="w-full overflow-x-auto">
                  <Table className="border border-primary min-w-[720px]">
                    <TableCaption>
                      <div className="w-full flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs px-2">
                        <p>Generated By : {userName}</p>
                        <p>
                          This is computer generated report and does not require
                          signature.
                        </p>
                        <p>
                          Generated On : {currentDate} {currentTime}
                        </p>
                      </div>
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="bg-primary text-white hover:bg-primary">
                        <TableHead className=" text-white text-center w-10">
                          Serial No
                        </TableHead>
                        <TableHead className=" text-white  border-l border-white w-[120px]">
                          Date
                        </TableHead>
                        <TableHead className=" text-white border-l border-white text-left">
                          Particulars
                        </TableHead>
                        <TableHead className=" text-white border-l border-white text-center">
                          Withdrawn
                        </TableHead>
                        <TableHead className=" text-white border-l border-white text-center">
                          Deposit
                        </TableHead>
                        <TableHead className=" text-white border-l border-white text-center">
                          Interest
                        </TableHead>
                        <TableHead className="text-white border-l border-white text-center">
                          Balance
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ledgerTableData &&
                        ledgerTableData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium border border-secondary text-center">
                              {index + 1}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data.Trans_Date &&
                                formatDateSafe(data.Trans_Date, "dd-MM-yyyy")}
                            </TableCell>
                            <TableCell className="border border-secondary text-left">
                              {data?.Particular}
                            </TableCell>
                            <TableCell className="border border-secondary text-right">
                              {data?.Withdrawn}
                            </TableCell>
                            <TableCell className="border border-secondary text-right">
                              {data?.Deposit}
                            </TableCell>
                            <TableCell className="border border-secondary text-right">
                              {data?.Interest}
                            </TableCell>
                            <TableCell className="border border-secondary text-right">
                              {data?.Balance}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3} className="font-semibold">
                          Grand Total
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {totalWithdrawn && totalWithdrawn.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {totalDeposit && totalDeposit.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {totalInterest && totalInterest.toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        <div className="hidden">
          <DepositLedgerPreview
            printRef={printRef}
            fromDate={fromDate}
            toDate={toDate}
            totalWithdrawn={totalWithdrawn}
            totalDeposit={totalDeposit}
            totalInterest={totalInterest}
            ledgerHeaderData={ledgerHeaderData}
            ledgerTableData={ledgerTableData}
          />
        </div>

        <DialogFooter className="shrink-0 w-full">
          <button
            type="button"
            onClick={handleGeneratePDF}
            className="ml-auto h-10 px-4 rounded-md flex items-center justify-center gap-2 bg-primary text-white cursor-pointer text-sm font-semibold"
          >
            <IoPrint className="text-lg" />
            Print
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DepositLedger;
