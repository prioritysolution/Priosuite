# -*- coding: utf-8 -*-
"""Insert report.cashAccount + missing common keys into locales."""
from pathlib import Path
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"


def js_obj(d, indent=8):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


CASH_ACCOUNT = {
    "en": {
        "cashAccountReport": "Cash Account Report",
        "vNo": "V. No.",
        "nameOfLedger": "NAME OF LEDGER",
        "closingCashBalanceInWord": "Closing Cash Balance in Word",
        "denominationTable": "Denomination table",
        "listOfVouchersForTheDayOn": "List Of Vouchers For The Day On",
        "transactionType": "Transanction Type",
        "nothingToDownload": "Nothing to download. Please generate the report first.",
        "noDataToDownload": "No cash account data to download.",
        "failedToCapturePdf": "Failed to capture report for PDF.",
        "pdfDownloaded": "PDF downloaded",
        "failedToDownloadPdf": "Failed to download PDF",
        "cashAccountFrom": "Cash Account From",
        "closingBalanceInWords": "Closing Balance In Words",
        "physicalDenomination": "Physical Denomination",
        "print": {
            "vNo": "V. NO.",
            "particulars": "PARTICULARS",
            "receipts": "RECEIPTS",
            "payments": "PAYMENTS",
            "cash": "CASH",
            "transfer": "TRANSFER",
            "total": "TOTAL",
            "slNo": "Sl. NO.",
            "denomination": "Denomination",
            "quantity": "Quantity",
            "value": "Value",
            "receipt": "RECEIPT",
            "payment": "PAYMENT",
        },
    },
    "hi": {
        "cashAccountReport": "कैश अकाउंट रिपोर्ट",
        "vNo": "वाउचर संख्या",
        "nameOfLedger": "लेजर का नाम",
        "closingCashBalanceInWord": "शब्दों में समापन नकद शेष",
        "denominationTable": "मूल्यवर्ग तालिका",
        "listOfVouchersForTheDayOn": "दिन के वाउचरों की सूची",
        "transactionType": "लेनदेन प्रकार",
        "nothingToDownload": "डाउनलोड करने के लिए कुछ नहीं है। कृपया पहले रिपोर्ट तैयार करें।",
        "noDataToDownload": "डाउनलोड करने के लिए कोई कैश अकाउंट डेटा नहीं है।",
        "failedToCapturePdf": "PDF के लिए रिपोर्ट कैप्चर करने में विफल।",
        "pdfDownloaded": "PDF डाउनलोड हो गया",
        "failedToDownloadPdf": "PDF डाउनलोड करने में विफल",
        "cashAccountFrom": "कैश अकाउंट",
        "closingBalanceInWords": "शब्दों में समापन शेष",
        "physicalDenomination": "भौतिक मूल्यवर्ग",
        "print": {
            "vNo": "वाउचर संख्या",
            "particulars": "विवरण",
            "receipts": "रसीदें",
            "payments": "भुगतान",
            "cash": "नकद",
            "transfer": "हस्तांतरण",
            "total": "कुल",
            "slNo": "क्रमांक",
            "denomination": "मूल्यवर्ग",
            "quantity": "मात्रा",
            "value": "मूल्य",
            "receipt": "रसीद",
            "payment": "भुगतान",
        },
    },
    "bn": {
        "cashAccountReport": "ক্যাশ অ্যাকাউন্ট রিপোর্ট",
        "vNo": "ভাউচার নং",
        "nameOfLedger": "লেজারের নাম",
        "closingCashBalanceInWord": "কথায় সমাপনী নগদ ব্যালেন্স",
        "denominationTable": "মূল্যমানের টেবিল",
        "listOfVouchersForTheDayOn": "দিনের ভাউচারের তালিকা",
        "transactionType": "লেনদেনের ধরন",
        "nothingToDownload": "ডাউনলোড করার মতো কিছু নেই। অনুগ্রহ করে প্রথমে রিপোর্ট তৈরি করুন।",
        "noDataToDownload": "ডাউনলোড করার জন্য কোনো ক্যাশ অ্যাকাউন্ট ডেটা নেই।",
        "failedToCapturePdf": "PDF-এর জন্য রিপোর্ট ক্যাপচার করতে ব্যর্থ।",
        "pdfDownloaded": "PDF ডাউনলোড হয়েছে",
        "failedToDownloadPdf": "PDF ডাউনলোড করতে ব্যর্থ",
        "cashAccountFrom": "ক্যাশ অ্যাকাউন্ট",
        "closingBalanceInWords": "কথায় সমাপনী ব্যালেন্স",
        "physicalDenomination": "ভৌত মূল্যমান",
        "print": {
            "vNo": "ভাউচার নং",
            "particulars": "বিবরণ",
            "receipts": "রসিদসমূহ",
            "payments": "পেমেন্টসমূহ",
            "cash": "নগদ",
            "transfer": "স্থানান্তর",
            "total": "মোট",
            "slNo": "ক্রমিক নং",
            "denomination": "মূল্যমান",
            "quantity": "পরিমাণ",
            "value": "মূল্য",
            "receipt": "রসিদ",
            "payment": "পেমেন্ট",
        },
    },
    "or": {
        "cashAccountReport": "କ୍ୟାଶ ଆକାଉଣ୍ଟ ରିପୋର୍ଟ",
        "vNo": "ଭାଉଚର୍ ନମ୍ବର",
        "nameOfLedger": "ଲେଜର ନାମ",
        "closingCashBalanceInWord": "ଶବ୍ଦରେ ସମାପନ ନଗଦ ବାଲାନ୍ସ",
        "denominationTable": "ମୂଲ୍ୟବର୍ଗ ଟେବୁଲ୍",
        "listOfVouchersForTheDayOn": "ଦିନର ଭାଉଚରଗୁଡ଼ିକର ତାଲିକା",
        "transactionType": "କାରବାର ପ୍ରକାର",
        "nothingToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କିଛି ନାହିଁ। ଦୟାକରି ପ୍ରଥମେ ରିପୋର୍ଟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ।",
        "noDataToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି କ୍ୟାଶ ଆକାଉଣ୍ଟ ଡାଟା ନାହିଁ।",
        "failedToCapturePdf": "PDF ପାଇଁ ରିପୋର୍ଟ କ୍ୟାପଚର୍ କରିବାରେ ବିଫଳ।",
        "pdfDownloaded": "PDF ଡାଉନଲୋଡ୍ ହୋଇଛି",
        "failedToDownloadPdf": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ",
        "cashAccountFrom": "କ୍ୟାଶ ଆକାଉଣ୍ଟ",
        "closingBalanceInWords": "ଶବ୍ଦରେ ସମାପନ ବାଲାନ୍ସ",
        "physicalDenomination": "ଭୌତିକ ମୂଲ୍ୟବର୍ଗ",
        "print": {
            "vNo": "ଭାଉଚର୍ ନମ୍ବର",
            "particulars": "ବିବରଣୀ",
            "receipts": "ରସିଦଗୁଡ଼ିକ",
            "payments": "ପେମେଣ୍ଟଗୁଡ଼ିକ",
            "cash": "ନଗଦ",
            "transfer": "ସ୍ଥାନାନ୍ତର",
            "total": "ମୋଟ",
            "slNo": "କ୍ରମିକ ନମ୍ବର",
            "denomination": "ମୂଲ୍ୟବର୍ଗ",
            "quantity": "ପରିମାଣ",
            "value": "ମୂଲ୍ୟ",
            "receipt": "ରସିଦ",
            "payment": "ପେମେଣ୍ଟ",
        },
    },
}

COMMON_EXTRA = {
    "en": {"to": "To", "receipts": "Receipts", "payments": "Payments"},
    "hi": {"to": "से", "receipts": "रसीदें", "payments": "भुगतान"},
    "bn": {"to": "থেকে", "receipts": "রসিদসমূহ", "payments": "পেমেন্টসমূহ"},
    "or": {"to": "ରୁ", "receipts": "ରସିଦଗୁଡ଼ିକ", "payments": "ପେମେଣ୍ଟଗୁଡ଼ିକ"},
}


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


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    if re.search(r"\n      cashAccount:\s*\{", text):
        print(f"{lang}: report.cashAccount already present")
    else:
        block = (
            "      cashAccount: {\n"
            + js_nested(CASH_ACCOUNT[lang], indent=8)
            + "\n      },"
        )
        # Insert before closing of top-level report object
        m = re.search(r"(\n      cashbook:\s*\{)", text)
        if not m:
            raise SystemExit(f"{lang}: cashbook not found in report")
        # Find matching close of cashbook at indent 6, then report close at indent 4
        start = m.start(1)
        # walk from cashbook open to its closing `      },` or `      }`
        depth = 0
        i = m.end(1) - 1  # at '{'
        end_cashbook = None
        while i < len(text):
            ch = text[i]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    # include trailing comma if present
                    j = i + 1
                    if j < len(text) and text[j] == ",":
                        j += 1
                    end_cashbook = j
                    break
            i += 1
        if end_cashbook is None:
            raise SystemExit(f"{lang}: could not close cashbook")
        text = text[:end_cashbook] + "\n" + block + text[end_cashbook:]
        print(f"{lang}: inserted report.cashAccount")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common extras")
        text = text2
    else:
        print(f"{lang}: common extras ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)


if __name__ == "__main__":
    main()
