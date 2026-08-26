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
import html2canvas from "html2canvas";

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
  const [showReportForm, setShowReportForm] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const printRef = useRef(null);
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

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      setPdfLoading(true);
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
      pdf.save(`Cashbook-${toDate}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
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
                <h3 className="text-xl font-semibold ">Cashbook Report</h3>
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
                  label="Date"
                  startYear={2000}
                  endYear={2050}
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
                      optionLabelKey="Branch_Name" // Specify the key for label
                      placeholder="Select branch"
                      searchPlaceholder="Search branch..."
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
                    onClick={() => {
                      if (loading || pdfLoading) return;
                      if (
                        ledgerTableReceiptData?.length > 0 ||
                        ledgerTablePaymentData?.length > 0 ||
                        cashBalanceData
                      )
                        handleDownloadPDF();
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
                      Receipt
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-12">
                      SL. NO.
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      Vouch No.
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      Ledger Name
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[280px]">
                      PARTICULARS
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      AMOUNT
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
                      Total
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
                      Opening Balance
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
                      Payment
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-primary text-white hover:bg-primary">
                    <TableHead className=" text-white text-center w-12">
                      SL. NO.
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      Vouch No.
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center ">
                      Ledger Name
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[280px]">
                      PARTICULARS
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      AMOUNT
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
                      Total
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
                      Closing Balance
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
                Closing Cash Balance in Word :{" "}
              </span>
              {cashBalanceData &&
              cashBalanceData.Closing &&
              parseFloat(cashBalanceData.Closing) > 0
                ? `Rupees ${convertToWords(
                    Number(cashBalanceData.Closing),
                  )} Only`
                : ""}
            </p>
            {denomData?.length > 0 ? (
              <div className="w-[300px] ml-20 text-center">
                <p>Physical Denomination</p>
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
                Print
              </Button>
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
              <ScrollArea className="w-full h-full">
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
          )}
        </DialogContent>
      </Dialog>

      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <PreviewModal
          printRef={printRef}
          ledgerTableReceiptData={ledgerTableReceiptData}
          ledgerTablePaymentData={ledgerTablePaymentData}
          denomData={denomData}
          // generatePDF={generatePrint}
          toDate={toDate}
          totalReceived={totalReceived}
          totalPayment={totalPayment}
          cashBalanceData={cashBalanceData}
        />
      </div>

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
