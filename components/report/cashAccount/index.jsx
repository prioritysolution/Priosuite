"use client";
import { useTranslation } from "react-i18next";
import { useEnglishOnly } from "@/i18n/useEnglishOnly";
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
import { useReactToPrint } from "react-to-print";
import PreviewModal from "./PreviewModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { HiMiniPrinter } from "react-icons/hi2";
import { useState } from "react";
import toast from "react-hot-toast";
import { downloadCashAccountPdf } from "../buildReportPdfs";
import { createPortal } from "react-dom";

const CashAccount = ({
  loading,
  form,
  handleSubmit,
  ledgerTableReceiptData,
  ledgerTablePaymentData,
  // generatePDF,
  fromDate,
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
  denomData,
}) => {
  const { t: tForm } = useTranslation();
  const { t } = useEnglishOnly();
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const voucherListData = useSelector((state) => state?.daybook?.voucherList);

  const voucherDetailsData = useSelector(
    (state) => state?.daybook?.voucherDetails,
  );

  const printRef = useRef(null);
  const printHostRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `CashAccount-${fromDate}-${toDate}`,
  });

    const handleDownloadPDF = async () => {
    const hasData =
      (ledgerTableReceiptData && ledgerTableReceiptData.length > 0) ||
      (ledgerTablePaymentData && ledgerTablePaymentData.length > 0) ||
      !!cashBalanceData;

    if (!hasData) {
      toast.error(t("report.cashAccount.noDataToDownload"));
      return;
    }

    const toastId = toast.loading("Preparing PDF…");

    try {
      setPdfLoading(true);
      await downloadCashAccountPdf({
        receipts: ledgerTableReceiptData || [],
        payments: ledgerTablePaymentData || [],
        denomData: denomData || [],
        fromDate,
        toDate,
        cashBalanceData,
        totals: {
          totalCashReceived,
          totalTranferReceived,
          totalReceived,
          totalCashPayment,
          totalTranferPayment,
          totalPayment,
        },
        t,
        onProgress: (done, total) => {
          toast.loading(`Writing rows ${done} / ${total}`, { id: toastId });
        },
      });
      toast.success(t("report.cashAccount.pdfDownloaded"), { id: toastId });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error(
        error?.message
          ? `${t("report.cashAccount.failedToDownloadPdf")}: ${error.message}`
          : t("report.cashAccount.failedToDownloadPdf"),
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
                <h3 className="text-xl font-semibold ">{t("report.cashAccount.cashAccountReport")}</h3>
                <div
                  onClick={() => setShowReportForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showReportForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 px-5",
                  showReportForm
                    ? "max-h-[1000px] py-2"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
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
                      value={field.value}
                      onChange={field.onChange}
                      options={branchData}
                      label={tForm("common.branch")}
                      optionLabelKey="Branch_Name" // Specify the key for label
                      placeholder={tForm("common.selectBranch")}
                      searchPlaceholder={tForm("common.searchBranch")}
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
                        ledgerTableReceiptData?.length > 0 ||
                        ledgerTablePaymentData?.length > 0 ||
                        cashBalanceData
                      )
                        generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
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
                      {t("report.cashAccount.print.receipt")}
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-16">
                      {t("report.cashAccount.vNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[250px]">
                      {t("report.cashAccount.nameOfLedger")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashAccount.print.cash")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashAccount.print.transfer")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashAccount.print.total")}
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
                      {t("common.total")}
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
                      {t("common.openingBalance")}
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
                      {t("common.grandTotal")}
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
                    <TableHead colSpan={5} className=" text-white text-center">
                      {t("report.cashAccount.print.payment")}
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-16">
                      {t("report.cashAccount.vNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[250px]">
                      {t("report.cashAccount.nameOfLedger")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashAccount.print.cash")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashAccount.print.transfer")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.cashAccount.print.total")}
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
                      {t("common.total")}
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
                      {t("common.closingBalance")}
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
                      {t("common.grandTotal")}
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
                {t("report.cashAccount.closingCashBalanceInWord")} :{" "}
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
                <p>{t("report.cashAccount.denominationTable")}</p>
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
              {t("report.cashAccount.listOfVouchersForTheDayOn")} {toDate}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ScrollArea className="w-full h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      {t("common.sl")}
                    </TableHead>
                    <TableHead>{t("voucher.voucherNo")}</TableHead>
                    <TableHead>
                      {t("report.cashAccount.transactionType")}
                    </TableHead>
                    <TableHead>{t("common.receipts")}</TableHead>
                    <TableHead>{t("common.narration")}</TableHead>
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
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
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
              fromDate={fromDate}
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
    </div>
  );
};
export default CashAccount;
