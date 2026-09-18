# -*- coding: utf-8 -*-
"""Insert adjustmentVoucher + missing common keys."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"

ADJUSTMENT = {
    "en": {"adjustmentVoucher": "Adjustment Voucher"},
    "hi": {"adjustmentVoucher": "समायोजन वाउचर"},
    "bn": {"adjustmentVoucher": "অ্যাডজাস্টমেন্ট ভাউচার"},
    "or": {"adjustmentVoucher": "ଆଡଜଷ୍ଟମେଣ୍ଟ ଭାଉଚର"},
}

COMMON_EXTRA = {
    "en": {
        "voucherDate": "Voucher Date",
        "manualVoucherNo": "Manual Voucher No.",
        "enterManualVoucherNo": "Enter manual voucher no.",
        "narration": "Narration",
        "enterNarration": "Enter narration",
        "selectGl": "Select gl",
        "searchGl": "Search gl...",
        "drCr": "DR/CR",
        "selectDrCr": "Select dr/cr",
        "debit": "Debit",
        "credit": "Credit",
        "totalCredit": "Total Credit",
        "totalDebit": "Total Debit",
    },
    "hi": {
        "voucherDate": "वाउचर दिनांक",
        "manualVoucherNo": "मैनुअल वाउचर संख्या",
        "enterManualVoucherNo": "मैनुअल वाउचर संख्या दर्ज करें",
        "narration": "विवरण",
        "enterNarration": "विवरण दर्ज करें",
        "selectGl": "GL चुनें",
        "searchGl": "GL खोजें...",
        "drCr": "डेबिट/क्रेडिट",
        "selectDrCr": "डेबिट/क्रेडिट चुनें",
        "debit": "डेबिट",
        "credit": "क्रेडिट",
        "totalCredit": "कुल क्रेडिट",
        "totalDebit": "कुल डेबिट",
    },
    "bn": {
        "voucherDate": "ভাউচার তারিখ",
        "manualVoucherNo": "ম্যানুয়াল ভাউচার নম্বর",
        "enterManualVoucherNo": "ম্যানুয়াল ভাউচার নম্বর লিখুন",
        "narration": "বিবরণ",
        "enterNarration": "বিবরণ লিখুন",
        "selectGl": "GL নির্বাচন করুন",
        "searchGl": "GL খুঁজুন...",
        "drCr": "ডেবিট/ক্রেডিট",
        "selectDrCr": "ডেবিট/ক্রেডিট নির্বাচন করুন",
        "debit": "ডেবিট",
        "credit": "ক্রেডিট",
        "totalCredit": "মোট ক্রেডিট",
        "totalDebit": "মোট ডেবিট",
    },
    "or": {
        "voucherDate": "ଭାଉଚର ତାରିଖ",
        "manualVoucherNo": "ମାନୁଆଲ ଭାଉଚର ନମ୍ବର",
        "enterManualVoucherNo": "ମାନୁଆଲ ଭାଉଚର ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
        "narration": "ବିବରଣୀ",
        "enterNarration": "ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ",
        "selectGl": "GL ବାଛନ୍ତୁ",
        "searchGl": "GL ଖୋଜନ୍ତୁ...",
        "drCr": "ଡେବିଟ୍/କ୍ରେଡିଟ୍",
        "selectDrCr": "ଡେବିଟ୍/କ୍ରେଡିଟ୍ ବାଛନ୍ତୁ",
        "debit": "ଡେବିଟ୍",
        "credit": "କ୍ରେଡିଟ୍",
        "totalCredit": "ମୋଟ କ୍ରେଡିଟ୍",
        "totalDebit": "ମୋଟ ଡେବିଟ୍",
    },
}


def dump_obj(obj, indent=6):
    lines = []
    for k, v in obj.items():
        lines.append(" " * indent + f"{k}: {json.dumps(v, ensure_ascii=False)},")
    if lines:
        lines[-1] = lines[-1].rstrip(",")
    return "\n".join(lines)


for name in ["en", "hi", "bn", "or"]:
    p = LOC / f"{name}.js"
    t = p.read_text(encoding="utf-8")

    # bank-era root common (last common before bank)
    idx = t.rfind("    common: {")
    end = t.find("\n    bank:", idx)
    if end < 0:
        raise SystemExit(f"{name}: bank not found after common")
    section = t[idx:end]
    added = []
    for k, v in COMMON_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", section, re.M):
            continue
        # append before end of section content
        body = section.rstrip()
        if not body.endswith(","):
            lines = body.split("\n")
            if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
                lines[-1] = lines[-1] + ","
            body = "\n".join(lines)
        body += f"\n      {k}: {json.dumps(v, ensure_ascii=False)},"
        section = body
        added.append(k)
    t = t[:idx] + section + t[end:]
    print(name, "common+", added)

    block = "\n    adjustmentVoucher: {\n" + dump_obj(ADJUSTMENT[name]) + "\n    },"
    if re.search(r"\n    adjustmentVoucher: \{", t):
        t = re.sub(
            r"\n    adjustmentVoucher: \{[\s\S]*?\n    \},?",
            block,
            t,
            count=1,
        )
        print(name, "adjustmentVoucher replaced")
    else:
        # after provision
        t2, n = re.subn(
            r"(    provision: \{[\s\S]*?\n    \},)",
            r"\1" + block,
            t,
            count=1,
        )
        if n:
            t = t2
            print(name, "adjustmentVoucher after provision")
        else:
            t2, n = re.subn(
                r"(    provision: \{[\s\S]*?\n    \})(\n  \},)",
                r"\1," + block + r"\2",
                t,
                count=1,
            )
            if n:
                t = t2
                print(name, "adjustmentVoucher after provision (no comma)")
            else:
                print(name, "FAILED insert adjustmentVoucher")

    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
