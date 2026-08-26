"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LINE_HEIGHT_PX = 16;
const linesToPx = (lines) => `${lines * LINE_HEIGHT_PX}px`;
const fmtAmt = (v) => (v == null ? "" : v.toFixed(2));
const fmtDate = (v) => {
  if (!v) return "";
  try {
    return format(new Date(v), "dd-MM-yyyy");
  } catch {
    return v;
  }
};
const formatDateToUppercase = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return format(d, "dd-MMM-yyyy").toUpperCase();
  } catch (e) {
    return dateStr;
  }
};

const safeArray = (len) => {
  const safeLen = Math.min(
    Math.max(0, isNaN(Number(len)) ? 0 : Math.floor(Number(len))),
    1000,
  );
  return Array.from({ length: safeLen });
};

// ─── First Page Preview ───────────────────────────────────────────────────────
const FirstPagePrint = ({ param, frontPageDetail, printRef }) => {
  if (!frontPageDetail) return null;

  const formattedOpeningDate = frontPageDetail.Opening_Date
    ? formatDateToUppercase(frontPageDetail.Opening_Date)
    : "";
  const formattedMaturityDate = frontPageDetail.Maturity_Date
    ? formatDateToUppercase(frontPageDetail.Maturity_Date)
    : "";

  const hasJoint =
    frontPageDetail.Joint_Holders && frontPageDetail.Joint_Holders.length > 0;
  const isJointMode =
    frontPageDetail.Operation_Mode?.toLowerCase().includes("joint");

  const principalVal =
    frontPageDetail.Principal_Amount ??
    frontPageDetail.Prn_Amt ??
    frontPageDetail.Principal ??
    frontPageDetail.Deposit_Amount;

  const societyRef = `${frontPageDetail.Account_No || ""}${frontPageDetail.Ref_Ac ? `  (Manual Ac. No: ${frontPageDetail.Ref_Ac})` : ""}`;

  const fmtCurrency = (val, suffix = "") => {
    if (val == null || val === "") return "";
    const num = parseFloat(val);
    if (isNaN(num)) return val + suffix;
    return `₹ ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
  };

  const renderField = (label, value) => {
    if (value === undefined || value === null) value = "";
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2.5fr 4.5fr",
          paddingTop: "2px",
          paddingBottom: "2px",
          fontSize: "12px",
          lineHeight: "1.625",
        }}
      >
        <span
          className="font-semibold text-black"
          style={{
            whiteSpace: "nowrap",
            display: "flex",
            justifyContent: "space-between",
            color: "#000",
          }}
        >
          {label}
          <span style={{ marginLeft: "auto", paddingRight: "4px" }}>:</span>
        </span>
        <span
          className="text-black"
          style={{
            paddingLeft: "12px",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            color: "#000",
          }}
        >
          {value}
        </span>
      </div>
    );
  };

  return (
    <div
      ref={printRef}
      className="flex flex-col w-full overflow-visible shrink-0 relative"
      style={{
        width: `${param.Pass_W}cm`,
        minHeight: `${param.Pass_H}cm`,
        marginLeft: `1cm`,
        fontFamily: "Lucida Console, monospace",
      }}
    >
      {/* Top margin spacer (Visual on preview, empty on print) */}
      <div className="flex flex-col shrink-0 print:hidden">
        {safeArray(param.First_Top || 0).map((_, idx) => (
          <div
            key={`top-margin-${idx}`}
            // className="border-b border-dashed border-gray-200 text-gray-300 text-[9px] flex items-center pl-4"
            style={{
              height: linesToPx(1),
            }}
          >
            {/* --- Top Margin Line {idx + 1} --- */}
          </div>
        ))}
      </div>
      <div className="hidden print:flex flex-col shrink-0">
        {safeArray(param.First_Top || 0).map((_, idx) => (
          <div
            key={`top-margin-print-${idx}`}
            style={{
              height: linesToPx(1),
            }}
          />
        ))}
      </div>
      {/* Organisation Header */}
      <div className="text-center mb-6 shrink-0">
        <h1 className="text-[16px] font-bold tracking-wide uppercase">
          {frontPageDetail.Organisation_Name || ""}
        </h1>
        {/* {frontPageDetail.Reg_No && (
          <p className="text-[11px] text-gray-500">
            Reg No: {frontPageDetail.Reg_No}
          </p>
        )}
        {frontPageDetail.Org_Address && (
          <p className="text-[11px] text-gray-500">
            {frontPageDetail.Org_Address}
          </p>
        )} */}
      </div>

      {/* Two Column Layout (Left, Right) using Flexbox */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left Column */}
        <div
          style={{
            width: "48%",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {renderField("BRANCH NAME AND CODE", frontPageDetail.Branch_Name)}
          {renderField("ACCOUNT TYPE", frontPageDetail.Product_Name)}
          {renderField("CUSTOMER NAME", frontPageDetail.Member_Name)}
          {renderField(
            "ACCOUNT NO",
            `${frontPageDetail.Account_No || ""}${frontPageDetail.Ref_Ac ? `  (Manual Ac. No: ${frontPageDetail.Ref_Ac})` : ""}`,
          )}
          {renderField("CIF", frontPageDetail.Member_Code)}
          {renderField("GUARDIAN NAME", frontPageDetail.Rel_Name)}
          {renderField(
            "ADDRESS",
            frontPageDetail.Address?.trim()?.replace(/,+\s*$/, ""),
          )}
          {/* {renderField("CONTACT NO", frontPageDetail.Mobile_No)}

          {renderField("OPENING DATE", formattedOpeningDate)}
          {renderField("MODE OF OPERATION", frontPageDetail.Operation_Mode)}
          {renderField("NOMINEE REGISTERED", frontPageDetail.Nomination)} */}
        </div>

        {/* Right Column */}
        <div
          style={{
            width: "48%",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {renderField("CONTACT NO", frontPageDetail.Mobile_No)}

          {renderField("OPENING DATE", formattedOpeningDate)}
          {renderField("MODE OF OPERATION", frontPageDetail.Operation_Mode)}
          {renderField("NOMINEE REGISTERED", frontPageDetail.Nomination)}
          {/* Joint Account Details Section */}
          {(hasJoint || isJointMode) && (
            <div
              style={{
                // marginTop: "8px",
                // borderTop: "1px dashed #e5e7eb",
                // paddingTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <p className="font-bold text-[12px] text-gray-800 mb-1">
                Other Account Holder
              </p>
              {frontPageDetail.Joint_Holders?.map((jh, idx) => (
                <div
                  key={idx}
                  className="text-[12px] text-gray-900"
                  style={{ paddingLeft: "8px" }}
                >
                  {idx + 1}) {jh.Member_Name} ({jh.Member_Code})
                </div>
              ))}
            </div>
          )}

          {/* Deposit Account Details Section */}
          {frontPageDetail.Maturity_Date && (
            <div
              style={{
                // marginTop: "8px",
                // borderTop: "1px dashed #e5e7eb",
                // paddingTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {frontPageDetail.Installment_Amount != null &&
                frontPageDetail.Installment_Amount !== "" &&
                renderField(
                  "INSTALLMENT AMOUNT",
                  fmtCurrency(frontPageDetail.Installment_Amount, " per Month"),
                )}
              {frontPageDetail.Roi != null &&
                renderField(
                  "RATE OF INTEREST (ROI)",
                  `${frontPageDetail.Roi}% p.a.`,
                )}
              {renderField("MATURITY DATE", formattedMaturityDate)}

              {frontPageDetail.Maturity_Amount != null &&
                frontPageDetail.Maturity_Amount !== "" &&
                renderField(
                  "MATURITY AMOUNT",
                  fmtCurrency(frontPageDetail.Maturity_Amount),
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Inner Page Preview ───────────────────────────────────────────────────
const InnerPagePrint = ({
  param,
  data,
  showLine,
  printRef,
  onLastSlChange,
}) => {
  const isPassHeader =
    getCookieData("is_pass_header") === "1" ||
    getCookieData("is_pass_header") === 1;

  const upperRowsCount = param?.Up_Line || 0;
  const lowerRowsCount = param?.Dn_Line || 0;

  const rowsPerPage = Math.max(upperRowsCount + lowerRowsCount, 1);

  const blankCount = Math.max(showLine - 1, 0);
  const blankRows = safeArray(blankCount).map(() => "");

  // Prepare transaction rows
  const transactionStrings =
    data?.map((item) => {
      if (!item) return "";
      const deposit = parseFloat(item.Deposit || item.deposit || 0);
      const withdrawal = parseFloat(
        item.Withdrwan || item.withdrawal || item.Withdrawn || 0,
      );
      const balance = parseFloat(item.Balance || item.balance || 0);

      const particulars =
        item.Particular || item.Particulars || item.particulars || "";
      const transDate = item.Trans_Date || item.trans_date || "";

      return `${fmtDate(transDate)}|${particulars}|${fmtAmt(
        deposit,
      )}|${fmtAmt(withdrawal)}|${fmtAmt(balance)}`;
    }) || [];

  const fullList = [...blankRows, ...transactionStrings];

  // Pagination
  const pages = [];
  if (rowsPerPage > 0) {
    for (let i = 0; i < fullList.length; i += rowsPerPage) {
      pages.push(fullList.slice(i, i + rowsPerPage));
    }
  }

  const skipPages = Math.floor(blankCount / rowsPerPage);
  const visiblePages = pages.slice(skipPages);

  const lastSlValue =
    visiblePages.length > 0
      ? visiblePages[visiblePages.length - 1].length.toString()
      : "";

  // Last serial callback
  useEffect(() => {
    if (lastSlValue) {
      onLastSlChange?.(lastSlValue);
    }
  }, [lastSlValue, onLastSlChange]);

  const hasVisibleLines = (lines = []) =>
    Array.isArray(lines) &&
    lines.some((line) => line != null && String(line).trim() !== "");

  const renderColumns = (
    slVal,
    dateVal,
    partVal,
    wdrVal,
    depVal,
    balVal,
    isHeader = false,
    keyVal = undefined,
    isEmpty = false,
  ) => {
    const cellStyle = (
      width,
      align = "center",
      hasRight = true,
      hasLeft = false,
    ) => ({
      width,
      flexShrink: 0,
      flexGrow: 0,
      fontSize: isHeader ? "12px" : "11px",
      fontFamily: "Lucida Console, monospace",
      textAlign: align,
      paddingLeft: !isHeader && align === "left" ? "12px" : "0px",
      paddingRight: !isHeader && align === "right" ? "8px" : "0px",
      boxSizing: "border-box",
      display: "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      lineHeight: linesToPx(1),
      borderLeft:
        isPassHeader && !isEmpty && hasLeft ? "1px solid #000" : undefined,
      borderRight:
        isPassHeader && !isEmpty && hasRight ? "1px solid #000" : undefined,
    });

    return (
      <div
        key={keyVal}
        className={cn(isEmpty && "print-no-border")}
        style={{
          display: "flex",
          width: "19cm",
          height: linesToPx(1),
          fontFamily: "Lucida Console, monospace",
          boxSizing: "border-box",
          ...(isHeader && !isEmpty
            ? {
                borderTop: "1px solid #000",
                borderBottom: "1px solid #000",
                fontWeight: "bold",
              }
            : {}),
        }}
      >
        <span
          className={cn(isEmpty && "print-no-border")}
          style={cellStyle(".8cm", "center", true, true)}
        >
          {slVal}
        </span>
        <span
          className={cn(isEmpty && "print-no-border")}
          style={cellStyle("2.0cm", "center", true, false)}
        >
          {dateVal}
        </span>
        <span
          className={cn(isEmpty && "print-no-border")}
          style={cellStyle("6.5cm", isHeader ? "center" : "left", true, false)}
        >
          {partVal}
        </span>
        <span
          className={cn(isEmpty && "print-no-border")}
          style={cellStyle("3.1cm", isHeader ? "center" : "right", true, false)}
        >
          {wdrVal}
        </span>
        <span
          className={cn(isEmpty && "print-no-border")}
          style={cellStyle("3.1cm", isHeader ? "center" : "right", true, false)}
        >
          {depVal}
        </span>
        <span
          className={cn(isEmpty && "print-no-border")}
          style={cellStyle("3.5cm", isHeader ? "center" : "right", true, false)}
        >
          {balVal}
        </span>
      </div>
    );
  };

  // Render each row
  const renderLine = (line, i, section) => {
    const sl =
      section === "upper"
        ? i + 1
        : (isPassHeader ? upperRowsCount : param?.Up_Line || 0) + i + 1;

    if (!line) {
      return (
        <div
          key={`empty-${section}-${i}`}
          className="relative"
          style={{ height: linesToPx(1) }}
        >
          {renderColumns(
            "",
            "",
            "",
            "",
            "",
            "",
            false,
            `empty-cols-${section}-${i}`,
            true,
          )}
          {/* <span
            className="print:hidden absolute left-2 top-0"
            style={{ fontSize: "10px", color: "red", pointerEvents: "none" }}
          >
            ----- line no({sl})-----
          </span> */}
        </div>
      );
    }

    const parts = line.split("|");
    const [date, particulars, deposit, withdrawal, balance] = parts.map(
      (p) => p?.trim() || "",
    );

    return renderColumns(
      sl,
      date,
      particulars,
      withdrawal,
      deposit,
      balance,
      false,
      `${section}-${i}`,
    );
  };

  return (
    <div
      ref={printRef}
      className="flex flex-col"
      style={{
        width: `${param.Pass_W}cm`,
        marginLeft: "0.5cm",

        fontFamily: "Lucida Console, monospace",
      }}
    >
      <style>{`
        @media print {
          .print-no-border {
            border: none !important;
            border-top: none !important;
            border-bottom: none !important;
            border-left: none !important;
            border-right: none !important;
          }
        }
      `}</style>
      {visiblePages.map((pageRows, pageIdx) => {
        const upperPageRows = pageRows.slice(0, upperRowsCount);
        const lowerPageRows = pageRows.slice(
          isPassHeader ? upperRowsCount : param.Up_Line,
        );
        const hasUpperData = hasVisibleLines(upperPageRows);
        const hasLowerData = hasVisibleLines(lowerPageRows);
        const showUpperHeader =
          isPassHeader && (pageIdx > 0 || showLine === 1) && hasUpperData;
        const showLowerHeader =
          isPassHeader &&
          hasLowerData &&
          (pageIdx > 0 || showLine <= upperRowsCount + 1);

        return (
          <div
            key={pageIdx}
            style={{
              minHeight: `${param.Pass_H}cm`,
              pageBreakAfter: "always",
              breakAfter: "page",
              boxSizing: "border-box",
              paddingTop: 0,
              overflow: "visible",
              transform: "translateY(0.01px)",
            }}
            className="flex flex-col w-full shrink-0"
          >
            {/* Top margin */}
            <div className="flex flex-col shrink-0">
              {safeArray(
                pageIdx === 0 && showLine > upperRowsCount
                  ? (param.Next_Gap || 0) +
                      (param.Mid_Gap || 0) +
                      (param.Up_Line || 0) +
                      (isPassHeader ? 1 : 0)
                  : param.Next_Gap || 0,
              ).map((_, idx) => (
                <div
                  key={`top-margin-${idx}`}
                  style={{
                    height: linesToPx(1),
                  }}
                />
              ))}
            </div>

            {/* Upper section */}
            {!(pageIdx === 0 && showLine > upperRowsCount) && (
              <div
                style={{
                  minHeight: linesToPx(param.Up_Line),
                }}
                className="flex flex-col shrink-0"
              >
                {showUpperHeader
                  ? renderColumns(
                      "SL",
                      "DATE",
                      "PARTICULARS",
                      "WITHDRAWAL",
                      "DEPOSIT",
                      "BALANCE",
                      true,
                      `header-upper-${pageIdx}`,
                    )
                  : isPassHeader
                    ? renderColumns(
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        true,
                        `header-upper-placeholder-${pageIdx}`,
                        true,
                      )
                    : null}
                {upperPageRows.map((line, i) => renderLine(line, i, "upper"))}
                {showUpperHeader &&
                  safeArray(
                    Math.max(0, upperRowsCount - upperPageRows.length),
                  ).map((_, idx) => (
                    <div
                      key={`empty-upper-fill-${pageIdx}-${idx}`}
                      style={{
                        height: linesToPx(1),
                        fontFamily: "Lucida Console, monospace",
                        boxSizing: "border-box",
                      }}
                    />
                  ))}
              </div>
            )}

            {/* Middle gap */}
            {!(pageIdx === 0 && showLine > upperRowsCount) &&
              (!isPassHeader || hasLowerData) && (
                <div className="flex flex-col shrink-0">
                  {safeArray(param.Mid_Gap || 0).map((_, idx) => (
                    <div
                      key={`mid-gap-${idx}`}
                      style={{
                        height: linesToPx(1),
                        fontSize: "10px",
                        color: "#aaa",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "10px",
                        boxSizing: "border-box",
                      }}
                    >
                      {/* --- Mid Gap Line {idx + 1} --- */}
                    </div>
                  ))}
                </div>
              )}

            {/* Lower section */}
            {(!isPassHeader || hasLowerData) && (
              <div
                style={{
                  minHeight: linesToPx(param.Dn_Line),
                }}
                className="flex flex-col shrink-0"
              >
                {showLowerHeader
                  ? renderColumns(
                      "SL",
                      "DATE",
                      "PARTICULARS",
                      "WITHDRAWAL",
                      "DEPOSIT",
                      "BALANCE",
                      true,
                      `header-lower-${pageIdx}`,
                    )
                  : isPassHeader
                    ? renderColumns(
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        true,
                        `header-lower-placeholder-${pageIdx}`,
                        true,
                      )
                    : null}
                {lowerPageRows.map((line, i) => renderLine(line, i, "lower"))}
                {showLowerHeader &&
                  safeArray(
                    Math.max(0, lowerRowsCount - lowerPageRows.length),
                  ).map((_, idx) => (
                    <div
                      key={`empty-lower-fill-${pageIdx}-${idx}`}
                      style={{
                        height: linesToPx(1),
                        fontFamily: "Lucida Console, monospace",
                        boxSizing: "border-box",
                      }}
                    />
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PassbookPrintPreviewDialog = ({
  open,
  onOpenChange,
  showPage,
  frontPageDetail,
  pageData,
  pageParameter,
  firstPageRef,
  transPageRef,
  generateFirstPagePDF,
  generateTransPagePDF,
  showLine,
}) => {
  const [lastSlNumber, setLastSlNumber] = useState("");

  const normalizedPage = showPage?.toUpperCase();
  const isFirstPage = normalizedPage === "FIRST";
  const isTransPage = normalizedPage === "TRANS" || normalizedPage === "INNER";
  const showLineNum = showLine ? Number(showLine) : 1;

  // Resolve layout parameters
  const currentParam = {
    Pass_H: pageParameter?.Page_Height,
    Pass_W: pageParameter?.Page_Width,
    First_Top: pageParameter?.Fst_Page_Top,
    Up_Line: pageParameter?.Line_No_Fst_Page,
    Dn_Line: pageParameter?.Line_No_Scnd_Page,
    Mid_Gap: pageParameter?.Mid_Gap,
    Next_Gap: pageParameter?.Next_Page_Gap,
  };

  const rawFirstPageData =
    isFirstPage && frontPageDetail
      ? [
          frontPageDetail.Organisation_Name || "",
          frontPageDetail.Reg_No || "",
          frontPageDetail.Org_Address || "",
          // "",
          `BRANCH NAME AND CODE : ${frontPageDetail.Branch_Name || ""}`,
          `ACCOUNT TYPE : ${frontPageDetail.Product_Name || ""}`,
          `CUSTOMER NAME : ${frontPageDetail.Member_Name || ""}`,
          `CIF : ${frontPageDetail.Member_Code || ""}`,
          `GUARDIAN NAME : ${frontPageDetail.Rel_Name || ""}`,
          `ADDRESS : ${frontPageDetail.Address?.trim()?.replace(/,+\s*$/, "") || ""}`,
          `CONTACT NO : ${frontPageDetail.Mobile_No || ""}`,
          `SOCIETY REFERENCE NO : ${frontPageDetail.Account_No || ""}${
            frontPageDetail.Ref_Ac
              ? "  (Manual Ac. No: " + frontPageDetail.Ref_Ac + ")"
              : ""
          }`,
          `ACCOUNT OPENING DATE : ${frontPageDetail.Opening_Date ? formatDateToUppercase(frontPageDetail.Opening_Date) : ""}`,
          ...(frontPageDetail.Maturity_Date
            ? [
                ...(frontPageDetail.Roi != null
                  ? [`ROI : ${frontPageDetail.Roi}%`]
                  : []),
                `MATURITY DATE : ${formatDateToUppercase(frontPageDetail.Maturity_Date)}`,
                ...(frontPageDetail.Installment_Amount != null
                  ? [
                      `INSTALLMENT AMOUNT : ${frontPageDetail.Installment_Amount}`,
                    ]
                  : []),
                ...(frontPageDetail.Maturity_Amount != null
                  ? [`MATURITY AMOUNT : ${frontPageDetail.Maturity_Amount}`]
                  : []),
              ]
            : []),
          `MODE OF OPERATION : ${frontPageDetail.Operation_Mode || ""}`,
          ...(frontPageDetail.Joint_Holders &&
          frontPageDetail.Joint_Holders.length > 0
            ? [
                `OTHER A/C HOLDERS : 1. ${frontPageDetail.Joint_Holders[0].Member_Name} (${frontPageDetail.Joint_Holders[0].Member_Code})`,
                ...frontPageDetail.Joint_Holders.slice(1).map(
                  (jh, idx) =>
                    `                    ${idx + 2}. ${jh.Member_Name} (${jh.Member_Code})`,
                ),
              ]
            : [`OTHER A/C HOLDERS : `]),
          `NOMINEE REGISTRED : ${frontPageDetail.Nomination || ""}`,
        ]
      : [];

  const hasData = isFirstPage
    ? rawFirstPageData.length > 0
    : isTransPage
      ? Array.isArray(pageData) && pageData.length > 0
      : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl max-h-[90dvh] flex flex-col overflow-hidden">
        <div className="text-xl font-bold mb-4">Passbook Print Preview</div>
        <div className="flex-1 w-full p-4 border border-default-200 rounded-md overflow-y-auto max-h-[65vh]">
          <div className="flex justify-center w-full">
            {isFirstPage && frontPageDetail ? (
              <FirstPagePrint
                param={currentParam}
                frontPageDetail={frontPageDetail}
                printRef={firstPageRef}
              />
            ) : isTransPage && pageData?.length > 0 ? (
              <InnerPagePrint
                param={currentParam}
                data={pageData}
                showLine={showLineNum}
                printRef={transPageRef}
                onLastSlChange={setLastSlNumber}
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
              else if (isTransPage) {
                generateTransPagePDF();
              }
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
