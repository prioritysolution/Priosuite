"use client";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import convertToWords from "@/utils/numberToWords";
import { format } from "date-fns";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import PreviewModal from "./PreviewModal";
import { useReactToPrint } from "react-to-print";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import PreviewVoucher from "./PreviewVoucher";
import { HiMiniPrinter } from "react-icons/hi2";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const Daybook = ({
  loading,
  getVoucherListLoading,
  getVoucherDetailsLoading,
  form,
  handleSubmit,
  ledgerTableReceiptData,
  ledgerTablePaymentData,
  denomData,
  // generatePDF,
  toDate,
  totalCashReceived,
  totalTranferReceived,
  totalReceived,
  totalCashPayment,
  totalTranferPayment,
  totalPayment,
  cashBalanceData,
  showVoucherList,
  setShowVoucherList,
  handleShowVoucherList,
  showVoucherDetails,
  setShowVoucherDetails,
  handleShowVoucherDetails,
  totalDrAmount,
  totalCrAmount,
  currentPage,
  setCurrentPage,
  lastPage,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const voucherListData = useSelector((state) => state?.daybook?.voucherList);

  const voucherDetailsData = useSelector(
    (state) => state?.daybook?.voucherDetails,
  );

  const printRef = useRef(null);
  const printVoucherRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Daybook-${toDate}`,
  });

  const generateVoucherPrint = useReactToPrint({
    contentRef: printVoucherRef,
    documentTitle: `Voucher`,
  });

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      setPdfLoading(true);
      const isLandscape = true;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF(isLandscape ? "l" : "p", "mm", "a4");
      const imgWidth = isLandscape ? 297 : 210;
      const pageHeight = isLandscape ? 210 : 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 15) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Daybook-${toDate}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  // Dynamic pagination logic (only 5 pages at a time)
  const visiblePages = 5;
  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(visiblePages / 2),
      lastPage - visiblePages + 1,
    ),
  );
  const endPage = Math.min(startPage + visiblePages - 1, lastPage);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-10 justify-between"
            autoComplete="off"
          >
            <div className="w-full flex flex-col border border-primary rounded-lg overflow-hidden">
              <div
                className={cn(
                  "flex items-center justify-between p-5 py-2 bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">Daybook Report</h3>
                <div
                  onClick={() => setShowReportForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showReportForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 px-5",
                  showReportForm
                    ? "max-h-[1000px] py-2"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
                <DatePickerField
                  control={form.control}
                  name="date"
                  label="Date"
                  startYear={2000}
                  endYear={2050}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <DropdownField
                      label="Branch"
                      value={field.value}
                      onChange={field.onChange}
                      options={branchData}
                      optionLabelKey="Branch_Name" // Specify the key for label
                      placeholder="Select branch"
                      searchPlaceholder="Search branch..."
                    />
                  )}
                />

                <div className="w-full flex items-center gap-5 self-end">
                  <Button
                    disabled={loading}
                    className="w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center"
                  >
                    {loading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      <PiFileMagnifyingGlassBold />
                    )}
                  </Button>
                  <div
                    onClick={() => {
                      if (loading || pdfLoading) return;
                      if (
                        ledgerTableReceiptData?.length > 0 ||
                        ledgerTablePaymentData?.length > 0 ||
                        cashBalanceData
                      )
                        generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": loading || pdfLoading || !(
                          ledgerTableReceiptData?.length > 0 ||
                          ledgerTablePaymentData?.length > 0 ||
                          cashBalanceData
                        ),
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                  <div
                    onClick={() => {
                      if (loading || pdfLoading) return;
                      if (
                        ledgerTableReceiptData?.length > 0 ||
                        ledgerTablePaymentData?.length > 0 ||
                        cashBalanceData
                      )
                        handleDownloadPDF();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": loading || pdfLoading || !(
                          ledgerTableReceiptData?.length > 0 ||
                          ledgerTablePaymentData?.length > 0 ||
                          cashBalanceData
                        ),
                      },
                    )}
                  >
                    {pdfLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      <FiDownload />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>

        <ScrollArea className=" rounded-md border w-[300px] sm:w-full overflow-y-hidden">
          <div className="py-4 w-full flex flex-col gap-5  px-3 lg:px-0 overflow-y-hidden">
            <div className="flex w-full gap-2 ">
              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead
                      rowSpan={2}
                      className=" text-white text-center w-16"
                    >
                      V. NO.
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className=" text-white  border-x border-white text-center"
                    >
                      PARTICULARS
                    </TableHead>

                    <TableHead
                      colSpan={3}
                      className=" text-white border-l  border-white text-center"
                    >
                      RECEIPTS
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-[100px]">
                      CASH
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[100px]">
                      TRANSFER
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[100px]">
                      TOTAL
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                        </TableRow>
                      ))
                    : ledgerTableReceiptData &&
                      ledgerTableReceiptData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium border border-secondary text-center">
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell
                            className="border border-secondary cursor-pointer text-blue-500"
                            onClick={() =>
                              handleShowVoucherList(1, data?.Gl_Id)
                            }
                          >
                            {data?.Particular}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Cash}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Transfer}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Total}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="font-medium border border-secondary"
                    >
                      Total
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalCashReceived}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalTranferReceived}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalReceived}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="font-medium border border-secondary"
                    >
                      Opening Balance
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {cashBalanceData && cashBalanceData?.Opening}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary"></TableCell>
                    <TableCell className="font-medium border border-secondary"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="font-medium border border-secondary"
                    >
                      Grand Total
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {parseFloat(totalCashReceived) +
                        (cashBalanceData && cashBalanceData.Opening
                          ? parseFloat(cashBalanceData.Opening)
                          : 0)}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalTranferReceived}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {parseFloat(totalReceived) +
                        (cashBalanceData && cashBalanceData.Opening
                          ? parseFloat(cashBalanceData.Opening)
                          : 0)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead
                      rowSpan={2}
                      className=" text-white text-center w-16"
                    >
                      V. NO.
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className=" text-white  border-x border-white text-center w-[250px]"
                    >
                      PARTICULARS
                    </TableHead>
                    <TableHead
                      colSpan={3}
                      className=" text-white border-l border-white text-center"
                    >
                      PAYMENTS
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-[100px]">
                      CASH
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[100px]">
                      TRANSFER
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[100px]">
                      TOTAL
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                        </TableRow>
                      ))
                    : ledgerTablePaymentData &&
                      ledgerTablePaymentData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium border border-secondary text-center">
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell
                            className="border border-secondary cursor-pointer text-blue-500"
                            onClick={() =>
                              handleShowVoucherList(2, data?.Gl_Id)
                            }
                          >
                            {data?.Particular}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Cash}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Transfer}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Total}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="font-medium border border-secondary"
                    >
                      Total
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalCashPayment}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalTranferPayment}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalPayment}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="font-medium border border-secondary"
                    >
                      Closing Balance
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {cashBalanceData && cashBalanceData?.Closing}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary"></TableCell>
                    <TableCell className="font-medium border border-secondary"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="font-medium border border-secondary"
                    >
                      Grand Total
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {parseFloat(totalCashPayment) +
                        (cashBalanceData && cashBalanceData.Closing
                          ? parseFloat(cashBalanceData.Closing)
                          : 0)}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalTranferPayment}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {parseFloat(totalPayment) +
                        (cashBalanceData && cashBalanceData.Closing
                          ? parseFloat(cashBalanceData.Closing)
                          : 0)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <p className="self-end pr-5">
              <span className="font-semibold">
                Closing Cash Balance in Word :{" "}
              </span>
              {cashBalanceData &&
              cashBalanceData.Closing &&
              parseFloat(cashBalanceData.Closing) > 0
                ? `Rupees ${convertToWords(
                    Number(cashBalanceData.Closing),
                  )} Only`
                : ""}
            </p>
            {denomData?.length > 0 ? (
              <div className="w-[300px] ml-20 text-center">
                <p>Physical Denomination</p>
                <Table className="border border-collapse mt-2">
                  <TableBody>
                    {denomData?.map((data) => (
                      <TableRow key={data?.Denom_Id}>
                        <TableCell>{data?.Denom_Label}</TableCell>
                        <TableCell>{data?.Denom_Balance}</TableCell>
                        <TableCell>{data?.Denom_Value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <></>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Dialog open={showVoucherList} onOpenChange={setShowVoucherList}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="w-full text-center">
              List Of Vouchers For The Day On {toDate}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {getVoucherListLoading ? (
              <div className="w-full h-[500px] flex items-center justify-center">
                <ClipLoader color="#00264d" size={50} speedMultiplier={0.7} />
              </div>
            ) : (
              <ScrollArea className="w-full relative h-[500px] pb-[50px]">
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Sl.</TableHead>
                      <TableHead>Voucher No.</TableHead>
                      <TableHead>Transanction Type</TableHead>
                      <TableHead>Receipts</TableHead>
                      <TableHead>Narration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {voucherListData &&
                      voucherListData.length > 0 &&
                      voucherListData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell
                            className="cursor-pointer text-blue-500"
                            onClick={() => handleShowVoucherDetails(data?.Id)}
                          >
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell>{data?.Trans_Mode}</TableCell>
                          <TableCell>{data?.Amount}</TableCell>
                          <TableCell>{data?.Particular}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {voucherListData && voucherListData?.length > 0 && (
                  <div className="flex items-center justify-end space-x-2 absolute bottom-0 w-full">
                    <Pagination className="space-x-2">
                      <PaginationContent>
                        <PaginationItem>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-32"
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </Button>
                        </PaginationItem>

                        {/* First Page + Ellipsis */}
                        {startPage > 1 && (
                          <>
                            <PaginationItem onClick={() => setCurrentPage(1)}>
                              <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            {startPage > 2 && (
                              <PaginationItem>
                                <PaginationLink href="#">...</PaginationLink>
                              </PaginationItem>
                            )}
                          </>
                        )}

                        {/* Dynamic Page Range */}
                        {pages.map((page) => (
                          <PaginationItem
                            key={page}
                            onClick={() => setCurrentPage(page)}
                          >
                            <PaginationLink
                              href="#"
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {/* Last Page + Ellipsis */}
                        {endPage < lastPage && (
                          <>
                            {endPage < lastPage - 1 && (
                              <PaginationItem>
                                <PaginationLink href="#">...</PaginationLink>
                              </PaginationItem>
                            )}
                            <PaginationItem
                              onClick={() => setCurrentPage(lastPage)}
                            >
                              <PaginationLink href="#">
                                {lastPage}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-32"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === lastPage}
                          >
                            Next
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
          <Dialog open={showVoucherDetails} onOpenChange={setShowVoucherDetails}>
            <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[625px] overflow-hidden">
              {getVoucherDetailsLoading ? (
                <div className="w-full h-[300px] flex items-center justify-center ">
                  <ClipLoader color="#00264d" size={50} speedMultiplier={0.7} />
                </div>
              ) : (
                <div className="py-4 flex flex-col">
                  <Button
                    onClick={generateVoucherPrint}
                    className="w-32 self-end mb-5 mt-2"
                  >
                    Print
                  </Button>
                  <div className="w-full grid grid-cols-3 gap-2 pb-5 text-sm">
                    <p>
                      <span className="font-semibold">Voucher Type :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_type}
                    </p>
                    <p>
                      <span className="font-semibold">Voucher No. :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">Ref. Vc. No :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Ref_Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">Voucher Date :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0].Trans_Date &&
                        format(voucherDetailsData[0].Trans_Date, "dd-MM-yyyy")}
                    </p>
                  </div>

                  <ScrollArea className="w-full overflow-y-scroll h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Sl.</TableHead>
                          <TableHead>Head Of Account</TableHead>
                          <TableHead>Dr. Amount</TableHead>
                          <TableHead>Cr. Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {voucherDetailsData &&
                          voucherDetailsData.length > 0 &&
                          voucherDetailsData.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell>{data?.Ledger_Name}</TableCell>
                              <TableCell>
                                {data?.Trans_Type === "D" && data?.Amount}
                              </TableCell>
                              <TableCell>
                                {data?.Trans_Type === "C" && data?.Amount}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell>{totalDrAmount}</TableCell>
                          <TableCell>{totalCrAmount}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </ScrollArea>
                  <p>
                    <span className="font-semibold">Narration : </span>
                    {voucherDetailsData &&
                      voucherDetailsData.length > 0 &&
                      voucherDetailsData[0]?.Particular}
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <PreviewModal
          printRef={printRef}
          ledgerTableReceiptData={ledgerTableReceiptData}
          ledgerTablePaymentData={ledgerTablePaymentData}
          denomData={denomData}
          // generatePDF={generatePrint}
          toDate={toDate}
          totalCashReceived={totalCashReceived}
          totalTranferReceived={totalTranferReceived}
          totalReceived={totalReceived}
          totalCashPayment={totalCashPayment}
          totalTranferPayment={totalTranferPayment}
          totalPayment={totalPayment}
          cashBalanceData={cashBalanceData}
        />
      </div>

      <div className="hidden">
        <PreviewVoucher
          printRef={printVoucherRef}
          voucherDetailsData={voucherDetailsData}
          totalCrAmount={totalCrAmount}
          totalDrAmount={totalDrAmount}
        />
      </div>
    </div>
  );
};
export default Daybook;
