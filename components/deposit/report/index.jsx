

"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useSelector } from "react-redux";
import OpeningRegisterTable from "./OpeningRegisterTable";
import TransactionRegisterTable from "./TransactionRegisterTable";
import CloseRegisterTable from "./CloseRegisterTable";
import DetailedListTable from "./DetailedListTable";
import InterestListTable from "./InterestListTable";
import DepositLedger from "@/common/ledger/depositLedger/DepositLedger";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { ClipLoader } from "react-spinners";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { format } from "date-fns";
import OpeningRegisterPreview from "./OpeningRegisterPreview";
import { cn } from "@/lib/utils";
import CloseRegisterPreview from "./CloseRegisterPreview";
import InterestListPreview from "./InterestListPreview";
import DetailedListPreview from "./DetailedListPreview";
import TransactionRegisterPreview from "./TransactionRegisterPreview";
import { useState } from "react";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import DepositReceipt from "../deposit/DepositReceipt";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DepositReport = ({
  loading,
  form,
  handleSubmit,
  tableData,
  toDate,
  totalDeposit,
  totalWithdrawn,
  totalInterest,
  totalOpening,
  totalClosing,
  totalPaidIntt,
  totalDueIntt,
  totalAmount,
  showData,
  handleShowLedger,
  showLedger,
  setShowLedger,
  getLedgerLoading,
  ledgerHeaderData,
  ledgerTableData,
  totalLedgerDeposit,
  totalLedgerWithdrawn,
  totalLedgerInterest,
  ledgerUserName,
  currentLedgerDate,
  currentLedgerTime,
  fromDate,
  handleGenerateDepositReceipt,
  isOpenDepositReceipt,
  setIsOpenDepositReceipt,
  depositReceiptData,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const productTypeData = useSelector(
    (state) => state?.depositReport?.productTypeData,
  );

  const reportTypeData = useSelector(
    (state) => state?.memberReport?.reportTypeData,
  );

  const printOpeningRegisterRef = useRef(null);
  const printTransactionRegisterRef = useRef(null);
  const printClosingRegisterRef = useRef(null);
  const printDetailedListRef = useRef(null);
  const printInterestListRef = useRef(null);

  const generateOpeningRegisterPrint = useReactToPrint({
    contentRef: printOpeningRegisterRef,
    documentTitle: `AcountOpeningRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateTransactionRegisterPrint = useReactToPrint({
    contentRef: printTransactionRegisterRef,
    documentTitle: `TransactionRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateClosingRegisterPrint = useReactToPrint({
    contentRef: printClosingRegisterRef,
    documentTitle: `AcountClosingRegister-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateDetailedListPrint = useReactToPrint({
    contentRef: printDetailedListRef,
    documentTitle: `DetailedList-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const generateInterestListPrint = useReactToPrint({
    contentRef: printInterestListRef,
    documentTitle: `InterestLedger-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const handleDownloadPDF = async () => {
    let element = null;
    let docTitle = "document";
    if (showData === "105") {
      element = printOpeningRegisterRef.current;
      docTitle = `AcountOpeningRegister-${fromDate && format(fromDate, "dd-MM-yyyy")}-${toDate && format(toDate, "dd-MM-yyyy")}`;
    } else if (showData === "106") {
      element = printTransactionRegisterRef.current;
      docTitle = `TransactionRegister-${fromDate && format(fromDate, "dd-MM-yyyy")}-${toDate && format(toDate, "dd-MM-yyyy")}`;
    } else if (showData === "107") {
      element = printClosingRegisterRef.current;
      docTitle = `AcountClosingRegister-${fromDate && format(fromDate, "dd-MM-yyyy")}-${toDate && format(toDate, "dd-MM-yyyy")}`;
    } else if (showData === "108") {
      element = printDetailedListRef.current;
      docTitle = `DetailedList-${fromDate && format(fromDate, "dd-MM-yyyy")}-${toDate && format(toDate, "dd-MM-yyyy")}`;
    } else if (showData === "109") {
      element = printInterestListRef.current;
      docTitle = `InterestLedger-${fromDate && format(fromDate, "dd-MM-yyyy")}-${toDate && format(toDate, "dd-MM-yyyy")}`;
    }

    if (!element) return;

    try {
      const isLandscape = showData !== "109";
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
      pdf.save(`${docTitle}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
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
                <h3 className="text-xl font-semibold ">Deposit Report</h3>
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
                  label="From Date"
                  startYear={2000}
                  endYear={2050}
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label="To Date"
                  startYear={2000}
                  endYear={2050}
                />

                <DropdownField
                  control={form.control}
                  name="productType"
                  label="Product Type"
                  options={productTypeData}
                  optionLabelKey="Prd_SH_Name"
                  placeholder="Select product type"
                  searchPlaceholder="Search product type..."
                />

                <DropdownField
                  control={form.control}
                  name="reportType"
                  label="Report Type"
                  options={reportTypeData}
                  optionLabelKey="Option_Value"
                  placeholder="Select report type"
                  searchPlaceholder="Search report type..."
                />

                <DropdownField
                  control={form.control}
                  name="branch"
                  label="Branch"
                  options={branchData}
                  optionLabelKey="Branch_Name"
                  placeholder="Select branch"
                  searchPlaceholder="Search branch..."
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
                        showData === "105"
                          ? generateOpeningRegisterPrint()
                          : showData === "106"
                            ? generateTransactionRegisterPrint()
                            : showData === "107"
                              ? generateClosingRegisterPrint()
                              : showData === "108"
                                ? generateDetailedListPrint()
                                : showData === "109"
                                  ? generateInterestListPrint()
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
              {showData === "105" ? (
                <OpeningRegisterTable
                  tableData={tableData}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "106" ? (
                <TransactionRegisterTable
                  tableData={tableData}
                  totalDeposit={totalDeposit}
                  totalWithdrawn={totalWithdrawn}
                  totalInterest={totalInterest}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                  handleGenerateDepositReceipt={handleGenerateDepositReceipt}
                />
              ) : showData === "107" ? (
                <CloseRegisterTable
                  tableData={tableData}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "108" ? (
                <DetailedListTable
                  tableData={tableData}
                  totalOpening={totalOpening}
                  totalDeposit={totalDeposit}
                  totalWithdrawn={totalWithdrawn}
                  totalClosing={totalClosing}
                  totalPaidIntt={totalPaidIntt}
                  totalDueIntt={totalDueIntt}
                  handleShowLedger={handleShowLedger}
                  loading={loading}
                />
              ) : showData === "109" ? (
                <InterestListTable
                  tableData={tableData}
                  totalAmount={totalAmount}
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

      <DepositLedger
        loading={getLedgerLoading}
        showLedgerDialog={showLedger}
        setShowLedgerDialog={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        currentDate={currentLedgerDate}
        currentTime={currentLedgerTime}
        userName={ledgerUserName}
        totalDeposit={totalLedgerDeposit}
        totalWithdrawn={totalLedgerWithdrawn}
        totalInterest={totalLedgerInterest}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
      />

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        {showData === "105" ? (
          <OpeningRegisterPreview
            printRef={printOpeningRegisterRef}
            tableData={tableData}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "106" ? (
          <TransactionRegisterPreview
            printRef={printTransactionRegisterRef}
            tableData={tableData}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "107" ? (
          <CloseRegisterPreview
            printRef={printClosingRegisterRef}
            tableData={tableData}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "108" ? (
          <DetailedListPreview
            printRef={printDetailedListRef}
            tableData={tableData}
            totalOpening={totalOpening}
            totalDeposit={totalDeposit}
            totalWithdrawn={totalWithdrawn}
            totalClosing={totalClosing}
            totalPaidIntt={totalPaidIntt}
            totalDueIntt={totalDueIntt}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "109" ? (
          <InterestListPreview
            printRef={printInterestListRef}
            tableData={tableData}
            totalAmount={totalAmount}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : (
          <></>
        )}
      </div>

      {showData === "106" ? (
        <DepositReceipt
          isOpen={isOpenDepositReceipt}
          setIsOpen={setIsOpenDepositReceipt}
          depositReceiptData={depositReceiptData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
export default DepositReport;
