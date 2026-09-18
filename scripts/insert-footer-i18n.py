# -*- coding: utf-8 -*-
"""Insert footer locales and wire components/footer/index.jsx."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "footer" / "index.jsx"

FOOTER = {
    "en": {
        "branch": "Branch",
        "open": "Open",
        "openDate": "Open Date",
        "fy": "FY",
        "currentDateTime": "Current Date & Time",
    },
    "hi": {
        "branch": "शाखा",
        "open": "खुलने की तिथि",
        "openDate": "खुलने की तिथि",
        "fy": "वित्तीय वर्ष",
        "currentDateTime": "वर्तमान दिनांक और समय",
    },
    "bn": {
        "branch": "শাখা",
        "open": "খোলার তারিখ",
        "openDate": "খোলার তারিখ",
        "fy": "আর্থিক বছর",
        "currentDateTime": "বর্তমান তারিখ ও সময়",
    },
    "or": {
        "branch": "ଶାଖା",
        "open": "ଖୋଲିବା ତାରିଖ",
        "openDate": "ଖୋଲିବା ତାରିଖ",
        "fy": "ଆର୍ଥିକ ବର୍ଷ",
        "currentDateTime": "ବର୍ତ୍ତମାନ ତାରିଖ ଏବଂ ସମୟ",
    },
}


def js_obj(d, indent=6):
    pad = " " * indent
    items = list(d.items())
    lines = []
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


def insert_after_top_block(text: str, block_name: str, new_block: str) -> str:
    m = re.search(rf"(\n    {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"top-level {block_name} not found")
    depth = 0
    i = m.end(1) - 1
    end = None
    while i < len(text):
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                j = i + 1
                if j < len(text) and text[j] == ",":
                    j += 1
                end = j
                break
        i += 1
    if end is None:
        raise SystemExit(f"could not close {block_name}")
    return text[:end] + "\n" + new_block + text[end:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    if re.search(r"\n    footer:\s*\{", text):
        print(f"{lang}: footer already present")
        return
    block = "    footer: {\n" + js_obj(FOOTER[lang], indent=6) + "\n    },"
    for anchor in ("borrowingsApproval", "investmentApproval", "about"):
        if re.search(rf"\n    {anchor}:\s*\{{", text):
            text = insert_after_top_block(text, anchor, block)
            path.write_text(text, encoding="utf-8")
            print(f"{lang}: inserted after {anchor}")
            return
    raise SystemExit(f"{lang}: no anchor")


def wire_component() -> None:
    text = COMP.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import { parseLocalDate } from "@/utils/dateHelpers";\n',
            'import { parseLocalDate } from "@/utils/dateHelpers";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            "const Footer = ({ finYearCookieVersion = 0 }) => {\n  const [startDate, setStartDate] = useState(\"\");",
            "const Footer = ({ finYearCookieVersion = 0 }) => {\n  const { t } = useTranslation();\n\n  const [startDate, setStartDate] = useState(\"\");",
        )

    repls = [
        (
            '<span className="whitespace-nowrap flex-shrink-0">Branch:</span>',
            '<span className="whitespace-nowrap flex-shrink-0">\n            {t("footer.branch")}:\n          </span>',
        ),
        (
            """          <span className="whitespace-nowrap flex-shrink-0">
            <span className="sm:hidden">Open:</span>
            <span className="hidden sm:inline">Open Date:</span>
          </span>""",
            """          <span className="whitespace-nowrap flex-shrink-0">
            <span className="sm:hidden">{t("footer.open")}:</span>
            <span className="hidden sm:inline">
              {t("footer.openDate")}:
            </span>
          </span>""",
        ),
        (
            '<span className="whitespace-nowrap">FY:</span>',
            '<span className="whitespace-nowrap">{t("footer.fy")}:</span>',
        ),
        (
            """          <span className="whitespace-nowrap hidden md:inline">
            Current Date & Time:
          </span>""",
            """          <span className="whitespace-nowrap hidden md:inline">
            {t("footer.currentDateTime")}:
          </span>""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"MISS: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"OK: {old[:50]!r}")
    COMP.write_text(text, encoding="utf-8")
    print("footer done")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_component()
