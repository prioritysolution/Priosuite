# -*- coding: utf-8 -*-
"""Insert report.cashbook + merge common/voucher keys; wire cashbook components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        if isinstance(v, dict):
            lines.append(f"{pad}{k}: {{")
            lines.append(js_obj(v, indent + 2))
            lines.append(f"{pad}}}{comma}")
        else:
            esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
            lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


CASHBOOK = {
    "en": {
        "cashbookReport": "Cashbook Report",
        "cashbookAsOn": "Cashbook As On",
        "physicalDenomination": "Physical Denomination",
        "closingCashBalanceInWords": "Closing Cash Balance in Word",
        "closingBalanceInWords": "Closing Balance In Words",
        "nothingToDownload": "Nothing to download. Please generate the report first.",
        "noDataToDownload": "No cashbook data to download.",
        "failedToCapturePdf": "Failed to capture report for PDF.",
        "pdfDownloaded": "PDF downloaded",
        "failedToDownloadPdf": "Failed to download PDF",
        "receipt": "Receipt",
        "payment": "Payment",
        "slNo": "SL. NO.",
        "vouchNo": "Vouch No.",
        "ledgerName": "Ledger Name",
        "particulars": "PARTICULARS",
        "amount": "AMOUNT",
        "total": "Total",
        "openingBalance": "Opening Balance",
        "closingBalance": "Closing Balance",
        "print": {
            "receipt": "RECEIPT",
            "payment": "PAYMENT",
            "sl": "SL.",
            "vouchNo": "Vouch No.",
            "ledgerName": "Ledger Name",
            "particulars": "PARTICULARS",
            "amount": "AMOUNT",
            "slNo": "Sl. NO.",
            "denomination": "Denomination",
            "quantity": "Quantity",
            "value": "Value",
        },
    },
    "hi": {
        "cashbookReport": "कैशबुक रिपोर्ट",
        "cashbookAsOn": "कैशबुक दिनांक",
        "physicalDenomination": "भौतिक मूल्यवर्ग",
        "closingCashBalanceInWords": "शब्दों में समापन नकद शेष",
        "closingBalanceInWords": "शब्दों में समापन शेष",
        "nothingToDownload": "डाउनलोड करने के लिए कुछ नहीं है। कृपया पहले रिपोर्ट तैयार करें।",
        "noDataToDownload": "डाउनलोड करने के लिए कोई कैशबुक डेटा नहीं है।",
        "failedToCapturePdf": "PDF के लिए रिपोर्ट कैप्चर करने में विफल।",
        "pdfDownloaded": "PDF डाउनलोड हो गया",
        "failedToDownloadPdf": "PDF डाउनलोड करने में विफल",
        "receipt": "रसीद",
        "payment": "भुगतान",
        "slNo": "क्रमांक",
        "vouchNo": "वाउचर संख्या",
        "ledgerName": "लेजर का नाम",
        "particulars": "विवरण",
        "amount": "राशि",
        "total": "कुल",
        "openingBalance": "प्रारंभिक शेष",
        "closingBalance": "समापन शेष",
        "print": {
            "receipt": "रसीद",
            "payment": "भुगतान",
            "sl": "क्रमांक",
            "vouchNo": "वाउचर संख्या",
            "ledgerName": "लेजर का नाम",
            "particulars": "विवरण",
            "amount": "राशि",
            "slNo": "क्रमांक",
            "denomination": "मूल्यवर्ग",
            "quantity": "मात्रा",
            "value": "मूल्य",
        },
    },
    "bn": {
        "cashbookReport": "ক্যাশবুক রিপোর্ট",
        "cashbookAsOn": "ক্যাশবুক তারিখ",
        "physicalDenomination": "ভৌত মূল্যমান",
        "closingCashBalanceInWords": "কথায় সমাপনী নগদ ব্যালেন্স",
        "closingBalanceInWords": "কথায় সমাপনী ব্যালেন্স",
        "nothingToDownload": "ডাউনলোড করার মতো কিছু নেই। অনুগ্রহ করে প্রথমে রিপোর্ট তৈরি করুন।",
        "noDataToDownload": "ডাউনলোড করার জন্য কোনো ক্যাশবুক ডেটা নেই।",
        "failedToCapturePdf": "PDF-এর জন্য রিপোর্ট ক্যাপচার করতে ব্যর্থ।",
        "pdfDownloaded": "PDF ডাউনলোড হয়েছে",
        "failedToDownloadPdf": "PDF ডাউনলোড করতে ব্যর্থ",
        "receipt": "রসিদ",
        "payment": "পেমেন্ট",
        "slNo": "ক্রমিক নং",
        "vouchNo": "ভাউচার নম্বর",
        "ledgerName": "লেজারের নাম",
        "particulars": "বিবরণ",
        "amount": "পরিমাণ",
        "total": "মোট",
        "openingBalance": "প্রারম্ভিক ব্যালেন্স",
        "closingBalance": "সমাপনী ব্যালেন্স",
        "print": {
            "receipt": "রসিদ",
            "payment": "পেমেন্ট",
            "sl": "ক্রমিক",
            "vouchNo": "ভাউচার নম্বর",
            "ledgerName": "লেজারের নাম",
            "particulars": "বিবরণ",
            "amount": "পরিমাণ",
            "slNo": "ক্রমিক নং",
            "denomination": "মূল্যমান",
            "quantity": "পরিমাণ",
            "value": "মূল্য",
        },
    },
    "or": {
        "cashbookReport": "କ୍ୟାଶବୁକ୍ ରିପୋର୍ଟ",
        "cashbookAsOn": "କ୍ୟାଶବୁକ୍ ତାରିଖ",
        "physicalDenomination": "ଭୌତିକ ମୂଲ୍ୟବର୍ଗ",
        "closingCashBalanceInWords": "ଶବ୍ଦରେ ସମାପନ ନଗଦ ବାଲାନ୍ସ",
        "closingBalanceInWords": "ଶବ୍ଦରେ ସମାପନ ବାଲାନ୍ସ",
        "nothingToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କିଛି ନାହିଁ। ଦୟାକରି ପ୍ରଥମେ ରିପୋର୍ଟ ପ୍ରସ୍ତୁତ କରନ୍ତୁ।",
        "noDataToDownload": "ଡାଉନଲୋଡ୍ କରିବା ପାଇଁ କୌଣସି କ୍ୟାଶବୁକ୍ ଡାଟା ନାହିଁ।",
        "failedToCapturePdf": "PDF ପାଇଁ ରିପୋର୍ଟ କ୍ୟାପଚର୍ କରିବାରେ ବିଫଳ।",
        "pdfDownloaded": "PDF ଡାଉନଲୋଡ୍ ହୋଇଛି",
        "failedToDownloadPdf": "PDF ଡାଉନଲୋଡ୍ କରିବାରେ ବିଫଳ",
        "receipt": "ରସିଦ",
        "payment": "ପେମେଣ୍ଟ",
        "slNo": "କ୍ରମିକ ନମ୍ବର",
        "vouchNo": "ଭାଉଚର୍ ନମ୍ବର",
        "ledgerName": "ଲେଜର ନାମ",
        "particulars": "ବିବରଣୀ",
        "amount": "ରାଶି",
        "total": "ମୋଟ",
        "openingBalance": "ଆରମ୍ଭିକ ବାଲାନ୍ସ",
        "closingBalance": "ସମାପନ ବାଲାନ୍ସ",
        "print": {
            "receipt": "ରସିଦ",
            "payment": "ପେମେଣ୍ଟ",
            "sl": "କ୍ରମିକ",
            "vouchNo": "ଭାଉଚର୍ ନମ୍ବର",
            "ledgerName": "ଲେଜର ନାମ",
            "particulars": "ବିବରଣୀ",
            "amount": "ରାଶି",
            "slNo": "କ୍ରମିକ ନମ୍ବର",
            "denomination": "ମୂଲ୍ୟବର୍ଗ",
            "quantity": "ପରିମାଣ",
            "value": "ମୂଲ୍ୟ",
        },
    },
}

COMMON_EXTRA = {
    "en": {
        "receipt": "Receipt",
        "payment": "Payment",
        "openingBalance": "Opening Balance",
        "closingBalance": "Closing Balance",
        "headOfAccount": "Head Of Account",
        "drAmount": "Dr. Amount",
        "crAmount": "Cr. Amount",
        "zero": "Zero",
        "thisReportIsGeneratedByPrioSuite": "This report is generated by PrioSuite.",
        "denomination": "Denomination",
        "quantity": "Quantity",
        "value": "Value",
        "ledgerName": "Ledger Name",
        "total": "Total",
        "generatedBy": "Generated By",
        "generatedOn": "Generated On",
    },
    "hi": {
        "receipt": "रसीद",
        "payment": "भुगतान",
        "openingBalance": "प्रारंभिक शेष",
        "closingBalance": "समापन शेष",
        "headOfAccount": "खाते का शीर्ष",
        "drAmount": "डेबिट राशि",
        "crAmount": "क्रेडिट राशि",
        "zero": "शून्य",
        "thisReportIsGeneratedByPrioSuite": "यह रिपोर्ट PrioSuite द्वारा तैयार की गई है।",
        "denomination": "मूल्यवर्ग",
        "quantity": "मात्रा",
        "value": "मूल्य",
        "ledgerName": "लेजर का नाम",
        "total": "कुल",
        "generatedBy": "द्वारा निर्मित",
        "generatedOn": "निर्मित दिनांक",
    },
    "bn": {
        "receipt": "রসিদ",
        "payment": "পেমেন্ট",
        "openingBalance": "প্রারম্ভিক ব্যালেন্স",
        "closingBalance": "সমাপনী ব্যালেন্স",
        "headOfAccount": "অ্যাকাউন্টের শিরোনাম",
        "drAmount": "ডেবিট পরিমাণ",
        "crAmount": "ক্রেডিট পরিমাণ",
        "zero": "শূন্য",
        "thisReportIsGeneratedByPrioSuite": "এই রিপোর্টটি PrioSuite দ্বারা তৈরি করা হয়েছে।",
        "denomination": "মূল্যমান",
        "quantity": "পরিমাণ",
        "value": "মূল্য",
        "ledgerName": "লেজারের নাম",
        "total": "মোট",
        "generatedBy": "প্রস্তুত করেছেন",
        "generatedOn": "তৈরির তারিখ",
    },
    "or": {
        "receipt": "ରସିଦ",
        "payment": "ପେମେଣ୍ଟ",
        "openingBalance": "ଆରମ୍ଭିକ ବାଲାନ୍ସ",
        "closingBalance": "ସମାପନ ବାଲାନ୍ସ",
        "headOfAccount": "ଆକାଉଣ୍ଟ ଶୀର୍ଷ",
        "drAmount": "ଡେବିଟ୍ ରାଶି",
        "crAmount": "କ୍ରେଡିଟ୍ ରାଶି",
        "zero": "ଶୂନ",
        "thisReportIsGeneratedByPrioSuite": "ଏହି ରିପୋର୍ଟ PrioSuite ଦ୍ୱାରା ପ୍ରସ୍ତୁତ କରାଯାଇଛି।",
        "denomination": "ମୂଲ୍ୟବର୍ଗ",
        "quantity": "ପରିମାଣ",
        "value": "ମୂଲ୍ୟ",
        "ledgerName": "ଲେଜର ନାମ",
        "total": "ମୋଟ",
        "generatedBy": "ପ୍ରସ୍ତୁତକର୍ତ୍ତା",
        "generatedOn": "ପ୍ରସ୍ତୁତ ତାରିଖ",
    },
}

VOUCHER_EXTRA = {
    "en": {"voucherNo": "Voucher No.", "refVcNo": "Ref. Vc. No"},
    "hi": {"voucherNo": "वाउचर संख्या", "refVcNo": "संदर्भ वाउचर संख्या"},
    "bn": {"voucherNo": "ভাউচার নম্বর", "refVcNo": "রেফ. ভাউচার নম্বর"},
    "or": {"voucherNo": "ଭାଉଚର୍ ନମ୍ବର", "refVcNo": "ରେଫ୍. ଭାଉଚର୍ ନମ୍ବର"},
}


def merge_keys_into_object(text: str, obj_pattern: str, extras: dict) -> str:
    """Insert missing keys before closing of a top-level object matched by obj_pattern."""
    m = re.search(obj_pattern, text)
    if not m:
        raise SystemExit(f"object not found: {obj_pattern}")
    body = m.group(1)
    start, end = m.start(1), m.end(1)
    to_add = []
    for k, v in extras.items():
        if re.search(rf"\n      {re.escape(k)}:", body):
            continue
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        to_add.append(f'      {k}: "{esc}"')
    if not to_add:
        return text
    # ensure trailing comma on last existing property line inside body
    body_stripped = body.rstrip()
    if body_stripped and not body_stripped.endswith(","):
        # find last property line
        lines = body.split("\n")
        for i in range(len(lines) - 1, -1, -1):
            if re.search(r':\s*(".*"|\{)\s*$', lines[i].rstrip()) or lines[i].rstrip().endswith("}"):
                if lines[i].rstrip() and not lines[i].rstrip().endswith(","):
                    lines[i] = lines[i].rstrip() + ","
                break
        body = "\n".join(lines)
    insert = ",\n".join(to_add)
    new_body = body.rstrip() + ",\n" + insert + "\n"
    return text[:start] + new_body + text[end:]


def insert_cashbook(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    if re.search(r"\n      cashbook:\s*\{", text):
        print(f"{lang}: report.cashbook already present")
    else:
        block = (
            "      cashbook: {\n"
            + js_obj(CASHBOOK[lang], indent=8)
            + "\n      },\n"
        )
        # Insert after report.daybook closing
        m = re.search(r"(      daybook:\s*\{[\s\S]*?\n      \})(,\n)?(\s*\n    \})", text)
        if not m:
            raise SystemExit(f"{lang}: could not find report.daybook")
        # after daybook }, before report close
        text = text[: m.end(1)] + ",\n" + block.rstrip() + "\n" + text[m.end(1) :].lstrip(",")
        # cleanup possible double commas
        text = text.replace(",\n,\n", ",\n")
        print(f"{lang}: inserted report.cashbook")

    # Merge into last top-level common (before bank:)
    text2 = merge_keys_into_object(
        text,
        r"\n    common: \{([\s\S]*?)\n    \},\n    bank:",
        COMMON_EXTRA[lang],
    )
    if text2 != text:
        print(f"{lang}: merged common extras")
        text = text2
    else:
        print(f"{lang}: common extras already present or none added")

    # Merge into voucher
    text2 = merge_keys_into_object(
        text,
        r"\n    voucher: \{([\s\S]*?)\n    \},\n    adjustmentVoucher:",
        VOUCHER_EXTRA[lang],
    )
    if text2 != text:
        print(f"{lang}: merged voucher extras")
        text = text2
    else:
        print(f"{lang}: voucher extras already present or none added")

    path.write_text(text, encoding="utf-8")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_cashbook(lang)


if __name__ == "__main__":
    main()
