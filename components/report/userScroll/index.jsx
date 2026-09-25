"use client";
import { useTranslation } from "react-i18next";
import { useEnglishOnly } from "@/i18n/useEnglishOnly";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
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
import { useRef } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import PreviewModal from "./PreviewModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { HiMiniPrinter } from "react-icons/hi2";
import { Fragment } from "react";
import toast from "react-hot-toast";
import { downloadUserScrollPdf } from "../buildReportPdfs";
import { createPortal } from "react-dom";

const UserScroll = ({
  loading,
  form,
  handleSubmit,
  userList,
  reportData,
  asOnDate,
  user,
}) => {
  const { t: tForm } = useTranslation();
  const { t } = useEnglishOnly();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const printRef = useRef(null);
  const printHostRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `UserScroll-${asOnDate}`,
  });

    const handleDownloadPDF = async () => {
    if (!(reportData && reportData.length > 0)) {
      toast.error(t("report.userScroll.noDataToDownload"));
      return;
    }

    const toastId = toast.loading("Preparing PDF…");

    try {
      setPdfLoading(true);
      await downloadUserScrollPdf({
        reportData,
        asOnDate,
        t,
        onProgress: (done, total) => {
          toast.loading(`Writing rows ${done} / ${total}`, { id: toastId });
        },
      });
      toast.success(t("report.userScroll.pdfDownloaded"), { id: toastId });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? t("report.userScroll.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.userScroll.failedToDownloadPdf"),
        { id: toastId },
      );
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-10 justify-between"
            autoComplete="off"
          >
            <div className="w-full flex flex-col border border-primary rounded-lg overflow-hidden">
              <div
                className={cn(
                  "flex items-center justify-between p-5  bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">{t("report.userScroll.userScrollReport")}</h3>
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
                    ? "max-h-[1000px] py-5"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
                <DatePickerField
                  control={form.control}
                  name="date"
                  label={tForm("common.date")}
                  startYear={2000}
                  endYear={2050}
                />

                <DropdownField
                  control={form.control}
                  name="branch"
                  label={tForm("common.branch")}
                  options={branchData}
                  optionLabelKey="Branch_Name"
                  placeholder={tForm("common.selectBranch")}
                  searchPlaceholder={tForm("common.searchBranch")}
                />
                <DropdownField
                  control={form.control}
                  name="user"
                  label={tForm("common.user")}
                  options={userList}
                  optionLabelKey="User_Name"
                  placeholder={tForm("common.selectUser")}
                  searchPlaceholder={tForm("common.searchUser")}
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
                      if (reportData?.length > 0) generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          reportData?.length > 0
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
                          !(reportData?.length > 0),
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
                      {t("report.userScroll.print.slNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      {t("report.userScroll.print.refVoucher")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.userScroll.print.voucherNo")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[380px]">
                      {t("report.userScroll.print.particulars")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.userScroll.print.receipt")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("report.userScroll.print.payment")}
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
                  : reportData &&
                    reportData.length > 0 &&
                    reportData.map((data, i) => (
                      <Fragment key={i}>
                        <TableHeader>
                          <TableRow className="bg-primary text-white hover:bg-primary">
                            <TableHead
                              colSpan={6}
                              className="text-white border-l border-white text-center"
                            >
                              {data?.Ledger_Name}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.entries?.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium border border-secondary text-center">
                                {index + 1}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {entry?.Vouch_No || ""}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {entry?.Vouch_No || ""}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {entry?.Particulars || ""}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {entry?.Rec_Cash || ""}
                              </TableCell>
                              <TableCell className="border border-secondary">
                                {entry?.Pay_Cash || ""}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={4}>{t("common.total")}</TableCell>
                            <TableCell>
                              {data?.entries
                                ?.reduce(
                                  (acc, entry) =>
                                    acc + (Number(entry?.Rec_Cash) || 0),
                                  0,
                                )
                                ?.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {data?.entries
                                ?.reduce(
                                  (acc, entry) =>
                                    acc + (Number(entry?.Pay_Cash) || 0),
                                  0,
                                )
                                ?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Fragment>
                    ))}
                <TableFooter>
                  <TableRow className="">
                    <TableCell colSpan={4} className="text-right">
                      {t("common.grandTotal")}
                    </TableCell>
                    <TableCell>
                      {reportData
                        .flatMap((data) => data.entries)
                        .reduce(
                          (acc, entry) => acc + (Number(entry?.Rec_Cash) || 0),
                          0,
                        )
                        ?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {reportData
                        .flatMap((data) => data.entries)
                        .reduce(
                          (acc, entry) => acc + (Number(entry?.Pay_Cash) || 0),
                          0,
                        )
                        ?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
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
              reportData={reportData || []}
              asOnDate={asOnDate}
              user={user}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};
export default UserScroll;
