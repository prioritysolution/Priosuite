# -*- coding: utf-8 -*-
"""Final validation for membership i18n."""
from pathlib import Path
import re
import subprocess

root = Path("components/membership")

# broken hooks inside props
broken = []
for p in root.rglob("*.jsx"):
    t = p.read_text(encoding="utf-8")
    if re.search(r"const \w+ = \(\{\s*\n\s*const \{ t \} = useTranslation\(\);", t):
        broken.append(str(p))
print("broken hooks:", broken or "none")

# remaining quoted UI attrs
hard = []
for p in root.rglob("*.jsx"):
    t = p.read_text(encoding="utf-8")
    for kind, pat in [
        ("label", r'label="([^"]+)"'),
        ("placeholder", r'placeholder="([^"]+)"'),
        ("formLabel", r'formLabel="([^"]+)"'),
        ("searchPlaceholder", r'searchPlaceholder="([^"]+)"'),
    ]:
        for m in re.findall(pat, t):
            hard.append((p.as_posix(), kind, m))
print("hard attrs:", len(hard))
for row in hard[:30]:
    print(" ", row)

# leftover obvious English UI in JSX text nodes (heuristic)
suspects = []
patterns = [
    r">\s*(Add|Update|Reset|Next|Search|Print|Generate|Save|Cancel|Yes|No|Preview)\s*<",
    r">\s*(Active|Closed|Front Page|Transaction Page|Membership|Deposit|Loan)\s*<",
    r'emptyText="[^"]+"',
    r'addressLabel="[^"]+"',
    r'nextLabel="[^"]+"',
]
for p in root.rglob("*.jsx"):
    t = p.read_text(encoding="utf-8")
    for pat in patterns:
        for m in re.finditer(pat, t):
            suspects.append((p.as_posix(), m.group(0)[:80]))
print("suspect leftovers:", len(suspects))
for s in suspects[:40]:
    print(" ", s)

# locale load
r = subprocess.run(
    [
        "node",
        "--input-type=module",
        "-e",
        "import en from './i18n/locales/en.js'; import hi from './i18n/locales/hi.js'; import bn from './i18n/locales/bn.js'; import or from './i18n/locales/or.js'; "
        "const ok=[en,hi,bn,or].every(x=>x.translation.membership && x.translation.common.buttons.print && x.translation.common.total); "
        "console.log('locales_ok', ok, Object.keys(en.translation.membership).length);",
    ],
    capture_output=True,
    text=True,
)
print(r.stdout)
print(r.stderr[-300:] if r.stderr else "")
