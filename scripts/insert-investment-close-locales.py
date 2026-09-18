# -*- coding: utf-8 -*-
"""Add investmentClose keys into investment namespace."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"

INV_EXTRA = {
    "en": {
        "investmentClose": "Investment Close",
        "closingInfoBlock": "Closing Info Block",
        "closingDate": "Closing Date",
        "closingInterest": "Closing Interest",
        "enterClosingInterest": "Enter closing interest",
        "totalPayble": "Total Payble",
        "enterTotalPayble": "Enter total payble",
        "selectTransactionMode": "Select transaction mode",
    },
    "hi": {
        "investmentClose": "निवेश बंद करें",
        "closingInfoBlock": "समापन जानकारी",
        "closingDate": "समापन तिथि",
        "closingInterest": "समापन ब्याज",
        "enterClosingInterest": "समापन ब्याज दर्ज करें",
        "totalPayble": "कुल देय",
        "enterTotalPayble": "कुल देय दर्ज करें",
        "selectTransactionMode": "लेनदेन का तरीका चुनें",
    },
    "bn": {
        "investmentClose": "বিনিয়োগ বন্ধ",
        "closingInfoBlock": "সমাপ্তির তথ্য",
        "closingDate": "সমাপ্তির তারিখ",
        "closingInterest": "সমাপ্তির সুদ",
        "enterClosingInterest": "সমাপ্তির সুদ লিখুন",
        "totalPayble": "মোট প্রদেয়",
        "enterTotalPayble": "মোট প্রদেয় লিখুন",
        "selectTransactionMode": "লেনদেনের মোড নির্বাচন করুন",
    },
    "or": {
        "investmentClose": "ନିବେଶ ବନ୍ଦ",
        "closingInfoBlock": "ବନ୍ଦ ସୂଚନା",
        "closingDate": "ବନ୍ଦ ତାରିଖ",
        "closingInterest": "ବନ୍ଦ ସୁଧ",
        "enterClosingInterest": "ବନ୍ଦ ସୁଧ ଲେଖନ୍ତୁ",
        "totalPayble": "ମୋଟ ଦେୟ",
        "enterTotalPayble": "ମୋଟ ଦେୟ ଲେଖନ୍ତୁ",
        "selectTransactionMode": "କାରବାର ମୋଡ୍ ଚୟନ କରନ୍ତୁ",
    },
}

for name in ["en", "hi", "bn", "or"]:
    p = LOC / f"{name}.js"
    t = p.read_text(encoding="utf-8")
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
    else:
        raise SystemExit(f"{name}: brace fail")
    end = end_brace + 1
    had_comma = end < len(t) and t[end] == ","
    if had_comma:
        end += 1
    section = t[idx:end]
    close = section.rfind("}")
    before = section[:close].rstrip()
    if not before.endswith(","):
        lines = before.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(",") and not lines[-1].strip().endswith("{"):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines)
    before += "\n"
    added = []
    for k, v in INV_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added.append(k)
    new_section = before.rstrip().rstrip(",") + "\n    }" + ("," if had_comma else "")
    t = t[:idx] + new_section + t[end:]
    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
    print(name, "investment+", added)
