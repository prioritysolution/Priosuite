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
  { title: label(t, "borrowings.print.slNo", "SL. NO."), w: 12, align: "center" },
  { title: label(t, "borrowings.print.openingDate", "OPENING DATE"), w: 22, align: "center" },
  { title: label(t, "borrowings.print.productName", "PRODUCT NAME"), w: 40, align: "left", wrap: true },
  { title: label(t, "borrowings.print.bankName", "BANK NAME"), w: 32, align: "left", wrap: true },
  { title: label(t, "borrowings.print.accountNo", "ACCOUNT NO."), w: 24, align: "center" },
  { title: label(t, "borrowings.print.disburse", "DISBURSE"), w: 28, align: "right" },
  { title: label(t, "borrowings.print.prnRefund", "PRN. REFUND"), w: 28, align: "right" },
  { title: label(t, "borrowings.print.inttRefund", "INTT. REFUND"), w: 28, align: "right" },
  { title: label(t, "borrowings.print.outsBal", "OUTS. BAL."), w: 28, align: "right" },
  { title: label(t, "borrowings.print.provIntt", "PROV. INTT"), w: 23, align: "right" },
  { title: label(t, "borrowings.print.dueDate", "DUE DATE"), w: 20, align: "center" },
];

const flattenGroups = (groups = [], t) => {
  const rows = [];
  const glLabel = label(t, "common.gl", "GL");

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
          showDate(txn?.Disb_Date),
          txn?.Product_Name || "",
          txn?.Bank_Name || "",
          txn?.Account_No || "",
          money(txn?.Disburse),
          money(txn?.Prn_Refund),
          money(txn?.Intt_Refund),
          money(txn?.Outs_Bal),
          money(txn?.Provision_Intt),
          showDate(txn?.Due_Date),
        ],
      });
    });
    
    rows.push({
      values: [
        label(t, "borrowings.subTotal", "Sub Total"),
        money(group?.subtotalDisburse),
        money(group?.subtotalPrnRefund),
        money(group?.subtotalInttRefund),
        money(group?.subtotalOutsBal),
        "",
        "",
      ],
      spans: [5, 1, 1, 1, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "right", "right", "right", "right", "right"],
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      values: [
        label(t, "borrowings.grandTotal", "Grand Total"),
        money(grand.grandTotalDisburse),
        money(grand.grandTotalPrnRefund),
        money(grand.grandTotalInttRefund),
        money(grand.grandTotalOutsBal),
        "",
        "",
      ],
      spans: [5, 1, 1, 1, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "right", "right", "right", "right", "right"],
    });
  }
  return rows;
};

export const downloadBorrowingsReportPdf = async ({
  showData,
  tableData,
  fromDate,
  toDate,
  docTitle,
  t,
  onProgress,
}) => {
  const doc = openPdf("landscape");
  
  const fromStr = fromDate ? showDate(fromDate) : "";
  const toStr = toDate ? showDate(toDate) : "";
  const range = `${fromStr} ${label(t, "borrowings.to", "To")} ${toStr}`;
  const title = `${label(t, "borrowings.detailedListFrom", "Borrowings Detailed List From")} ${range}`;
  
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
