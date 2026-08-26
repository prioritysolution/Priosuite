"use client";
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
// import PreviewModal from "./PreviewModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FiEye, FiEyeOff, FiDownload } from "react-icons/fi";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import { HiMiniPrinter } from "react-icons/hi2";
import { Fragment } from "react";
import PreviewModal from "./PreviewModal";

const UserScroll = ({
  loading,
  form,
  handleSubmit,
  userList,
  reportData,
  asOnDate,
  user,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `UserScroll-${asOnDate}`,
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
      pdf.save(`UserScroll-${toDate}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
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
                <h3 className="text-xl font-semibold ">User Scroll Report</h3>
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
                  label="Date"
                  startYear={2000}
                  endYear={2050}
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
                <DropdownField
                  control={form.control}
                  name="user"
                  label="User"
                  options={userList}
                  optionLabelKey="User_Name"
                  placeholder="Select user"
                  searchPlaceholder="Search user..."
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
                    onClick={() => {
                      if (reportData?.length > 0) handleDownloadPDF();
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
                    <FiDownload />
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
                      SL. NO.
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      REF. VOUCH.
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      VOUCH. NO.
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[380px]">
                      PARTICULARS
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      RECEIPT
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      PAYMENT
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
                            <TableCell colSpan={4}>Total</TableCell>
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
                      Grand Total
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
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <PreviewModal
          printRef={printRef}
          reportData={reportData}
          asOnDate={asOnDate}
          user={user}
        />
      </div>
    </div>
  );
};
export default UserScroll;
