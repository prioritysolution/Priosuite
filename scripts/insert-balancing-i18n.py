# -*- coding: utf-8 -*-
"""Insert report.balancing locales and wire balancing components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BAL = ROOT / "components" / "report" / "balancing"


def js_nested(d, indent=8):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        if isinstance(v, dict):
            lines.append(f"{pad}{k}: {{")
            nested = list(v.items())
            for j, (nk, nv) in enumerate(nested):
                ncomma = "," if j < len(nested) - 1 else ""
                esc = str(nv).replace("\\", "\\\\").replace('"', '\\"')
                lines.append(f'{pad}  {nk}: "{esc}"{ncomma}')
            lines.append(f"{pad}}}{comma}")
        else:
            esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
            lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


BALANCING = {
    "en": {
        "glBalancingReport": "GL Balancing Report",
        "glBalancingAsOn": "GL Balancing As On {{date}}",
        "nothingToDownload": "Nothing to download. Please generate the report first.",
        "noDataToDownload": "No balancing data to download.",
        "failedToCapturePdf": "Failed to capture report for PDF.",
        "pdfDownloaded": "PDF downloaded",
        "failedToDownloadPdfWithError": "Failed to download PDF: {{error}}",
        "failedToDownloadPdf": "Failed to download PDF",
        "productType": "PRODUCT TYPE",
        "print": {
            "slNo": "SL. NO.",
            "productName": "PRODUCT NAME",
            "glHead": "GL HEAD",
            "glBalance": "GL BALANCE",
            "subLedger": "SUB-LEDGER",
            "difference": "DIFFERENCE",
        },
    },
    "hi": {
        "glBalancingReport": "GL बैलेंसिंग रिपोर्ट",
        "glBalancingAsOn": "{{date}} तक GL बैलेंसिंग",
        "nothingToDownload": "डाउनलोड करने के लिए कुछ नहीं है। कृपया पहले रिपोर्ट जनरेट करें।",
        "noDataToDownload": "डाउनलोड करने के लिए कोई बैलेंसिंग डेटा नहीं है।",
        "failedToCapturePdf": "PDF के लिए रिपोर्ट कैप्चर करने में विफल।",
        "pdfDownloaded": "PDF डाउनलोड हो गया",
        "failedToDownloadPdfWithError": "PDF डाउनलोड करने में विफल: {{error}}",
        "failedToDownloadPdf": "PDF डाउनलोड करने में विफल",
        "productType": "उत्पाद प्रकार",
        "print": {
            "slNo": "क्रमांक",
            "productName": "उत्पाद का नाम",
            "glHead": "GL हेड",
            "glBalance": "GL शेष",
            "subLedger": "सब-लेजर",
            "difference": "अंतर",
        },
    },
    "bn": {
        "glBalancingReport": "GL ব্যালেন্সিং রিপোর্ট",
        "glBalancingAsOn": "{{date}} তারিখ পর্যন্ত GL ব্যালেন্সিং",
        "nothingToDownload": "ডাউনলোড করার মতো কিছু নেই। অনুগ্রহ করে প্রথমে রিপোর্ট তৈরি করুন।",
        "noDataToDownload": "ডাউনলোড করার জন্য কোনো ব্যালেন্সিং ডেটা নেই।",
        "failedToCapturePdf": "PDF-এর জন্য রিপোর্ট ক্যাপচার করতে ব্যর্থ।",
        "pdfDownloaded": "PDF ডাউনলোড হয়েছে",
        "failedToDownloadPdfWithError": "PDF ডাউনলোড করতে ব্যর্থ: {{error}}",
        "failedToDownloadPdf": "PDF ডাউনলোড করতে ব্যর্থ",
        "productType": "পণ্যের ধরন",
        "print": {
            "slNo": "ক্রমিক নং",
            "productName": "পণ্যের নাম",
            "glHead": "GL হেড",
            "glBalance": "GL ব্যালেন্স",
            "subLedger": "সাব-লেজার",
            "difference": "পার্থক্য",
        },
    },
    "or": {
        "glBalancingReport": "GL ବାଲାନ୍ସିଂ ରିପୋର୍ଟ",
        "glBalancingAsOn": "{{date}} ପର୍ଯ୍ୟନ୍ତ GL ବାଲାନ୍ସିଂ",
        "nothingToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କିଛି ନାହିଁ। ଦୟାକରି ପ୍ରଥମେ ରିପୋର୍ଟ ତିଆରି କରନ୍ତୁ।",
        "noDataToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି ବାଲାନ୍ସିଂ ଡାଟା ନାହିଁ।",
        "failedToCapturePdf": "PDF ପାଇଁ ରିପୋର୍ଟ କ୍ୟାପଚର୍ କରିବାରେ ବିଫଳ।",
        "pdfDownloaded": "PDF ଡାଉନଲୋଡ୍ ହୋଇଛି",
        "failedToDownloadPdfWithError": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ: {{error}}",
        "failedToDownloadPdf": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ",
        "productType": "ଉତ୍ପାଦ ପ୍ରକାର",
        "print": {
            "slNo": "କ୍ରମିକ ନମ୍ବର",
            "productName": "ଉତ୍ପାଦ ନାମ",
            "glHead": "GL ହେଡ୍",
            "glBalance": "GL ବାଲାନ୍ସ",
            "subLedger": "ସବ୍-ଲେଜର୍",
            "difference": "ପାର୍ଥକ୍ୟ",
        },
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

    if re.search(r"\n      balancing:\s*\{", text):
        print(f"{lang}: report.balancing already present")
    else:
        block = (
            "      balancing: {\n"
            + js_nested(BALANCING[lang], indent=8)
            + "\n      },"
        )
        for anchor in ("userScroll", "cashAccount", "cashbook", "daybook"):
            if re.search(rf"\n      {anchor}:\s*\{{", text):
                text = insert_after_block(text, anchor, block)
                print(f"{lang}: inserted report.balancing after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no report insert anchor")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_index():
    p = BAL / "index.jsx"
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
            'toast.error(t("report.balancing.nothingToDownload"));',
        ),
        (
            'toast.error("No balancing data to download.");',
            'toast.error(t("report.balancing.noDataToDownload"));',
        ),
        (
            'toast.error("Failed to capture report for PDF.");',
            'toast.error(t("report.balancing.failedToCapturePdf"));',
        ),
        (
            'toast.success("PDF downloaded");',
            'toast.success(t("report.balancing.pdfDownloaded"));',
        ),
        (
            """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
            """error?.message
          ? t("report.balancing.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.balancing.failedToDownloadPdf"),""",
        ),
        (
            '<h3 className="text-xl font-semibold ">GL Balancing Report</h3>',
            '<h3 className="text-xl font-semibold ">{t("report.balancing.glBalancingReport")}</h3>',
        ),
        ('label="Date"', 'label={t("common.date")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        (
            """                    <TableHead className=" text-white text-center w-16">
                      SL. NO.
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[220px]">
                      PRODUCT NAME
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[380px]">
                      GL HEAD
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      GL BALANCE
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      SUB-LEDGER
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      DIFFERENCE
                    </TableHead>""",
            """                    <TableHead className=" text-white text-center w-16">
                      {t("report.balancing.print.slNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center w-[220px]">
                      {t("report.balancing.print.productName")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[380px]">
                      {t("report.balancing.print.glHead")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.balancing.print.glBalance")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.balancing.print.subLedger")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("report.balancing.print.difference")}
                    </TableHead>""",
        ),
        (
            "                              PRODUCT TYPE : SHARE\n",
            '                              {t("report.balancing.productType")} : SHARE\n',
        ),
        (
            "                              PRODUCT TYPE : DEPOSIT\n",
            '                              {t("report.balancing.productType")} : DEPOSIT\n',
        ),
        (
            "                              PRODUCT TYPE : LOAN\n",
            '                              {t("report.balancing.productType")} : LOAN\n',
        ),
        (
            "                              PRODUCT TYPE : INVESTMENT\n",
            '                              {t("report.balancing.productType")} : INVESTMENT\n',
        ),
        (
            "                              PRODUCT TYPE : BORROWINGS\n",
            '                              {t("report.balancing.productType")} : BORROWINGS\n',
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("INDEX MISSING:", old[:70].replace("\n", " "))
        else:
            t = t.replace(old, new)
            print("INDEX OK:", old[:45].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = BAL / "PreviewModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import getCookieData from "@/utils/getCookieData";\n',
            'import getCookieData from "@/utils/getCookieData";\nimport { useTranslation } from "react-i18next";\n',
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
            '<p className="text-sm">GL Balancing As On {asOnDate}</p>',
            '<p className="text-sm">\n              {t("report.balancing.glBalancingAsOn", { date: asOnDate })}\n            </p>',
        ),
        (
            """                    SL. NO.
                  </TableHead>
                  <TableHead
                    style={{ width: "50px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    PRODUCT NAME
                  </TableHead>
                  <TableHead
                    style={{ width: "160px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    GL HEAD
                  </TableHead>
                  <TableHead
                    style={{ width: "80px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    GL BALANCE
                  </TableHead>
                  <TableHead
                    style={{ width: "100px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    SUB-LEDGER
                  </TableHead>
                  <TableHead
                    style={{ width: "160px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    DIFFERENCE
                  </TableHead>""",
            """                    {t("report.balancing.print.slNo")}
                  </TableHead>
                  <TableHead
                    style={{ width: "50px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    {t("report.balancing.print.productName")}
                  </TableHead>
                  <TableHead
                    style={{ width: "160px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    {t("report.balancing.print.glHead")}
                  </TableHead>
                  <TableHead
                    style={{ width: "80px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    {t("report.balancing.print.glBalance")}
                  </TableHead>
                  <TableHead
                    style={{ width: "100px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    {t("report.balancing.print.subLedger")}
                  </TableHead>
                  <TableHead
                    style={{ width: "160px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    {t("report.balancing.print.difference")}
                  </TableHead>""",
        ),
        (
            "                          PRODUCT TYPE : {row.productType}\n",
            '                          {t("report.balancing.productType")} : {row.productType}\n',
        ),
        (
            """            <p className="text-nowrap">Generated By: {userName}</p>
            <p
              className="absolute left-[50%] translate-x-[-50%] italic text-nowrap"
              style={{ color: "#4b5563" }}
            >
              This report is generated by PrioSuite.
            </p>
            <p className="text-nowrap">
              Generated On: {currentDate} {currentTime}
            </p>""",
            """            <p className="text-nowrap">
              {t("common.generatedBy")}: {userName}
            </p>
            <p
              className="absolute left-[50%] translate-x-[-50%] italic text-nowrap"
              style={{ color: "#4b5563" }}
            >
              {t("common.thisReportIsGeneratedByPrioSuite")}
            </p>
            <p className="text-nowrap">
              {t("common.generatedOn")}: {currentDate} {currentTime}
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
