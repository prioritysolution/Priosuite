# -*- coding: utf-8 -*-
from pathlib import Path
import re
import json

DATES = {"en": "Date", "hi": "दिनांक", "bn": "তারিখ", "or": "ତାରିଖ"}

for name in ["en", "hi", "bn", "or"]:
    p = Path(f"i18n/locales/{name}.js")
    t = p.read_text(encoding="utf-8")
    idx = t.rfind("    common: {")
    if idx < 0:
        print(name, "no common")
        continue
    end = t.find("\n    bank:", idx)
    if end < 0:
        end = t.find("\n    voucher:", idx)
    section = t[idx:end]
    if re.search(r"^\s{6}date:", section, re.M):
        print(name, "already has date")
        continue
    new_section, n = re.subn(
        r"(ledger: [^\n]+)",
        lambda m: m.group(1)
        + "\n      date: "
        + json.dumps(DATES[name], ensure_ascii=False)
        + ",",
        section,
        count=1,
    )
    if not n:
        # append before closing of section end - section doesn't include closing
        # add before last property isn't ideal; append at end of section content
        # Find printedOn or last key
        new_section, n = re.subn(
            r"(printedOn: [^\n]+)",
            lambda m: m.group(1).rstrip(",")
            + ",\n      date: "
            + json.dumps(DATES[name], ensure_ascii=False)
            + ",",
            section,
            count=1,
        )
    if not n:
        print(name, "insert fail")
        continue
    t = t[:idx] + new_section + t[end:]
    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
    print(name, "added date")
