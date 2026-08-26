"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import DisburseRegisterTable from "./DisburseRegisterTable";
import RepayRegisterTable from "./RepayRegisterTable";
import DetailedListTable from "./DetailedListTable";
import LoanLedger from "@/common/ledger/loanLedger/LoanLedger";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import DisburseRegisterPreview from "./DisburseRegisterPreview";
import DetailedListPreview from "./DetailedListPreview";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import RepaymentRegisterPreview from "./RepaymentRegisterPreview";
import CollectionReceipt from "../repayment/CollectionReceipt";

const LoanReport = ({
  loading,
  form,
  handleSubmit,
  tableData,
  toDate,
  totalDisburseAmount,
  totalShareAmount,
  totalInsAmount,
  totalMisAmount,
  totalNetDisburse,
  totalOpening,
  totalDisburse,
  totalPrn,
  totalIntt,
  totalAmount,
  totalCurrOuts,
  totalOdOuts,
  totalCurrIntt,
  totalOdIntt,
  showData,
  handleShowLedger,
  showLedger,
  setShowLedger,
  getLedgerLoading,
  ledgerHeaderData,
  ledgerTableData,
  totalLedgerDisburse,
  totalPrincipalRefund,
  totalInterestRefund,
  userName,
  currentDate,
  currentTime,
  fromDate,
  handleGenerateCollectionReceipt,
  isOpenCollectionReceipt,
  setIsOpenCollectionReceipt,
  collectionReceiptData,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const productTypeData = useSelector(
    (state) => state?.loanReport?.loanProductList,
  );

  console.log("productTypeData= ", productTypeData);

  const reportTypeData = useSelector(
    (state) => state?.memberReport?.reportTypeData,
  );

  const printDisburseRegisterRef = useRef(null);
  const printRepaymentRegisterRef = useRef(null);
  const printDetailedListRef = useRef(null);

  const generateDisburseRegisterPrint = useReactToPrint({
    contentRef: printDisburseRegisterRef,
    documentTitle: `LoanDisburseRegister-${fromDate}-${
      toDate && format(toDate, "dd-MM-yyyy")
    }`,
  });
  const generateRepaymentRegisterPrint = useReactToPrint({
    contentRef: printRepaymentRegisterRef,
    documentTitle: `LoanRepaymentRegister-${fromDate}-${
      toDate && format(toDate, "dd-MM-yyyy")
    }`,
  });
  const generateDetailedListPrint = useReactToPrint({
    contentRef: printDetailedListRef,
    documentTitle: `LoanDetailedList-${fromDate}-${
      toDate && format(toDate, "dd-MM-yyyy")
    }`,
  });

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <ScrollArea className="w-full h-full px-2 sm:px-10">
          {/* Loan Report Form */}
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
                  <h3 className="text-xl font-semibold ">Loan Report</h3>
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
                    label="Loan Product"
                    options={productTypeData}
                    optionLabelKey="Product_Name"
                    placeholder="Select loan product"
                    searchPlaceholder="Search loan product..."
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
                          showData === "110"
                            ? generateDisburseRegisterPrint()
                            : showData === "111"
                              ? generateRepaymentRegisterPrint()
                              : showData === "112"
                                ? generateDetailedListPrint()
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
                  </div>
                </div>
              </div>
            </form>
          </Form>

          {showData && showData.length > 0 && (
            <ScrollArea className="w-full rounded-md border border-primary overflow-y-hidden mt-4">
              <div className="py-4 w-full flex flex-col gap-5 px-3 lg:px-0 overflow-y-hidden">
                {showData === "110" ? (
                  <DisburseRegisterTable
                    loading={loading}
                    tableData={tableData}
                    totalDisburseAmount={totalDisburseAmount}
                    totalShareAmount={totalShareAmount}
                    totalInsAmount={totalInsAmount}
                    totalMisAmount={totalMisAmount}
                    totalNetDisburse={totalNetDisburse}
                    handleShowLedger={handleShowLedger}
                  />
                ) : showData === "111" ? (
                  <RepayRegisterTable
                    loading={loading}
                    tableData={tableData}
                    totalPrn={totalPrn}
                    totalIntt={totalIntt}
                    totalAmount={totalAmount}
                    handleShowLedger={handleShowLedger}
                    handleGenerateCollectionReceipt={
                      handleGenerateCollectionReceipt
                    }
                  />
                ) : showData === "112" ? (
                  <DetailedListTable
                    loading={loading}
                    tableData={tableData}
                    totalOpening={totalOpening}
                    totalDisburse={totalDisburse}
                    totalPrn={totalPrn}
                    totalIntt={totalIntt}
                    totalCurrOuts={totalCurrOuts}
                    totalOdOuts={totalOdOuts}
                    totalCurrIntt={totalCurrIntt}
                    totalOdIntt={totalOdIntt}
                    handleShowLedger={handleShowLedger}
                  />
                ) : (
                  <></>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </ScrollArea>
      </div>
      <LoanLedger
        loading={getLedgerLoading}
        showLedger={showLedger}
        setShowLedger={setShowLedger}
        fromDate={fromDate}
        toDate={toDate}
        userName={userName}
        currentDate={currentDate}
        currentTime={currentTime}
        totalDisburse={totalLedgerDisburse}
        totalPrincipalRefund={totalPrincipalRefund}
        totalInterestRefund={totalInterestRefund}
        ledgerHeaderData={ledgerHeaderData}
        ledgerTableData={ledgerTableData}
      />

      <div className="hidden">
        {showData === "110" ? (
          <DisburseRegisterPreview
            printRef={printDisburseRegisterRef}
            tableData={tableData}
            totalDisburseAmount={totalDisburseAmount}
            totalShareAmount={totalShareAmount}
            totalInsAmount={totalInsAmount}
            totalMisAmount={totalMisAmount}
            totalNetDisburse={totalNetDisburse}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "111" ? (
          <RepaymentRegisterPreview
            printRef={printRepaymentRegisterRef}
            tableData={tableData}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : showData === "112" ? (
          <DetailedListPreview
            printRef={printDetailedListRef}
            tableData={tableData}
            totalOpening={totalOpening}
            totalDisburse={totalDisburse}
            totalPrn={totalPrn}
            totalIntt={totalIntt}
            totalCurrOuts={totalCurrOuts}
            totalOdOuts={totalOdOuts}
            totalCurrIntt={totalCurrIntt}
            totalOdIntt={totalOdIntt}
            fromDate={fromDate}
            toDate={toDate}
          />
        ) : (
          <></>
        )}
      </div>

      {showData === "111" ? (
        <CollectionReceipt
          isOpen={isOpenCollectionReceipt}
          setIsOpen={setIsOpenCollectionReceipt}
          collectionReceiptData={collectionReceiptData}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
export default LoanReport;
