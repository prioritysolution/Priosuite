# -*- coding: utf-8 -*-
"""Add missing bank/common keys for BankDeposit static i18n."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"

BANK_KEYS = {
    "en": {
        "viewLedger": "View Ledger",
        "enterAvailableBalance": "Enter available balance",
        "enterDepositAmount": "Enter deposit amount",
        "transferDetails": "Transfer Details",
        "narration": "Narration",
        "enterNarration": "Enter narration",
        "selectGl": "Select gl",
        "searchGl": "Search gl...",
        "subLedger": "Sub Ledger",
        "selectSubLedger": "Select sub ledger",
        "subledgerNarration": "Subledger Narration",
        "addToTable": "Add To Table",
    },
    "hi": {
        "viewLedger": "लेजर देखें",
        "enterAvailableBalance": "उपलब्ध शेष राशि दर्ज करें",
        "enterDepositAmount": "जमा राशि दर्ज करें",
        "transferDetails": "स्थानांतरण विवरण",
        "narration": "विवरण",
        "enterNarration": "विवरण दर्ज करें",
        "selectGl": "GL चुनें",
        "searchGl": "GL खोजें...",
        "subLedger": "उप लेजर",
        "selectSubLedger": "उप लेजर चुनें",
        "subledgerNarration": "उप लेजर विवरण",
        "addToTable": "तालिका में जोड़ें",
    },
    "bn": {
        "viewLedger": "লেজার দেখুন",
        "enterAvailableBalance": "উপলব্ধ ব্যালেন্স লিখুন",
        "enterDepositAmount": "জমার পরিমাণ লিখুন",
        "transferDetails": "ট্রান্সফার বিবরণ",
        "narration": "বিবরণ",
        "enterNarration": "বিবরণ লিখুন",
        "selectGl": "GL নির্বাচন করুন",
        "searchGl": "GL অনুসন্ধান করুন...",
        "subLedger": "সাব লেজার",
        "selectSubLedger": "সাব লেজার নির্বাচন করুন",
        "subledgerNarration": "সাব লেজার বিবরণ",
        "addToTable": "টেবিলে যোগ করুন",
    },
    "or": {
        "viewLedger": "ଲେଜର ଦେଖନ୍ତୁ",
        "enterAvailableBalance": "ଉପଲବ୍ଧ ବାଲାନ୍ସ ପ୍ରବେଶ କରନ୍ତୁ",
        "enterDepositAmount": "ଜମା ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
        "transferDetails": "ସ୍ଥାନାନ୍ତର ବିବରଣୀ",
        "narration": "ବିବରଣୀ",
        "enterNarration": "ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ",
        "selectGl": "GL ଚୟନ କରନ୍ତୁ",
        "searchGl": "GL ଖୋଜନ୍ତୁ...",
        "subLedger": "ସବ୍ ଲେଜର",
        "selectSubLedger": "ସବ୍ ଲେଜର ଚୟନ କରନ୍ତୁ",
        "subledgerNarration": "ସବ୍ ଲେଜର ବିବରଣୀ",
        "addToTable": "ଟେବୁଲରେ ଯୋଡନ୍ତୁ",
    },
}

COMMON_KEYS = {
    "en": {"gl": "GL", "slNo": "Sl. No."},
    "hi": {"gl": "GL", "slNo": "क्रमांक"},
    "bn": {"gl": "GL", "slNo": "ক্রমিক নং"},
    "or": {"gl": "GL", "slNo": "କ୍ରମିକ ନମ୍ବର"},
}


def insert_missing(chunk: str, keys: dict) -> str:
    missing = {k: v for k, v in keys.items() if f"{k}:" not in chunk}
    if not missing:
        return chunk
    # insert before closing of this object — find last property line
    insert = "".join(
        f',\n      {k}: {json.dumps(v, ensure_ascii=False)}' for k, v in missing.items()
    )
    # chunk ends just before next sibling or closing; we receive the object body including `{`
    # Find the final `}` of this object at depth 1 from start
    i = chunk.find("{")
    depth = 0
    end = None
    for j in range(i, len(chunk)):
        if chunk[j] == "{":
            depth += 1
        elif chunk[j] == "}":
            depth -= 1
            if depth == 0:
                end = j
                break
    if end is None:
        return chunk
    return chunk[:end] + insert + "\n    " + chunk[end:]


def patch(lang: str):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    # root common: last occurrence of "\n    common: {" (sibling of bank)
    ci = text.rfind("\n    common: {")
    bi = text.rfind("\n    bank: {")
    if ci < 0 or bi < 0:
        raise SystemExit(f"common/bank not found in {lang}")

    # common ends at bank start
    common_chunk = text[ci:bi]
    new_common = insert_missing(common_chunk, COMMON_KEYS[lang])

    # bank to end of translation (before `\n  },\n};` or memberSearch already past)
    # bank goes until closing of translation
    rest = text[bi:]
    # find matching close for bank object
    i = rest.find("{")
    depth = 0
    end = None
    for j in range(i, len(rest)):
        if rest[j] == "{":
            depth += 1
        elif rest[j] == "}":
            depth -= 1
            if depth == 0:
                end = j + 1
                break
    bank_chunk = rest[:end]
    new_bank = insert_missing(bank_chunk, BANK_KEYS[lang])

    text = text[:ci] + new_common + new_bank + rest[end:]
    path.write_text(text, encoding="utf-8")
    print(lang, "ok")


def main():
    for lang in ("en", "hi", "bn", "or"):
        patch(lang)


if __name__ == "__main__":
    main()
