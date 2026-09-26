import {
  label,
  money,
  showDate,
  openPdf,
  orgMeta,
  fillTable,
  drawColumnHead,
} from "@/components/report/pdfEngine";

const LANDSCAPE = new Set(["101", "103"]);

const identityColumns = (t, amountTitle, amountGet) => [
  { title: label(t, "membership.reports.print.slNo", "SL. NO."), w: 14, align: "center", get: (_r, i) => String(i + 1) },
  { title: label(t, "membership.reports.print.date", "DATE"), w: 24, align: "center", get: (r) => showDate(r?.Adm_Date) },
  { title: label(t, "membership.reports.print.memberType", "MEMBER TYPE"), w: 26, align: "center", get: (r) => r?.Member_Type },
  { title: label(t, "membership.reports.print.customerName", "CUSTOMER NAME"), w: 36, align: "left", get: (r) => r?.Full_Name, wrap: true },
  { title: label(t, "membership.reports.print.guardianName", "GUARDIAN NAME"), w: 34, align: "left", get: (r) => r?.Relation_Name, wrap: true },
  { title: label(t, "membership.reports.print.village", "VILLAGE"), w: 26, align: "left", get: (r) => r?.Village, wrap: true },
  { title: label(t, "membership.reports.print.lfNo", "L/F. NO."), w: 16, align: "center", get: (r) => r?.Ledg_Folio },
  { title: amountTitle, w: 22, align: "right", get: amountGet },
];

const buildColumns = (showData, t) => {
  if (showData === "100") {
    return identityColumns(t, label(t, "membership.reports.print.admFees", "ADM. FEES"), (r) => money(r?.Adm_Fees));
  }
  if (showData === "102") {
    return identityColumns(t, label(t, "membership.reports.print.amount", "AMOUNT"), (r) => money(r?.Amount));
  }
  if (showData === "104") {
    return identityColumns(t, label(t, "membership.reports.print.balance", "BALANCE"), (r) => money(r?.Balance));
  }

  if (showData === "101") {
    return [
      { title: label(t, "membership.reports.print.slNo", "SL. NO."), w: 12, align: "center" },
      { title: label(t, "membership.reports.print.memberType", "MEMBER TYPE"), w: 26, align: "center" },
      { title: label(t, "membership.reports.print.customerName", "CUSTOMER NAME"), w: 42, align: "left", wrap: true },
      { title: label(t, "membership.reports.print.guardianName", "GUARDIAN NAME"), w: 40, align: "left", wrap: true },
      { title: label(t, "membership.reports.print.village", "VILLAGE"), w: 32, align: "left", wrap: true },
      { title: label(t, "membership.reports.print.lfNo", "L/F. NO."), w: 18, align: "center" },
      { title: label(t, "membership.reports.print.transMode", "TRANS. MODE"), w: 24, align: "center" },
      { title: label(t, "membership.reports.print.noOfShare", "NO. OF SHARE"), w: 22, align: "center" },
      { title: label(t, "membership.reports.print.issue", "ISSUE"), w: 34.5, align: "right" },
      { title: label(t, "membership.reports.print.release", "RELEASE"), w: 34.5, align: "right" },
    ];
  }

  return [
    { title: label(t, "membership.reports.print.slNo", "SL. NO."), w: 12, align: "center", get: (_r, i) => String(i + 1) },
    { title: label(t, "membership.reports.print.date", "DATE"), w: 22, align: "center", get: (r) => showDate(r?.Adm_Date) },
    { title: label(t, "membership.reports.print.memberType", "MEMBER TYPE"), w: 22, align: "center", get: (r) => r?.Member_Type },
    { title: label(t, "membership.reports.print.customerName", "CUSTOMER NAME"), w: 36, align: "left", get: (r) => r?.Full_Name, wrap: true },
    { title: label(t, "membership.reports.print.guardianName", "GUARDIAN NAME"), w: 34, align: "left", get: (r) => r?.Relation_Name, wrap: true },
    { title: label(t, "membership.reports.print.village", "VILLAGE"), w: 28, align: "left", get: (r) => r?.Village, wrap: true },
    { title: label(t, "membership.reports.print.lfNo", "L/F. NO."), w: 16, align: "center", get: (r) => r?.Ledg_Folio },
    { title: label(t, "membership.reports.print.opening", "OPENING"), w: 23, align: "right", get: (r) => money(r?.Opening) },
    { title: label(t, "membership.reports.print.issue", "ISSUE"), w: 23, align: "right", get: (r) => money(r?.Tot_Issue) },
    { title: label(t, "membership.reports.print.release", "RELEASE"), w: 23, align: "right", get: (r) => money(r?.Tot_Release) },
    { title: label(t, "membership.reports.print.closing", "CLOSING"), w: 23, align: "right", get: (r) => money(r?.Closing) },
    { title: label(t, "membership.reports.print.divBal", "DIV. BAL."), w: 23, align: "right", get: (r) => money(r?.Divid_Bal) },
  ];
};

const flattenTransactions = (groups = []) => {
  const rows = [];
  groups.forEach((group) => {
    if (group?.isGrandTotal) return;
    if (group?.date) {
      rows.push({ banner: showDate(group.date), align: "center" });
    }
    (group?.transactions || []).forEach((txn, index) => {
      rows.push({
        values: [
          String(index + 1),
          txn?.Member_Type || "",
          txn?.Full_Name || "",
          txn?.Relation_Name || "",
          txn?.Village || "",
          txn?.Ledg_Folio || "",
          txn?.Vouch_Type || "",
          txn?.No_Share ?? "",
          money(txn?.Tot_Issue),
          money(txn?.Tot_Release),
        ],
      });
    });
    rows.push({
      values: [
        "",
        "Sub Total",
        "", "", "", "", "", "",
        money(group?.subtotalIssue),
        money(group?.subtotalRelease),
      ],
      spans: [1, 7, 1, 1],
      bold: true,
      aligns: ["center", "right", "right", "right"],
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      values: [
        "",
        "Grand Total",
        "", "", "", "", "", "",
        money(grand.grandTotalIssue),
        money(grand.grandTotalRelease),
      ],
      spans: [1, 7, 1, 1],
      bold: true,
      aligns: ["center", "right", "right", "right"],
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
  const isLandscape = LANDSCAPE.has(showData);
  const doc = openPdf(isLandscape ? "landscape" : "portrait");

  const range = `${fromDate ? showDate(fromDate) : ""} To ${toDate ? showDate(toDate) : ""}`;
  const titles = {
    100: `Share Member Register From ${range}`,
    101: `Share Transaction Register From ${range}`,
    102: `Share Withdrawn Register From ${range}`,
    103: `Share Detailed List From ${range}`,
    104: `Share Dividend List From ${range}`,
  };

  const title = titles[showData] || "Membership Report";

  const meta = orgMeta(title, t);
  meta.generatedBy = `Generated By:`;
  meta.generatedOn = `Generated On:`;
  meta.generatedNote = `This report is generated by PrioSuite.`;

  const columns = buildColumns(
    showData,
    t || ((key, fallback) => fallback || key),
  );
  let rows = [];

  if (showData === "101") {
    rows = flattenTransactions(tableData);
  } else {
    (tableData || []).forEach((r, i) => {
      rows.push({
        values: columns.map((c) => c.get?.(r, i) ?? ""),
      });
    });

    if (showData === "103") {
      rows.push({
        values: [
          "Total",
          money(totals?.totalOpening),
          money(totals?.totalIssue),
          money(totals?.totalRelease),
          money(totals?.totalClosing),
          money(totals?.totalDividend),
        ],
        spans: [7, 1, 1, 1, 1, 1],
        bold: true,
        aligns: ["right", "right", "right", "right", "right", "right"],
      });
    } else if (showData === "100" && totals?.totalAdmFees != null) {
      rows.push({
        values: ["Total", money(totals.totalAdmFees)],
        spans: [7, 1],
        bold: true,
        aligns: ["right", "right"],
      });
    } else if (showData === "102" && totals?.totalAmount != null) {
      rows.push({
        values: ["Total", money(totals.totalAmount)],
        spans: [7, 1],
        bold: true,
        aligns: ["right", "right"],
      });
    } else if (showData === "104" && totals?.totalBalance != null) {
      rows.push({
        values: ["Total", money(totals.totalBalance)],
        spans: [7, 1],
        bold: true,
        aligns: ["right", "right"],
      });
    }
  }

  const usable = columns.reduce((sum, col) => sum + col.w, 0);
  const pageW = doc.internal.pageSize.getWidth();
  const startX = Math.max(6, (pageW - usable) / 2);

  await fillTable(doc, {
    meta,
    columns,
    rows,
    startX,
    rowH: 10.6,
    fontSize: 8,
    lineH: 3.6,
    padTop: 6.4,
    drawHead: (pdf, y, x) => drawColumnHead(pdf, y, x, columns, 16, 8),
    onProgress,
  });

  doc.save(`${docTitle}.pdf`);
};
