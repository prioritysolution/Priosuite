# -*- coding: utf-8 -*-
"""Insert report.plAppropiation locales and wire plAppropiation components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
PL = ROOT / "components" / "report" / "plAppropiation"


def js_obj(d, indent=8):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


# Feature keys from @text + index-only UI strings
PL_APPROPIATION = {
    "en": {
        "plAppropiationReport": "PL Appropiation Report",
        "plAppropiationAsOn": "PL Appropiation As On",
        "asOnDate": "As On Date",
        "expenditure": "EXPENDITURE",
        "income": "INCOME",
        "noPlAppropiationData": "No P&L appropriation data to download.",
    },
    "hi": {
        "plAppropiationReport": "PL विनियोग रिपोर्ट",
        "plAppropiationAsOn": "PL विनियोग की स्थिति",
        "asOnDate": "दिनांक तक",
        "expenditure": "व्यय",
        "income": "आय",
        "noPlAppropiationData": "डाउनलोड करने के लिए कोई P&L विनियोग डेटा नहीं है।",
    },
    "bn": {
        "plAppropiationReport": "PL বরাদ্দ রিপোর্ট",
        "plAppropiationAsOn": "PL বরাদ্দের তারিখ",
        "asOnDate": "তারিখ পর্যন্ত",
        "expenditure": "ব্যয়",
        "income": "আয়",
        "noPlAppropiationData": "ডাউনলোড করার জন্য কোনো P&L বরাদ্দ ডেটা নেই।",
    },
    "or": {
        "plAppropiationReport": "PL ବିନିଯୋଗ ରିପୋର୍ଟ",
        "plAppropiationAsOn": "PL ବିନିଯୋଗର ସ୍ଥିତି",
        "asOnDate": "ତାରିଖ ପର୍ଯ୍ୟନ୍ତ",
        "expenditure": "ବ୍ୟୟ",
        "income": "ଆୟ",
        "noPlAppropiationData": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି P&L ବିନିଯୋଗ ଡାଟା ନାହିଁ।",
    },
}


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

    if re.search(r"\n      plAppropiation:\s*\{", text):
        print(f"{lang}: report.plAppropiation already present")
    else:
        block = (
            "      plAppropiation: {\n"
            + js_obj(PL_APPROPIATION[lang], indent=8)
            + "\n      },"
        )
        for anchor in (
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
            'toast.error("No P&L appropriation data to download.");',
            'toast.error(t("report.plAppropiation.noPlAppropiationData"));',
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
                  PL Appropiation Report
                </h3>""",
            """                <h3 className="text-xl font-semibold ">
                  {t("report.plAppropiation.plAppropiationReport")}
                </h3>""",
        ),
        (
            'label="As On Date"',
            'label={t("report.plAppropiation.asOnDate")}',
        ),
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
                      Amount
                    </TableHead>""",
            """                    <TableHead className="text-white text-center">
                      {t("report.plAppropiation.expenditure")}
                    </TableHead>

                    <TableHead className="text-white border-l border-white text-center">
                      {t("common.amount")}
                    </TableHead>""",
        ),
        (
            """                    <TableHead className="text-white text-center">
                      Income
                    </TableHead>

                    <TableHead className="text-white border-l border-white text-center">
                      Amount
                    </TableHead>""",
            """                    <TableHead className="text-white text-center">
                      {t("report.plAppropiation.income")}
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
            "  asOnDate,\n}) => {\n  const [userName, setUserName] = useState(\"\");",
            "  asOnDate,\n}) => {\n  const { t } = useTranslation();\n\n  const [userName, setUserName] = useState(\"\");",
            1,
        )

    repls = [
        (
            '<p className="text-sm">PL Appropiation As On {asOnDate}</p>',
            '<p className="text-sm">\n                {t("report.plAppropiation.plAppropiationAsOn")} {asOnDate}\n              </p>',
        ),
        (
            '{isLeft ? "EXPENDITURE" : "INCOME"}',
            '{isLeft\n                                ? t("report.plAppropiation.expenditure")\n                                : t("report.plAppropiation.income")}',
        ),
        (
            """                            <TableHead className="text-black border-black p-0 border-l text-center w-[120px] h-[40px]">
                              AMOUNT
                            </TableHead>""",
            """                            <TableHead className="text-black border-black p-0 border-l text-center w-[120px] h-[40px]">
                              {t("common.amount")}
                            </TableHead>""",
        ),
        (
            """                            <TableCell className="font-medium border border-black text-center p-0">
                              Grand Total
                            </TableCell>""",
            """                            <TableCell className="font-medium border border-black text-center p-0">
                              {t("common.grandTotal")}
                            </TableCell>""",
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
            print("PREVIEW MISSING:", repr(old[:90]))
        else:
            t = t.replace(old, new)
            print("PREVIEW OK:", old[:55].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("preview done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_index()
    wire_preview()


if __name__ == "__main__":
    main()
