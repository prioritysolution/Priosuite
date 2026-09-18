# -*- coding: utf-8 -*-
"""Insert deposit rectify keys and wire rectify/deposit/index.jsx."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "rectify" / "deposit" / "index.jsx"

DEPOSIT_KEYS = {
    "en": {
        "rectifyDeposit": "Rectify Deposit",
        "rectifyType": "Rectify Type",
        "selectRectifyType": "Select rectify type",
        "searchRectifyType": "Search rectify type...",
        "depositProduct": "Deposit Product",
        "selectDepositProduct": "Select deposit product",
        "searchDepositProduct": "Search deposit product...",
        "basicInfoBlock": "Basic Info Block",
        "memberName": "Member Name",
        "enterMemberName": "Enter member name",
        "gurdianName": "Gurdian Name",
        "enterGurdianName": "Enter gurdian name",
        "accountNo": "Account No.",
        "enterAccountNo": "Enter account no.",
        "enterAmount": "Enter amount",
        "rectify": "Rectify",
    },
    "hi": {
        "rectifyDeposit": "जमा सुधार",
        "rectifyType": "सुधार प्रकार",
        "selectRectifyType": "सुधार प्रकार चुनें",
        "searchRectifyType": "सुधार प्रकार खोजें...",
        "depositProduct": "जमा उत्पाद",
        "selectDepositProduct": "जमा उत्पाद चुनें",
        "searchDepositProduct": "जमा उत्पाद खोजें...",
        "basicInfoBlock": "मूल जानकारी ब्लॉक",
        "memberName": "सदस्य का नाम",
        "enterMemberName": "सदस्य का नाम दर्ज करें",
        "gurdianName": "अभिभावक का नाम",
        "enterGurdianName": "अभिभावक का नाम दर्ज करें",
        "accountNo": "खाता संख्या",
        "enterAccountNo": "खाता संख्या दर्ज करें",
        "enterAmount": "राशि दर्ज करें",
        "rectify": "सुधारें",
    },
    "bn": {
        "rectifyDeposit": "জমা সংশোধন",
        "rectifyType": "সংশোধনের ধরন",
        "selectRectifyType": "সংশোধনের ধরন নির্বাচন করুন",
        "searchRectifyType": "সংশোধনের ধরন অনুসন্ধান করুন...",
        "depositProduct": "জমা পণ্য",
        "selectDepositProduct": "জমা পণ্য নির্বাচন করুন",
        "searchDepositProduct": "জমা পণ্য অনুসন্ধান করুন...",
        "basicInfoBlock": "মৌলিক তথ্য ব্লক",
        "memberName": "সদস্যের নাম",
        "enterMemberName": "সদস্যের নাম লিখুন",
        "gurdianName": "অভিভাবকের নাম",
        "enterGurdianName": "অভিভাবকের নাম লিখুন",
        "accountNo": "অ্যাকাউন্ট নম্বর",
        "enterAccountNo": "অ্যাকাউন্ট নম্বর লিখুন",
        "enterAmount": "পরিমাণ লিখুন",
        "rectify": "সংশোধন করুন",
    },
    "or": {
        "rectifyDeposit": "ଜମା ସଂଶୋଧନ",
        "rectifyType": "ସଂଶୋଧନ ପ୍ରକାର",
        "selectRectifyType": "ସଂଶୋଧନ ପ୍ରକାର ଚୟନ କରନ୍ତୁ",
        "searchRectifyType": "ସଂଶୋଧନ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "depositProduct": "ଜମା ଉତ୍ପାଦ",
        "selectDepositProduct": "ଜମା ଉତ୍ପାଦ ଚୟନ କରନ୍ତୁ",
        "searchDepositProduct": "ଜମା ଉତ୍ପାଦ ଖୋଜନ୍ତୁ...",
        "basicInfoBlock": "ମୌଳିକ ସୂଚନା ବ୍ଲକ୍",
        "memberName": "ସଦସ୍ୟଙ୍କ ନାମ",
        "enterMemberName": "ସଦସ୍ୟଙ୍କ ନାମ ପ୍ରବେଶ କରନ୍ତୁ",
        "gurdianName": "ଅଭିଭାବକଙ୍କ ନାମ",
        "enterGurdianName": "ଅଭିଭାବକଙ୍କ ନାମ ପ୍ରବେଶ କରନ୍ତୁ",
        "accountNo": "ଖାତା ନମ୍ବର",
        "enterAccountNo": "ଖାତା ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
        "enterAmount": "ରାଶି ପ୍ରବେଶ କରନ୍ତୁ",
        "rectify": "ସଂଶୋଧନ କରନ୍ତୁ",
    },
}


def js_lines(d, indent=6):
    pad = " " * indent
    lines = []
    for k, v in d.items():
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}",')
    return "\n".join(lines)


def insert_deposit_keys(text: str, lang: str) -> str:
    m = re.search(r"\n    deposit:\s*\{", text)
    if not m:
        raise SystemExit(f"{lang}: deposit missing")
    depth = 0
    i = m.end() - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                dep = text[m.start() : i + 1]
                break
        i += 1
    if "rectifyDeposit:" in dep:
        print(f"{lang}: rectify keys already in deposit")
        return text

    needle = "    deposit: {\n"
    idx = text.find(needle)
    if idx < 0:
        raise SystemExit(f"{lang}: deposit block not found")
    insert_at = idx + len(needle)
    block = js_lines(DEPOSIT_KEYS[lang], indent=6) + "\n"
    return text[:insert_at] + block + text[insert_at:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    text = insert_deposit_keys(text, lang)
    path.write_text(text, encoding="utf-8")
    print(f"{lang}: ok")


def wire_component() -> None:
    text = COMP.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import AccountSearchForm from "@/common/forms/AccountSearchForm";\n',
            'import AccountSearchForm from "@/common/forms/AccountSearchForm";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            "  rectifyTypeId,\n}) => {\n  const rectifyTypeData = useSelector(",
            "  rectifyTypeId,\n}) => {\n  const { t } = useTranslation();\n\n  const rectifyTypeData = useSelector(",
        )

    repls = [
        (
            '<h3 className="text-2xl font-semibold ">Rectify Deposit</h3>',
            '<h3 className="text-2xl font-semibold ">\n          {t("deposit.rectifyDeposit")}\n        </h3>',
        ),
        ('label="Rectify Type"', 'label={t("deposit.rectifyType")}'),
        (
            'placeholder="Select rectify type"',
            'placeholder={t("deposit.selectRectifyType")}',
        ),
        (
            'searchPlaceholder="Search rectify type..."',
            'searchPlaceholder={t("deposit.searchRectifyType")}',
        ),
        ('label="Deposit Product"', 'label={t("deposit.depositProduct")}'),
        (
            'placeholder="Select deposit product"',
            'placeholder={t("deposit.selectDepositProduct")}',
        ),
        (
            'searchPlaceholder="Search deposit product..."',
            'searchPlaceholder={t("deposit.searchDepositProduct")}',
        ),
        (
            """                  <h3 className="w-full text-center text-xl font-semibold">
                    Basic Info Block
                  </h3>""",
            """                  <h3 className="w-full text-center text-xl font-semibold">
                    {t("deposit.basicInfoBlock")}
                  </h3>""",
        ),
        ('label="Transaction Date"', 'label={t("common.transactionDate")}'),
        ("<FormLabel>Member Name</FormLabel>", '<FormLabel>{t("deposit.memberName")}</FormLabel>'),
        (
            'placeholder="Enter member name"',
            'placeholder={t("deposit.enterMemberName")}',
        ),
        ("<FormLabel>Gurdian Name</FormLabel>", '<FormLabel>{t("deposit.gurdianName")}</FormLabel>'),
        (
            'placeholder="Enter gurdian name"',
            'placeholder={t("deposit.enterGurdianName")}',
        ),
        ("<FormLabel>Account No.</FormLabel>", '<FormLabel>{t("deposit.accountNo")}</FormLabel>'),
        (
            'placeholder="Enter account no."',
            'placeholder={t("deposit.enterAccountNo")}',
        ),
        ("<FormLabel>Amount</FormLabel>", '<FormLabel>{t("common.amount")}</FormLabel>'),
        (
            'placeholder="Enter amount"',
            'placeholder={t("deposit.enterAmount")}',
        ),
        (
            """                  ) : (
                    "Rectify"
                  )}""",
            """                  ) : (
                    t("deposit.rectify")
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
