"use client";

import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
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
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

const AdjustmentVoucher = ({
  loading,
  form,
  handleSubmit,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  tableData,
  totalCredit,
  totalDebit,
  handleDeleteTableData,
  handlePostAdjustmentVoucher,
}) => {
  const { t } = useTranslation();

  const ledgerListData = useSelector(
    (state) => state?.voucherEntry?.ledgerList
  );

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" flex border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              <div className="w-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                <h3 className="w-full text-center text-xl font-semibold">
                  {t("adjustmentVoucher.adjustmentVoucher")}
                </h3>
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                  <DatePickerField
                    control={form.control}
                    name="date"
                    label={t("common.voucherDate")}
                    startYear={2000}
                    endYear={2050}
                  />

                  <FormField
                    control={form.control}
                    name="manVoucherNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.manualVoucherNo")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("common.enterManualVoucherNo")}
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
                        <FormLabel>{t("common.narration")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("common.enterNarration")}
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
                    name="gl"
                    render={({ field }) => (
                      <DropdownField
                        label={t("common.gl")}
                        value={field.value}
                        onChange={field.onChange}
                        options={ledgerListData}
                        optionLabelKey="Ledger_Name" // Specify the key for label
                        placeholder={t("common.selectGl")}
                        searchPlaceholder={t("common.searchGl")}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.amount")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("common.enterAmount")}
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
                    name="drCr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.drCr")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("common.selectDrCr")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={`D`}>
                              {t("common.debit")}
                            </SelectItem>
                            <SelectItem value={`C`}>
                              {t("common.credit")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button className="self-end w-full sm:w-1/5" type="submit">
                  {t("common.addToTable")}
                </Button>
              </div>

              {tableData && tableData.length > 0 && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          {t("common.sl")}
                        </TableHead>
                        <TableHead>{t("common.glName")}</TableHead>
                        <TableHead>{t("common.amount")}</TableHead>
                        <TableHead>{t("common.drCr")}</TableHead>
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
                                  (ledger) => ledger.Id == data.gl
                                )[0]?.Ledger_Name}
                            </TableCell>
                            <TableCell>{data?.amount}</TableCell>
                            <TableCell>
                              {data.drCr &&
                                (data.drCr === "C"
                                  ? t("common.credit")
                                  : t("common.debit"))}
                            </TableCell>
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
                        <TableCell></TableCell>
                        <TableCell>{t("common.totalCredit")}</TableCell>
                        <TableCell>{totalCredit}</TableCell>
                        <TableCell>{t("common.totalDebit")}</TableCell>
                        <TableCell>{totalDebit}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}

              <div
                className={cn(
                  "w-full sm:w-1/5 bg-primary text-sm text-white py-3 flex items-center justify-center rounded-md cursor-pointer self-end",
                  {
                    "bg-gray-500 cursor-not-allowed":
                      loading ||
                      !(tableData && tableData.length > 0) ||
                      totalCredit !== totalDebit,
                  }
                )}
                onClick={handlePostAdjustmentVoucher}
              >
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  t("common.post")
                )}
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default AdjustmentVoucher;
