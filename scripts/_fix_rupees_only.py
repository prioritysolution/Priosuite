# -*- coding: utf-8 -*-
from pathlib import Path
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"
fixes = {
    "en": {"rupees": "Rupees", "only": "Only"},
    "hi": {"rupees": "रुपये", "only": "मात्र"},
    "bn": {"rupees": "টাকা", "only": "মাত্র"},
    "or": {"rupees": "ଟଙ୍କା", "only": "ମାତ୍ର"},
}
for lang, vals in fixes.items():
    p = LOC / f"{lang}.js"
    t = p.read_text(encoding="utf-8")
    ls = t.find("    loan: {")
    le = t.find("    memberSearch: {", ls)
    body = t[ls:le]
    body2 = re.sub(r'rupees:\s*"[^"]*"', f'rupees: "{vals["rupees"]}"', body)
    body2 = re.sub(r'only:\s*"[^"]*"', f'only: "{vals["only"]}"', body2)
    if body2 != body:
        t = t[:ls] + body2 + t[le:]
        p.write_text(t, encoding="utf-8")
        print("fixed", lang)
    else:
        print("no change", lang)
