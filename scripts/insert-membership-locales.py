# -*- coding: utf-8 -*-
"""Insert membership locale blocks; extend common buttons."""
from pathlib import Path
import json
import importlib.util

ROOT = Path(__file__).resolve().parents[1]
LOCALE_DIR = ROOT / "i18n" / "locales"
spec = importlib.util.spec_from_file_location(
    "mem", Path(__file__).with_name("membership-i18n-locales.py")
)
mem = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mem)

COMMON_EXTRA = mem.COMMON_EXTRA


def fmt(data, level=1):
    pad = " " * (4 * level)
    pad2 = " " * (4 * (level + 1))
    if isinstance(data, dict):
        lines = ["{"]
        items = list(data.items())
        for i, (k, v) in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            lines.append(f"{pad2}{k}: {fmt(v, level + 1)}{comma}")
        lines.append(pad + "}")
        return "\n".join(lines)
    return json.dumps(data, ensure_ascii=False)


def patch_common(text, lang):
    extra = COMMON_EXTRA[lang]
    # buttons: add missing keys before buttons closing inside common
    ci = text.find("    common: {")
    mi = text.find("    master: {", ci)
    common = text[ci:mi]
    buttons_start = common.find("buttons: {")
    buttons_end = common.find("},", buttons_start)
    buttons_block = common[buttons_start:buttons_end]
    for key in ("close", "print", "download", "generate"):
        if f"{key}:" not in buttons_block:
            # insert before end of buttons
            insert = f',\n        {key}: {json.dumps(extra[key], ensure_ascii=False)}'
            # find last property line in buttons
            abs_end = ci + buttons_end
            text = text[:abs_end] + insert + text[abs_end:]
            # refresh
            ci = text.find("    common: {")
            mi = text.find("    master: {", ci)
            common = text[ci:mi]
            buttons_start = common.find("buttons: {")
            buttons_end = common.find("},", buttons_start)
            buttons_block = common[buttons_start:buttons_end]
    # total at common root
    ci = text.find("    common: {")
    mi = text.find("    master: {", ci)
    common = text[ci:mi]
    if "total:" not in common:
        # before common closing `    },`
        # common ends at last `    },` before master - find relative
        # insert after select line
        sel = common.rfind("select:")
        line_end = common.find("\n", sel)
        insert = f',\n      total: {json.dumps(extra["total"], ensure_ascii=False)}'
        abs_pos = ci + line_end
        text = text[:abs_pos] + insert + text[abs_pos:]
    return text


def main():
    en_m = mem.membership_en()
    by_lang = {
        "en": en_m,
        "hi": mem.tr_hi(en_m),
        "bn": mem.tr_bn(en_m),
        "or": mem.tr_or(en_m),
    }
    for lang, data in by_lang.items():
        path = LOCALE_DIR / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        text = patch_common(text, lang)
        if "\n    membership: {" in text:
            print("skip membership", lang)
        else:
            block = "    membership: " + fmt(data, 1) + ","
            needle = "    memberSearch:"
            if needle not in text:
                raise SystemExit(f"no memberSearch in {lang}")
            text = text.replace(needle, block + "\n\n" + needle, 1)
            print("inserted", lang)
        path.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
