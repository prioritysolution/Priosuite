"use client";
import { useTranslation } from "react-i18next";
import { useEnglishOnly } from "@/i18n/useEnglishOnly";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useSelector } from "react-redux";
import MemberRegisterTable from "./MemberRegisterTable";
import TransactionRegisterTable from "./TransactionRegisterTable";
import WithdrawnRegisterTable from "./WithdrawnRegisterTable";
import DetailedListTable from "./DetailedListTable";
import DividendListTable from "./DividendListTable";
import ShareLedger from "@/common/ledger/shareLedger/ShareLedger";
import { ClipLoader } from "react-spinners";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import MemberRegisterPreview from "./MemberRegisterPreview";
import WithdrawnRegisterPreview from "./WithdrawnRegisterPreview";
import DividendListPreview from "./DividendListPreview";
import { cn } from "@/lib/utils";
import DetailedListPreview from "./DetailedListPreview";
import TransactionRegisterPreview from "./TransactionRegisterPreview";
import { useState } from "react";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import ShareIssueReceipt from "../shareIssue/ShareIssueReceipt";
import toast from "react-hot-toast";
import { downloadMembershipReportPdf } from "./buildMembershipReportPdf";

const MembershipReport = ({
  loading,
  form,
  handleSubmit,
  tableData,
  toDate,
  totalAdmFees,
  totalIssue,
  totalRelease,
  totalAmount,
  totalOpening,
  totalClosing,
  totalDividend,
  totalBalance,
  showData,
  handleShowLedger,
  showLedger,
  setShowLedger,
  getLedgerLoading,
  ledgerHeaderData,
  ledgerTableData,
  totalRefund,
  totalLedgerIssue,
  userName,
  currentDate,
  currentTime,
  fromDate,
  handleGenerateShareReceipt,
  isOpenShareReceipt,
  setIsOpenShareReceipt,
  shareIssueReceiptData,
}) => {
  const { t } = useTranslation();
  const { t: tEn } = useEnglishOnly();

  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const memberTypeData = useSelector(
    (state) => state?.shareProduct?.memberTypeData,
  );

  const reportTypeData = useSelector(
    (state) => state?.memberReport?.reportTypeData,
  );

  const printMemberRegisterRef = useRef(null);
  const printTransactionRegisterRef = useRef(null);
  const printWithdrawnRegisterRef = useRef(null);
  const printDetailedListRef = useRef(null);
  const printDividendListRef = useRef(null);

  const generateMemberRegisterPrint = useReactToPrint({
    contentRef: printMemberRegisterRef,
    documentTitle: `ShareMemberRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateTransactionRegisterPrint = useReactToPrint({
    contentRef: printTransactionRegisterRef,
    documentTitle: `ShareTransactionRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateWithdrawnRegisterPrint = useReactToPrint({
    contentRef: printWithdrawnRegisterRef,
    documentTitle: `ShareWithdrawnRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateDetailedListPrint = useReactToPrint({
    contentRef: printDetailedListRef,
    documentTitle: `ShareDetailedList-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateDividendListPrint = useReactToPrint({
    contentRef: printDividendListRef,
    documentTitle: `ShareDividendList-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const formatReportDate = (value) =>
    value ? format(value, "dd-MM-yyyy") : "";

  const handleDownloadPDF = async () => {
    const titles = {
      100: "ShareMemberRegister",
      101: "ShareTransactionRegister",
      102: "ShareWithdrawnRegister",
      103: "ShareDetailedList",
      104: "ShareDividendList",
    };

    if (!titles[showData]) return;
    if (!(tableData?.length > 0)) return;

    const docTitle = `${titles[showData]}-${formatReportDate(fromDate)}-${formatReportDate(toDate)}`;
    const toastId = toast.loading("Preparing PDF…");

    try {
      await downloadMembershipReportPdf({
        showData,
        tableData,
        fromDate,
        toDate,
        docTitle,
        t: tEn,
        totals: {
          totalAdmFees,
          totalIssue,
          totalRelease,
          totalAmount,
          totalOpening,
          totalClosing,
          totalDividend,
          totalBalance,
        },
        onProgress: (done, total) => {
          toast.loading(`Writing rows ${done} / ${total}`, { id: toastId });
        },
      });
      toast.success("PDF downloaded", { id: toastId });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",
        { id: toastId },
      );
    }
  };

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden sm:px-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full flex flex-col gap-10 justify-between"
            autoComplete="off"
          >
            <div className="w-full flex flex-col border border-primary rounded-lg overflow-hidden">
              <div
                className={cn(
                  "flex items-center justify-between p-5 py-2  bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">{tEn("membership.report.title")}</h3>
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
                  name="fromDate"
                  label={t("membership.report.fields.fromDate")}
                  startYear={2000}
                  endYear={2050}
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label={t("membership.report.fields.toDate")}
                  startYear={2000}
                  endYear={2050}
                />

                <DropdownField
                  control={form.control}
                  name="memberType"
                  label={t("membership.report.fields.memberType")}
                  options={memberTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("membership.report.placeholders.memberType")}
                  searchPlaceholder={t("membership.report.placeholders.searchMemberType")}
                />

                <DropdownField
                  control={form.control}
                  name="reportType"
                  label={t("membership.report.fields.reportType")}
                  options={reportTypeData}
                  optionLabelKey="Option_Value"
                  placeholder={t("membership.report.placeholders.reportType")}
                  searchPlaceholder={t("membership.report.placeholders.searchReportType")}
                />

                <DropdownField
                  control={form.control}
                  name="branch"
                  label={t("membership.report.fields.branch")}
                  options={branchData}
                  optionLabelKey="Branch_Name"
                  placeholder={t("membership.report.placeholders.branch")}
                  searchPlaceholder={t("membership.report.placeholders.searchBranch")}
                />

                <div className="w-full flex items-center gap-5 self-end">
                  <Button className="w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center">
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
                      if (tableData?.length > 0)
                        showData === "100"
                          ? generateMemberRegisterPrint()
                          : showData === "101"
                            ? generateTransactionRegisterPrint()
                            : showData === "102"
                              ? generateWithdrawnRegisterPrint()
                              : showData === "103"
                                ? generateDetailedListPrint()
                                : showData === "104"
                                  ? generateDividendListPrint()
                                  : null;
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          tableData?.length > 0
                        ),
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                  <div
                    onClick={() => {
                      if (tableData?.length > 0) handleDownloadPDF();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          tableData?.length > 0
                        ),
                      },
                    )}
                  >
                    <FiDownload />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>

        {showData && showData.length > 0 && (
          <div className="w-full border border-primary overflow-hidden rounded-lg">
            <div className="w-full h-full flex flex-col overflow-x-scroll">
              {showData === "100" ? (
                <MemberRegisterTable
                  tableData={tableData}
                  totalAdmFees={totalAdmFees}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "101" ? (
                <TransactionRegisterTable
                  tableData={tableData}
                  totalIssue={totalIssue}
                  totalRelease={totalRelease}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                  handleGenerateShareReceipt={handleGenerateShareReceipt}
                />
              ) : showData === "102" ? (
                <WithdrawnRegisterTable
                  tableData={tableData}
                  totalAmount={totalAmount}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "103" ? (
                <DetailedListTable
                  tableData={tableData}
                  totalOpening={totalOpening}
                  totalIssue={totalIssue}
                  totalRelease={totalRelease}
                  totalClosing={totalClosing}
                  totalDividend={totalDividend}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "104" ? (
                <DividendListTable
                  tableData={tableData}
                  totalBalance={totalBalance}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>

      <ShareLedger
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalRefund={totalRefund}
        totalIssue={totalLedgerIssue}
        loading={getLedgerLoading}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
      />

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        {showData === "100" ? (
          <MemberRegisterPreview
            printRef={printMemberRegisterRef}
            tableData={tableData}
            totalAdmFees={totalAdmFees}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "101" ? (
          <TransactionRegisterPreview
            printRef={printTransactionRegisterRef}
            tableData={tableData}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "102" ? (
          <WithdrawnRegisterPreview
            printRef={printWithdrawnRegisterRef}
            tableData={tableData}
            totalAmount={totalAmount}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "103" ? (
          <DetailedListPreview
            printRef={printDetailedListRef}
            tableData={tableData}
            totalOpening={totalOpening}
            totalIssue={totalIssue}
            totalRelease={totalRelease}
            totalClosing={totalClosing}
            totalDividend={totalDividend}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "104" ? (
          <DividendListPreview
            printRef={printDividendListRef}
            tableData={tableData}
            totalBalance={totalBalance}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : (
          <></>
        )}
      </div>

      {showData === "101" ? (
        <ShareIssueReceipt
          isOpen={isOpenShareReceipt}
          setIsOpen={setIsOpenShareReceipt}
          shareIssueReceiptData={shareIssueReceiptData}
        />
      ) : null}
    </div>
  );
};
export default MembershipReport;
