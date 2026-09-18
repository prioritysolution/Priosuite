# -*- coding: utf-8 -*-
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
COMP = ROOT / "components" / "loan" / "guarantorDetails" / "index.jsx"
LOC = ROOT / "i18n" / "locales"

reps = [
    (">\n                      Customer Code :{\" \"}\n                    <", '>{t("loan.customerCodeColon")}<'),
    (
        '<p className="font-semibold text-nowrap">\n                      Customer Code :{" "}\n                    </p>',
        '<p className="font-semibold text-nowrap">{t("loan.customerCodeColon")}</p>',
    ),
    (
        '<p className="font-semibold text-nowrap">\n                      Customer Name :{" "}\n                    </p>',
        '<p className="font-semibold text-nowrap">{t("loan.customerNameColon")}</p>',
    ),
    (
        '<p className="font-semibold text-nowrap">\n                      Guardian Name :{" "}\n                    </p>',
        '<p className="font-semibold text-nowrap">{t("loan.guardianNameColon")}</p>',
    ),
    (
        '<p className="font-semibold text-nowrap">\n                      Admission Date :{" "}\n                    </p>',
        '<p className="font-semibold text-nowrap">{t("loan.admissionDateColon")}</p>',
    ),
]

text = COMP.read_text(encoding="utf-8")
for a, b in reps:
    if a in text:
        text = text.replace(a, b)
        print("ok", a[40:80] if len(a) > 40 else a)
    else:
        print("missing", repr(a[:60]))
COMP.write_text(text, encoding="utf-8")

extras = {
    "en": {
        "customerCodeColon": "Customer Code : ",
        "customerNameColon": "Customer Name : ",
        "admissionDateColon": "Admission Date : ",
    },
    "hi": {
        "customerCodeColon": "ग्राहक कोड : ",
        "customerNameColon": "ग्राहक नाम : ",
        "admissionDateColon": "प्रवेश तिथि : ",
    },
    "bn": {
        "customerCodeColon": "গ্রাহক কোড : ",
        "customerNameColon": "গ্রাহকের নাম : ",
        "admissionDateColon": "ভর্তির তারিখ : ",
    },
    "or": {
        "customerCodeColon": "ଗ୍ରାହକ କୋଡ୍ : ",
        "customerNameColon": "ଗ୍ରାହକ ନାମ : ",
        "admissionDateColon": "ଭର୍ତ୍ତି ତାରିଖ : ",
    },
}
for lang, vals in extras.items():
    path = LOC / f"{lang}.js"
    t = path.read_text(encoding="utf-8")
    marker = "    loan: {"
    ls = t.find(marker)
    insert_at = t.find("\n", ls) + 1
    lines = []
    loan_end = t.find("    memberSearch:", ls)
    loan = t[ls:loan_end]
    for k, v in vals.items():
        if f"{k}:" not in loan:
            lines.append(f"        {k}: {json.dumps(v, ensure_ascii=False)},")
    if lines:
        t = t[:insert_at] + "\n".join(lines) + "\n" + t[insert_at:]
        path.write_text(t, encoding="utf-8")
        print("extras", lang, len(lines))
