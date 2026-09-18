# -*- coding: utf-8 -*-
"""Wire useTranslation into membership components (static labels only)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "components" / "membership"
IMPORT = 'import { useTranslation } from "react-i18next";\n'
HOOK = "  const { t } = useTranslation();\n"


def ensure_import(text):
    if "react-i18next" in text:
        return text
    if '"use client"' in text:
        # after first use client
        m = re.search(r'"use client";\s*\n', text)
        if m:
            return text[: m.end()] + "\n" + IMPORT + text[m.end() :]
    if text.lstrip().startswith("import "):
        return IMPORT + text
    return IMPORT + text


def ensure_hook(text, component_name=None):
    if "const { t } = useTranslation();" in text:
        return text
    # Find capitalized component = ({...}) => {
    pattern = r"const\s+([A-Z]\w*)\s*=\s*\(\{[\s\S]*?\}\)\s*=>\s*\{"
    matches = list(re.finditer(pattern, text))
    if not matches:
        pattern2 = r"const\s+([A-Z]\w*)\s*=\s*\([^)]*\)\s*=>\s*\{"
        matches = list(re.finditer(pattern2, text))
    if not matches:
        print("  WARN: no component for hook")
        return text
    # Prefer named component if given
    m = matches[0]
    if component_name:
        for cand in matches:
            if cand.group(1) == component_name:
                m = cand
                break
    at = m.end()
    return text[:at] + "\n" + HOOK + text[at:]


def apply_reps(text, reps):
    for a, b in reps:
        if a not in text:
            # only warn for non-optional
            if not a.startswith("OPTIONAL:"):
                print(f"  missing: {a[:70]!r}")
        else:
        text = text.replace(a, b)
    return text


def process(rel, reps, component_name=None, also_hooks_for=None):
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    text = ensure_import(text)
    text = ensure_hook(text, component_name)
    if also_hooks_for:
        for name in also_hooks_for:
            # insert hook into nested components that use t
            pattern = rf"const\s+{name}\s*=\s*\(\{{[\s\S]*?\}}\)\s*=>\s*\{{"
            m = re.search(pattern, text)
            if m and "useTranslation()" not in text[m.end() : m.end() + 80]:
                text = text[: m.end()] + "\n" + HOOK + text[m.end() :]
    text = apply_reps(text, reps)
    path.write_text(text, encoding="utf-8")
    print("ok", rel)


# ---------- memberEnquiry ----------
process(
    "memberEnquiry/index.jsx",
    [
        ('{ label: "Individual Customer", value: "1" }', '{ label: t("membership.memberEnquiry.memberTypes.individual"), value: "1" }'),
        ('{ label: "Group", value: "2" }', '{ label: t("membership.memberEnquiry.memberTypes.group"), value: "2" }'),
        ('{ label: "Institution", value: "3" }', '{ label: t("membership.memberEnquiry.memberTypes.institution"), value: "3" }'),
        ('{ label: "Staff", value: "4" }', '{ label: t("membership.memberEnquiry.memberTypes.staff"), value: "4" }'),
        ("Member Enquiry", '{t("membership.memberEnquiry.title")}'),
        ('label="From Date"', 'label={t("membership.memberEnquiry.fields.fromDate")}'),
        ('label="To Date"', 'label={t("membership.memberEnquiry.fields.toDate")}'),
        ('placeholder="Select type"', 'placeholder={t("membership.memberEnquiry.placeholders.type")}'),
        ('placeholder="Enter cif no."', 'placeholder={t("membership.memberEnquiry.placeholders.cifNo")}'),
        ('placeholder="Search by enter member name"', 'placeholder={t("membership.memberEnquiry.placeholders.memberName")}'),
        ('placeholder="Enter member no."', 'placeholder={t("membership.memberEnquiry.placeholders.memberNo")}'),
        ('placeholder="Enter name"', 'placeholder={t("membership.memberEnquiry.placeholders.name")}'),
        ('placeholder="Enter gurdian"', 'placeholder={t("membership.memberEnquiry.placeholders.guardian")}'),
        ('placeholder="Enter contact no."', 'placeholder={t("membership.memberEnquiry.placeholders.contactNo")}'),
        ('placeholder="Enter address"', 'placeholder={t("membership.memberEnquiry.placeholders.address")}'),
        ('label="Member No"', 'label={t("membership.memberEnquiry.fields.memberNo")}'),
        ('label="Name"', 'label={t("membership.memberEnquiry.fields.name")}'),
        ('label="Gurdian"', 'label={t("membership.memberEnquiry.fields.guardian")}'),
        ('label="Contact No."', 'label={t("membership.memberEnquiry.fields.contactNo")}'),
        ('label="Address"', 'label={t("membership.memberEnquiry.fields.address")}'),
        ("Personal Details", '{t("membership.memberEnquiry.personalDetails")}'),
        (">Serial No.</TableHead>", '>{t("membership.memberEnquiry.table.serialNo")}</TableHead>'),
        (">Account No.</TableHead>", '>{t("membership.memberEnquiry.table.accountNo")}</TableHead>'),
        (">Product Name</TableHead>", '>{t("membership.memberEnquiry.table.productName")}</TableHead>'),
        (">Balance</TableHead>", '>{t("membership.memberEnquiry.table.balance")}</TableHead>'),
        (">Maturity Date</TableHead>", '>{t("membership.memberEnquiry.table.maturityDate")}</TableHead>'),
        (">Status</TableHead>", '>{t("membership.memberEnquiry.table.status")}</TableHead>'),
        (">Repay Mode</TableHead>", '>{t("membership.memberEnquiry.table.repayMode")}</TableHead>'),
        (">Repay Within</TableHead>", '>{t("membership.memberEnquiry.table.repayWithin")}</TableHead>'),
        (">Action</TableHead>", '>{t("membership.memberEnquiry.table.action")}</TableHead>'),
        (">Search<", '>{t("membership.memberEnquiry.buttons.search")}<'),
        ('"Search"', 't("membership.memberEnquiry.buttons.search")'),
        ('"Next"', 't("membership.memberEnquiry.buttons.next")'),
    ],
    "MemberEnquiry",
)

# ---------- report index + tables ----------
process(
    "report/index.jsx",
    [
        ("Membership Report", '{t("membership.report.title")}'),
        ('label="From Date"', 'label={t("membership.report.fields.fromDate")}'),
        ('label="To Date"', 'label={t("membership.report.fields.toDate")}'),
        ('label="Member Type"', 'label={t("membership.report.fields.memberType")}'),
        ('label="Report Type"', 'label={t("membership.report.fields.reportType")}'),
        ('label="Branch"', 'label={t("membership.report.fields.branch")}'),
        ('placeholder="Select member type"', 'placeholder={t("membership.report.placeholders.memberType")}'),
        ('searchPlaceholder="Search member type..."', 'searchPlaceholder={t("membership.report.placeholders.searchMemberType")}'),
        ('placeholder="Select report type"', 'placeholder={t("membership.report.placeholders.reportType")}'),
        ('searchPlaceholder="Search report type..."', 'searchPlaceholder={t("membership.report.placeholders.searchReportType")}'),
        ('placeholder="Select branch"', 'placeholder={t("membership.report.placeholders.branch")}'),
        ('searchPlaceholder="Search branch..."', 'searchPlaceholder={t("membership.report.placeholders.searchBranch")}'),
    ],
)

TABLE_COMMON = [
    (">Sl No.</TableHead>", '>{t("membership.reports.slNo")}</TableHead>'),
    (">Date</TableHead>", '>{t("membership.reports.date")}</TableHead>'),
    (">Member Type</TableHead>", '>{t("membership.reports.memberType")}</TableHead>'),
    (">Customer Name</TableHead>", '>{t("membership.reports.customerName")}</TableHead>'),
    (">Gurdian Name</TableHead>", '>{t("membership.reports.guardianName")}</TableHead>'),
    (">Village</TableHead>", '>{t("membership.reports.village")}</TableHead>'),
    (">L/F No.</TableHead>", '>{t("membership.reports.lfNo")}</TableHead>'),
    (">Opening</TableHead>", '>{t("membership.reports.opening")}</TableHead>'),
    (">Issue</TableHead>", '>{t("membership.reports.issue")}</TableHead>'),
    (">Release</TableHead>", '>{t("membership.reports.release")}</TableHead>'),
    (">Closing</TableHead>", '>{t("membership.reports.closing")}</TableHead>'),
    (">Div. Bal.</TableHead>", '>{t("membership.reports.dividendBalance")}</TableHead>'),
    (">Balance</TableHead>", '>{t("membership.reports.balance")}</TableHead>'),
    (">Admission Fees</TableHead>", '>{t("membership.reports.admissionFees")}</TableHead>'),
    (">Trans. Mode</TableHead>", '>{t("membership.reports.transactionMode")}</TableHead>'),
    (">No. of Share</TableHead>", '>{t("membership.reports.numberOfShares")}</TableHead>'),
    (">Amount</TableHead>", '>{t("membership.reports.amount")}</TableHead>'),
    (">Action</TableHead>", '>{t("membership.reports.action")}</TableHead>'),
]

for f in [
    "report/DetailedListTable.jsx",
    "report/DividendListTable.jsx",
    "report/MemberRegisterTable.jsx",
    "report/TransactionRegisterTable.jsx",
    "report/WithdrawnRegisterTable.jsx",
]:
    process(f, TABLE_COMMON)

PREVIEW = [
    (">SL. NO.<", '>{t("membership.reports.preview.slNo")}<'),
    (">DATE<", '>{t("membership.reports.preview.date")}<'),
    (">MEMBER TYPE<", '>{t("membership.reports.preview.memberType")}<'),
    (">CUSTOMER NAME<", '>{t("membership.reports.preview.customerName")}<'),
    (">GUARDIAN NAME<", '>{t("membership.reports.preview.guardianName")}<'),
    (">VILLAGE<", '>{t("membership.reports.preview.village")}<'),
    (">L/F. NO.<", '>{t("membership.reports.preview.lfNo")}<'),
    (">OPENING<", '>{t("membership.reports.preview.opening")}<'),
    (">ISSUE<", '>{t("membership.reports.preview.issue")}<'),
    (">RELEASE<", '>{t("membership.reports.preview.release")}<'),
    (">CLOSING<", '>{t("membership.reports.preview.closing")}<'),
    (">DIV. BAL.<", '>{t("membership.reports.preview.divBal")}<'),
    (">BALANCE<", '>{t("membership.reports.preview.balance")}<'),
    (">ADM. FEES<", '>{t("membership.reports.preview.admFees")}<'),
    (">TRANS. MODE<", '>{t("membership.reports.preview.transMode")}<'),
    (">NO. OF SHARE<", '>{t("membership.reports.preview.noOfShare")}<'),
    (">AMOUNT<", '>{t("membership.reports.preview.amount")}<'),
    ("Detailed List", '{t("membership.reports.detailedList")}'),
    ("Dividend List", '{t("membership.reports.dividendList")}'),
    ("Member Register", '{t("membership.reports.memberRegister")}'),
    ("Transaction Register", '{t("membership.reports.transactionRegister")}'),
    ("Withdrawn Register", '{t("membership.reports.withdrawnRegister")}'),
]
for f in [
    "report/DetailedListPreview.jsx",
    "report/DividendListPreview.jsx",
    "report/MemberRegisterPreview.jsx",
    "report/TransactionRegisterPreview.jsx",
    "report/WithdrawnRegisterPreview.jsx",
]:
    process(f, PREVIEW)

# ---------- passbookPrint ----------
process(
    "passbookPrint/index.jsx",
    [
        ("Passbook Print", '{t("membership.passbookPrint.title")}'),
        ('label: "Front Page"', 'label: t("membership.passbookPrint.frontPage")'),
        ('label: "Transaction Page"', 'label: t("membership.passbookPrint.transactionPage")'),
        ('label="Date"', 'label={t("membership.passbookPrint.fields.date")}'),
        ('label="Line"', 'label={t("membership.passbookPrint.fields.line")}'),
        ('placeholder="Enter line"', 'placeholder={t("membership.passbookPrint.placeholders.line")}'),
        ('"Print"', 't("membership.passbookPrint.buttons.print")'),
        ('"Next"', 't("membership.passbookPrint.buttons.next")'),
        (">Print<", '>{t("membership.passbookPrint.buttons.print")}<'),
        (">Next<", '>{t("membership.passbookPrint.buttons.next")}<'),
    ],
)

# ---------- shareIssue / shareRefund / withdrawn / issueMembership ----------
def paymentish(ns):
    return [
        ('label="Transaction Date"', f'label={{t("{ns}.fields.transactionDate")}}'),
        ('label="Member No."', f'label={{t("{ns}.fields.memberNo")}}'),
        ('label="CIF No."', f'label={{t("{ns}.fields.cifNo")}}'),
        ('label="Member Name"', f'label={{t("{ns}.fields.memberName")}}'),
        ('label="Gurdian Name"', f'label={{t("{ns}.fields.guardianName")}}'),
        ('label="Address"', f'label={{t("{ns}.fields.address")}}'),
        ('label="Mobile No."', f'label={{t("{ns}.fields.mobileNo")}}'),
        ('label="Branch Name"', f'label={{t("{ns}.fields.branchName")}}'),
        ('label="Ledger Folio"', f'label={{t("{ns}.fields.ledgerFolio")}}'),
        ('label="Bank"', f'label={{t("{ns}.fields.bank")}}'),
        ('label="Savings"', f'label={{t("{ns}.fields.savings")}}'),
        ('label="Account Holder Name"', f'label={{t("{ns}.fields.accountHolderName")}}'),
        ('placeholder="Enter member no."', f'placeholder={{t("{ns}.placeholders.memberNo")}}'),
        ('placeholder="Enter cif no."', f'placeholder={{t("{ns}.placeholders.cifNo")}}'),
        ('placeholder="Enter member name"', f'placeholder={{t("{ns}.placeholders.memberName")}}'),
        ('placeholder="Enter gurdian name"', f'placeholder={{t("{ns}.placeholders.guardianName")}}'),
        ('placeholder="Enter address"', f'placeholder={{t("{ns}.placeholders.address")}}'),
        ('placeholder="Enter mobile no."', f'placeholder={{t("{ns}.placeholders.mobileNo")}}'),
        ('placeholder="Enter branch name"', f'placeholder={{t("{ns}.placeholders.branchName")}}'),
        ('placeholder="Enter ledger folio"', f'placeholder={{t("{ns}.placeholders.ledgerFolio")}}'),
        ('placeholder="Select bank"', f'placeholder={{t("{ns}.placeholders.bank")}}'),
        ('searchPlaceholder="Search bank..."', f'searchPlaceholder={{t("{ns}.placeholders.searchBank")}}'),
        ('placeholder="Select savings"', f'placeholder={{t("{ns}.placeholders.savings")}}'),
        ('searchPlaceholder="Search savings..."', f'searchPlaceholder={{t("{ns}.placeholders.searchSavings")}}'),
        ('placeholder="Enter name"', f'placeholder={{t("{ns}.placeholders.accountHolderName")}}'),
        ('placeholder="Enter ref. vouch no."', f'placeholder={{t("{ns}.placeholders.refVoucherNo")}}'),
        ('"Save"', 't("common.buttons.save")'),
        ('"Add"', 't("common.buttons.add")'),
        (">Save<", '>{t("common.buttons.save")}<'),
        (">Add<", '>{t("common.buttons.add")}<'),
    ]

process(
    "shareIssue/index.jsx",
    paymentish("membership.shareIssue")
    + [
        ("Account Details", '{t("membership.shareIssue.accountDetails")}'),
        ("Transaction Details", '{t("membership.shareIssue.transactionDetails")}'),
        ('label="Available Balance"', 'label={t("membership.shareIssue.fields.availableBalance")}'),
        ('label="No. of Share"', 'label={t("membership.shareIssue.fields.numberOfShares")}'),
        ('label="Rate of Share"', 'label={t("membership.shareIssue.fields.rateOfShare")}'),
        ('label="Total"', 'label={t("membership.shareIssue.fields.total")}'),
        ('placeholder="Enter available balance"', 'placeholder={t("membership.shareIssue.placeholders.availableBalance")}'),
        ('placeholder="Enter balance"', 'placeholder={t("membership.shareIssue.placeholders.balance")}'),
        ('placeholder="Enter number of share"', 'placeholder={t("membership.shareIssue.placeholders.numberOfShares")}'),
        ('placeholder="Enter rate per share"', 'placeholder={t("membership.shareIssue.placeholders.rateOfShare")}'),
        ('placeholder="Enter total amount"', 'placeholder={t("membership.shareIssue.placeholders.total")}'),
        ('placeholder="Total amount in words"', 'placeholder={t("membership.shareIssue.placeholders.totalInWords")}'),
    ],
)

process(
    "shareRefund/index.jsx",
    paymentish("membership.shareRefund")
    + [
        ("Account Details", '{t("membership.shareRefund.accountDetails")}'),
        ("Transaction Details", '{t("membership.shareRefund.transactionDetails")}'),
        ('label="Share Balance"', 'label={t("membership.shareRefund.fields.shareBalance")}'),
        ('label="Refund"', 'label={t("membership.shareRefund.fields.refund")}'),
        ('placeholder="Enter share balance"', 'placeholder={t("membership.shareRefund.placeholders.shareBalance")}'),
        ('placeholder="Enter refund amount"', 'placeholder={t("membership.shareRefund.placeholders.refund")}'),
        ('placeholder="Total amount in words"', 'placeholder={t("membership.shareRefund.fields.totalInWords")}'),
    ],
)

process(
    "membershipWithdrawn/index.jsx",
    paymentish("membership.withdrawn")
    + [
        ("Basic Info Block", '{t("membership.withdrawn.basicInfo")}'),
        ("Nominee Block", '{t("membership.withdrawn.nomineeBlock")}'),
        ("Withdraw Details Block", '{t("membership.withdrawn.withdrawDetails")}'),
        ("Transanction Block", '{t("membership.withdrawn.transactionBlock")}'),
        ('label="Nominee Name"', 'label={t("membership.withdrawn.fields.nomineeName")}'),
        ('label="Nominee Relation"', 'label={t("membership.withdrawn.fields.nomineeRelation")}'),
        ('label="Nominee Age"', 'label={t("membership.withdrawn.fields.nomineeAge")}'),
        ('label="Share Balance"', 'label={t("membership.withdrawn.fields.shareBalance")}'),
        ('label="Dividend Balance"', 'label={t("membership.withdrawn.fields.dividendBalance")}'),
        ('label="Withdraw Reason"', 'label={t("membership.withdrawn.fields.withdrawReason")}'),
        ('label="Ref. Vouch No."', 'label={t("membership.withdrawn.fields.refVoucherNo")}'),
        ('placeholder="Enter nominee name"', 'placeholder={t("membership.withdrawn.placeholders.nomineeName")}'),
        ('placeholder="Enter nominee relation"', 'placeholder={t("membership.withdrawn.placeholders.nomineeRelation")}'),
        ('placeholder="Enter nominee age"', 'placeholder={t("membership.withdrawn.placeholders.nomineeAge")}'),
        ('placeholder="Enter share balance"', 'placeholder={t("membership.withdrawn.placeholders.shareBalance")}'),
        ('placeholder="Enter dividend balance"', 'placeholder={t("membership.withdrawn.placeholders.dividendBalance")}'),
        ('placeholder="Enter withdraw reason"', 'placeholder={t("membership.withdrawn.placeholders.withdrawReason")}'),
    ],
)

process(
    "issueMembership/index.jsx",
    paymentish("membership.issueMembership")
    + [
        ("Basic Info Block", '{t("membership.issueMembership.basicInfo")}'),
        ("Admission Block", '{t("membership.issueMembership.admission")}'),
        ("Nominee Block", '{t("membership.issueMembership.nominee")}'),
        ("Transanction Block", '{t("membership.issueMembership.transaction")}'),
        ('label="Member Type"', 'label={t("membership.issueMembership.fields.memberType")}'),
        ('label="Admission Date"', 'label={t("membership.issueMembership.fields.admissionDate")}'),
        ('label="Admission No."', 'label={t("membership.issueMembership.fields.admissionNo")}'),
        ('label="Admission Fees"', 'label={t("membership.issueMembership.fields.admissionFees")}'),
        ('label="Nominee Name"', 'label={t("membership.issueMembership.fields.nomineeName")}'),
        ('label="Nominee Relation"', 'label={t("membership.issueMembership.fields.nomineeRelation")}'),
        ('label="Nominee Age"', 'label={t("membership.issueMembership.fields.nomineeAge")}'),
        ('label="Nominee Address"', 'label={t("membership.issueMembership.fields.nomineeAddress")}'),
        ('label="Number of Share"', 'label={t("membership.issueMembership.fields.numberOfShare")}'),
        ('label="Rate Per Share"', 'label={t("membership.issueMembership.fields.ratePerShare")}'),
        ('label="Total Amount"', 'label={t("membership.issueMembership.fields.totalAmount")}'),
        ('label="Total Amount In Words"', 'label={t("membership.issueMembership.fields.totalInWords")}'),
        ('label="Available Balance"', 'label={t("membership.issueMembership.fields.availableBalance")}'),
        ('label="Ref. Vouch No."', 'label={t("membership.issueMembership.fields.refVoucherNo")}'),
        ('placeholder="Select member type"', 'placeholder={t("membership.issueMembership.placeholders.memberType")}'),
        ('searchPlaceholder="Search member type..."', 'searchPlaceholder={t("membership.issueMembership.placeholders.searchMemberType")}'),
        ('placeholder="Enter admission no."', 'placeholder={t("membership.issueMembership.placeholders.admissionNo")}'),
        ('placeholder="Enter nominee name"', 'placeholder={t("membership.issueMembership.placeholders.nomineeName")}'),
        ('placeholder="Select nominee relation"', 'placeholder={t("membership.issueMembership.placeholders.nomineeRelation")}'),
        ('searchPlaceholder="Search nominee relation..."', 'searchPlaceholder={t("membership.issueMembership.placeholders.searchNomineeRelation")}'),
        ('placeholder="Enter nominee age"', 'placeholder={t("membership.issueMembership.placeholders.nomineeAge")}'),
        ('placeholder="Enter nominee address"', 'placeholder={t("membership.issueMembership.placeholders.nomineeAddress")}'),
        ('placeholder="Enter number of share"', 'placeholder={t("membership.issueMembership.placeholders.numberOfShare")}'),
        ('placeholder="Enter rate per share"', 'placeholder={t("membership.issueMembership.placeholders.ratePerShare")}'),
        ('placeholder="Enter total amount"', 'placeholder={t("membership.issueMembership.placeholders.totalAmount")}'),
        ('placeholder="Total amount in words"', 'placeholder={t("membership.issueMembership.placeholders.totalInWords")}'),
        ('placeholder="Enter balance"', 'placeholder={t("membership.issueMembership.placeholders.balance")}'),
    ],
)

for f in ["shareIssue/ShareIssueReceipt.jsx", "issueMembership/ShareIssueReceipt.jsx"]:
    process(
        f,
        [
            ('"Cancel"', 't("common.buttons.cancel")'),
            ('"Print"', 't("common.buttons.print")'),
            (">Cancel<", '>{t("common.buttons.cancel")}<'),
            (">Print<", '>{t("common.buttons.print")}<'),
        ],
    )

# ---------- calculateDividend ----------
process(
    "calculateDividend/index.jsx",
    [
        ("Calculate Dividend", '{t("membership.calculateDividend.title")}'),
        ("Account Info Block", '{t("membership.calculateDividend.accountInfo")}'),
        ('label="From Date"', 'label={t("membership.calculateDividend.fields.fromDate")}'),
        ('label="Upto Date"', 'label={t("membership.calculateDividend.fields.uptoDate")}'),
        ('label="Posting Date"', 'label={t("membership.calculateDividend.fields.postingDate")}'),
        ('label="Dividend Rate"', 'label={t("membership.calculateDividend.fields.dividendRate")}'),
        ('placeholder="Enter rate"', 'placeholder={t("membership.calculateDividend.placeholders.rate")}'),
        (">Sl.<", '>{t("membership.calculateDividend.table.sl")}<'),
        (">Member Code<", '>{t("membership.calculateDividend.fields.memberCode")}<'),
        (">Member Name<", '>{t("membership.calculateDividend.fields.memberName")}<'),
        (">Guardian Name<", '>{t("membership.calculateDividend.fields.guardianName")}<'),
        (">Village<", '>{t("membership.calculateDividend.fields.village")}<'),
        (">Share Balance<", '>{t("membership.calculateDividend.fields.shareBalance")}<'),
        (">Dividend Amount<", '>{t("membership.calculateDividend.fields.dividendAmount")}<'),
    ],
)
process(
    "calculateDividend/PreviewModal.jsx",
    [
        (">Sl.<", '>{t("membership.calculateDividend.table.sl")}<'),
        (">Member Code<", '>{t("membership.calculateDividend.fields.memberCode")}<'),
        (">Member Name<", '>{t("membership.calculateDividend.fields.memberName")}<'),
        (">Guardian Name<", '>{t("membership.calculateDividend.fields.guardianName")}<'),
        (">Village<", '>{t("membership.calculateDividend.fields.village")}<'),
        (">Share Balance<", '>{t("membership.calculateDividend.fields.shareBalance")}<'),
        (">Dividend Amount<", '>{t("membership.calculateDividend.fields.dividendAmount")}<'),
    ],
)

process(
    "generateCertificate/index.jsx",
    [
        ("Generate Certificate", '{t("membership.generateCertificate.title")}'),
        ("Share Certificate", '{t("membership.generateCertificate.shareCertificate")}'),
        ('label="Member No."', 'label={t("membership.generateCertificate.fields.memberNo")}'),
        ('placeholder="Enter member no."', 'placeholder={t("membership.generateCertificate.placeholders.memberNo")}'),
        ('label="Issue Date"', 'label={t("membership.generateCertificate.fields.issueDate")}'),
        ('label="Issue Amount"', 'label={t("membership.generateCertificate.fields.issueAmount")}'),
        (">Serial No.<", '>{t("membership.generateCertificate.table.serialNo")}<'),
        (">Action<", '>{t("membership.generateCertificate.table.action")}<'),
        ('"Generate"', 't("membership.generateCertificate.buttons.generate")'),
        ('"Print"', 't("membership.generateCertificate.buttons.print")'),
        (">Generate<", '>{t("membership.generateCertificate.buttons.generate")}<'),
        (">Print<", '>{t("membership.generateCertificate.buttons.print")}<'),
    ],
)

# ---------- profiles ----------
process(
    "memberProfile/index.jsx",
    [
        ("Member KYC", '{t("membership.memberProfile.title")}'),
        ("Add New Profile", '{t("membership.memberProfile.addNew")}'),
        ("Update Existing Profile", '{t("membership.memberProfile.updateExisting")}'),
        ("Permanent Address", '{t("membership.memberProfile.permanentAddress")}'),
        ("Present Address", '{t("membership.memberProfile.presentAddress")}'),
        ('label="Member No."', 'label={t("membership.memberProfile.fields.memberNo")}'),
        ('label="Customer Type"', 'label={t("membership.memberProfile.fields.customerType")}'),
        ('label="Member First Name"', 'label={t("membership.memberProfile.fields.firstName")}'),
        ('label="Member Middle Name"', 'label={t("membership.memberProfile.fields.middleName")}'),
        ('label="Member Last Name"', 'label={t("membership.memberProfile.fields.lastName")}'),
        ('label="Relation Name"', 'label={t("membership.memberProfile.fields.relationName")}'),
        ('label="Relation Type"', 'label={t("membership.memberProfile.fields.relationType")}'),
        ('label="Date of Birth"', 'label={t("membership.memberProfile.fields.dateOfBirth")}'),
        ('label="Gender"', 'label={t("membership.memberProfile.fields.gender")}'),
        ('label="Caste"', 'label={t("membership.memberProfile.fields.caste")}'),
        ('label="Religion"', 'label={t("membership.memberProfile.fields.religion")}'),
        ('label="Mobile No."', 'label={t("membership.memberProfile.fields.mobileNo")}'),
        ('label="Email"', 'label={t("membership.memberProfile.fields.email")}'),
        ('label="Aadhaar No."', 'label={t("membership.memberProfile.fields.aadhaarNo")}'),
        ('label="Voter Id"', 'label={t("membership.memberProfile.fields.voterId")}'),
        ('label="Ration Card"', 'label={t("membership.memberProfile.fields.rationCard")}'),
        ('label="Pan Card"', 'label={t("membership.memberProfile.fields.panCard")}'),
        ('label="State"', 'label={t("membership.memberProfile.fields.state")}'),
        ('label="District"', 'label={t("membership.memberProfile.fields.district")}'),
        ('label="Block/Municipality"', 'label={t("membership.memberProfile.fields.block")}'),
        ('label="Village"', 'label={t("membership.memberProfile.fields.village")}'),
        ('label="Police Station"', 'label={t("membership.memberProfile.fields.policeStation")}'),
        ('label="Post Office"', 'label={t("membership.memberProfile.fields.postOffice")}'),
        ('placeholder="Enter member no."', 'placeholder={t("membership.memberProfile.placeholders.memberNo")}'),
        ('placeholder="Enter first name"', 'placeholder={t("membership.memberProfile.placeholders.firstName")}'),
        ('placeholder="Enter middle name"', 'placeholder={t("membership.memberProfile.placeholders.middleName")}'),
        ('placeholder="Enter last name"', 'placeholder={t("membership.memberProfile.placeholders.lastName")}'),
        ('placeholder="Enter relation name"', 'placeholder={t("membership.memberProfile.placeholders.relationName")}'),
        ('placeholder="Enter mobile no."', 'placeholder={t("membership.memberProfile.placeholders.mobileNo")}'),
        ('placeholder="Enter email"', 'placeholder={t("membership.memberProfile.placeholders.email")}'),
        ('placeholder="Enter aadhaar no"', 'placeholder={t("membership.memberProfile.placeholders.aadhaarNo")}'),
        ('placeholder="Enter voter id"', 'placeholder={t("membership.memberProfile.placeholders.voterId")}'),
        ('placeholder="Enter ration no."', 'placeholder={t("membership.memberProfile.placeholders.rationCard")}'),
        ('placeholder="Enter pan no."', 'placeholder={t("membership.memberProfile.placeholders.panCard")}'),
        ('placeholder="Enter address"', 'placeholder={t("membership.memberProfile.placeholders.address")}'),
        (
            'label={addressLabel}',
            'label={addressLabel === "Address" ? t("membership.memberProfile.fields.address") : addressLabel}',
        ),
        ('"Add"', 't("common.buttons.add")'),
        ('"Update"', 't("common.buttons.update")'),
    ],
    "MemberProfile",
    also_hooks_for=["AddressSectionFields"],
)

process(
    "groupProfile/index.jsx",
    [
        ("Group KYC", '{t("membership.groupProfile.title")}'),
        ("Add New Profile", '{t("membership.groupProfile.addNew")}'),
        ("Update Existing Profile", '{t("membership.groupProfile.updateExisting")}'),
        ('label="Group No."', 'label={t("membership.groupProfile.fields.groupNo")}'),
        ('label="Group Name"', 'label={t("membership.groupProfile.fields.groupName")}'),
        ('label="Group Type"', 'label={t("membership.groupProfile.fields.groupType")}'),
        ('label="Date of Formation"', 'label={t("membership.groupProfile.fields.dateOfFormation")}'),
        ('label="Mobile No."', 'label={t("membership.groupProfile.fields.mobileNo")}'),
        ('label="No Of Beneficiary"', 'label={t("membership.groupProfile.fields.noOfBeneficiary")}'),
        ('label="Address"', 'label={t("membership.groupProfile.fields.address")}'),
        ('label="State"', 'label={t("membership.groupProfile.fields.state")}'),
        ('label="District"', 'label={t("membership.groupProfile.fields.district")}'),
        ('label="Block/Municipality"', 'label={t("membership.groupProfile.fields.block")}'),
        ('label="Village"', 'label={t("membership.groupProfile.fields.village")}'),
        ('label="Police Station"', 'label={t("membership.groupProfile.fields.policeStation")}'),
        ('label="Post Office"', 'label={t("membership.groupProfile.fields.postOffice")}'),
        ('placeholder="Enter group no."', 'placeholder={t("membership.groupProfile.placeholders.groupNo")}'),
        ('placeholder="Enter group name"', 'placeholder={t("membership.groupProfile.placeholders.groupName")}'),
        ('placeholder="Enter mobile no."', 'placeholder={t("membership.groupProfile.placeholders.mobileNo")}'),
        ('placeholder="Enter no of beneficiary"', 'placeholder={t("membership.groupProfile.placeholders.noOfBeneficiary")}'),
        ('placeholder="Enter address"', 'placeholder={t("membership.groupProfile.placeholders.address")}'),
        ('placeholder="Enter Address"', 'placeholder={t("membership.groupProfile.placeholders.addressAlt")}'),
        ('"Add"', 't("common.buttons.add")'),
        ('"Update"', 't("common.buttons.update")'),
    ],
)

process(
    "institutionProfile/index.jsx",
    [
        ("Institution KYC", '{t("membership.institutionProfile.title")}'),
        ("Add New Profile", '{t("membership.institutionProfile.addNew")}'),
        ("Update Existing Profile", '{t("membership.institutionProfile.updateExisting")}'),
        ('label="Institution Name"', 'label={t("membership.institutionProfile.fields.institutionName")}'),
        ('label="Date of Formation"', 'label={t("membership.institutionProfile.fields.dateOfFormation")}'),
        ('label="Reg. / Docoument No"', 'label={t("membership.institutionProfile.fields.regDocNo")}'),
        ('label="Mobile No."', 'label={t("membership.institutionProfile.fields.mobileNo")}'),
        ('label="No Of Beneficiary"', 'label={t("membership.institutionProfile.fields.noOfBeneficiary")}'),
        ('label="Office Address"', 'label={t("membership.institutionProfile.fields.officeAddress")}'),
        ('label="Register Address"', 'label={t("membership.institutionProfile.fields.registerAddress")}'),
        ('label="State"', 'label={t("membership.institutionProfile.fields.state")}'),
        ('label="District"', 'label={t("membership.institutionProfile.fields.district")}'),
        ('label="Block"', 'label={t("membership.institutionProfile.fields.block")}'),
        ('label="Village"', 'label={t("membership.institutionProfile.fields.village")}'),
        ('label="Police Station"', 'label={t("membership.institutionProfile.fields.policeStation")}'),
        ('label="Post Office"', 'label={t("membership.institutionProfile.fields.postOffice")}'),
        ('placeholder="Enter institution name"', 'placeholder={t("membership.institutionProfile.placeholders.institutionName")}'),
        ('placeholder="Enter Registration / Document No"', 'placeholder={t("membership.institutionProfile.placeholders.regDocNo")}'),
        ('placeholder="Enter mobile no."', 'placeholder={t("membership.institutionProfile.placeholders.mobileNo")}'),
        ('placeholder="Enter no of beneficiary"', 'placeholder={t("membership.institutionProfile.placeholders.noOfBeneficiary")}'),
        ('placeholder="Enter address"', 'placeholder={t("membership.institutionProfile.placeholders.address")}'),
        ('"Add"', 't("common.buttons.add")'),
        ('"Update"', 't("common.buttons.update")'),
    ],
)

MAP_COMMON = [
    ("Add New Member", '{t("membership.mapGroupMember.addNew")}'),
    ("View Existing Members", '{t("membership.mapGroupMember.viewExisting")}'),
    ('label="Group No."', 'label={t("membership.mapGroupMember.fields.groupNo")}'),
    ('label="Group Name"', 'label={t("membership.mapGroupMember.fields.groupName")}'),
    ('label="Group CIF"', 'label={t("membership.mapGroupMember.fields.groupCif")}'),
    ('label="Formation Date"', 'label={t("membership.mapGroupMember.fields.formationDate")}'),
    ('label="No. of Members"', 'label={t("membership.mapGroupMember.fields.noOfMembers")}'),
    ('label="Member No."', 'label={t("membership.mapGroupMember.fields.memberNo")}'),
    ('label="Member CIF"', 'label={t("membership.mapGroupMember.fields.memberCif")}'),
    ('label="Member Name"', 'label={t("membership.mapGroupMember.fields.memberName")}'),
    ('label="Guardian Name"', 'label={t("membership.mapGroupMember.fields.guardianName")}'),
    ('label="Address"', 'label={t("membership.mapGroupMember.fields.address")}'),
    ('label="Mobile No."', 'label={t("membership.mapGroupMember.fields.mobileNo")}'),
    ('label="Branch Name"', 'label={t("membership.mapGroupMember.fields.branchName")}'),
    ('label="CIF No."', 'label={t("membership.mapGroupMember.fields.cifNo")}'),
    ('label="Relation"', 'label={t("membership.mapGroupMember.fields.relation")}'),
    ('label="Designation"', 'label={t("membership.mapGroupMember.fields.designation")}'),
    ('label="Join Date"', 'label={t("membership.mapGroupMember.fields.joinDate")}'),
    ('label="Joining Date"', 'label={t("membership.mapGroupMember.fields.joiningDate")}'),
    ('label="Withdrawn Date"', 'label={t("membership.mapGroupMember.fields.withdrawnDate")}'),
    ('label="Status"', 'label={t("membership.mapGroupMember.fields.status")}'),
    ('label="Default Savings"', 'label={t("membership.mapGroupMember.fields.defaultSavings")}'),
    ('label="Savings A/C"', 'label={t("membership.mapGroupMember.fields.savingsAc")}'),
    ('placeholder="Enter remarks"', 'placeholder={t("membership.mapGroupMember.placeholders.remarks")}'),
    ('placeholder="Search..."', 'placeholder={t("membership.mapGroupMember.placeholders.search")}'),
    ('placeholder="Select date"', 'placeholder={t("membership.mapGroupMember.placeholders.date")}'),
    ('placeholder="Select designation"', 'placeholder={t("membership.mapGroupMember.placeholders.designation")}'),
    ('placeholder="Select savings account"', 'placeholder={t("membership.mapGroupMember.placeholders.savings")}'),
    ('"Cancel"', 't("common.buttons.cancel")'),
    ('"Edit"', 't("common.buttons.edit")'),
    (">Cancel<", '>{t("common.buttons.cancel")}<'),
    (">Edit<", '>{t("common.buttons.edit")}<'),
    (">Actions<", '>{t("membership.mapGroupMember.table.actions")}<'),
    (">Action<", '>{t("membership.mapGroupMember.table.action")}<'),
    (">#<", '>{t("membership.mapGroupMember.table.hash")}<'),
]
process("mapgroupmember/index.jsx", MAP_COMMON)
process(
    "mapinstitutemember/index.jsx",
    [
        (a, b.replace("membership.mapGroupMember", "membership.mapInstituteMember"))
        for a, b in MAP_COMMON
    ],
)

print("wire done")
