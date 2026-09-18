# -*- coding: utf-8 -*-
"""Wire static i18n into daybook index.jsx."""
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "components" / "report" / "daybook" / "index.jsx"
t = p.read_text(encoding="utf-8")

if "react-i18next" not in t:
    t = t.replace(
        '"use client";\n',
        '"use client";\nimport { useTranslation } from "react-i18next";\n',
        1,
    )

if "const { t } = useTranslation()" not in t:
    t = t.replace(
        "  lastPage,\n}) => {\n  const [showReportForm, setShowReportForm] = useState(true);",
        "  lastPage,\n}) => {\n  const { t } = useTranslation();\n  const [showReportForm, setShowReportForm] = useState(true);",
        1,
    )

repls = [
    (
        'toast.error("Nothing to download. Please generate the report first.");',
        'toast.error(t("report.daybook.nothingToDownload"));',
    ),
    (
        'toast.error("No daybook data to download.");',
        'toast.error(t("report.daybook.noDaybookData"));',
    ),
    (
        'toast.error("Failed to capture report for PDF.");',
        'toast.error(t("report.daybook.failedToCapturePdf"));',
    ),
    (
        'toast.success("PDF downloaded");',
        'toast.success(t("report.daybook.pdfDownloaded"));',
    ),
    (
        """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
        """error?.message
          ? `${t("report.daybook.failedToDownloadPdf")}: ${error.message}`
          : t("report.daybook.failedToDownloadPdf"),""",
    ),
    (
        '<h3 className="text-xl font-semibold ">Daybook Report</h3>',
        '<h3 className="text-xl font-semibold ">{t("report.daybook.daybookReport")}</h3>',
    ),
    ('label="Date"', 'label={t("common.date")}'),
    ('label="Branch"', 'label={t("common.branch")}'),
    ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
    (
        'searchPlaceholder="Search branch..."',
        'searchPlaceholder={t("common.searchBranch")}',
    ),
    (
        """            <p className="self-end pr-5">
              <span className="font-semibold">
                Closing Cash Balance in Word :{" "}
              </span>
              {cashBalanceData &&
              cashBalanceData.Closing &&
              parseFloat(cashBalanceData.Closing) > 0
                ? `Rupees ${convertToWords(
                    Number(cashBalanceData.Closing),
                  )} Only`
                : ""}
            </p>""",
        """            <p className="self-end pr-5">
              <span className="font-semibold">
                {t("report.daybook.closingCashBalanceInWord")}{" "}
              </span>
              {cashBalanceData &&
              cashBalanceData.Closing &&
              parseFloat(cashBalanceData.Closing) > 0
                ? `${t("common.rupees")} ${convertToWords(
                    Number(cashBalanceData.Closing),
                  )} ${t("common.only")}`
                : ""}
            </p>""",
    ),
    (
        "<p>Physical Denomination</p>",
        '<p>{t("report.daybook.physicalDenomination")}</p>',
    ),
    (
        """            <DialogTitle className="w-full text-center">
              List Of Vouchers For The Day On {toDate}
            </DialogTitle>""",
        """            <DialogTitle className="w-full text-center">
              {t("report.daybook.listOfVouchersForTheDayOn")} {toDate}
            </DialogTitle>""",
    ),
    (
        "<TableHead>Voucher No.</TableHead>",
        '<TableHead>{t("report.daybook.voucherNo")}</TableHead>',
    ),
    (
        "<TableHead>Transanction Type</TableHead>",
        '<TableHead>{t("report.daybook.transactionType")}</TableHead>',
    ),
    (
        "<TableHead>Receipts</TableHead>",
        '<TableHead>{t("report.daybook.receiptsLabel")}</TableHead>',
    ),
    (
        "<TableHead>Narration</TableHead>",
        '<TableHead>{t("report.daybook.narration")}</TableHead>',
    ),
    (
        """                          >
                            Previous
                          </Button>""",
        """                          >
                            {t("report.daybook.previous")}
                          </Button>""",
    ),
    (
        """                          >
                            Next
                          </Button>""",
        """                          >
                            {t("report.daybook.next")}
                          </Button>""",
    ),
    (
        """                  >
                    Print
                  </Button>""",
        """                  >
                    {t("report.daybook.printBtn")}
                  </Button>""",
    ),
    (
        """                    <p>
                      <span className="font-semibold">Voucher Type :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_type}
                    </p>
                    <p>
                      <span className="font-semibold">Voucher No. :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">Ref. Vc. No :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Ref_Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">Voucher Date :</span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0].Trans_Date &&
                        format(voucherDetailsData[0].Trans_Date, "dd-MM-yyyy")}
                    </p>""",
        """                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.voucherType")} :
                      </span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_type}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.voucherNo")} :
                      </span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.refVcNo")} :
                      </span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0]?.Ref_Vouch_No}
                    </p>
                    <p>
                      <span className="font-semibold">
                        {t("report.daybook.voucherDate")} :
                      </span>{" "}
                      {voucherDetailsData &&
                        voucherDetailsData.length > 0 &&
                        voucherDetailsData[0].Trans_Date &&
                        format(voucherDetailsData[0].Trans_Date, "dd-MM-yyyy")}
                    </p>""",
    ),
    (
        '<TableHead className="w-[100px]">Sl.</TableHead>\n                          <TableHead>Head Of Account</TableHead>\n                          <TableHead>Dr. Amount</TableHead>\n                          <TableHead>Cr. Amount</TableHead>',
        '<TableHead className="w-[100px]">{t("report.daybook.sl")}</TableHead>\n                          <TableHead>{t("report.daybook.headOfAccount")}</TableHead>\n                          <TableHead>{t("report.daybook.drAmount")}</TableHead>\n                          <TableHead>{t("report.daybook.crAmount")}</TableHead>',
    ),
    (
        '<TableHead className="w-[100px]">Sl.</TableHead>',
        '<TableHead className="w-[100px]">{t("report.daybook.sl")}</TableHead>',
    ),
    (
        """                        <TableRow>
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell>{totalDrAmount}</TableCell>
                          <TableCell>{totalCrAmount}</TableCell>
                        </TableRow>""",
        """                        <TableRow>
                          <TableCell colSpan={2}>
                            {t("report.daybook.total")}
                          </TableCell>
                          <TableCell>{totalDrAmount}</TableCell>
                          <TableCell>{totalCrAmount}</TableCell>
                        </TableRow>""",
    ),
    (
        """                  <p>
                    <span className="font-semibold">Narration : </span>
                    {voucherDetailsData &&
                      voucherDetailsData.length > 0 &&
                      voucherDetailsData[0]?.Particular}
                  </p>""",
        """                  <p>
                    <span className="font-semibold">
                      {t("report.daybook.narration")} :{" "}
                    </span>
                    {voucherDetailsData &&
                      voucherDetailsData.length > 0 &&
                      voucherDetailsData[0]?.Particular}
                  </p>""",
    ),
]

for old, new in repls:
    if old not in t:
        print("MISSING:", old[:80].replace("\n", " "))
    else:
        t = t.replace(old, new)
        print("OK:", old[:50].replace("\n", " "))

# Table header label lines (appear twice for V.NO / PARTICULARS / CASH / TRANSFER / TOTAL)
label_repls = [
    ("                      V. NO.\n", '                      {t("report.daybook.vNo")}\n'),
    (
        "                      PARTICULARS\n",
        '                      {t("report.daybook.particulars")}\n',
    ),
    (
        "                      RECEIPTS\n",
        '                      {t("report.daybook.receipts")}\n',
    ),
    (
        "                      PAYMENTS\n",
        '                      {t("report.daybook.payments")}\n',
    ),
    ("                      CASH\n", '                      {t("report.daybook.cash")}\n'),
    (
        "                      TRANSFER\n",
        '                      {t("report.daybook.transfer")}\n',
    ),
    (
        "                      TOTAL\n",
        '                      {t("report.daybook.totalUpper")}\n',
    ),
    ("                      Total\n", '                      {t("report.daybook.total")}\n'),
    (
        "                      Opening Balance\n",
        '                      {t("report.daybook.openingBalance")}\n',
    ),
    (
        "                      Closing Balance\n",
        '                      {t("report.daybook.closingBalance")}\n',
    ),
    (
        "                      Grand Total\n",
        '                      {t("report.daybook.grandTotal")}\n',
    ),
]

for old, new in label_repls:
    c = t.count(old)
    t = t.replace(old, new)
    print(f"label {old.strip()!r}: {c}")

p.write_text(t, encoding="utf-8")
print("done")
