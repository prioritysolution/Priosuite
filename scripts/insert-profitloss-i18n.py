# -*- coding: utf-8 -*-
"""Insert report.profitLoss locales and wire profitLoss components per @text."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
PL = ROOT / "components" / "report" / "profitLoss"


def js_obj(d, indent=8):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


PROFIT_LOSS = {
    "en": {
        "profitLossReport": "Profit & Loss Report",
        "asOnDate": "As On Date",
        "expenditure": "Expenditure",
        "income": "Income",
        "profitLossFromTo": "Profit & Loss From {{fromDate}} To {{toDate}}",
        "noProfitLossData": "No profit & loss data to download.",
    },
    "hi": {
        "profitLossReport": "लाभ और हानि रिपोर्ट",
        "asOnDate": "दिनांक तक",
        "expenditure": "व्यय",
        "income": "आय",
        "profitLossFromTo": "{{fromDate}} से {{toDate}} तक लाभ और हानि",
        "noProfitLossData": "डाउनलोड करने के लिए कोई लाभ और हानि डेटा नहीं है।",
    },
    "bn": {
        "profitLossReport": "লাভ ও ক্ষতি রিপোর্ট",
        "asOnDate": "তারিখ পর্যন্ত",
        "expenditure": "ব্যয়",
        "income": "আয়",
        "profitLossFromTo": "{{fromDate}} থেকে {{toDate}} পর্যন্ত লাভ ও ক্ষতি",
        "noProfitLossData": "ডাউনলোড করার জন্য কোনো লাভ ও ক্ষতি ডেটা নেই।",
    },
    "or": {
        "profitLossReport": "ଲାଭ ଏବଂ କ୍ଷତି ରିପୋର୍ଟ",
        "asOnDate": "ତାରିଖ ପର୍ଯ୍ୟନ୍ତ",
        "expenditure": "ବ୍ୟୟ",
        "income": "ଆୟ",
        "profitLossFromTo": "{{fromDate}} ରୁ {{toDate}} ପର୍ଯ୍ୟନ୍ତ ଲାଭ ଏବଂ କ୍ଷତି",
        "noProfitLossData": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି ଲାଭ ଏବଂ କ୍ଷତି ଡାଟା ନାହିଁ।",
    },
}

COMMON_EXTRA = {
    "en": {
        "nothingToDownload": "Nothing to download. Please generate the report first.",
        "failedToCaptureReportForPdf": "Failed to capture report for PDF.",
        "pdfDownloaded": "PDF downloaded",
        "failedToDownloadPdfWithError": "Failed to download PDF: {{error}}",
        "failedToDownloadPdf": "Failed to download PDF",
        "subTotal": "Sub Total",
    },
    "hi": {
        "nothingToDownload": "डाउनलोड करने के लिए कुछ नहीं है। कृपया पहले रिपोर्ट तैयार करें।",
        "failedToCaptureReportForPdf": "PDF के लिए रिपोर्ट कैप्चर करने में विफल।",
        "pdfDownloaded": "PDF डाउनलोड हो गई",
        "failedToDownloadPdfWithError": "PDF डाउनलोड करने में विफल: {{error}}",
        "failedToDownloadPdf": "PDF डाउनलोड करने में विफल",
        "subTotal": "उप योग",
    },
    "bn": {
        "nothingToDownload": "ডাউনলোড করার মতো কিছু নেই। অনুগ্রহ করে প্রথমে রিপোর্ট তৈরি করুন।",
        "failedToCaptureReportForPdf": "PDF-এর জন্য রিপোর্ট ক্যাপচার করতে ব্যর্থ।",
        "pdfDownloaded": "PDF ডাউনলোড হয়েছে",
        "failedToDownloadPdfWithError": "PDF ডাউনলোড করতে ব্যর্থ: {{error}}",
        "failedToDownloadPdf": "PDF ডাউনলোড করতে ব্যর্থ",
        "subTotal": "উপ মোট",
    },
    "or": {
        "nothingToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କିଛି ନାହିଁ। ଦୟାକରି ପ୍ରଥମେ ରିପୋର୍ଟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ।",
        "failedToCaptureReportForPdf": "PDF ପାଇଁ ରିପୋର୍ଟ କ୍ୟାପଚର୍ କରିବାରେ ବିଫଳ।",
        "pdfDownloaded": "PDF ଡାଉନଲୋଡ୍ ହୋଇଛି",
        "failedToDownloadPdfWithError": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ: {{error}}",
        "failedToDownloadPdf": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ",
        "subTotal": "ଉପ ମୋଟ",
    },
}


def add_to_bank_common(text: str, extras: dict) -> str:
    bank = text.find("\n    bank: {")
    if bank < 0:
        raise SystemExit("bank: not found")
    common_start = text.rfind("\n    common: {", 0, bank)
    if common_start < 0:
        raise SystemExit("bank-era common not found")
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

    if re.search(r"\n      profitLoss:\s*\{", text):
        print(f"{lang}: report.profitLoss already present")
    else:
        block = (
            "      profitLoss: {\n"
            + js_obj(PROFIT_LOSS[lang], indent=8)
            + "\n      },"
        )
        for anchor in (
            "trialBalance",
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
        print(f"{lang}: merged common (+{len(COMMON_EXTRA[lang])} candidates)")
        text = text2
    else:
        print(f"{lang}: common ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_index():
    p = PL / "index.jsx"
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
            'toast.error(t("common.nothingToDownload"));',
        ),
        (
            'toast.error("No profit & loss data to download.");',
            'toast.error(t("report.profitLoss.noProfitLossData"));',
        ),
        (
            'toast.error("Failed to capture report for PDF.");',
            'toast.error(t("common.failedToCaptureReportForPdf"));',
        ),
        (
            'toast.success("PDF downloaded");',
            'toast.success(t("common.pdfDownloaded"));',
        ),
        (
            """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
            """error?.message
          ? t("common.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("common.failedToDownloadPdf"),""",
        ),
        (
            """                <h3 className="text-xl font-semibold ">
                  Profit &amp; Loss Report
                </h3>""",
            """                <h3 className="text-xl font-semibold ">
                  {t("report.profitLoss.profitLossReport")}
                </h3>""",
        ),
        ('label="As On Date"', 'label={t("report.profitLoss.asOnDate")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        (
            """                    <TableHead className="text-white text-center">
                      Expenditure
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Break Up
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Balance
                    </TableHead>""",
            """                    <TableHead className="text-white text-center">
                      {t("report.profitLoss.expenditure")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.breakUp")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.balance")}
                    </TableHead>""",
        ),
        (
            """                    <TableHead className="text-white text-center">
                      Income
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Break Up
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Balance
                    </TableHead>""",
            """                    <TableHead className="text-white text-center">
                      {t("report.profitLoss.income")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.breakUp")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.balance")}
                    </TableHead>""",
        ),
        ("                      Sub Total\n", '                      {t("common.subTotal")}\n'),
        ("                      Grand Total\n", '                      {t("common.grandTotal")}\n'),
    ]

    for old, new in repls:
        if old not in t:
            print("INDEX MISSING:", repr(old[:80]))
        else:
            n = t.count(old)
            t = t.replace(old, new)
            print(f"INDEX OK x{n}:", old[:50].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = PL / "PreviewModal.jsx"
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

    repls = [
        (
            """              <p className="text-sm">
                Profit & Loss From {fromDate && format(fromDate, "dd-MM-yyyy")}{" "}
                To {toDate}
              </p>""",
            """              <p className="text-sm">
                {t("report.profitLoss.profitLossFromTo", {
                  fromDate:
                    fromDate && format(fromDate, "dd-MM-yyyy"),
                  toDate,
                })}
              </p>""",
        ),
        (
            '{isLeft ? "Expenditure" : "Income"}',
            '{isLeft\n                              ? t("report.profitLoss.expenditure")\n                              : t("report.profitLoss.income")}',
        ),
        (
            """                            <TableHead className="text-black p-0 border-l text-center border-black w-[100px] h-[40px]">
                              Break Up
                            </TableHead>
                            <TableHead className="text-black p-0 border-l text-center border-black w-[100px] h-[40px]">
                              Amount
                            </TableHead>""",
            """                            <TableHead className="text-black p-0 border-l text-center border-black w-[100px] h-[40px]">
                              {t("common.breakUp")}
                            </TableHead>
                            <TableHead className="text-black p-0 border-l text-center border-black w-[100px] h-[40px]">
                              {t("common.amount")}
                            </TableHead>""",
        ),
        (
            "                                    Sub Total\n",
            '                                    {t("common.subTotal")}\n',
        ),
        (
            "                                    Grand Total\n",
            '                                    {t("common.grandTotal")}\n',
        ),
        (
            """              <p className="text-nowrap">Generated By : {userName}</p>
              <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
                This report is generated by PrioSuite.
              </p>
              <p className="text-nowrap">
                Generated On : {currentDate} {currentTime}
              </p>""",
            """              <p className="text-nowrap">
                {t("common.generatedBy")} : {userName}
              </p>
              <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
                {t("common.thisReportIsGeneratedByPrioSuite")}
              </p>
              <p className="text-nowrap">
                {t("common.generatedOn")} : {currentDate} {currentTime}
              </p>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("PREVIEW MISSING:", repr(old[:80]))
        else:
            t = t.replace(old, new)
            print("PREVIEW OK:", old[:50].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("preview done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_index()
    wire_preview()


if __name__ == "__main__":
    main()
