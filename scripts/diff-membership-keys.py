# -*- coding: utf-8 -*-
"""Extract all membership t() keys from components and compare to locale."""
from pathlib import Path
import re
import importlib.util

# load en.js as text and find membership keys roughly via node
comp_keys = set()
root = Path("components/membership")
for p in root.rglob("*.jsx"):
    text = p.read_text(encoding="utf-8")
    for k in re.findall(r't\(\s*["\']([^"\']+)["\']', text):
        if k.startswith("membership.") or k.startswith("common.") or k.startswith("memberSearch."):
            comp_keys.add(k)

# flatten locale membership via node
import subprocess, json, tempfile, textwrap

script = textwrap.dedent(
    """
    import en from './i18n/locales/en.js';
    function flat(obj, prefix='') {
      const out = [];
      for (const [k,v] of Object.entries(obj||{})) {
        const p = prefix ? prefix+'.'+k : k;
        if (v && typeof v === 'object') out.push(...flat(v,p));
        else out.push(p);
      }
      return out;
    }
    const keys = [
      ...flat(en.translation.membership,'membership'),
      ...flat(en.translation.common,'common'),
      ...flat(en.translation.memberSearch,'memberSearch'),
    ];
    console.log(JSON.stringify(keys));
    """
)
Path("_tmp_flat.mjs").write_text(script, encoding="utf-8")
r = subprocess.run(["node", "_tmp_flat.mjs"], capture_output=True, text=True)
Path("_tmp_flat.mjs").unlink(missing_ok=True)
if r.returncode != 0:
    print("NODE ERR", r.stderr)
    raise SystemExit(1)
locale_keys = set(json.loads(r.stdout.strip().splitlines()[-1]))

missing = sorted(k for k in comp_keys if k not in locale_keys)
extra_unused = sorted(k for k in locale_keys if k.startswith("membership.") and k not in comp_keys)
print("component keys", len(comp_keys))
print("locale keys", len(locale_keys))
print("MISSING from locale", len(missing))
for k in missing:
    print(" ", k)
print("unused membership locale keys", len(extra_unused))
