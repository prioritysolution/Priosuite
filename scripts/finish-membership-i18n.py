# -*- coding: utf-8 -*-
"""Finish membership i18n: locale aliases + remaining component strings."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
COMP = ROOT / "components" / "membership"

# English values for missing mapInstituteMember keys (mirror mapGroupMember)
INST_EN = {
    "address": "Address",
    "branchName": "Branch Name",
    "cifNo": "CIF No.",
    "designation": "Designation",
    "formationDate": "Formation Date",
    "guardianName": "Guardian Name",
    "joinDate": "Join Date",
    "memberName": "Member Name",
    "memberNo": "Member No.",
    "mobileNo": "Mobile No.",
    "withdrawnDate": "Withdrawn Date",
}
INST_PH_EN = {
    "date": "Select date",
    "designation": "Select designation",
    "remarks": "Enter remarks",
}

# translations via phrase maps already in membership_locale_blocks
import sys
sys.path.insert(0, str(Path(__file__).parent))
from membership_locale_blocks import _PHRASE


def tr(lang, en):
    if lang == "en":
        return en
    return _PHRASE[lang].get(en, en)


def inject_map_institute_fields(text: str, lang: str) -> str:
    """Insert fields/placeholders under mapInstituteMember if missing."""
    if "mapInstituteMember: {" not in text:
        raise SystemExit("mapInstituteMember missing")
    if "mapInstituteMember" in text and "fields: {\n          address:" in text[
        text.find("mapInstituteMember") : text.find("mapInstituteMember") + 800
    ]:
        # already has fields.address nearby
        pass

    fields_block = "fields: {\n" + "".join(
        f'          {k}: "{tr(lang, v)}",\n' for k, v in INST_EN.items()
    ).rstrip(",\n") + "\n        },\n        placeholders: {\n" + "".join(
        f'          {k}: "{tr(lang, v)}",\n' for k, v in INST_PH_EN.items()
    ).rstrip(",\n") + "\n        },\n        "

    # Find mapInstituteMember block and insert after title/buttons opening
    # Replace existing mapInstituteMember content carefully
    pat = re.compile(
        r"(mapInstituteMember: \{\n)(.*?)(\n      \},)",
        re.S,
    )

    def repl(m):
        body = m.group(2)
        if "fields: {" in body and "memberNo:" in body:
            return m.group(0)
        # keep title/buttons/secondaryFormLabel; prepend fields
        return m.group(1) + "        " + fields_block + body.lstrip() + m.group(3)

    new, n = pat.subn(repl, text, count=1)
    if n != 1:
        print("WARN inject mapInstituteMember", n)
    return new


for lang in ("en", "hi", "bn", "or"):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    text = inject_map_institute_fields(text, lang)
    path.write_text(text, encoding="utf-8")
    print("locale patched", lang)


def ensure_import(text):
    if "react-i18next" in text:
        return text
    if text.lstrip().startswith('"use client"'):
        nl = text.find("\n")
        return text[: nl + 1] + 'import { useTranslation } from "react-i18next";\n' + text[nl + 1 :]
    return 'import { useTranslation } from "react-i18next";\n' + text


def ensure_hook(text, name):
    m = re.search(rf"const {name} = \(\{{", text) or re.search(rf"const {name} = \(", text)
    if not m:
        raise SystemExit(name)
    arrow = text.find("=>", m.start())
    brace = text.find("{", arrow)
    if "useTranslation()" in text[brace : brace + 80]:
        return text
    return text[: brace + 1] + "\n  const { t } = useTranslation();\n" + text[brace + 1 :]


# Fix calculateDividend comment + Dividend Amount header
p = COMP / "calculateDividend/index.jsx"
t = p.read_text(encoding="utf-8")
t = t.replace(
    '{/* ---------------- {t("membership.calculateDividend.sections.accountInfoBlock")} (Fixed) ---------------- */}',
    "{/* ---------------- Account Info Block (Fixed) ---------------- */}",
)
t = t.replace(
    """                    <TableHead className="text-right">
                      Dividend Amount
                    </TableHead>""",
    """                    <TableHead className="text-right">
                      {t("membership.calculateDividend.table.dividendAmount")}
                    </TableHead>""",
)
p.write_text(t, encoding="utf-8")
print("fixed calculateDividend")

# PreviewModal multiline headers
p = COMP / "calculateDividend/PreviewModal.jsx"
t = p.read_text(encoding="utf-8")
mapping = {
    "Sl.": "membership.calculateDividend.table.sl",
    "Member Code": "membership.calculateDividend.table.memberCode",
    "Member Name": "membership.calculateDividend.table.memberName",
    "Guardian Name": "membership.calculateDividend.table.guardianName",
    "Village": "membership.calculateDividend.table.village",
    "Share Balance": "membership.calculateDividend.table.shareBalance",
    "Dividend Amount": "membership.calculateDividend.table.dividendAmount",
    "Total": "common.total",
}
for label, key in mapping.items():
    pat = re.compile(
        rf"(<(?:TableHead|TableCell)[^>]*>)\s*{re.escape(label)}\s*(</(?:TableHead|TableCell)>)",
        re.M,
    )
    t, n = pat.subn(rf'\1{{t("{key}")}}\2', t)
    print(f"  PreviewModal {label} x{n}")
p.write_text(t, encoding="utf-8")

# Remaining formLabels
fixes = [
    (
        "issueMembership/index.jsx",
        'formLabel="Issue Membership"',
        'formLabel={t("membership.issueMembership.title")}',
    ),
    (
        "shareRefund/index.jsx",
        'formLabel="Share Refund"',
        'formLabel={t("membership.shareRefund.title")}',
    ),
    (
        "membershipWithdrawn/index.jsx",
        'formLabel="Membership Withdrawn"',
        'formLabel={t("membership.withdrawn.title")}',
    ),
    (
        "mapgroupmember/index.jsx",
        'formLabel="Map Group Member"',
        'formLabel={t("membership.mapGroupMember.title")}',
    ),
    (
        "mapinstitutemember/index.jsx",
        'formLabel="Map Institute Member"',
        'formLabel={t("membership.mapInstituteMember.title")}',
    ),
    (
        "mapinstitutemember/index.jsx",
        'formLabel="Map Group Member"',
        'formLabel={t("membership.mapInstituteMember.secondaryFormLabel")}',
    ),
    (
        "memberEnquiry/index.jsx",
        'label="Member Name"',
        'label={t("membership.memberEnquiry.fields.memberName")}',
    ),
]
for rel, a, b in fixes:
    path = COMP / rel
    text = path.read_text(encoding="utf-8")
    if a not in text:
        print("WARN missing", rel, a)
    else:
        text = text.replace(a, b)
        path.write_text(text, encoding="utf-8")
        print("fixed", rel, a[:40])


def wire_receipt(rel):
    path = COMP / rel
    text = ensure_import(path.read_text(encoding="utf-8"))
    text = ensure_hook(text, "ShareIssueReceipt")
    reps = [
        ('documentTitle: "Share Issue Receipt"', 'documentTitle: t("membership.shareIssueReceipt.documentTitle")'),
        (
            """          <DialogTitle className="text-center text-2xl font-medium">
            Share Issue Receipt
          </DialogTitle>""",
            """          <DialogTitle className="text-center text-2xl font-medium">
            {t("membership.shareIssueReceipt.title")}
          </DialogTitle>""",
        ),
        (
            '<p className="underline text-sm">Share Issue Receipt</p>',
            '<p className="underline text-sm">{t("membership.shareIssueReceipt.title")}</p>',
        ),
        (
            "Member Type - {",
            '{t("membership.shareIssueReceipt.memberTypeLabel")} {',
        ),
        (
            """                        Name
""",
            """                        {t("membership.shareIssueReceipt.name")}
""",
        ),
        (
            """                        Receipt Date
""",
            """                        {t("membership.shareIssueReceipt.receiptDate")}
""",
        ),
        (
            """                        Add.
""",
            """                        {t("membership.shareIssueReceipt.add")}
""",
        ),
        (
            """                        Member No.
""",
            """                        {t("membership.shareIssueReceipt.memberNo")}
""",
        ),
        (
            """                        Guardian Name
""",
            """                        {t("membership.shareIssueReceipt.guardianName")}
""",
        ),
        (
            """                        Balance
""",
            """                        {t("membership.shareIssueReceipt.balance")}
""",
        ),
        (">Receipt No</", '>{t("membership.shareIssueReceipt.receiptNo")}</'),
        (">Particulars</", '>{t("membership.shareIssueReceipt.particulars")}</'),
        (">Admission Fees</", '>{t("membership.shareIssueReceipt.admissionFees")}</'),
        (">Share Amount</", '>{t("membership.shareIssueReceipt.shareAmount")}</'),
        (">Total Rs.</", '>{t("membership.shareIssueReceipt.totalRs")}</'),
        (">AMOUNT</", '>{t("membership.shareIssueReceipt.amount")}</'),
        (
            "Received Mode : {",
            '{t("membership.shareIssueReceipt.receivedMode")} {',
        ),
        (
            "Printed On : {currentDate}",
            '{t("membership.shareIssueReceipt.printedOn")} {currentDate}',
        ),
        (">E. & O.E.</", '>{t("membership.shareIssueReceipt.eAndOe")}</'),
        (">Cashier</", '>{t("membership.shareIssueReceipt.cashier")}</'),
        (
            """            Cancel
""",
            """            {t("common.buttons.cancel")}
""",
        ),
        (
            """            Print
""",
            """            {t("common.buttons.print")}
""",
        ),
    ]
    for a, b in reps:
        if a not in text:
            print(f"WARN {rel}: {a[:60]!r}")
        else:
            text = text.replace(a, b)
    text = text.replace(
        '(Rupees{" "}',
        '({t("membership.shareIssueReceipt.rupees")}{" "}',
    )
    text = text.replace(
        " Only)",
        ' {t("membership.shareIssueReceipt.only")})',
    )
    text = text.replace(
        "Branch - {orgBranch} | Address - {orgAddress",
        '{t("membership.shareIssueReceipt.branchAddress")} {orgBranch} | {t("membership.shareIssueReceipt.addressLabel")} {orgAddress',
    )
    # Received By if present
    text = text.replace(
        "Received By :",
        '{t("membership.shareIssueReceipt.receivedBy")}',
    )
    path.write_text(text, encoding="utf-8")
    print("wired receipt", rel)


wire_receipt("shareIssue/ShareIssueReceipt.jsx")
wire_receipt("issueMembership/ShareIssueReceipt.jsx")

print("finish script done")
