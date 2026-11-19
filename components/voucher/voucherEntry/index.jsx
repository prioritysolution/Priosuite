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
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  const voucherTypeOptions = [
    { Id: "R", Option_Value: t("voucher.receipt") },
    { Id: "P", Option_Value: t("voucher.payment") },
    { Id: "J", Option_Value: t("voucher.journal") },
  ];

  const drCrOptions = [
    { Id: "D", Option_Value: t("voucher.debit") },
    { Id: "C", Option_Value: t("voucher.credit") },
  ];

  useEffect(() => {
    if (window !== undefined)
      setIsOpeningActive(
        sidebarData?.some((item) => item?.title === "Opening"),
      );
  }, [sidebarData]);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" flex flex-col border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="w-full text-center text-2xl font-semibold">
          {t("voucher.voucherEntry")}
        </h3>
        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-4 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                  <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                    {t("voucher.voucherEntry")}
                  </h3>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <div className="flex items-center gap-2 w-full">
                    <DatePickerField
                      control={form.control}
                      name="date"
                      label={t("voucher.voucherDate")}
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

                  <DropdownField
                    control={form.control}
                    name="voucherType"
                    label={t("voucher.voucherType")}
                    placeholder={t("voucher.selectVoucherType")}
                    options={voucherTypeOptions}
                    isRequired={true}
                    disabled={tableData && tableData.length > 0}
                  />

                  <InputField
                    control={form.control}
                    name="manVoucherNo"
                    label={t("voucher.manualVoucherNo")}
                    placeholder={t("voucher.enterManualVoucherNo")}
                    readOnly={tableData && tableData.length > 0}
                  />

                  <InputField
                    control={form.control}
                    name="narration"
                    label={t("voucher.narration")}
                    placeholder={t("voucher.enterNarration")}
                    isRequired={true}
                    readOnly={tableData && tableData.length > 0}
                  />

                  <InputField
                    control={form.control}
                    name="ledgerCode"
                    label={t("voucher.ledgerCode")}
                    placeholder={t("voucher.enterLedgerCode")}
                    type="number"
                    isBlurUpdate
                    isRequired={true}
                    endContent={
                      <LedgerSearchForm form={form} fieldName="ledgerCode" />
                    }
                  />

                  <InputField
                    label={t("common.gl")}
                    name="gl"
                    control={form.control}
                    placeholder={t("voucher.enterGl")}
                    disabled={true}
                    readOnly={true}
                    displayValue={glData?.Ledger_Name || ""}
                  />

                  <FormField
                    control={form.control}
                    name="subLedger"
                    render={({ field }) => (
                      <DropdownField
                        label={t("voucher.subLedger")}
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

                  <InputField
                    control={form.control}
                    name="amount"
                    label={t("common.amount")}
                    placeholder={t("common.enterAmount")}
                    type="number"
                    isRequired={true}
                  />

                  <InputField
                    control={form.control}
                    name="ledgerNarration"
                    label={t("voucher.subLedgerNarration")}
                    placeholder={t("voucher.enterLedgerNarration")}
                    readOnly={
                      !form.getValues("gl") ||
                      !(subLedgerListData?.length > 0)
                    }
                  />

                  <DropdownField
                    control={form.control}
                    name="drCr"
                    label={t("voucher.drCr")}
                    placeholder={t("voucher.selectDrCr")}
                    options={drCrOptions}
                    isRequired={true}
                    disabled={voucherType === "R" || voucherType === "P"}
                  />

                  {subLedgerBalance > 0 && (
                    <InputField
                      control={form.control}
                      name="subLedgerBalance"
                      label={t("voucher.subLedgerBalance")}
                      placeholder={t("voucher.enterSubLedgerBalance")}
                      type="number"
                      readOnly={true}
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
                    t("common.addToTable")
                  ) : postVoucherLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("common.post")
                  )}
                </Button>
              </div>

              {voucherType === "J" && tableData && tableData.length > 0 && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          {t("common.sl")}
                        </TableHead>
                        <TableHead>{t("common.glName")}</TableHead>
                        <TableHead>{t("common.amount")}</TableHead>
                        <TableHead>{t("voucher.drCr")}</TableHead>
                        <TableHead>{t("common.subLedgerName")}</TableHead>
                        <TableHead>{t("common.subLedgerNarration")}</TableHead>
                        <TableHead>{t("common.action")}</TableHead>
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
                                (data.drCr === "C"
                                  ? t("voucher.credit")
                                  : t("voucher.debit"))}
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
                        <TableCell colSpan={2}>
                          {t("voucher.totalCredit")}
                        </TableCell>
                        <TableCell>{totalCredit}</TableCell>
                        <TableCell colSpan={2}>
                          {t("voucher.totalDebit")}
                        </TableCell>
                        <TableCell>{totalDebit}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}

              {!(!voucherType || voucherType === "J") && isActiveDenom && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("voucher.denominationBlock")}
                    </h3>
                  </div>
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
                    t("common.post")
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
        nextLabel={t("voucher.printReceipt")}
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
