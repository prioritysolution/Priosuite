# -*- coding: utf-8 -*-
"""Extend common + insert membership block before memberSearch in locale files."""
import re
from pathlib import Path

from membership_locale_blocks import common_replacement, membership_block, collect_untranslated

root = Path(__file__).resolve().parents[1] / "i18n" / "locales"


def replace_common(text: str, lang: str) -> str:
    new_common = common_replacement(lang)
    # replace existing common block up to next top-level sibling under translation
    pattern = re.compile(r"    common: \{.*?\n    \},\n", re.S)
    m = pattern.search(text)
    if not m:
        raise SystemExit(f"common block not found for {lang}")
    return text[: m.start()] + new_common + text[m.end() :]


def insert_membership(text: str, lang: str) -> str:
    if "\n    membership: {" in text:
        # replace existing membership block
        pattern = re.compile(r"\n    membership: \{.*?\n    \},\n\n", re.S)
        m = pattern.search(text)
        if not m:
            raise SystemExit(f"membership present but pattern failed ({lang})")
        return text[: m.start()] + "\n" + membership_block(lang) + text[m.end() :]
    needle = "    memberSearch:"
    if needle not in text:
        raise SystemExit(f"memberSearch not found in {lang}")
    return text.replace(needle, membership_block(lang) + needle, 1)


def main():
    for lang in ("hi", "bn", "or"):
        missing = collect_untranslated(lang)
        if missing:
            print(f"WARN {lang} untranslated ({len(missing)}):")
            for path, val in missing[:30]:
                print(f"  {path}: {val!r}")
            if len(missing) > 30:
                print(f"  ... +{len(missing)-30} more")

    for lang in ("en", "hi", "bn", "or"):
        path = root / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        text = replace_common(text, lang)
        text = insert_membership(text, lang)
        path.write_text(text, encoding="utf-8")
        print(f"updated {path.name}")


if __name__ == "__main__":
    main()
