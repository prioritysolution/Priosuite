# -*- coding: utf-8 -*-
"""Insert report.trialBalance locales and wire trailBalance components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
TB = ROOT / "components" / "report" / "trailBalance"


def js_obj(d, indent=8):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


TRIAL = {
    "en": {
        "trialBalanceReport": "Trial Balance Report",
        "trialBalanceFromTo": "Trial Balance From {{fromDate}} To {{toDate}}",
        "liabilitiesAndIncome": "LIABILITIES & INCOME",
        "liabilitiesAndIncomeTitle": "Liabilities & Income",
        "assetsAndExpenditure": "ASSETS & EXPENDITURE",
        "assetsAndExpenses": "Assets & Expenses",
        "noTrialBalanceData": "No trial balance data to download.",
        "nothingToDownload": "Nothing to download. Please generate the report first.",
        "failedToCapturePdf": "Failed to capture report for PDF.",
        "pdfDownloaded": "PDF downloaded",
        "failedToDownloadPdfWithError": "Failed to download PDF: {{error}}",
        "failedToDownloadPdf": "Failed to download PDF",
    },
    "hi": {
        "trialBalanceReport": "ट्रायल बैलेंस रिपोर्ट",
        "trialBalanceFromTo": "{{fromDate}} से {{toDate}} तक ट्रायल बैलेंस",
        "liabilitiesAndIncome": "देयताएं और आय",
        "liabilitiesAndIncomeTitle": "देयताएं और आय",
        "assetsAndExpenditure": "संपत्तियां और व्यय",
        "assetsAndExpenses": "संपत्तियां और व्यय",
        "noTrialBalanceData": "डाउनलोड करने के लिए कोई ट्रायल बैलेंस डेटा नहीं है।",
        "nothingToDownload": "डाउनलोड करने के लिए कुछ नहीं है। कृपया पहले रिपोर्ट तैयार करें।",
        "failedToCapturePdf": "PDF के लिए रिपोर्ट कैप्चर करने में विफल।",
        "pdfDownloaded": "PDF डाउनलोड हो गई",
        "failedToDownloadPdfWithError": "PDF डाउनलोड करने में विफल: {{error}}",
        "failedToDownloadPdf": "PDF डाउनलोड करने में विफल",
    },
    "bn": {
        "trialBalanceReport": "ট্রায়াল ব্যালেন্স রিপোর্ট",
        "trialBalanceFromTo": "{{fromDate}} থেকে {{toDate}} পর্যন্ত ট্রায়াল ব্যালেন্স",
        "liabilitiesAndIncome": "দায় এবং আয়",
        "liabilitiesAndIncomeTitle": "দায় এবং আয়",
        "assetsAndExpenditure": "সম্পদ এবং ব্যয়",
        "assetsAndExpenses": "সম্পদ এবং ব্যয়",
        "noTrialBalanceData": "ডাউনলোড করার জন্য কোনো ট্রায়াল ব্যালেন্স ডেটা নেই।",
        "nothingToDownload": "ডাউনলোড করার মতো কিছু নেই। অনুগ্রহ করে প্রথমে রিপোর্ট তৈরি করুন।",
        "failedToCapturePdf": "PDF-এর জন্য রিপোর্ট ক্যাপচার করতে ব্যর্থ।",
        "pdfDownloaded": "PDF ডাউনলোড হয়েছে",
        "failedToDownloadPdfWithError": "PDF ডাউনলোড করতে ব্যর্থ: {{error}}",
        "failedToDownloadPdf": "PDF ডাউনলোড করতে ব্যর্থ",
    },
    "or": {
        "trialBalanceReport": "ଟ୍ରାଏଲ୍ ବାଲାନ୍ସ ରିପୋର୍ଟ",
        "trialBalanceFromTo": "{{fromDate}} ରୁ {{toDate}} ପର୍ଯ୍ୟନ୍ତ ଟ୍ରାଏଲ୍ ବାଲାନ୍ସ",
        "liabilitiesAndIncome": "ଦାୟିତ୍ୱ ଏବଂ ଆୟ",
        "liabilitiesAndIncomeTitle": "ଦାୟିତ୍ୱ ଏବଂ ଆୟ",
        "assetsAndExpenditure": "ସମ୍ପତ୍ତି ଏବଂ ବ୍ୟୟ",
        "assetsAndExpenses": "ସମ୍ପତ୍ତି ଏବଂ ଖର୍ଚ୍ଚ",
        "noTrialBalanceData": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି ଟ୍ରାଏଲ୍ ବାଲାନ୍ସ ଡାଟା ନାହିଁ।",
        "nothingToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କିଛି ନାହିଁ। ଦୟାକରି ପ୍ରଥମେ ରିପୋର୍ଟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ।",
        "failedToCapturePdf": "PDF ପାଇଁ ରିପୋର୍ଟ କ୍ୟାପଚର୍ କରିବାରେ ବିଫଳ।",
        "pdfDownloaded": "PDF ଡାଉନଲୋଡ୍ ହୋଇଛି",
        "failedToDownloadPdfWithError": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ: {{error}}",
        "failedToDownloadPdf": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ",
    },
}

COMMON_EXTRA = {
    "en": {
        "closing": "Closing",
        "breakUp": "Break Up",
        "totalDebit": "Total Debit",
        "totalCredit": "Total Credit",
    },
    "hi": {
        "closing": "समापन",
        "breakUp": "विभाजन",
        "totalDebit": "कुल डेबिट",
        "totalCredit": "कुल क्रेडिट",
    },
    "bn": {
        "closing": "সমাপ্তি",
        "breakUp": "বিভাজন",
        "totalDebit": "মোট ডেবিট",
        "totalCredit": "মোট ক্রেডিট",
    },
    "or": {
        "closing": "ସମାପ୍ତି",
        "breakUp": "ବିଭାଜନ",
        "totalDebit": "ମୋଟ ଡେବିଟ୍",
        "totalCredit": "ମୋଟ କ୍ରେଡିଟ୍",
    },
}


def add_to_bank_common(text: str, extras: dict) -> str:
    bank = text.find("\n    bank: {")
    common_start = text.rfind("\n    common: {", 0, bank)
    body_start = common_start + len("\n    common: {")
    pre = text[body_start:bank]
    inner_end = pre.rfind("\n    },")
    body = pre[:inner_end]
    adds = []
    for k, v in extras.items():
        if re.search(rf"\n      {re.escape(k)}:", body):
            continue
        esc = v.replace("\\", "\\\\").replace('"', '\\"')
        adds.append(f'      {k}: "{esc}"')
    if not adds:
        return text
    body = body.rstrip()
    if body and not body.endswith(","):
        body += ","
    body = body + "\n" + ",\n".join(adds) + "\n"
    return text[:body_start] + body + pre[inner_end:] + text[bank:]


def insert_after_block(text: str, block_name: str, new_block: str) -> str:
    m = re.search(rf"(\n      {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"{block_name} not found")
    depth = 0
    i = m.end(1) - 1
    end = None
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                j = i + 1
                if j < len(text) and text[j] == ",":
                    j += 1
                end = j
                break
        i += 1
    if end is None:
        raise SystemExit(f"could not close {block_name}")
    return text[:end] + "\n" + new_block + text[end:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    if re.search(r"\n      trialBalance:\s*\{", text):
        print(f"{lang}: report.trialBalance already present")
    else:
        block = (
            "      trialBalance: {\n"
            + js_obj(TRIAL[lang], indent=8)
            + "\n      },"
        )
        for anchor in (
            "accountLedger",
            "balancing",
            "userScroll",
            "cashAccount",
            "cashbook",
            "daybook",
        ):
            if re.search(rf"\n      {anchor}:\s*\{{", text):
                text = insert_after_block(text, anchor, block)
                print(f"{lang}: inserted after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common")
        text = text2
    else:
        print(f"{lang}: common ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_index():
    p = TB / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n',
            '"use client";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  toDate,\n}) => {\n  const [showReportForm, setShowReportForm] = useState(true);",
            "  toDate,\n}) => {\n  const { t } = useTranslation();\n  const [showReportForm, setShowReportForm] = useState(true);",
            1,
        )

    repls = [
        (
            'toast.error("Nothing to download. Please generate the report first.");',
            'toast.error(t("report.trialBalance.nothingToDownload"));',
        ),
        (
            'toast.error("No trial balance data to download.");',
            'toast.error(t("report.trialBalance.noTrialBalanceData"));',
        ),
        (
            'toast.error("Failed to capture report for PDF.");',
            'toast.error(t("report.trialBalance.failedToCapturePdf"));',
        ),
        (
            'toast.success("PDF downloaded");',
            'toast.success(t("report.trialBalance.pdfDownloaded"));',
        ),
        (
            """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
            """error?.message
          ? t("report.trialBalance.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.trialBalance.failedToDownloadPdf"),""",
        ),
        (
            '<h3 className="text-xl font-semibold ">Trial Balance Report</h3>',
            '<h3 className="text-xl font-semibold ">{t("report.trialBalance.trialBalanceReport")}</h3>',
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
            """                  <TableHead colSpan={6} className=" text-white text-center">
                    LIABLITIES & INCOME
                  </TableHead>""",
            """                  <TableHead colSpan={6} className=" text-white text-center">
                    {t("report.trialBalance.liabilitiesAndIncome")}
                  </TableHead>""",
        ),
        (
            "<p>ASSETS & EXPENDITURE</p>",
            '<p>{t("report.trialBalance.assetsAndExpenditure")}</p>',
        ),
        (
            """                  <TableHead colSpan={6} className=" text-white text-center">
                    ASSETS & EXPENDITURE
                  </TableHead>""",
            """                  <TableHead colSpan={6} className=" text-white text-center">
                    {t("report.trialBalance.assetsAndExpenditure")}
                  </TableHead>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("INDEX MISSING:", old[:70].replace("\n", " "))
        else:
            t = t.replace(old, new)
            print("INDEX OK:", old[:45].replace("\n", " "))

    # Repeated column headers (appear twice)
    label_repls = [
        (
            """                  <TableHead rowSpan={2} className="text-white text-center">
                    Head Of Account
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Opening Balance
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Total Debit
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Total Credit
                  </TableHead>
                  <TableHead
                    colSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    Closing
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead className="text-white border-l border-white text-center">
                    Break Up
                  </TableHead>
                  <TableHead className="text-white border-l border-white text-center">
                    Balance
                  </TableHead>""",
            """                  <TableHead rowSpan={2} className="text-white text-center">
                    {t("common.headOfAccount")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.openingBalance")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.totalDebit")}
                  </TableHead>
                  <TableHead
                    rowSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.totalCredit")}
                  </TableHead>
                  <TableHead
                    colSpan={2}
                    className="text-white border-l border-white text-center"
                  >
                    {t("common.closing")}
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary text-white hover:bg-primary">
                  <TableHead className="text-white border-l border-white text-center">
                    {t("common.breakUp")}
                  </TableHead>
                  <TableHead className="text-white border-l border-white text-center">
                    {t("common.balance")}
                  </TableHead>""",
        ),
        (
            """                    <TableCell className="font-semibold border border-secondary">
                      Grand Total
                    </TableCell>""",
            """                    <TableCell className="font-semibold border border-secondary">
                      {t("common.grandTotal")}
                    </TableCell>""",
        ),
    ]

    for old, new in label_repls:
        c = t.count(old)
        if c == 0:
            print("INDEX LABEL MISSING:", old[:50].replace("\n", " "))
        else:
            t = t.replace(old, new)
            print(f"INDEX LABEL OK x{c}")

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = TB / "PreviewModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  toDate,\n}) => {\n  const [userName, setUserName] = useState(\"\");",
            "  toDate,\n}) => {\n  const { t } = useTranslation();\n\n  const [userName, setUserName] = useState(\"\");",
            1,
        )

    # renderTable uses static headers - convert to use t()
    old_render_headers = """          <TableRow className="h-[40px]">
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-black w-[200px]"
            >
              Head Of Account
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              Opening Balance
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              Total Debit
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              Total Credit
            </TableHead>
            <TableHead
              colSpan={2}
              className="p-0 h-[40px] text-sm text-center text-black border-l border-black w-[200px]"
            >
              Closing
            </TableHead>
          </TableRow>
          <TableRow className="h-[40px]">
            <TableHead className="p-0 h-[40px] text-sm text-center text-black border border-black w-[100px]">
              Break Up
            </TableHead>
            <TableHead className="p-0 h-[40px] text-sm text-center text-black border border-black w-[100px]">
              Balance
            </TableHead>
          </TableRow>"""

    new_render_headers = """          <TableRow className="h-[40px]">
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-black w-[200px]"
            >
              {t("common.headOfAccount")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              {t("common.openingBalance")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              {t("common.totalDebit")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              {t("common.totalCredit")}
            </TableHead>
            <TableHead
              colSpan={2}
              className="p-0 h-[40px] text-sm text-center text-black border-l border-black w-[200px]"
            >
              {t("common.closing")}
            </TableHead>
          </TableRow>
          <TableRow className="h-[40px]">
            <TableHead className="p-0 h-[40px] text-sm text-center text-black border border-black w-[100px]">
              {t("common.breakUp")}
            </TableHead>
            <TableHead className="p-0 h-[40px] text-sm text-center text-black border border-black w-[100px]">
              {t("common.balance")}
            </TableHead>
          </TableRow>"""

    repls = [
        (old_render_headers, new_render_headers),
        (
            """                  <TableCell className="font-semibold p-0 border border-black text-center">
                    Grand Total
                  </TableCell>""",
            """                  <TableCell className="font-semibold p-0 border border-black text-center">
                    {t("common.grandTotal")}
                  </TableCell>""",
        ),
        (
            """            <p className="text-sm">
              Trail Balance From {fromDate} To {toDate}
            </p>""",
            """            <p className="text-sm">
              {t("report.trialBalance.trialBalanceFromTo", {
                fromDate,
                toDate,
              })}
            </p>""",
        ),
        (
            '{renderTable(liabilitiesPage, "Liabilities & Income")}',
            '{renderTable(\n              liabilitiesPage,\n              t("report.trialBalance.liabilitiesAndIncomeTitle"),\n            )}',
        ),
        (
            """            <p>Generated By : {userName}</p>
            <p className="italic text-gray-600 text-center w-full absolute  left-1/2 -translate-x-1/2">
              This report is generated by PrioSuite.
            </p>
            <p>
              Generated On : {currentDate} {currentTime}
            </p>""",
            """            <p>
              {t("common.generatedBy")} : {userName}
            </p>
            <p className="italic text-gray-600 text-center w-full absolute  left-1/2 -translate-x-1/2">
              {t("common.thisReportIsGeneratedByPrioSuite")}
            </p>
            <p>
              {t("common.generatedOn")} : {currentDate} {currentTime}
            </p>""",
        ),
        (
            """              <p className="text-sm">
                Trial Balance From {fromDate} To {toDate}
              </p>""",
            """              <p className="text-sm">
                {t("report.trialBalance.trialBalanceFromTo", {
                  fromDate,
                  toDate,
                })}
              </p>""",
        ),
        (
            '{renderTable(assetsPage, "Assets & Expenses")}',
            '{renderTable(\n              assetsPage,\n              t("report.trialBalance.assetsAndExpenses"),\n            )}',
        ),
        (
            """            <p>Generated By : {userName}</p>
            <p className="italic text-gray-600 text-center w-full absolute left-1/2 -translate-x-1/2">
              This report is generated by PrioSuite.
            </p>
            <p>
              Generated On : {currentDate} {currentTime}
            </p>""",
            """            <p>
              {t("common.generatedBy")} : {userName}
            </p>
            <p className="italic text-gray-600 text-center w-full absolute left-1/2 -translate-x-1/2">
              {t("common.thisReportIsGeneratedByPrioSuite")}
            </p>
            <p>
              {t("common.generatedOn")} : {currentDate} {currentTime}
            </p>""",
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


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_index()
    wire_preview()


if __name__ == "__main__":
    main()
