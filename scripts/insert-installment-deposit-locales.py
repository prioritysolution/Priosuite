# -*- coding: utf-8 -*-
"""Add installmentDeposit keys into investment namespace."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"

INV_EXTRA = {
    "en": {
        "installmentDeposit": "Installment Deposit",
        "postingDate": "Posting Date",
        "installmentAmount": "Installment Amount",
        "enterInstallmentAmount": "Enter installment amount",
        "denominationDetails": "Denomination Details",
    },
    "hi": {
        "installmentDeposit": "किस्त जमा",
        "postingDate": "पोस्टिंग तिथि",
        "installmentAmount": "किस्त राशि",
        "enterInstallmentAmount": "किस्त राशि दर्ज करें",
        "denominationDetails": "मूल्यवर्ग विवरण",
    },
    "bn": {
        "installmentDeposit": "কিস্তি জমা",
        "postingDate": "পোস্টিং তারিখ",
        "installmentAmount": "কিস্তির পরিমাণ",
        "enterInstallmentAmount": "কিস্তির পরিমাণ লিখুন",
        "denominationDetails": "মূল্যবর্গের বিবরণ",
    },
    "or": {
        "installmentDeposit": "କିସ୍ତି ଜମା",
        "postingDate": "ପୋଷ୍ଟିଂ ତାରିଖ",
        "installmentAmount": "କିସ୍ତି ରାଶି",
        "enterInstallmentAmount": "କିସ୍ତି ରାଶି ଲେଖନ୍ତୁ",
        "denominationDetails": "ମୂଲ୍ୟବର୍ଗ ବିବରଣୀ",
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
