# -*- coding: utf-8 -*-
"""Insert borrowings namespace + missing common keys."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"

BORROWINGS = {
    "en": {
        "borrowingsNewApplication": "Borrowings New Application",
        "basicDetails": "Basic Details",
        "productName": "Product Name",
        "enterProductName": "Enter product name",
        "productType": "Product Type",
        "selectProductType": "Select product type",
        "searchProductType": "Search product type...",
        "repaymentMode": "Repayment Mode",
        "selectRepaymentMode": "Select repayment mode",
        "searchRepaymentMode": "Search repayment mode...",
        "enterBankName": "Enter bank name",
        "enterAccountNo": "Enter account no.",
        "disbDate": "Disb Date",
        "enterAmount": "Enter amount",
        "rateOfInterest": "Rate Of Interest",
        "enterRateOfInterest": "Enter rate of interest",
        "overdueRate": "Overdue Rate",
        "enterOverdueRate": "Enter overdue rate",
        "durationInMonth": "Duration (In Month)",
        "enterDuration": "Enter duration",
        "dueDate": "Due Date",
        "enterDueDate": "Enter due date",
        "principalLedger": "Principal Ledger",
        "interestLedger": "Interest Ledger",
        "selectLedger": "Select ledger",
        "searchLedger": "Search ledger...",
        "selectBank": "Select bank",
        "searchBank": "Search bank...",
    },
    "hi": {
        "borrowingsNewApplication": "उधार नया आवेदन",
        "basicDetails": "मूल विवरण",
        "productName": "उत्पाद का नाम",
        "enterProductName": "उत्पाद का नाम दर्ज करें",
        "productType": "उत्पाद प्रकार",
        "selectProductType": "उत्पाद प्रकार चुनें",
        "searchProductType": "उत्पाद प्रकार खोजें...",
        "repaymentMode": "भुगतान का तरीका",
        "selectRepaymentMode": "भुगतान का तरीका चुनें",
        "searchRepaymentMode": "भुगतान का तरीका खोजें...",
        "enterBankName": "बैंक का नाम दर्ज करें",
        "enterAccountNo": "खाता संख्या दर्ज करें",
        "disbDate": "वितरण तिथि",
        "enterAmount": "राशि दर्ज करें",
        "rateOfInterest": "ब्याज दर",
        "enterRateOfInterest": "ब्याज दर दर्ज करें",
        "overdueRate": "अतिदेय दर",
        "enterOverdueRate": "अतिदेय दर दर्ज करें",
        "durationInMonth": "अवधि (महीने में)",
        "enterDuration": "अवधि दर्ज करें",
        "dueDate": "देय तिथि",
        "enterDueDate": "देय तिथि दर्ज करें",
        "principalLedger": "मूलधन लेजर",
        "interestLedger": "ब्याज लेजर",
        "selectLedger": "लेजर चुनें",
        "searchLedger": "लेजर खोजें...",
        "selectBank": "बैंक चुनें",
        "searchBank": "बैंक खोजें...",
    },
    "bn": {
        "borrowingsNewApplication": "ঋণের নতুন আবেদন",
        "basicDetails": "মৌলিক বিবরণ",
        "productName": "পণ্যের নাম",
        "enterProductName": "পণ্যের নাম লিখুন",
        "productType": "পণ্যের ধরন",
        "selectProductType": "পণ্যের ধরন নির্বাচন করুন",
        "searchProductType": "পণ্যের ধরন অনুসন্ধান করুন...",
        "repaymentMode": "পরিশোধের পদ্ধতি",
        "selectRepaymentMode": "পরিশোধের পদ্ধতি নির্বাচন করুন",
        "searchRepaymentMode": "পরিশোধের পদ্ধতি অনুসন্ধান করুন...",
        "enterBankName": "ব্যাংকের নাম লিখুন",
        "enterAccountNo": "অ্যাকাউন্ট নম্বর লিখুন",
        "disbDate": "বিতরণের তারিখ",
        "enterAmount": "পরিমাণ লিখুন",
        "rateOfInterest": "সুদের হার",
        "enterRateOfInterest": "সুদের হার লিখুন",
        "overdueRate": "বকেয়া হার",
        "enterOverdueRate": "বকেয়া হার লিখুন",
        "durationInMonth": "সময়কাল (মাসে)",
        "enterDuration": "সময়কাল লিখুন",
        "dueDate": "নির্ধারিত তারিখ",
        "enterDueDate": "নির্ধারিত তারিখ লিখুন",
        "principalLedger": "মূলধন লেজার",
        "interestLedger": "সুদের লেজার",
        "selectLedger": "লেজার নির্বাচন করুন",
        "searchLedger": "লেজার অনুসন্ধান করুন...",
        "selectBank": "ব্যাংক নির্বাচন করুন",
        "searchBank": "ব্যাংক অনুসন্ধান করুন...",
    },
    "or": {
        "borrowingsNewApplication": "ଋଣ ନୂତନ ଆବେଦନ",
        "basicDetails": "ମୌଳିକ ବିବରଣୀ",
        "productName": "ଉତ୍ପାଦ ନାମ",
        "enterProductName": "ଉତ୍ପାଦ ନାମ ଲେଖନ୍ତୁ",
        "productType": "ଉତ୍ପାଦ ପ୍ରକାର",
        "selectProductType": "ଉତ୍ପାଦ ପ୍ରକାର ଚୟନ କରନ୍ତୁ",
        "searchProductType": "ଉତ୍ପାଦ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "repaymentMode": "ପରିଶୋଧ ପ୍ରଣାଳୀ",
        "selectRepaymentMode": "ପରିଶୋଧ ପ୍ରଣାଳୀ ଚୟନ କରନ୍ତୁ",
        "searchRepaymentMode": "ପରିଶୋଧ ପ୍ରଣାଳୀ ଖୋଜନ୍ତୁ...",
        "enterBankName": "ବ୍ୟାଙ୍କ ନାମ ଲେଖନ୍ତୁ",
        "enterAccountNo": "ଆକାଉଣ୍ଟ ନମ୍ବର ଲେଖନ୍ତୁ",
        "disbDate": "ବଣ୍ଟନ ତାରିଖ",
        "enterAmount": "ରାଶି ଲେଖନ୍ତୁ",
        "rateOfInterest": "ସୁଧ ହାର",
        "enterRateOfInterest": "ସୁଧ ହାର ଲେଖନ୍ତୁ",
        "overdueRate": "ବକେୟା ହାର",
        "enterOverdueRate": "ବକେୟା ହାର ଲେଖନ୍ତୁ",
        "durationInMonth": "ଅବଧି (ମାସରେ)",
        "enterDuration": "ଅବଧି ଲେଖନ୍ତୁ",
        "dueDate": "ଦେୟ ତାରିଖ",
        "enterDueDate": "ଦେୟ ତାରିଖ ଲେଖନ୍ତୁ",
        "principalLedger": "ମୂଳଧନ ଲେଜର",
        "interestLedger": "ସୁଧ ଲେଜର",
        "selectLedger": "ଲେଜର ଚୟନ କରନ୍ତୁ",
        "searchLedger": "ଲେଜର ଖୋଜନ୍ତୁ...",
        "selectBank": "ବ୍ୟାଙ୍କ ଚୟନ କରନ୍ତୁ",
        "searchBank": "ବ୍ୟାଙ୍କ ଖୋଜନ୍ତୁ...",
    },
}

COMMON_EXTRA = {
    "en": {
        "voucherDetails": "Voucher Details",
        "enterParticulars": "Enter particulars",
    },
    "hi": {
        "voucherDetails": "वाउचर विवरण",
        "enterParticulars": "विवरण दर्ज करें",
    },
    "bn": {
        "voucherDetails": "ভাউচার বিবরণ",
        "enterParticulars": "বিবরণ লিখুন",
    },
    "or": {
        "voucherDetails": "ଭାଉଚର ବିବରଣୀ",
        "enterParticulars": "ବିବରଣୀ ଲେଖନ୍ତୁ",
    },
}


def dump_obj(obj, indent=6):
    lines = [
        " " * indent + f"{k}: {json.dumps(v, ensure_ascii=False)},"
        for k, v in obj.items()
    ]
    if lines:
        lines[-1] = lines[-1].rstrip(",")
    return "\n".join(lines)


for name in ["en", "hi", "bn", "or"]:
    p = LOC / f"{name}.js"
    t = p.read_text(encoding="utf-8")

    # common before bank
    idx = t.rfind("    common: {")
    end = t.find("\n    bank:", idx)
    section = t[idx:end]
    close = section.rfind("\n    },")
    before = section[:close].rstrip()
    if not before.endswith(","):
        lines = before.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines)
    before += "\n"
    added_c = []
    for k, v in COMMON_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added_c.append(k)
    t = t[:idx] + before + "    }," + t[end:]
    print(name, "common+", added_c)

    block = "\n    borrowings: {\n" + dump_obj(BORROWINGS[name]) + "\n    },"
    if re.search(r"\n    borrowings: \{", t):
        t = re.sub(
            r"\n    borrowings: \{[\s\S]*?\n    \},?",
            block,
            t,
            count=1,
        )
        print(name, "borrowings replaced")
    else:
        # after investment
        m = re.search(r"\n    investment: \{", t)
        if not m:
            raise SystemExit(f"{name}: investment missing")
        idx = m.start() + 1
        brace = 0
        i = t.find("{", idx)
        for j in range(i, len(t)):
            if t[j] == "{":
                brace += 1
            elif t[j] == "}":
                brace -= 1
                if brace == 0:
                    end_brace = j
                    break
        end = end_brace + 1
        had_comma = end < len(t) and t[end] == ","
        if not had_comma:
            # ensure investment has trailing comma before borrowings
            t = t[:end_brace + 1] + "," + t[end_brace + 1:]
            end = end_brace + 2
        t = t[:end] + block + t[end:]
        print(name, "borrowings after investment")

    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
