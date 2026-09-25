"use client";
import { useTranslation } from "react-i18next";
import { useEnglishOnly } from "@/i18n/useEnglishOnly";
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
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import PreviewModal from "./PreviewModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { downloadAccountLedgerPdf } from "../buildReportPdfs";
import { createPortal } from "react-dom";

const AccountLedger = ({
  loading,
  form,
  handleSubmit,
  ledgerTableData,
  fromDate,
  toDate,
  ledgerId,
  totalDebit,
  totalCredit,
  showVoucherDetails,
  setShowVoucherDetails,
  handleShowVoucherDetails,
  totalDrAmount,
  totalCrAmount,
}) => {
  const { t: tForm } = useTranslation();
  const { t } = useEnglishOnly();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const ledgerData = useSelector((state) => state?.accountLedger?.ledgerData);

  const voucherDetailsData = useSelector(
    (state) => state?.daybook?.voucherDetails,
  );

  const printRef = useRef(null);
  const printHostRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `AccountLedger-${fromDate}-${toDate}`,
  });

    const handleDownloadPDF = async () => {
    if (!(ledgerTableData?.length > 0)) {
      toast.error(t("report.accountLedger.noDataToDownload"));
      return;
    }

    const ledgerName =
      ledgerData?.find((data) => data?.Id?.toString() === ledgerId)?.Ledger_Name || "";
    const toastId = toast.loading("Preparing PDF…");

    try {
      setPdfLoading(true);
      await downloadAccountLedgerPdf({
        rows: ledgerTableData,
        fromDate,
        toDate,
        totalDebit,
        totalCredit,
        ledgerName,
        t,
        onProgress: (done, total) => {
          toast.loading(`Writing rows ${done} / ${total}`, { id: toastId });
        },
      });
      toast.success(t("report.accountLedger.pdfDownloaded"), { id: toastId });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? t("report.accountLedger.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.accountLedger.failedToDownloadPdf"),
        { id: toastId },
      );
    } finally {
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
                <h3 className="text-xl font-semibold ">
                  {t("report.accountLedger.accountLedgerReport")}
                </h3>
                <div
                  onClick={() => setShowReportForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showReportForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 px-3 sm:px-5",
                  showReportForm
                    ? "max-h-[1200px] py-3"
                    : "max-h-0 py-0 pointer-events-none opacity-0 overflow-hidden",
                )}
              >
                <DatePickerField
                  control={form.control}
                  name="fromDate"
                  label={tForm("common.fromDate")}
                  startYear={2000}
                  endYear={2050}
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label={tForm("common.toDate")}
                  startYear={2000}
                  endYear={2050}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <DropdownField
                      label={tForm("common.branch")}
                      value={field.value}
                      onChange={field.onChange}
                      options={branchData}
                      optionLabelKey="Branch_Name"
                      placeholder={tForm("common.selectBranch")}
                      searchPlaceholder={tForm("common.searchBranch")}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="ledger"
                  render={({ field }) => (
                    <DropdownField
                      label={tForm("common.ledger")}
                      value={field.value}
                      onChange={field.onChange}
                      options={ledgerData}
                      optionLabelKey="Ledger_Name"
                      placeholder={tForm("common.selectLedger")}
                      searchPlaceholder={tForm("common.searchLedger")}
                    />
                  )}
                />

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end w-full xl:w-auto">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="shrink-0 w-10 h-10 p-0 text-xl text-white bg-primary rounded-md flex items-center justify-center"
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
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (ledgerTableData?.length > 0) generatePrint();
                    }}
                    className={cn(
                      "shrink-0 w-10 h-10 text-xl text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400": !(
                          ledgerTableData?.length > 0
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
                      if (ledgerTableData?.length > 0) handleDownloadPDF();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (loading || pdfLoading) return;
                        if (ledgerTableData?.length > 0) handleDownloadPDF();
                      }
                    }}
                    className={cn(
                      "shrink-0 w-10 h-10 text-xl text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400":
                          pdfLoading ||
                          loading ||
                          !(ledgerTableData?.length > 0),
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
            <div className=" w-full">
              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-16">
                      {t("common.sl")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      {t("report.accountLedger.transDate")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.voucherNo")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.narration")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.debit")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.credit")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.balance")}
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
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="w-full h-5 bg-secondary" />
                          </TableCell>
                        </TableRow>
                      ))
                    : ledgerTableData &&
                      ledgerTableData.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium border border-secondary text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data.Trans_Date &&
                              format(data.Trans_Date, "dd-MM-yyyy")}
                          </TableCell>
                          <TableCell
                            className="border border-secondary cursor-pointer text-blue-500"
                            onClick={() =>
                              data?.Trans_Id &&
                              handleShowVoucherDetails(data?.Trans_Id)
                            }
                          >
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Particular}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Debit}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Credit}
                          </TableCell>
                          <TableCell className="border border-secondary">
                            {data?.Balance} {data?.Balance_Type}
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
                      {t("common.total")}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalDebit}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalCredit}
                    </TableCell>
                    <TableCell className=""></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Dialog open={showVoucherDetails} onOpenChange={setShowVoucherDetails}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[625px]">
          <div className="py-4">
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
            <ScrollArea className="w-full h-[500px]">
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
                    <TableCell colSpan={2}>{t("common.total")}</TableCell>
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
              width: "210mm",
              background: "#ffffff",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            <PreviewModal
              printRef={printRef}
              ledgerTableData={ledgerTableData || []}
              fromDate={fromDate}
              toDate={toDate}
              totalDebit={totalDebit}
              totalCredit={totalCredit}
              ledgerData={ledgerData}
              ledgerId={ledgerId}
            />
          </div>,
          document.body,
        )}
    </div>
  );
};
export default AccountLedger;
