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
  if (showData === "105") {
    return [
      {
        title: label(t, "deposit.reports.print.slNo", "SL. NO."),
        w: 14,
        align: "center",
        get: (_r, i) => String(i + 1),
      },
      {
        title: label(t, "deposit.reports.print.date", "DATE"),
        w: 26,
        align: "center",
        get: (r) => showDate(r?.Opening_Date),
      },
      {
        title: label(t, "deposit.reports.print.customerName", "CUSTOMER NAME"),
        w: 46,
        align: "left",
        get: (r) => r?.Full_Name,
        wrap: true,
      },
      {
        title: label(t, "deposit.reports.print.guardianName", "GUARDIAN NAME"),
        w: 42,
        align: "left",
        get: (r) => r?.Relation_Name,
        wrap: true,
      },
      {
        title: label(t, "deposit.reports.print.accountNo", "ACCOUNT NO."),
        w: 30,
        align: "center",
        get: (r) => r?.Account_No,
      },
      {
        title: label(t, "deposit.reports.print.refAcNo", "REF. AC. NO."),
        w: 26,
        align: "center",
        get: (r) => r?.Ref_Ac_No,
      },
      {
        title: label(t, "deposit.reports.print.lfNo", "L/F. NO."),
        w: 20,
        align: "center",
        get: (r) => r?.Ledg_Folio,
      },
      {
        title: label(t, "deposit.reports.print.nominee", "NOMINEE"),
        w: 44,
        align: "left",
        get: (r) => r?.Nominee_Name,
        wrap: true,
      },
      {
        title: label(
          t,
          "deposit.reports.print.operationMode",
          "OPERATION MODE",
        ),
        w: 37,
        align: "center",
        get: (r) => r?.Operation_Mode,
      },
    ];
  }

  if (showData === "107") {
    return [
      {
        title: label(t, "deposit.reports.print.slNo", "SL. NO."),
        w: 16,
        align: "center",
        get: (_r, i) => String(i + 1),
      },
      {
        title: label(t, "deposit.reports.print.date", "DATE"),
        w: 28,
        align: "center",
        get: (r) => showDate(r?.Closing_Date),
      },
      {
        title: label(t, "deposit.reports.print.customerName", "CUSTOMER NAME"),
        w: 52,
        align: "left",
        get: (r) => r?.Full_Name,
        wrap: true,
      },
      {
        title: label(t, "deposit.reports.print.guardianName", "GUARDIAN NAME"),
        w: 48,
        align: "left",
        get: (r) => r?.Relation_Name,
        wrap: true,
      },
      {
        title: label(t, "deposit.reports.print.accountNo", "ACCOUNT NO."),
        w: 36,
        align: "center",
        get: (r) => r?.Account_No,
      },
      {
        title: label(t, "deposit.reports.print.refAcNo", "REF. AC. NO."),
        w: 30,
        align: "center",
        get: (r) => r?.Ref_Ac_No,
      },
      {
        title: label(t, "deposit.reports.print.lfNo", "L/F. NO."),
        w: 24,
        align: "center",
        get: (r) => r?.Ledg_Folio,
      },
      {
        title: label(
          t,
          "deposit.reports.print.operationMode",
          "OPERATION MODE",
        ),
        w: 51,
        align: "center",
        get: (r) => r?.Operation_Mode,
      },
    ];
  }

  if (showData === "109") {
    return [
      {
        title: label(t, "deposit.reports.print.slNo", "SL. NO."),
        w: 14,
        align: "center",
        get: (_r, i) => String(i + 1),
      },
      {
        title: label(t, "deposit.reports.print.date", "DATE"),
        w: 24,
        align: "center",
        get: (r) => showDate(r?.Trans_Date),
      },
      {
        title: label(t, "deposit.reports.print.customerName", "CUSTOMER NAME"),
        w: 32,
        align: "left",
        get: (r) => r?.Full_Name,
        wrap: true,
      },
      {
        title: label(t, "deposit.reports.print.accountNo", "ACCOUNT NO."),
        w: 28,
        align: "center",
        get: (r) => r?.Account_No,
      },
      {
        title: label(t, "deposit.reports.print.refAcNo", "REF. AC. NO."),
        w: 24,
        align: "center",
        get: (r) => r?.Ref_Ac_No,
      },
      {
        title: label(t, "deposit.reports.print.lfNo", "L/F. NO."),
        w: 18,
        align: "center",
        get: (r) => r?.Ledg_Folio,
      },
      {
        title: label(t, "deposit.reports.print.amount", "AMOUNT"),
        w: 22,
        align: "right",
        get: (r) => money(r?.Amount),
      },
      {
        title: label(t, "deposit.reports.print.narration", "NARRATION"),
        w: 36,
        align: "center",
        get: (r) => r?.Narration,
        wrap: true,
      },
    ];
  }

  if (showData === "106") {
    return [
      {
        title: label(t, "deposit.reports.print.slNo", "SL. NO."),
        w: 12,
        align: "center",
      },
      {
        title: label(t, "deposit.reports.print.customerName", "CUSTOMER NAME"),
        w: 40,
        align: "left",
        wrap: true,
      },
      {
        title: label(t, "deposit.reports.print.accountNo", "ACCOUNT NO."),
        w: 28,
        align: "center",
      },
      {
        title: label(t, "deposit.reports.print.refAcNo", "REF. AC. NO."),
        w: 22,
        align: "center",
      },
      {
        title: label(t, "deposit.reports.print.lfNo", "L/F. NO."),
        w: 16,
        align: "center",
      },
      {
        title: label(t, "deposit.reports.print.transMode", "TRANS. MODE"),
        w: 24,
        align: "center",
      },
      {
        title: label(t, "deposit.reports.print.deposit", "DEPOSIT"),
        w: 28,
        align: "right",
      },
      {
        title: label(t, "deposit.reports.print.withdrawn", "WITHDRAWN"),
        w: 28,
        align: "right",
      },
      {
        title: label(t, "deposit.reports.print.interest", "INTEREST"),
        w: 24,
        align: "right",
      },
      {
        title: label(t, "deposit.reports.print.narration", "NARRATION"),
        w: 63,
        align: "center",
        wrap: true,
      },
    ];
  }

  return [
    {
      title: label(t, "deposit.reports.print.slNo", "Sl"),
      w: 10,
      align: "center",
      get: (_r, i) => String(i + 1),
    },
    {
      title: label(t, "deposit.reports.print.customerName", "Customer"),
      w: 32,
      align: "left",
      get: (r) => r?.Full_Name,
      wrap: true,
    },
    {
      title: label(t, "deposit.reports.print.guardianName", "Guardian"),
      w: 30,
      align: "left",
      get: (r) => r?.Relation_Name,
      wrap: true,
    },
    {
      title: label(t, "deposit.reports.print.accNo", "A/c"),
      w: 22,
      align: "center",
      get: (r) => r?.Account_No,
    },
    {
      title: label(t, "deposit.reports.print.refAcNo", "Ref"),
      w: 16,
      align: "center",
      get: (r) => r?.Ref_Ac_No,
    },
    {
      title: label(t, "deposit.reports.print.lfNo", "LF"),
      w: 12,
      align: "center",
      get: (r) => r?.Ledg_Folio,
    },
    {
      title: label(t, "deposit.reports.print.openingDate", "Open"),
      w: 20,
      align: "center",
      get: (r) => showDate(r?.Opening_Date),
    },
    {
      title: label(t, "deposit.reports.print.roi", "ROI"),
      w: 12,
      align: "center",
      get: (r) => r?.ROI,
    },
    {
      title: label(t, "deposit.reports.print.maturityDate", "Mature"),
      w: 20,
      align: "center",
      get: (r) => showDate(r?.Maturity_Date),
    },
    {
      title: label(t, "deposit.reports.print.opening", "Opening"),
      w: 18,
      align: "right",
      get: (r) => money(r?.Opening),
    },
    {
      title: label(t, "deposit.reports.print.deposit", "Deposit"),
      w: 18,
      align: "right",
      get: (r) => money(r?.Deposit),
    },
    {
      title: label(t, "deposit.reports.print.withdrawn", "Withdrawn"),
      w: 20,
      align: "right",
      get: (r) => money(r?.Withdrwan),
    },
    {
      title: label(t, "deposit.reports.print.closing", "Closing"),
      w: 18,
      align: "right",
      get: (r) => money(r?.Closing),
    },
    {
      title: label(t, "deposit.reports.print.paidIntt", "Paid Intt"),
      w: 18,
      align: "right",
      get: (r) => money(r?.Paid_Intt),
    },
    {
      title: label(t, "deposit.reports.print.dueIntt", "Due Intt"),
      w: 19,
      align: "right",
      get: (r) => money(r?.Due_Intt),
    },
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
          txn?.Full_Name || "",
          txn?.Account_No || "",
          txn?.Ref_Ac_No || "",
          txn?.Ledg_Folio || "",
          txn?.Trans_Type || "",
          money(txn?.Deposit),
          money(txn?.Withdrwan),
          money(txn?.Interest),
          txn?.Narration || "",
        ],
      });
    });
    rows.push({
      values: [
        "",
        "Sub Total",
        money(group?.subtotalDeposit),
        money(group?.subtotalWithdrawn),
        money(group?.subtotalInterest),
        "",
      ],
      spans: [1, 5, 1, 1, 1, 1],
      bold: true,
      aligns: ["center", "right", "right", "right", "right", "center"],
    });
  });

  const grand = groups.find((group) => group?.isGrandTotal);
  if (grand) {
    rows.push({
      values: [
        "",
        "Grand Total",
        money(grand.grandTotalDeposit),
        money(grand.grandTotalWithdrawn),
        money(grand.grandTotalInterest),
        "",
      ],
      spans: [1, 5, 1, 1, 1, 1],
      bold: true,
      aligns: ["center", "right", "right", "right", "right", "center"],
    });
  }
  return rows;
};

export const downloadDepositReportPdf = async ({
  showData,
  tableData,
  fromDate,
  toDate,
  docTitle,
  t,
  totals,
  onProgress,
}) => {
  const isLandscape = showData !== "109";
  const doc = openPdf(isLandscape ? "landscape" : "portrait");

  const range = `${fromDate ? showDate(fromDate) : ""} To ${toDate ? showDate(toDate) : ""}`;
  const titles = {
    105: `Account Opening Register From ${range}`,
    106: `Deposit Transaction Register From ${range}`,
    107: `Account Closing Register From ${range}`,
    108: `Account Detailed List From ${range}`,
    109: `Interest Ledger From ${range}`,
  };

  const title = titles[showData] || "Deposit Report";

  const meta = orgMeta(title, t);
  meta.generatedBy = `Generated By:`;
  meta.generatedOn = `Generated On:`;
  meta.generatedNote = `This report is generated by PrioSuite.`;

  const columns = buildColumns(
    showData,
    t || ((key, fallback) => fallback || key),
  );
  let rows = [];

  if (showData === "106") {
    rows = flattenTransactions(tableData);
  } else {
    (tableData || []).forEach((r, i) => {
      rows.push({
        values: columns.map((c) => c.get?.(r, i) ?? ""),
      });
    });

    if (showData === "108") {
      rows.push({
        values: [
          "Total",
          money(totals?.totalOpening),
          money(totals?.totalDeposit),
          money(totals?.totalWithdrawn),
          money(totals?.totalClosing),
          money(totals?.totalPaidIntt),
          money(totals?.totalDueIntt),
        ],
        spans: [9, 1, 1, 1, 1, 1, 1],
        bold: true,
        aligns: ["right", "right", "right", "right", "right", "right", "right"],
      });
    } else if (showData === "109" && totals?.totalAmount != null) {
      rows.push({
        values: ["Total", money(totals.totalAmount), ""],
        spans: [6, 1, 1],
        bold: true,
        aligns: ["right", "right", "center"],
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
