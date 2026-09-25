import jsPDF from "jspdf";
import { format } from "date-fns";
import getCookieData from "@/utils/getCookieData";

const money = (value) => {
  if (value == null || value === "") return "";
  const numeric = Number(value);
  return Number.isNaN(numeric) ? String(value) : numeric.toFixed(2);
};

const day = (value) => {
  if (!value) return "";
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return format(parsed, "dd-MM-yyyy");
};

const clipText = (doc, text, maxWidth) => {
  const value = String(text ?? "");
  if (!value) return "";
  if (doc.getTextWidth(value) <= maxWidth) return value;
  let end = value.length;
  while (end > 1 && doc.getTextWidth(`${value.slice(0, end)}…`) > maxWidth) {
    end -= 1;
  }
  return `${value.slice(0, end)}…`;
};

const yieldUi = () => new Promise((resolve) => setTimeout(resolve, 0));

const label = (t, key, fallback) => {
  if (typeof t !== "function") return fallback;
  const value = t(key);
  return value && value !== key ? value : fallback;
};

const drawPageChrome = (doc, meta) => {
  const pageW = doc.internal.pageSize.getWidth();
  let y = 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(String(meta.orgName || ""), pageW / 2, y, { align: "center" });
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  [meta.branchName, meta.address, meta.regNo].filter(Boolean).forEach((line) => {
    doc.text(String(line), pageW / 2, y, { align: "center" });
    y += 3.4;
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(meta.title, pageW / 2, y, { align: "center" });
  return y + 4;
};

const drawFooter = (doc, meta) => {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const y = pageH - 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(40);
  doc.text(`${meta.generatedBy} ${meta.userName || ""}`, 6, y);
  doc.setTextColor(90);
  doc.text(meta.generatedNote, pageW / 2, y, { align: "center" });
  doc.setTextColor(40);
  doc.text(`${meta.generatedOn} ${meta.stamp}`, pageW - 6, y, { align: "right" });
  doc.setTextColor(0);
};

const buildColumns = (showData, t) => {
  if (showData === "110") {
    return [
      { title: label(t, "loan.print.slNo", "SL. NO."), w: 12, align: "center", get: (_r, i) => String(i + 1) },
      { title: label(t, "loan.print.date", "DATE"), w: 22, align: "center", get: (r) => day(r?.Disb_Date) },
      { title: label(t, "loan.print.customerName", "CUSTOMER NAME"), w: 40, align: "left", get: (r) => r?.Full_Name },
      { title: label(t, "loan.print.guardianName", "GUARDIAN NAME"), w: 36, align: "left", get: (r) => r?.Relation_Name },
      { title: label(t, "loan.print.accountNo", "ACCOUNT NO."), w: 26, align: "center", get: (r) => r?.Account_No },
      { title: label(t, "loan.print.refAcNo", "REF. AC. NO."), w: 22, align: "center", get: (r) => r?.Ref_Ac_No },
      { title: label(t, "loan.print.disburse", "DISBURSE"), w: 24, align: "right", get: (r) => money(r?.Disb_Amt) },
      { title: label(t, "loan.print.share", "SHARE"), w: 22, align: "right", get: (r) => money(r?.Share_Amt) },
      { title: label(t, "loan.print.insAmt", "INS AMT"), w: 22, align: "right", get: (r) => money(r?.Ins_Amt) },
      { title: label(t, "loan.print.misAmt", "MIS AMT"), w: 22, align: "right", get: (r) => money(r?.Mis_Amt) },
      { title: label(t, "loan.print.netDisburse", "NET DISBURSE"), w: 37, align: "right", get: (r) => money(r?.Net_Disburse) },
    ];
  }

  if (showData === "111") {
    return [
      { title: label(t, "loan.print.slNo", "SL. NO."), w: 12, align: "center", key: "sl" },
      { title: label(t, "loan.print.customerName", "CUSTOMER NAME"), w: 46, align: "left", key: "name" },
      { title: label(t, "loan.print.guardianName", "GUARDIAN NAME"), w: 42, align: "left", key: "guardian" },
      { title: label(t, "loan.print.accountNo", "ACCOUNT NO."), w: 28, align: "center", key: "acc" },
      { title: label(t, "loan.print.refAcNo", "REF. AC. NO."), w: 24, align: "center", key: "ref" },
      { title: label(t, "loan.print.transMode", "TRANS. MODE"), w: 28, align: "center", key: "mode" },
      { title: label(t, "loan.print.principal", "PRINCIPAL"), w: 35, align: "right", key: "prn" },
      { title: label(t, "loan.print.interest", "INTEREST"), w: 35, align: "right", key: "intt" },
      { title: label(t, "loan.print.amount", "AMOUNT"), w: 35, align: "right", key: "amt" },
    ];
  }

  return [
    { title: label(t, "loan.slUpper", "SL"), w: 10, align: "center", get: (_r, i) => String(i + 1) },
    { title: label(t, "loan.print.customerName", "CUSTOMER"), w: 34, align: "left", get: (r) => r?.Full_Name },
    { title: label(t, "loan.print.guardianName", "GUARDIAN"), w: 32, align: "left", get: (r) => r?.Guardian_Name || r?.Relation_Name },
    { title: label(t, "loan.accountNoShort", "A/C"), w: 22, align: "center", get: (r) => r?.Account_No },
    { title: label(t, "loan.loanDate", "LOAN DATE"), w: 20, align: "center", get: (r) => day(r?.Disb_Date) },
    { title: label(t, "loan.opening", "OPENING"), w: 20, align: "right", get: (r) => money(r?.Opening_Balance ?? r?.Opening) },
    { title: label(t, "loan.print.disburse", "DISBURSE"), w: 20, align: "right", get: (r) => money(r?.Disb_Amt ?? r?.Disb) },
    { title: `${label(t, "loan.repayment", "REPAY")} ${label(t, "loan.print.principal", "PRN")}`, w: 20, align: "right", get: (r) => money(r?.Principal_Paid ?? r?.Paid_Prn) },
    { title: `${label(t, "loan.repayment", "REPAY")} ${label(t, "loan.print.interest", "INTT")}`, w: 20, align: "right", get: (r) => money(r?.Interest_Paid ?? r?.Paid_Intt) },
    { title: `${label(t, "loan.outstanding", "OUTS")} ${label(t, "loan.current", "CURR")}`, w: 22, align: "right", get: (r) => money(r?.Current_Principal ?? r?.Curr_Outs) },
    { title: `${label(t, "loan.outstanding", "OUTS")} ${label(t, "loan.overdue", "OD")}`, w: 22, align: "right", get: (r) => money(r?.Overdue_Principal ?? r?.OD_Outs) },
    { title: `${label(t, "loan.outsInterest", "INTT")} ${label(t, "loan.current", "CURR")}`, w: 22, align: "right", get: (r) => money(r?.Current_Interest ?? r?.Curr_Intt) },
    { title: `${label(t, "loan.outsInterest", "INTT")} ${label(t, "loan.overdue", "OD")}`, w: 21, align: "right", get: (r) => money(r?.Overdue_Interest ?? r?.OD_Intt) },
  ];
};

const flattenRepayments = (groups = []) => {
  const rows = [];
  groups.forEach((group) => {
    if (group?.isGrandTotal) return;
    rows.push({ kind: "banner", text: group?.date ? day(group.date) : "" });
    (group?.transactions || []).forEach((txn, index) => {
      rows.push({
        kind: "cells",
        cells: {
          sl: String(index + 1),
          name: txn?.Full_Name || "",
          guardian: txn?.Relation_Name || "",
          acc: txn?.Account_No || "",
          ref: txn?.Ref_Ac_No || "",
          mode: txn?.Trans_Type || "",
          prn: money(txn?.Paid_Prn),
          intt: money(txn?.Paid_Intt),
          amt: money(txn?.Tot_Amt),
        },
      });
    });
    rows.push({
      kind: "total",
      label: "Sub Total",
      prn: money(group?.subtotalPrincipal),
      intt: money(group?.subtotalInterest),
      amt: money(group?.subtotalAmount),
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      kind: "total",
      label: "Grand Total",
      bold: true,
      prn: money(grand.grandTotalPrincipal),
      intt: money(grand.grandTotalInterest),
      amt: money(grand.grandTotalAmount),
    });
  }
  return rows;
};

export const downloadLoanReportPdf = async ({
  showData,
  tableData,
  fromDate,
  toDate,
  docTitle,
  t,
  totals,
  onProgress,
}) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const range = `${day(fromDate)} To ${day(toDate)}`;
  const titles = {
    110: `${label(t, "loan.loanDisburseRegisterFrom", "Loan Disburse Register From")} ${range}`,
    111: `${label(t, "loan.depositTransactionRegisterFrom", "Loan Repayment Register From")} ${range}`,
    112: `${label(t, "loan.loanDetailedListFrom", "Loan Detailed List From")} ${range}`,
  };

  const meta = {
    orgName: getCookieData("userOrgName") || "",
    branchName: getCookieData("userBranchName") || "",
    address: getCookieData("userOrgAddress") || "",
    regNo: getCookieData("userOrgRegistration") || "",
    userName: getCookieData("userName") || "",
    stamp: format(new Date(), "dd-MM-yyyy hh:mm:ss a"),
    title: titles[showData] || "Loan Report",
    generatedBy: label(t, "loan.generatedByColon", "Generated By:"),
    generatedOn: label(t, "loan.generatedOnColon", "Generated On:"),
    generatedNote: label(
      t,
      "loan.reportGeneratedByPrioSuite",
      "This report is generated by PrioSuite.",
    ),
  };

  const columns = buildColumns(showData, t);
  const usable = columns.reduce((sum, col) => sum + col.w, 0);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const startX = Math.max(6, (pageW - usable) / 2);
  const rowH = 5.2;
  const headH = 7;
  const rows = showData === "111" ? flattenRepayments(tableData) : tableData || [];

  const drawHead = (y) => {
    let x = startX;
    doc.setFillColor(243, 244, 246);
    doc.rect(startX, y, usable, headH, "F");
    doc.setDrawColor(0);
    doc.rect(startX, y, usable, headH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    columns.forEach((col) => {
      doc.line(x, y, x, y + headH);
      const text = clipText(doc, col.title, col.w - 1.2);
      const textX =
        col.align === "right"
          ? x + col.w - 0.7
          : col.align === "center"
            ? x + col.w / 2
            : x + 0.7;
      doc.text(text, textX, y + 4.4, {
        align: col.align === "left" ? "left" : col.align,
      });
      x += col.w;
    });
    doc.line(startX + usable, y, startX + usable, y + headH);
    return y + headH;
  };

  let y = drawPageChrome(doc, meta);
  y = drawHead(y);
  drawFooter(doc, meta);

  const newPage = () => {
    doc.addPage();
    y = drawPageChrome(doc, meta);
    y = drawHead(y);
    drawFooter(doc, meta);
  };

  const ensureSpace = (height) => {
    if (y + height > pageH - 10) newPage();
  };

  const paintCells = (values, bold = false) => {
    ensureSpace(rowH);
    let x = startX;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(6.2);
    doc.rect(startX, y, usable, rowH);
    columns.forEach((col, index) => {
      doc.line(x, y, x, y + rowH);
      const text = clipText(doc, values[index] ?? "", col.w - 1.1);
      const textX =
        col.align === "right"
          ? x + col.w - 0.6
          : col.align === "center"
            ? x + col.w / 2
            : x + 0.6;
      doc.text(text, textX, y + 3.5, {
        align: col.align === "left" ? "left" : col.align,
      });
      x += col.w;
    });
    doc.line(startX + usable, y, startX + usable, y + rowH);
    y += rowH;
  };

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];

    if (showData === "111") {
      if (row.kind === "banner") {
        ensureSpace(rowH);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.rect(startX, y, usable, rowH);
        doc.text(String(row.text || ""), startX + 2, y + 3.5);
        y += rowH;
      } else if (row.kind === "total") {
        paintCells(
          columns.map((col) => {
            if (col.key === "name") return row.label;
            if (col.key === "prn") return row.prn;
            if (col.key === "intt") return row.intt;
            if (col.key === "amt") return row.amt;
            return "";
          }),
          true,
        );
      } else {
        paintCells(columns.map((col) => row.cells?.[col.key] ?? ""));
      }
    } else {
      paintCells(columns.map((col) => col.get?.(row, i) ?? ""));
    }

    if (i > 0 && i % 250 === 0) {
      onProgress?.(i + 1, rows.length);
      await yieldUi();
    }
  }

  if (showData === "110") {
    paintCells(
      [
        label(t, "loan.total", "Total"),
        "",
        "",
        "",
        "",
        "",
        money(totals?.totalDisburseAmount),
        money(totals?.totalShareAmount),
        money(totals?.totalInsAmount),
        money(totals?.totalMisAmount),
        money(totals?.totalNetDisburse),
      ],
      true,
    );
  } else if (showData === "112") {
    paintCells(
      [
        label(t, "loan.total", "Total"),
        "",
        "",
        "",
        "",
        money(totals?.totalOpening),
        money(totals?.totalDisburse),
        money(totals?.totalPrn),
        money(totals?.totalIntt),
        money(totals?.totalCurrOuts),
        money(totals?.totalOdOuts),
        money(totals?.totalCurrIntt),
        money(totals?.totalOdIntt),
      ],
      true,
    );
  }

  doc.save(`${docTitle}.pdf`);
};
