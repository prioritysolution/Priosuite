# -*- coding: utf-8 -*-
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "i18n" / "locales"
FIXES = {
    "en": "Please enter name",
    "hi": "कृपया नाम दर्ज करें",
    "bn": "অনুগ্রহ করে নাম লিখুন",
    "or": "ଦୟାକରି ନାମ ଲେଖନ୍ତୁ",
}

pat = re.compile(
    r'(viewLedger: "[^"]*"),\n    ,\n      pleaseEnterName: "[^"]*"\},',
    re.M,
)

for lang, val in FIXES.items():
    p = ROOT / f"{lang}.js"
    t = p.read_text(encoding="utf-8")
    esc = val.replace("\\", "\\\\").replace('"', '\\"')
    t2, n = pat.subn(
        rf'\1,\n      pleaseEnterName: "{esc}",\n    }},',
        t,
        count=1,
    )
    if n:
        p.write_text(t2, encoding="utf-8")
        print(f"{lang}: fixed")
    else:
        print(f"{lang}: pattern miss")
        idx = t.find("pleaseEnterName")
        print(repr(t[idx - 40 : idx + 80]))
