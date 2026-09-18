# -*- coding: utf-8 -*-
"""Move orphaned adjustment common keys into root common object."""
from pathlib import Path
import re
import json

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

ORPHAN_KEYS = list(COMMON_EXTRA["en"].keys())

for name in ["en", "hi", "bn", "or"]:
    p = Path(f"i18n/locales/{name}.js")
    t = p.read_text(encoding="utf-8")

    # Remove orphaned block between common close and bank
    # Pattern: after `date: "...",\n    },\n      voucherDate:...totalDebit:...,\n    bank:`
    orphan_re = re.compile(
        r"(\n    \},\n)((?:\s{6}\w+: [^\n]+\n)+)(    bank:)",
        re.M,
    )
    m = orphan_re.search(t)
    if m and "voucherDate" in m.group(2):
        t = t[: m.start(2)] + t[m.end(2) :]
        print(name, "removed orphan block")
    else:
        # try looser: from voucherDate at indent 6 until bank
        m2 = re.search(
            r"\n      voucherDate: [^\n]+\n(?:\s{6}\w+: [^\n]+\n)*\s*(?=    bank:)",
            t,
        )
        if m2:
            t = t[: m2.start()] + "\n" + t[m2.end() :]
            print(name, "removed orphan via voucherDate")
        else:
            print(name, "no orphan found")

    # Insert keys inside last common before bank (before its closing },)
    idx = t.rfind("    common: {")
    end = t.find("\n    bank:", idx)
    section = t[idx:end]
    # Find closing of this common: last `\n    },` in section
    close = section.rfind("\n    },")
    if close < 0:
        print(name, "no common close"); continue
    before = section[:close]
    # ensure trailing comma on last prop
    before_stripped = before.rstrip()
    if not before_stripped.endswith(","):
        lines = before_stripped.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines) + "\n"
    else:
        before = before_stripped + "\n"

    added = []
    for k, v in COMMON_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added.append(k)

    new_section = before + "    },"
    t = t[:idx] + new_section + t[end:]
    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
    print(name, "common+", added)
