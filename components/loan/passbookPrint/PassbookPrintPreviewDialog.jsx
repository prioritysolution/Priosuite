"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formatDateSafe = (dateVal) => {
  if (!dateVal) return "";
  try {
    const parsed = new Date(dateVal);
    if (isNaN(parsed.getTime())) return "";
    return format(parsed, "dd-MM-yyyy");
  } catch {
    return "";
  }
};

const money = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return amount.toFixed(2);
};

const FirstPagePrint = ({ pageParameter, pageData, printRef, t }) => (
  <div
    style={{
      width: `${pageParameter?.Page_Width}mm`,
      height: `${pageParameter?.Page_Height}mm`,
    }}
    className="p-2 flex flex-col bg-white text-[11px] leading-[16px]"
    ref={printRef}
  >
    <div
      style={{
        height: `calc(${pageParameter?.Fst_Page_Top}*16px)`,
      }}
      className="w-full"
    />
    {pageData?.map((value, i) => (
      <div key={`front-${i}`}>
        <p
          className={cn(
            "",
            { "text-center font-semibold": i <= 2 },
            {
              "grid grid-cols-[2fr_4fr]": value && value.includes(":"),
            },
          )}
        >
          <span
            className={cn("font-semibold text-nowrap", {
              "flex justify-between": i > 2,
            })}
          >
            {value.split(":")[0]}
            {!!value.includes(":") && <span className="font-bold">:</span>}{" "}
          </span>
          <span className="pl-2">{value?.split(":")[1]?.replace(/,/g, ", ")}</span>
        </p>
        {i === 2 ? <div className="w-full h-[16px]" /> : null}
      </div>
    ))}
    <div className="w-full h-[32px]" />
    <div className="w-[200px] h-[30px] self-end border-t-2 border-black text-center flex items-center justify-center font-semibold">
      <span>{t("loan.print.manager")}</span>
    </div>
  </div>
);

const TransPagePrint = ({
  pageParameter,
  transPrintData,
  blankLinesCount,
  skipDataLength,
  totalLinesPerPage,
  printRef,
  t,
}) => (
  <div
    style={{
      width: `${pageParameter?.Page_Width}mm`,
    }}
    className="h-full text-[11px] leading-[16px]"
    ref={printRef}
  >
    {transPrintData.map((printData, index) => (
      <div
        style={{
          height: `${pageParameter?.Page_Height}mm`,
        }}
        className="p-2 flex flex-col w-full bg-white mb-3 last:mb-0"
        key={`page-${index}`}
      >
        <div
          className={cn(
            "w-full grid grid-cols-[1fr_2fr_3fr_2fr_2fr_2fr_2fr]",
            {
              "opacity-0":
                index == 0 &&
                0 < blankLinesCount - skipDataLength * totalLinesPerPage,
            },
          )}
        >
          <p className="border-x-2 border-black font-medium text-center">Sl.</p>
          <p className="border-r-2 border-black font-medium text-center">
            {t("loan.date")}
          </p>
          <p className="border-r-2 border-black font-medium text-center">
            {t("loan.particulars")}
          </p>
          <p className="border-r-2 border-black font-medium text-center">
            {t("loan.principal")}
          </p>
          <p className="border-r-2 border-black font-medium text-center">
            {t("loan.interest")}
          </p>
          <p className="border-r-2 border-black font-medium text-center">
            {t("loan.balance")}
          </p>
          <p className="border-r-2 border-black font-medium text-center">
            {t("loan.dueIntt")}
          </p>
        </div>
        {printData.map((data, i) => (
          <div key={`table-${index}-${i}`} className="flex flex-col">
            <div
              className={cn(
                "w-full grid grid-cols-[1fr_2fr_3fr_2fr_2fr_2fr_2fr]",
                {
                  "opacity-0":
                    index == 0 &&
                    i < blankLinesCount - skipDataLength * totalLinesPerPage,
                },
              )}
            >
              <p className="border-x-2 border-black font-medium text-center">
                {i + 1}
              </p>
              <p className="border-r-2 border-black font-medium text-center">
                {formatDateSafe(data?.Trans_Date)}
              </p>
              <p className="border-r-2 border-black font-medium text-center">
                {data?.Particular ?? ""}
              </p>
              <p className="border-r-2 border-black font-medium text-center">
                {Number(data?.Disburse) > 0
                  ? money(data?.Disburse)
                  : money(data?.Principal_paid)}
              </p>
              <p className="border-r-2 border-black font-medium text-center">
                {Number(data?.Disburse) > 0 ? "" : money(data?.Intt_Refund)}
              </p>
              <p className="border-r-2 border-black font-medium text-center">
                {money(data?.Balance)}
              </p>
              <p className="border-r-2 border-black font-medium text-center">
                {money(data?.Due_Intt)}
              </p>
            </div>
            <div
              className={cn("w-full hidden", {
                block: i === pageParameter?.Line_No_Fst_Page - 1,
              })}
              style={{
                height: `calc(${pageParameter?.Mid_Gap}*16px)`,
              }}
            />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const PassbookPrintPreviewDialog = ({
  open,
  onOpenChange,
  showPage,
  pageData,
  pageParameter,
  firstPageRef,
  transPageRef,
  generateFirstPagePDF,
  generateTransPagePDF,
  transPrintData,
  blankLinesCount,
  skipDataLength,
  totalLinesPerPage,
}) => {
  const { t } = useTranslation();
  const isFirstPage = showPage === "FIRST";
  const isTransPage = showPage === "TRANS";
  const hasData = Array.isArray(pageData) && pageData.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl max-h-[90dvh] flex flex-col overflow-hidden">
        <div className="text-xl font-bold mb-4">Passbook Print Preview</div>
        <div className="flex-1 w-full p-4 border border-default-200 rounded-md overflow-y-auto max-h-[65vh]">
          <div className="flex justify-center w-full">
            {isFirstPage && hasData ? (
              <FirstPagePrint
                pageParameter={pageParameter}
                pageData={pageData}
                printRef={firstPageRef}
                t={t}
              />
            ) : isTransPage && hasData ? (
              <TransPagePrint
                pageParameter={pageParameter}
                transPrintData={transPrintData}
                blankLinesCount={blankLinesCount}
                skipDataLength={skipDataLength}
                totalLinesPerPage={totalLinesPerPage}
                printRef={transPageRef}
                t={t}
              />
            ) : (
              <div className="py-10 text-center text-gray-500">
                No preview data available
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-32"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              if (isFirstPage) generateFirstPagePDF();
              else if (isTransPage) generateTransPagePDF();
            }}
            className="w-full sm:w-32"
            disabled={!hasData}
          >
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PassbookPrintPreviewDialog;
