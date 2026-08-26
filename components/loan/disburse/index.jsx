"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
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
import TextareaField from "@/common/formFields/TextareaField";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { PiHandCoinsBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const Disburse = ({
  loading,
  getDisburseListLoading,
  postDisburseLoading,
  notes,
  inDenominators,
  outDenominators,
  cashInTransactionTotal,
  cashOutTransactionTotal,
  cashInTransactionGrandTotal,
  cashOutTransactionGrandTotal,
  handleInDenominatorChange,
  handleOutDenominatorChange,
  form,
  handleSubmit,
  successMessage,
  transMode,
  showForm,
  handleOpenForm,
  handleBackToTable,
  showSuccessDialog,
  handleCloseSuccessMessage,
  deductions = [],
}) => {
  const [isActiveDenom, setIsActiveDenom] = useState(false);
  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const beg_date = getCookieData("beg_date");

  const disburseDataList = useSelector(
    (state) => state?.disburse?.disburseData,
  );

  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2  w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Loan Disburse</h3>

        {!showForm ? (
          <div className="w-full border border-primary rounded-lg ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] text-center">Sl</TableHead>
                  <TableHead className="text-center">Application No</TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Sanction Date</TableHead>
                  <TableHead className="text-center">Applicant Name</TableHead>
                  <TableHead className="text-center">Account No</TableHead>
                  <TableHead className="text-center">Sanction Amount</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getDisburseListLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <TableCell key={idx} className="text-center">
                          <Skeleton className="w-full h-6" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : disburseDataList.length > 0 ? (
                  disburseDataList.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        {data?.Appl_No || ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {data?.Product_Name || data?.Prod_Name || ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {data?.Sanc_Date
                          ? format(new Date(data.Sanc_Date), "dd-MM-yyyy")
                          : ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {data?.Full_Name || ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {data?.Account_No || ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {data?.Sanc_Amount || ""}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          className="px-3 py-2 w-fit rounded-md text-white"
                          onClick={() => handleOpenForm(data)}
                        >
                          <PiHandCoinsBold className="text-2xl" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <ScrollArea className="w-full h-full px-2 sm:px-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit, (errors) =>
                  console.log("Validation Errors:", errors),
                )}
                className="w-full h-full flex flex-col gap-2 justify-between"
                autoComplete="off"
              >
                <div className="w-full">
                  <div
                    className="w-fit px-5 py-2 bg-primary rounded-md text-white text-2xl cursor-pointer"
                    onClick={handleBackToTable}
                  >
                    <FaArrowLeftLong />
                  </div>
                </div>

                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Application Block
                  </h3>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 xl:gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="applicationNo"
                      label="Application No."
                      placeholder="Enter application no."
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="applicationDate"
                      label="Application Date"
                      placeholder="Enter application date"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="sanctionDate"
                      label="Sanction Date"
                      placeholder="Enter sanction date"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="accountNo"
                      label="Account No."
                      placeholder="Enter account no."
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="memberName"
                      label="Member Name"
                      placeholder="Enter member name"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="gurdianName"
                      label="Gurdian Name"
                      placeholder="Enter gurdian name"
                      readOnly
                    />
                    <TextareaField
                      control={form.control}
                      name="address"
                      label="Address"
                      placeholder="Enter address"
                      className="resize-none"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="mobile"
                      label="Mobile No."
                      placeholder="Enter mobile no."
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="panNo"
                      label="Pan No."
                      placeholder="Enter pan no."
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="applicationAmount"
                      label="Sanction Amount"
                      placeholder="Enter sanction amount"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="shareBalance"
                      label="Share Balance"
                      placeholder="Enter share balance"
                      readOnly
                    />

                    {/* <InputField
                      control={form.control}
                      name="depositBalance"
                      label="Deposit Balance"
                      placeholder="Enter deposit balance"
                      readOnly
                    /> */}
                  </div>
                </div>

                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-3 gap-3">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Disburse Block
                  </h3>
                  <div className="w-full overflow-x-auto rounded-lg border border-gray-300 bg-white">
                    <Table className="min-w-[600px] w-full text-sm border-collapse">
                      <TableHeader className="bg-gray-50">
                        <TableRow className="border-b border-gray-300">
                          <TableHead className="w-[60px] font-bold text-center border-r border-gray-300 text-gray-700">
                            Sl
                          </TableHead>
                          <TableHead className="font-bold border-r border-gray-300 text-gray-700">
                            Particulars
                          </TableHead>
                          <TableHead className="font-bold text-right border-r border-gray-300 text-gray-700 w-[200px] pr-4">
                            Disburse
                          </TableHead>
                          <TableHead className="font-bold text-right text-gray-700 w-[200px] pr-4">
                            Deductions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <TableRow
                              key={i}
                              className="border-b border-gray-300"
                            >
                              <TableCell className="text-center border-r border-gray-300 py-2">
                                <Skeleton className="h-4 w-6 mx-auto" />
                              </TableCell>
                              <TableCell className="border-r border-gray-300 py-2">
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              <TableCell className="border-r border-gray-300 py-2">
                                <Skeleton className="h-4 w-20 ml-auto" />
                              </TableCell>
                              <TableCell className="py-2">
                                <Skeleton className="h-4 w-20 ml-auto" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <>
                            <TableRow className="border-b border-gray-300 hover:bg-gray-50/30">
                              <TableCell className="text-center border-r border-gray-300 py-1">
                                1
                              </TableCell>
                              <TableCell className="font-medium border-r border-gray-300 py-1">
                                Loan Disburse
                              </TableCell>
                              <TableCell className="p-0 border-r border-gray-300 py-1">
                                <InputField
                                  control={form.control}
                                  name="disburseAmount"
                                  placeholder="0.00"
                                  className="border-none focus-within:ring-0 shadow-none bg-transparent h-8 w-full text-right pr-4 font-semibold"
                                  formItemClassName="w-full px-2 py-1"
                                  isBlurUpdate={true}
                                />
                              </TableCell>
                              <TableCell className="bg-gray-50/50 text-center text-gray-400 py-1">
                                —
                              </TableCell>
                            </TableRow>
                            {deductions && deductions.length > 0 && (
                              <>
                                {deductions.map((d, index) => (
                                  <TableRow
                                    key={d.Id || index}
                                    className="border-b border-gray-300 hover:bg-gray-50/30"
                                  >
                                    <TableCell className="text-center border-r border-gray-300 py-1">
                                      {index + 2}
                                    </TableCell>
                                    <TableCell className="font-medium border-r border-gray-300 py-1">
                                      {d.Deduction_Name}
                                    </TableCell>
                                    <TableCell className="bg-gray-50/50 border-r border-gray-300 text-center text-gray-400 py-1">
                                      —
                                    </TableCell>
                                    <TableCell className="text-right pr-4 py-1 tabular-nums font-semibold text-gray-800">
                                      {parseFloat(
                                        d.Charge_Amt || 0,
                                      ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow className="border-b border-gray-300 hover:bg-gray-50/30">
                                  <TableCell className="text-center border-r border-gray-300 py-1">
                                    {deductions.length + 2}
                                  </TableCell>
                                  <TableCell className="font-bold text-primary border-r border-gray-300 py-1">
                                    Net Disburse
                                  </TableCell>
                                  <TableCell className="bg-gray-50/50 border-r border-gray-300 text-center text-gray-400 py-1">
                                    —
                                  </TableCell>
                                  <TableCell className="text-right pr-4 py-1 bg-primary/[0.02] tabular-nums font-bold text-primary">
                                    {Number(
                                      form.watch("netDisburseAmount") || 0,
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-100/70 font-bold hover:bg-gray-100">
                                  <TableCell className="text-center border-r border-gray-300 py-2"></TableCell>
                                  <TableCell className="border-r border-gray-300 py-2 text-gray-800">
                                    Total
                                  </TableCell>
                                  <TableCell className="text-right border-r border-gray-300 pr-4 tabular-nums py-2 text-gray-800 font-bold">
                                    {Number(
                                      form.watch("disburseAmount") || 0,
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </TableCell>
                                  <TableCell className="text-right pr-4 tabular-nums py-2 text-gray-800 font-bold">
                                    {(
                                      deductions.reduce(
                                        (acc, d) =>
                                          acc + parseFloat(d.Charge_Amt || 0),
                                        0,
                                      ) +
                                      Number(
                                        form.watch("netDisburseAmount") || 0,
                                      )
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </TableCell>
                                </TableRow>
                              </>
                            )}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 py-2 sm:px-5 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Transanction Block
                  </h3>
                  <div className="w-full flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="transMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-col lg:flex-row items-center space-y-0 gap-x-10 gap-y-5   border border-input rounded-md px-3 pr-10 py-3 w-full lg:w-fit">
                          <FormLabel>Select transanction mode</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-5"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="cash" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Cash
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="bank" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Bank
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="savings" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Savings
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <DatePickerField
                        control={form.control}
                        name="disburseDate"
                        label="Disburse Date"
                        defaultValue={new Date(beg_date)}
                        disabled={true}
                      />

                      <InputField
                        control={form.control}
                        name="refVouchNo"
                        label="Ref. Vouch No."
                        placeholder="Enter ref. vouch no."
                      />

                      <InputField
                        control={form.control}
                        name="bondNo"
                        label="Bond No."
                        placeholder="Enter bond no."
                      />
                      {transMode === "cash" ? (
                        isActiveDenom ? (
                          <div className=" lg:grid-cols-2 xl:col-span-3 w-full lg:w-1/2 flex flex-col lg:flex-row gap-10">
                            <DoubleCashDenomTable
                              notes={notes}
                              inDenominators={outDenominators}
                              outDenominators={inDenominators}
                              totalInAmount={cashOutTransactionTotal}
                              totalOutAmount={cashInTransactionTotal}
                              cashInTransactionGrandTotal={
                                cashOutTransactionGrandTotal
                              }
                              cashOutTransactionGrandTotal={
                                cashInTransactionGrandTotal
                              }
                              handleInDenominatorChange={
                                handleOutDenominatorChange
                              }
                              handleOutDenominatorChange={
                                handleInDenominatorChange
                              }
                              primaryInput="out"
                            />
                          </div>
                        ) : null
                      ) : transMode === "bank" ? (
                        <DropdownField
                          control={form.control}
                          name="bank"
                          label="Bank"
                          options={bankAccountData}
                          optionLabelKey="Bank_Name"
                          placeholder="Select bank"
                          searchPlaceholder="Search bank..."
                        />
                      ) : (
                        <DropdownField
                          control={form.control}
                          name="savings"
                          label="Savings"
                          options={savingsAccountData}
                          optionLabelKey="Account_No"
                          placeholder="Select savings"
                          searchPlaceholder="Search savings..."
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full flex items-center justify-end">
                  <Button
                    type="submit"
                    className="w-full sm:w-1/5"
                    disabled={
                      !Number(form.getValues("netDisburseAmount")) ||
                      (transMode === "cash" &&
                        isActiveDenom &&
                        Number(cashInTransactionGrandTotal) -
                          Number(cashOutTransactionGrandTotal) !==
                          Number(form.getValues("netDisburseAmount"))) ||
                      (transMode === "bank" && !form.getValues("bank")) ||
                      (transMode === "savings" && !form.getValues("savings"))
                    }
                  >
                    {postDisburseLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        )}

        <SuccessMessage
          successMessage={successMessage}
          showSuccessMessage={showSuccessDialog}
          handleCloseSuccessMessage={handleCloseSuccessMessage}
        />
      </div>
    </div>
  );
};
export default Disburse;
