# -*- coding: utf-8 -*-
"""Add investmentRenewal keys into investment namespace."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"

INV_EXTRA = {
    "en": {
        "investmentRenewal": "Investment Renewal",
        "basicInfoBlock": "Basic Info Block",
        "openDate": "Open Date",
        "enterOpenDate": "Enter open date",
        "investmentAmount": "Investment Amount",
        "enterInvestmentAmount": "Enter investment amount",
        "maturityDate": "Maturity Date",
        "enterMaturityDate": "Enter maturity date",
        "maturityAmount": "Maturity Amount",
        "enterMaturityAmount": "Enter maturity amount",
        "renewalInfoBlock": "Renewal Info Block",
        "renewalDate": "Renewal Date",
        "effectDate": "Effect Date",
        "enterEffectDate": "Enter effect date",
        "tdsAmount": "TDS Amount",
        "enterTdsAmount": "Enter tds amount",
        "matureDatePlaceholder": "Mature date",
    },
    "hi": {
        "investmentRenewal": "निवेश नवीनीकरण",
        "basicInfoBlock": "मूल जानकारी",
        "openDate": "खोलने की तिथि",
        "enterOpenDate": "खोलने की तिथि दर्ज करें",
        "investmentAmount": "निवेश राशि",
        "enterInvestmentAmount": "निवेश राशि दर्ज करें",
        "maturityDate": "परिपक्वता तिथि",
        "enterMaturityDate": "परिपक्वता तिथि दर्ज करें",
        "maturityAmount": "परिपक्वता राशि",
        "enterMaturityAmount": "परिपक्वता राशि दर्ज करें",
        "renewalInfoBlock": "नवीनीकरण जानकारी",
        "renewalDate": "नवीनीकरण तिथि",
        "effectDate": "प्रभावी तिथि",
        "enterEffectDate": "प्रभावी तिथि दर्ज करें",
        "tdsAmount": "TDS राशि",
        "enterTdsAmount": "TDS राशि दर्ज करें",
        "matureDatePlaceholder": "परिपक्वता तिथि",
    },
    "bn": {
        "investmentRenewal": "বিনিয়োগ নবায়ন",
        "basicInfoBlock": "মৌলিক তথ্য",
        "openDate": "খোলার তারিখ",
        "enterOpenDate": "খোলার তারিখ লিখুন",
        "investmentAmount": "বিনিয়োগের পরিমাণ",
        "enterInvestmentAmount": "বিনিয়োগের পরিমাণ লিখুন",
        "maturityDate": "মেয়াদপূর্তির তারিখ",
        "enterMaturityDate": "মেয়াদপূর্তির তারিখ লিখুন",
        "maturityAmount": "মেয়াদপূর্তির পরিমাণ",
        "enterMaturityAmount": "মেয়াদপূর্তির পরিমাণ লিখুন",
        "renewalInfoBlock": "নবায়ন তথ্য",
        "renewalDate": "নবায়নের তারিখ",
        "effectDate": "কার্যকর তারিখ",
        "enterEffectDate": "কার্যকর তারিখ লিখুন",
        "tdsAmount": "TDS পরিমাণ",
        "enterTdsAmount": "TDS পরিমাণ লিখুন",
        "matureDatePlaceholder": "মেয়াদপূর্তির তারিখ",
    },
    "or": {
        "investmentRenewal": "ନିବେଶ ନବୀକରଣ",
        "basicInfoBlock": "ମୌଳିକ ସୂଚନା",
        "openDate": "ଖୋଲିବା ତାରିଖ",
        "enterOpenDate": "ଖୋଲିବା ତାରିଖ ଲେଖନ୍ତୁ",
        "investmentAmount": "ନିବେଶ ରାଶି",
        "enterInvestmentAmount": "ନିବେଶ ରାଶି ଲେଖନ୍ତୁ",
        "maturityDate": "ପରିପକ୍ୱତା ତାରିଖ",
        "enterMaturityDate": "ପରିପକ୍ୱତା ତାରିଖ ଲେଖନ୍ତୁ",
        "maturityAmount": "ପରିପକ୍ୱତା ରାଶି",
        "enterMaturityAmount": "ପରିପକ୍ୱତା ରାଶି ଲେଖନ୍ତୁ",
        "renewalInfoBlock": "ନବୀକରଣ ସୂଚନା",
        "renewalDate": "ନବୀକରଣ ତାରିଖ",
        "effectDate": "ପ୍ରଭାବୀ ତାରିଖ",
        "enterEffectDate": "ପ୍ରଭାବୀ ତାରିଖ ଲେଖନ୍ତୁ",
        "tdsAmount": "TDS ରାଶି",
        "enterTdsAmount": "TDS ରାଶି ଲେଖନ୍ତୁ",
        "matureDatePlaceholder": "ପରିପକ୍ୱତା ତାରିଖ",
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
