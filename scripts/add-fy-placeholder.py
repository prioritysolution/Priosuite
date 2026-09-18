# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "i18n" / "locales"
VALUES = {
    "en": 'selectFinancialYearPlaceholder: "Select financial year"',
    "hi": 'selectFinancialYearPlaceholder: "वित्तीय वर्ष चुनें"',
    "bn": 'selectFinancialYearPlaceholder: "অর্থবছর নির্বাচন করুন"',
    "or": 'selectFinancialYearPlaceholder: "ଆର୍ଥିକ ବର୍ଷ ବାଛନ୍ତୁ"',
}

for lang, line in VALUES.items():
    path = ROOT / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    if "selectFinancialYearPlaceholder:" in text:
        print(f"{lang}: already present")
        continue
    needle = None
    for candidate in (
        'financialYear: "Financial Year",',
        'financialYear: "वित्तीय वर्ष",',
        'financialYear: "অর্থবছর",',
        'financialYear: "ଆର୍ଥିକ ବର୍ଷ",',
    ):
        if candidate in text:
            needle = candidate
            break
    if not needle:
        print(f"{lang}: financialYear miss")
        continue
    text = text.replace(needle, needle + "\n      " + line + ",", 1)
    path.write_text(text, encoding="utf-8")
    print(f"{lang}: added")
