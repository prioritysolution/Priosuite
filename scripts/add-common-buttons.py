# -*- coding: utf-8 -*-
"""Add common.buttons to the active (last top-level) common block."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "i18n" / "locales"

BUTTONS = {
    "en": {
        "add": "Add",
        "edit": "Edit",
        "update": "Update",
        "save": "Save",
        "submit": "Submit",
        "cancel": "Cancel",
        "print": "Print",
        "reset": "Reset",
        "remove": "Remove",
        "generate": "Generate",
        "close": "Close",
        "download": "Download",
        "next": "Next",
    },
    "hi": {
        "add": "जोड़ें",
        "edit": "संपादित करें",
        "update": "अपडेट करें",
        "save": "सहेजें",
        "submit": "जमा करें",
        "cancel": "रद्द करें",
        "print": "प्रिंट",
        "reset": "रीसेट",
        "remove": "हटाएँ",
        "generate": "जनरेट करें",
        "close": "बंद करें",
        "download": "डाउनलोड",
        "next": "आगे",
    },
    "bn": {
        "add": "যোগ করুন",
        "edit": "সম্পাদনা",
        "update": "আপডেট",
        "save": "সংরক্ষণ",
        "submit": "জমা দিন",
        "cancel": "বাতিল",
        "print": "প্রিন্ট",
        "reset": "রিসেট",
        "remove": "সরান",
        "generate": "জেনারেট",
        "close": "বন্ধ",
        "download": "ডাউনলোড",
        "next": "পরবর্তী",
    },
    "or": {
        "add": "ଯୋଡନ୍ତୁ",
        "edit": "ସମ୍ପାଦନା",
        "update": "ଅପଡେଟ୍",
        "save": "ସେଭ୍",
        "submit": "ଦାଖଲ",
        "cancel": "ବାତିଲ୍",
        "print": "ପ୍ରିଣ୍ଟ",
        "reset": "ରିସେଟ୍",
        "remove": "ହଟାନ୍ତୁ",
        "generate": "ଜେନେରେଟ୍",
        "close": "ବନ୍ଦ",
        "download": "ଡାଉନଲୋଡ୍",
        "next": "ପରବର୍ତ୍ତୀ",
    },
}


def buttons_block(lang):
    items = list(BUTTONS[lang].items())
    lines = ["      buttons: {"]
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = v.replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'        {k}: "{esc}"{comma}')
    lines.append("      },")
    return "\n".join(lines)


def find_last_top_common(text):
    matches = list(re.finditer(r"\n    common:\s*\{", text))
    if not matches:
        raise SystemExit("no top-level common")
    return matches[-1]


def already_has_buttons(text, start):
    # look at first ~400 chars of the common block for buttons:
    depth = 0
    i = text.find("{", start)
    end = i
    while end < len(text):
        if text[end] == "{":
            depth += 1
        elif text[end] == "}":
            depth -= 1
            if depth == 0:
                break
        end += 1
        if end - i > 800:
            break
    snippet = text[i : end + 1]
    return re.search(r"\n      buttons:\s*\{", snippet) is not None


for lang in ("en", "hi", "bn", "or"):
    path = ROOT / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    m = find_last_top_common(text)
    if already_has_buttons(text, m.start()):
        print(f"{lang}: buttons already present")
        continue
    # insert right after `common: {`
    insert_at = m.end()
    block = "\n" + buttons_block(lang)
    text = text[:insert_at] + block + text[insert_at:]
    path.write_text(text, encoding="utf-8")
    print(f"{lang}: added common.buttons")
