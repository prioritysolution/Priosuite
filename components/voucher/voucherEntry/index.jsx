"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import SearchDropdownField from "@/common/formFields/SearchDropdownField";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import getCookieData from "@/utils/getCookieData";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import VoucherReceipt from "./VoucherReceipt";
import { Checkbox } from "@/components/ui/checkbox";
import LedgerSearchForm from "@/common/forms/LedgerSearchForm";
import InputField from "@/common/formFields/InputField";

const VoucherEntry = ({
  loading,
  postVoucherLoading,
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
  showSuccessMessage,
  handleCloseSuccessMessage,
  subLedgerBalance,
  voucherType,
  tableData,
  totalCredit,
  totalDebit,
  handleDeleteTableData,
  handlePostVoucherEntry,
  handleSearchSubLedger,
  handleScrollSubLedger,
  subLedgerInput,
  setSubLedgerInput,
  handleGenerateReceipt,
  isReceiptOpen,
  setIsReceiptOpen,
  receiptData,
  isDateChecked,
  setIsDateChecked,
  glData,
}) => {
  const [isActiveDenom, setIsActiveDenom] = useState(false);

  const [isOpeningActive, setIsOpeningActive] = useState(false);
  const beg_date = getCookieData("beg_date");

  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  const ledgerListData = useSelector(
    (state) => state?.voucherEntry?.ledgerList,
  );

  const subLedgerListData = useSelector(
    (state) => state?.voucherEntry?.subLedgerList,
  );

  const subHeadData = useSelector((state) => state?.voucherEntry?.subHead);

  const sidebarData = useSelector((state) => state.sidebar.sidebarData);

  // console.log("tableData=", tableData);
  // console.log("  totalDebit=", totalDebit);

  console.log("form.getValues(gl)", form.getValues("gl"));
  console.log(
    "!(subLedgerListData.length > 0)",
    !(subLedgerListData.length > 0),
  );

  console.log("subLedgerListData=", subLedgerListData);

  useEffect(() => {
    if (window !== undefined)
      setIsOpeningActive(
        sidebarData?.some((item) => item?.title === "Opening"),
      );
  }, [sidebarData]);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" flex flex-col border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="w-full text-center text-xl font-semibold">
          Voucher Entry
        </h3>
        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-2 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <div className="flex items-center gap-2 w-full">
                    <DatePickerField
                      control={form.control}
                      name="date"
                      label="Voucher Date"
                      disabled={true}
                      defaultValue={new Date(beg_date)}
                      isRequired={true}
                    />
                    {isOpeningActive && (
                      <Checkbox
                        checked={isDateChecked}
                        onCheckedChange={setIsDateChecked}
                        className="mt-8 w-5 h-5"
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="voucherType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Voucher Type{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={tableData && tableData.length > 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select voucher type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={`R`}>Receipt</SelectItem>
                            <SelectItem value={`P`}>Payment</SelectItem>
                            <SelectItem value={`J`}>Journal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manVoucherNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manual Voucher No.</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter manual voucher no."
                            readOnly={tableData && tableData.length > 0}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="narration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Narration <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter narration"
                            readOnly={tableData && tableData.length > 0}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <InputField
                    control={form.control}
                    name="ledgerCode"
                    label="Ledger Code"
                    placeholder="Enter ledger code"
                    type="number"
                    isBlurUpdate
                    isRequired={true}
                    endContent={
                      <LedgerSearchForm
                        form={form}
                        fieldName="ledgerCode"
                      />
                    }
                  />

                  <InputField
                    label="GL."
                    name="gl"
                    control={form.control}
                    placeholder="Enter GL."
                    disabled={true}
                    readOnly={true}
                    displayValue={glData?.Ledger_Name || ""}
                  />

                  {/* <FormField
                    control={form.control}
                    name="subHead"
                    render={({ field }) => (
                      <DropdownField
                        label="Sub Head"
                        value={field.value}
                        onChange={field.onChange}
                        options={subHeadData}
                        optionLabelKey="Head_Name"
                        optionValueKey="Id"
                        placeholder="Select sub head"
                        searchPlaceholder="Search sub head..."
                        fixedDropdownWidth
                        isRequired={true}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gl"
                    render={({ field }) => (
                      <DropdownField
                        label="GL."
                        value={field.value}
                        onChange={field.onChange}
                        options={ledgerListData}
                        optionLabelKey="Ledger_Name" // Specify the key for label
                        placeholder="Select gl"
                        searchPlaceholder="Search gl..."
                        fixedDropdownWidth
                        isRequired={true}
                      />
                    )}
                  /> */}

                  <FormField
                    control={form.control}
                    name="subLedger"
                    render={({ field }) => (
                      <SearchDropdownField
                        label="Sub Ledger"
                        value={field.value}
                        onChange={field.onChange}
                        options={subLedgerListData}
                        optionLabelKey={"Ledger_Name"} // Specify the key for label
                        // disabled={getUnitLoading}
                        disabled={
                          !form.getValues("gl") ||
                          !(subLedgerListData.length > 0)
                        }
                        input={subLedgerInput}
                        setInput={setSubLedgerInput}
                        handleSearch={handleSearchSubLedger}
                        loadMore={handleScrollSubLedger}
                        isRequired={subLedgerListData.length > 0}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Amount <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter amount"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ledgerNarration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Ledger Narration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter ledger narration"
                            readOnly={
                              !form.getValues("gl") ||
                              !(subLedgerListData?.length > 0)
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drCr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          DR/CR <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={voucherType === "R" || voucherType === "P"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dr/cr" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={`D`}>Debit</SelectItem>
                            <SelectItem value={`C`}>Credit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {subLedgerBalance > 0 && (
                    <FormField
                      control={form.control}
                      name="subLedgerBalance"
                      render={({ field }) => (
                        <FormItem
                          className={`${subLedgerBalance <= 0 && "hidden"}`}
                        >
                          <FormLabel>Sub Ledger Balance</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter sub ledger balance"
                              type="number"
                              readOnly
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <Button
                  className="self-end w-full sm:w-1/5"
                  type="submit"
                  disabled={
                    postVoucherLoading ||
                    (voucherType === "R" &&
                      isActiveDenom &&
                      parseInt(cashInTransactionGrandTotal) -
                        parseInt(cashOutTransactionGrandTotal) !==
                        parseInt(totalCredit)) ||
                    (voucherType === "P" &&
                      isActiveDenom &&
                      parseInt(cashOutTransactionGrandTotal) -
                        parseInt(cashInTransactionGrandTotal) !==
                        parseInt(totalDebit))
                  }
                >
                  {voucherType === "J" ? (
                    "Add To Table"
                  ) : postVoucherLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>

              {voucherType === "J" && tableData && tableData.length > 0 && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">SL.</TableHead>
                        <TableHead>Gl. Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>DR/CR</TableHead>
                        <TableHead>Sub Ledger Name</TableHead>
                        <TableHead>Sub Ledger Narration</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData &&
                        tableData.length > 0 &&
                        tableData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              {ledgerListData &&
                                ledgerListData.length > 0 &&
                                ledgerListData.filter(
                                  (ledger) => ledger.Id == data.gl,
                                )[0]?.Ledger_Name}
                            </TableCell>
                            <TableCell>{data?.amount}</TableCell>
                            <TableCell>
                              {data.drCr &&
                                (data.drCr === "C" ? "Credit" : "Debit")}
                            </TableCell>
                            <TableCell>{data?.subLedgerName || ""}</TableCell>
                            <TableCell>{data?.ledgerNarration}</TableCell>
                            <TableCell className="text-2xl text-red-500 text-center">
                              <MdDeleteForever
                                onClick={() => handleDeleteTableData(index)}
                                className="cursor-pointer"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={2}>Total Credit</TableCell>
                        <TableCell>{totalCredit}</TableCell>
                        <TableCell colSpan={2}>Total Debit</TableCell>
                        <TableCell>{totalDebit}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}

              {!(!voucherType || voucherType === "J") && isActiveDenom && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 sm:p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Denomination Block
                  </h3>
                  <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-10">
                    <DoubleCashDenomTable
                      notes={notes}
                      inDenominators={inDenominators}
                      outDenominators={outDenominators}
                      totalInAmount={cashInTransactionTotal}
                      totalOutAmount={cashOutTransactionTotal}
                      cashInTransactionGrandTotal={cashInTransactionGrandTotal}
                      cashOutTransactionGrandTotal={
                        cashOutTransactionGrandTotal
                      }
                      handleInDenominatorChange={handleInDenominatorChange}
                      handleOutDenominatorChange={handleOutDenominatorChange}
                    />
                  </div>
                </div>
              )}

              {voucherType === "J" && (
                <div
                  className={cn(
                    "w-full sm:w-1/5 bg-primary text-sm text-white py-3 flex items-center justify-center rounded-md cursor-pointer self-end",
                    {
                      "bg-gray-500 cursor-not-allowed":
                        postVoucherLoading ||
                        !(tableData && tableData.length > 0) ||
                        (voucherType === "J" && totalCredit !== totalDebit),
                    },
                  )}
                  onClick={handlePostVoucherEntry}
                >
                  {postVoucherLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Post"
                  )}
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
        showNextButton={!!receiptData}
        handleNextButton={handleGenerateReceipt}
        nextLabel="Print Receipt"
      />

      {!showSuccessMessage && (
        <VoucherReceipt
          isOpen={isReceiptOpen}
          setIsOpen={setIsReceiptOpen}
          receiptData={receiptData}
        />
      )}
    </div>
  );
};
export default VoucherEntry;
