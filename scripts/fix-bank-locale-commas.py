# -*- coding: utf-8 -*-
from pathlib import Path
import re

for lang in ("en", "hi", "bn", "or"):
    p = Path(__file__).resolve().parents[1] / "i18n" / "locales" / f"{lang}.js"
    t = p.read_text(encoding="utf-8")
    new = re.sub(r"\n[ \t]+,", "", t)
    # ensure prior props still have commas if needed
    new = re.sub(
        r'(action: "[^"]*")\n(\s+gl:)',
        r"\1,\n\2",
        new,
    )
    new = re.sub(
        r'(transferType: "[^"]*")\n(\s+viewLedger:)',
        r"\1,\n\2",
        new,
    )
    p.write_text(new, encoding="utf-8")
    print(lang, "fixed" if new != t else "ok")
