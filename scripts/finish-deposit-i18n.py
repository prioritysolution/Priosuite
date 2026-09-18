# -*- coding: utf-8 -*-
"""Finish deposit static i18n: fix stringified t(), missing keys, leftover labels."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DEP = ROOT / "components" / "deposit"
LOC = ROOT / "i18n" / "locales"


def unstringify(text: str) -> str:
    text = re.sub(
        r'(placeholder|searchPlaceholder|formLabel|title|aria-label)="\{t\("([^"]+)"\)\}([^"]*)"',
        lambda m: f'{m.group(1)}={{t("{m.group(2)}")}}'
        if not m.group(3)
        else f'{m.group(1)}={{t("{m.group(2)}") + "{m.group(3)}"}}',
        text,
    )
    text = re.sub(
        r'console\.log\(\s*"\{t\("([^"]+)"\)\}([^"]*)"',
        r'console.log(t("\1") + "\2"',
        text,
    )
    return text


def insert_keys_into_object(text: str, deposit_start: int, obj_name: str, keys: dict) -> str:
    """Insert missing keys before closing `},` of deposit.<obj_name>."""
    di = deposit_start
    # find next sibling after deposit by locating fields/placeholders etc.
    obj_start = text.find(f"{obj_name}: {{", di)
    if obj_start < 0 or obj_start > di + 80000:
        return text
    # next top-level key after this object — sections/buttons/changeAccountStatus etc.
    # Find matching close of this object by scanning braces from obj_start
    i = text.find("{", obj_start)
    depth = 0
    end = None
    for j in range(i, len(text)):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                end = j
                break
    if end is None:
        return text
    chunk = text[obj_start:end]
    missing = {k: v for k, v in keys.items() if f"{k}:" not in chunk}
    if not missing:
        return text
    insert = "".join(f',\n      {k}: {json.dumps(v, ensure_ascii=False)}' for k, v in missing.items())
    # insert before final }
    return text[:end] + insert + "\n    " + text[end:]


EXTRA_FIELDS = {
    "en": {
        "aadhaarNo": "Aadhaar No.",
        "voterId": "Voter ID",
        "ledgerFolio": "Ledger Folio",
        "nomineeName": "Nominee Name",
        "nomineeAddress": "Nominee Address",
        "accountType": "Account Type",
        "agent": "Agent",
        "openingDate": "Opening Date",
        "payoutMode": "Payout Mode",
        "maturityInstruction": "Maturity Instruction",
        "relation": "Relation",
        "relationName": "Relation Name",
        "ecsAccount": "ECS Account",
        "custNo": "Cust No",
        "fullName": "Full Name",
        "serialNo": "Serial No",
        "memberNoShort": "Member No",
        "cifNoShort": "CIF No",
    },
    "hi": {
        "aadhaarNo": "आधार संख्या",
        "voterId": "मतदाता पहचान पत्र",
        "ledgerFolio": "लेजर फोलियो",
        "nomineeName": "नामांकित व्यक्ति का नाम",
        "nomineeAddress": "नामांकित व्यक्ति का पता",
        "accountType": "खाता प्रकार",
        "agent": "एजेंट",
        "openingDate": "खाता खोलने की तिथि",
        "payoutMode": "भुगतान मोड",
        "maturityInstruction": "परिपक्वता निर्देश",
        "relation": "संबंध",
        "relationName": "संबंध का नाम",
        "ecsAccount": "ECS खाता",
        "custNo": "ग्राहक संख्या",
        "fullName": "पूरा नाम",
        "serialNo": "क्रम संख्या",
        "memberNoShort": "सदस्य संख्या",
        "cifNoShort": "CIF संख्या",
    },
    "bn": {
        "aadhaarNo": "আধার নম্বর",
        "voterId": "ভোটার আইডি",
        "ledgerFolio": "লেজার ফোলিও",
        "nomineeName": "নমিনির নাম",
        "nomineeAddress": "নমিনির ঠিকানা",
        "accountType": "অ্যাকাউন্টের ধরন",
        "agent": "এজেন্ট",
        "openingDate": "খোলার তারিখ",
        "payoutMode": "পেআউট মোড",
        "maturityInstruction": "মেয়াদোত্তীর্ণ নির্দেশ",
        "relation": "সম্পর্ক",
        "relationName": "সম্পর্কের নাম",
        "ecsAccount": "ECS অ্যাকাউন্ট",
        "custNo": "কাস্ট নম্বর",
        "fullName": "পূর্ণ নাম",
        "serialNo": "ক্রমিক নং",
        "memberNoShort": "সদস্য নম্বর",
        "cifNoShort": "CIF নম্বর",
    },
    "or": {
        "aadhaarNo": "ଆଧାର ନମ୍ବର",
        "voterId": "ଭୋଟର୍ ଆଇଡି",
        "ledgerFolio": "ଲେଜର ଫୋଲିଓ",
        "nomineeName": "ନମିନି ନାମ",
        "nomineeAddress": "ନମିନି ଠିକଣା",
        "accountType": "ଖାତା ପ୍ରକାର",
        "agent": "ଏଜେଣ୍ଟ",
        "openingDate": "ଖୋଲିବା ତାରିଖ",
        "payoutMode": "ପେଆଉଟ ମୋଡ୍",
        "maturityInstruction": "ପରିପକ୍ୱତା ନିର୍ଦ୍ଦେଶ",
        "relation": "ସମ୍ପର୍କ",
        "relationName": "ସମ୍ପର୍କ ନାମ",
        "ecsAccount": "ECS ଖାତା",
        "custNo": "କଷ୍ଟ ନମ୍ବର",
        "fullName": "ପୂର୍ଣ୍ଣ ନାମ",
        "serialNo": "କ୍ରମିକ ନମ୍ବର",
        "memberNoShort": "ସଦସ୍ୟ ନମ୍ବର",
        "cifNoShort": "CIF ନମ୍ବର",
    },
}

EXTRA_PH = {
    "en": {
        "aadhaarNo": "Enter aadhaar no.",
        "voterId": "Enter voter id",
        "ledgerFolio": "Enter ledger folio",
        "nomineeName": "Enter nominee name",
        "nomineeAddress": "Enter nominee address",
        "address": "Enter address",
        "selectAccountType": "Select account type",
        "searchAccountType": "Search account type...",
        "selectAgent": "Select agent",
        "searchAgent": "Search agent...",
        "selectMaturityInstruction": "Select maturity instruction",
        "searchMaturityInstruction": "Search maturity instruction...",
        "selectOperationMode": "Select operation mode",
        "searchOperationMode": "Search operation mode...",
        "selectPayoutMode": "Select payout mode",
        "searchPayoutMode": "Search payout mode...",
        "selectRelation": "Select relation",
        "searchRelation": "Search relation...",
        "joint1": "Enter joint 1",
        "joint2": "Enter joint 2",
        "searchByMemberNo": "Search by enter member no.",
        "searchByName": "Search by enter name",
        "age": "Age",
        "percentage": "percentage",
        "asOn": "As on",
    },
    "hi": {
        "aadhaarNo": "आधार संख्या दर्ज करें",
        "voterId": "मतदाता पहचान दर्ज करें",
        "ledgerFolio": "लेजर फोलियो दर्ज करें",
        "nomineeName": "नामांकित व्यक्ति का नाम दर्ज करें",
        "nomineeAddress": "नामांकित व्यक्ति का पता दर्ज करें",
        "address": "पता दर्ज करें",
        "selectAccountType": "खाता प्रकार चुनें",
        "searchAccountType": "खाता प्रकार खोजें...",
        "selectAgent": "एजेंट चुनें",
        "searchAgent": "एजेंट खोजें...",
        "selectMaturityInstruction": "परिपक्वता निर्देश चुनें",
        "searchMaturityInstruction": "परिपक्वता निर्देश खोजें...",
        "selectOperationMode": "संचालन मोड चुनें",
        "searchOperationMode": "संचालन मोड खोजें...",
        "selectPayoutMode": "भुगतान मोड चुनें",
        "searchPayoutMode": "भुगतान मोड खोजें...",
        "selectRelation": "संबंध चुनें",
        "searchRelation": "संबंध खोजें...",
        "joint1": "संयुक्त 1 दर्ज करें",
        "joint2": "संयुक्त 2 दर्ज करें",
        "searchByMemberNo": "सदस्य संख्या दर्ज कर खोजें",
        "searchByName": "नाम दर्ज कर खोजें",
        "age": "आयु",
        "percentage": "प्रतिशत",
        "asOn": "तिथि तक",
    },
    "bn": {
        "aadhaarNo": "আধার নম্বর লিখুন",
        "voterId": "ভোটার আইডি লিখুন",
        "ledgerFolio": "লেজার ফোলিও লিখুন",
        "nomineeName": "নমিনির নাম লিখুন",
        "nomineeAddress": "নমিনির ঠিকানা লিখুন",
        "address": "ঠিকানা লিখুন",
        "selectAccountType": "অ্যাকাউন্টের ধরন নির্বাচন করুন",
        "searchAccountType": "অ্যাকাউন্টের ধরন খুঁজুন...",
        "selectAgent": "এজেন্ট নির্বাচন করুন",
        "searchAgent": "এজেন্ট খুঁজুন...",
        "selectMaturityInstruction": "মেয়াদোত্তীর্ণ নির্দেশ নির্বাচন করুন",
        "searchMaturityInstruction": "মেয়াদোত্তীর্ণ নির্দেশ খুঁজুন...",
        "selectOperationMode": "অপারেশন মোড নির্বাচন করুন",
        "searchOperationMode": "অপারেশন মোড খুঁজুন...",
        "selectPayoutMode": "পেআউট মোড নির্বাচন করুন",
        "searchPayoutMode": "পেআউট মোড খুঁজুন...",
        "selectRelation": "সম্পর্ক নির্বাচন করুন",
        "searchRelation": "সম্পর্ক খুঁজুন...",
        "joint1": "জয়েন্ট ১ লিখুন",
        "joint2": "জয়েন্ট ২ লিখুন",
        "searchByMemberNo": "সদস্য নম্বর দিয়ে খুঁজুন",
        "searchByName": "নাম দিয়ে খুঁজুন",
        "age": "বয়স",
        "percentage": "শতাংশ",
        "asOn": "তারিখ পর্যন্ত",
    },
    "or": {
        "aadhaarNo": "ଆଧାର ନମ୍ବର ଲେଖନ୍ତୁ",
        "voterId": "ଭୋଟର୍ ଆଇଡି ଲେଖନ୍ତୁ",
        "ledgerFolio": "ଲେଜର ଫୋଲିଓ ଲେଖନ୍ତୁ",
        "nomineeName": "ନମିନି ନାମ ଲେଖନ୍ତୁ",
        "nomineeAddress": "ନମିନି ଠିକଣା ଲେଖନ୍ତୁ",
        "address": "ଠିକଣା ଲେଖନ୍ତୁ",
        "selectAccountType": "ଖାତା ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchAccountType": "ଖାତା ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "selectAgent": "ଏଜେଣ୍ଟ ବାଛନ୍ତୁ",
        "searchAgent": "ଏଜେଣ୍ଟ ଖୋଜନ୍ତୁ...",
        "selectMaturityInstruction": "ପରିପକ୍ୱତା ନିର୍ଦ୍ଦେଶ ବାଛନ୍ତୁ",
        "searchMaturityInstruction": "ପରିପକ୍ୱତା ନିର୍ଦ୍ଦେଶ ଖୋଜନ୍ତୁ...",
        "selectOperationMode": "ଅପରେସନ୍ ମୋଡ୍ ବାଛନ୍ତୁ",
        "searchOperationMode": "ଅପରେସନ୍ ମୋଡ୍ ଖୋଜନ୍ତୁ...",
        "selectPayoutMode": "ପେଆଉଟ ମୋଡ୍ ବାଛନ୍ତୁ",
        "searchPayoutMode": "ପେଆଉଟ ମୋଡ୍ ଖୋଜନ୍ତୁ...",
        "selectRelation": "ସମ୍ପର୍କ ବାଛନ୍ତୁ",
        "searchRelation": "ସମ୍ପର୍କ ଖୋଜନ୍ତୁ...",
        "joint1": "ଜଏଣ୍ଟ ୧ ଲେଖନ୍ତୁ",
        "joint2": "ଜଏଣ୍ଟ ୨ ଲେଖନ୍ତୁ",
        "searchByMemberNo": "ସଦସ୍ୟ ନମ୍ବର ଦ୍ୱାରା ଖୋଜନ୍ତୁ",
        "searchByName": "ନାମ ଦ୍ୱାରା ଖୋଜନ୍ତୁ",
        "age": "ବୟସ",
        "percentage": "ଶତକଡ଼ା",
        "asOn": "ତାରିଖ ପର୍ଯ୍ୟନ୍ତ",
    },
}

EXTRA_COMMON = {
    "en": {
        "selectTransanctionMode": "Select transanction mode",
        "searchAccount": "Search Account",
        "totalCharges": "Total Charges",
        "calculatedChargeRecords": "Calculated Charge Records",
        "calculatedInterestRecords": "Calculated Interest Records",
        "custNo": "Cust No",
        "fullName": "Full Name",
        "serialNo": "Serial No",
        "memberNoShort": "Member No",
        "cifNoShort": "CIF No",
    },
    "hi": {
        "selectTransanctionMode": "लेनदेन मोड चुनें",
        "searchAccount": "खाता खोजें",
        "totalCharges": "कुल शुल्क",
        "calculatedChargeRecords": "गणना किए गए शुल्क रिकॉर्ड",
        "calculatedInterestRecords": "गणना किए गए ब्याज रिकॉर्ड",
        "custNo": "ग्राहक संख्या",
        "fullName": "पूरा नाम",
        "serialNo": "क्रम संख्या",
        "memberNoShort": "सदस्य संख्या",
        "cifNoShort": "CIF संख्या",
    },
    "bn": {
        "selectTransanctionMode": "লেনদেন মোড নির্বাচন করুন",
        "searchAccount": "অ্যাকাউন্ট খুঁজুন",
        "totalCharges": "মোট চার্জ",
        "calculatedChargeRecords": "গণনাকৃত চার্জ রেকর্ড",
        "calculatedInterestRecords": "গণনাকৃত সুদের রেকর্ড",
        "custNo": "কাস্ট নম্বর",
        "fullName": "পূর্ণ নাম",
        "serialNo": "ক্রমিক নং",
        "memberNoShort": "সদস্য নম্বর",
        "cifNoShort": "CIF নম্বর",
    },
    "or": {
        "selectTransanctionMode": "ଟ୍ରାଞ୍ଜାକ୍ସନ୍ ମୋଡ୍ ବାଛନ୍ତୁ",
        "searchAccount": "ଖାତା ଖୋଜନ୍ତୁ",
        "totalCharges": "ମୋଟ ଚାର୍ଜ",
        "calculatedChargeRecords": "ଗଣନା ହୋଇଥିବା ଚାର୍ଜ ରେକର୍ଡ",
        "calculatedInterestRecords": "ଗଣନା ହୋଇଥିବା ସୁଧ ରେକର୍ଡ",
        "custNo": "କଷ୍ଟ ନମ୍ବର",
        "fullName": "ପୂର୍ଣ୍ଣ ନାମ",
        "serialNo": "କ୍ରମିକ ନମ୍ବର",
        "memberNoShort": "ସଦସ୍ୟ ନମ୍ବର",
        "cifNoShort": "CIF ନମ୍ବର",
    },
}

MONTHS = {
    "en": {
        "january": "January",
        "february": "February",
        "march": "March",
        "april": "April",
        "may": "May",
        "june": "June",
        "july": "July",
        "august": "August",
        "september": "September",
        "october": "October",
        "november": "November",
        "december": "December",
    },
    "hi": {
        "january": "जनवरी",
        "february": "फरवरी",
        "march": "मार्च",
        "april": "अप्रैल",
        "may": "मई",
        "june": "जून",
        "july": "जुलाई",
        "august": "अगस्त",
        "september": "सितंबर",
        "october": "अक्टूबर",
        "november": "नवंबर",
        "december": "दिसंबर",
    },
    "bn": {
        "january": "জানুয়ারি",
        "february": "ফেব্রুয়ারি",
        "march": "মার্চ",
        "april": "এপ্রিল",
        "may": "মে",
        "june": "জুন",
        "july": "জুলাই",
        "august": "আগস্ট",
        "september": "সেপ্টেম্বর",
        "october": "অক্টোবর",
        "november": "নভেম্বর",
        "december": "ডিসেম্বর",
    },
    "or": {
        "january": "ଜାନୁଆରୀ",
        "february": "ଫେବୃଆରୀ",
        "march": "ମାର୍ଚ୍ଚ",
        "april": "ଏପ୍ରିଲ୍",
        "may": "ମେ",
        "june": "ଜୁନ୍",
        "july": "ଜୁଲାଇ",
        "august": "ଅଗଷ୍ଟ",
        "september": "ସେପ୍ଟେମ୍ବର",
        "october": "ଅକ୍ଟୋବର",
        "november": "ନଭେମ୍ବର",
        "december": "ଡିସେମ୍ବର",
    },
}


def patch_locales():
    for lang in ("en", "hi", "bn", "or"):
        path = LOC / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        # find deposit block: "    deposit: {" near end (last occurrence preferred)
        di = text.rfind("\n    deposit: {")
        if di < 0:
            di = text.rfind("deposit: {")
        text = insert_keys_into_object(text, di, "fields", EXTRA_FIELDS[lang])
        text = insert_keys_into_object(text, di, "placeholders", EXTRA_PH[lang])
        text = insert_keys_into_object(text, di, "common", EXTRA_COMMON[lang])

        # add months object if missing
        di = text.rfind("\n    deposit: {")
        if "months: {" not in text[di:di + 20000]:
            months_block = "\n    months: {\n" + ",\n".join(
                f'      {k}: {json.dumps(v, ensure_ascii=False)}'
                for k, v in MONTHS[lang].items()
            ) + "\n    },"
            # insert before fieldsExtra or before closing of deposit
            marker = "    fieldsExtra:"
            pos = text.find(marker, di)
            if pos < 0:
                # before final deposit close — find memberSearch or end
                pos = text.find("\n  },\n\n    memberSearch:", di)
                if pos > 0:
                    text = text[:pos] + "," + months_block + text[pos:]
                else:
                    # insert before last `  },` of deposit
                    close = text.find("\n  },", di + 10)
                    text = text[:close] + "," + months_block + text[close:]
            else:
                text = text[:pos] + months_block + "\n" + text[pos:]
        path.write_text(text, encoding="utf-8")
        print("locale", lang)


def patch_components():
    # unstringify all
    for path in DEP.rglob("*.jsx"):
        text = path.read_text(encoding="utf-8")
        new = unstringify(text)
        if new != text:
            path.write_text(new, encoding="utf-8")
            print("unstringify", path.relative_to(DEP))

    # charge deduction
    p = DEP / "chargeDeduction" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace('label="Select Product Type"', 'label={t("deposit.placeholders.selectProductType")}')
    t = t.replace('placeholder="As on"', 'placeholder={t("deposit.placeholders.asOn")}')
    p.write_text(t, encoding="utf-8")

    p = DEP / "chargeDeduction" / "ChargeDeductionTable.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace(
        """  const COLS = [
    { label: "#", key: null },
    { label: "Account No.", key: "Account_No" },
    { label: "Member Name", key: "Full_Name" },
    { label: "Balance", key: "balance" },
    { label: "Charge Amount", key: "Charge_Amt", right: true },
    { label: "Action", key: null },
  ];""",
        """  const COLS = [
    { label: "#", key: null },
    { label: t("deposit.fields.accountNo"), key: "Account_No" },
    { label: t("deposit.fields.memberName"), key: "Full_Name" },
    { label: t("deposit.common.balance"), key: "balance" },
    { label: t("deposit.fields.chargeAmount"), key: "Charge_Amt", right: true },
    { label: t("deposit.common.action"), key: null },
  ];""",
    )
    t = t.replace(">Total Charges<", '>{t("deposit.common.totalCharges")}<')
    t = t.replace(
        "Calculated Charge Records",
        '{t("deposit.common.calculatedChargeRecords")}',
    )
    # fix if already wrapped wrong
    t = t.replace(
        '>{t("deposit.common.calculatedChargeRecords")}',
        '{t("deposit.common.calculatedChargeRecords")}',
    )
    # if it was plain text in JSX, ensure braces
    t = re.sub(
        r'(>\s*)\{t\("deposit\.common\.calculatedChargeRecords"\)\}(\s*<)',
        r'\1{t("deposit.common.calculatedChargeRecords")}\2',
        t,
    )
    # heading without braces if still plain
    if 'Calculated Charge Records' in t:
        t = t.replace(
            "Calculated Charge Records",
            '{t("deposit.common.calculatedChargeRecords")}',
        )
    p.write_text(t, encoding="utf-8")

    # interest calc table
    p = DEP / "sevingsInterestCalculate" / "InterestCalculationTable.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace(
        """  const COLS = [
    { label: "#", key: null },
    { label: "Account No.", key: "Account_No" },
    { label: "Ref. Account No.", key: "Ref_Ac_No" },
    { label: "Member Name", key: "Full_Name" },
    { label: "Current Balance", key: "Curr_Balance", right: true },
    { label: "Interest Amount", key: "interest_amount", right: true },
    { label: "Total", key: "total", right: true },
  ];""",
        """  const COLS = [
    { label: "#", key: null },
    { label: t("deposit.fields.accountNo"), key: "Account_No" },
    { label: t("deposit.fields.refAccountNo"), key: "Ref_Ac_No" },
    { label: t("deposit.fields.memberName"), key: "Full_Name" },
    { label: t("deposit.fields.availableBalance"), key: "Curr_Balance", right: true },
    { label: t("deposit.fields.interestAmount"), key: "interest_amount", right: true },
    { label: t("deposit.fields.total"), key: "total", right: true },
  ];""",
    )
    t = t.replace(
        "Calculated Interest Records",
        '{t("deposit.common.calculatedInterestRecords")}',
    )
    p.write_text(t, encoding="utf-8")

    # interest payout
    p = DEP / "interestPayout" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace(
        """  const monthList = [
    { Id: "1", label: "January" },
    { Id: "2", label: "February" },
    { Id: "3", label: "March" },
    { Id: "4", label: "April" },
    { Id: "5", label: "May" },
    { Id: "6", label: "June" },
    { Id: "7", label: "July" },
    { Id: "8", label: "August" },
    { Id: "9", label: "September" },
    { Id: "10", label: "October" },
    { Id: "11", label: "November" },
    { Id: "12", label: "December" },
  ];""",
        """  const monthList = [
    { Id: "1", label: t("deposit.months.january") },
    { Id: "2", label: t("deposit.months.february") },
    { Id: "3", label: t("deposit.months.march") },
    { Id: "4", label: t("deposit.months.april") },
    { Id: "5", label: t("deposit.months.may") },
    { Id: "6", label: t("deposit.months.june") },
    { Id: "7", label: t("deposit.months.july") },
    { Id: "8", label: t("deposit.months.august") },
    { Id: "9", label: t("deposit.months.september") },
    { Id: "10", label: t("deposit.months.october") },
    { Id: "11", label: t("deposit.months.november") },
    { Id: "12", label: t("deposit.months.december") },
  ];""",
    )
    reps = [
        ("<FormLabel>Select payout on</FormLabel>", '<FormLabel>{t("deposit.interestPayout.selectPayoutOn")}</FormLabel>'),
        ("<FormLabel>Select posting type</FormLabel>", '<FormLabel>{t("deposit.interestPayout.selectPostingType")}</FormLabel>'),
        ('<TableHead className="w-[100px]">Serial No.</TableHead>', '<TableHead className="w-[100px]">{t("deposit.interestPayout.serialNo")}</TableHead>'),
        ("<TableHead>Name</TableHead>", '<TableHead>{t("deposit.interestPayout.name")}</TableHead>'),
        ("<TableHead>Account No.</TableHead>", '<TableHead>{t("deposit.fields.accountNo")}</TableHead>'),
        ("<TableHead>Date</TableHead>", '<TableHead>{t("deposit.interestPayout.date")}</TableHead>'),
        ("<TableHead>Amount</TableHead>", '<TableHead>{t("deposit.fields.amount")}</TableHead>'),
        ("<TableCell colSpan={4}>Total</TableCell>", '<TableCell colSpan={4}>{t("deposit.interestPayout.total")}</TableCell>'),
        ("<FormLabel>Select transanction mode</FormLabel>", '<FormLabel>{t("deposit.common.selectTransanctionMode")}</FormLabel>'),
    ]
    for a, b in reps:
        t = t.replace(a, b)
    p.write_text(t, encoding="utf-8")

    # mature
    p = DEP / "mature" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    for a, b in [
        ("<FormLabel>Operation Type</FormLabel>", '<FormLabel>{t("deposit.mature.operationType")}</FormLabel>'),
        ('<FormLabel className="font-normal">Close</FormLabel>', '<FormLabel className="font-normal">{t("deposit.mature.close")}</FormLabel>'),
        ("<FormLabel>Select transanction mode</FormLabel>", '<FormLabel>{t("deposit.common.selectTransanctionMode")}</FormLabel>'),
        ("<FormLabel>Account Type</FormLabel>", '<FormLabel>{t("deposit.fields.accountType")}</FormLabel>'),
        ("<FormLabel>Account No.</FormLabel>", '<FormLabel>{t("deposit.fields.accountNo")}</FormLabel>'),
        ("<DialogTitle>Search Account</DialogTitle>", '<DialogTitle>{t("deposit.common.searchAccount")}</DialogTitle>'),
        ('placeholder="Search by enter member no."', 'placeholder={t("deposit.placeholders.searchByMemberNo")}'),
        ("<FormLabel>Name</FormLabel>", '<FormLabel>{t("deposit.common.name")}</FormLabel>'),
        ('placeholder="Search by enter name"', 'placeholder={t("deposit.placeholders.searchByName")}'),
    ]:
        t = t.replace(a, b)
    p.write_text(t, encoding="utf-8")

    # renewal
    p = DEP / "renewal" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace('formLabel="Renewal"', 'formLabel={t("deposit.renewal.title")}')
    t = t.replace("<FormLabel>Select renewal type</FormLabel>", '<FormLabel>{t("deposit.renewal.selectRenewalType")}</FormLabel>')
    t = t.replace("<FormLabel>Select transanction mode</FormLabel>", '<FormLabel>{t("deposit.common.selectTransanctionMode")}</FormLabel>')
    p.write_text(t, encoding="utf-8")

    # withdrawn
    p = DEP / "withdrawn" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace('formLabel="Withdrawn"', 'formLabel={t("deposit.withdrawn.title")}')
    p.write_text(t, encoding="utf-8")

    # openDepositAccount
    p = DEP / "openDepositAccount" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace(
        """  const RadioData = [
    { label: "Individual Customer", value: "1" },
    { label: "Group", value: "2" },
    { label: "Institution", value: "3" },
    { label: "Staff", value: "4" },
  ];""",
        """  const RadioData = [
    { label: t("memberSearch.individualCustomer"), value: "1" },
    { label: t("memberSearch.group"), value: "2" },
    { label: t("memberSearch.institution"), value: "3" },
    { label: t("memberSearch.staff"), value: "4" },
  ];""",
    )
    for a, b in [
        ("<FormLabel>Member Name</FormLabel>", '<FormLabel>{t("deposit.fields.memberName")}</FormLabel>'),
        ('placeholder="Search by enter member name"', 'placeholder={t("memberSearch.searchByMemberName")}'),
        ('placeholder="Age"', 'placeholder={t("deposit.placeholders.age")}'),
        ('placeholder="percentage"', 'placeholder={t("deposit.placeholders.percentage")}'),
        ("Select transanction mode{", '{t("deposit.common.selectTransanctionMode")}{'),
        ("Cust No", '{t("deposit.common.custNo")}'),
        ("Full Name", '{t("deposit.common.fullName")}'),
        ("Serial No", '{t("deposit.common.serialNo")}'),
        ("Member No\n", '{t("deposit.common.memberNoShort")}\n'),
        (">CIF No<", '>{t("deposit.common.cifNoShort")}<'),
        ("CIF No\n", '{t("deposit.common.cifNoShort")}\n'),
        (">Relation<", '>{t("deposit.fields.relation")}<'),
        (">Action<", '>{t("deposit.common.action")}<'),
        (">Name<", '>{t("deposit.common.name")}<'),
        (">Age<", '>{t("deposit.common.age")}<'),
        (">Percentage<", '>{t("deposit.common.percentage")}<'),
        (">Relation Name<", '>{t("deposit.fields.relationName")}<'),
    ]:
        t = t.replace(a, b)
    # fix TableHead multiline CIF No if still plain
    t = re.sub(
        r'(<TableHead[^>]*>)\s*CIF No\s*(</TableHead>)',
        r'\1{t("deposit.common.cifNoShort")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Relation\s*(</TableHead>)',
        r'\1{t("deposit.fields.relation")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Action\s*(</TableHead>)',
        r'\1{t("deposit.common.action")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Name\s*(</TableHead>)',
        r'\1{t("deposit.common.name")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Age\s*(</TableHead>)',
        r'\1{t("deposit.common.age")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Percentage\s*(</TableHead>)',
        r'\1{t("deposit.common.percentage")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Relation Name\s*(</TableHead>)',
        r'\1{t("deposit.fields.relationName")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Member No\s*(</TableHead>)',
        r'\1{t("deposit.common.memberNoShort")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Serial No\s*(</TableHead>)',
        r'\1{t("deposit.common.serialNo")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Full Name\s*(</TableHead>)',
        r'\1{t("deposit.common.fullName")}\2',
        t,
    )
    t = re.sub(
        r'(<TableHead[^>]*>)\s*Cust No\s*(</TableHead>)',
        r'\1{t("deposit.common.custNo")}\2',
        t,
    )
    p.write_text(t, encoding="utf-8")
    print("components patched")


def main():
    patch_locales()
    patch_components()
    print("done")


if __name__ == "__main__":
    main()
