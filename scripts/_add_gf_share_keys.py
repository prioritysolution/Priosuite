# -*- coding: utf-8 -*-
from pathlib import Path
import json

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"
extras = {
    "en": {
        "shareBalanceColon": "Share Balance : ",
        "gfAccountNoColon": "GF Account No. : ",
    },
    "hi": {
        "shareBalanceColon": "शेयर शेष : ",
        "gfAccountNoColon": "GF खाता संख्या : ",
    },
    "bn": {
        "shareBalanceColon": "শেয়ার ব্যালেন্স : ",
        "gfAccountNoColon": "GF অ্যাকাউন্ট নং : ",
    },
    "or": {
        "shareBalanceColon": "ସେୟାର ବାଲାନ୍ସ : ",
        "gfAccountNoColon": "GF ଖାତା ନଂ : ",
    },
}
for lang, vals in extras.items():
    path = LOC / f"{lang}.js"
    t = path.read_text(encoding="utf-8")
    ls = t.find("    loan: {")
    le = t.find("    memberSearch:", ls)
    loan = t[ls:le]
    insert_at = t.find("\n", ls) + 1
    lines = []
    for k, v in vals.items():
        if f"{k}:" not in loan:
            lines.append(f"        {k}: {json.dumps(v, ensure_ascii=False)},")
    if lines:
        t = t[:insert_at] + "\n".join(lines) + "\n" + t[insert_at:]
        path.write_text(t, encoding="utf-8")
        print(lang, len(lines))
