import {
  label,
  money,
  showDate,
  openPdf,
  orgMeta,
  fillTable,
  drawColumnHead,
} from "@/components/report/pdfEngine";

const columnsFor = (t) => [
  { title: label(t, "bank.print.slNo", "SL. NO."), w: 14, align: "center" },
  { title: label(t, "bank.print.bankName", "BANK NAME"), w: 46, align: "left", wrap: true },
  { title: label(t, "bank.print.accountNo", "ACCOUNT NO."), w: 28, align: "center" },
  { title: label(t, "bank.print.accountType", "ACCOUNT TYPE"), w: 26, align: "center" },
  { title: label(t, "bank.print.opening", "OPENING"), w: 21, align: "right" },
  { title: label(t, "bank.print.deposit", "DEPOSIT"), w: 21, align: "right" },
  { title: label(t, "bank.print.withdrawn", "WITHDRAWN"), w: 21, align: "right" },
  { title: label(t, "bank.print.closing", "CLOSING"), w: 21, align: "right" },
];

const flattenGroups = (groups = [], t) => {
  const rows = [];
  const glLabel = label(t, "bank.gl", "GL");

  groups.forEach((group) => {
    if (group?.isGrandTotal) return;
    const ledger = group?.transactions?.[0]?.Ledger_Name || "";
    if (ledger) {
      rows.push({ banner: `${glLabel} - ${ledger}`, align: "center" });
    }
    
    (group?.transactions || []).forEach((txn, index) => {
      rows.push({
        values: [
          String(index + 1),
          txn?.Bank_Name || "",
          txn?.Account_No || "",
          txn?.Acct_Type || "",
          money(txn?.Opening),
          money(txn?.Deposit),
          money(txn?.Withdrawn ?? txn?.Withdrwan),
          money(txn?.Closing),
        ],
      });
    });
    
    rows.push({
      values: [
        label(t, "bank.subTotal", "Sub Total"),
        money(group?.subtotalOpening),
        money(group?.subtotalDeposit),
        money(group?.subtotalWithdrawn),
        money(group?.subtotalClosing),
      ],
      spans: [4, 1, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "right", "right", "right"],
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      values: [
        label(t, "bank.grandTotal", "Grand Total"),
        money(grand.grandTotalOpening),
        money(grand.grandTotalDeposit),
        money(grand.grandTotalWithdrawn),
        money(grand.grandTotalClosing ?? grand.grandTotalClose),
      ],
      spans: [4, 1, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "right", "right", "right"],
    });
  }
  return rows;
};

export const downloadBankingReportPdf = async ({
  showData,
  tableData,
  fromDate,
  toDate,
  docTitle,
  t,
  onProgress,
}) => {
  const doc = openPdf("portrait");
  
  const fromStr = fromDate ? showDate(fromDate) : "";
  const toStr = toDate ? showDate(toDate) : "";
  const range = `${fromStr} ${label(t, "bank.to", "To")} ${toStr}`;
  const title = `${label(t, "bank.detailedListFrom", "Bank Detailed List From")} ${range}`;
  
  const meta = orgMeta(title, t);
  const columns = columnsFor(t);
  const rows = showData === "113" ? flattenGroups(tableData, t) : [];
  
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
