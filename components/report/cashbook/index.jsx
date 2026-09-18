"use client";
import { useTranslation } from "react-i18next";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import PreviewModal from "./PreviewModal";
import PreviewVoucher from "../daybook/PreviewVoucher";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { HiMiniPrinter } from "react-icons/hi2";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const Cashbook = ({
  loading,
  getVoucherDetailsLoading,
  form,
  handleSubmit,
  ledgerTableReceiptData,
  ledgerTablePaymentData,
  totalReceived,
  totalPayment,
  // generatePDF,
  toDate,
  cashBalanceData,
  showVoucherDetails,
  setShowVoucherDetails,
  handleShowVoucherDetails,
  totalDrAmount,
  totalCrAmount,
  denomData,
}) => {
  const { t } = useTranslation();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const printRef = useRef(null);
  const printHostRef = useRef(null);
  const printVoucherRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Cashbook-${toDate}`,
  });

  const generateVoucherPrint = useReactToPrint({
    contentRef: printVoucherRef,
    documentTitle: `Voucher`,
  });

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const voucherDetailsData = useSelector(
    (state) => state?.daybook?.voucherDetails,
  );

  const waitNextFrame = () =>
    new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const host = printHostRef.current;

    if (!element) {
      toast.error(t("report.cashbook.nothingToDownload"));
      return;
    }

    const hasData =
      (ledgerTableReceiptData && ledgerTableReceiptData.length > 0) ||
      (ledgerTablePaymentData && ledgerTablePaymentData.length > 0) ||
      !!cashBalanceData;

    if (!hasData) {
      toast.error(t("report.cashbook.noDataToDownload"));
      return;
    }

    const prevHostStyle = host?.getAttribute("style") || "";

    try {
      setPdfLoading(true);

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

        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const renderHeight = Math.min(imgHeight, pageHeight);

        if (pagesAdded > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, renderHeight);
        pagesAdded += 1;
      }

      if (pagesAdded < 1) {
        toast.error(t("report.cashbook.failedToCapturePdf"));
        return;
      }

      pdf.save(`Cashbook-${toDate || "report"}.pdf`);
      toast.success(t("report.cashbook.pdfDownloaded"));
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? `${t("report.cashbook.failedToDownloadPdf")}: ${error.message}`
          : t("report.cashbook.failedToDownloadPdf"),
      );
    } finally {
      if (host) host.setAttribute("style", prevHostStyle);
      setPdfLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
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
                <h3 className="text-xl font-semibold ">{t("report.cashbook.cashbookReport")}</h3>
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
                    <TableHead colSpan={5} className=" text-white text-center">
                      {t("report.cashbook.receipt")}
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-12">
                      {t("report.cashbook.slNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      {t("report.cashbook.vouchNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      {t("report.cashbook.ledgerName")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[280px]">
                      {t("report.cashbook.particulars")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashbook.amount")}
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
                      ledgerTableReceiptData.length > 0 &&
                      ledgerTableReceiptData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium border border-secondary text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell
                            className="border border-secondary cursor-pointer text-blue-500"
                            onClick={() =>
                              handleShowVoucherDetails(data?.Trans_Id)
                            }
                          >
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Ledger_Name}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Particular}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Cash}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="font-medium border border-secondary"
                    >
                      {t("report.cashbook.total")}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalReceived}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="font-medium border border-secondary"
                    >
                      {t("report.cashbook.openingBalance")}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {cashBalanceData && cashBalanceData?.Opening}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>

              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead colSpan={5} className=" text-white text-center">
                      {t("report.cashbook.payment")}
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-12">
                      {t("report.cashbook.slNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      {t("report.cashbook.vouchNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      {t("report.cashbook.ledgerName")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[280px]">
                      {t("report.cashbook.particulars")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashbook.amount")}
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
                      ledgerTablePaymentData.length > 0 &&
                      ledgerTablePaymentData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium border border-secondary text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell
                            className="border border-secondary cursor-pointer text-blue-500"
                            onClick={() =>
                              handleShowVoucherDetails(data?.Trans_Id)
                            }
                          >
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Ledger_Name}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Particular}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Cash}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="font-medium border border-secondary"
                    >
                      {t("report.cashbook.total")}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalPayment}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="font-medium border border-secondary"
                    >
                      {t("report.cashbook.closingBalance")}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {cashBalanceData && cashBalanceData?.Closing}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <p className="self-end pr-5">
              <span className="font-semibold">
                {t("report.cashbook.closingCashBalanceInWords")} :{" "}
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
                <p>{t("report.cashbook.physicalDenomination")}</p>
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
      <Dialog open={showVoucherDetails} onOpenChange={setShowVoucherDetails}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[625px] h-[min(90dvh,600px)]">
          {getVoucherDetailsLoading ? (
            <div className="w-full h-full flex items-center justify-center ">
              <ClipLoader color="#00264d" size={50} speedMultiplier={0.7} />
            </div>
          ) : (
            <div className="py-4 h-full flex flex-col">
              <Button
                onClick={generateVoucherPrint}
                className="w-32 self-end mb-5 mt-2"
              >
                {t("common.print")}
              </Button>
              <div className="w-full grid grid-cols-3 gap-2 pb-5 text-sm">
                <p>
                  <span className="font-semibold">
                    {t("voucher.voucherType")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0]?.Vouch_type}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("voucher.voucherNo")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0]?.Vouch_No}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("voucher.refVcNo")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0]?.Ref_Vouch_No}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("common.voucherDate")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0].Trans_Date &&
                    format(voucherDetailsData[0].Trans_Date, "dd-MM-yyyy")}
                </p>
              </div>
              <ScrollArea className="w-full h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        {t("common.sl")}
                      </TableHead>
                      <TableHead>{t("common.headOfAccount")}</TableHead>
                      <TableHead>{t("common.drAmount")}</TableHead>
                      <TableHead>{t("common.crAmount")}</TableHead>
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
                        {t("common.total")}
                      </TableCell>
                      <TableCell>{totalDrAmount}</TableCell>
                      <TableCell>{totalCrAmount}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </ScrollArea>
              <p>
                <span className="font-semibold">
                  {t("common.narration")} :{" "}
                </span>
                {voucherDetailsData &&
                  voucherDetailsData.length > 0 &&
                  voucherDetailsData[0]?.Particular}
              </p>
            </div>
          )}
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
              totalReceived={totalReceived}
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
export default Cashbook;
