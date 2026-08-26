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
import { format, parse } from "date-fns";
import { useRef } from "react";
import { IoPrint } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import LoanLedgerPreview from "./LoanLedgerPreview";

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
    documentTitle: `LoanLedger-${fromDate && format(fromDate, "dd-MM-yyyy")}-${
      toDate && format(toDate, "dd-MM-yyyy")
    }`,
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
    <Dialog open={showLedger} onOpenChange={setShowLedger}>
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px] flex items-center justify-center flex-col h-[min(90dvh,600px)] overflow-y-auto p-3 sm:p-6">
        <DialogHeader className={`mt-5`}>
          <DialogTitle className={`w-fit text-center`}>
            Loan Ledger From
            <span className="">
              {" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")}
            </span>{" "}
            to{" "}
            <span className="">{toDate && format(toDate, "dd-MM-yyyy")}</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-full w-full flex items-center justify-center ">
            <ClipLoader color="#00264d" size={50} speedMultiplier={0.7} />
          </div>
        ) : (
          <ScrollArea className=" rounded-md border w-[300px] sm:w-full overflow-y-hidden">
            <div className="py-4 w-full flex flex-col gap-5  px-3 lg:px-0 overflow-y-hidden">
              <div className="w-full border border-dashed border-primary bg-secondary grid grid-cols-3 gap-2 p-5 text-sm text-start">
                <div className="col-span-3 flex justify-around items-start w-full gap-1">
                  <div className="w-full flex gap-1">
                    <p className="font-semibold text-nowrap">Member Name : </p>
                    <p>{ledgerHeaderData?.Full_Name || ""}</p>
                  </div>
                  <div className="w-full flex gap-1 items-start justify-start">
                    <p className="font-semibold text-nowrap">
                      Guardian Name :{" "}
                    </p>
                    <p>{ledgerHeaderData?.Relation_Name || ""}</p>
                  </div>
                </div>
                <div className="w-full flex gap-1 col-span-3">
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
                  <p className="font-semibold text-nowrap">
                    Disbursement Amount :{" "}
                  </p>
                  <p>{ledgerHeaderData?.Disb_Amt || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">
                    Disbursement Date :{" "}
                  </p>
                  <p>
                    {ledgerHeaderData?.Disb_Date
                      ? format(ledgerHeaderData?.Disb_Date, "dd-MM-yyyy")
                      : ""}
                  </p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Repay Within : </p>
                  <p>
                    {ledgerHeaderData?.Repay_Within
                      ? format(ledgerHeaderData?.Repay_Within, "dd-MM-yyyy")
                      : ""}
                  </p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">ROI : </p>
                  <p>{ledgerHeaderData?.Roi || ""}</p>
                </div>
                <div className="w-full flex gap-1">
                  <p className="font-semibold text-nowrap">Repay Mode : </p>
                  <p>{ledgerHeaderData?.Repay_Mode || ""}</p>
                </div>
              </div>

              <div className="h-[400px]">
                <ScrollArea className="h-[400px] overflow-y-scroll">
                  <Table className="border border-primary">
                    <TableCaption>
                      <div className="w-full flex items-center justify-between text-xs px-2">
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
                        <TableHead className=" text-white border-l border-white w-fit text-center">
                          Particulars
                        </TableHead>
                        <TableHead className=" text-white border-l border-white text-center">
                          Disburse
                        </TableHead>
                        <TableHead className=" text-white border-l border-white text-center">
                          Principal Refund
                        </TableHead>
                        <TableHead className=" text-white border-l border-white text-center">
                          Interest Refund
                        </TableHead>
                        <TableHead className="text-white border-l border-white text-center">
                          Balance
                        </TableHead>
                        <TableHead className="text-white border-l border-white text-center">
                          Due Interest
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
                                format(data.Trans_Date, "dd-MM-yyyy")}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Particular}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Disb_Amt}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Prn_Ref}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Intt_Ref}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Balance}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Due_Intt}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3}>Grand Total</TableCell>
                        <TableCell className="">
                          {totalDisburse && totalDisburse.toFixed(2)}
                        </TableCell>
                        <TableCell className="">
                          {totalPrincipalRefund &&
                            totalPrincipalRefund.toFixed(2)}
                        </TableCell>
                        <TableCell className="">
                          {totalInterestRefund &&
                            totalInterestRefund.toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </ScrollArea>
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

        <DialogFooter className={`w-full`}>
          <div className="w-full flex items-center justify-end gap-5">
            <div
              onClick={handleGeneratePDF}
              className="p-2 rounded-full flex items-center justify-center text-center bg-primary text-white cursor-pointer text-3xl"
            >
              <IoPrint />
            </div>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="p-2 rounded-full flex items-center justify-center text-center bg-primary text-white cursor-pointer text-3xl">
                  <IoShareSocial />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel className="text-lg">
                  Share via
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer pl-5 py-2">
                  <p className="flex items-center gap-2 px-3">
                    <IoMail className="text-xl text-primary" /> Mail
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer pl-5 py-2">
                  <p className="flex items-center gap-2 px-3">
                    <FaWhatsapp className="text-xl text-primary" /> Whatsapp
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer pl-5 py-2"
                  onClick={handleGeneratePDF}
                >
                  <p className="flex items-center gap-2 px-3">
                    <FaDownload className="text-xl text-primary" /> Download
                  </p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default LoanLedger;
