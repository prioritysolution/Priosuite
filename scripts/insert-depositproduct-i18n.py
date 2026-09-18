# -*- coding: utf-8 -*-
"""Insert master.depositProduct locales and wire depositProduct components."""
from pathlib import Path
import re
import json

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "master" / "depositProduct"

EN = {
    "title": "Deposit Product",
    "addNew": "Add New",
    "addTitle": "Add Deposit Product",
    "editTitle": "Edit Deposit Product",
    "addDesc": "Fill in the details to add a new deposit product.",
    "editDesc": "Update the selected deposit product details below.",
    "fields": {
        "productType": "Product Type",
        "depositType": "Deposit Type",
        "productName": "Product Name",
        "shortName": "Short Name",
        "interestType": "Interest Type",
        "minAmount": "Minimum Amount",
        "maxAmount": "Maximum Amount",
        "roi": "Rate of Interest",
        "minDuration": "Minimum Duration",
        "maxDuration": "Maximum Duration",
        "durationUnit": "Duration Unit",
        "lockInDays": "Lock-in Days",
        "passbookFees": "Passbook Fees",
        "defaultFine": "Default Fine",
        "fineOn": "Fine On",
        "inoperativeMonths": "Inoperative Months",
        "dormantMonths": "Dormant Months",
        "memberType": "Member Type",
        "principalLedger": "Principal Ledger",
        "interestLedger": "Interest Ledger",
        "provisionLedger": "Provision Ledger",
        "fineLedger": "Fine Ledger",
    },
    "placeholders": {
        "productType": "Select product type",
        "searchProductType": "Search product type...",
        "depositType": "Select deposit type",
        "searchDepositType": "Search deposit type...",
        "productName": "Enter product name",
        "shortName": "Enter short name",
        "interestType": "Select interest type",
        "searchInterestType": "Search interest type...",
        "minAmount": "Enter minimum amount",
        "maxAmount": "Enter maximum amount",
        "roi": "Enter ROI",
        "minDuration": "Enter minimum duration",
        "maxDuration": "Enter maximum duration",
        "durationUnit": "Select duration unit",
        "searchDurationUnit": "Search duration unit...",
        "lockInDays": "Enter lock-in days",
        "passbookFees": "Enter passbook fees",
        "defaultFine": "Enter default fine",
        "fineOn": "Enter fine on",
        "inoperativeMonths": "Enter inoperative months",
        "dormantMonths": "Enter dormant months",
        "memberType": "Select member type",
        "searchMemberType": "Search member type...",
        "principalLedger": "Select principal ledger",
        "interestLedger": "Select interest ledger",
        "provisionLedger": "Select provision ledger",
        "fineLedger": "Select fine ledger",
        "searchLedger": "Search ledger...",
    },
    "table": {
        "productName": "Product Name",
        "shortName": "Short Name",
        "productType": "Product Type",
        "depositType": "Deposit Type",
        "interestType": "Interest Type",
        "minAmt": "Min Amt",
        "maxAmt": "Max Amt",
        "roi": "ROI",
        "status": "Status",
    },
}

HI = {
    **EN,
    "title": "जमा उत्पाद",
    "addNew": "नया जोड़ें",
    "addTitle": "जमा उत्पाद जोड़ें",
    "editTitle": "जमा उत्पाद संपादित करें",
    "addDesc": "नया जमा उत्पाद जोड़ने के लिए विवरण भरें।",
    "editDesc": "नीचे चयनित जमा उत्पाद विवरण अपडेट करें।",
    "fields": {
        **EN["fields"],
        "productType": "उत्पाद प्रकार",
        "depositType": "जमा प्रकार",
        "productName": "उत्पाद का नाम",
        "shortName": "संक्षिप्त नाम",
        "interestType": "ब्याज प्रकार",
        "minAmount": "न्यूनतम राशि",
        "maxAmount": "अधिकतम राशि",
        "roi": "ब्याज दर",
        "minDuration": "न्यूनतम अवधि",
        "maxDuration": "अधिकतम अवधि",
        "durationUnit": "अवधि इकाई",
        "lockInDays": "लॉक-इन दिन",
        "passbookFees": "पासबुक शुल्क",
        "defaultFine": "डिफ़ॉल्ट जुर्माना",
        "fineOn": "जुर्माना पर",
        "inoperativeMonths": "निष्क्रिय महीने",
        "dormantMonths": "निष्क्रिय (डॉर्मेंट) महीने",
        "memberType": "सदस्य प्रकार",
        "principalLedger": "मूल लेजर",
        "interestLedger": "ब्याज लेजर",
        "provisionLedger": "प्रावधान लेजर",
        "fineLedger": "जुर्माना लेजर",
    },
    "placeholders": {
        **EN["placeholders"],
        "productType": "उत्पाद प्रकार चुनें",
        "searchProductType": "उत्पाद प्रकार खोजें...",
        "depositType": "जमा प्रकार चुनें",
        "searchDepositType": "जमा प्रकार खोजें...",
        "productName": "उत्पाद का नाम दर्ज करें",
        "shortName": "संक्षिप्त नाम दर्ज करें",
        "interestType": "ब्याज प्रकार चुनें",
        "searchInterestType": "ब्याज प्रकार खोजें...",
        "minAmount": "न्यूनतम राशि दर्ज करें",
        "maxAmount": "अधिकतम राशि दर्ज करें",
        "roi": "ROI दर्ज करें",
        "minDuration": "न्यूनतम अवधि दर्ज करें",
        "maxDuration": "अधिकतम अवधि दर्ज करें",
        "durationUnit": "अवधि इकाई चुनें",
        "searchDurationUnit": "अवधि इकाई खोजें...",
        "lockInDays": "लॉक-इन दिन दर्ज करें",
        "passbookFees": "पासबुक शुल्क दर्ज करें",
        "defaultFine": "डिफ़ॉल्ट जुर्माना दर्ज करें",
        "fineOn": "जुर्माना पर दर्ज करें",
        "inoperativeMonths": "निष्क्रिय महीने दर्ज करें",
        "dormantMonths": "डॉर्मेंट महीने दर्ज करें",
        "memberType": "सदस्य प्रकार चुनें",
        "searchMemberType": "सदस्य प्रकार खोजें...",
        "principalLedger": "मूल लेजर चुनें",
        "interestLedger": "ब्याज लेजर चुनें",
        "provisionLedger": "प्रावधान लेजर चुनें",
        "fineLedger": "जुर्माना लेजर चुनें",
        "searchLedger": "लेजर खोजें...",
    },
    "table": {
        "productName": "उत्पाद का नाम",
        "shortName": "संक्षिप्त नाम",
        "productType": "उत्पाद प्रकार",
        "depositType": "जमा प्रकार",
        "interestType": "ब्याज प्रकार",
        "minAmt": "न्यून. राशि",
        "maxAmt": "अधि. राशि",
        "roi": "ROI",
        "status": "स्थिति",
    },
}

BN = {
    **EN,
    "title": "আমানত পণ্য",
    "addNew": "নতুন যোগ করুন",
    "addTitle": "আমানত পণ্য যোগ করুন",
    "editTitle": "আমানত পণ্য সম্পাদনা",
    "addDesc": "নতুন আমানত পণ্য যোগ করতে বিবরণ পূরণ করুন।",
    "editDesc": "নিচে নির্বাচিত আমানত পণ্যের বিবরণ আপডেট করুন।",
    "fields": {
        **EN["fields"],
        "productType": "পণ্যের ধরন",
        "depositType": "আমানতের ধরন",
        "productName": "পণ্যের নাম",
        "shortName": "সংক্ষিপ্ত নাম",
        "interestType": "সুদের ধরন",
        "minAmount": "সর্বনিম্ন পরিমাণ",
        "maxAmount": "সর্বোচ্চ পরিমাণ",
        "roi": "সুদের হার",
        "minDuration": "সর্বনিম্ন মেয়াদ",
        "maxDuration": "সর্বোচ্চ মেয়াদ",
        "durationUnit": "মেয়াদের একক",
        "lockInDays": "লক-ইন দিন",
        "passbookFees": "পাসবুক ফি",
        "defaultFine": "ডিফল্ট জরিমানা",
        "fineOn": "জরিমানা উপর",
        "inoperativeMonths": "নিষ্ক্রিয় মাস",
        "dormantMonths": "ডরম্যান্ট মাস",
        "memberType": "সদস্যের ধরন",
        "principalLedger": "মূল লেজার",
        "interestLedger": "সুদ লেজার",
        "provisionLedger": "প্রভিশন লেজার",
        "fineLedger": "জরিমানা লেজার",
    },
    "placeholders": {
        **EN["placeholders"],
        "productType": "পণ্যের ধরন নির্বাচন করুন",
        "searchProductType": "পণ্যের ধরন খুঁজুন...",
        "depositType": "আমানতের ধরন নির্বাচন করুন",
        "searchDepositType": "আমানতের ধরন খুঁজুন...",
        "productName": "পণ্যের নাম লিখুন",
        "shortName": "সংক্ষিপ্ত নাম লিখুন",
        "interestType": "সুদের ধরন নির্বাচন করুন",
        "searchInterestType": "সুদের ধরন খুঁজুন...",
        "minAmount": "সর্বনিম্ন পরিমাণ লিখুন",
        "maxAmount": "সর্বোচ্চ পরিমাণ লিখুন",
        "roi": "ROI লিখুন",
        "minDuration": "সর্বনিম্ন মেয়াদ লিখুন",
        "maxDuration": "সর্বোচ্চ মেয়াদ লিখুন",
        "durationUnit": "মেয়াদের একক নির্বাচন করুন",
        "searchDurationUnit": "মেয়াদের একক খুঁজুন...",
        "lockInDays": "লক-ইন দিন লিখুন",
        "passbookFees": "পাসবুক ফি লিখুন",
        "defaultFine": "ডিফল্ট জরিমানা লিখুন",
        "fineOn": "জরিমানা উপর লিখুন",
        "inoperativeMonths": "নিষ্ক্রিয় মাস লিখুন",
        "dormantMonths": "ডরম্যান্ট মাস লিখুন",
        "memberType": "সদস্যের ধরন নির্বাচন করুন",
        "searchMemberType": "সদস্যের ধরন খুঁজুন...",
        "principalLedger": "মূল লেজার নির্বাচন করুন",
        "interestLedger": "সুদ লেজার নির্বাচন করুন",
        "provisionLedger": "প্রভিশন লেজার নির্বাচন করুন",
        "fineLedger": "জরিমানা লেজার নির্বাচন করুন",
        "searchLedger": "লেজার খুঁজুন...",
    },
    "table": {
        "productName": "পণ্যের নাম",
        "shortName": "সংক্ষিপ্ত নাম",
        "productType": "পণ্যের ধরন",
        "depositType": "আমানতের ধরন",
        "interestType": "সুদের ধরন",
        "minAmt": "সর্বনিম্ন",
        "maxAmt": "সর্বোচ্চ",
        "roi": "ROI",
        "status": "স্থিতি",
    },
}

OR_ = {
    **EN,
    "title": "ଜମା ଉତ୍ପାଦ",
    "addNew": "ନୂଆ ଯୋଡନ୍ତୁ",
    "addTitle": "ଜମା ଉତ୍ପାଦ ଯୋଡନ୍ତୁ",
    "editTitle": "ଜମା ଉତ୍ପାଦ ସମ୍ପାଦନା",
    "addDesc": "ନୂଆ ଜମା ଉତ୍ପାଦ ଯୋଡିବା ପାଇଁ ବିବରଣୀ ପୂରଣ କରନ୍ତୁ।",
    "editDesc": "ନିମ୍ନରେ ବଛା ଜମା ଉତ୍ପାଦ ବିବରଣୀ ଅପଡେଟ୍ କରନ୍ତୁ।",
    "fields": {
        **EN["fields"],
        "productType": "ଉତ୍ପାଦ ପ୍ରକାର",
        "depositType": "ଜମା ପ୍ରକାର",
        "productName": "ଉତ୍ପାଦ ନାମ",
        "shortName": "ସଂକ୍ଷିପ୍ତ ନାମ",
        "interestType": "ସୁଧ ପ୍ରକାର",
        "minAmount": "ସର୍ବନିମ୍ନ ରାଶି",
        "maxAmount": "ସର୍ବାଧିକ ରାଶି",
        "roi": "ସୁଧ ହାର",
        "minDuration": "ସର୍ବନିମ୍ନ ଅବଧି",
        "maxDuration": "ସର୍ବାଧିକ ଅବଧି",
        "durationUnit": "ଅବଧି ଏକକ",
        "lockInDays": "ଲକ୍-ଇନ୍ ଦିନ",
        "passbookFees": "ପାସବୁକ୍ ଫି",
        "defaultFine": "ଡିଫଲ୍ଟ ଜୁରିମାନା",
        "fineOn": "ଜୁରିମାନା ଉପରେ",
        "inoperativeMonths": "ନିଷ୍କ୍ରିୟ ମାସ",
        "dormantMonths": "ଡର୍ମାଣ୍ଟ ମାସ",
        "memberType": "ସଦସ୍ୟ ପ୍ରକାର",
        "principalLedger": "ମୂଳ ଲେଜର୍",
        "interestLedger": "ସୁଧ ଲେଜର୍",
        "provisionLedger": "ପ୍ରଭିଜନ୍ ଲେଜର୍",
        "fineLedger": "ଜୁରିମାନା ଲେଜର୍",
    },
    "placeholders": {
        **EN["placeholders"],
        "productType": "ଉତ୍ପାଦ ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchProductType": "ଉତ୍ପାଦ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "depositType": "ଜମା ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchDepositType": "ଜମା ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "productName": "ଉତ୍ପାଦ ନାମ ଲେଖନ୍ତୁ",
        "shortName": "ସଂକ୍ଷିପ୍ତ ନାମ ଲେଖନ୍ତୁ",
        "interestType": "ସୁଧ ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchInterestType": "ସୁଧ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "minAmount": "ସର୍ବନିମ୍ନ ରାଶି ଲେଖନ୍ତୁ",
        "maxAmount": "ସର୍ବାଧିକ ରାଶି ଲେଖନ୍ତୁ",
        "roi": "ROI ଲେଖନ୍ତୁ",
        "minDuration": "ସର୍ବନିମ୍ନ ଅବଧି ଲେଖନ୍ତୁ",
        "maxDuration": "ସର୍ବାଧିକ ଅବଧି ଲେଖନ୍ତୁ",
        "durationUnit": "ଅବଧି ଏକକ ବାଛନ୍ତୁ",
        "searchDurationUnit": "ଅବଧି ଏକକ ଖୋଜନ୍ତୁ...",
        "lockInDays": "ଲକ୍-ଇନ୍ ଦିନ ଲେଖନ୍ତୁ",
        "passbookFees": "ପାସବୁକ୍ ଫି ଲେଖନ୍ତୁ",
        "defaultFine": "ଡିଫଲ୍ଟ ଜୁରିମାନା ଲେଖନ୍ତୁ",
        "fineOn": "ଜୁରିମାନା ଉପରେ ଲେଖନ୍ତୁ",
        "inoperativeMonths": "ନିଷ୍କ୍ରିୟ ମାସ ଲେଖନ୍ତୁ",
        "dormantMonths": "ଡର୍ମାଣ୍ଟ ମାସ ଲେଖନ୍ତୁ",
        "memberType": "ସଦସ୍ୟ ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchMemberType": "ସଦସ୍ୟ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "principalLedger": "ମୂଳ ଲେଜର୍ ବାଛନ୍ତୁ",
        "interestLedger": "ସୁଧ ଲେଜର୍ ବାଛନ୍ତୁ",
        "provisionLedger": "ପ୍ରଭିଜନ୍ ଲେଜର୍ ବାଛନ୍ତୁ",
        "fineLedger": "ଜୁରିମାନା ଲେଜର୍ ବାଛନ୍ତୁ",
        "searchLedger": "ଲେଜର୍ ଖୋଜନ୍ତୁ...",
    },
    "table": {
        "productName": "ଉତ୍ପାଦ ନାମ",
        "shortName": "ସଂକ୍ଷିପ୍ତ ନାମ",
        "productType": "ଉତ୍ପାଦ ପ୍ରକାର",
        "depositType": "ଜମା ପ୍ରକାର",
        "interestType": "ସୁଧ ପ୍ରକାର",
        "minAmt": "ସର୍ବନିମ୍ନ",
        "maxAmt": "ସର୍ବାଧିକ",
        "roi": "ROI",
        "status": "ସ୍ଥିତି",
    },
}

LOCALES = {"en": EN, "hi": HI, "bn": BN, "or": OR_}


def to_js(obj, indent=6):
    pad = " " * indent
    if isinstance(obj, dict):
        items = list(obj.items())
        lines = ["{"]
        for i, (k, v) in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            if isinstance(v, dict):
                nested = to_js(v, indent + 2)
                lines.append(f"{pad}{k}: {nested}{comma}")
            else:
                esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
                lines.append(f'{pad}{k}: "{esc}"{comma}')
        lines.append(" " * (indent - 2) + "}")
        return "\n".join(lines)
    raise TypeError(type(obj))


def find_block_end(text, brace_idx):
    depth = 0
    i = brace_idx
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise SystemExit("unclosed")


def insert_locale(lang):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    if re.search(r"\n      depositProduct:\s*\{", text):
        # only under master — check near passbookSettings
        m_master = re.search(r"\n    master:\s*\{", text)
        if m_master:
            end = find_block_end(text, m_master.end() - 1)
            master = text[m_master.start() : end + 1]
            if re.search(r"\n      depositProduct:\s*\{", master):
                print(f"{lang}: master.depositProduct already present")
                return
    m = re.search(r"\n      passbookSettings:\s*\{", text)
    if not m:
        raise SystemExit(f"{lang}: no passbookSettings")
    end = find_block_end(text, m.end() - 1)
    j = end + 1
    if j < len(text) and text[j] == ",":
        j += 1
    block = (
        "\n      depositProduct: "
        + to_js(LOCALES[lang], indent=8)
        + ","
    )
    text = text[:j] + block + text[j:]
    path.write_text(text, encoding="utf-8")
    print(f"{lang}: inserted master.depositProduct")


def ensure_t_import(text):
    if "useTranslation" in text:
        return text
    if text.startswith('"use client"'):
        return text.replace(
            '"use client";\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    return 'import { useTranslation } from "react-i18next";\n' + text


def write_index():
    path = COMP / "index.jsx"
    text = path.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const depositProductList = useSelector(",
            "}) => {\n  const { t } = useTranslation();\n  const depositProductList = useSelector(",
        )
    repls = [
        ("Deposit Product\n          </h2>", '{t("master.depositProduct.title")}\n          </h2>'),
        (">\n            Add New\n          </Button>", '>\n            {t("master.depositProduct.addNew")}\n          </Button>'),
        (
            '{isEdit ? "Edit" : "Add"} Deposit Product',
            '{isEdit ? t("master.depositProduct.editTitle") : t("master.depositProduct.addTitle")}',
        ),
        (
            """{isEdit
                  ? "Update the selected deposit product details below."
                  : "Fill in the details to add a new deposit product."}""",
            """{isEdit
                  ? t("master.depositProduct.editDesc")
                  : t("master.depositProduct.addDesc")}""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS index: {old[:60]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK index: {old[:40]!r}")
    path.write_text(text, encoding="utf-8")


def write_form():
    path = COMP / "DepositProductForm.jsx"
    text = path.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const productTypeData = useSelector(",
            "}) => {\n  const { t } = useTranslation();\n  const productTypeData = useSelector(",
        )
    repls = [
        ('label="Product Type"', 'label={t("master.depositProduct.fields.productType")}'),
        ('placeholder="Select product type"', 'placeholder={t("master.depositProduct.placeholders.productType")}'),
        ('searchPlaceholder="Search product type..."', 'searchPlaceholder={t("master.depositProduct.placeholders.searchProductType")}'),
        ('label="Deposit Type"', 'label={t("master.depositProduct.fields.depositType")}'),
        ('placeholder="Select deposit type"', 'placeholder={t("master.depositProduct.placeholders.depositType")}'),
        ('searchPlaceholder="Search deposit type..."', 'searchPlaceholder={t("master.depositProduct.placeholders.searchDepositType")}'),
        ('label="Product Name"', 'label={t("master.depositProduct.fields.productName")}'),
        ('placeholder="Enter product name"', 'placeholder={t("master.depositProduct.placeholders.productName")}'),
        ('label="Short Name"', 'label={t("master.depositProduct.fields.shortName")}'),
        ('placeholder="Enter short name"', 'placeholder={t("master.depositProduct.placeholders.shortName")}'),
        ('label="Interest Type"', 'label={t("master.depositProduct.fields.interestType")}'),
        ('placeholder="Select interest type"', 'placeholder={t("master.depositProduct.placeholders.interestType")}'),
        ('searchPlaceholder="Search interest type..."', 'searchPlaceholder={t("master.depositProduct.placeholders.searchInterestType")}'),
        ('label="Minimum Amount"', 'label={t("master.depositProduct.fields.minAmount")}'),
        ('placeholder="Enter minimum amount"', 'placeholder={t("master.depositProduct.placeholders.minAmount")}'),
        ('label="Maximum Amount"', 'label={t("master.depositProduct.fields.maxAmount")}'),
        ('placeholder="Enter maximum amount"', 'placeholder={t("master.depositProduct.placeholders.maxAmount")}'),
        ('label="Rate of Interest"', 'label={t("master.depositProduct.fields.roi")}'),
        ('placeholder="Enter ROI"', 'placeholder={t("master.depositProduct.placeholders.roi")}'),
        ('label="Minimum Duration"', 'label={t("master.depositProduct.fields.minDuration")}'),
        ('placeholder="Enter minimum duration"', 'placeholder={t("master.depositProduct.placeholders.minDuration")}'),
        ('label="Maximum Duration"', 'label={t("master.depositProduct.fields.maxDuration")}'),
        ('placeholder="Enter maximum duration"', 'placeholder={t("master.depositProduct.placeholders.maxDuration")}'),
        ('label="Duration Unit"', 'label={t("master.depositProduct.fields.durationUnit")}'),
        ('placeholder="Select duration unit"', 'placeholder={t("master.depositProduct.placeholders.durationUnit")}'),
        ('searchPlaceholder="Search duration unit..."', 'searchPlaceholder={t("master.depositProduct.placeholders.searchDurationUnit")}'),
        ('label="Lock-in Days"', 'label={t("master.depositProduct.fields.lockInDays")}'),
        ('placeholder="Enter lock-in days"', 'placeholder={t("master.depositProduct.placeholders.lockInDays")}'),
        ('label="Passbook Fees"', 'label={t("master.depositProduct.fields.passbookFees")}'),
        ('placeholder="Enter passbook fees"', 'placeholder={t("master.depositProduct.placeholders.passbookFees")}'),
        ('label="Default Fine"', 'label={t("master.depositProduct.fields.defaultFine")}'),
        ('placeholder="Enter default fine"', 'placeholder={t("master.depositProduct.placeholders.defaultFine")}'),
        ('label="Fine On"', 'label={t("master.depositProduct.fields.fineOn")}'),
        ('placeholder="Enter fine on"', 'placeholder={t("master.depositProduct.placeholders.fineOn")}'),
        ('label="Inoperative Months"', 'label={t("master.depositProduct.fields.inoperativeMonths")}'),
        ('placeholder="Enter inoperative months"', 'placeholder={t("master.depositProduct.placeholders.inoperativeMonths")}'),
        ('label="Dormant Months"', 'label={t("master.depositProduct.fields.dormantMonths")}'),
        ('placeholder="Enter dormant months"', 'placeholder={t("master.depositProduct.placeholders.dormantMonths")}'),
        ('label="Member Type"', 'label={t("master.depositProduct.fields.memberType")}'),
        ('placeholder="Select member type"', 'placeholder={t("master.depositProduct.placeholders.memberType")}'),
        ('searchPlaceholder="Search member type..."', 'searchPlaceholder={t("master.depositProduct.placeholders.searchMemberType")}'),
        ('label="Principal Ledger"', 'label={t("master.depositProduct.fields.principalLedger")}'),
        ('placeholder="Select principal ledger"', 'placeholder={t("master.depositProduct.placeholders.principalLedger")}'),
        ('label="Interest Ledger"', 'label={t("master.depositProduct.fields.interestLedger")}'),
        ('placeholder="Select interest ledger"', 'placeholder={t("master.depositProduct.placeholders.interestLedger")}'),
        ('label="Provision Ledger"', 'label={t("master.depositProduct.fields.provisionLedger")}'),
        ('placeholder="Select provision ledger"', 'placeholder={t("master.depositProduct.placeholders.provisionLedger")}'),
        ('label="Fine Ledger"', 'label={t("master.depositProduct.fields.fineLedger")}'),
        ('placeholder="Select fine ledger"', 'placeholder={t("master.depositProduct.placeholders.fineLedger")}'),
        ('searchPlaceholder="Search ledger..."', 'searchPlaceholder={t("master.depositProduct.placeholders.searchLedger")}'),
        (">\n            Cancel\n          </Button>", '>\n            {t("common.buttons.cancel")}\n          </Button>'),
        (
            """) : isEdit ? (
              "Update"
            ) : (
              "Add"
            )}""",
            """) : isEdit ? (
              t("common.buttons.update")
            ) : (
              t("common.buttons.add")
            )}""",
        ),
    ]
    for old, new in repls:
        count = text.count(old)
        if count == 0:
            print(f"  MISS form: {old[:60]!r}")
        else:
            text = text.replace(old, new)
            print(f"  OK form x{count}: {old[:40]!r}")
    path.write_text(text, encoding="utf-8")


def write_table():
    path = COMP / "DepositProductTable.jsx"
    text = path.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const [sorting, setSorting] = useState([]);",
            "}) => {\n  const { t } = useTranslation();\n  const [sorting, setSorting] = useState([]);",
        )
    repls = [
        ('<div className="text-left">Serial No</div>', '<div className="text-left">{t("common.serialNo")}</div>'),
        (">\n          Product Name\n          <ArrowUpDown", '>\n          {t("master.depositProduct.table.productName")}\n          <ArrowUpDown'),
        ('<div className="text-left">Short Name</div>', '<div className="text-left">{t("master.depositProduct.table.shortName")}</div>'),
        ('<div className="text-left">Product Type</div>', '<div className="text-left">{t("master.depositProduct.table.productType")}</div>'),
        ('<div className="text-left">Deposit Type</div>', '<div className="text-left">{t("master.depositProduct.table.depositType")}</div>'),
        ('<div className="text-left">Interest Type</div>', '<div className="text-left">{t("master.depositProduct.table.interestType")}</div>'),
        ('<div className="text-left">Min Amt</div>', '<div className="text-left">{t("master.depositProduct.table.minAmt")}</div>'),
        ('<div className="text-left">Max Amt</div>', '<div className="text-left">{t("master.depositProduct.table.maxAmt")}</div>'),
        ('<div className="text-left">ROI</div>', '<div className="text-left">{t("master.depositProduct.table.roi")}</div>'),
        ('<div className="text-left">Status</div>', '<div className="text-left">{t("master.depositProduct.table.status")}</div>'),
        ('<div className="text-center">Actions</div>', '<div className="text-center">{t("common.action")}</div>'),
        (">\n            Edit\n            <FaRegEdit", '>\n            {t("common.buttons.edit")}\n            <FaRegEdit'),
        ("No results.", '{t("forms.noResults")}'),
        (">\n                  Previous\n                </Button>", '>\n                  {t("forms.previous")}\n                </Button>'),
        (">\n                  Next\n                </Button>", '>\n                  {t("forms.next")}\n                </Button>'),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS table: {old[:60]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK table: {old[:40]!r}")
    path.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_locale(lang)
    print("--- wire ---")
    write_index()
    write_form()
    write_table()
    print("done")
