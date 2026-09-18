# -*- coding: utf-8 -*-
"""Insert report.accountLedger locales and wire components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
AL = ROOT / "components" / "report" / "accountLedger"


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


ACCOUNT_LEDGER = {
    "en": {
        "accountLedgerReport": "Account Ledger Report",
        "ledgerFromTo": "Ledger From {{fromDate}} To {{toDate}}",
        "transDate": "Trans. Date",
        "nothingToDownload": "Nothing to download. Please generate the report first.",
        "noDataToDownload": "No account ledger data to download.",
        "failedToCapturePdf": "Failed to capture report for PDF.",
        "pdfDownloaded": "PDF downloaded",
        "failedToDownloadPdfWithError": "Failed to download PDF: {{error}}",
        "failedToDownloadPdf": "Failed to download PDF",
        "print": {
            "slNo": "SL. NO.",
            "transDate": "TRANS. DATE",
            "voucherNo": "VOUCHER NO.",
            "narration": "NARRATION",
            "debit": "DEBIT",
            "credit": "CREDIT",
            "balance": "BALANCE",
        },
    },
    "hi": {
        "accountLedgerReport": "खाता लेजर रिपोर्ट",
        "ledgerFromTo": "{{fromDate}} से {{toDate}} तक लेजर",
        "transDate": "लेनदेन दिनांक",
        "nothingToDownload": "डाउनलोड करने के लिए कुछ नहीं है। कृपया पहले रिपोर्ट जनरेट करें।",
        "noDataToDownload": "डाउनलोड करने के लिए कोई अकाउंट लेजर डेटा नहीं है।",
        "failedToCapturePdf": "PDF के लिए रिपोर्ट कैप्चर करने में विफल।",
        "pdfDownloaded": "PDF डाउनलोड हो गया",
        "failedToDownloadPdfWithError": "PDF डाउनलोड करने में विफल: {{error}}",
        "failedToDownloadPdf": "PDF डाउनलोड करने में विफल",
        "print": {
            "slNo": "क्रमांक",
            "transDate": "लेनदेन दिनांक",
            "voucherNo": "वाउचर संख्या",
            "narration": "विवरण",
            "debit": "डेबिट",
            "credit": "क्रेडिट",
            "balance": "शेष",
        },
    },
    "bn": {
        "accountLedgerReport": "অ্যাকাউন্ট লেজার রিপোর্ট",
        "ledgerFromTo": "{{fromDate}} থেকে {{toDate}} পর্যন্ত লেজার",
        "transDate": "লেনদেনের তারিখ",
        "nothingToDownload": "ডাউনলোড করার মতো কিছু নেই। অনুগ্রহ করে প্রথমে রিপোর্ট তৈরি করুন।",
        "noDataToDownload": "ডাউনলোড করার জন্য কোনো অ্যাকাউন্ট লেজার ডেটা নেই।",
        "failedToCapturePdf": "PDF-এর জন্য রিপোর্ট ক্যাপচার করতে ব্যর্থ।",
        "pdfDownloaded": "PDF ডাউনলোড হয়েছে",
        "failedToDownloadPdfWithError": "PDF ডাউনলোড করতে ব্যর্থ: {{error}}",
        "failedToDownloadPdf": "PDF ডাউনলোড করতে ব্যর্থ",
        "print": {
            "slNo": "ক্রমিক নং",
            "transDate": "লেনদেনের তারিখ",
            "voucherNo": "ভাউচার নম্বর",
            "narration": "বিবরণ",
            "debit": "ডেবিট",
            "credit": "ক্রেডিট",
            "balance": "ব্যালেন্স",
        },
    },
    "or": {
        "accountLedgerReport": "ଆକାଉଣ୍ଟ ଲେଜର୍ ରିପୋର୍ଟ",
        "ledgerFromTo": "{{fromDate}} ରୁ {{toDate}} ପର୍ଯ୍ୟନ୍ତ ଲେଜର୍",
        "transDate": "କାରବାର ତାରିଖ",
        "nothingToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କିଛି ନାହିଁ। ଦୟାକରି ପ୍ରଥମେ ରିପୋର୍ଟ ତିଆରି କରନ୍ତୁ।",
        "noDataToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି ଆକାଉଣ୍ଟ ଲେଜର୍ ଡାଟା ନାହିଁ।",
        "failedToCapturePdf": "PDF ପାଇଁ ରିପୋର୍ଟ କ୍ୟାପଚର୍ କରିବାରେ ବିଫଳ।",
        "pdfDownloaded": "PDF ଡାଉନଲୋଡ୍ ହୋଇଛି",
        "failedToDownloadPdfWithError": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ: {{error}}",
        "failedToDownloadPdf": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ",
        "print": {
            "slNo": "କ୍ରମିକ ନମ୍ବର",
            "transDate": "କାରବାର ତାରିଖ",
            "voucherNo": "ଭାଉଚର୍ ନମ୍ବର",
            "narration": "ବିବରଣୀ",
            "debit": "ଡେବିଟ୍",
            "credit": "କ୍ରେଡିଟ୍",
            "balance": "ବାଲାନ୍ସ",
        },
    },
}

COMMON_EXTRA = {
    "en": {
        "selectLedger": "Select ledger",
        "searchLedger": "Search ledger...",
        "voucherNo": "Voucher No.",
    },
    "hi": {
        "selectLedger": "लेजर चुनें",
        "searchLedger": "लेजर खोजें...",
        "voucherNo": "वाउचर संख्या",
    },
    "bn": {
        "selectLedger": "লেজার নির্বাচন করুন",
        "searchLedger": "লেজার অনুসন্ধান করুন...",
        "voucherNo": "ভাউচার নম্বর",
    },
    "or": {
        "selectLedger": "ଲେଜର୍ ଚୟନ କରନ୍ତୁ",
        "searchLedger": "ଲେଜର୍ ଖୋଜନ୍ତୁ...",
        "voucherNo": "ଭାଉଚର୍ ନମ୍ବର",
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

    if re.search(r"\n      accountLedger:\s*\{", text):
        print(f"{lang}: report.accountLedger already present")
    else:
        block = (
            "      accountLedger: {\n"
            + js_nested(ACCOUNT_LEDGER[lang], indent=8)
            + "\n      },"
        )
        for anchor in ("balancing", "userScroll", "cashAccount", "cashbook", "daybook"):
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
    p = AL / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n',
            '"use client";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  totalCrAmount,\n}) => {\n  const [showReportForm, setShowReportForm] = useState(true);",
            "  totalCrAmount,\n}) => {\n  const { t } = useTranslation();\n  const [showReportForm, setShowReportForm] = useState(true);",
            1,
        )

    repls = [
        (
            'toast.error("Nothing to download. Please generate the report first.");',
            'toast.error(t("report.accountLedger.nothingToDownload"));',
        ),
        (
            'toast.error("No account ledger data to download.");',
            'toast.error(t("report.accountLedger.noDataToDownload"));',
        ),
        (
            'toast.error("Failed to capture report for PDF.");',
            'toast.error(t("report.accountLedger.failedToCapturePdf"));',
        ),
        (
            'toast.success("PDF downloaded");',
            'toast.success(t("report.accountLedger.pdfDownloaded"));',
        ),
        (
            """error?.message
          ? `Failed to download PDF: ${error.message}`
          : "Failed to download PDF",""",
            """error?.message
          ? t("report.accountLedger.failedToDownloadPdfWithError", {
              error: error.message,
            })
          : t("report.accountLedger.failedToDownloadPdf"),""",
        ),
        (
            """                <h3 className="text-xl font-semibold ">
                  Account Ledger Report
                </h3>""",
            """                <h3 className="text-xl font-semibold ">
                  {t("report.accountLedger.accountLedgerReport")}
                </h3>""",
        ),
        ('label="From Date"', 'label={t("common.fromDate")}'),
        ('label="To Date"', 'label={t("common.toDate")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        ('label="Ledger"', 'label={t("common.ledger")}'),
        ('placeholder="Select ledger"', 'placeholder={t("common.selectLedger")}'),
        (
            'searchPlaceholder="Search ledger..."',
            'searchPlaceholder={t("common.searchLedger")}',
        ),
        (
            """                    <TableHead className=" text-white text-center w-16">
                      Sl
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      Trans. Date
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Voucher No.
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Narration
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Debit
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Credit
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Balance
                    </TableHead>""",
            """                    <TableHead className=" text-white text-center w-16">
                      {t("common.sl")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      {t("report.accountLedger.transDate")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.voucherNo")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.narration")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.debit")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.credit")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.balance")}
                    </TableHead>""",
        ),
        (
            """                    <TableCell
                      colSpan={4}
                      className="font-medium border border-secondary"
                    >
                      Total
                    </TableCell>""",
            """                    <TableCell
                      colSpan={4}
                      className="font-medium border border-secondary"
                    >
                      {t("common.total")}
                    </TableCell>""",
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

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = AL / "PreviewModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import { formatDate } from "date-fns";\n',
            'import { formatDate } from "date-fns";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  ledgerId,\n}) => {\n  const [userName, setUserName] = useState(\"\");",
            "  ledgerId,\n}) => {\n  const { t } = useTranslation();\n\n  const [userName, setUserName] = useState(\"\");",
            1,
        )

    repls = [
        (
            """            <p className="text-sm">
              Ledger From {fromDate} To {toDate}
            </p>""",
            """            <p className="text-sm">
              {t("report.accountLedger.ledgerFromTo", {
                fromDate,
                toDate,
              })}
            </p>""",
        ),
        (
            """                    SL. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    TRANS. DATE
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    VOUCHER NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">
                    NARRATION
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    DEBIT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    CREDIT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    BALANCE
                  </TableHead>""",
            """                    {t("report.accountLedger.print.slNo")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.accountLedger.print.transDate")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.accountLedger.print.voucherNo")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">
                    {t("report.accountLedger.print.narration")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.accountLedger.print.debit")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.accountLedger.print.credit")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    {t("report.accountLedger.print.balance")}
                  </TableHead>""",
        ),
        (
            """                      Total
                    </TableCell>""",
            """                      {t("common.total")}
                    </TableCell>""",
        ),
        (
            """            <p className="text-nowrap">Generated By: {userName}</p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
              This report is generated by PrioSuite.
            </p>
            <p className="text-nowrap">
              Generated On: {currentDate} {currentTime}
            </p>""",
            """            <p className="text-nowrap">
              {t("common.generatedBy")}: {userName}
            </p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
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
