# -*- coding: utf-8 -*-
"""Wire deposit components with static i18n (labels only)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "components" / "deposit"
IMPORT = 'import { useTranslation } from "react-i18next";\n'
HOOK = "  const { t } = useTranslation();\n"

# English label/placeholder -> key under deposit.fields / deposit.placeholders
FIELD_LABELS = {
    "Member No.": "memberNo",
    "Member No": "memberNo",
    "CIF No.": "cifNo",
    "CIF No": "cifNo",
    "CIF. No.": "cifNoDot",
    "Account No.": "accountNo",
    "Ref. Account No.": "refAccountNo",
    "Manual / REF. Account No.": "manualRefAccountNo",
    "Member Name": "memberName",
    "Gurdian Name": "guardianName",
    "Guardian Name": "guardianName",
    "Mobile No.": "mobileNo",
    "Pan No.": "panNo",
    "Branch Name": "branchName",
    "Account Name": "accountName",
    "Account Balance": "accountBalance",
    "Available Balance": "availableBalance",
    "Operation Mode": "operationMode",
    "Cheque Facility": "chequeFacility",
    "Rate Of Interest": "rateOfInterest",
    "Maturity Date": "maturityDate",
    "Maturity Amount": "maturityAmount",
    "Close Date": "closeDate",
    "Princpal Amount": "principalAmount",
    "Interest": "interest",
    "Bonus Interest": "bonusInterest",
    "Find Amount": "findAmount",
    "Deposit Amount": "depositAmount",
    "Last Deposit Amount": "lastDepositAmount",
    "Installment Amount": "installmentAmount",
    "Last Withdrawn date": "lastWithdrawnDate",
    "Last Withdrawn Amount": "lastWithdrawnAmount",
    "Amount": "amount",
    "Fine": "fine",
    "Total": "total",
    "Bank": "bank",
    "Savings": "savings",
    "Account Holder Name": "accountHolderName",
    "Instrument No.": "instrumentNo",
    "Payout Amount": "payoutAmount",
    "Ref. Vouch No.": "refVoucherNo",
    "Voucher Date": "voucherDate",
    "Reference Voucher No": "referenceVoucherNo",
    "Duration": "duration",
    "Duration Unit": "durationUnit",
    "Renewal Date": "renewalDate",
    "Effect Date": "effectDate",
    "Payout Date": "payoutDate",
    "Paid Date": "paidDate",
    "Month": "month",
    "Year": "year",
    "Interest Amount": "interestAmount",
    "Product": "product",
    "Product Type": "productType",
    "From Date": "fromDate",
    "To Date": "toDate",
    "Posting Date": "postingDate",
    "ROI": "roi",
    "Joint 1": "joint1",
    "Joint 2": "joint2",
    "Paid Upto": "paidUpto",
    "From No.": "fromNo",
    "To No.": "toNo",
    "No. of Leaves": "noOfLeaves",
    "Charge Amount": "chargeAmount",
    "Amount in Words": "amountInWords",
    "As On": "asOn",
    "As on": "asOn",
    "Charge Type": "chargeType",
    "Line No.": "lineNo",
    "From date": "fromDateLower",
    "Name": "memberName",  # careful - sometimes Name alone
    "Balance": "accountBalance",
    "Photo": None,  # use deposit.common.photo
    "Signature": None,
}

PLACEHOLDERS = {
    "Enter member no.": "memberNo",
    "Enter cif no.": "cifNo",
    "Enter cif. no.": "cifNo",
    "Enter account no.": "accountNo",
    "Enter ref. account no.": "refAccountNo",
    "Enter  ref. account no.": "refAccountNo",
    "Enter manual / ref. account no.": "manualRefAccountNo",
    "Enter member name": "memberName",
    "Enter gurdian name": "guardianName",
    "Enter guardian name": "guardianName",
    "Enter mobile no.": "mobileNo",
    "Enter pan no.": "panNo",
    "Enter branch name": "branchName",
    "Enter account name": "accountName",
    "Enter account balance": "accountBalance",
    "Enter available balance": "availableBalance",
    "Enter operation mode": "operationMode",
    "Enter cheque facility": "chequeFacility",
    "Enter rate of interest": "rateOfInterest",
    "Enter rate of intrest": "rateOfInterest",
    "Enter maturity date": "maturityDate",
    "Enter maturity amount": "maturityAmount",
    "Enter maturity Amount": "maturityAmount",
    "Enter amount": "amount",
    "Enter interest": "interest",
    "Enter bonus interest": "bonusInterest",
    "Enter find amount": "findAmount",
    "Enter total amount": "totalAmount",
    "Enter deposit amount": "depositAmount",
    "Enter last deposit amount": "lastDepositAmount",
    "Enter installment amount": "installmentAmount",
    "Enter duration": "duration",
    "Enter payout amount": "payoutAmount",
    "Enter ref. vouch no.": "refVoucherNo",
    "Enter Ref Voucher No": "refVoucherNo",
    "Enter year": "year",
    "Enter interest amount": "interestAmount",
    "Enter ROI": "roi",
    "Enter balance": "availableBalance",
    "Enter name": "memberName",
    "Enter fine amount": "findAmount",
    "Enter withdrawn amount": "amount",
    "Enter last withdrawn amount": "lastWithdrawnAmount",
    "Enter last withdrawn date": "lastWithdrawnDate",
    "Enter last deposit date": "lastDepositAmount",
    "Enter instrument no.": "instrumentNo",
    "Enter joint 1": "joint1",
    "Enter joint 2": "joint2",
    "Enter charge amount": "chargeAmount",
    "Enter from no.": "fromNo",
    "Enter to no.": "toNo",
    "Enter no. of leaves": "noOfLeaves",
    "Enter current status": "memberNo",  # wrong - keep custom
    "Enter payout interest": "interest",
    "Select bank": "selectBank",
    "Search bank...": "searchBank",
    "Select savings": "selectSavings",
    "Search savings...": "searchSavings",
    "Select product": "selectProduct",
    "Search product...": "searchProduct",
    "Select month": "selectMonth",
    "Search month...": "searchMonth",
    "Select duration unit": "selectDurationUnit",
    "Search duration unit...": "searchDurationUnit",
    "Select Product Type": "selectProductType",
    "Select From Date": "selectFromDate",
    "Select To Date": "selectToDate",
    "Select Date": "selectDate",
    "Search name or account no...": "searchNameOrAccount",
    "Select new status": None,
    "Search news status...": None,
    "Total amount in words": "totalAmount",
    "e.g. 1": "memberNo",
}

SECTIONS = {
    "Account Details": "accountDetails",
    "Transaction Details": "transactionDetails",
    "Basic Info Block": "basicInfo",
    "Address": "address",
    "KYC Details Block": "kycDetails",
    "Account Info Block": "accountInfo",
    "Joint Holder Details": "jointHolderDetails",
    "Nominee Details": "nomineeDetails",
    "Specimen Block": "specimen",
    "Transanction Block": "transaction",
    "Close Info Block": "closeInfo",
    "Renewal Info Block": "renewalInfo",
    "Payout Info Block": "payoutInfo",
    "Amount Block": "amount",
    "Interest Info Block": "interestInfo",
    "Cheque Details": "chequeDetails",
}


def ensure_import(text):
    if "react-i18next" in text:
        return text
    m = re.search(r'"use client";\s*\n', text)
    if m:
        return text[: m.end()] + "\n" + IMPORT + text[m.end() :]
    if text.lstrip().startswith("import "):
        return IMPORT + text
    return IMPORT + text


def ensure_hook(text):
    if "const { t } = useTranslation();" in text:
        return text
    matches = list(
        re.finditer(r"const\s+([A-Z]\w*)\s*=\s*\(\{[\s\S]*?\}\)\s*=>\s*\{", text)
    )
    if not matches:
        matches = list(
            re.finditer(r"const\s+([A-Z]\w*)\s*=\s*\([^)]*\)\s*=>\s*\{", text)
        )
    if not matches:
        print("  no hook target")
        return text
    m = matches[0]
    return text[: m.end()] + "\n" + HOOK + text[m.end() :]


def apply_common(text):
    for eng, key in FIELD_LABELS.items():
        if not key:
            continue
        text = text.replace(f'label="{eng}"', f'label={{t("deposit.fields.{key}")}}')
        text = text.replace(f'formLabel="{eng}"', f'formLabel={{t("deposit.fields.{key}")}}')
    for eng, key in PLACEHOLDERS.items():
        if not key:
            continue
        text = text.replace(
            f'placeholder="{eng}"', f'placeholder={{t("deposit.placeholders.{key}")}}'
        )
        text = text.replace(
            f'searchPlaceholder="{eng}"',
            f'searchPlaceholder={{t("deposit.placeholders.{key}")}}',
        )
    for eng, key in SECTIONS.items():
        # headings
        text = re.sub(
            rf"(<h[34][^>]*>\s*){re.escape(eng)}(\s*</h[34]>)",
            rf'\1{{t("deposit.sections.{key}")}}\2',
            text,
        )
        text = text.replace(
            f">\n          {eng}\n        <",
            f'>\n          {{t("deposit.sections.{key}")}}\n        <',
        )
    # common buttons
    for eng, key in [
        ("Add", "add"),
        ("Next", "next"),
        ("Run", "run"),
        ("Search", "search"),
        ("Clear", "clear"),
        ("Reset", "reset"),
        ("Cancel", "cancel"),
        ("Print", "print"),
        ("Yes", "yes"),
        ("No", "no"),
        ("Close", "close"),
        ("Save", "add"),  # often Save -> use common or deposit buttons - text has add; use common.buttons.save if exists
    ]:
        text = re.sub(rf'>\s*{eng}\s*<', f'>{{t("deposit.buttons.{key}")}}<', text)
        text = text.replace(f'"{eng}"', f't("deposit.buttons.{key}")')
    # Fix Save to use common.buttons.save
    text = text.replace('t("deposit.buttons.add")', 't("common.buttons.save")')  # too broad!
    return text


# Don't do the Save->add mess. Rewrite apply_common buttons more carefully.

def apply_common_safe(text):
    for eng, key in FIELD_LABELS.items():
        if not key:
            continue
        text = text.replace(f'label="{eng}"', f'label={{t("deposit.fields.{key}")}}')
        text = text.replace(f'formLabel="{eng}"', f'formLabel={{t("deposit.fields.{key}")}}')
    for eng, key in PLACEHOLDERS.items():
        if not key:
            continue
        text = text.replace(
            f'placeholder="{eng}"', f'placeholder={{t("deposit.placeholders.{key}")}}'
        )
        text = text.replace(
            f'searchPlaceholder="{eng}"',
            f'searchPlaceholder={{t("deposit.placeholders.{key}")}}',
        )
    for eng, key in SECTIONS.items():
        text = re.sub(
            rf"(>(?:\s*)){re.escape(eng)}((?:\s*)<)",
            rf'\1{{t("deposit.sections.{key}")}}\2',
            text,
        )
    # Photo / Signature labels via common
    text = text.replace('label="Photo"', 'label={t("deposit.common.photo")}')
    text = text.replace('label="Signature"', 'label={t("deposit.common.signature")}')
    text = text.replace(">Photo<", '>{t("deposit.common.photo")}<')
    text = text.replace(">Signature<", '>{t("deposit.common.signature")}<')
    return text


FEATURE_REPS = {
    "changeAccountStatus/index.jsx": [
        ("Change Account Status", '{t("deposit.changeAccountStatus.title")}'),
        ('label="Current Status"', 'label={t("deposit.changeAccountStatus.currentStatus")}'),
        ('label="New Status"', 'label={t("deposit.changeAccountStatus.newStatus")}'),
        ('placeholder="Select new status"', 'placeholder={t("deposit.changeAccountStatus.selectNewStatus")}'),
        ('searchPlaceholder="Search news status..."', 'searchPlaceholder={t("deposit.changeAccountStatus.selectNewStatus")}'),
        ('placeholder="Enter current status"', 'placeholder={t("deposit.changeAccountStatus.currentStatus")}'),
        (">Save<", '>{t("common.buttons.save")}<'),
        ('"Save"', 't("common.buttons.save")'),
    ],
    "certificatePrint/index.jsx": [
        ("Certificate Print", '{t("deposit.certificatePrint.title")}'),
    ],
    "passbookPrint/index.jsx": [
        ("Passbook Print", '{t("deposit.passbookPrint.title")}'),
        ("Front page", '{t("deposit.passbookPrint.frontPage")}'),
        ("Transaction page", '{t("deposit.passbookPrint.transactionPage")}'),
        ('label="Product"', 'label={t("deposit.fields.product")}'),
        ('placeholder="Select Product"', 'placeholder={t("deposit.placeholders.selectProduct")}'),
    ],
    "uploadSpecimen/index.jsx": [
        ("Upload Specimen", '{t("deposit.uploadSpecimen.title")}'),
        ("Previous Specimen", '{t("deposit.uploadSpecimen.previousSpecimen")}'),
        ("New Specimen", '{t("deposit.uploadSpecimen.newSpecimen")}'),
        ("Upload photo", '{t("deposit.uploadSpecimen.uploadPhoto")}'),
        ("Upload signature", '{t("deposit.uploadSpecimen.uploadSignature")}'),
    ],
    "deposit/index.jsx": [
        (
            'text-2xl font-semibold">Deposit<',
            'text-2xl font-semibold">{t("deposit.depositTxn.title")}<',
        ),
        (
            'text-2xl font-semibold" >Deposit<',
            'text-2xl font-semibold">{t("deposit.depositTxn.title")}<',
        ),
        (">Save<", '>{t("common.buttons.save")}<'),
        ('"Save"', 't("common.buttons.save")'),
    ],
    "withdrawn/index.jsx": [
        (
            'text-2xl font-semibold">Withdrawn<',
            'text-2xl font-semibold">{t("deposit.withdrawn.title")}<',
        ),
        ("Withdrawn Details", '{t("deposit.withdrawn.withdrawnDetails")}'),
        ("Profile", '{t("deposit.withdrawn.profile")}'),
        (">Save<", '>{t("common.buttons.save")}<'),
        ('"Save"', 't("common.buttons.save")'),
        (">Yes<", '>{t("deposit.buttons.yes")}<'),
    ],
    "renewal/index.jsx": [
        (
            'text-2xl font-semibold">Renewal<',
            'text-2xl font-semibold">{t("deposit.renewal.title")}<',
        ),
    ],
    "issueCheque/index.jsx": [
        ("Issue Cheque", '{t("deposit.issueCheque.title")}'),
        (">Save<", '>{t("common.buttons.save")}<'),
        ('"Save"', 't("common.buttons.save")'),
    ],
    "mature/index.jsx": [
        ("Close / Mature", '{t("deposit.mature.title")}'),
        ("See Specimen", '{t("deposit.buttons.seeSpecimen")}'),
        ("Calculate Interest", '{t("deposit.buttons.calculateInterest")}'),
    ],
    "interestPayout/index.jsx": [
        ("Interest Payout", '{t("deposit.interestPayout.title")}'),
        ("Interest Details", '{t("deposit.interestPayout.interestDetails")}'),
    ],
    "interestPosting/index.jsx": [
        ("Interest Posting", '{t("deposit.interestPosting.title")}'),
    ],
    "sevingsInterestCalculate/index.jsx": [
        ("Generate Savings Interest", '{t("deposit.savingsInterest.title")}'),
        ("Post Interest", '{t("deposit.buttons.postInterest")}'),
    ],
    "chargeDeduction/index.jsx": [
        ("Charge Deduction", '{t("deposit.chargeDeduction.title")}'),
        ("Post Charges", '{t("deposit.buttons.postCharges")}'),
        ('placeholder="Select Charge Type"', 'placeholder={t("deposit.fields.chargeType")}'),
    ],
    "openDepositAccount/index.jsx": [
        ("Open Deposit Account", '{t("deposit.openDepositAccount.title")}'),
        ("Remove Joint Holder", '{t("deposit.buttons.removeJointHolder")}'),
        ("Upload photo", '{t("deposit.uploadSpecimen.uploadPhoto")}'),
        ("Upload signature", '{t("deposit.uploadSpecimen.uploadSignature")}'),
        (">Add<", '>{t("deposit.buttons.add")}<'),
        ('"Add"', 't("deposit.buttons.add")'),
    ],
    "report/index.jsx": [
        ("Deposit Report", '{t("deposit.report.title")}'),
        ('label="From Date"', 'label={t("deposit.report.fields.fromDate")}'),
        ('label="To Date"', 'label={t("deposit.report.fields.toDate")}'),
        ('label="Product Type"', 'label={t("deposit.report.fields.productType")}'),
        ('label="Report Type"', 'label={t("deposit.report.fields.reportType")}'),
        ('label="Branch"', 'label={t("deposit.report.fields.branch")}'),
        ('placeholder="Select product type"', 'placeholder={t("deposit.report.placeholders.productType")}'),
        ('searchPlaceholder="Search product type..."', 'searchPlaceholder={t("deposit.report.placeholders.searchProductType")}'),
        ('placeholder="Select report type"', 'placeholder={t("deposit.report.placeholders.reportType")}'),
        ('searchPlaceholder="Search report type..."', 'searchPlaceholder={t("deposit.report.placeholders.searchReportType")}'),
        ('placeholder="Select branch"', 'placeholder={t("deposit.report.placeholders.branch")}'),
        ('searchPlaceholder="Search branch..."', 'searchPlaceholder={t("deposit.report.placeholders.searchBranch")}'),
    ],
}

REPORT_TABLE = {
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

REPORT_PRINT = {
    "SL. NO.": "slNo",
    "DATE": "date",
    "CUSTOMER NAME": "customerName",
    "GUARDIAN NAME": "guardianName",
    "ACCOUNT NO.": "accountNo",
    "ACC. NO.": "accNo",
    "REF. AC. NO.": "refAcNo",
    "L/F. NO.": "lfNo",
    "OPERATION MODE": "operationMode",
    "NOMINEE": "nominee",
    "OPENING": "opening",
    "OPENING DATE": "openingDate",
    "DEPOSIT": "deposit",
    "WITHDRAWN": "withdrawn",
    "CLOSING": "closing",
    "ROI.": "roi",
    "MATURITY DATE": "maturityDate",
    "DUE INTT.": "dueIntt",
    "PAID INTT.": "paidIntt",
    "AMOUNT": "amount",
    "NARRATION": "narration",
    "INTEREST": "interest",
    "TRANS. MODE": "transMode",
}


def process(rel):
    path = ROOT / rel
    if not path.exists():
        print("missing", rel)
        return
    text = path.read_text(encoding="utf-8")
    text = ensure_import(text)
    text = ensure_hook(text)
    text = apply_common_safe(text)
    for a, b in FEATURE_REPS.get(rel, []):
        if a in text:
            text = text.replace(a, b)
    # report tables
    if "/report/" in rel.replace("\\", "/") and "Table" in rel:
        for eng, key in REPORT_TABLE.items():
            text = re.sub(
                rf"(<TableHead[^>]*>\s*){re.escape(eng)}(\s*</TableHead>)",
                rf'\1{{t("deposit.reports.{key}")}}\2',
                text,
            )
            text = re.sub(
                rf"(\n\s+){re.escape(eng)}(\n\s+</)",
                rf'\1{{t("deposit.reports.{key}")}}\2',
                text,
            )
    if "Preview" in rel:
        for eng, key in REPORT_PRINT.items():
            text = re.sub(
                rf"(<TableHead[^>]*>\s*){re.escape(eng)}(\s*</TableHead>)",
                rf'\1{{t("deposit.reports.print.{key}")}}\2',
                text,
            )
            text = re.sub(
                rf"(\n\s+){re.escape(eng)}(\n\s+</)",
                rf'\1{{t("deposit.reports.print.{key}")}}\2',
                text,
            )
    # charge / interest tables extras
    if "ChargeDeductionTable" in rel or "InterestCalculationTable" in rel:
        text = text.replace("Clear", '{t("deposit.buttons.clear")}')
        text = text.replace("Print", '{t("deposit.buttons.print")}')
        text = text.replace(
            "Search name or account",
            '{t("deposit.placeholders.searchNameOrAccount")}',
        )
    path.write_text(text, encoding="utf-8")
    print("ok", rel)


def main():
    for p in sorted(ROOT.rglob("*.jsx")):
        rel = p.relative_to(ROOT).as_posix()
        process(rel)
    print("done")


if __name__ == "__main__":
    main()
