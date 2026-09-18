# -*- coding: utf-8 -*-
"""Insert report.balanceSheet locales and wire balanceSheet components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BS = ROOT / "components" / "report" / "balanceSheet"


def js_obj(d, indent=8):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


BALANCE_SHEET = {
    "en": {
        "balanceSheetReport": "Balance Sheet Report",
        "balanceSheetAsOn": "Balance Sheet As On",
        "liabilities": "Liabilities",
        "assets": "Assets",
        "auditorsCertificate": "Auditor's Certificate",
        "noBalanceSheetData": "No balance sheet data to download.",
    },
    "hi": {
        "balanceSheetReport": "बैलेंस शीट रिपोर्ट",
        "balanceSheetAsOn": "बैलेंस शीट दिनांक",
        "liabilities": "देनदारियां",
        "assets": "संपत्तियां",
        "auditorsCertificate": "लेखा परीक्षक का प्रमाणपत्र",
        "noBalanceSheetData": "डाउनलोड करने के लिए कोई बैलेंस शीट डेटा नहीं है।",
    },
    "bn": {
        "balanceSheetReport": "ব্যালেন্স শিট রিপোর্ট",
        "balanceSheetAsOn": "ব্যালেন্স শিট তারিখ অনুযায়ী",
        "liabilities": "দায়",
        "assets": "সম্পদ",
        "auditorsCertificate": "অডিটরের সার্টিফিকেট",
        "noBalanceSheetData": "ডাউনলোড করার জন্য কোনো ব্যালেন্স শিট ডেটা নেই।",
    },
    "or": {
        "balanceSheetReport": "ବାଲାନ୍ସ ଶିଟ୍ ରିପୋର୍ଟ",
        "balanceSheetAsOn": "ବାଲାନ୍ସ ଶିଟ୍ ତାରିଖ ସୁଦ୍ଧା",
        "liabilities": "ଦାୟିତ୍ୱ",
        "assets": "ସମ୍ପତ୍ତି",
        "auditorsCertificate": "ଅଡିଟରଙ୍କ ପ୍ରମାଣପତ୍ର",
        "noBalanceSheetData": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି ବାଲାନ୍ସ ଶିଟ୍ ଡାଟା ନାହିଁ।",
    },
}

COMMON_EXTRA = {
    "en": {"asOnDate": "As On Date"},
    "hi": {"asOnDate": "दिनांक तक"},
    "bn": {"asOnDate": "তারিখ অনুযায়ী"},
    "or": {"asOnDate": "ତାରିଖ ସୁଦ୍ଧା"},
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

    if re.search(r"\n      balanceSheet:\s*\{", text):
        print(f"{lang}: report.balanceSheet already present")
    else:
        block = (
            "      balanceSheet: {\n"
            + js_obj(BALANCE_SHEET[lang], indent=8)
            + "\n      },"
        )
        for anchor in (
            "plAppropiation",
            "profitLoss",
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
        print(f"{lang}: merged common.asOnDate")
        text = text2
    else:
        print(f"{lang}: common ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_index():
    p = BS / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n',
            '"use client";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  asOnDate,\n}) => {\n  const [showReportForm, setShowReportForm] = useState(true);",
            "  asOnDate,\n}) => {\n  const { t } = useTranslation();\n  const [showReportForm, setShowReportForm] = useState(true);",
            1,
        )

    repls = [
        (
            'toast.error("Nothing to download. Please generate the report first.");',
            'toast.error(t("common.nothingToDownload"));',
        ),
        (
            'toast.error("No balance sheet data to download.");',
            'toast.error(t("report.balanceSheet.noBalanceSheetData"));',
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
            '<h3 className="text-xl font-semibold ">Balance Sheet Report</h3>',
            '<h3 className="text-xl font-semibold ">\n                  {t("report.balanceSheet.balanceSheetReport")}\n                </h3>',
        ),
        ('label="As On Date"', 'label={t("common.asOnDate")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        (
            """                    <TableHead className="text-white text-center">
                      Liablities
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Break Up
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Amount
                    </TableHead>""",
            """                    <TableHead className="text-white text-center">
                      {t("report.balanceSheet.liabilities")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.breakUp")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.amount")}
                    </TableHead>""",
        ),
        (
            """                    <TableHead className="text-white text-center">
                      Assets
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Break Up
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      Amount
                    </TableHead>""",
            """                    <TableHead className="text-white text-center">
                      {t("report.balanceSheet.assets")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.breakUp")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.amount")}
                    </TableHead>""",
        ),
        (
            "                      Grand Total\n",
            '                      {t("common.grandTotal")}\n',
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("INDEX MISSING:", repr(old[:90]))
        else:
            n = t.count(old)
            t = t.replace(old, new)
            print(f"INDEX OK x{n}:", old[:55].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = BS / "PreviewModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  asOnDate,\n}) => {\n  const [userName, setUserName] = useState(\"\");",
            "  asOnDate,\n}) => {\n  const { t } = useTranslation();\n\n  const [userName, setUserName] = useState(\"\");",
            1,
        )

    repls = [
        (
            '{isLeft ? "Liabilities" : "Assets"}',
            '{isLeft\n                  ? t("report.balanceSheet.liabilities")\n                  : t("report.balanceSheet.assets")}',
        ),
        (
            """              <TableHead className="text-black p-0 border-l text-center border-black w-[120px] h-[40px]">
                Break Up
              </TableHead>
              <TableHead className="text-black p-0 border-l text-center border-black w-[120px] h-[40px]">
                Balance
              </TableHead>""",
            """              <TableHead className="text-black p-0 border-l text-center border-black w-[120px] h-[40px]">
                {t("common.breakUp")}
              </TableHead>
              <TableHead className="text-black p-0 border-l text-center border-black w-[120px] h-[40px]">
                {t("common.balance")}
              </TableHead>""",
        ),
        (
            """                      Grand Total
                    </TableCell>""",
            """                      {t("common.grandTotal")}
                    </TableCell>""",
        ),
        (
            '<p className="text-sm">Balance Sheet As On {asOnDate}</p>',
            '<p className="text-sm">\n                  {t("report.balanceSheet.balanceSheetAsOn")} {asOnDate}\n                </p>',
        ),
        (
            "Auditor&#39;s Certificate",
            '{t("report.balanceSheet.auditorsCertificate")}',
        ),
        (
            """                <p className="text-nowrap">Generated By : {userName}</p>
                <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
                  This report is generated by PrioSuite.
                </p>
                <p className="text-nowrap">
                  Generated On : {currentDate} {currentTime}
                </p>""",
            """                <p className="text-nowrap">
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
            print("PREVIEW MISSING:", repr(old[:90]))
        else:
            n = t.count(old)
            t = t.replace(old, new)
            print(f"PREVIEW OK x{n}:", old[:55].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("preview done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_index()
    wire_preview()


if __name__ == "__main__":
    main()
