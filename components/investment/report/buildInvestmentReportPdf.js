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
  { title: label(t, "investment.print.slNo", "SL. NO."), w: 12, align: "center" },
  { title: label(t, "investment.print.openingDate", "OPENING DATE"), w: 22, align: "center" },
  { title: label(t, "investment.print.bankName", "BANK NAME"), w: 40, align: "left", wrap: true },
  { title: label(t, "investment.print.accountNo", "ACCOUNT NO."), w: 24, align: "center" },
  { title: label(t, "investment.print.accountType", "ACCOUNT TYPE"), w: 22, align: "center" },
  { title: label(t, "investment.print.invest", "INVEST"), w: 22, align: "right" },
  { title: label(t, "investment.print.roi", "ROI"), w: 14, align: "center" },
  { title: label(t, "investment.print.matureDate", "MATURE DATE"), w: 22, align: "center" },
  { title: label(t, "investment.print.provIntt", "PROV. INTT"), w: 20, align: "right" },
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
          showDate(txn?.Opening_Date),
          txn?.Bank_Name || "",
          txn?.Account_No || "",
          txn?.Acct_Type || "",
          money(txn?.Invest_Amt),
          txn?.Roi ?? "",
          showDate(txn?.Mature_Date),
          money(txn?.Prov_Intt),
        ],
      });
    });
    
    rows.push({
      values: [
        label(t, "investment.subTotal", "Sub Total"),
        money(group?.subtotalInvest),
        "",
        "",
        money(group?.subtotalProvIntt),
      ],
      spans: [5, 1, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "center", "center", "right"],
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      values: [
        label(t, "investment.grandTotal", "Grand Total"),
        money(grand.grandTotalInvest),
        "",
        "",
        money(grand.grandTotalProvIntt),
      ],
      spans: [5, 1, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "center", "center", "right"],
    });
  }
  return rows;
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
  const doc = openPdf("portrait");
  
  const fromStr = fromDate ? showDate(fromDate) : "";
  const toStr = toDate ? showDate(toDate) : "";
  const range = `${fromStr} ${label(t, "investment.to", "To")} ${toStr}`;
  const title = `${label(t, "investment.detailedListFrom", "Investment Detailed List From")} ${range}`;
  
  const meta = orgMeta(title, t);
  const columns = columnsFor(t);
  const rows = showData === "114" ? flattenGroups(tableData, t) : [];
  
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
