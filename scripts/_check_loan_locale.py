# -*- coding: utf-8 -*-
import importlib.util
from pathlib import Path

root = Path(__file__).resolve().parents[1]
for lang in ("en", "hi", "bn", "or"):
    path = root / "i18n" / "locales" / f"{lang}.js"
    # Convert to temp check via node later; here just confirm loan block exists
    text = path.read_text(encoding="utf-8")
    assert "    loan: {" in text, lang
    assert "loanReport:" in text or 'loanReport:' in text, lang
    print(lang, "loan block ok, size", text.count("\n"))
