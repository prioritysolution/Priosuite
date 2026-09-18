# -*- coding: utf-8 -*-
"""Insert report.userScroll + missing common keys; wire components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
US = ROOT / "components" / "report" / "userScroll"


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


USER_SCROLL = {
    "en": {
        "userScrollReport": "User Scroll Report",
        "nothingToDownload": "Nothing to download. Please generate the report first.",
        "noDataToDownload": "No user scroll data to download.",
        "failedToCapturePdf": "Failed to capture report for PDF.",
        "pdfDownloaded": "PDF downloaded",
        "failedToDownloadPdfWithError": "Failed to download PDF: {{error}}",
        "failedToDownloadPdf": "Failed to download PDF",
        "asOnDate": "User Scroll As On {{date}}",
        "print": {
            "slNo": "SL. NO.",
            "refVoucher": "REF. VOUCH.",
            "voucherNo": "VOUCH. NO.",
            "particulars": "PARTICULARS",
            "receipt": "RECEIPT",
            "payment": "PAYMENT",
        },
    },
    "hi": {
        "userScrollReport": "यूज़र स्क्रॉल रिपोर्ट",
        "nothingToDownload": "डाउनलोड करने के लिए कुछ नहीं है। कृपया पहले रिपोर्ट जनरेट करें।",
        "noDataToDownload": "डाउनलोड करने के लिए कोई यूज़र स्क्रॉल डेटा नहीं है।",
        "failedToCapturePdf": "PDF के लिए रिपोर्ट कैप्चर करने में विफल।",
        "pdfDownloaded": "PDF डाउनलोड हो गया",
        "failedToDownloadPdfWithError": "PDF डाउनलोड करने में विफल: {{error}}",
        "failedToDownloadPdf": "PDF डाउनलोड करने में विफल",
        "asOnDate": "{{date}} तक यूज़र स्क्रॉल",
        "print": {
            "slNo": "क्रमांक",
            "refVoucher": "संदर्भ वाउचर",
            "voucherNo": "वाउचर नं.",
            "particulars": "विवरण",
            "receipt": "प्राप्ति",
            "payment": "भुगतान",
        },
    },
    "bn": {
        "userScrollReport": "ইউজার স্ক্রল রিপোর্ট",
        "nothingToDownload": "ডাউনলোড করার মতো কিছু নেই। অনুগ্রহ করে প্রথমে রিপোর্ট তৈরি করুন।",
        "noDataToDownload": "ডাউনলোড করার জন্য কোনো ইউজার স্ক্রল ডেটা নেই।",
        "failedToCapturePdf": "PDF-এর জন্য রিপোর্ট ক্যাপচার করতে ব্যর্থ।",
        "pdfDownloaded": "PDF ডাউনলোড হয়েছে",
        "failedToDownloadPdfWithError": "PDF ডাউনলোড করতে ব্যর্থ: {{error}}",
        "failedToDownloadPdf": "PDF ডাউনলোড করতে ব্যর্থ",
        "asOnDate": "{{date}} তারিখ পর্যন্ত ইউজার স্ক্রল",
        "print": {
            "slNo": "ক্রমিক নং",
            "refVoucher": "রেফ. ভাউচ.",
            "voucherNo": "ভাউচ. নং",
            "particulars": "বিবরণ",
            "receipt": "রসিদ",
            "payment": "পেমেন্ট",
        },
    },
    "or": {
        "userScrollReport": "ୟୁଜର୍ ସ୍କ୍ରୋଲ୍ ରିପୋର୍ଟ",
        "nothingToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କିଛି ନାହିଁ। ଦୟାକରି ପ୍ରଥମେ ରିପୋର୍ଟ ତିଆରି କରନ୍ତୁ।",
        "noDataToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି ୟୁଜର୍ ସ୍କ୍ରୋଲ୍ ଡାଟା ନାହିଁ।",
        "failedToCapturePdf": "PDF ପାଇଁ ରିପୋର୍ଟ କ୍ୟାପଚର୍ କରିବାରେ ବିଫଳ।",
        "pdfDownloaded": "PDF ଡାଉନଲୋଡ୍ ହୋଇଛି",
        "failedToDownloadPdfWithError": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ: {{error}}",
        "failedToDownloadPdf": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ",
        "asOnDate": "{{date}} ପର୍ଯ୍ୟନ୍ତ ୟୁଜର୍ ସ୍କ୍ରୋଲ୍",
        "print": {
            "slNo": "କ୍ରମିକ ନମ୍ବର",
            "refVoucher": "ରେଫ. ଭାଉଚର୍",
            "voucherNo": "ଭାଉଚ. ନମ୍ବର",
            "particulars": "ବିବରଣୀ",
            "receipt": "ରସିଦ",
            "payment": "ଦେୟ",
        },
    },
}

COMMON_EXTRA = {
    "en": {
        "user": "User",
        "selectUser": "Select user",
        "searchUser": "Search user...",
    },
    "hi": {
        "user": "उपयोगकर्ता",
        "selectUser": "उपयोगकर्ता चुनें",
        "searchUser": "उपयोगकर्ता खोजें...",
    },
    "bn": {
        "user": "ব্যবহারকারী",
        "selectUser": "ব্যবহারকারী নির্বাচন করুন",
        "searchUser": "ব্যবহারকারী অনুসন্ধান করুন...",
    },
    "or": {
        "user": "ବ୍ୟବହାରକାରୀ",
        "selectUser": "ବ୍ୟବହାରକାରୀ ଚୟନ କରନ୍ତୁ",
        "searchUser": "ବ୍ୟବହାରକାରୀ ଖୋଜନ୍ତୁ...",
    },
}


def add_to_bank_common(text: str, extras: dict) -> str:
    bank = text.find("\n    bank: {")
    if bank < 0:
        raise SystemExit("bank not found")
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

    if re.search(r"\n      userScroll:\s*\{", text):
        print(f"{lang}: report.userScroll already present")
    else:
        block = (
            "      userScroll: {\n"
            + js_nested(USER_SCROLL[lang], indent=8)
            + "\n      },"
        )
        # prefer after cashAccount, else cashbook
        if re.search(r"\n      cashAccount:\s*\{", text):
            text = insert_after_block(text, "cashAccount", block)
        else:
            text = insert_after_block(text, "cashbook", block)
        print(f"{lang}: inserted report.userScroll")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common extras")
        text = text2
    else:
        print(f"{lang}: common extras ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_index():
    p = US / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n',
            '"use client";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  user,\n}) => {\n  const [showReportForm, setShowReportForm] = useState(true);",
            "  user,\n}) => {\n  const { t } = useTranslation();\n  const [showReportForm, setShowReportForm] = useState(true);",
            1,
        )

    repls = [
        (
            'toast.error("Nothing to download. Please generate the report first.");',
            'toast.error(t("report.userScroll.nothingToDownload"));',
        ),
        (
            'toast.error("No user scroll data to download.");',
            'toast.error(t("report.userScroll.noDataToDownload"));',
        ),
        (
            'toast.error("Failed to capture report for PDF.");',
            'toast.error(t("report.userScroll.failedToCapturePdf"));',
        ),
        (
            'toast.success("PDF downloaded");',
            'toast.success(t("report.userScroll.pdfDownloaded"));',
        ),
        (
            """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
            """error?.message
          ? t("report.userScroll.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.userScroll.failedToDownloadPdf"),""",
        ),
        (
            '<h3 className="text-xl font-semibold ">User Scroll Report</h3>',
            '<h3 className="text-xl font-semibold ">{t("report.userScroll.userScrollReport")}</h3>',
        ),
        ('label="Date"', 'label={t("common.date")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        ('label="User"', 'label={t("common.user")}'),
        ('placeholder="Select user"', 'placeholder={t("common.selectUser")}'),
        (
            'searchPlaceholder="Search user..."',
            'searchPlaceholder={t("common.searchUser")}',
        ),
        (
            """                    <TableHead className=" text-white text-center w-16">
                      SL. NO.
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      REF. VOUCH.
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      VOUCH. NO.
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[380px]">
                      PARTICULARS
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      RECEIPT
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      PAYMENT
                    </TableHead>""",
            """                    <TableHead className=" text-white text-center w-16">
                      {t("report.userScroll.print.slNo")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      {t("report.userScroll.print.refVoucher")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.userScroll.print.voucherNo")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center w-[380px]">
                      {t("report.userScroll.print.particulars")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("report.userScroll.print.receipt")}
                    </TableHead>
                    <TableHead className="text-white border-l border-white text-center">
                      {t("report.userScroll.print.payment")}
                    </TableHead>""",
        ),
        (
            "<TableCell colSpan={4}>Total</TableCell>",
            '<TableCell colSpan={4}>{t("common.total")}</TableCell>',
        ),
        (
            """                    <TableCell colSpan={4} className="text-right">
                      Grand Total
                    </TableCell>""",
            """                    <TableCell colSpan={4} className="text-right">
                      {t("common.grandTotal")}
                    </TableCell>""",
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
    p = US / "PreviewModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "const PreviewModal = ({ printRef, reportData, asOnDate }) => {\n  const [userName, setUserName] = useState(\"\");",
            "const PreviewModal = ({ printRef, reportData, asOnDate }) => {\n  const { t } = useTranslation();\n\n  const [userName, setUserName] = useState(\"\");",
            1,
        )

    repls = [
        (
            """              <TableHead className="p-0 text-sm text-center text-black border-black w-[40px]">
                SL. NO.
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[80px]">
                REF. VOUCH.
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[80px]">
                VOUCH. NO.
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black">
                PARTICULARS
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[120px]">
                RECEIPT
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[120px]">
                PAYMENT
              </TableHead>""",
            """              <TableHead className="p-0 text-sm text-center text-black border-black w-[40px]">
                {t("report.userScroll.print.slNo")}
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[80px]">
                {t("report.userScroll.print.refVoucher")}
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[80px]">
                {t("report.userScroll.print.voucherNo")}
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black">
                {t("report.userScroll.print.particulars")}
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[120px]">
                {t("report.userScroll.print.receipt")}
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[120px]">
                {t("report.userScroll.print.payment")}
              </TableHead>""",
        ),
        (
            """                    <TableCell colSpan={4} className="p-0 border border-black">
                      Total
                    </TableCell>""",
            """                    <TableCell colSpan={4} className="p-0 border border-black">
                      {t("common.total")}
                    </TableCell>""",
        ),
        (
            """                      Grand Total
                    </TableCell>""",
            """                      {t("common.grandTotal")}
                    </TableCell>""",
        ),
        (
            '<p className="text-sm">User Scroll As On {asOnDate}</p>',
            '<p className="text-sm">\n              {t("report.userScroll.asOnDate", { date: asOnDate })}\n            </p>',
        ),
        (
            """            <p>Generated By : {userName}</p>
            <p
              className="italic text-center w-full absolute left-1/2 -translate-x-1/2"
              style={{ color: "#4b5563" }}
            >
              This report is generated by PrioSuite.
            </p>
            <p>
              Generated On : {currentDate} {currentTime}
            </p>""",
            """            <p>
              {t("common.generatedBy")} : {userName}
            </p>
            <p
              className="italic text-center w-full absolute left-1/2 -translate-x-1/2"
              style={{ color: "#4b5563" }}
            >
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
