# -*- coding: utf-8 -*-
"""Add missing bankWithdrawn keys without breaking locale syntax."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"

KEYS = {
    "en": {
        "enterWithdrawnAmount": "Enter withdrawn amount",
        "enterBalance": "Enter balance",
    },
    "hi": {
        "enterWithdrawnAmount": "निकासी राशि दर्ज करें",
        "enterBalance": "शेष राशि दर्ज करें",
    },
    "bn": {
        "enterWithdrawnAmount": "উত্তোলনের পরিমাণ লিখুন",
        "enterBalance": "ব্যালেন্স লিখুন",
    },
    "or": {
        "enterWithdrawnAmount": "ଉତ୍ତୋଲନ ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
        "enterBalance": "ବାଲାନ୍ସ ପ୍ରବେଶ କରନ୍ତୁ",
    },
}


def patch(lang: str):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    bi = text.rfind("\n    bank: {")
    if bi < 0:
        raise SystemExit(f"bank not found in {lang}")
    # match bank object
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
    # ensure last prop has trailing comma, then append
    # strip trailing whitespace in chunk
    body = chunk.rstrip()
    if not body.endswith(","):
        # add comma after last property value
        body = re.sub(r'(")\s*$', r'\1,', body)
    insert = "".join(
        f'\n      {k}: {json.dumps(v, ensure_ascii=False)},' for k, v in missing.items()
    )
    # remove trailing comma on last inserted
    insert = insert.rstrip(",")
    new_chunk = body + insert + "\n    "
    text = text[:i] + new_chunk + text[end:]
    path.write_text(text, encoding="utf-8")
    print(lang, "added", list(missing))


def main():
    for lang in ("en", "hi", "bn", "or"):
        patch(lang)


if __name__ == "__main__":
    main()
