# -*- coding: utf-8 -*-
"""Wire static i18n into cashbook index.jsx and PreviewModal.jsx."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CB = ROOT / "components" / "report" / "cashbook"


def wire_index():
    p = CB / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n',
            '"use client";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )

    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  denomData,\n}) => {\n  const [showReportForm, setShowReportForm] = useState(true);",
            "  denomData,\n}) => {\n  const { t } = useTranslation();\n  const [showReportForm, setShowReportForm] = useState(true);",
            1,
        )

    repls = [
        (
            'toast.error("Nothing to download. Please generate the report first.");',
            'toast.error(t("report.cashbook.nothingToDownload"));',
        ),
        (
            'toast.error("No cashbook data to download.");',
            'toast.error(t("report.cashbook.noDataToDownload"));',
        ),
        (
            'toast.error("Failed to capture report for PDF.");',
            'toast.error(t("report.cashbook.failedToCapturePdf"));',
        ),
        (
            'toast.success("PDF downloaded");',
            'toast.success(t("report.cashbook.pdfDownloaded"));',
        ),
        (
            """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
            """error?.message
          ? `${t("report.cashbook.failedToDownloadPdf")}: ${error.message}`
          : t("report.cashbook.failedToDownloadPdf"),""",
        ),
        (
            '<h3 className="text-xl font-semibold ">Cashbook Report</h3>',
            '<h3 className="text-xl font-semibold ">{t("report.cashbook.cashbookReport")}</h3>',
        ),
        ('label="Date"', 'label={t("common.date")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        (
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      Receipt
                    </TableHead>""",
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      {t("report.cashbook.receipt")}
                    </TableHead>""",
        ),
        (
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      Payment
                    </TableHead>""",
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      {t("report.cashbook.payment")}
                    </TableHead>""",
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
                {t("report.cashbook.closingCashBalanceInWords")} :{" "}
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
            '<p>{t("report.cashbook.physicalDenomination")}</p>',
        ),
        (
            """              >
                Print
              </Button>""",
            """              >
                {t("common.print")}
              </Button>""",
        ),
        (
            """                <p>
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
            """                <p>
                  <span className="font-semibold">
                    {t("voucher.voucherType")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0]?.Vouch_type}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("voucher.voucherNo")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0]?.Vouch_No}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("voucher.refVcNo")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0]?.Ref_Vouch_No}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("common.voucherDate")} :
                  </span>{" "}
                  {voucherDetailsData &&
                    voucherDetailsData.length > 0 &&
                    voucherDetailsData[0].Trans_Date &&
                    format(voucherDetailsData[0].Trans_Date, "dd-MM-yyyy")}
                </p>""",
        ),
        (
            """                    <TableRow>
                      <TableHead className="w-[100px]">Sl.</TableHead>
                      <TableHead>Head Of Account</TableHead>
                      <TableHead>Dr. Amount</TableHead>
                      <TableHead>Cr. Amount</TableHead>
                    </TableRow>""",
            """                    <TableRow>
                      <TableHead className="w-[100px]">
                        {t("common.sl")}
                      </TableHead>
                      <TableHead>{t("common.headOfAccount")}</TableHead>
                      <TableHead>{t("common.drAmount")}</TableHead>
                      <TableHead>{t("common.crAmount")}</TableHead>
                    </TableRow>""",
        ),
        (
            """                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell>{totalDrAmount}</TableCell>
                      <TableCell>{totalCrAmount}</TableCell>
                    </TableRow>""",
            """                    <TableRow>
                      <TableCell colSpan={2}>
                        {t("common.total")}
                      </TableCell>
                      <TableCell>{totalDrAmount}</TableCell>
                      <TableCell>{totalCrAmount}</TableCell>
                    </TableRow>""",
        ),
        (
            """              <p>
                <span className="font-semibold">Narration : </span>
                {voucherDetailsData &&
                  voucherDetailsData.length > 0 &&
                  voucherDetailsData[0]?.Particular}
              </p>""",
            """              <p>
                <span className="font-semibold">
                  {t("common.narration")} :{" "}
                </span>
                {voucherDetailsData &&
                  voucherDetailsData.length > 0 &&
                  voucherDetailsData[0]?.Particular}
              </p>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("INDEX MISSING:", old[:70].replace("\n", " "))
        else:
            t = t.replace(old, new)
            print("INDEX OK:", old[:50].replace("\n", " "))

    # Repeated table column headers (2 tables)
    label_repls = [
        (
            "                      SL. NO.\n",
            '                      {t("report.cashbook.slNo")}\n',
        ),
        (
            "                      Vouch No.\n",
            '                      {t("report.cashbook.vouchNo")}\n',
        ),
        (
            "                      Ledger Name\n",
            '                      {t("report.cashbook.ledgerName")}\n',
        ),
        (
            "                      PARTICULARS\n",
            '                      {t("report.cashbook.particulars")}\n',
        ),
        (
            "                      AMOUNT\n",
            '                      {t("report.cashbook.amount")}\n',
        ),
        (
            "                      Total\n",
            '                      {t("report.cashbook.total")}\n',
        ),
        (
            "                      Opening Balance\n",
            '                      {t("report.cashbook.openingBalance")}\n',
        ),
        (
            "                      Closing Balance\n",
            '                      {t("report.cashbook.closingBalance")}\n',
        ),
    ]
    for old, new in label_repls:
        c = t.count(old)
        t = t.replace(old, new)
        print(f"INDEX label {old.strip()!r}: {c}")

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = CB / "PreviewModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )

    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  cashBalanceData,\n}) => {\n  const [userName, setUserName] = useState(\"\");",
            "  cashBalanceData,\n}) => {\n  const { t } = useTranslation();\n\n  const [userName, setUserName] = useState(\"\");",
            1,
        )

    repls = [
        (
            '<p className="text-sm">Cashbook As On {toDate}</p>',
            '<p className="text-sm">\n                {t("report.cashbook.cashbookAsOn")} {toDate}\n              </p>',
        ),
        (
            '{tableIndex === 0 ? "RECEIPT" : "PAYMENT"}',
            '{tableIndex === 0\n                              ? t("report.cashbook.print.receipt")\n                              : t("report.cashbook.print.payment")}',
        ),
        (
            """                          <TableHead className=" border-black text-black p-0 text-center h-[40px] w-[30px]">
                            SL.
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[80px]">
                            Vouch No.
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[120px]">
                            Ledger Name
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px]">
                            PARTICULARS
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[100px]">
                            AMOUNT
                          </TableHead>""",
            """                          <TableHead className=" border-black text-black p-0 text-center h-[40px] w-[30px]">
                            {t("report.cashbook.print.sl")}
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[80px]">
                            {t("report.cashbook.print.vouchNo")}
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[120px]">
                            {t("report.cashbook.print.ledgerName")}
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px]">
                            {t("report.cashbook.print.particulars")}
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[100px]">
                            {t("report.cashbook.print.amount")}
                          </TableHead>""",
        ),
        (
            """                              Total
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {totalReceived?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white  h-[40px]">
                            <TableCell
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              Opening Balance
                            </TableCell>""",
            """                              {t("common.total")}
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {totalReceived?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white  h-[40px]">
                            <TableCell
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              {t("common.openingBalance")}
                            </TableCell>""",
        ),
        (
            """                              Total
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {totalPayment?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white  h-[40px]">
                            <TableCell
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              Closing Balance
                            </TableCell>""",
            """                              {t("common.total")}
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {totalPayment?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white  h-[40px]">
                            <TableCell
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              {t("common.closingBalance")}
                            </TableCell>""",
        ),
        (
            """              <p className="h-8 border border-t-0 border-black w-full text-[11px] flex self-end justify-end items-center px-2">
                Closing Balance In Words:{" "}
                {cashBalanceData?.Closing &&
                parseFloat(cashBalanceData.Closing) > 0
                  ? `Rupees ${convertToWords(
                      Number(cashBalanceData.Closing),
                    )} Only`
                  : "Zero"}
              </p>""",
            """              <p className="h-8 border border-t-0 border-black w-full text-[11px] flex self-end justify-end items-center px-2">
                {t("report.cashbook.closingBalanceInWords")}:{" "}
                {cashBalanceData?.Closing &&
                parseFloat(cashBalanceData.Closing) > 0
                  ? `${t("common.rupees")} ${convertToWords(
                      Number(cashBalanceData.Closing),
                    )} ${t("common.only")}`
                  : t("common.zero")}
              </p>""",
        ),
        (
            """            <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
              <p className="text-nowrap">Generated By : {userName}</p>
              <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
                This report is generated by PrioSuite.
              </p>
              <p className="text-nowrap">
                Generated On : {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
      <div
        data-print-page="true"
        className="w-full h-[210mm] relative py-5 bg-white"
      >
        <div className="w-[350px] ml-20">
          <p className="text-[11px] text-center flex items-center justify-center h-[40px]">
            Physical Denomination
          </p>
          <Table className="w-full border border-black text-[11px]">
            <TableHeader>
              <TableRow className=" text-black  h-[40px] ">
                <TableHead className=" border-black text-black p-0 text-center w-[50px]">
                  Sl. NO.
                </TableHead>
                <TableHead className=" border-black text-black p-0 border-x  text-center w-[100px]">
                  Denomination
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  Quantity
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>""",
            """            <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
              <p className="text-nowrap">
                {t("common.generatedBy")} : {userName}
              </p>
              <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
                {t("common.thisReportIsGeneratedByPrioSuite")}
              </p>
              <p className="text-nowrap">
                {t("common.generatedOn")} : {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
      <div
        data-print-page="true"
        className="w-full h-[210mm] relative py-5 bg-white"
      >
        <div className="w-[350px] ml-20">
          <p className="text-[11px] text-center flex items-center justify-center h-[40px]">
            {t("report.cashbook.physicalDenomination")}
          </p>
          <Table className="w-full border border-black text-[11px]">
            <TableHeader>
              <TableRow className=" text-black  h-[40px] ">
                <TableHead className=" border-black text-black p-0 text-center w-[50px]">
                  {t("report.cashbook.print.slNo")}
                </TableHead>
                <TableHead className=" border-black text-black p-0 border-x  text-center w-[100px]">
                  {t("report.cashbook.print.denomination")}
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  {t("report.cashbook.print.quantity")}
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  {t("report.cashbook.print.value")}
                </TableHead>
              </TableRow>
            </TableHeader>""",
        ),
        (
            """                <TableCell
                  className="border border-black p-0 text-center"
                  colSpan={2}
                >
                  Total
                </TableCell>""",
            """                <TableCell
                  className="border border-black p-0 text-center"
                  colSpan={2}
                >
                  {t("common.total")}
                </TableCell>""",
        ),
        (
            """        <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
          <p className="text-nowrap">Generated By : {userName}</p>
          <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
            This report is generated by PrioSuite.
          </p>
          <p className="text-nowrap">
            Generated On : {currentDate} {currentTime}
          </p>
        </div>
      </div>
    </div>
  );
};
export default PreviewModal;""",
            """        <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
          <p className="text-nowrap">
            {t("common.generatedBy")} : {userName}
          </p>
          <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
            {t("common.thisReportIsGeneratedByPrioSuite")}
          </p>
          <p className="text-nowrap">
            {t("common.generatedOn")} : {currentDate} {currentTime}
          </p>
        </div>
      </div>
    </div>
  );
};
export default PreviewModal;""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("PREVIEW MISSING:", old[:70].replace("\n", " "))
        else:
            t = t.replace(old, new)
            print("PREVIEW OK:", old[:50].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("preview done")


if __name__ == "__main__":
    wire_index()
    wire_preview()
