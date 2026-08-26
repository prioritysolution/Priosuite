"use client";
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
import { useRef } from "react";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import PreviewModal from "./PreviewModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";

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
  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const ledgerData = useSelector((state) => state?.accountLedger?.ledgerData);

  const voucherDetailsData = useSelector(
    (state) => state?.daybook?.voucherDetails,
  );

  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `AccountLedger-${fromDate}-${toDate}`,
  });

    const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const isLandscape = false;
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
      pdf.save(`AccountLedger-${toDate}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
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
                  Account Ledger Report
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
                  "transition-all duration-300 ease-in-out grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-10 gap-x-10 gap-y-3 px-5",
                  showReportForm
                    ? "max-h-[1000px] py-2"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
                <div className="xl:col-span-2">
                  <DatePickerField
                    control={form.control}
                    name="fromDate"
                    label="From Date"
                    startYear={2000}
                    endYear={2050}
                  />
                </div>

                <div className="xl:col-span-2">
                  <DatePickerField
                    control={form.control}
                    name="toDate"
                    label="To Date"
                    startYear={2000}
                    endYear={2050}
                  />
                </div>

                <div className="xl:col-span-2">
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <DropdownField
                        label="Branch"
                        value={field.value}
                        onChange={field.onChange}
                        options={branchData}
                        optionLabelKey="Branch_Name" // Specify the key for label
                        placeholder="Select branch"
                        searchPlaceholder="Search branch..."
                      />
                    )}
                  />
                </div>

                <div className="xl:col-span-3">
                  <FormField
                    control={form.control}
                    name="ledger"
                    render={({ field }) => (
                      <DropdownField
                        label="Ledger"
                        value={field.value}
                        onChange={field.onChange}
                        options={ledgerData}
                        optionLabelKey="Ledger_Name" // Specify the key for label
                        placeholder="Select ledger"
                        searchPlaceholder="Search ledger..."
                      />
                    )}
                  />
                </div>

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
                      if (ledgerTableData?.length > 0) generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          ledgerTableData?.length > 0
                        ),
                      },
                    )}
                  >
                    <HiMiniPrinter />
                  </div>
                  <div
                    onClick={() => {
                      if (ledgerTableData?.length > 0) handleDownloadPDF();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          ledgerTableData?.length > 0
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

        <ScrollArea className=" rounded-md border w-[300px] sm:w-full overflow-y-hidden">
          <div className="py-4 w-full flex flex-col gap-5  px-3 lg:px-0 overflow-y-hidden">
            <div className=" w-full">
              <Table className="border border-primary">
                <TableHeader>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-16">
                      Sl
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      Trans. Date
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Voucher No.
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Narration
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Debit
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Credit
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Balance
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
                      Total
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
                <span className="font-semibold">Voucher Type :</span>{" "}
                {voucherDetailsData &&
                  voucherDetailsData.length > 0 &&
                  voucherDetailsData[0]?.Vouch_type}
              </p>
              <p>
                <span className="font-semibold">Voucher No. :</span>{" "}
                {voucherDetailsData &&
                  voucherDetailsData.length > 0 &&
                  voucherDetailsData[0]?.Vouch_No}
              </p>
              <p>
                <span className="font-semibold">Ref. Vc. No :</span>{" "}
                {voucherDetailsData &&
                  voucherDetailsData.length > 0 &&
                  voucherDetailsData[0]?.Ref_Vouch_No}
              </p>
              <p>
                <span className="font-semibold">Voucher Date :</span>{" "}
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
                    <TableHead className="w-[100px]">Sl.</TableHead>
                    <TableHead>Head Of Account</TableHead>
                    <TableHead>Dr. Amount</TableHead>
                    <TableHead>Cr. Amount</TableHead>
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
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell>{totalDrAmount}</TableCell>
                    <TableCell>{totalCrAmount}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </ScrollArea>
            <p>
              <span className="font-semibold">Narration : </span>
              {voucherDetailsData &&
                voucherDetailsData.length > 0 &&
                voucherDetailsData[0]?.Particular}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <PreviewModal
          printRef={printRef}
          ledgerTableData={ledgerTableData}
          fromDate={fromDate}
          toDate={toDate}
          totalDebit={totalDebit}
          totalCredit={totalCredit}
          ledgerData={ledgerData}
          ledgerId={ledgerId}
        />
      </div>
    </div>
  );
};
export default AccountLedger;
