

"use client";


import { useTranslation } from "react-i18next";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import AccountPassbookSearchForm from "@/common/forms/AccountPassbookSearchForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import PassbookPrintPreviewDialog from "./PassbookPrintPreviewDialog";
import { ArrowRight, Printer, CheckCircle2, AlertCircle } from "lucide-react";

const PassbookPrint = ({
  loading,
  form,
  handleSubmit,
  handleSelectAccount,
  dialougeOpen,
  setDialougeOpen,
  pageParameter,
  frontPageDetail,
  pageData,
  showPage,
  showLine,
  handleUpdateTrans,
  operateProductData,
}) => {
  const { t } = useTranslation();

  const firstPageRef = useRef(null);
  const transPageRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [showPrintSuccess, setShowPrintSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showPage === "FIRST" || showPage === "TRANS") {
      setPreviewOpen(true);
    }
  }, [showPage]);

  const generateFirstPagePDF = useReactToPrint({
    contentRef: firstPageRef,
    documentTitle: "Front Page",
  });

  const generateTransPagePDF = useReactToPrint({
    contentRef: transPageRef,
    documentTitle: "Transaction Page",
    onAfterPrint: () => {
      setShowPrintSuccess(true);
      setPreviewOpen(false);
    },
  });

  if (!mounted) return null;

  const totalLinesPerPage =
    (pageParameter?.Line_No_Fst_Page || 0) +
    (pageParameter?.Line_No_Scnd_Page || 0);
  const blankLinesCount = Math.max(Number(showLine) - 1, 0);

  const skipDataLength =
    blankLinesCount >= totalLinesPerPage
      ? Math.floor(blankLinesCount / totalLinesPerPage)
      : 0;

  const emptyRows = Array.from({ length: blankLinesCount }, () => ({
    Id: null,
    Acct_Id: null,
    Balance: null,
    Deposit: null,
    Withdrwan: null,
    Particular: null,
    Trans_Date: null,
  }));

  const totalPageData = pageData ? [...emptyRows, ...pageData] : emptyRows;

  const transPrintData = totalPageData
    ?.reduce((acc, _, i) => {
      if (i % totalLinesPerPage === 0)
        acc.push(totalPageData?.slice(i, i + totalLinesPerPage));
      return acc;
    }, [])
    ?.slice(skipDataLength);

  const printType = form.watch("printType");
  const isTransPage = printType === "2";

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-3 lg:p-5 w-full gap-4 overflow-hidden">
        <h3 className="text-2xl font-semibold self-start">{t("deposit.passbookPrint.title")}</h3>

        <ScrollArea className="w-full h-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full"
              autoComplete="off"
            >
              {/* Single responsive row — wraps gracefully on small screens */}
              <div className="flex flex-wrap items-end gap-3">
                {/* Product selection */}
                <div className="w-full sm:w-56 shrink-0">
                  <DropdownField
                    control={form.control}
                    name="productId"
                    label={t("deposit.fields.product")}
                    options={operateProductData}
                    optionLabelKey="Product_Name"
                    optionValueKey="Id"
                    placeholder={t("deposit.placeholders.selectProduct")}
                  />
                </div>

                {/* Account search — widest field */}
                <div className="w-full sm:w-56 shrink-0">
                  <AccountPassbookSearchForm
                    form={form}
                    handleSelectClick={handleSelectAccount}
                    dialougeOpen={dialougeOpen}
                    setDialougeOpen={setDialougeOpen}
                  />
                </div>

                {/* Print type toggle */}
                <FormField
                  control={form.control}
                  name="printType"
                  render={({ field }) => (
                    <FormItem className="shrink-0">
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Print Type
                      </FormLabel>
                      <FormControl>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => field.onChange("1")}
                            className={cn(
                              "flex items-center gap-1.5 px-3.5 h-10 rounded-lg border text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
                              field.value === "1"
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-muted/50 text-muted-foreground border-border/60 hover:border-border hover:bg-muted/80",
                            )}
                          >
                            {t("deposit.passbookPrint.frontPage")}
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange("2")}
                            className={cn(
                              "flex items-center gap-1.5 px-3.5 h-10 rounded-lg border text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
                              field.value === "2"
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-muted/50 text-muted-foreground border-border/60 hover:border-border hover:bg-muted/80",
                            )}
                          >
                            {t("deposit.passbookPrint.transactionPage")}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional fields — only visible for transaction page */}
                {isTransPage && (
                  <>
                    <div className="w-full sm:w-40 shrink-0">
                      <DatePickerField
                        control={form.control}
                        name="date"
                        label={t("deposit.fields.fromDateLower")}
                        disabledDateAfter={new Date()}
                      />
                    </div>

                    <div className="w-28 shrink-0">
                      <InputField
                        control={form.control}
                        name="line"
                        label={t("deposit.fields.lineNo")}
                        placeholder={t("deposit.placeholders.memberNo")}
                        type="number"
                      />
                    </div>
                  </>
                )}

                {/* Submit button — pinned to the end of the row */}
                <div className="shrink-0 w-full sm:w-auto sm:ml-auto">
                  <Button
                    type="submit"
                    className="w-full sm:w-28 h-10 text-[13px] font-medium gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader
                        color="currentColor"
                        size={14}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      <>
                        Next
                        <ArrowRight size={14} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>

      {/* Preview dialog */}
      <PassbookPrintPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        showPage={showPage}
        frontPageDetail={frontPageDetail}
        pageData={pageData}
        pageParameter={pageParameter}
        firstPageRef={firstPageRef}
        transPageRef={transPageRef}
        generateFirstPagePDF={generateFirstPagePDF}
        generateTransPagePDF={generateTransPagePDF}
        transPrintData={transPrintData}
        blankLinesCount={blankLinesCount}
        skipDataLength={skipDataLength}
        totalLinesPerPage={totalLinesPerPage}
        showLine={showLine}
      />

      {/* Print success confirmation dialog */}
      <Dialog open={showPrintSuccess}>
        <DialogContent
          className="w-[calc(100vw-1rem)] sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-xl"
          hideClose
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center gap-3 px-6 pt-7 pb-5 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Printer size={22} className="text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-[16px] font-semibold text-foreground">
                Confirm print
              </DialogTitle>
              <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                Did the passbook print successfully? Confirm to mark the
                transactions as printed.
              </p>
            </div>
          </div>

          <div className="mx-6 mb-5 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-lg px-3.5 py-3">
            <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-[12px] text-amber-700 leading-relaxed">
              Clicking <strong>Yes</strong> will update the transaction records.
              This action cannot be undone.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setShowPrintSuccess(false)}
              className="flex-1 h-9 text-[13px] border-border/60 hover:bg-muted/60"
            >
              No, retry
            </Button>
            <Button
              onClick={() => {
                setShowPrintSuccess(false);
                handleUpdateTrans(
                  transPrintData[transPrintData?.length - 1].length,
                );
              }}
              className="flex-1 h-9 text-[13px] gap-1.5"
            >
              <CheckCircle2 size={14} />
              Yes, confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PassbookPrint;
