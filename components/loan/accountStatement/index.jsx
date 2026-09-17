"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import PreviewModal from "./PreviewModal";
import { Input } from "@/components/ui/input";
import { Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanAccountSearchTable from "@/common/tables/LoanAccountSearchTable";
import { useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";

const AccountStatement = ({
  loading,
  form,
  handleSubmit,
  tableData,
  fromDate,
  toDate,
  dialougeOpen,
  setDialougeOpen,
  activeTab,
  setActiveTab,
  getLoanAccountLoading,
  currentAccountPage,
  setCurrentAccountPage,
  lastAccountPage,
  handleSearchAccountListByMemberNo,
  handleSearchAccountListByName,
  handleSelectClick,
}) => {
  const [showReportForm, setShowReportForm] = useState(true);

  const loanAccountListData = useSelector(
    (state) => state?.repayment?.loanAccountSearchData,
  );

  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `AccountStatement-${fromDate && format(fromDate, "dd-MM-yyyy")}-${toDate && format(toDate, "dd-MM-yyyy")}`,
  });

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden px-2 sm:px-10 2xl:px-10">
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
                <h3 className="text-xl font-semibold ">Account Statement</h3>
                <div
                  onClick={() => setShowReportForm((prev) => !prev)}
                  className="text-primary text-xl cursor-pointer"
                >
                  {showReportForm ? <FiEyeOff /> : <FiEye />}
                </div>
              </div>
              <div
                className={cn(
                  "transition-all duration-300 ease-in-out grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-3 px-5",
                  showReportForm
                    ? "max-h-[1000px] py-5"
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

                <Dialog
                  open={dialougeOpen}
                  onOpenChange={setDialougeOpen}
                  className=""
                >
                  <FormField
                    control={form.control}
                    name="accountNo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Account No.</FormLabel>
                        <FormControl>
                          <div className="">
                            <div className="">
                              <div className="relative w-full">
                                <Input
                                  placeholder="Enter account no."
                                  className="w-full "
                                  type="number"
                                  {...field}
                                />
                                <div className="absolute right-0 top-0 py-3 px-3">
                                  <DialogTrigger
                                    asChild
                                    className="cursor-pointer text-lg"
                                  >
                                    <IoSearch />
                                  </DialogTrigger>
                                </div>
                              </div>
                              <FormMessage />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* <div className="w-full flex justify-start self-end gap-5">
                      <Button
                        type=""
                        className={cn("px-5 w-1/2", {
                          "w-fit text-xl h-10": showPrintButton,
                        })}
                        onClick={form.handleSubmit(handleSubmit)}
                      >
                        {buttonLabel}
                      </Button>
                      {showPrintButton ? (
                        <div
                          className={cn(
                            "px-5 w-fit flex items-center justify-center text-white bg-primary hover:bg-primary/80 cursor-pointer rounded-md  text-xl",
                            { "bg-gray-400 cursor-not-allowed": disablePrintButton },
                          )}
                          onClick={() => {
                            if (!disablePrintButton) handlePrint();
                          }}
                        >
                          {printButtonLabel}
                        </div>
                      ) : null}

                      {showLedger && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={handleShowLedger}
                                className="p-2 px-5 w-1/2 text-2xl bg-primary rounded-md text-white cursor-pointer flex items-center justify-center text-center"
                              >
                                <IoPrint />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Ledger</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div> */}

                  <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[825px]">
                    <DialogHeader
                      className={`w-full flex items-center justify-center`}
                    >
                      <DialogTitle>Search Account</DialogTitle>
                    </DialogHeader>
                    <div className="w-full">
                      <div className="w-full ">
                        <Tabs
                          defaultValue="memberNo"
                          value={activeTab}
                          onValueChange={setActiveTab}
                          className="w-full flex items-center justify-center flex-col"
                        >
                          <TabsList className="w-full sm:w-[70%]">
                            <TabsTrigger value="memberNo" className="w-full">
                              By Member No.
                            </TabsTrigger>
                            <TabsTrigger value="name" className="w-full">
                              By Member Name
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent
                            value="memberNo"
                            className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 "
                          >
                            <InputField
                              control={form.control}
                              name="dialougeMemberNo"
                              label="Member No."
                              placeholder="Search by enter member no."
                              autoComplete="off"
                            />
                            <Button
                              className="w-full sm:w-auto px-10"
                              onClick={handleSearchAccountListByMemberNo}
                            >
                              Search
                            </Button>
                          </TabsContent>
                          <TabsContent
                            value="name"
                            className="w-full flex flex-col sm:flex-row items-end gap-2 gap-x-10 "
                          >
                            <InputField
                              control={form.control}
                              name="dialougeMemberName"
                              label="Name"
                              placeholder="Search by enter name"
                              autoComplete="off"
                            />
                            <Button
                              className="w-full sm:w-auto px-10"
                              onClick={handleSearchAccountListByName}
                            >
                              Search
                            </Button>
                          </TabsContent>
                        </Tabs>
                      </div>
                      <div className="w-full ">
                        <LoanAccountSearchTable
                          loading={getLoanAccountLoading}
                          data={loanAccountListData}
                          handleSelectData={handleSelectClick}
                          currentAccountPage={currentAccountPage}
                          setCurrentAccountPage={setCurrentAccountPage}
                          lastAccountPage={lastAccountPage}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

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
                      if (tableData?.transactions?.length > 0) generatePrint();
                    }}
                    className={cn(
                      "w-fit px-3 h-10 text-xl text-center text-white bg-primary rounded-md cursor-pointer flex items-center justify-center",
                      {
                        "cursor-not-allowed bg-gray-400 ": !(
                          tableData?.transactions?.length > 0
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

        {tableData && tableData?.basicData && (
          <div className="w-full grid grid-cols-3 gap-2 border border-primary bg-blue-100 rounded-lg px-5 py-2 text-sm">
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Member Name : </p>
              <p>{tableData?.basicData?.Full_Name || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Guardian Name : </p>
              <p>{tableData?.basicData?.Relation_Name || ""}</p>
            </div>
            <div className="w-full flex gap-1 col-span-3">
              <p className="font-semibold text-nowrap">Address : </p>
              <p>{tableData?.basicData?.Address || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Account No. : </p>
              <p>{tableData?.basicData?.Account_No || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Ref. Ac. No. : </p>
              <p>{tableData?.basicData?.Ref_Ac_No || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Ledger Folio : </p>
              <p>{tableData?.basicData?.Ledg_Folio || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Disb. Date : </p>
              <p>
                {tableData?.basicData?.Disb_Date
                  ? format(tableData?.basicData?.Disb_Date, "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">ROI. : </p>
              <p>{tableData?.basicData?.Roi || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Disb. Amount : </p>
              <p>{tableData?.basicData?.Disb_Amt || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Repay Within : </p>
              <p>
                {tableData?.basicData?.Repay_Within
                  ? format(tableData?.basicData?.Repay_Within, "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Repay Mode : </p>
              <p>{tableData?.basicData?.Repay_Mode || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Product Name : </p>
              <p>{tableData?.basicData?.Prod_Name || ""}</p>
            </div>
          </div>
        )}
        {tableData && tableData?.transactions && (
          <div className="w-full border border-primary overflow-hidden rounded-lg">
            <div className="w-full h-full flex flex-col overflow-x-scroll">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow className="bg-gray-100">
                    <TableHead className=" text-center">Sl No.</TableHead>
                    <TableHead className="">Trans. Date</TableHead>
                    <TableHead className="">Particular</TableHead>
                    <TableHead className="">Disb. Amount</TableHead>
                    <TableHead className="">Curr. Prn. Paid</TableHead>
                    <TableHead className="">Curr. Intt. Paid</TableHead>
                    <TableHead className="">Od. Prn. Paid</TableHead>
                    <TableHead className="">Od. Intt. Paid</TableHead>
                    <TableHead className="">Curr. Outs.</TableHead>
                    <TableHead className="">Od. Outs.</TableHead>
                    <TableHead className="">Due Intt.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="overflow-y-scroll">
                  {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <TableRow key={index}>
                          {Array.from({ length: 10 }).map((_, index) => (
                            <TableCell key={index} className="">
                              <Skeleton className="w-full h-5 bg-secondary" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    : tableData?.transactions?.map((data, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            {data.Trans_Date &&
                              format(data.Trans_Date, "dd-MM-yyyy")}
                          </TableCell>
                          <TableCell>{data?.Particular || ""}</TableCell>
                          <TableCell>{data?.Disb_Amt || ""}</TableCell>
                          <TableCell>{data?.Cur_Prn || ""}</TableCell>
                          <TableCell>{data?.Curr_Intt || ""}</TableCell>
                          <TableCell>{data?.Od_Prn || ""}</TableCell>
                          <TableCell>{data?.Od_Intt || ""}</TableCell>
                          <TableCell>{data?.Curr_Outs || ""}</TableCell>
                          <TableCell>{data?.Od_Outs || ""}</TableCell>
                          <TableCell>{data?.Due_Intt || ""}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
                {tableData && tableData?.grandTotal && (
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="font-bold w-full text-right"
                      >
                        Total
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.disburse?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.currPrn?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.currIntt?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.odPrn?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.odIntt?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.currOuts?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.odOuts?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell className="font-bold">
                        {tableData?.grandTotal?.dueIntt?.toFixed(2) || "0.00"}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
          </div>
        )}
      </div>

      <div className="hidden">
        <PreviewModal
          printRef={printRef}
          tableData={tableData}
          fromDate={fromDate}
          toDate={toDate}
        />
      </div>
    </div>
  );
};
export default AccountStatement;
