# -*- coding: utf-8 -*-
"""Insert investment namespace + missing common keys (inside common object)."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"

INVESTMENT = {
    "en": {
        "openInvestmentAccount": "Open Investment Account",
        "investmentType": "Investment Type",
        "selectInvestmentType": "Select investment type",
        "searchInvestmentType": "Search investment type...",
        "accountType": "Account Type",
        "selectAccountType": "Select account type",
        "searchAccountType": "Search account type...",
        "enterBankName": "Enter bank name",
        "enterAccountNo": "Enter account no.",
        "openingDate": "Opening Date",
        "enterAmount": "Enter amount",
        "rateOfInterest": "Rate Of Interest",
        "enterRateOfInterest": "Enter rate of interest",
        "interestType": "Interest Type",
        "selectInterestType": "Select interest type",
        "searchInterestType": "Search interest type...",
        "duration": "Duration",
        "enterDuration": "Enter duration",
        "durationType": "Duration Type",
        "selectDurationType": "Select duration type",
        "searchDurationType": "Search duration type...",
        "matureDate": "Mature Date",
        "matureAmount": "Mature Amount",
        "enterMatureAmount": "Enter mature amount",
        "calculateMatureAmount": "Calculate Mature Amount",
        "principalLedger": "Principal Ledger",
        "interestLedger": "Interest Ledger",
        "selectLedger": "Select ledger",
        "searchLedger": "Search ledger...",
        "voucherDetails": "Voucher Details",
        "voucherDetailsDescription": "Provide voucher and transaction mode details below",
        "enterParticulars": "Enter particulars",
        "refVouchNo": "Ref. Vouch No.",
        "enterRefVouchNo": "Enter ref. vouch no.",
        "cashDenomination": "Cash Denomination",
        "selectBank": "Select bank",
        "searchBank": "Search bank...",
    },
    "hi": {
        "openInvestmentAccount": "निवेश खाता खोलें",
        "investmentType": "निवेश प्रकार",
        "selectInvestmentType": "निवेश प्रकार चुनें",
        "searchInvestmentType": "निवेश प्रकार खोजें...",
        "accountType": "खाता प्रकार",
        "selectAccountType": "खाता प्रकार चुनें",
        "searchAccountType": "खाता प्रकार खोजें...",
        "enterBankName": "बैंक का नाम दर्ज करें",
        "enterAccountNo": "खाता संख्या दर्ज करें",
        "openingDate": "खोलने की तारीख",
        "enterAmount": "राशि दर्ज करें",
        "rateOfInterest": "ब्याज दर",
        "enterRateOfInterest": "ब्याज दर दर्ज करें",
        "interestType": "ब्याज प्रकार",
        "selectInterestType": "ब्याज प्रकार चुनें",
        "searchInterestType": "ब्याज प्रकार खोजें...",
        "duration": "अवधि",
        "enterDuration": "अवधि दर्ज करें",
        "durationType": "अवधि प्रकार",
        "selectDurationType": "अवधि प्रकार चुनें",
        "searchDurationType": "अवधि प्रकार खोजें...",
        "matureDate": "परिपक्वता तारीख",
        "matureAmount": "परिपक्वता राशि",
        "enterMatureAmount": "परिपक्वता राशि दर्ज करें",
        "calculateMatureAmount": "परिपक्वता राशि की गणना करें",
        "principalLedger": "मूलधन लेजर",
        "interestLedger": "ब्याज लेजर",
        "selectLedger": "लेजर चुनें",
        "searchLedger": "लेजर खोजें...",
        "voucherDetails": "वाउचर विवरण",
        "voucherDetailsDescription": "नीचे वाउचर और लेनदेन माध्यम का विवरण दें",
        "enterParticulars": "विवरण दर्ज करें",
        "refVouchNo": "संदर्भ वाउचर संख्या",
        "enterRefVouchNo": "संदर्भ वाउचर संख्या दर्ज करें",
        "cashDenomination": "नकद मूल्यवर्ग",
        "selectBank": "बैंक चुनें",
        "searchBank": "बैंक खोजें...",
    },
    "bn": {
        "openInvestmentAccount": "বিনিয়োগ অ্যাকাউন্ট খুলুন",
        "investmentType": "বিনিয়োগের ধরন",
        "selectInvestmentType": "বিনিয়োগের ধরন নির্বাচন করুন",
        "searchInvestmentType": "বিনিয়োগের ধরন খুঁজুন...",
        "accountType": "অ্যাকাউন্টের ধরন",
        "selectAccountType": "অ্যাকাউন্টের ধরন নির্বাচন করুন",
        "searchAccountType": "অ্যাকাউন্টের ধরন খুঁজুন...",
        "enterBankName": "ব্যাংকের নাম লিখুন",
        "enterAccountNo": "অ্যাকাউন্ট নম্বর লিখুন",
        "openingDate": "খোলার তারিখ",
        "enterAmount": "পরিমাণ লিখুন",
        "rateOfInterest": "সুদের হার",
        "enterRateOfInterest": "সুদের হার লিখুন",
        "interestType": "সুদের ধরন",
        "selectInterestType": "সুদের ধরন নির্বাচন করুন",
        "searchInterestType": "সুদের ধরন খুঁজুন...",
        "duration": "সময়কাল",
        "enterDuration": "সময়কাল লিখুন",
        "durationType": "সময়কালের ধরন",
        "selectDurationType": "সময়কালের ধরন নির্বাচন করুন",
        "searchDurationType": "সময়কালের ধরন খুঁজুন...",
        "matureDate": "ম্যাচিউরিটির তারিখ",
        "matureAmount": "ম্যাচিউরিটির পরিমাণ",
        "enterMatureAmount": "ম্যাচিউরিটির পরিমাণ লিখুন",
        "calculateMatureAmount": "ম্যাচিউরিটির পরিমাণ গণনা করুন",
        "principalLedger": "মূলধন লেজার",
        "interestLedger": "সুদ লেজার",
        "selectLedger": "লেজার নির্বাচন করুন",
        "searchLedger": "লেজার খুঁজুন...",
        "voucherDetails": "ভাউচার বিবরণ",
        "voucherDetailsDescription": "নিচে ভাউচার এবং লেনদেনের মাধ্যমের বিবরণ দিন",
        "enterParticulars": "বিবরণ লিখুন",
        "refVouchNo": "রেফারেন্স ভাউচার নম্বর",
        "enterRefVouchNo": "রেফারেন্স ভাউচার নম্বর লিখুন",
        "cashDenomination": "নগদ মূল্যবর্গ",
        "selectBank": "ব্যাংক নির্বাচন করুন",
        "searchBank": "ব্যাংক খুঁজুন...",
    },
    "or": {
        "openInvestmentAccount": "ନିବେଶ ଖାତା ଖୋଲନ୍ତୁ",
        "investmentType": "ନିବେଶ ପ୍ରକାର",
        "selectInvestmentType": "ନିବେଶ ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchInvestmentType": "ନିବେଶ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "accountType": "ଖାତା ପ୍ରକାର",
        "selectAccountType": "ଖାତା ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchAccountType": "ଖାତା ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "enterBankName": "ବ୍ୟାଙ୍କ ନାମ ପ୍ରବେଶ କରନ୍ତୁ",
        "enterAccountNo": "ଆକାଉଣ୍ଟ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
        "openingDate": "ଖୋଲିବା ତାରିଖ",
        "enterAmount": "ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
        "rateOfInterest": "ସୁଧ ହାର",
        "enterRateOfInterest": "ସୁଧ ହାର ପ୍ରବେଶ କରନ୍ତୁ",
        "interestType": "ସୁଧ ପ୍ରକାର",
        "selectInterestType": "ସୁଧ ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchInterestType": "ସୁଧ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "duration": "ଅବଧି",
        "enterDuration": "ଅବଧି ପ୍ରବେଶ କରନ୍ତୁ",
        "durationType": "ଅବଧି ପ୍ରକାର",
        "selectDurationType": "ଅବଧି ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchDurationType": "ଅବଧି ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "matureDate": "ପରିପକ୍ୱତା ତାରିଖ",
        "matureAmount": "ପରିପକ୍ୱତା ରାଶି",
        "enterMatureAmount": "ପରିପକ୍ୱତା ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
        "calculateMatureAmount": "ପରିପକ୍ୱତା ରାଶି ଗଣନା କରନ୍ତୁ",
        "principalLedger": "ମୂଳଧନ ଲେଜର",
        "interestLedger": "ସୁଧ ଲେଜର",
        "selectLedger": "ଲେଜର ବାଛନ୍ତୁ",
        "searchLedger": "ଲେଜର ଖୋଜନ୍ତୁ...",
        "voucherDetails": "ଭାଉଚର ବିବରଣୀ",
        "voucherDetailsDescription": "ନିମ୍ନରେ ଭାଉଚର ଏବଂ କାରବାର ମାଧ୍ୟମର ବିବରଣୀ ଦିଅନ୍ତୁ",
        "enterParticulars": "ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ",
        "refVouchNo": "ରେଫରେନ୍ସ ଭାଉଚର ନମ୍ବର",
        "enterRefVouchNo": "ରେଫରେନ୍ସ ଭାଉଚର ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
        "cashDenomination": "ନଗଦ ମୂଲ୍ୟବର୍ଗ",
        "selectBank": "ବ୍ୟାଙ୍କ ବାଛନ୍ତୁ",
        "searchBank": "ବ୍ୟାଙ୍କ ଖୋଜନ୍ତୁ...",
    },
}

COMMON_EXTRA = {
    "en": {
        "bankName": "Bank Name",
        "accountNo": "Account No.",
        "particulars": "Particulars",
        "transactionMode": "Transaction Mode",
    },
    "hi": {
        "bankName": "बैंक का नाम",
        "accountNo": "खाता संख्या",
        "particulars": "विवरण",
        "transactionMode": "लेनदेन माध्यम",
    },
    "bn": {
        "bankName": "ব্যাংকের নাম",
        "accountNo": "অ্যাকাউন্ট নম্বর",
        "particulars": "বিবরণ",
        "transactionMode": "লেনদেনের মাধ্যম",
    },
    "or": {
        "bankName": "ବ୍ୟାଙ୍କ ନାମ",
        "accountNo": "ଆକାଉଣ୍ଟ ନମ୍ବର",
        "particulars": "ବିବରଣୀ",
        "transactionMode": "କାରବାର ମାଧ୍ୟମ",
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

    # Insert common keys INSIDE last common before bank (before closing },)
    idx = t.rfind("    common: {")
    end = t.find("\n    bank:", idx)
    if idx < 0 or end < 0:
        raise SystemExit(f"{name}: common/bank not found")
    section = t[idx:end]
    close = section.rfind("\n    },")
    if close < 0:
        raise SystemExit(f"{name}: common close not found")
    before = section[:close].rstrip()
    if not before.endswith(","):
        lines = before.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines)
    before += "\n"
    added = []
    for k, v in COMMON_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added.append(k)
    t = t[:idx] + before + "    }," + t[end:]
    print(name, "common+", added)

    block = "\n    investment: {\n" + dump_obj(INVESTMENT[name]) + "\n    },"
    if re.search(r"\n    investment: \{", t):
        t = re.sub(
            r"\n    investment: \{[\s\S]*?\n    \},?",
            block,
            t,
            count=1,
        )
        print(name, "investment replaced")
    else:
        t2, n = re.subn(
            r"(    adjustmentVoucher: \{[\s\S]*?\n    \},)",
            r"\1" + block,
            t,
            count=1,
        )
        if n:
            t = t2
            print(name, "investment after adjustmentVoucher")
        else:
            t2, n = re.subn(
                r"(    adjustmentVoucher: \{[\s\S]*?\n    \})(\n  \},)",
                r"\1," + block + r"\2",
                t,
                count=1,
            )
            if not n:
                raise SystemExit(f"{name}: failed to insert investment")
            t = t2
            print(name, "investment after adjustmentVoucher (no comma)")

    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
