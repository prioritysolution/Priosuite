"use client";
import { useTranslation } from "react-i18next";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import PreviewModal from "./PreviewModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { HiMiniPrinter } from "react-icons/hi2";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const Balancing = ({
  loading,
  form,
  handleSubmit,
  depositList,
  loanList,
  shareList,
  investmentList,
  borrowingsList,
  asOnDate,
}) => {
  const { t } = useTranslation();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const printRef = useRef(null);
  const printHostRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `GLBalancing-${asOnDate}`,
  });

  const hasReportData =
    depositList?.length > 0 ||
    shareList?.length > 0 ||
    loanList?.length > 0 ||
    investmentList?.length > 0 ||
    borrowingsList?.length > 0;

  const waitNextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(resolve));

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const host = printHostRef.current;

    if (!element) {
      toast.error(t("report.balancing.nothingToDownload"));
      return;
    }

    if (!hasReportData) {
      toast.error(t("report.balancing.noDataToDownload"));
      return;
    }

    const prevHostStyle = host?.getAttribute("style") || "";

    try {
      setPdfLoading(true);

      if (host) {
        host.setAttribute(
          "style",
          "position:fixed;left:0;top:0;width:210mm;background:#ffffff;pointer-events:none;z-index:2147483646;opacity:0.01;",
        );
      }
      await waitNextFrame();

      const pageNodes = Array.from(
        element.querySelectorAll("[data-print-page='true']"),
      );
      const pagesToCapture = pageNodes.length > 0 ? pageNodes : [element];

      const captureOptions = {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false,
      };

      const BATCH_SIZE = 3;
      const pageImages = [];

      for (let i = 0; i < pagesToCapture.length; i += BATCH_SIZE) {
        const batch = pagesToCapture.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(async (pageEl) => {
            const canvas = await html2canvas(pageEl, captureOptions);
            if (!canvas?.width || !canvas?.height) return null;
            return canvas.toDataURL("image/jpeg", 0.75);
          }),
        );
        pageImages.push(...batchResults);
      }

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });
      const pageWidth = 210;
      const pageHeight = 297;
      let pagesAdded = 0;

      for (let i = 0; i < pageImages.length; i += 1) {
        const imgData = pageImages[i];
        if (!imgData) continue;

        if (pagesAdded > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
        pagesAdded += 1;
      }

      if (pagesAdded < 1) {
        toast.error(t("report.balancing.failedToCapturePdf"));
        return;
      }

      pdf.save(`Balancing-${asOnDate || "report"}.pdf`);
      toast.success(t("report.balancing.pdfDownloaded"));
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? t("report.balancing.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.balancing.failedToDownloadPdf"),
      );
    } finally {
      if (host) host.setAttribute("style", prevHostStyle);
      setPdfLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg ">
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
                <h3 className="text-xl font-semibold ">{t("report.balancing.glBalancingReport")}</h3>
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
                      if (
                        depositList?.length > 0 ||
                        shareList?.length > 0 ||
                        loanList?.length > 0 ||
                        investmentList?.length > 0 ||
                        borrowingsList?.length > 0
                      )
                        generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          depositList?.length > 0 ||
                          shareList?.length > 0 ||
                          loanList?.length > 0 ||
                          investmentList?.length > 0 ||
                          borrowingsList?.length > 0
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
                          loading || pdfLoading || !hasReportData,
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
            <div>
              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-16">
                      {t("report.balancing.print.slNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[220px]">
                      {t("report.balancing.print.productName")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[380px]">
                      {t("report.balancing.print.glHead")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.balancing.print.glBalance")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.balancing.print.subLedger")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("report.balancing.print.difference")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
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
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                      </TableRow>
                    ))
                  : shareList &&
                    shareList.length > 0 && (
                      <>
                        <TableHeader>
                          <TableRow className="bg-primary text-white hover:bg-primary">
                            <TableHead
                              colSpan={6}
                              className="text-white border-l border-white text-center"
                            >
                              {t("report.balancing.productType")} : SHARE
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shareList.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium border border-secondary text-center">
                                {index + 1}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Sub_Heading}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Ledger_Name}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Gl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Dl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Remarks}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>{" "}
                      </>
                    )}
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
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
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                      </TableRow>
                    ))
                  : depositList &&
                    depositList.length > 0 && (
                      <>
                        <TableHeader>
                          <TableRow className="bg-primary text-white hover:bg-primary">
                            <TableHead
                              colSpan={6}
                              className="text-white border-l border-white text-center"
                            >
                              {t("report.balancing.productType")} : DEPOSIT
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {depositList.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium border border-secondary text-center">
                                {index + 1}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Sub_Heading}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Ledger_Name}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Gl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Dl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Remarks}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </>
                    )}
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
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
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                      </TableRow>
                    ))
                  : loanList &&
                    loanList.length > 0 && (
                      <>
                        <TableHeader>
                          <TableRow className="bg-primary text-white hover:bg-primary">
                            <TableHead
                              colSpan={6}
                              className="text-white border-l border-white text-center"
                            >
                              {t("report.balancing.productType")} : LOAN
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loanList.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium border border-secondary text-center">
                                {index + 1}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Sub_Heading}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Ledger_Name}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Gl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Dl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Remarks}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </>
                    )}

                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
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
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                      </TableRow>
                    ))
                  : investmentList &&
                    investmentList.length > 0 && (
                      <>
                        <TableHeader>
                          <TableRow className="bg-primary text-white hover:bg-primary">
                            <TableHead
                              colSpan={6}
                              className="text-white border-l border-white text-center"
                            >
                              {t("report.balancing.productType")} : INVESTMENT
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {investmentList.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium border border-secondary text-center">
                                {index + 1}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Sub_Heading}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Ledger_Name}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Gl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Dl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Remarks}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </>
                    )}
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
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
                        <TableCell>
                          <Skeleton className="w-full h-5 bg-secondary" />
                        </TableCell>
                      </TableRow>
                    ))
                  : borrowingsList &&
                    borrowingsList.length > 0 && (
                      <>
                        <TableHeader>
                          <TableRow className="bg-primary text-white hover:bg-primary">
                            <TableHead
                              colSpan={6}
                              className="text-white border-l border-white text-center"
                            >
                              {t("report.balancing.productType")} : BORROWINGS
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {borrowingsList.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium border border-secondary text-center">
                                {index + 1}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Sub_Heading}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Ledger_Name}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Gl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Dl_Balance}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {data?.Remarks}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </>
                    )}
              </Table>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <div
            ref={printHostRef}
            aria-hidden
            style={{
              position: "fixed",
              left: "-10000px",
              top: 0,
              width: "210mm",
              background: "#ffffff",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            <PreviewModal
              printRef={printRef}
              shareList={shareList || []}
              depositList={depositList || []}
              loanList={loanList || []}
              investmentList={investmentList || []}
              borrowingsList={borrowingsList || []}
              asOnDate={asOnDate}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};
export default Balancing;
