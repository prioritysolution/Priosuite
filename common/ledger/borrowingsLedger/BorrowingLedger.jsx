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
import { format } from "date-fns";
import { useRef } from "react";
import { IoPrint } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import BorrowingLedgerPreview from "./BorrowingLedgerPreview";

const BorrowingLedger = ({
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
  // handleGeneratePDF,
  loading,
}) => {
  const printRef = useRef(null);

  const handleGeneratePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: `BorrowingsLedger-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
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
            Borrowings Ledger From{" "}
            <span className="">
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
              <div className="w-full border border-dashed border-primary bg-secondary grid grid-cols-3 items-stretch gap-5 p-5 text-sm">
                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Product Name : </span>
                    <span>{ledgerHeaderData?.Product_Name}</span>
                  </p>

                  <p>
                    <span className="font-bold">Account No. : </span>
                    <span>{ledgerHeaderData?.Account_No}</span>
                  </p>

                  <p>
                    <span className="font-bold">Rate Of Interest : </span>
                    <span>{ledgerHeaderData?.Roi}</span>
                  </p>

                  <p>
                    <span className="font-bold">Due Date : </span>
                    <span>
                      {ledgerHeaderData &&
                        format(ledgerHeaderData.Due_Date, "dd-MM-yyyy")}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Product Type : </span>
                    <span>{ledgerHeaderData?.Prod_Type}</span>
                  </p>

                  <p>
                    <span className="font-bold">Total Disb. Amount : </span>
                    <span>{ledgerHeaderData?.Tot_Disb}</span>
                  </p>

                  <p>
                    <span className="font-bold">Od. Rate : </span>
                    <span>{ledgerHeaderData?.Od_Rate}</span>
                  </p>

                  <p>
                    <span className="font-bold">Repay Mode : </span>
                    <span>{ledgerHeaderData?.Repay_Mode}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Bank Name : </span>
                    <span>{ledgerHeaderData?.Bank_Name}</span>
                  </p>

                  <p>
                    <span className="font-bold">Disbursement Date : </span>
                    <span>
                      {ledgerHeaderData &&
                        format(ledgerHeaderData.Disb_Date, "dd-MM-yyyy")}
                    </span>
                  </p>

                  <p>
                    <span className="font-bold">Duration : </span>
                    <span>{ledgerHeaderData?.Duration}</span>
                  </p>
                </div>
              </div>
              <div className="h-[500px]">
                <ScrollArea className="h-[500px] overflow-y-scroll">
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
                              {data?.Disburse}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Prn_Refund}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Intt_Refund}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Balance}
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
          <BorrowingLedgerPreview
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
export default BorrowingLedger;
