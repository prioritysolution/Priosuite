# -*- coding: utf-8 -*-
from pathlib import Path
import re

loc = Path(__file__).resolve().parents[1] / "i18n" / "locales"
for lang in ("en", "hi", "bn", "or"):
    p = loc / f"{lang}.js"
    t = p.read_text(encoding="utf-8")
    new = re.sub(r"\n[ \t]+,", "", t)
    # Ensure properties that precede inserted blocks still have trailing commas
    # e.g. noResults: "No results."\n      selectTrans -> add comma
    new = re.sub(
        r'(noResults: "[^"]*")\n(\s+selectTransanctionMode:)',
        r"\1,\n\2",
        new,
    )
    new = re.sub(
        r'(joint1: "[^"]*")\n(\s+aadhaarNo:)',
        r"\1,\n\2",
        new,
    )
    new = re.sub(
        r'(searchNameOrAccount: "[^"]*")\n(\s+aadhaarNo:)',
        r"\1,\n\2",
        new,
    )
    p.write_text(new, encoding="utf-8")
    print(lang, "changed" if new != t else "ok")
