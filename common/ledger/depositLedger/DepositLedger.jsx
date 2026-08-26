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
      <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[1000px] flex items-center justify-center flex-col h-[min(90dvh,600px)] overflow-y-auto p-3 sm:p-6 custom-ledger-scrollbar">
        <style dangerouslySetInnerHTML={{ __html: `
          .custom-ledger-scrollbar ::-webkit-scrollbar {
            width: 8px !important;
            height: 8px !important;
          }
          .custom-ledger-scrollbar ::-webkit-scrollbar-track {
            background: #f1f5f9 !important;
            border-radius: 9999px !important;
          }
          .custom-ledger-scrollbar ::-webkit-scrollbar-thumb {
            background: #000000 !important;
            border-radius: 9999px !important;
            border: 2px solid #f1f5f9 !important;
          }
          .custom-ledger-scrollbar ::-webkit-scrollbar-thumb:hover {
            background: #1a1a1a !important;
          }
          .custom-ledger-scrollbar * {
            scrollbar-width: thin !important;
            scrollbar-color: #000000 #f1f5f9 !important;
          }
        `}} />
        <DialogHeader className={`mt-5`}>
          <DialogTitle className={`w-fit text-center`}>
            Deposit Ledger From{" "}
            <span className="">
              {fromDate && formatDateSafe(fromDate, "dd-MM-yyyy")}
            </span>{" "}
            to{" "}
            <span className="">
              {toDate && formatDateSafe(toDate, "dd-MM-yyyy")}
            </span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="h-full w-full flex items-center justify-center ">
            <ClipLoader color="#00264d" size={50} speedMultiplier={0.7} />
          </div>
        ) : (
          <ScrollArea className=" rounded-md border w-[300px] sm:w-full overflow-y-hidden">
            <div className="py-4 w-full flex flex-col gap-5  px-3 lg:px-0 overflow-y-hidden">
              <div className="w-full border border-dashed border-primary bg-secondary grid grid-cols-3 gap-5 p-5 text-sm text-start">
                <div className="col-span-3 flex justify-around items-start w-full gap-1">
                  <div className="w-full flex gap-1">
                    <p className="font-semibold text-nowrap">Member Name : </p>
                    <p>{ledgerHeaderData?.Mem_Name || ""}</p>
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
              {/* <div className="w-full border border-dashed border-primary bg-secondary grid grid-cols-3 items-stretch gap-5 p-5 text-sm">
                <div className="col-span-3 flex justify-around w-full text-start">
                  <p className="w-full">
                    <span className="font-bold">Member Name : </span>
                    <span>{ledgerHeaderData?.Mem_Name}</span>
                  </p>

                  <p className="w-full">
                    <span className="font-bold">Gurdian Name : </span>
                    <span>{ledgerHeaderData?.Relation_Name}</span>
                  </p>
                </div>
                <div className="col-span-3 w-full">
                  <p>
                    <span className="font-bold">Address : </span>
                    <span>{ledgerHeaderData?.Address}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Product Name : </span>
                    <span>{ledgerHeaderData?.Product_Name}</span>
                  </p>

                  <p>
                    <span className="font-bold">Ledger Folio : </span>
                    <span>{ledgerHeaderData?.Ledg_Folio}</span>
                  </p>

                  <p>
                    <span className="font-bold">Operation Mode : </span>
                    <span>{ledgerHeaderData?.Oper_Mode}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-bold">ROI : </span>
                    <span>{ledgerHeaderData?.ROI}</span>
                  </p>

                  <p>
                    <span className="font-bold">Maturity Date : </span>
                    <span>
                      {ledgerHeaderData &&
                        ledgerHeaderData.Maturity_Date &&
                        format(ledgerHeaderData.Maturity_Date, "dd-MM-yyyy")}
                    </span>
                  </p>

                  <p>
                    <span className="font-bold">Maturity Amount : </span>
                    <span>{ledgerHeaderData?.Maturity_Amount}</span>
                  </p>
                  <p>
                    <span className="font-bold">Status : </span>
                    <span>{ledgerHeaderData?.Status}</span>
                  </p>

                  <p>
                    <span className="font-bold">Opening Date : </span>
                    <span>
                      {ledgerHeaderData &&
                        format(ledgerHeaderData.Opening_Date, "dd-MM-yyyy")}
                    </span>
                  </p>


                </div>


                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Account No. : </span>
                    <span>{ledgerHeaderData?.Account_No}</span>
                  </p>


                  <p>
                    <span className="font-bold">Ref. Ac. No. : </span>
                    <span>{ledgerHeaderData?.Ref_Ac_No}</span>
                  </p>

                  <p>
                    <span className="font-bold">Installment Amount : </span>
                    <span>{ledgerHeaderData?.Installment_Amount}</span>
                  </p>
                </div>
              </div> */}
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
                            <TableCell className="border border-secondary">
                              {data?.Particular}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Withdrawn}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Deposit}
                            </TableCell>
                            <TableCell className="border border-secondary">
                              {data?.Interest}
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
                          {totalWithdrawn && totalWithdrawn.toFixed(2)}
                        </TableCell>
                        <TableCell className="">
                          {totalDeposit && totalDeposit.toFixed(2)}
                        </TableCell>
                        <TableCell className="">
                          {totalInterest && totalInterest.toFixed(2)}
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
export default DepositLedger;
