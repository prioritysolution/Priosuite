"use client";

import { useTranslation } from "react-i18next";
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
import { useSelector } from "react-redux";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniPrinter } from "react-icons/hi2";
import { PiFileMagnifyingGlassBold } from "react-icons/pi";
import RadioField from "@/common/formFields/RadioField";
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

const DefaulterList = ({
  loading,
  form,
  handleSubmit,
  tableData,
  asOnDate,
  productType,
  reportType,
}) => {
  const { t } = useTranslation();

  const [showReportForm, setShowReportForm] = useState(true);

  const branchData = useSelector((state) => state?.ledgerBalance?.branchData);

  const productTypeData = useSelector(
    (state) => state?.newApplication?.loanProductData,
  );

  const printRef = useRef(null);

  const generatePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${reportType === "1" ? "DefaulterList" : "FinalRepayList"}-${asOnDate && format(asOnDate, "dd-MM-yyyy")}`,
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
                <h3 className="text-xl font-semibold ">{t("loan.defaulterList")}</h3>
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
                    ? "max-h-[1000px] py-5"
                    : "max-h-0 py-0 pointer-events-none opacity-0",
                )}
              >
                <DatePickerField
                  control={form.control}
                  name="asOnDate"
                  label={t("loan.asOnDate")}
                  startYear={2000}
                  endYear={2050}
                />

                <DropdownField
                  control={form.control}
                  name="productType"
                  label={t("loan.loanProduct")}
                  options={productTypeData}
                  optionLabelKey="Prod_Sh_Name"
                  placeholder={t("loan.selectLoanProduct")}
                  searchPlaceholder={t("loan.searchLoanProduct")}
                />

                <DropdownField
                  control={form.control}
                  name="reportType"
                  label={t("loan.reportType")}
                  options={[
                    { Id: "1", label: t("loan.defaultersList") },
                    { Id: "2", label: t("loan.finalRepayList") },
                  ]}
                  optionLabelKey="label"
                  placeholder={t("loan.selectReportType")}
                  searchPlaceholder={t("loan.searchReportType")}
                />

                <DropdownField
                  control={form.control}
                  name="branch"
                  label={t("loan.branch")}
                  options={branchData}
                  optionLabelKey="Branch_Name"
                  placeholder={t("loan.selectBranch")}
                  searchPlaceholder={t("loan.searchBranch")}
                />

                <InputField
                  control={form.control}
                  name="fromMonth"
                  label={t("loan.fromMonth")}
                  placeholder={t("loan.enterFromMonth")}
                  type="number"
                />

                <InputField
                  control={form.control}
                  name="toMonth"
                  label={t("loan.toMonth")}
                  placeholder={t("loan.enterToMonth")}
                  type="number"
                />

                <FormField
                  control={form.control}
                  name="viewType"
                  render={({ field }) => (
                    <RadioField
                      label={t("loan.viewType")}
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: "0", label: t("loan.withoutGuarantor") },
                        { value: "1", label: t("loan.withGuarantor") },
                      ]}
                      className="border border-input px-3 py-2 rounded-md"
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

        <div className="w-full border border-primary overflow-hidden rounded-lg">
          <div className="w-full h-full flex flex-col overflow-x-scroll">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="bg-gray-100">
                  <TableHead className=" text-center">{t("loan.slNo")}</TableHead>
                  <TableHead className="">{t("loan.memberNo")}</TableHead>
                  <TableHead className="">{t("loan.accountNoShort")}</TableHead>
                  <TableHead className="">{t("loan.name")}</TableHead>
                  <TableHead className="">{t("loan.principal")}</TableHead>
                  <TableHead className="">{t("loan.interest")}</TableHead>
                  <TableHead className="">{t("loan.oDPrincipal")}</TableHead>
                  <TableHead className="">{t("loan.oDInterest")}</TableHead>
                  <TableHead className="">{t("loan.dueMonth")}</TableHead>
                  <TableHead className="">{t("loan.startDate")}</TableHead>
                  <TableHead className="">{t("loan.finalRepayDate")}</TableHead>
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
                      <Fragment key={index}>
                        {/* Transaction Row */}
                        <TableRow>
                          <TableCell className="font-medium text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell>{data?.Member_No || ""}</TableCell>
                          <TableCell>{data?.Account_No || ""}</TableCell>
                          <TableCell>{data?.Member_Name || ""}</TableCell>
                          <TableCell>{data?.Balance || ""}</TableCell>
                          <TableCell>{data?.Interest || ""}</TableCell>
                          <TableCell>{data?.OD_Principal || ""}</TableCell>
                          <TableCell>{data?.OD_Interest || ""}</TableCell>
                          <TableCell>{data?.Due_Month || ""}</TableCell>
                          <TableCell className="text-nowrap">
                            {data.Disb_Date &&
                              format(data.Disb_Date, "dd-MM-yyyy")}
                          </TableCell>
                          <TableCell className="text-nowrap">
                            {data.Final_Date &&
                              format(data.Final_Date, "dd-MM-yyyy")}
                          </TableCell>
                        </TableRow>

                        {/* Guarantor Rows (render AFTER transaction row) */}
                        {data?.Gurantor_Data?.map((guarantor, gIndex) => (
                          <TableRow key={`guarantor-${index}-${gIndex}`}>
                            <TableCell colSpan={3} className="text-center">
                              {gIndex == 0 ? "Guarantor" : ""}
                            </TableCell>
                            <TableCell colSpan={8} className="">
                              {guarantor.Gurantor_Name}
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
              </TableBody>
              {tableData && tableData?.grandTotal && (
                <TableFooter>
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="font-bold w-full text-right"
                    >{t("loan.total")}</TableCell>
                    <TableCell className="font-bold">
                      {tableData?.grandTotal?.principal?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {tableData?.grandTotal?.interest?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {tableData?.grandTotal?.odPrincipal?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="font-bold">
                      {tableData?.grandTotal?.odInterest?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell colSpan={3}></TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>
        </div>
      </div>

      <div className="hidden">
        <PreviewModal
          printRef={printRef}
          tableData={tableData}
          asOnDate={asOnDate}
          productType={
            productTypeData?.find((item) => item.Id == productType)
              ?.Prod_Sh_Name || ""
          }
          reportType={
            reportType === "1" ? "Defaulter List" : "Final Repay List"
          }
        />
      </div>
    </div>
  );
};
export default DefaulterList;
