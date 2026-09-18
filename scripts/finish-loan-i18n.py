# -*- coding: utf-8 -*-
"""Finish remaining loan i18n leftovers safely (exact replacements only)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "components" / "loan"
LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"


def patch(rel, reps):
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    for a, b in reps:
        if a not in text:
            print(f"  missing in {rel}: {a[:90]!r}")
        else:
            text = text.replace(a, b)
            print(f"  ok {rel}: {a[:50]!r}")
    path.write_text(text, encoding="utf-8")


EXTRA_KEYS = {
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
    },
    "hi": {
        "noRecordsAddedYet": "अभी कोई रिकॉर्ड नहीं जोड़ा गया।",
        "accountStatementFrom": "खाता विवरण से",
        "loanTypeGuaranter": "ऋण प्रकार - गारंटर",
        "receivedMode": "प्राप्ति मोड :",
        "receivedBy": "प्राप्तकर्ता :",
        "printedOn": "मुद्रित तिथि :",
        "eAndOe": "E. & O.E.",
        "addDot": "पता",
        "acNo": "खाता सं.",
        "disbDateDot": "वितरण तिथि",
        "totalRs": "कुल रु.",
        "rupees": "रुपये",
        "only": "मात्र",
        "schemeNameDash": "योजना नाम -",
    },
    "bn": {
        "noRecordsAddedYet": "এখনো কোনো রেকর্ড যোগ করা হয়নি।",
        "accountStatementFrom": "অ্যাকাউন্ট স্টেটমেন্ট থেকে",
        "loanTypeGuaranter": "ঋণের ধরন - জামিনদার",
        "receivedMode": "প্রাপ্তি মোড :",
        "receivedBy": "প্রাপক :",
        "printedOn": "মুদ্রণের তারিখ :",
        "eAndOe": "E. & O.E.",
        "addDot": "ঠিকানা",
        "acNo": "অ্যাকাউন্ট নং",
        "disbDateDot": "বিতরণের তারিখ",
        "totalRs": "মোট টাকা",
        "rupees": "টাকা",
        "only": "মাত্র",
        "schemeNameDash": "স্কিমের নাম -",
    },
    "or": {
        "noRecordsAddedYet": "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ରେକର୍ଡ ଯୋଗ ହୋଇନାହିଁ।",
        "accountStatementFrom": "ଖାତା ବିବରଣୀରୁ",
        "loanTypeGuaranter": "ଋଣ ପ୍ରକାର - ଜାମିନଦାର",
        "receivedMode": "ପ୍ରାପ୍ତି ମୋଡ୍ :",
        "receivedBy": "ପ୍ରାପକ :",
        "printedOn": "ମୁଦ୍ରଣ ତାରିଖ :",
        "eAndOe": "E. & O.E.",
        "addDot": "ଠିକଣା",
        "acNo": "ଖାତା ନଂ",
        "disbDateDot": "ବିତରଣ ତାରିଖ",
        "totalRs": "ମୋଟ ଟଙ୍କା",
        "rupees": "ଟଙ୍କା",
        "only": "ମାତ୍ର",
        "schemeNameDash": "ଯୋଜନା ନାମ -",
    },
}


def insert_extra_keys():
    import json

    for lang, extras in EXTRA_KEYS.items():
        path = LOC / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        # insert before print: { inside loan, or before loan closing
        marker = "      print: {"
        if marker not in text:
            print("no print marker", lang)
            continue
        lines = []
        for k, v in extras.items():
            if f"{k}:" in text[text.find("    loan: {") : text.find(marker)]:
                continue
            lines.append(f"      {k}: {json.dumps(v, ensure_ascii=False)},")
        if not lines:
            print("extras already present", lang)
            continue
        insert = "\n".join(lines) + "\n"
        text = text.replace(marker, insert + marker, 1)
        path.write_text(text, encoding="utf-8")
        print("extras", lang, len(lines))


insert_extra_keys()

patch(
    "disburse/index.jsx",
    [
        (
            ') : (\n                      "Add"\n                    )}',
            ') : (\n                      t("loan.add")\n                    )}',
        )
    ],
)

patch(
    "newApplication/index.jsx",
    [
        (') : (\n                      "Save"\n                    )}', ') : (\n                      t("loan.save")\n                    )}'),
        (') : (\n                      "Add"\n                    )}', ') : (\n                      t("loan.add")\n                    )}'),
        ('emptyText="No records added yet."', 'emptyText={t("loan.noRecordsAddedYet")}'),
        (
            'const RadioData = [{ label: "Individual Customer", value: "1" }];',
            'const RadioData = [{ label: t("loan.individualCustomer"), value: "1" }];',
        ),
    ],
)

patch(
    "repayment/index.jsx",
    [
        (
            ') : (\n                            "Save"\n                          )}',
            ') : (\n                            t("loan.save")\n                          )}',
        )
    ],
)

patch(
    "repayment/CollectionReceipt.jsx",
    [
        ("                        Name\n", '                        {t("loan.name")}\n'),
        ('<p className="">Overdue Principal</p>', '<p className="">{t("loan.overduePrincipal")}</p>'),
        (
            "<p>Scheme Name - {collectionReceiptData?.Prod_Name}</p>",
            '<p>{t("loan.schemeName")} - {collectionReceiptData?.Prod_Name}</p>',
        ),
        (
            "<p>Received Mode : {collectionReceiptData?.Mode}</p>",
            '<p>{t("loan.receivedMode")} {collectionReceiptData?.Mode}</p>',
        ),
        (
            "<p>Received By : {collectionReceiptData?.Collected_By}</p>",
            '<p>{t("loan.receivedBy")} {collectionReceiptData?.Collected_By}</p>',
        ),
        (
            "                      Printed On : {currentDate} {currentTime}",
            '                      {t("loan.printedOn")} {currentDate} {currentTime}',
        ),
        (">E. &amp; O.E.<", '>{t("loan.eAndOe")}<'),
        (
            ">\n            Print\n          </Button>",
            '>\n            {t("loan.print")}\n          </Button>',
        ),
        (
            'Branch - {orgBranch} | Address - {orgAddress || ""}',
            '{t("loan.branch")} - {orgBranch} | {t("loan.address")} - {orgAddress || ""}',
        ),
        ("                        Add.\n", '                        {t("loan.addDot")}\n'),
        ("                        Ac. No.\n", '                        {t("loan.acNo")}\n'),
        ("                        Disb. Date.\n", '                        {t("loan.disbDateDot")}\n'),
        ("                        Final Repay Date\n", '                        {t("loan.finalRepayDate")}\n'),
        ("                        Pending Inst.\n", '                        {t("loan.pendingInst")}\n'),
        ("                        Total Outstanding\n", '                        {t("loan.totalOutstanding")}\n'),
        ("                        Current Principal\n", '                        {t("loan.currentPrincipal")}\n'),
        ("                        Overdue Interest\n", '                        {t("loan.overdueInterest")}\n'),
        ("                        Overdue Principal\n", '                        {t("loan.overduePrincipal")}\n'),
        (
            '<span className="text-nowrap ">Total Rs.</span>',
            '<span className="text-nowrap ">{t("loan.totalRs")}</span>',
        ),
        (
            'justify-center text-base  font-medium flex-shrink-0 flex-grow-0">\n                      AMOUNT\n                    </p>',
            'justify-center text-base  font-medium flex-shrink-0 flex-grow-0">{t("loan.print.amount")}</p>',
        ),
    ],
)

patch(
    "report/DisburseRegisterPreview.jsx",
    [('Loan Disburse Register From{" "}', '{t("loan.loanDisburseRegisterFrom")}{" "}')],
)
patch(
    "report/DetailedListPreview.jsx",
    [('Loan Detailed List From{" "}', '{t("loan.loanDetailedListFrom")}{" "}')],
)
patch(
    "accountStatement/PreviewModal.jsx",
    [('Account Statement From{" "}', '{t("loan.accountStatementFrom")}{" "}')],
)
patch(
    "guarantorDetails/GuarantorDetailsPreview.jsx",
    [('headName: "Loan Type - Guaranter"', 'headName: t("loan.loanTypeGuaranter")')],
)

# Repayment register title + Sub Total + Generated On
rep_path = ROOT / "report/RepaymentRegisterPreview.jsx"
rep = rep_path.read_text(encoding="utf-8")
for a, b in [
    ("Loan Repayment Register From", '{t("loan.loanRepaymentRegisterFrom")}'),
    (">Sub Total<", '>{t("loan.subTotal")}<'),
    ("Generated On :", '{t("loan.generatedOnColon")}'),
]:
    if a in rep:
        rep = rep.replace(a, b)
        print("ok RepaymentRegisterPreview", a[:40])
    else:
        print("missing RepaymentRegisterPreview", a[:40])
rep_path.write_text(rep, encoding="utf-8")

for rel in [
    "accountStatement/PreviewModal.jsx",
    "defaulterList/PreviewModal.jsx",
    "generateSchedule/GenerateSchedulePreview.jsx",
    "guarantorDetails/GuarantorDetailsPreview.jsx",
    "report/DisburseRegisterPreview.jsx",
    "report/DetailedListPreview.jsx",
]:
    path = ROOT / rel
    t = path.read_text(encoding="utf-8")
    orig = t
    # Only replace bare Generated On: not already inside t()
    t = re.sub(r"(?<!\{t\(\"loan\.generatedOnColon\"\)\})Generated On:", '{t("loan.generatedOnColon")}', t)
    # simpler exact:
    t = orig
    if "Generated On:" in t and 't("loan.generatedOnColon")' not in t:
        t = t.replace("Generated On:", '{t("loan.generatedOnColon")}')
    elif "Generated On:" in t:
        # may already partially wired; replace remaining bare occurrences
        parts = []
        i = 0
        while True:
            j = t.find("Generated On:", i)
            if j < 0:
                parts.append(t[i:])
                break
            window = t[max(0, j - 30) : j]
            if 't("loan.generatedOnColon")' in window:
                parts.append(t[i : j + len("Generated On:")])
            else:
                parts.append(t[i:j] + '{t("loan.generatedOnColon")}')
            i = j + len("Generated On:")
        t = "".join(parts) if parts else t
    if t != orig:
        path.write_text(t, encoding="utf-8")
        print("generatedOn", rel)

# accountStatement colon labels
as_path = ROOT / "accountStatement/index.jsx"
as_text = as_path.read_text(encoding="utf-8")
colon_map = [
    ("Member Name : ", "memberNameColon"),
    ("Guardian Name : ", "guardianNameColon"),
    ("Address : ", "addressColon"),
    ("Account No. : ", "accountNoColon"),
    ("Ref. Ac. No. : ", "refAcNoColon"),
    ("Ledger Folio : ", "ledgerFolioColon"),
    ("Disb. Date : ", "disbDateColon"),
    ("ROI. : ", "roiColon"),
    ("Disb. Amount : ", "disbAmountColon"),
    ("Repay Within : ", "repayWithinColon"),
    ("Repay Mode : ", "repayModeColon"),
    ("Product Name : ", "productNameColon"),
]
# ensure keys in locales - use existing if present else add via english identical keys already in loan
for eng, key in colon_map:
    needle = f">{eng}</"
    if needle in as_text:
        as_text = as_text.replace(f">{eng}</", f'{{t("loan.{key}")}}</')
        print("colon", key)
    elif f">{eng}" in as_text:
        pass
as_path.write_text(as_text, encoding="utf-8")

# Add colon keys to locales if missing
import json

colon_en = {
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
}
colon_hi = {
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
}
colon_bn = {
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
}
colon_or = {
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
}
for lang, extras in [
    ("en", colon_en),
    ("hi", colon_hi),
    ("bn", colon_bn),
    ("or", colon_or),
]:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    marker = "      print: {"
    lines = []
    loan_slice = text[text.find("    loan: {") : text.find(marker)]
    for k, v in extras.items():
        if f"{k}:" not in loan_slice:
            lines.append(f"      {k}: {json.dumps(v, ensure_ascii=False)},")
    if lines:
        text = text.replace(marker, "\n".join(lines) + "\n" + marker, 1)
        path.write_text(text, encoding="utf-8")
        print("colon extras", lang, len(lines))

print("finish done")
