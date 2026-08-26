"use client";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import DetailedListTable from "./DetailedListTable";
import BorrowingLedger from "@/common/ledger/borrowingsLedger/BorrowingLedger";
import { ClipLoader } from "react-spinners";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { cn } from "@/lib/utils";
import DetailedListPreview from "./DetailedListPreview";
import { format } from "date-fns";
import { useState } from "react";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BorrowingsReport = ({
  loading,
  form,
  handleSubmit,
  tableData,
  toDate,
  showData,
  handleShowLedger,
  showLedger,
  setShowLedger,
  getLedgerLoading,
  ledgerHeaderData,
  ledgerTableData,
  totalDisburse,
  totalPrincipalRefund,
  totalInterestRefund,
  userName,
  currentDate,
  currentTime,
  fromDate,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const reportTypeData = useSelector(
    (state) => state?.memberReport?.reportTypeData,
  );

  const printDetailedListRef = useRef(null);

  const generateDetailedListPrint = useReactToPrint({
    contentRef: printDetailedListRef,
    documentTitle: `InvestmentDetailedList-${
      fromDate && format(fromDate, "dd-MM-yyyy")
    }-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  const handleDownloadPDF = async () => {
    let element = null;
    let docTitle = "document";
    if (showData === "113" || showData === "115") {
      element = printDetailedListRef.current;
      docTitle = `BorrowingsDetailedList-${fromDate && format(fromDate, "dd-MM-yyyy")}-${toDate && format(toDate, "dd-MM-yyyy")}`;
    }

    if (!element) return;

    try {
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
                  "flex items-center justify-between p-5 py-2 bg-primary/10",
                  {
                    "border-b border-primary transition-all duration-300 ":
                      showReportForm,
                  },
                )}
              >
                <div />
                <h3 className="text-xl font-semibold ">Borrowings Report</h3>
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
                  isRequired
                />

                <DatePickerField
                  control={form.control}
                  name="toDate"
                  label="To Date"
                  startYear={2000}
                  endYear={2050}
                  isRequired
                />

                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <DropdownField
                      label="Report Type"
                      value={field.value}
                      onChange={field.onChange}
                      options={reportTypeData}
                      optionLabelKey="Option_Value"
                      placeholder="Select report type"
                      searchPlaceholder="Search report type..."
                      isRequired
                    />
                  )}
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
                      optionLabelKey="Branch_Name"
                      placeholder="Select branch"
                      searchPlaceholder="Search branch..."
                      isRequired
                    />
                  )}
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
                        showData === "115" ? generateDetailedListPrint() : null;
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
              {showData === "113" ? (
                <DetailedListTable
                  loading={loading}
                  tableData={tableData}
                  handleShowLedger={handleShowLedger}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
      </div>
      <BorrowingLedger
        loading={getLedgerLoading}
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalDisburse={totalDisburse}
        totalPrincipalRefund={totalPrincipalRefund}
        totalInterestRefund={totalInterestRefund}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
      />

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        {showData === "113" ? (
          <DetailedListPreview
            printRef={printDetailedListRef}
            tableData={tableData}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default BorrowingsReport;
