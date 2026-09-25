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

const columnsFor = (t) => [
  { title: label(t, "investment.print.slNo", "SL. NO."), w: 12, align: "center", key: "sl" },
  { title: label(t, "investment.print.openingDate", "OPENING DATE"), w: 22, align: "center", key: "date" },
  { title: label(t, "investment.print.bankName", "BANK NAME"), w: 40, align: "left", key: "name" },
  { title: label(t, "investment.print.accountNo", "ACCOUNT NO."), w: 24, align: "center", key: "acc" },
  { title: label(t, "investment.print.accountType", "ACCOUNT TYPE"), w: 22, align: "center", key: "type" },
  { title: label(t, "investment.print.invest", "INVEST"), w: 22, align: "right", key: "invest" },
  { title: label(t, "investment.print.roi", "ROI"), w: 14, align: "center", key: "roi" },
  { title: label(t, "investment.print.matureDate", "MATURE DATE"), w: 22, align: "center", key: "mature" },
  { title: label(t, "investment.print.provIntt", "PROV. INTT"), w: 20, align: "right", key: "intt" },
];

const flattenGroups = (groups = [], t) => {
  const rows = [];
  const glLabel = label(t, "common.gl", "GL");

  groups.forEach((group) => {
    if (group?.isGrandTotal) return;
    const ledger = group?.transactions?.[0]?.Ledger_Name || "";
    rows.push({ kind: "banner", text: ledger ? `${glLabel} - ${ledger}` : "" });
    (group?.transactions || []).forEach((txn, index) => {
      rows.push({
        kind: "cells",
        cells: {
          sl: String(index + 1),
          date: day(txn?.Opening_Date),
          name: txn?.Bank_Name || "",
          acc: txn?.Account_No || "",
          type: txn?.Acct_Type || "",
          invest: money(txn?.Invest_Amt),
          roi: txn?.Roi ?? "",
          mature: day(txn?.Mature_Date),
          intt: money(txn?.Prov_Intt),
        },
      });
    });
    rows.push({
      kind: "total",
      label: label(t, "investment.subTotal", "Sub Total"),
      invest: money(group?.subtotalInvest),
      intt: money(group?.subtotalProvIntt),
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      kind: "total",
      label: label(t, "investment.grandTotal", "Grand Total"),
      invest: money(grand.grandTotalInvest),
      intt: money(grand.grandTotalProvIntt),
    });
  }
  return rows;
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

export const downloadInvestmentReportPdf = async ({
  showData,
  tableData,
  fromDate,
  toDate,
  docTitle,
  t,
  onProgress,
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const range = `${day(fromDate)} ${label(t, "investment.to", "To")} ${day(toDate)}`;
  const meta = {
    orgName: getCookieData("userOrgName") || "",
    branchName: getCookieData("userBranchName") || "",
    address: getCookieData("userOrgAddress") || "",
    regNo: getCookieData("userOrgRegistration") || "",
    userName: getCookieData("userName") || "",
    stamp: format(new Date(), "dd-MM-yyyy hh:mm:ss a"),
    title: `${label(t, "investment.detailedListFrom", "Investment Detailed List From")} ${range}`,
    generatedBy: label(t, "investment.generatedBy", "Generated By :"),
    generatedOn: label(t, "investment.generatedOn", "Generated On :"),
    generatedNote: label(
      t,
      "investment.reportGeneratedByPrioSuite",
      "This report is generated by PrioSuite.",
    ),
  };

  const columns = columnsFor(t);
  const usable = columns.reduce((sum, col) => sum + col.w, 0);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const startX = Math.max(6, (pageW - usable) / 2);
  const rowH = 5.2;
  const headH = 7;
  const rows = showData === "114" ? flattenGroups(tableData, t) : [];

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

    if (row.kind === "banner") {
      ensureSpace(rowH);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.rect(startX, y, usable, rowH);
      const text = clipText(doc, row.text || "", usable - 4);
      doc.text(text, startX + usable / 2, y + 3.5, { align: "center" });
      y += rowH;
    } else if (row.kind === "total") {
      paintCells(
        columns.map((col) => {
          if (col.key === "name") return row.label;
          if (col.key === "invest") return row.invest;
          if (col.key === "intt") return row.intt;
          return "";
        }),
        true,
      );
    } else {
      paintCells(columns.map((col) => row.cells?.[col.key] ?? ""));
    }

    if (i > 0 && i % 250 === 0) {
      onProgress?.(i + 1, rows.length);
      await yieldUi();
    }
  }

  doc.save(`${docTitle}.pdf`);
};
