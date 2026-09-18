# -*- coding: utf-8 -*-
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / "components" / "deposit"
for p in sorted(root.rglob("*.jsx")):
    raw = p.read_text(encoding="utf-8")
    lines = [ln for ln in raw.splitlines() if not ln.strip().startswith("//")]
    t = "\n".join(lines)
    found = set()
    for m in re.finditer(r'(?:label|placeholder|searchPlaceholder|formLabel)="([^"]+)"', t):
        found.add(m.group(1))
    for m in re.finditer(r"<h[1-6][^>]*>\s*([^<{]+)\s*</h[1-6]>", t):
        s = m.group(1).strip()
        if s:
            found.add(s)
    for m in re.finditer(r'label:\s*"([^"]+)"', t):
        found.add(m.group(1))
    for m in re.finditer(
        r'"(Add|Edit|Update|Submit|Save|Cancel|Print|Search|Close|Next|Reset|Clear|Run|Yes|No)"',
        t,
    ):
        found.add(m.group(1))
    for m in re.finditer(r"<TableHead[^>]*>\s*([^<{]+)\s*</TableHead>", t):
        s = m.group(1).strip()
        if s:
            found.add(s)
    if found:
        print("==", p.relative_to(root).as_posix())
        for s in sorted(found):
            print(" ", s)
