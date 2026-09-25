import convertToWords from "@/utils/numberToWords";
import {
  clipText,
  drawChrome,
  drawColumnHead,
  drawDenomPage,
  drawFooter,
  fillPair,
  fillTable,
  label,
  money,
  openPdf,
  orgMeta,
  padPair,
  showDate,
} from "./pdfEngine";

const save = (doc, name) => doc.save(`${name}.pdf`);

const simpleHead = (columns) => (doc, y, x) => drawColumnHead(doc, y, x, columns);

const ledgerColumns = (t, prefix) => [
  { title: label(t, `${prefix}.print.slNo`, "SL. NO."), w: 12, align: "center" },
  { title: label(t, `${prefix}.print.transDate`, "TRANS. DATE"), w: 24, align: "center" },
  { title: label(t, `${prefix}.print.voucherNo`, "VOUCHER NO."), w: 22, align: "center" },
  { title: label(t, `${prefix}.print.narration`, "NARRATION"), w: 62, align: "left" },
  { title: label(t, `${prefix}.print.debit`, "DEBIT"), w: 26, align: "right" },
  { title: label(t, `${prefix}.print.credit`, "CREDIT"), w: 26, align: "right" },
  { title: label(t, `${prefix}.print.balance`, "BALANCE"), w: 26, align: "right" },
];

const ledgerRows = (rows, narrationKey, typeKey) =>
  (rows || []).map((row, index) => ({
    values: [
      String(index + 1),
      showDate(row?.Trans_Date),
      row?.Vouch_No ?? "",
      row?.[narrationKey] ?? "",
      row?.Debit ?? "",
      row?.Credit ?? "",
      `${row?.Balance ?? ""} ${row?.[typeKey] ?? ""}`.trim(),
    ],
  }));

export const downloadAccountLedgerPdf = async ({
  rows,
  fromDate,
  toDate,
  totalDebit,
  totalCredit,
  ledgerName,
  t,
  onProgress,
}) => {
  const doc = openPdf("portrait");
  const columns = ledgerColumns(t, "report.accountLedger");
  const title = [
    ledgerName,
    label(t, "report.accountLedger.ledgerFromTo", `Ledger From ${fromDate || ""} To ${toDate || ""}`, {
      fromDate,
      toDate,
    }),
  ]
    .filter(Boolean)
    .join("\n");
  const body = ledgerRows(rows, "Particular", "Balance_Type");
  body.push({
    values: [
      "",
      "",
      "",
      label(t, "common.total", "Total"),
      money(totalDebit),
      money(totalCredit),
      "",
    ],
    bold: true,
  });
  await fillTable(doc, {
    meta: orgMeta(title, t),
    columns,
    rows: body,
    startX: 6,
    drawHead: simpleHead(columns),
    onProgress,
  });
  save(doc, `AccountLedger-${fromDate || ""}-${toDate || ""}`);
};

export const downloadSubLedgerPdf = async ({
  rows,
  fromDate,
  toDate,
  totalDebit,
  totalCredit,
  ledgerName,
  t,
  onProgress,
}) => {
  const doc = openPdf("portrait");
  const columns = ledgerColumns(t, "report.subLedger");
  const title = [
    ledgerName,
    label(t, "report.subLedger.subLedgerFromTo", `Sub Ledger From ${fromDate || ""} To ${toDate || ""}`, {
      fromDate,
      toDate,
    }),
  ]
    .filter(Boolean)
    .join("\n");
  const body = ledgerRows(rows, "Particulars", "Type");
  body.push({
    values: [
      "",
      "",
      "",
      label(t, "common.total", "Total"),
      money(totalDebit),
      money(totalCredit),
      "",
    ],
    bold: true,
  });
  await fillTable(doc, {
    meta: orgMeta(title, t),
    columns,
    rows: body,
    startX: 6,
    drawHead: simpleHead(columns),
    onProgress,
  });
  save(doc, `SubLedger-${fromDate || ""}-${toDate || ""}`);
};

export const downloadBalancingPdf = async ({
  shareList,
  depositList,
  loanList,
  investmentList,
  borrowingsList,
  asOnDate,
  t,
  onProgress,
}) => {
  const doc = openPdf("portrait");
  const columns = [
    { title: label(t, "report.balancing.print.slNo", "SL. NO."), w: 12, align: "center" },
    { title: label(t, "report.balancing.print.productName", "PRODUCT"), w: 32, align: "center" },
    { title: label(t, "report.balancing.print.glHead", "GL HEAD"), w: 46, align: "left" },
    { title: label(t, "report.balancing.print.glBalance", "GL BALANCE"), w: 28, align: "right" },
    { title: label(t, "report.balancing.print.subLedger", "SUB LEDGER"), w: 36, align: "right" },
    { title: label(t, "report.balancing.print.difference", "DIFFERENCE"), w: 44, align: "left" },
  ];
  const groups = [
    ["SHARE", shareList],
    ["DEPOSIT", depositList],
    ["LOAN", loanList],
    ["INVESTMENT", investmentList],
    ["BORROWINGS", borrowingsList],
  ];
  const rows = [];
  groups.forEach(([type, list]) => {
    if (!list?.length) return;
    rows.push({
      banner: `${label(t, "report.balancing.productType", "Product Type")} : ${type}`,
    });
    list.forEach((row, index) => {
      rows.push({
        values: [
          String(index + 1),
          row?.Sub_Heading ?? "",
          row?.Ledger_Name ?? "",
          row?.Gl_Balance ?? "",
          row?.Dl_Balance ?? "",
          row?.Remarks ?? "",
        ],
      });
    });
  });
  await fillTable(doc, {
    meta: orgMeta(
      label(t, "report.balancing.glBalancingAsOn", `GL Balancing As On ${asOnDate || ""}`, {
        date: asOnDate,
      }),
      t,
    ),
    columns,
    rows,
    startX: 6,
    drawHead: simpleHead(columns),
    onProgress,
  });
  save(doc, `GLBalancing-${asOnDate || "report"}`);
};

export const downloadUserScrollPdf = async ({ reportData, asOnDate, t, onProgress }) => {
  const doc = openPdf("portrait");
  const columns = [
    { title: label(t, "report.userScroll.print.slNo", "SL. NO."), w: 12, align: "center" },
    { title: label(t, "report.userScroll.print.refVoucher", "REF. VOUCHER"), w: 28, align: "center" },
    { title: label(t, "report.userScroll.print.voucherNo", "VOUCHER NO."), w: 28, align: "center" },
    { title: label(t, "report.userScroll.print.particulars", "PARTICULARS"), w: 70, align: "left" },
    { title: label(t, "report.userScroll.print.receipt", "RECEIPT"), w: 30, align: "right" },
    { title: label(t, "report.userScroll.print.payment", "PAYMENT"), w: 30, align: "right" },
  ];
  const rows = [];
  let grandReceive = 0;
  let grandPayment = 0;
  (reportData || []).forEach((group) => {
    rows.push({ banner: group?.Ledger_Name || "", align: "left" });
    let subReceive = 0;
    let subPayment = 0;
    (group?.entries || []).forEach((entry, index) => {
      const receive = Number(entry?.Rec_Cash) || 0;
      const payment = Number(entry?.Pay_Cash) || 0;
      subReceive += receive;
      subPayment += payment;
      rows.push({
        values: [
          String(index + 1),
          entry?.Vouch_No ?? "",
          entry?.Vouch_No ?? "",
          entry?.Particulars ?? "",
          entry?.Rec_Cash || "",
          entry?.Pay_Cash || "",
        ],
      });
    });
    if (group?.entries?.length) {
      grandReceive += subReceive;
      grandPayment += subPayment;
      rows.push({
        values: ["", "", "", label(t, "common.total", "Total"), money(subReceive), money(subPayment)],
        bold: true,
      });
    }
  });
  rows.push({
    values: [
      "",
      "",
      "",
      label(t, "common.grandTotal", "Grand Total"),
      money(grandReceive),
      money(grandPayment),
    ],
    bold: true,
  });
  await fillTable(doc, {
    meta: orgMeta(
      label(t, "report.userScroll.asOnDate", `User Scroll As On ${asOnDate || ""}`, {
        date: asOnDate,
      }),
      t,
    ),
    columns,
    rows,
    startX: 6,
    drawHead: simpleHead(columns),
    onProgress,
  });
  save(doc, `UserScroll-${asOnDate || "report"}`);
};

const flattenSheetSide = (grouped, grandAmount, t) => {
  const rows = [];
  (grouped || []).forEach((group) => {
    rows.push({
      values: [group?.headName ?? "", "", money(group?.subtotalAmount)],
      bold: true,
    });
    (group?.transactions || [])
      .filter((txn) => txn?.Ledger_Id != null)
      .forEach((txn) => {
        rows.push({
          values: [
            txn?.Ledger_Name ?? "",
            money(txn?.Amount),
            txn?.Debit ? money(txn.Debit) : "",
          ],
        });
      });
  });
  rows.push({
    values: [label(t, "common.grandTotal", "Grand Total"), "", money(grandAmount)],
    bold: true,
  });
  return rows;
};

export const downloadBalanceSheetPdf = async ({
  liabilities,
  assets,
  asOnDate,
  t,
  onProgress,
}) => {
  const doc = openPdf("landscape");
  const columns = [
    { title: "", w: 70, align: "left" },
    { title: label(t, "common.breakUp", "Break Up"), w: 36, align: "right" },
    { title: label(t, "common.balance", "Balance"), w: 36, align: "right" },
  ];
  const leftTitle = label(t, "report.balanceSheet.liabilities", "LIABILITIES");
  const rightTitle = label(t, "report.balanceSheet.assets", "ASSETS");
  const drawHead = (pdf, y, leftX, rightX) => {
    const headCols = (title) => [
      { ...columns[0], title },
      columns[1],
      columns[2],
    ];
    drawColumnHead(pdf, y, leftX, headCols(leftTitle));
    drawColumnHead(pdf, y, rightX, headCols(rightTitle));
  };
  const [leftRows, rightRows] = padPair(
    flattenSheetSide(liabilities?.groupedData, liabilities?.grandTotals?.grandTotalAmount, t),
    flattenSheetSide(assets?.groupedData, assets?.grandTotals?.grandTotalAmount, t),
  );
  const placed = await fillPair(doc, {
    meta: orgMeta(
      `${label(t, "report.balanceSheet.balanceSheetAsOn", "Balance Sheet As On")} ${asOnDate || ""}`,
      t,
    ),
    columns,
    leftRows,
    rightRows,
    startX: 6.5,
    headH: 7,
    drawHead,
    onProgress,
  });
  const note = [
    label(t, "report.balanceSheet.auditorsCertificate", "Auditor's Certificate"),
    `I report that I have audited the above balance Sheet as on ${asOnDate || ""} and the annexed Profit and Loss Account for the year ended ${asOnDate || ""} and have obtained all the information and explanation I have required. In my opinion the Balance Sheet and the Profit and Loss Account have been drawn up inconformity with the law and subject to my separate report of even date, the Balance Sheet exhibits a true and correct view of the state of the society's affair according to the best of information and explanations given to me and as shown by the book of the society. In my opinion the books of accounts have been kept as required under the Act, the rules and the By-Laws.`,
  ].join("\n");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const lines = doc.splitTextToSize(note, placed.width - 4);
  let y = placed.y + 4;
  const pageH = doc.internal.pageSize.getHeight();
  if (y + lines.length * 3.2 > pageH - 10) {
    doc.addPage();
    y = drawChrome(doc, orgMeta(
      `${label(t, "report.balanceSheet.balanceSheetAsOn", "Balance Sheet As On")} ${asOnDate || ""}`,
      t,
    ));
    drawFooter(doc, orgMeta("", t));
  }
  doc.text(lines, placed.startX + 2, y);
  save(doc, `BalanceSheet-${asOnDate || "report"}`);
};

const flattenProfitSide = (grouped, netRow, subTotal, t) => {
  const rows = [];
  (grouped || []).forEach((group) => {
    rows.push({
      values: [group?.headName ?? "", "", money(group?.subtotalAmount)],
      bold: true,
    });
    (group?.transactions || []).forEach((txn) => {
      rows.push({
        values: [
          txn?.Ledger_Name ?? "",
          money(txn?.Amount),
          txn?.Debit ? money(txn.Debit) : "",
        ],
      });
    });
  });
  const sub = parseFloat(subTotal || 0);
  const netAmount = parseFloat(netRow?.Amount || 0);
  rows.push({
    values: [label(t, "common.subTotal", "Sub Total"), "", money(sub)],
    bold: true,
  });
  if (netRow) {
    rows.push({
      values: [netRow?.Head_Name ?? "", "", money(netAmount)],
      bold: true,
    });
  }
  rows.push({
    values: [label(t, "common.grandTotal", "Grand Total"), "", money(sub + (netRow ? netAmount : 0))],
    bold: true,
  });
  return rows;
};

export const downloadProfitLossPdf = async ({
  expenditure,
  income,
  netData,
  fromDate,
  toDate,
  t,
  onProgress,
}) => {
  const doc = openPdf("portrait");
  const columns = [
    { title: "", w: 49, align: "left" },
    { title: label(t, "common.breakUp", "Break Up"), w: 25, align: "right" },
    { title: label(t, "common.amount", "Amount"), w: 25, align: "right" },
  ];
  const leftTitle = label(t, "report.profitLoss.expenditure", "EXPENDITURE");
  const rightTitle = label(t, "report.profitLoss.income", "INCOME");
  const fromLabel = showDate(fromDate);
  const drawHead = (pdf, y, leftX, rightX) => {
    drawColumnHead(pdf, y, leftX, [{ ...columns[0], title: leftTitle }, columns[1], columns[2]]);
    drawColumnHead(pdf, y, rightX, [{ ...columns[0], title: rightTitle }, columns[1], columns[2]]);
  };
  const [leftRows, rightRows] = padPair(
    flattenProfitSide(
      expenditure?.groupedData,
      (netData || []).find((row) => row?.Position === "L"),
      expenditure?.grandTotals?.grandTotalAmount,
      t,
    ),
    flattenProfitSide(
      income?.groupedData,
      (netData || []).find((row) => row?.Position === "R"),
      income?.grandTotals?.grandTotalAmount,
      t,
    ),
  );
  await fillPair(doc, {
    meta: orgMeta(
      label(
        t,
        "report.profitLoss.profitLossFromTo",
        `Profit & Loss From ${fromLabel} To ${toDate || ""}`,
        { fromDate: fromLabel, toDate },
      ),
      t,
    ),
    columns,
    leftRows,
    rightRows,
    startX: 6,
    headH: 7,
    drawHead,
    onProgress,
  });
  save(doc, `ProfitLoss-${fromLabel}-${toDate || ""}`);
};

const flattenAppropriation = (list) => {
  const rows = [];
  (list || []).forEach((item) => {
    if (item?.Heading_Name) {
      rows.push({ values: [item.Heading_Name, item?.Amount ?? ""], bold: true });
    }
    if (item?.Ledger_Name) {
      rows.push({ values: [item.Ledger_Name, item?.Amount ?? ""] });
    }
  });
  return rows;
};

export const downloadPlAppropriationPdf = async ({
  expenditure,
  income,
  totalExpenditure,
  totalIncome,
  asOnDate,
  t,
  onProgress,
}) => {
  const doc = openPdf("portrait");
  const columns = [
    { title: "", w: 69, align: "left" },
    { title: label(t, "common.amount", "Amount"), w: 30, align: "right" },
  ];
  const leftTitle = label(t, "report.plAppropiation.expenditure", "EXPENDITURE");
  const rightTitle = label(t, "report.plAppropiation.income", "INCOME");
  const drawHead = (pdf, y, leftX, rightX) => {
    drawColumnHead(pdf, y, leftX, [{ ...columns[0], title: leftTitle }, columns[1]]);
    drawColumnHead(pdf, y, rightX, [{ ...columns[0], title: rightTitle }, columns[1]]);
  };
  const left = flattenAppropriation(expenditure);
  const right = flattenAppropriation(income);
  left.push({
    values: [label(t, "common.grandTotal", "Grand Total"), money(totalExpenditure)],
    bold: true,
  });
  right.push({
    values: [label(t, "common.grandTotal", "Grand Total"), money(totalIncome)],
    bold: true,
  });
  const [leftRows, rightRows] = padPair(left.slice(0, -1), right.slice(0, -1));
  leftRows.push(left[left.length - 1]);
  rightRows.push(right[right.length - 1]);
  await fillPair(doc, {
    meta: orgMeta(
      `${label(t, "report.plAppropiation.plAppropiationAsOn", "PL Appropiation As On")} ${asOnDate || ""}`,
      t,
    ),
    columns,
    leftRows,
    rightRows,
    startX: 6,
    headH: 7,
    drawHead,
    onProgress,
  });
  save(doc, `PLAppropiation-${asOnDate || "report"}`);
};

const moneyPairColumns = (t, prefix) => [
  { title: label(t, `${prefix}.print.vNo`, "V. NO."), w: 16, align: "center" },
  { title: label(t, `${prefix}.print.particulars`, "PARTICULARS"), w: 52, align: "left" },
  { title: label(t, `${prefix}.print.cash`, "CASH"), w: 24.5, align: "right" },
  { title: label(t, `${prefix}.print.transfer`, "TRANSFER"), w: 24.5, align: "right" },
  { title: label(t, `${prefix}.print.total`, "TOTAL"), w: 25, align: "right" },
];

const cashRows = (list) =>
  (list || []).map((row) => ({
    values: [
      row?.Vouch_No ?? "",
      row?.Particular ?? "",
      money(row?.Cash),
      money(row?.Transfer),
      money(row?.Total),
    ],
  }));

const closingWords = (closing, t) => {
  const amount = parseFloat(closing || 0);
  const words =
    amount > 0
      ? `${label(t, "common.rupees", "Rupees")} ${convertToWords(amount)} ${label(t, "common.only", "Only")}`
      : label(t, "common.zero", "Zero");
  return `${label(t, "report.cashbook.closingBalanceInWords", "Closing Balance In Words")}: ${words}`;
};

export const downloadCashAccountPdf = async ({
  receipts,
  payments,
  denomData,
  fromDate,
  toDate,
  totals,
  cashBalanceData,
  t,
  onProgress,
}) => {
  const doc = openPdf("landscape");
  const columns = moneyPairColumns(t, "report.cashAccount");
  const receiptsTitle = label(t, "report.cashAccount.print.receipts", "RECEIPTS");
  const paymentsTitle = label(t, "report.cashAccount.print.payments", "PAYMENTS");
  const drawHead = (pdf, y, leftX, rightX, width) => {
    const headH = 12;
    const subH = 6;
    [receiptsTitle, paymentsTitle].forEach((title, side) => {
      const x = side === 0 ? leftX : rightX;
      pdf.setFillColor(243, 244, 246);
      pdf.rect(x, y, width, headH, "F");
      pdf.rect(x, y, width, headH);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6);
      let cursor = x;
      columns.forEach((col, index) => {
        if (index < 2) pdf.line(cursor, y, cursor, y + headH);
        cursor += col.w;
      });
      const moneyX = x + columns[0].w + columns[1].w;
      pdf.line(moneyX, y + subH, x + width, y + subH);
      let split = moneyX;
      columns.slice(2).forEach((col) => {
        pdf.line(split, y + subH, split, y + headH);
        split += col.w;
      });
      pdf.text(clipText(pdf, columns[0].title, columns[0].w - 1), x + columns[0].w / 2, y + 7, {
        align: "center",
      });
      pdf.text(clipText(pdf, columns[1].title, columns[1].w - 1), x + columns[0].w + 0.7, y + 7);
      pdf.text(title, moneyX + (width - columns[0].w - columns[1].w) / 2, y + 4, {
        align: "center",
      });
      const subs = [columns[2].title, columns[3].title, columns[4].title];
      let subX = moneyX;
      columns.slice(2).forEach((col, index) => {
        pdf.text(clipText(pdf, subs[index], col.w - 1), subX + col.w - 0.6, y + subH + 4, {
          align: "right",
        });
        subX += col.w;
      });
    });
  };
  const opening = parseFloat(cashBalanceData?.Opening || 0);
  const closing = parseFloat(cashBalanceData?.Closing || 0);
  const left = cashRows(receipts);
  const right = cashRows(payments);
  const [leftRows, rightRows] = padPair(left, right);
  leftRows.push(
    {
      values: [
        "",
        label(t, "common.total", "Total"),
        money(totals?.totalCashReceived),
        money(totals?.totalTranferReceived),
        money(totals?.totalReceived),
      ],
      bold: true,
    },
    {
      values: ["", label(t, "common.openingBalance", "Opening Balance"), money(opening), "", ""],
      bold: true,
    },
    {
      values: [
        "",
        label(t, "common.grandTotal", "Grand Total"),
        money(parseFloat(totals?.totalCashReceived || 0) + opening),
        money(totals?.totalTranferReceived),
        money(parseFloat(totals?.totalReceived || 0) + opening),
      ],
      bold: true,
    },
  );
  rightRows.push(
    {
      values: [
        "",
        label(t, "common.total", "Total"),
        money(totals?.totalCashPayment),
        money(totals?.totalTranferPayment),
        money(totals?.totalPayment),
      ],
      bold: true,
    },
    {
      values: ["", label(t, "common.closingBalance", "Closing Balance"), money(closing), "", ""],
      bold: true,
    },
    {
      values: [
        "",
        label(t, "common.grandTotal", "Grand Total"),
        money(parseFloat(totals?.totalCashPayment || 0) + closing),
        money(totals?.totalTranferPayment),
        money(parseFloat(totals?.totalPayment || 0) + closing),
      ],
      bold: true,
    },
  );
  const meta = orgMeta(
    `${label(t, "report.cashAccount.cashAccountFrom", "Cash Account From")} ${fromDate || ""} ${label(t, "common.to", "To")} ${toDate || ""}`,
    t,
  );
  const placed = await fillPair(doc, {
    meta,
    columns,
    leftRows,
    rightRows,
    startX: 6.5,
    headH: 12,
    drawHead,
    onProgress,
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.rect(placed.startX, placed.y, placed.width, 5.2);
  doc.text(clipText(doc, closingWords(closing, t), placed.width - 3), placed.startX + placed.width - 1.2, placed.y + 3.5, {
    align: "right",
  });
  drawDenomPage(doc, meta, denomData, t);
  save(doc, `CashAccount-${fromDate || ""}-${toDate || ""}`);
};

export const downloadCashbookPdf = async ({
  receipts,
  payments,
  denomData,
  toDate,
  totalReceived,
  totalPayment,
  cashBalanceData,
  t,
  onProgress,
}) => {
  const doc = openPdf("landscape");
  const columns = [
    { title: label(t, "report.cashbook.print.sl", "SL."), w: 12, align: "center" },
    { title: label(t, "report.cashbook.print.vouchNo", "VOUCH NO."), w: 24, align: "center" },
    { title: label(t, "report.cashbook.print.ledgerName", "LEDGER"), w: 36, align: "left" },
    { title: label(t, "report.cashbook.print.particulars", "PARTICULARS"), w: 42, align: "left" },
    { title: label(t, "report.cashbook.print.amount", "AMOUNT"), w: 28, align: "right" },
  ];
  const receiptTitle = label(t, "report.cashbook.print.receipt", "RECEIPT");
  const paymentTitle = label(t, "report.cashbook.print.payment", "PAYMENT");
  const drawHead = (pdf, y, leftX, rightX, width) => {
    [receiptTitle, paymentTitle].forEach((title, side) => {
      const x = side === 0 ? leftX : rightX;
      pdf.setFillColor(243, 244, 246);
      pdf.rect(x, y, width, 6, "F");
      pdf.rect(x, y, width, 12);
      pdf.line(x, y + 6, x + width, y + 6);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6.5);
      pdf.text(title, x + width / 2, y + 4, { align: "center" });
      let cursor = x;
      columns.forEach((col) => {
        pdf.line(cursor, y + 6, cursor, y + 12);
        const textX = col.align === "right" ? cursor + col.w - 0.6 : cursor + col.w / 2;
        pdf.setFontSize(6);
        pdf.text(clipText(pdf, col.title, col.w - 1), textX, y + 10, {
          align: col.align === "right" ? "right" : "center",
        });
        cursor += col.w;
      });
    });
  };
  const mapSide = (list) =>
    (list || []).map((row, index) => ({
      values: [
        String(index + 1),
        row?.Vouch_No ?? "",
        row?.Ledger_Name ?? "",
        row?.Particular ?? "",
        money(row?.Cash),
      ],
    }));
  const left = mapSide(receipts);
  const right = mapSide(payments);
  const [leftRows, rightRows] = padPair(left, right);
  leftRows.push(
    { values: ["", "", "", label(t, "common.total", "Total"), money(totalReceived)], bold: true },
    {
      values: ["", "", "", label(t, "common.openingBalance", "Opening Balance"), money(cashBalanceData?.Opening)],
      bold: true,
    },
  );
  rightRows.push(
    { values: ["", "", "", label(t, "common.total", "Total"), money(totalPayment)], bold: true },
    {
      values: ["", "", "", label(t, "common.closingBalance", "Closing Balance"), money(cashBalanceData?.Closing)],
      bold: true,
    },
  );
  const meta = orgMeta(
    `${label(t, "report.cashbook.cashbookAsOn", "Cashbook As On")} ${toDate || ""}`,
    t,
  );
  const placed = await fillPair(doc, {
    meta,
    columns,
    leftRows,
    rightRows,
    startX: 6.5,
    headH: 12,
    drawHead,
    onProgress,
  });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.rect(placed.startX, placed.y, placed.width, 5.2);
  doc.text(
    clipText(doc, closingWords(cashBalanceData?.Closing, t), placed.width - 3),
    placed.startX + placed.width - 1.2,
    placed.y + 3.5,
    { align: "right" },
  );
  drawDenomPage(doc, meta, denomData, t);
  save(doc, `Cashbook-${toDate || "report"}`);
};

const flattenTrial = (grouped, grand, t) => {
  const rows = [];
  (Array.isArray(grouped) ? grouped : []).forEach((mainGroup) => {
    if (!mainGroup) return;
    if (mainGroup.mainName != null || Array.isArray(mainGroup.heads)) {
      rows.push({ banner: mainGroup.mainName || "", align: "left" });
    }
    const headGroups = Array.isArray(mainGroup.heads)
      ? mainGroup.heads
      : mainGroup.transactions
        ? [mainGroup]
        : [];
    headGroups.forEach((group) => {
      rows.push({ banner: group?.headName || "", align: "left" });
      const txns = (group?.transactions || []).filter(
        (txn) => txn?.Ledger_Id !== null && txn?.Ledger_Id !== undefined,
      );
      txns.forEach((txn) => {
        rows.push({
          values: [
            txn?.Ledgare_Name ?? "",
            `${txn?.Opening ? money(txn.Opening) : ""} ${txn?.Opening_Type || ""}`.trim(),
            txn?.Debit ? money(txn.Debit) : "",
            txn?.Credit ? money(txn.Credit) : "",
            `${txn?.Closing ? money(txn.Closing) : ""} ${txn?.Closing_Type || ""}`.trim(),
            "",
          ],
        });
      });
      if (txns.length) {
        rows.push({
          values: ["", "", "", "", "", money(group?.subtotalClosing)],
          bold: true,
        });
      }
    });
    if (Array.isArray(mainGroup.heads) && mainGroup.heads.length) {
      rows.push({
        values: ["", "", "", "", "", money(mainGroup?.subtotalClosing ?? 0)],
        bold: true,
      });
    }
  });
  rows.push({
    values: [
      label(t, "common.grandTotal", "Grand Total"),
      money(grand?.grandTotalOpening || 0),
      money(grand?.grandTotalDebit || 0),
      money(grand?.grandTotalCredit || 0),
      "",
      money(grand?.grandTotalClosing || 0),
    ],
    bold: true,
  });
  return rows;
};

export const downloadTrialBalancePdf = async ({
  liabilities,
  assets,
  fromDate,
  toDate,
  t,
  onProgress,
}) => {
  const doc = openPdf("portrait");
  const columns = [
    { title: label(t, "common.headOfAccount", "HEAD OF ACCOUNT"), w: 48, align: "left" },
    { title: label(t, "common.openingBalance", "OPENING"), w: 30, align: "right" },
    { title: label(t, "common.totalDebit", "DEBIT"), w: 30, align: "right" },
    { title: label(t, "common.totalCredit", "CREDIT"), w: 30, align: "right" },
    { title: label(t, "common.breakUp", "BREAK UP"), w: 30, align: "right" },
    { title: label(t, "common.balance", "BALANCE"), w: 30, align: "right" },
  ];
  const title = label(
    t,
    "report.trialBalance.trialBalanceFromTo",
    `Trial Balance From ${fromDate || ""} To ${toDate || ""}`,
    { fromDate, toDate },
  );
  const drawHead = (section) => (pdf, y, x, width) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setFillColor(243, 244, 246);
    pdf.rect(x, y, width, 6, "F");
    pdf.rect(x, y, width, 6);
    pdf.text(section, x + width / 2, y + 4, { align: "center" });
    return drawColumnHead(pdf, y + 6, x, columns);
  };
  const meta = orgMeta(title, t);
  await fillTable(doc, {
    meta,
    columns,
    rows: flattenTrial(liabilities?.groupedData, liabilities?.grandTotals, t),
    startX: 6,
    drawHead: drawHead(label(t, "report.trialBalance.liabilitiesAndIncomeTitle", "LIABILITIES & INCOME")),
    onProgress,
  });
  doc.addPage();
  await fillTable(doc, {
    meta,
    columns,
    rows: flattenTrial(assets?.groupedData, assets?.grandTotals, t),
    startX: 6,
    drawHead: drawHead(label(t, "report.trialBalance.assetsAndExpenses", "ASSETS & EXPENSES")),
    onProgress,
  });
  save(doc, `TrailBalance-${fromDate || ""}-${toDate || ""}`);
};
