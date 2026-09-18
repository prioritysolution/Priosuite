# -*- coding: utf-8 -*-
from pathlib import Path
import re

root = Path("components/membership")
for p in sorted(root.rglob("*.jsx")):
    t = p.read_text(encoding="utf-8")
    has = "useTranslation" in t
    labels = re.findall(r'label="([^"]+)"', t)
    phs = re.findall(r'placeholder="([^"]+)"', t)
    fls = re.findall(r'formLabel="([^"]+)"', t)
    keys = sorted(set(re.findall(r't\("([^"]+)"\)', t)))
    print("===", p.as_posix())
    print("  hook:", has, "keys:", len(keys))
    if labels:
        print("  hard labels:", labels[:20], ("..." if len(labels) > 20 else ""))
    if phs:
        print("  hard ph:", phs[:15], ("..." if len(phs) > 15 else ""))
    if fls:
        print("  hard fl:", fls)
    # sample keys
    mem = [k for k in keys if k.startswith("membership.")][:8]
    if mem:
        print("  sample keys:", mem)
