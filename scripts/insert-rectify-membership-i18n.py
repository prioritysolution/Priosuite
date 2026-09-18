# -*- coding: utf-8 -*-
"""Insert membership rectify keys and wire rectify/membership/index.jsx."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "rectify" / "membership" / "index.jsx"

MEMBER_KEYS = {
    "en": {
        "rectifyMembership": "Rectify Membership",
        "rectifyType": "Rectify Type",
        "selectRectifyType": "Select rectify type",
        "searchRectifyType": "Search rectify type...",
        "basicInfoBlock": "Basic Info Block",
        "memberName": "Member Name",
        "enterMemberName": "Enter member name",
        "gurdianName": "Gurdian Name",
        "enterGurdianName": "Enter gurdian name",
        "enterAddress": "Enter address",
        "enterTransMode": "Enter trans mode",
        "enterAmount": "Enter amount",
        "rectify": "Rectify",
    },
    "hi": {
        "rectifyMembership": "सदस्यता सुधारें",
        "rectifyType": "सुधार प्रकार",
        "selectRectifyType": "सुधार प्रकार चुनें",
        "searchRectifyType": "सुधार प्रकार खोजें...",
        "basicInfoBlock": "मूल जानकारी ब्लॉक",
        "memberName": "सदस्य का नाम",
        "enterMemberName": "सदस्य का नाम दर्ज करें",
        "gurdianName": "अभिभावक का नाम",
        "enterGurdianName": "अभिभावक का नाम दर्ज करें",
        "enterAddress": "पता दर्ज करें",
        "enterTransMode": "लेनदेन मोड दर्ज करें",
        "enterAmount": "राशि दर्ज करें",
        "rectify": "सुधारें",
    },
    "bn": {
        "rectifyMembership": "সদস্যপদ সংশোধন",
        "rectifyType": "সংশোধনের ধরন",
        "selectRectifyType": "সংশোধনের ধরন নির্বাচন করুন",
        "searchRectifyType": "সংশোধনের ধরন খুঁজুন...",
        "basicInfoBlock": "মৌলিক তথ্য ব্লক",
        "memberName": "সদস্যের নাম",
        "enterMemberName": "সদস্যের নাম লিখুন",
        "gurdianName": "অভিভাবকের নাম",
        "enterGurdianName": "অভিভাবকের নাম লিখুন",
        "enterAddress": "ঠিকানা লিখুন",
        "enterTransMode": "লেনদেনের মোড লিখুন",
        "enterAmount": "পরিমাণ লিখুন",
        "rectify": "সংশোধন করুন",
    },
    "or": {
        "rectifyMembership": "ସଦସ୍ୟତା ସଂଶୋଧନ",
        "rectifyType": "ସଂଶୋଧନ ପ୍ରକାର",
        "selectRectifyType": "ସଂଶୋଧନ ପ୍ରକାର ଚୟନ କରନ୍ତୁ",
        "searchRectifyType": "ସଂଶୋଧନ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "basicInfoBlock": "ମୌଳିକ ସୂଚନା ବ୍ଲକ୍",
        "memberName": "ସଦସ୍ୟଙ୍କ ନାମ",
        "enterMemberName": "ସଦସ୍ୟଙ୍କ ନାମ ଲେଖନ୍ତୁ",
        "gurdianName": "ଅଭିଭାବକଙ୍କ ନାମ",
        "enterGurdianName": "ଅଭିଭାବକଙ୍କ ନାମ ଲେଖନ୍ତୁ",
        "enterAddress": "ଠିକଣା ଲେଖନ୍ତୁ",
        "enterTransMode": "କାରବାର ମୋଡ୍ ଲେଖନ୍ତୁ",
        "enterAmount": "ରାଶି ଲେଖନ୍ତୁ",
        "rectify": "ସଂଶୋଧନ କରନ୍ତୁ",
    },
}

COMMON_TRANS_MODE = {
    "en": "Trans Mode",
    "hi": "लेनदेन मोड",
    "bn": "লেনদেনের মোড",
    "or": "କାରବାର ମୋଡ୍",
}


def js_lines(d, indent=6):
    pad = " " * indent
    items = list(d.items())
    lines = []
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ","
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


def ensure_common_trans_mode(text: str, lang: str) -> str:
    matches = list(re.finditer(r"\n    common:\s*\{", text))
    m = matches[-1]
    depth = 0
    i = m.end() - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                end = i
                block = text[m.start() : end]
                break
        i += 1
    else:
        raise SystemExit(f"{lang}: common close fail")
    if re.search(r"\n      transMode:", block):
        return text
    esc = COMMON_TRANS_MODE[lang].replace("\\", "\\\\").replace('"', '\\"')
    prefix = text[:end].rstrip()
    if not prefix.endswith(","):
        prefix += ","
    return prefix + f'\n      transMode: "{esc}"\n    ' + text[end:]


def insert_membership_keys(text: str, lang: str) -> str:
    if re.search(r"\n      rectifyMembership:", text):
        # might be nested elsewhere; check under membership
        m = re.search(r"\n    membership:\s*\{", text)
        if not m:
            raise SystemExit(f"{lang}: membership missing")
        depth = 0
        i = m.end() - 1
        while i < len(text):
            if text[i] == "{":
                depth += 1
            elif text[i] == "}":
                depth -= 1
                if depth == 0:
                    memb = text[m.start() : i + 1]
                    break
            i += 1
        if "rectifyMembership:" in memb:
            print(f"{lang}: rectify keys already in membership")
            return text

    needle = "    membership: {\n"
    idx = text.find(needle)
    if idx < 0:
        raise SystemExit(f"{lang}: membership block not found")
    insert_at = idx + len(needle)
    block = js_lines(MEMBER_KEYS[lang], indent=6) + "\n"
    return text[:insert_at] + block + text[insert_at:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    text = ensure_common_trans_mode(text, lang)
    text = insert_membership_keys(text, lang)
    path.write_text(text, encoding="utf-8")
    print(f"{lang}: ok")


def wire_component() -> None:
    text = COMP.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\n',
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            "  resetTrigger,\n}) => {\n  const rectifyTypeData = useSelector(",
            "  resetTrigger,\n}) => {\n  const { t } = useTranslation();\n\n  const rectifyTypeData = useSelector(",
        )

    repls = [
        (
            '<h3 className="text-2xl font-semibold ">Rectify Membership</h3>',
            '<h3 className="text-2xl font-semibold ">\n          {t("membership.rectifyMembership")}\n        </h3>',
        ),
        ('label="Rectify Type"', 'label={t("membership.rectifyType")}'),
        (
            'placeholder="Select rectify type"',
            'placeholder={t("membership.selectRectifyType")}',
        ),
        (
            'searchPlaceholder="Search rectify type..."',
            'searchPlaceholder={t("membership.searchRectifyType")}',
        ),
        (
            """                  <h3 className="w-full text-center text-xl font-semibold">
                    Basic Info Block
                  </h3>""",
            """                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("membership.basicInfoBlock")}
                  </h3>""",
        ),
        ('label="Transaction Date"', 'label={t("common.transactionDate")}'),
        ("<FormLabel>Member Name</FormLabel>", '<FormLabel>{t("membership.memberName")}</FormLabel>'),
        (
            'placeholder="Enter member name"',
            'placeholder={t("membership.enterMemberName")}',
        ),
        ("<FormLabel>Gurdian Name</FormLabel>", '<FormLabel>{t("membership.gurdianName")}</FormLabel>'),
        (
            'placeholder="Enter gurdian name"',
            'placeholder={t("membership.enterGurdianName")}',
        ),
        ("<FormLabel>Address</FormLabel>", '<FormLabel>{t("common.address")}</FormLabel>'),
        (
            'placeholder="Enter address"',
            'placeholder={t("membership.enterAddress")}',
        ),
        ("<FormLabel>Trans Mode</FormLabel>", '<FormLabel>{t("common.transMode")}</FormLabel>'),
        (
            'placeholder="Enter trans mode"',
            'placeholder={t("membership.enterTransMode")}',
        ),
        ("<FormLabel>Amount</FormLabel>", '<FormLabel>{t("common.amount")}</FormLabel>'),
        (
            'placeholder="Enter amount"',
            'placeholder={t("membership.enterAmount")}',
        ),
        (
            """                  ) : (
                    "Rectify"
                  )}""",
            """                  ) : (
                    t("membership.rectify")
                  )}""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"MISS: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"OK: {old[:50]!r}")
    COMP.write_text(text, encoding="utf-8")
    print("component done")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_component()
