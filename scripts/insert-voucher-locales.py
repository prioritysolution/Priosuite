# -*- coding: utf-8 -*-
"""Insert voucher + missing common keys for voucher entry i18n."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"

VOUCHER = {
    "en": {
        "voucherEntry": "Voucher Entry",
        "voucherDate": "Voucher Date",
        "voucherType": "Voucher Type",
        "selectVoucherType": "Select voucher type",
        "receipt": "Receipt",
        "payment": "Payment",
        "journal": "Journal",
        "manualVoucherNo": "Manual Voucher No.",
        "enterManualVoucherNo": "Enter manual voucher no.",
        "narration": "Narration",
        "enterNarration": "Enter narration",
        "ledgerCode": "Ledger Code",
        "enterLedgerCode": "Enter ledger code",
        "enterGl": "Enter GL.",
        "subHead": "Sub Head",
        "selectSubHead": "Select sub head",
        "searchSubHead": "Search sub head...",
        "selectGl": "Select gl",
        "searchGl": "Search gl...",
        "subLedger": "Sub Ledger",
        "subLedgerNarration": "Sub Ledger Narration",
        "enterLedgerNarration": "Enter ledger narration",
        "selectDrCr": "Select dr/cr",
        "debit": "Debit",
        "credit": "Credit",
        "drCr": "DR/CR",
        "subLedgerBalance": "Sub Ledger Balance",
        "enterSubLedgerBalance": "Enter sub ledger balance",
        "totalCredit": "Total Credit",
        "totalDebit": "Total Debit",
        "denominationBlock": "Denomination Block",
        "printReceipt": "Print Receipt",
        "generalReceipt": "General Receipt",
        "receiptDate": "Receipt Date",
        "receiptNo": "Receipt No",
        "particulars": "Particulars",
        "onAccount": "On Account",
        "receivedFor": "Received For",
        "receivedMode": "Received Mode",
        "receivedBy": "Received By",
        "cashier": "Cashier",
        "eAndOe": "E. & O.E.",
        "amountUpper": "AMOUNT",
    },
    "hi": {
        "voucherEntry": "वाउचर प्रविष्टि",
        "voucherDate": "वाउचर दिनांक",
        "voucherType": "वाउचर प्रकार",
        "selectVoucherType": "वाउचर प्रकार चुनें",
        "receipt": "रसीद",
        "payment": "भुगतान",
        "journal": "जर्नल",
        "manualVoucherNo": "मैनुअल वाउचर संख्या",
        "enterManualVoucherNo": "मैनुअल वाउचर संख्या दर्ज करें",
        "narration": "विवरण",
        "enterNarration": "विवरण दर्ज करें",
        "ledgerCode": "लेजर कोड",
        "enterLedgerCode": "लेजर कोड दर्ज करें",
        "enterGl": "GL दर्ज करें",
        "subHead": "उप शीर्ष",
        "selectSubHead": "उप शीर्ष चुनें",
        "searchSubHead": "उप शीर्ष खोजें...",
        "selectGl": "GL चुनें",
        "searchGl": "GL खोजें...",
        "subLedger": "उप लेजर",
        "subLedgerNarration": "उप लेजर विवरण",
        "enterLedgerNarration": "लेजर विवरण दर्ज करें",
        "selectDrCr": "डेबिट/क्रेडिट चुनें",
        "debit": "डेबिट",
        "credit": "क्रेडिट",
        "drCr": "डेबिट/क्रेडिट",
        "subLedgerBalance": "उप लेजर शेष",
        "enterSubLedgerBalance": "उप लेजर शेष दर्ज करें",
        "totalCredit": "कुल क्रेडिट",
        "totalDebit": "कुल डेबिट",
        "denominationBlock": "मूल्यवर्ग विवरण",
        "printReceipt": "रसीद प्रिंट करें",
        "generalReceipt": "सामान्य रसीद",
        "receiptDate": "रसीद दिनांक",
        "receiptNo": "रसीद संख्या",
        "particulars": "विवरण",
        "onAccount": "खाते पर",
        "receivedFor": "के लिए प्राप्त",
        "receivedMode": "प्राप्ति माध्यम",
        "receivedBy": "द्वारा प्राप्त",
        "cashier": "कैशियर",
        "eAndOe": "E. & O.E.",
        "amountUpper": "राशि",
    },
    "bn": {
        "voucherEntry": "ভাউচার এন্ট্রি",
        "voucherDate": "ভাউচার তারিখ",
        "voucherType": "ভাউচারের ধরন",
        "selectVoucherType": "ভাউচারের ধরন নির্বাচন করুন",
        "receipt": "রসিদ",
        "payment": "পেমেন্ট",
        "journal": "জার্নাল",
        "manualVoucherNo": "ম্যানুয়াল ভাউচার নম্বর",
        "enterManualVoucherNo": "ম্যানুয়াল ভাউচার নম্বর লিখুন",
        "narration": "বিবরণ",
        "enterNarration": "বিবরণ লিখুন",
        "ledgerCode": "লেজার কোড",
        "enterLedgerCode": "লেজার কোড লিখুন",
        "enterGl": "GL লিখুন",
        "subHead": "সাব হেড",
        "selectSubHead": "সাব হেড নির্বাচন করুন",
        "searchSubHead": "সাব হেড খুঁজুন...",
        "selectGl": "GL নির্বাচন করুন",
        "searchGl": "GL খুঁজুন...",
        "subLedger": "সাব লেজার",
        "subLedgerNarration": "সাব লেজার বিবরণ",
        "enterLedgerNarration": "লেজার বিবরণ লিখুন",
        "selectDrCr": "ডেবিট/ক্রেডিট নির্বাচন করুন",
        "debit": "ডেবিট",
        "credit": "ক্রেডিট",
        "drCr": "ডেবিট/ক্রেডিট",
        "subLedgerBalance": "সাব লেজার ব্যালেন্স",
        "enterSubLedgerBalance": "সাব লেজার ব্যালেন্স লিখুন",
        "totalCredit": "মোট ক্রেডিট",
        "totalDebit": "মোট ডেবিট",
        "denominationBlock": "মূল্যমান বিবরণ",
        "printReceipt": "রসিদ প্রিন্ট করুন",
        "generalReceipt": "সাধারণ রসিদ",
        "receiptDate": "রসিদের তারিখ",
        "receiptNo": "রসিদ নম্বর",
        "particulars": "বিবরণ",
        "onAccount": "অ্যাকাউন্টে",
        "receivedFor": "যার জন্য প্রাপ্ত",
        "receivedMode": "প্রাপ্তির মাধ্যম",
        "receivedBy": "প্রাপ্ত করেছেন",
        "cashier": "ক্যাশিয়ার",
        "eAndOe": "E. & O.E.",
        "amountUpper": "পরিমাণ",
    },
    "or": {
        "voucherEntry": "ଭାଉଚର ପ୍ରବେଶ",
        "voucherDate": "ଭାଉଚର ତାରିଖ",
        "voucherType": "ଭାଉଚର ପ୍ରକାର",
        "selectVoucherType": "ଭାଉଚର ପ୍ରକାର ବାଛନ୍ତୁ",
        "receipt": "ରସିଦ",
        "payment": "ପେମେଣ୍ଟ",
        "journal": "ଜର୍ଣ୍ଣାଲ",
        "manualVoucherNo": "ମାନୁଆଲ ଭାଉଚର ନମ୍ବର",
        "enterManualVoucherNo": "ମାନୁଆଲ ଭାଉଚର ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
        "narration": "ବିବରଣୀ",
        "enterNarration": "ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ",
        "ledgerCode": "ଲେଜର କୋଡ୍",
        "enterLedgerCode": "ଲେଜର କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ",
        "enterGl": "GL ପ୍ରବେଶ କରନ୍ତୁ",
        "subHead": "ସବ୍ ହେଡ୍",
        "selectSubHead": "ସବ୍ ହେଡ୍ ବାଛନ୍ତୁ",
        "searchSubHead": "ସବ୍ ହେଡ୍ ଖୋଜନ୍ତୁ...",
        "selectGl": "GL ବାଛନ୍ତୁ",
        "searchGl": "GL ଖୋଜନ୍ତୁ...",
        "subLedger": "ସବ୍ ଲେଜର",
        "subLedgerNarration": "ସବ୍ ଲେଜର ବିବରଣୀ",
        "enterLedgerNarration": "ଲେଜର ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ",
        "selectDrCr": "ଡେବିଟ୍/କ୍ରେଡିଟ୍ ବାଛନ୍ତୁ",
        "debit": "ଡେବିଟ୍",
        "credit": "କ୍ରେଡିଟ୍",
        "drCr": "ଡେବିଟ୍/କ୍ରେଡିଟ୍",
        "subLedgerBalance": "ସବ୍ ଲେଜର ବାଲାନ୍ସ",
        "enterSubLedgerBalance": "ସବ୍ ଲେଜର ବାଲାନ୍ସ ପ୍ରବେଶ କରନ୍ତୁ",
        "totalCredit": "ମୋଟ କ୍ରେଡିଟ୍",
        "totalDebit": "ମୋଟ ଡେବିଟ୍",
        "denominationBlock": "ମୂଲ୍ୟବର୍ଗ ବିବରଣୀ",
        "printReceipt": "ରସିଦ ପ୍ରିଣ୍ଟ କରନ୍ତୁ",
        "generalReceipt": "ସାଧାରଣ ରସିଦ",
        "receiptDate": "ରସିଦ ତାରିଖ",
        "receiptNo": "ରସିଦ ନମ୍ବର",
        "particulars": "ବିବରଣୀ",
        "onAccount": "ଖାତାରେ",
        "receivedFor": "ଯାହା ପାଇଁ ପ୍ରାପ୍ତ",
        "receivedMode": "ପ୍ରାପ୍ତି ମାଧ୍ୟମ",
        "receivedBy": "ପ୍ରାପ୍ତ କରିଛନ୍ତି",
        "cashier": "କ୍ୟାଶିଅର",
        "eAndOe": "E. & O.E.",
        "amountUpper": "ରାଶି",
    },
}

COMMON_EXTRA = {
    "en": {
        "enterAmount": "Enter amount",
        "sl": "SL.",
        "glName": "Gl. Name",
        "subLedgerName": "Sub Ledger Name",
        "subLedgerNarration": "Sub Ledger Narration",
        "addToTable": "Add To Table",
        "post": "Post",
        "cancel": "Cancel",
        "branch": "Branch",
        "address": "Address",
        "rupees": "Rupees",
        "only": "Only",
        "totalRs": "Total Rs.",
        "printedOn": "Printed On",
    },
    "hi": {
        "enterAmount": "राशि दर्ज करें",
        "sl": "क्रमांक",
        "glName": "GL नाम",
        "subLedgerName": "उप लेजर नाम",
        "subLedgerNarration": "उप लेजर विवरण",
        "addToTable": "तालिका में जोड़ें",
        "post": "पोस्ट",
        "cancel": "रद्द करें",
        "branch": "शाखा",
        "address": "पता",
        "rupees": "रुपये",
        "only": "केवल",
        "totalRs": "कुल रु.",
        "printedOn": "प्रिंट किया गया",
    },
    "bn": {
        "enterAmount": "পরিমাণ লিখুন",
        "sl": "ক্রমিক",
        "glName": "GL নাম",
        "subLedgerName": "সাব লেজার নাম",
        "subLedgerNarration": "সাব লেজার বিবরণ",
        "addToTable": "টেবিলে যোগ করুন",
        "post": "পোস্ট",
        "cancel": "বাতিল",
        "branch": "শাখা",
        "address": "ঠিকানা",
        "rupees": "রুপি",
        "only": "মাত্র",
        "totalRs": "মোট টাকা",
        "printedOn": "প্রিন্ট করা হয়েছে",
    },
    "or": {
        "enterAmount": "ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
        "sl": "କ୍ରମିକ",
        "glName": "GL ନାମ",
        "subLedgerName": "ସବ୍ ଲେଜର ନାମ",
        "subLedgerNarration": "ସବ୍ ଲେଜର ବିବରଣୀ",
        "addToTable": "ଟେବୁଲରେ ଯୋଡନ୍ତୁ",
        "post": "ପୋଷ୍ଟ",
        "cancel": "ବାତିଲ୍",
        "branch": "ଶାଖା",
        "address": "ଠିକଣା",
        "rupees": "ଟଙ୍କା",
        "only": "କେବଳ",
        "totalRs": "ମୋଟ ଟଙ୍କା",
        "printedOn": "ପ୍ରିଣ୍ଟ କରାଯାଇଛି",
    },
}


def obj_to_js(d: dict, indent=6) -> str:
    sp = " " * indent
    lines = [f"{sp}{k}: {json.dumps(v, ensure_ascii=False)}," for k, v in d.items()]
    if lines:
        lines[-1] = lines[-1].rstrip(",")
    return "\n".join(lines)


def patch(lang: str):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    # insert voucher before closing of translation (before final `  },\n};`)
    if "\n    voucher: {" not in text:
        voucher_block = (
            "\n    voucher: {\n"
            + obj_to_js(VOUCHER[lang], 6)
            + "\n    },"
        )
        # insert before last `  },` that closes translation — after bank block
        marker = "\n  },\n};\n\nexport default"
        # files end with `};\n\nexport default` or `};\nexport default`
        for m in ("\n  },\n};\n\nexport default", "\n  },\n};\nexport default"):
            if m in text:
                # find last occurrence of bank closing - insert voucher before translation close
                # Actually structure is: ... bank: { ... }, \n  }, \n};
                # Insert voucher after bank object
                bi = text.rfind("\n    bank: {")
                i = text.find("{", bi)
                depth = 0
                end = None
                for j in range(i, len(text)):
                    if text[j] == "{":
                        depth += 1
                    elif text[j] == "}":
                        depth -= 1
                        if depth == 0:
                            end = j + 1
                            break
                text = text[:end] + "," + voucher_block + text[end:]
                break
        else:
            raise SystemExit(f"insert point not found in {lang}")

    # merge common extras into root common (rfind \n    common: {)
    ci = text.rfind("\n    common: {")
    # but careful - bank might come after common. Root common is before bank.
    # Find common that is sibling of bank: look for common before bank
    bi = text.rfind("\n    bank: {")
    ci = text.rfind("\n    common: {", 0, bi)
    i = text.find("{", ci)
    depth = 0
    end = None
    for j in range(i, len(text)):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                end = j
                break
    chunk = text[i:end]
    missing = {k: v for k, v in COMMON_EXTRA[lang].items() if f"{k}:" not in chunk}
    # also set gl to GL. if present as GL without period — leave as-is if exists
    if "gl:" not in chunk:
        missing["gl"] = "GL." if lang == "en" else VOUCHER[lang].get("enterGl", "GL.").replace("Enter ", "").replace(" दर्ज करें", "").replace(" লিখুন", "").replace(" ପ୍ରବେଶ କରନ୍ତୁ", "") or "GL."
    if lang == "en" and "gl:" not in chunk:
        missing["gl"] = "GL."
    elif lang != "en" and "gl:" not in chunk:
        missing["gl"] = "GL."

    if missing:
        body = chunk.rstrip()
        if not body.endswith(","):
            if body.endswith('"'):
                body = body + ","
        insert = "".join(
            f"\n      {k}: {json.dumps(v, ensure_ascii=False)}," for k, v in missing.items()
        ).rstrip(",")
        text = text[:i] + body + insert + "\n    " + text[end:]

    path.write_text(text, encoding="utf-8")
    print(lang, "ok", "voucher", "common+" + str(list(missing)))


for lang in ("en", "hi", "bn", "or"):
    patch(lang)
