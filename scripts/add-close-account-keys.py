# -*- coding: utf-8 -*-
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"

KEYS = {
    "en": {
        "enterClosingAmount": "Enter closing amount",
        "selectBank": "Select bank",
        "searchBank": "Search bank...",
    },
    "hi": {
        "enterClosingAmount": "बंद करने की राशि दर्ज करें",
        "selectBank": "बैंक चुनें",
        "searchBank": "बैंक खोजें...",
    },
    "bn": {
        "enterClosingAmount": "বন্ধের পরিমাণ লিখুন",
        "selectBank": "ব্যাংক নির্বাচন করুন",
        "searchBank": "ব্যাংক অনুসন্ধান করুন...",
    },
    "or": {
        "enterClosingAmount": "ବନ୍ଦ ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
        "selectBank": "ବ୍ୟାଙ୍କ ଚୟନ କରନ୍ତୁ",
        "searchBank": "ବ୍ୟାଙ୍କ ଖୋଜନ୍ତୁ...",
    },
}


def patch(lang: str):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    bi = text.rfind("\n    bank: {")
    i = text.find("{", bi)
    depth = 0
    end = None
    for j in range(i, len(text)):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                end = j
                break
    chunk = text[i:end]
    missing = {k: v for k, v in KEYS[lang].items() if f"{k}:" not in chunk}
    if not missing:
        print(lang, "already")
        return
    body = chunk.rstrip()
    if not body.endswith(","):
        body = re.sub(r'(")\s*$', r"\1,", body)
    insert = "".join(
        f"\n      {k}: {json.dumps(v, ensure_ascii=False)}," for k, v in missing.items()
    ).rstrip(",")
    text = text[:i] + body + insert + "\n    " + text[end:]
    path.write_text(text, encoding="utf-8")
    print(lang, "added", list(missing))


for lang in ("en", "hi", "bn", "or"):
    patch(lang)
