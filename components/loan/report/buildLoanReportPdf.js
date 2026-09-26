import {
  label,
  money,
  showDate,
  openPdf,
  orgMeta,
  fillTable,
  drawColumnHead,
} from "@/components/report/pdfEngine";

const buildColumns = (showData, t) => {
  if (showData === "110") {
    return [
      { title: label(t, "loan.print.slNo", "SL. NO."), w: 12, align: "center", get: (_r, i) => String(i + 1) },
      { title: label(t, "loan.print.date", "DATE"), w: 22, align: "center", get: (r) => showDate(r?.Disb_Date) },
      { title: label(t, "loan.print.customerName", "CUSTOMER NAME"), w: 40, align: "left", get: (r) => r?.Full_Name || "", wrap: true },
      { title: label(t, "loan.print.guardianName", "GUARDIAN NAME"), w: 36, align: "left", get: (r) => r?.Relation_Name || "", wrap: true },
      { title: label(t, "loan.print.accountNo", "ACCOUNT NO."), w: 26, align: "center", get: (r) => r?.Account_No || "" },
      { title: label(t, "loan.print.refAcNo", "REF. AC. NO."), w: 22, align: "center", get: (r) => r?.Ref_Ac_No || "" },
      { title: label(t, "loan.print.disburse", "DISBURSE"), w: 24, align: "right", get: (r) => money(r?.Disb_Amt) },
      { title: label(t, "loan.print.share", "SHARE"), w: 22, align: "right", get: (r) => money(r?.Share_Amt) },
      { title: label(t, "loan.print.insAmt", "INS AMT"), w: 22, align: "right", get: (r) => money(r?.Ins_Amt) },
      { title: label(t, "loan.print.misAmt", "MIS AMT"), w: 22, align: "right", get: (r) => money(r?.Mis_Amt) },
      { title: label(t, "loan.print.netDisburse", "NET DISBURSE"), w: 37, align: "right", get: (r) => money(r?.Net_Disburse) },
    ];
  }

  if (showData === "111") {
    return [
      { title: label(t, "loan.print.slNo", "SL. NO."), w: 12, align: "center" },
      { title: label(t, "loan.print.customerName", "CUSTOMER NAME"), w: 46, align: "left", wrap: true },
      { title: label(t, "loan.print.guardianName", "GUARDIAN NAME"), w: 42, align: "left", wrap: true },
      { title: label(t, "loan.print.accountNo", "ACCOUNT NO."), w: 28, align: "center" },
      { title: label(t, "loan.print.refAcNo", "REF. AC. NO."), w: 24, align: "center" },
      { title: label(t, "loan.print.transMode", "TRANS. MODE"), w: 28, align: "center" },
      { title: label(t, "loan.print.principal", "PRINCIPAL"), w: 35, align: "right" },
      { title: label(t, "loan.print.interest", "INTEREST"), w: 35, align: "right" },
      { title: label(t, "loan.print.amount", "AMOUNT"), w: 35, align: "right" },
    ];
  }

  return [
    { title: label(t, "loan.slUpper", "SL"), w: 10, align: "center", get: (_r, i) => String(i + 1) },
    { title: label(t, "loan.print.customerName", "CUSTOMER"), w: 34, align: "left", get: (r) => r?.Full_Name || "", wrap: true },
    { title: label(t, "loan.print.guardianName", "GUARDIAN"), w: 32, align: "left", get: (r) => r?.Guardian_Name || r?.Relation_Name || "", wrap: true },
    { title: label(t, "loan.accountNoShort", "A/C"), w: 22, align: "center", get: (r) => r?.Account_No || "" },
    { title: label(t, "loan.loanDate", "LOAN DATE"), w: 20, align: "center", get: (r) => showDate(r?.Disb_Date) },
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
    
    if (group?.date) {
      rows.push({ banner: showDate(group.date), align: "center" });
    }
    
    (group?.transactions || []).forEach((txn, index) => {
      rows.push({
        values: [
          String(index + 1),
          txn?.Full_Name || "",
          txn?.Relation_Name || "",
          txn?.Account_No || "",
          txn?.Ref_Ac_No || "",
          txn?.Trans_Type || "",
          money(txn?.Paid_Prn),
          money(txn?.Paid_Intt),
          money(txn?.Tot_Amt),
        ],
      });
    });
    rows.push({
      values: [
        "Sub Total",
        money(group?.subtotalPrincipal),
        money(group?.subtotalInterest),
        money(group?.subtotalAmount),
      ],
      spans: [6, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "right", "right"],
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      values: [
        "Grand Total",
        money(grand.grandTotalPrincipal),
        money(grand.grandTotalInterest),
        money(grand.grandTotalAmount),
      ],
      spans: [6, 1, 1, 1],
      bold: true,
      aligns: ["right", "right", "right", "right"],
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
  const doc = openPdf("landscape");
  
  const fromStr = fromDate ? showDate(fromDate) : "";
  const toStr = toDate ? showDate(toDate) : "";
  const range = `${fromStr} To ${toStr}`;
  
  const titles = {
    110: `${label(t, "loan.loanDisburseRegisterFrom", "Loan Disburse Register From")} ${range}`,
    111: `${label(t, "loan.depositTransactionRegisterFrom", "Loan Repayment Register From")} ${range}`,
    112: `${label(t, "loan.loanDetailedListFrom", "Loan Detailed List From")} ${range}`,
  };

  const title = titles[showData] || "Loan Report";
  
  const meta = orgMeta(title, t);
  meta.generatedBy = label(t, "loan.generatedByColon", "Generated By:");
  meta.generatedOn = label(t, "loan.generatedOnColon", "Generated On:");
  meta.generatedNote = label(t, "loan.reportGeneratedByPrioSuite", "This report is generated by PrioSuite.");
  
  const columns = buildColumns(showData, t);
  
  let rows = [];
  if (showData === "111") {
    rows = flattenRepayments(tableData);
  } else if (showData === "110" || showData === "112") {
    // Basic mapping for list
    (tableData || []).forEach((r, i) => {
      rows.push({
        values: columns.map(c => c.get?.(r, i) ?? "")
      });
    });
    
    if (showData === "110") {
      rows.push({
        values: [
          label(t, "loan.total", "Total"),
          money(totals?.totalDisburseAmount),
          money(totals?.totalShareAmount),
          money(totals?.totalInsAmount),
          money(totals?.totalMisAmount),
          money(totals?.totalNetDisburse),
        ],
        spans: [6, 1, 1, 1, 1, 1],
        bold: true,
        aligns: ["right", "right", "right", "right", "right", "right"],
      });
    } else if (showData === "112") {
      rows.push({
        values: [
          label(t, "loan.total", "Total"),
          money(totals?.totalOpening),
          money(totals?.totalDisburse),
          money(totals?.totalPrn),
          money(totals?.totalIntt),
          money(totals?.totalCurrOuts),
          money(totals?.totalOdOuts),
          money(totals?.totalCurrIntt),
          money(totals?.totalOdIntt),
        ],
        spans: [5, 1, 1, 1, 1, 1, 1, 1, 1],
        bold: true,
        aligns: ["right", "right", "right", "right", "right", "right", "right", "right", "right"],
      });
    }
  }

  const usable = columns.reduce((sum, col) => sum + col.w, 0);
  const pageW = doc.internal.pageSize.getWidth();
  const startX = Math.max(6, (pageW - usable) / 2);

  const drawDetailedHead = (pdf, y, x) => {
    const headH = 8;
    const fontSize = 8;
    const totalW = columns.reduce((s, c) => s + c.w, 0);
    pdf.setFillColor(243, 244, 246);
    pdf.rect(x, y, totalW, headH * 2, "F");
    pdf.setDrawColor(0);
    pdf.rect(x, y, totalW, headH * 2);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(fontSize);

    const centers = [
      label(t, "loan.slUpper", "SL"),
      label(t, "loan.print.customerName", "CUSTOMER NAME"),
      label(t, "loan.print.guardianName", "GUARDIAN NAME"),
      label(t, "loan.accountNoShort", "Account No"),
      label(t, "loan.loanDate", "Loan Date"),
      label(t, "loan.opening", "Opening"),
      label(t, "loan.print.disburse", "DISBURSE"),
    ];

    let cursor = x;
    for (let i = 0; i <= 6; i++) {
      pdf.line(cursor, y, cursor, y + headH * 2);
      pdf.text(centers[i], cursor + columns[i].w / 2, y + headH + 1.2, { align: "center" });
      cursor += columns[i].w;
    }

    const repayW = columns[7].w + columns[8].w;
    pdf.line(cursor, y, cursor, y + headH * 2);
    pdf.text(label(t, "loan.repayment", "Repayment"), cursor + repayW / 2, y + headH / 2 + 1.2, { align: "center" });
    pdf.line(cursor + columns[7].w, y + headH, cursor + columns[7].w, y + headH * 2);
    pdf.text(label(t, "loan.print.principal", "PRINCIPAL"), cursor + columns[7].w / 2, y + headH + headH / 2 + 1.2, { align: "center" });
    pdf.text(label(t, "loan.print.interest", "INTEREST"), cursor + columns[7].w + columns[8].w / 2, y + headH + headH / 2 + 1.2, { align: "center" });
    cursor += repayW;

    const outsW = columns[9].w + columns[10].w;
    pdf.line(cursor, y, cursor, y + headH * 2);
    pdf.text(label(t, "loan.outstanding", "Outstanding"), cursor + outsW / 2, y + headH / 2 + 1.2, { align: "center" });
    pdf.line(cursor + columns[9].w, y + headH, cursor + columns[9].w, y + headH * 2);
    pdf.text(label(t, "loan.current", "Current"), cursor + columns[9].w / 2, y + headH + headH / 2 + 1.2, { align: "center" });
    pdf.text(label(t, "loan.overdue", "Overdue"), cursor + columns[9].w + columns[10].w / 2, y + headH + headH / 2 + 1.2, { align: "center" });
    cursor += outsW;

    const outsInttW = columns[11].w + columns[12].w;
    pdf.line(cursor, y, cursor, y + headH * 2);
    pdf.text(label(t, "loan.outsInterest", "Outs. Interest"), cursor + outsInttW / 2, y + headH / 2 + 1.2, { align: "center" });
    pdf.line(cursor + columns[11].w, y + headH, cursor + columns[11].w, y + headH * 2);
    pdf.text(label(t, "loan.current", "Current"), cursor + columns[11].w / 2, y + headH + headH / 2 + 1.2, { align: "center" });
    pdf.text(label(t, "loan.overdue", "Overdue"), cursor + columns[11].w + columns[12].w / 2, y + headH + headH / 2 + 1.2, { align: "center" });
    cursor += outsInttW;
    
    const splitStartX = x + columns.slice(0, 7).reduce((s, c) => s + c.w, 0);
    pdf.line(splitStartX, y + headH, x + totalW, y + headH);
    pdf.line(x + totalW, y, x + totalW, y + headH * 2);

    return y + headH * 2;
  };

  await fillTable(doc, {
    meta,
    columns,
    rows,
    startX,
    rowH: 10.6,
    fontSize: 8,
    lineH: 3.6,
    padTop: 6.4,
    drawHead: (pdf, y, x) => showData === "112" ? drawDetailedHead(pdf, y, x) : drawColumnHead(pdf, y, x, columns, 16, 8),
    onProgress,
  });

  doc.save(`${docTitle}.pdf`);
};
