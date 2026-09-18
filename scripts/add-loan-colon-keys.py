# -*- coding: utf-8 -*-
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
keys = {
    "en": {
        "relationNameColon": "Relation Name : ",
        "disburseDateColon": "Disburse Date : ",
        "disburseAmountColon": "Disburse Amount : ",
        "disbursementAmountColon": "Disbursement Amount : ",
        "numberOfInstallmentColon": "Number Of Installment : ",
        "noOfInstallmentColon": "No. of Installment : ",
        "customerCodeColon": "Customer Code : ",
        "customerNameColon": "Customer Name : ",
        "admissionDateColon": "Admission Date : ",
        "shareBalanceColon": "Share Balance : ",
        "gfAccountNoColon": "GF Account No. : ",
        "savingsAccountNoColon": "Savings Account No. : ",
    },
    "hi": {
        "relationNameColon": "संबंध नाम : ",
        "disburseDateColon": "वितरण तिथि : ",
        "disburseAmountColon": "वितरण राशि : ",
        "disbursementAmountColon": "वितरण राशि : ",
        "numberOfInstallmentColon": "किस्त संख्या : ",
        "noOfInstallmentColon": "किस्त संख्या : ",
        "customerCodeColon": "ग्राहक कोड : ",
        "customerNameColon": "ग्राहक नाम : ",
        "admissionDateColon": "प्रवेश तिथि : ",
        "shareBalanceColon": "शेयर शेष : ",
        "gfAccountNoColon": "GF खाता संख्या : ",
        "savingsAccountNoColon": "बचत खाता संख्या : ",
    },
    "bn": {
        "relationNameColon": "সম্পর্কের নাম : ",
        "disburseDateColon": "বিতরণ তারিখ : ",
        "disburseAmountColon": "বিতরণ পরিমাণ : ",
        "disbursementAmountColon": "বিতরণ পরিমাণ : ",
        "numberOfInstallmentColon": "কিস্তির সংখ্যা : ",
        "noOfInstallmentColon": "কিস্তির সংখ্যা : ",
        "customerCodeColon": "গ্রাহক কোড : ",
        "customerNameColon": "গ্রাহকের নাম : ",
        "admissionDateColon": "ভর্তির তারিখ : ",
        "shareBalanceColon": "শেয়ার ব্যালেন্স : ",
        "gfAccountNoColon": "GF অ্যাকাউন্ট নম্বর : ",
        "savingsAccountNoColon": "সঞ্চয় অ্যাকাউন্ট নম্বর : ",
    },
    "or": {
        "relationNameColon": "ସମ୍ପର୍କ ନାମ : ",
        "disburseDateColon": "ବିତରଣ ତାରିଖ : ",
        "disburseAmountColon": "ବିତରଣ ରାଶି : ",
        "disbursementAmountColon": "ବିତରଣ ରାଶି : ",
        "numberOfInstallmentColon": "କିସ୍ତି ସଂଖ୍ୟା : ",
        "noOfInstallmentColon": "କିସ୍ତି ସଂଖ୍ୟା : ",
        "customerCodeColon": "ଗ୍ରାହକ କୋଡ୍ : ",
        "customerNameColon": "ଗ୍ରାହକ ନାମ : ",
        "admissionDateColon": "ଭର୍ତ୍ତି ତାରିଖ : ",
        "shareBalanceColon": "ସେୟାର ବାଲାନ୍ସ : ",
        "gfAccountNoColon": "GF ଖାତା ନମ୍ବର : ",
        "savingsAccountNoColon": "ସଞ୍ଚୟ ଖାତା ନମ୍ବର : ",
    },
}

for lang, fixes in keys.items():
    p = ROOT / "i18n" / "locales" / f"{lang}.js"
    t = p.read_text(encoding="utf-8")
    di = t.rfind("loan: {")
    end = t.find("memberSearch:", di)
    chunk = t[di:end]
    inserts = []
    for k, v in fixes.items():
        if f"{k}:" in chunk:
            chunk = re.sub(
                rf'(\n\s+{re.escape(k)}:\s*)"(?:\\.|[^"\\])*"',
                lambda m, val=v: m.group(1) + json.dumps(val, ensure_ascii=False),
                chunk,
                count=1,
            )
        else:
            inserts.append(f",\n        {k}: {json.dumps(v, ensure_ascii=False)}")
    if inserts:
        pi = chunk.find("\n        print: {")
        if pi > 0:
            chunk = chunk[:pi] + "".join(inserts) + chunk[pi:]
        else:
            chunk += "".join(inserts)
    t = t[:di] + chunk + t[end:]
    p.write_text(t, encoding="utf-8")
    print(lang, "ok")
