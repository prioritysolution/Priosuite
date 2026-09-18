# -*- coding: utf-8 -*-
from pathlib import Path
import re

for lang in ("en", "hi", "bn", "or"):
    p = Path(__file__).resolve().parents[1] / "i18n" / "locales" / f"{lang}.js"
    t = p.read_text(encoding="utf-8")
    t2 = re.sub(
        r'(savingsAccountNoColon: "[^"]*")\n(\s+print:)',
        r"\1,\n\2",
        t,
    )
    # also catch any other key immediately before print without comma
    t2 = re.sub(r'(")\n(\s+print:)', r'\1,\n\2', t2)
    p.write_text(t2, encoding="utf-8")
    print(lang, "fixed" if t2 != t else "ok")
