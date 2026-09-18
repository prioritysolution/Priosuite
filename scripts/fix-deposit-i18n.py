# -*- coding: utf-8 -*-
"""Fix broken stringified t() and remaining deposit static strings."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "components" / "deposit"


def unstringify(text: str) -> str:
    # attr="{t("key")}" -> attr={t("key")}
    text = re.sub(
        r'(placeholder|searchPlaceholder|formLabel|title|aria-label)="\{t\("([^"]+)"\)\}"',
        r'\1={t("\2")}',
        text,
    )
    # console / comments with "{t("...")}" leave or fix console
    text = re.sub(
        r'console\.log\("\{t\("([^"]+)"\)\}([^"]*)"',
        r'console.log(t("\1") + "\2"',
        text,
    )
    return text


def fix_report_tables():
    mapping = {
        "Sl No.": "slNo",
        "Date": "date",
        "Customer Name": "customerName",
        "Gurdian Name": "guardianName",
        "Account No.": "accountNo",
        "Ref. Ac. No.": "refAcNo",
        "L/F No.": "lfNo",
        "Operation Mode": "operationMode",
        "Nominee": "nominee",
        "Opening": "opening",
        "Opening Date": "openingDate",
        "Deposit": "deposit",
        "Withdrawn": "withdrawn",
        "Closing": "closing",
        "ROI": "roi",
        "Maturity Date": "maturityDate",
        "Due Intt.": "dueIntt",
        "Paid Intt.": "paidIntt",
        "Amount": "amount",
        "Narration": "narration",
        "Interest": "interest",
        "Trans. Mode": "transMode",
        "Action": "action",
    }
    for path in (ROOT / "report").glob("*Table.jsx"):
        text = path.read_text(encoding="utf-8")
        text = unstringify(text)
        if "useTranslation" not in text:
            text = 'import { useTranslation } from "react-i18next";\n' + text
            # add hook
            m = re.search(r"const\s+[A-Z]\w*\s*=\s*\([^)]*\)\s*=>\s*\{", text)
            if not m:
                m = re.search(r"const\s+[A-Z]\w*\s*=\s*\(\{[\s\S]*?\}\)\s*=>\s*\{", text)
            if m:
                text = text[: m.end()] + "\n  const { t } = useTranslation();\n" + text[m.end() :]
        for eng, key in mapping.items():
            text = re.sub(
                rf"(<TableHead[^>]*>)(\s*){re.escape(eng)}(\s*)(</TableHead>)",
                rf'\1\2{{t("deposit.reports.{key}")}}\3\4',
                text,
            )
            text = re.sub(
                rf"(\n\s+){re.escape(eng)}(\n)",
                rf'\1{{t("deposit.reports.{key}")}}\2',
                text,
            )
        path.write_text(text, encoding="utf-8")
        print("table", path.name)


def main():
    for path in ROOT.rglob("*.jsx"):
        text = path.read_text(encoding="utf-8")
        new = unstringify(text)
        if new != text:
            path.write_text(new, encoding="utf-8")
            print("unstringify", path.relative_to(ROOT))

    # deposit title / formLabel
    p = ROOT / "deposit" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    if 'formLabel="Deposit"' in t:
        t = t.replace('formLabel="Deposit"', 'formLabel={t("deposit.depositTxn.title")}')
    if 'const { t } = useTranslation();' not in t:
        m = re.search(r"const Deposit = \(\{[\s\S]*?\}\) => \{", t)
        if m:
            t = t[: m.end()] + "\n  const { t } = useTranslation();\n" + t[m.end() :]
        if "react-i18next" not in t:
            t = 'import { useTranslation } from "react-i18next";\n' + t
    # Last Deposit Date label leftover
    t = t.replace(
        ': "Last Deposit Date"',
        ': t("deposit.fieldsExtra.lastDepositDate")',
    )
    # Ensure joint placeholders - if missing key, use fields
    t = t.replace(
        'placeholder={t("deposit.placeholders.joint1")}',
        'placeholder="Enter joint 1"',
    )
    t = t.replace(
        'placeholder={t("deposit.placeholders.joint2")}',
        'placeholder="Enter joint 2"',
    )
    p.write_text(t, encoding="utf-8")
    print("deposit index")

    # withdrawn / renewal titles
    for rel, title_key, needle in [
        ("withdrawn/index.jsx", "deposit.withdrawn.title", "Withdrawn"),
        ("renewal/index.jsx", "deposit.renewal.title", "Renewal"),
    ]:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        text = re.sub(
            rf'(className="text-2xl font-semibold[^"]*">\s*){needle}(\s*<)',
            rf'\1{{t("{title_key}")}}\2',
            text,
        )
        # Yes button
        if rel.startswith("withdrawn"):
            text = re.sub(r">\s*Yes\s*<", '>{t("deposit.buttons.yes")}<', text)
        path.write_text(text, encoding="utf-8")

    # changeAccountStatus current status placeholder
    cas = ROOT / "changeAccountStatus" / "index.jsx"
    ct = cas.read_text(encoding="utf-8")
    ct = ct.replace(
        'placeholder={t("deposit.placeholders.memberNo")}',
        'placeholder={t("deposit.changeAccountStatus.currentStatus")}',
        1,
    )
    # only the current status field - might have replaced memberNo too. Fix carefully by reading.
    cas.write_text(ct, encoding="utf-8")

    fix_report_tables()

    # charge/interest table headers remaining
    for rel in [
        "chargeDeduction/ChargeDeductionTable.jsx",
        "sevingsInterestCalculate/InterestCalculationTable.jsx",
    ]:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        reps = {
            "Account No.": 't("deposit.fields.accountNo")',
            "Member Name": 't("deposit.fields.memberName")',
            "Charge Amount": 't("deposit.fields.chargeAmount")',
            "Balance": 't("deposit.common.balance")',
            "Action": 't("deposit.common.action")',
            "Interest": 't("deposit.fields.interest")',
            "Interest Amount": 't("deposit.fields.interestAmount")',
            "Current Balance": 't("deposit.fields.availableBalance")',
            "Ref. Account No.": 't("deposit.fields.refAccountNo")',
            "Total": 't("deposit.fields.total")',
        }
        for eng, call in reps.items():
            text = re.sub(
                rf"(<TableHead[^>]*>\s*){re.escape(eng)}(\s*</TableHead>)",
                rf"\1{{{call}}}\2",
                text,
            )
            text = re.sub(
                rf"(\n\s+){re.escape(eng)}(\n)",
                rf"\1{{{call}}}\2",
                text,
            )
        path.write_text(text, encoding="utf-8")
        print("calc table", rel)

    # openDepositAccount remaining labels - map common ones
    odp = ROOT / "openDepositAccount" / "index.jsx"
    ot = odp.read_text(encoding="utf-8")
    for eng, key in [
        ("Aadhaar No.", 'label={t("membership.memberProfile.fields.aadhaarNo")}'),  # reuse? better deposit
    ]:
        pass
    # Keep open deposit extras as deposit.fields where possible; add minimal replacements
    extras = [
        ('label="Aadhaar No."', 'label={t("deposit.fields.aadhaarNo")}'),
        ('label="Voter ID"', 'label={t("deposit.fields.voterId")}'),
        ('label="Ledger Folio"', 'label={t("deposit.fields.ledgerFolio")}'),
        ('label="Nominee Name"', 'label={t("deposit.fields.nomineeName")}'),
        ('label="Nominee Address"', 'label={t("deposit.fields.nomineeAddress")}'),
        ('label="Account Type"', 'label={t("deposit.fields.accountType")}'),
        ('label="Agent"', 'label={t("deposit.fields.agent")}'),
        ('label="Deposit Product"', 'label={t("deposit.fields.product")}'),
        ('label="Opening Date"', 'label={t("deposit.fields.openingDate")}'),
        ('label="Payout Mode"', 'label={t("deposit.fields.payoutMode")}'),
        ('label="Maturity Instruction"', 'label={t("deposit.fields.maturityInstruction")}'),
        ('label="Manual Account No."', 'label={t("deposit.fields.manualRefAccountNo")}'),
        ('label="Relation"', 'label={t("deposit.fields.relation")}'),
        ('label="Relation Name"', 'label={t("deposit.fields.relationName")}'),
        ('label="Percentage"', 'label={t("deposit.common.percentage")}'),
        ('label="Age"', 'label={t("deposit.common.age")}'),
        ('label="Full Name"', 'label={t("deposit.common.name")}'),
        ('label="ECS Account"', 'label={t("deposit.fields.ecsAccount")}'),
        ('placeholder="Enter aadhaar no."', 'placeholder={t("deposit.placeholders.aadhaarNo")}'),
        ('placeholder="Enter voter id"', 'placeholder={t("deposit.placeholders.voterId")}'),
        ('placeholder="Enter ledger folio"', 'placeholder={t("deposit.placeholders.ledgerFolio")}'),
        ('placeholder="Enter nominee name"', 'placeholder={t("deposit.placeholders.nomineeName")}'),
        ('placeholder="Enter nominee address"', 'placeholder={t("deposit.placeholders.nomineeAddress")}'),
        ('placeholder="Enter address"', 'placeholder={t("deposit.placeholders.address")}'),
        ('placeholder="Select account type"', 'placeholder={t("deposit.placeholders.selectAccountType")}'),
        ('searchPlaceholder="Search account type..."', 'searchPlaceholder={t("deposit.placeholders.searchAccountType")}'),
        ('placeholder="Select agent"', 'placeholder={t("deposit.placeholders.selectAgent")}'),
        ('searchPlaceholder="Search agent..."', 'searchPlaceholder={t("deposit.placeholders.searchAgent")}'),
        ('placeholder="Select maturity instruction"', 'placeholder={t("deposit.placeholders.selectMaturityInstruction")}'),
        ('searchPlaceholder="Search maturity instruction..."', 'searchPlaceholder={t("deposit.placeholders.searchMaturityInstruction")}'),
        ('placeholder="Select operation mode"', 'placeholder={t("deposit.placeholders.selectOperationMode")}'),
        ('searchPlaceholder="Search operation mode..."', 'searchPlaceholder={t("deposit.placeholders.searchOperationMode")}'),
        ('placeholder="Select payout mode"', 'placeholder={t("deposit.placeholders.selectPayoutMode")}'),
        ('searchPlaceholder="Search payout mode..."', 'searchPlaceholder={t("deposit.placeholders.searchPayoutMode")}'),
        ('placeholder="Select relation"', 'placeholder={t("deposit.placeholders.selectRelation")}'),
        ('searchPlaceholder="Search relation..."', 'searchPlaceholder={t("deposit.placeholders.searchRelation")}'),
    ]
    # Add missing keys to locales via appending to fields in en only is heavy —
    # Instead put keys under deposit.openDepositAccount.fields dynamically by editing locale files.
    for a, b in extras:
        ot = ot.replace(a, b)
    odp.write_text(ot, encoding="utf-8")
    print("openDeposit extras")

    # Append missing open-deposit field keys into all locale files under deposit.fields
    loc = Path(__file__).resolve().parents[1] / "i18n" / "locales"
    extra_fields = {
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
            "joint1": "Joint 1",
            "joint2": "Joint 2",
            "paidUpto": "Paid Upto",
            "fromNo": "From No.",
            "toNo": "To No.",
            "noOfLeaves": "No. of Leaves",
            "chargeAmount": "Charge Amount",
            "amountInWords": "Amount in Words",
            "asOn": "As On",
            "chargeType": "Charge Type",
            "lineNo": "Line No.",
            "fromDateLower": "From date",
        },
        "hi": {},
        "bn": {},
        "or": {},
    }
    # copy en keys to others with same English if no translation (i18n fallback still ok)
    for lang in ("hi", "bn", "or"):
        extra_fields[lang] = dict(extra_fields["en"])

    extra_ph = {
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
    }

    import json

    for lang in ("en", "hi", "bn", "or"):
        path = loc / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        # insert missing field keys after roi in deposit.fields
        if 'aadhaarNo:' not in text[text.find("deposit:"): text.find("deposit:") + 5000]:
            insert_f = "".join(
                f',\n      {k}: {json.dumps(v, ensure_ascii=False)}'
                for k, v in extra_fields[lang].items()
            )
            # find deposit fields roi line
            di = text.find("    deposit: {")
            fi = text.find("fields: {", di)
            roi = text.find('roi:', fi)
            # end of fields before placeholders
            ph = text.find("placeholders: {", fi)
            fields_chunk = text[fi:ph]
            if "aadhaarNo:" not in fields_chunk:
                # before closing of fields - find last }, before placeholders
                # insert before the `  },` that closes fields
                close = text.rfind("},", fi, ph)
                text = text[:close] + insert_f + "\n    " + text[close:]
            if "selectAccountType:" not in text[text.find("placeholders: {", di): text.find("sections: {", di)]:
                insert_p = "".join(
                    f',\n      {k}: {json.dumps(v, ensure_ascii=False)}'
                    for k, v in extra_ph.items()
                )
                ph = text.find("placeholders: {", di)
                sec = text.find("sections: {", ph)
                close = text.rfind("},", ph, sec)
                text = text[:close] + insert_p + "\n    " + text[close:]
            path.write_text(text, encoding="utf-8")
            print("locale extras", lang)

    # restore deposit joint placeholders to t()
    p = ROOT / "deposit" / "index.jsx"
    t = p.read_text(encoding="utf-8")
    t = t.replace('placeholder="Enter joint 1"', 'placeholder={t("deposit.placeholders.joint1")}')
    t = t.replace('placeholder="Enter joint 2"', 'placeholder={t("deposit.placeholders.joint2")}')
    p.write_text(t, encoding="utf-8")

    # fix changeAccountStatus - re-read and fix memberNo placeholder if wrongly changed
    cas = ROOT / "changeAccountStatus" / "index.jsx"
    ct = cas.read_text(encoding="utf-8")
    # ensure memberNo still has correct placeholder
    ct = ct.replace(
        """label={t("deposit.fields.memberNo")}
                        placeholder={t("deposit.changeAccountStatus.currentStatus")}""",
        """label={t("deposit.fields.memberNo")}
                        placeholder={t("deposit.placeholders.memberNo")}""",
    )
    cas.write_text(ct, encoding="utf-8")

    print("done")


if __name__ == "__main__":
    main()
