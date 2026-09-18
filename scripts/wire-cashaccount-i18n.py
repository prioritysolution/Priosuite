# -*- coding: utf-8 -*-
"""Wire static i18n into cashAccount index.jsx and PreviewModal.jsx."""
from pathlib import Path

CA = Path(__file__).resolve().parents[1] / "components" / "report" / "cashAccount"


def wire_index():
    p = CA / "index.jsx"
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
            'toast.error(t("report.cashAccount.nothingToDownload"));',
        ),
        (
            'toast.error("No cash account data to download.");',
            'toast.error(t("report.cashAccount.noDataToDownload"));',
        ),
        (
            'toast.error("Failed to capture report for PDF.");',
            'toast.error(t("report.cashAccount.failedToCapturePdf"));',
        ),
        (
            'toast.success("PDF downloaded");',
            'toast.success(t("report.cashAccount.pdfDownloaded"));',
        ),
        (
            """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
            """error?.message
          ? `${t("report.cashAccount.failedToDownloadPdf")}: ${error.message}`
          : t("report.cashAccount.failedToDownloadPdf"),""",
        ),
        (
            '<h3 className="text-xl font-semibold ">Cash Account Report</h3>',
            '<h3 className="text-xl font-semibold ">{t("report.cashAccount.cashAccountReport")}</h3>',
        ),
        ('label="From Date"', 'label={t("common.fromDate")}'),
        ('label="To Date"', 'label={t("common.toDate")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        (
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      RECEIPT
                    </TableHead>""",
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      {t("report.cashAccount.print.receipt")}
                    </TableHead>""",
        ),
        (
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      PAYMENT
                    </TableHead>""",
            """                    <TableHead colSpan={5} className=" text-white text-center">
                      {t("report.cashAccount.print.payment")}
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
                {t("report.cashAccount.closingCashBalanceInWord")} :{" "}
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
            "<p>Denomination table</p>",
            '<p>{t("report.cashAccount.denominationTable")}</p>',
        ),
        (
            """            <DialogTitle className="w-full text-center">
              List Of Vouchers For The Day On {toDate}
            </DialogTitle>""",
            """            <DialogTitle className="w-full text-center">
              {t("report.cashAccount.listOfVouchersForTheDayOn")} {toDate}
            </DialogTitle>""",
        ),
        (
            """                  <TableRow>
                    <TableHead className="w-[100px]">Sl.</TableHead>
                    <TableHead>Voucher No.</TableHead>
                    <TableHead>Transanction Type</TableHead>
                    <TableHead>Receipts</TableHead>
                    <TableHead>Narration</TableHead>
                  </TableRow>""",
            """                  <TableRow>
                    <TableHead className="w-[100px]">
                      {t("common.sl")}
                    </TableHead>
                    <TableHead>{t("voucher.voucherNo")}</TableHead>
                    <TableHead>
                      {t("report.cashAccount.transactionType")}
                    </TableHead>
                    <TableHead>{t("common.receipts")}</TableHead>
                    <TableHead>{t("common.narration")}</TableHead>
                  </TableRow>""",
        ),
        (
            """              <p>
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
            """              <p>
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
            """                  <TableRow>
                    <TableHead className="w-[100px]">Sl.</TableHead>
                    <TableHead>Head Of Account</TableHead>
                    <TableHead>Dr. Amount</TableHead>
                    <TableHead>Cr. Amount</TableHead>
                  </TableRow>""",
            """                  <TableRow>
                    <TableHead className="w-[100px]">
                      {t("common.sl")}
                    </TableHead>
                    <TableHead>{t("common.headOfAccount")}</TableHead>
                    <TableHead>{t("common.drAmount")}</TableHead>
                    <TableHead>{t("common.crAmount")}</TableHead>
                  </TableRow>""",
        ),
        (
            """                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell>{totalDrAmount}</TableCell>
                    <TableCell>{totalCrAmount}</TableCell>
                  </TableRow>""",
            """                  <TableRow>
                    <TableCell colSpan={2}>{t("common.total")}</TableCell>
                    <TableCell>{totalDrAmount}</TableCell>
                    <TableCell>{totalCrAmount}</TableCell>
                  </TableRow>""",
        ),
        (
            """            <p>
              <span className="font-semibold">Narration : </span>
              {voucherDetailsData &&
                voucherDetailsData.length > 0 &&
                voucherDetailsData[0]?.Particular}
            </p>""",
            """            <p>
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
            print("INDEX OK:", old[:45].replace("\n", " "))

    label_repls = [
        (
            "                      V. No.\n",
            '                      {t("report.cashAccount.vNo")}\n',
        ),
        (
            "                      NAME OF LEDGER\n",
            '                      {t("report.cashAccount.nameOfLedger")}\n',
        ),
        (
            "                      CASH\n",
            '                      {t("report.cashAccount.print.cash")}\n',
        ),
        (
            "                      TRANSFER\n",
            '                      {t("report.cashAccount.print.transfer")}\n',
        ),
        (
            "                      TOTAL\n",
            '                      {t("report.cashAccount.print.total")}\n',
        ),
        (
            "                      Total\n",
            '                      {t("common.total")}\n',
        ),
        (
            "                      Opening Balance\n",
            '                      {t("common.openingBalance")}\n',
        ),
        (
            "                      Closing Balance\n",
            '                      {t("common.closingBalance")}\n',
        ),
        (
            "                      Grand Total\n",
            '                      {t("common.grandTotal")}\n',
        ),
    ]
    for old, new in label_repls:
        c = t.count(old)
        t = t.replace(old, new)
        print(f"INDEX label {old.strip()!r}: {c}")

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = CA / "PreviewModal.jsx"
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
            """              <p className="text-sm">
                Cash Account From {fromDate} To {toDate}
              </p>""",
            """              <p className="text-sm">
                {t("report.cashAccount.cashAccountFrom")} {fromDate}{" "}
                {t("common.to")} {toDate}
              </p>""",
        ),
        (
            """                            V. NO.
                          </TableHead>
                          <TableHead
                            rowSpan={2}
                            className="border border-black text-black !h-auto p-1 text-center align-middle font-semibold whitespace-normal"
                          >
                            PARTICULARS
                          </TableHead>
                          <TableHead
                            colSpan={3}
                            className="border border-black text-black !h-[28px] p-1 text-center align-middle font-semibold"
                          >
                            {tableIndex === 0 ? "RECEIPTS" : "PAYMENTS"}
                          </TableHead>
                        </TableRow>
                        <TableRow className="border-0 hover:bg-transparent">
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            CASH
                          </TableHead>
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            TRANSFER
                          </TableHead>
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            TOTAL
                          </TableHead>""",
            """                            {t("report.cashAccount.print.vNo")}
                          </TableHead>
                          <TableHead
                            rowSpan={2}
                            className="border border-black text-black !h-auto p-1 text-center align-middle font-semibold whitespace-normal"
                          >
                            {t("report.cashAccount.print.particulars")}
                          </TableHead>
                          <TableHead
                            colSpan={3}
                            className="border border-black text-black !h-[28px] p-1 text-center align-middle font-semibold"
                          >
                            {tableIndex === 0
                              ? t("report.cashAccount.print.receipts")
                              : t("report.cashAccount.print.payments")}
                          </TableHead>
                        </TableRow>
                        <TableRow className="border-0 hover:bg-transparent">
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            {t("report.cashAccount.print.cash")}
                          </TableHead>
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            {t("report.cashAccount.print.transfer")}
                          </TableHead>
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            {t("report.cashAccount.print.total")}
                          </TableHead>""",
        ),
        (
            """                              Total
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalCashReceived}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferReceived}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalReceived}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              Opening Balance
                            </TableCell>""",
            """                              {t("common.total")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalCashReceived}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferReceived}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalReceived}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.openingBalance")}
                            </TableCell>""",
        ),
        (
            """                              Grand Total
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalCashReceived) +
                                (cashBalanceData && cashBalanceData.Opening
                                  ? parseFloat(cashBalanceData.Opening)
                                  : 0)}
                            </TableCell>""",
            """                              {t("common.grandTotal")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalCashReceived) +
                                (cashBalanceData && cashBalanceData.Opening
                                  ? parseFloat(cashBalanceData.Opening)
                                  : 0)}
                            </TableCell>""",
        ),
        (
            """                              Total
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalCashPayment}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferPayment}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalPayment}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              Closing Balance
                            </TableCell>""",
            """                              {t("common.total")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalCashPayment}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferPayment}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalPayment}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.closingBalance")}
                            </TableCell>""",
        ),
        (
            """                              Grand Total
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalCashPayment) +
                                (cashBalanceData && cashBalanceData.Closing
                                  ? parseFloat(cashBalanceData.Closing)
                                  : 0)}
                            </TableCell>""",
            """                              {t("common.grandTotal")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalCashPayment) +
                                (cashBalanceData && cashBalanceData.Closing
                                  ? parseFloat(cashBalanceData.Closing)
                                  : 0)}
                            </TableCell>""",
        ),
        (
            """                <p className="shrink-0 h-8 border-t border-black w-full text-[11px] flex justify-end items-center px-2 bg-white">
                  Closing Balance In Words:{" "}
                  {cashBalanceData?.Closing &&
                  parseFloat(cashBalanceData.Closing) > 0
                    ? `Rupees ${convertToWords(
                        Number(cashBalanceData.Closing),
                      )} Only`
                    : "Zero"}
                </p>""",
            """                <p className="shrink-0 h-8 border-t border-black w-full text-[11px] flex justify-end items-center px-2 bg-white">
                  {t("report.cashAccount.closingBalanceInWords")}:{" "}
                  {cashBalanceData?.Closing &&
                  parseFloat(cashBalanceData.Closing) > 0
                    ? `${t("common.rupees")} ${convertToWords(
                        Number(cashBalanceData.Closing),
                      )} ${t("common.only")}`
                    : t("common.zero")}
                </p>""",
        ),
        (
            """            <div className="shrink-0 w-full h-[28px] mt-2 flex items-center justify-between px-2 text-xs">
              <p className="text-nowrap">Generated By : {userName}</p>
              <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
                This report is generated by PrioSuite.
              </p>
              <p className="text-nowrap">
                Generated On : {currentDate} {currentTime}
              </p>
            </div>""",
            """            <div className="shrink-0 w-full h-[28px] mt-2 flex items-center justify-between px-2 text-xs">
              <p className="text-nowrap">
                {t("common.generatedBy")} : {userName}
              </p>
              <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
                {t("common.thisReportIsGeneratedByPrioSuite")}
              </p>
              <p className="text-nowrap">
                {t("common.generatedOn")} : {currentDate} {currentTime}
              </p>
            </div>""",
        ),
        (
            """          <p className="text-[11px] text-center flex items-center justify-center h-[40px]">
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
            """          <p className="text-[11px] text-center flex items-center justify-center h-[40px]">
            {t("report.cashAccount.physicalDenomination")}
          </p>
          <Table className="w-full border border-black text-[11px]">
            <TableHeader>
              <TableRow className=" text-black  h-[40px] ">
                <TableHead className=" border-black text-black p-0 text-center w-[50px]">
                  {t("report.cashAccount.print.slNo")}
                </TableHead>
                <TableHead className=" border-black text-black p-0 border-x  text-center w-[100px]">
                  {t("report.cashAccount.print.denomination")}
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  {t("report.cashAccount.print.quantity")}
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  {t("report.cashAccount.print.value")}
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
            """        <div className="shrink-0 w-full h-[28px] mt-auto flex items-center justify-between px-2 text-xs">
          <p className="text-nowrap">Generated By : {userName}</p>
          <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
            This report is generated by PrioSuite.
          </p>
          <p className="text-nowrap">
            Generated On : {currentDate} {currentTime}
          </p>
        </div>""",
            """        <div className="shrink-0 w-full h-[28px] mt-auto flex items-center justify-between px-2 text-xs">
          <p className="text-nowrap">
            {t("common.generatedBy")} : {userName}
          </p>
          <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
            {t("common.thisReportIsGeneratedByPrioSuite")}
          </p>
          <p className="text-nowrap">
            {t("common.generatedOn")} : {currentDate} {currentTime}
          </p>
        </div>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("PREVIEW MISSING:", old[:70].replace("\n", " "))
        else:
            t = t.replace(old, new)
            print("PREVIEW OK:", old[:45].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("preview done")


if __name__ == "__main__":
    wire_index()
    wire_preview()
