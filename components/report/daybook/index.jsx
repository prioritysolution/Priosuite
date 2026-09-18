"use client";
import { useTranslation } from "react-i18next";
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
import html2canvas from "html2canvas-pro";
import { useState } from "react";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";
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
  const { t } = useTranslation();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const voucherListData = useSelector((state) => state?.daybook?.voucherList);

  const voucherDetailsData = useSelector(
    (state) => state?.daybook?.voucherDetails,
  );

  const printRef = useRef(null);
  const printHostRef = useRef(null);
  const printVoucherRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Daybook-${toDate}`,
  });

  const generateVoucherPrint = useReactToPrint({
    contentRef: printVoucherRef,
    documentTitle: `Voucher`,
  });

  const waitNextFrame = () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const host = printHostRef.current;

    if (!element) {
      toast.error(t("report.daybook.nothingToDownload"));
      return;
    }

    const hasData =
      (ledgerTableReceiptData && ledgerTableReceiptData.length > 0) ||
      (ledgerTablePaymentData && ledgerTablePaymentData.length > 0) ||
      !!cashBalanceData;

    if (!hasData) {
      toast.error(t("report.daybook.noDaybookData"));
      return;
    }

    const prevHostStyle = host?.getAttribute("style") || "";

    try {
      setPdfLoading(true);

      // Same PreviewModal used for print — bring on-screen for accurate capture
      if (host) {
        host.setAttribute(
          "style",
          "position:fixed;left:0;top:0;width:297mm;background:#ffffff;pointer-events:none;z-index:2147483646;opacity:0.01;",
        );
      }
      await waitNextFrame();

      const pageNodes = Array.from(
        element.querySelectorAll("[data-print-page='true']"),
      );
      const pagesToCapture = pageNodes.length > 0 ? pageNodes : [element];

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pageWidth = 297;
      const pageHeight = 210;
      let pagesAdded = 0;

      for (let i = 0; i < pagesToCapture.length; i += 1) {
        const pageEl = pagesToCapture[i];

        const canvas = await html2canvas(pageEl, {
          scale: 1.25,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll("*").forEach((node) => {
              if (!(node instanceof HTMLElement)) return;
              node.style.overflow = "visible";
              node.style.boxShadow = "none";
            });
          },
        });

        if (!canvas?.width || !canvas?.height) continue;

        // JPEG keeps PDF smaller and avoids some PNG toDataURL failures
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const renderHeight = Math.min(imgHeight, pageHeight);

        if (pagesAdded > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, renderHeight);
        pagesAdded += 1;
      }

      if (pagesAdded < 1) {
        toast.error(t("report.daybook.failedToCapturePdf"));
        return;
      }

      pdf.save(`Daybook-${toDate || "report"}.pdf`);
      toast.success(t("report.daybook.pdfDownloaded"));
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? `${t("report.daybook.failedToDownloadPdf")}: ${error.message}`
          : t("report.daybook.failedToDownloadPdf"),
      );
    } finally {
      if (host) host.setAttribute("style", prevHostStyle);
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
                <h3 className="text-xl font-semibold ">{t("report.daybook.daybookReport")}</h3>
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
                  label={t("common.date")}
                  startYear={2000}
                  endYear={2050}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <DropdownField
                      label={t("common.branch")}
                      value={field.value}
                      onChange={field.onChange}
                      options={branchData}
                      optionLabelKey="Branch_Name" // Specify the key for label
                      placeholder={t("common.selectBranch")}
                      searchPlaceholder={t("common.searchBranch")}
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
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (loading || pdfLoading) return;
                      handleDownloadPDF();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (loading || pdfLoading) return;
                        handleDownloadPDF();
                      }
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ":
                          loading ||
                          pdfLoading ||
                          !(
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
                      {t("report.daybook.vNo")}
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className=" text-white  border-x border-white text-center"
                    >
                      {t("report.daybook.particulars")}
                    </TableHead>

                    <TableHead
                      colSpan={3}
                      className=" text-white border-l  border-white text-center"
                    >
                      {t("report.daybook.receipts")}
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-[100px]">
                      {t("report.daybook.cash")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[100px]">
                      {t("report.daybook.transfer")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[100px]">
                      {t("report.daybook.totalUpper")}
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
                      {t("report.daybook.total")}
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
                      {t("report.daybook.openingBalance")}
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
                      {t("report.daybook.grandTotal")}
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
                      {t("report.daybook.vNo")}
                    </TableHead>
                    <TableHead
                      rowSpan={2}
                      className=" text-white  border-x border-white text-center w-[250px]"
                    >
                      {t("report.daybook.particulars")}
                    </TableHead>
                    <TableHead
                      colSpan={3}
                      className=" text-white border-l border-white text-center"
                    >
                      {t("report.daybook.payments")}
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-[100px]">
                      {t("report.daybook.cash")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[100px]">
                      {t("report.daybook.transfer")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[100px]">
                      {t("report.daybook.totalUpper")}
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
                      {t("report.daybook.total")}
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
                      {t("report.daybook.closingBalance")}
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
                      {t("report.daybook.grandTotal")}
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
                {t("report.daybook.closingCashBalanceInWord")}{" "}
              </span>
              {cashBalanceData &&
              cashBalanceData.Closing &&
              parseFloat(cashBalanceData.Closing) > 0
                ? `${t("common.rupees")} ${convertToWords(
                    Number(cashBalanceData.Closing),
                  )} ${t("common.only")}`
                : ""}
            </p>
            {denomData?.length > 0 ? (
              <div className="w-[300px] ml-20 text-center">
                <p>{t("report.daybook.physicalDenomination")}</p>
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
              {t("report.daybook.listOfVouchersForTheDayOn")} {toDate}
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
                      <TableHead className="w-[100px]">{t("report.daybook.sl")}</TableHead>
                      <TableHead>{t("report.daybook.voucherNo")}</TableHead>
                      <TableHead>{t("report.daybook.transactionType")}</TableHead>
                      <TableHead>{t("report.daybook.receiptsLabel")}</TableHead>
                      <TableHead>{t("report.daybook.narration")}</TableHead>
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
                            {t("report.daybook.previous")}
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
                            {t("report.daybook.next")}
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
                    {t("report.daybook.printBtn")}
                  </Button>
                  <div className="w-full grid grid-cols-3 gap-2 pb-5 text-sm">
                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.voucherType")} :
                      </span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_type}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.voucherNo")} :
                      </span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.refVcNo")} :
                      </span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Ref_Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.voucherDate")} :
                      </span>{" "}
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
                          <TableHead className="w-[100px]">{t("report.daybook.sl")}</TableHead>
                          <TableHead>{t("report.daybook.headOfAccount")}</TableHead>
                          <TableHead>{t("report.daybook.drAmount")}</TableHead>
                          <TableHead>{t("report.daybook.crAmount")}</TableHead>
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
                          <TableCell colSpan={2}>
                            {t("report.daybook.total")}
                          </TableCell>
                          <TableCell>{totalDrAmount}</TableCell>
                          <TableCell>{totalCrAmount}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </ScrollArea>
                  <p>
                    <span className="font-semibold">
                      {t("report.daybook.narration")} :{" "}
                    </span>
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

      {typeof document !== "undefined" &&
        createPortal(
          <div
            ref={printHostRef}
            aria-hidden
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: "297mm",
              background: "#ffffff",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            <PreviewModal
              printRef={printRef}
              ledgerTableReceiptData={ledgerTableReceiptData || []}
              ledgerTablePaymentData={ledgerTablePaymentData || []}
              denomData={denomData || []}
              toDate={toDate}
              totalCashReceived={totalCashReceived}
              totalTranferReceived={totalTranferReceived}
              totalReceived={totalReceived}
              totalCashPayment={totalCashPayment}
              totalTranferPayment={totalTranferPayment}
              totalPayment={totalPayment}
              cashBalanceData={cashBalanceData}
            />
          </div>,
          document.body,
        )}

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
