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

const LANDSCAPE = new Set(["101", "103"]);

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

const identityColumns = (t, amountTitle, amountGet) => [
  { title: label(t, "membership.reports.print.slNo", "SL. NO."), w: 14, align: "center", get: (_r, i) => String(i + 1) },
  { title: label(t, "membership.reports.print.date", "DATE"), w: 24, align: "center", get: (r) => day(r?.Adm_Date) },
  { title: label(t, "membership.reports.print.memberType", "MEMBER TYPE"), w: 26, align: "center", get: (r) => r?.Member_Type },
  { title: label(t, "membership.reports.print.customerName", "CUSTOMER NAME"), w: 36, align: "left", get: (r) => r?.Full_Name },
  { title: label(t, "membership.reports.print.guardianName", "GUARDIAN NAME"), w: 34, align: "left", get: (r) => r?.Relation_Name },
  { title: label(t, "membership.reports.print.village", "VILLAGE"), w: 26, align: "left", get: (r) => r?.Village },
  { title: label(t, "membership.reports.print.lfNo", "L/F. NO."), w: 16, align: "center", get: (r) => r?.Ledg_Folio },
  { title: amountTitle, w: 22, align: "right", get: amountGet },
];

const buildColumns = (showData, t) => {
  if (showData === "100") {
    return identityColumns(
      t,
      label(t, "membership.reports.print.admFees", "ADM. FEES"),
      (r) => money(r?.Adm_Fees),
    );
  }

  if (showData === "102") {
    return identityColumns(
      t,
      label(t, "membership.reports.print.amount", "AMOUNT"),
      (r) => money(r?.Amount),
    );
  }

  if (showData === "104") {
    return identityColumns(
      t,
      label(t, "membership.reports.print.balance", "BALANCE"),
      (r) => money(r?.Balance),
    );
  }

  if (showData === "101") {
    return [
      { title: label(t, "membership.reports.print.slNo", "SL. NO."), w: 12, align: "center", key: "sl" },
      { title: label(t, "membership.reports.print.memberType", "MEMBER TYPE"), w: 26, align: "center", key: "type" },
      { title: label(t, "membership.reports.print.customerName", "CUSTOMER NAME"), w: 42, align: "left", key: "name" },
      { title: label(t, "membership.reports.print.guardianName", "GUARDIAN NAME"), w: 40, align: "left", key: "guardian" },
      { title: label(t, "membership.reports.print.village", "VILLAGE"), w: 32, align: "left", key: "village" },
      { title: label(t, "membership.reports.print.lfNo", "L/F. NO."), w: 18, align: "center", key: "lf" },
      { title: label(t, "membership.reports.print.transMode", "TRANS. MODE"), w: 24, align: "center", key: "mode" },
      { title: label(t, "membership.reports.print.noOfShare", "NO. OF SHARE"), w: 22, align: "center", key: "shares" },
      { title: label(t, "membership.reports.print.issue", "ISSUE"), w: 34.5, align: "right", key: "issue" },
      { title: label(t, "membership.reports.print.release", "RELEASE"), w: 34.5, align: "right", key: "release" },
    ];
  }

  return [
    { title: label(t, "membership.reports.print.slNo", "SL. NO."), w: 12, align: "center", get: (_r, i) => String(i + 1) },
    { title: label(t, "membership.reports.print.date", "DATE"), w: 22, align: "center", get: (r) => day(r?.Adm_Date) },
    { title: label(t, "membership.reports.print.memberType", "MEMBER TYPE"), w: 22, align: "center", get: (r) => r?.Member_Type },
    { title: label(t, "membership.reports.print.customerName", "CUSTOMER NAME"), w: 36, align: "left", get: (r) => r?.Full_Name },
    { title: label(t, "membership.reports.print.guardianName", "GUARDIAN NAME"), w: 34, align: "left", get: (r) => r?.Relation_Name },
    { title: label(t, "membership.reports.print.village", "VILLAGE"), w: 28, align: "left", get: (r) => r?.Village },
    { title: label(t, "membership.reports.print.lfNo", "L/F. NO."), w: 16, align: "center", get: (r) => r?.Ledg_Folio },
    { title: label(t, "membership.reports.print.opening", "OPENING"), w: 23, align: "right", get: (r) => money(r?.Opening) },
    { title: label(t, "membership.reports.print.issue", "ISSUE"), w: 23, align: "right", get: (r) => money(r?.Tot_Issue) },
    { title: label(t, "membership.reports.print.release", "RELEASE"), w: 23, align: "right", get: (r) => money(r?.Tot_Release) },
    { title: label(t, "membership.reports.print.closing", "CLOSING"), w: 23, align: "right", get: (r) => money(r?.Closing) },
    { title: label(t, "membership.reports.print.divBal", "DIV. BAL."), w: 23, align: "right", get: (r) => money(r?.Divid_Bal) },
  ];
};

const flattenTransactions = (groups = [], t) => {
  const rows = [];
  groups.forEach((group) => {
    if (group?.isGrandTotal) return;
    rows.push({ kind: "banner", text: group?.date ? day(group.date) : "" });
    (group?.transactions || []).forEach((txn, index) => {
      rows.push({
        kind: "cells",
        cells: {
          sl: String(index + 1),
          type: txn?.Member_Type || "",
          name: txn?.Full_Name || "",
          guardian: txn?.Relation_Name || "",
          village: txn?.Village || "",
          lf: txn?.Ledg_Folio || "",
          mode: txn?.Vouch_Type || "",
          shares: txn?.No_Share ?? "",
          issue: money(txn?.Tot_Issue),
          release: money(txn?.Tot_Release),
        },
      });
    });
    rows.push({
      kind: "total",
      label: label(t, "common.subtotal", "Sub Total"),
      issue: money(group?.subtotalIssue),
      release: money(group?.subtotalRelease),
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      kind: "total",
      label: label(t, "common.grandTotal", "Grand Total"),
      issue: money(grand.grandTotalIssue),
      release: money(grand.grandTotalRelease),
    });
  }
  return rows;
};

export const downloadMembershipReportPdf = async ({
  showData,
  tableData,
  fromDate,
  toDate,
  docTitle,
  t,
  totals,
  onProgress,
}) => {
  const landscape = LANDSCAPE.has(showData);
  const doc = new jsPDF({
    orientation: landscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const range = `${day(fromDate)} ${label(t, "membership.reports.preview.to", "To")} ${day(toDate)}`;
  const titles = {
    100: `${label(t, "membership.reports.preview.memberRegisterFrom", "Share Member Register From")} ${range}`,
    101: `${label(t, "membership.reports.preview.transactionRegisterFrom", "Share Transaction Register From")} ${range}`,
    102: `${label(t, "membership.reports.preview.withdrawnRegisterFrom", "Share Withdrawn Register From")} ${range}`,
    103: `${label(t, "membership.reports.preview.detailedListFrom", "Share Detailed List From")} ${range}`,
    104: `${label(t, "membership.reports.preview.dividendListFrom", "Share Dividend List From")} ${range}`,
  };

  const meta = {
    orgName: getCookieData("userOrgName") || "",
    branchName: getCookieData("userBranchName") || "",
    address: getCookieData("userOrgAddress") || "",
    regNo: getCookieData("userOrgRegistration") || "",
    userName: getCookieData("userName") || "",
    stamp: format(new Date(), "dd-MM-yyyy hh:mm:ss a"),
    title: titles[showData] || "Membership Report",
    generatedBy: label(t, "membership.reports.preview.generatedBy", "Generated By:"),
    generatedOn: label(t, "membership.reports.preview.generatedOn", "Generated On:"),
    generatedNote: label(
      t,
      "membership.reports.preview.footerNote",
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
  const rows =
    showData === "101" ? flattenTransactions(tableData, t) : tableData || [];

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

    if (showData === "101") {
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
            if (col.key === "issue") return row.issue;
            if (col.key === "release") return row.release;
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

  const totalLabel = label(t, "common.total", "Total");
  if (showData === "100") {
    paintCells(["", "", "", totalLabel, "", "", "", money(totals?.totalAdmFees)], true);
  } else if (showData === "102") {
    paintCells(["", "", "", totalLabel, "", "", "", money(totals?.totalAmount)], true);
  } else if (showData === "104") {
    paintCells(["", "", "", totalLabel, "", "", "", money(totals?.totalBalance)], true);
  } else if (showData === "103") {
    paintCells(
      [
        "",
        "",
        "",
        totalLabel,
        "",
        "",
        "",
        money(totals?.totalOpening),
        money(totals?.totalIssue),
        money(totals?.totalRelease),
        money(totals?.totalClosing),
        money(totals?.totalDividend),
      ],
      true,
    );
  }

  doc.save(`${docTitle}.pdf`);
};
