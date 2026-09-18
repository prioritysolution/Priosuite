# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "i18n" / "locales"
REPLACES = {
    "en": ('langUrdu: "Urdu"', 'langOdia: "Odia"'),
    "hi": ('langUrdu: "उर्दू"', 'langOdia: "ओड़िया"'),
    "bn": ('langUrdu: "উর্দু"', 'langOdia: "ওড়িয়া"'),
    "or": ('langUrdu: "ଉର୍ଦ୍ଦୁ"', 'langOdia: "ଓଡ଼ିଆ"'),
}

for lang, (old, new) in REPLACES.items():
    path = ROOT / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    if old not in text:
        print(f"{lang}: miss {old!r}")
        continue
    path.write_text(text.replace(old, new, 1), encoding="utf-8")
    print(f"{lang}: ok")
