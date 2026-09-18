# -*- coding: utf-8 -*-
"""Remove loan extras wrongly inserted into membership.reports; ensure loan has them."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"
COMP = Path(__file__).resolve().parents[1] / "components" / "loan"

BAD_KEYS = [
    "noRecordsAddedYet",
    "accountStatementFrom",
    "loanTypeGuaranter",
    "receivedMode",
    "receivedBy",
    "printedOn",
    "eAndOe",
    "addDot",
    "acNo",
    "disbDateDot",
    "totalRs",
    "rupees",
    "only",
    "schemeNameDash",
    "memberNameColon",
    "guardianNameColon",
    "addressColon",
    "accountNoColon",
    "refAcNoColon",
    "ledgerFolioColon",
    "disbDateColon",
    "roiColon",
    "disbAmountColon",
    "repayWithinColon",
    "repayModeColon",
    "productNameColon",
]

EXTRAS = {
    "en": {
        "noRecordsAddedYet": "No records added yet.",
        "accountStatementFrom": "Account Statement From",
        "loanTypeGuaranter": "Loan Type - Guaranter",
        "receivedMode": "Received Mode :",
        "receivedBy": "Received By :",
        "printedOn": "Printed On :",
        "eAndOe": "E. & O.E.",
        "addDot": "Add.",
        "acNo": "Ac. No.",
        "disbDateDot": "Disb. Date.",
        "totalRs": "Total Rs.",
        "rupees": "Rupees",
        "only": "Only",
        "schemeNameDash": "Scheme Name -",
        "memberNameColon": "Member Name : ",
        "guardianNameColon": "Guardian Name : ",
        "addressColon": "Address : ",
        "accountNoColon": "Account No. : ",
        "refAcNoColon": "Ref. Ac. No. : ",
        "ledgerFolioColon": "Ledger Folio : ",
        "disbDateColon": "Disb. Date : ",
        "roiColon": "ROI. : ",
        "disbAmountColon": "Disb. Amount : ",
        "repayWithinColon": "Repay Within : ",
        "repayModeColon": "Repay Mode : ",
        "productNameColon": "Product Name : ",
        "depositTransactionRegisterFrom": "Deposit Transaction Register From",
        "to": "To",
    },
    "hi": {
        "noRecordsAddedYet": "अभी कोई रिकॉर्ड नहीं जोड़ा गया।",
        "accountStatementFrom": "खाता विवरण से",
        "loanTypeGuaranter": "ऋण प्रकार - गारंटर",
        "receivedMode": "प्राप्ति मोड :",
        "receivedBy": "प्राप्तकर्ता :",
        "printedOn": "मुद्रित तिथि :",
        "eAndOe": "E. & O.E.",
        "addDot": "Add.",
        "acNo": "Ac. No.",
        "disbDateDot": "Disb. Date.",
        "totalRs": "कुल रु.",
        "rupees": "रुपये",
        "only": "मात्र",
        "schemeNameDash": "योजना नाम -",
        "memberNameColon": "सदस्य नाम : ",
        "guardianNameColon": "अभिभावक नाम : ",
        "addressColon": "पता : ",
        "accountNoColon": "खाता सं. : ",
        "refAcNoColon": "संदर्भ खाता : ",
        "ledgerFolioColon": "लेजर फोलियो : ",
        "disbDateColon": "वितरण तिथि : ",
        "roiColon": "ब्याज दर : ",
        "disbAmountColon": "वितरण राशि : ",
        "repayWithinColon": "भुगतान अवधि : ",
        "repayModeColon": "भुगतान मोड : ",
        "productNameColon": "उत्पाद नाम : ",
        "depositTransactionRegisterFrom": "जमा लेनदेन रजिस्टर से",
        "to": "से",
    },
    "bn": {
        "noRecordsAddedYet": "এখনো কোনো রেকর্ড যোগ করা হয়নি।",
        "accountStatementFrom": "অ্যাকাউন্ট স্টেটমেন্ট থেকে",
        "loanTypeGuaranter": "ঋণের ধরন - জামিনদার",
        "receivedMode": "প্রাপ্তি মোড :",
        "receivedBy": "প্রাপক :",
        "printedOn": "মুদ্রণের তারিখ :",
        "eAndOe": "E. & O.E.",
        "addDot": "Add.",
        "acNo": "Ac. No.",
        "disbDateDot": "Disb. Date.",
        "totalRs": "মোট টাকা",
        "rupees": "টাকা",
        "only": "মাত্র",
        "schemeNameDash": "স্কিমের নাম -",
        "memberNameColon": "সদস্যের নাম : ",
        "guardianNameColon": "অভিভাবকের নাম : ",
        "addressColon": "ঠিকানা : ",
        "accountNoColon": "অ্যাকাউন্ট নং : ",
        "refAcNoColon": "রেফ. অ্যাকাউন্ট : ",
        "ledgerFolioColon": "লেজার ফোলিও : ",
        "disbDateColon": "বিতরণের তারিখ : ",
        "roiColon": "সুদের হার : ",
        "disbAmountColon": "বিতরণের পরিমাণ : ",
        "repayWithinColon": "পরিশোধের মধ্যে : ",
        "repayModeColon": "পরিশোধ মোড : ",
        "productNameColon": "পণ্যের নাম : ",
        "depositTransactionRegisterFrom": "আমানত লেনদেন রেজিস্টার থেকে",
        "to": "থেকে",
    },
    "or": {
        "noRecordsAddedYet": "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ରେକର୍ଡ ଯୋଗ ହୋଇନାହିଁ।",
        "accountStatementFrom": "ଖାତା ବିବରଣୀରୁ",
        "loanTypeGuaranter": "ଋଣ ପ୍ରକାର - ଜାମିନଦାର",
        "receivedMode": "ପ୍ରାପ୍ତି ମୋଡ୍ :",
        "receivedBy": "ପ୍ରାପକ :",
        "printedOn": "ମୁଦ୍ରଣ ତାରିଖ :",
        "eAndOe": "E. & O.E.",
        "addDot": "Add.",
        "acNo": "Ac. No.",
        "disbDateDot": "Disb. Date.",
        "totalRs": "ମୋଟ ଟଙ୍କା",
        "rupees": "ଟଙ୍କା",
        "only": "ମାତ୍ର",
        "schemeNameDash": "ଯୋଜନା ନାମ -",
        "memberNameColon": "ସଦସ୍ୟ ନାମ : ",
        "guardianNameColon": "ଅଭିଭାବକ ନାମ : ",
        "addressColon": "ଠିକଣା : ",
        "accountNoColon": "ଖାତା ନଂ : ",
        "refAcNoColon": "ରେଫ୍ ଖାତା : ",
        "ledgerFolioColon": "ଲେଜର ଫୋଲିଓ : ",
        "disbDateColon": "ବିତରଣ ତାରିଖ : ",
        "roiColon": "ସୁଧ ହାର : ",
        "disbAmountColon": "ବିତରଣ ରାଶି : ",
        "repayWithinColon": "ପରିଶୋଧ ମଧ୍ୟରେ : ",
        "repayModeColon": "ପରିଶୋଧ ମୋଡ୍ : ",
        "productNameColon": "ଉତ୍ପାଦ ନାମ : ",
        "depositTransactionRegisterFrom": "ଜମା ଲେନଦେନ ରେଜିଷ୍ଟରରୁ",
        "to": "ଠାରୁ",
    },
}


def clean_membership_pollution(text: str) -> str:
    """Remove BAD_KEYS that appear between membership reports preview and print."""
    # Find membership reports preview footerNote then polluted keys until print:
    start = text.find('footerNote: "This report is generated by PrioSuite."')
    if start < 0:
        # try other languages - footer may be translated
        start = text.find("footerNote:")
    if start < 0:
        return text
    # from after preview closing `},` following footerNote
    preview_end = text.find("},", start)
    if preview_end < 0:
        return text
    print_pos = text.find("\n      print: {", preview_end)
    if print_pos < 0:
        print_pos = text.find("\n      print:{", preview_end)
    if print_pos < 0:
        return text
    between = text[preview_end + 2 : print_pos]
    # If between contains loan junk keys, strip them
    if "accountStatementFrom:" in between or "loanTypeGuaranter:" in between or "addDot:" in between:
        # keep only whitespace/newlines that lead into print
        text = text[: preview_end + 2] + "\n" + text[print_pos + 1 :]  # print_pos points to \n
        print("cleaned pollution block")
    return text


def ensure_loan_extras(text: str, lang: str) -> str:
    extras = EXTRAS[lang]
    loan_start = text.find("    loan: {")
    if loan_start < 0:
        raise SystemExit("no loan")
    # find end of loan by brace match
    i = text.find("{", loan_start)
    depth = 0
    j = i
    while j < len(text):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                break
        j += 1
    loan_body = text[i : j + 1]
    lines = []
    for k, v in extras.items():
        if re.search(rf"\b{k}\s*:", loan_body):
            continue
        lines.append(f"        {k}: {json.dumps(v, ensure_ascii=False)},")
    if not lines:
        print(lang, "loan extras already present")
        return text
    # insert after `loan: {` / first print or first key
    insert_at = text.find("\n", loan_start) + 1
    text = text[:insert_at] + "\n".join(lines) + "\n" + text[insert_at:]
    print(lang, "added", len(lines), "loan extras")
    return text


for lang in ("en", "hi", "bn", "or"):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    text = clean_membership_pollution(text)
    text = ensure_loan_extras(text, lang)
    path.write_text(text, encoding="utf-8")

# Component fixes
fixes = {
    "repayment/CollectionReceipt.jsx": [
        ('{t("loan.add")}', '{t("loan.addDot")}'),
        ('{t("loan.disbDate")}', '{t("loan.disbDateDot")}'),
    ],
    "report/RepaymentRegisterPreview.jsx": [
        (
            "Deposit Transaction Register From{\" \"}",
            '{t("loan.depositTransactionRegisterFrom")}{" "}',
        ),
        (
            "Deposit Transaction Register From ",
            '{t("loan.depositTransactionRegisterFrom")} ',
        ),
    ],
    "accountStatement/index.jsx": [
        ('{t("loan.memberName")}</p>\n              <p>{tableData?.basicData?.Full_Name',
         '{t("loan.memberNameColon")}</p>\n              <p>{tableData?.basicData?.Full_Name'),
        ('{t("loan.guardianName")}</p>\n              <p>{tableData?.basicData?.Relation_Name',
         '{t("loan.guardianNameColon")}</p>\n              <p>{tableData?.basicData?.Relation_Name'),
        ('{t("loan.address")}</p>\n              <p>{tableData?.basicData?.Address',
         '{t("loan.addressColon")}</p>\n              <p>{tableData?.basicData?.Address'),
        ('{t("loan.accountNo")}</p>\n              <p>{tableData?.basicData?.Account_No',
         '{t("loan.accountNoColon")}</p>\n              <p>{tableData?.basicData?.Account_No'),
        ('{t("loan.refAcNo")}</p>\n              <p>{tableData?.basicData?.Ref_Ac_No',
         '{t("loan.refAcNoColon")}</p>\n              <p>{tableData?.basicData?.Ref_Ac_No'),
        ('{t("loan.ledgerFolio")}</p>\n              <p>{tableData?.basicData?.Ledg_Folio',
         '{t("loan.ledgerFolioColon")}</p>\n              <p>{tableData?.basicData?.Ledg_Folio'),
    ],
}

for rel, reps in fixes.items():
    path = COMP / rel
    text = path.read_text(encoding="utf-8")
    for a, b in reps:
        if a in text:
            text = text.replace(a, b)
            print("fixed", rel, a[:50])
        else:
            print("missing", rel, a[:50])
    path.write_text(text, encoding="utf-8")

# Fix remaining account statement colon labels (disb date etc)
as_path = COMP / "accountStatement/index.jsx"
as_text = as_path.read_text(encoding="utf-8")
# Read section and patch common patterns like {t("loan.disbDate")} when followed by basicData
more = [
    ('font-semibold text-nowrap">{t("loan.disbDate")}</p>',
     'font-semibold text-nowrap">{t("loan.disbDateColon")}</p>'),
    ('font-semibold text-nowrap">{t("loan.rOI")}</p>',
     'font-semibold text-nowrap">{t("loan.roiColon")}</p>'),
    ('font-semibold text-nowrap">{t("loan.disbAmount")}</p>',
     'font-semibold text-nowrap">{t("loan.disbAmountColon")}</p>'),
    ('font-semibold text-nowrap">{t("loan.repayWithin")}</p>',
     'font-semibold text-nowrap">{t("loan.repayWithinColon")}</p>'),
    ('font-semibold text-nowrap">{t("loan.repayMode")}</p>',
     'font-semibold text-nowrap">{t("loan.repayModeColon")}</p>'),
    ('font-semibold text-nowrap">{t("loan.productName")}</p>',
     'font-semibold text-nowrap">{t("loan.productNameColon")}</p>'),
]
for a, b in more:
    if a in as_text:
        as_text = as_text.replace(a, b)
        print("as colon", a[40:70])
as_path.write_text(as_text, encoding="utf-8")

# CollectionReceipt AMOUNT + Total Rs + (Rupees
cr = (COMP / "repayment/CollectionReceipt.jsx").read_text(encoding="utf-8")
for a, b in [
    (">\n                      AMOUNT\n                    <", '>{t("loan.print.amount")}<'),
    ("Total Rs.", '{t("loan.totalRs")}'),
    ("(Rupees ", '({t("loan.rupees")} '),
    (" Only)", ' {t("loan.only")})'),
]:
    if a in cr:
        cr = cr.replace(a, b)
        print("cr", a[:40])
(COMP / "repayment/CollectionReceipt.jsx").write_text(cr, encoding="utf-8")

print("cleanup done")
