# -*- coding: utf-8 -*-
"""Fix membership i18n: broken stringified t(), wrong keys, remaining static strings."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
COMP = ROOT / "components" / "membership"
LOC = ROOT / "i18n" / "locales"

# --- 1) Fix stringified t() ---
STRINGIFIED = [
    (
        'label: "{t("membership.memberProfile.addNew")}"',
        'label: t("membership.memberProfile.modes.addNew")',
    ),
    (
        'label: "{t("membership.memberProfile.updateExisting")}"',
        'label: t("membership.memberProfile.modes.updateExisting")',
    ),
    (
        'addressLabel="{t("membership.memberProfile.permanentAddress")}"',
        'addressLabel={t("membership.memberProfile.fields.address")}',
    ),
    (
        'addressLabel="{t("membership.memberProfile.presentAddress")}"',
        'addressLabel={t("membership.memberProfile.fields.address")}',
    ),
    (
        'addressLabel={t("membership.memberProfile.sections.permanentAddress")}',
        'addressLabel={t("membership.memberProfile.fields.address")}',
    ),
    (
        'addressLabel={t("membership.memberProfile.sections.presentAddress")}',
        'addressLabel={t("membership.memberProfile.fields.address")}',
    ),
    (
        'label: "{t("membership.groupProfile.addNew")}"',
        'label: t("membership.groupProfile.modes.addNew")',
    ),
    (
        'label: "{t("membership.groupProfile.updateExisting")}"',
        'label: t("membership.groupProfile.modes.updateExisting")',
    ),
    (
        'label: "{t("membership.institutionProfile.addNew")}"',
        'label: t("membership.institutionProfile.modes.addNew")',
    ),
    (
        'label: "{t("membership.institutionProfile.updateExisting")}"',
        'label: t("membership.institutionProfile.modes.updateExisting")',
    ),
    (
        'label: "{t("membership.mapGroupMember.viewExisting")}"',
        'label: t("membership.mapGroupMember.modes.viewExisting")',
    ),
    (
        'label: "{t("membership.mapGroupMember.addNew")}"',
        'label: t("membership.mapGroupMember.modes.addNew")',
    ),
    (
        'label: "{t("membership.mapInstituteMember.viewExisting")}"',
        'label: t("membership.mapInstituteMember.modes.viewExisting")',
    ),
    (
        'label: "{t("membership.mapInstituteMember.addNew")}"',
        'label: t("membership.mapInstituteMember.modes.addNew")',
    ),
]

# --- 2) Global key path fixes in components ---
KEY_FIXES = [
    ('membership.memberEnquiry.fields.guardian', 'membership.memberEnquiry.fields.gurdian'),
    ('membership.memberEnquiry.placeholders.guardian', 'membership.memberEnquiry.placeholders.gurdian'),
    ('membership.memberEnquiry.personalDetails', 'membership.memberEnquiry.sections.personalDetails'),
    ('membership.memberEnquiry.memberTypes.individual', 'memberSearch.individualCustomer'),
    ('membership.memberEnquiry.memberTypes.group', 'memberSearch.group'),
    ('membership.memberEnquiry.memberTypes.institution', 'memberSearch.institution'),
    ('membership.memberEnquiry.memberTypes.staff', 'memberSearch.staff'),
    ('membership.memberEnquiry.buttons.next', 'memberSearch.next'),
    ('membership.memberEnquiry.buttons.search', 'memberSearch.search'),
    ('membership.memberEnquiry.placeholders.memberName', 'memberSearch.searchByMemberName'),
    ('membership.memberProfile.addNew', 'membership.memberProfile.modes.addNew'),
    ('membership.memberProfile.updateExisting', 'membership.memberProfile.modes.updateExisting'),
    ('membership.memberProfile.permanentAddress', 'membership.memberProfile.sections.permanentAddress'),
    ('membership.memberProfile.presentAddress', 'membership.memberProfile.sections.presentAddress'),
    ('membership.memberProfile.fields.block"', 'membership.memberProfile.fields.blockMunicipality"'),
    ('membership.groupProfile.addNew', 'membership.groupProfile.modes.addNew'),
    ('membership.groupProfile.updateExisting', 'membership.groupProfile.modes.updateExisting'),
    ('membership.groupProfile.fields.block"', 'membership.groupProfile.fields.blockMunicipality"'),
    ('membership.groupProfile.placeholders.addressAlt', 'membership.groupProfile.placeholders.address'),
    ('membership.institutionProfile.addNew', 'membership.institutionProfile.modes.addNew'),
    ('membership.institutionProfile.updateExisting', 'membership.institutionProfile.modes.updateExisting'),
    ('membership.institutionProfile.fields.regDocNo', 'membership.institutionProfile.fields.regDocumentNo'),
    ('membership.institutionProfile.placeholders.regDocNo', 'membership.institutionProfile.placeholders.regDocumentNo'),
    ('membership.institutionProfile.fields.officeAddress', 'membership.institutionProfile.sections.officeAddress'),
    ('membership.institutionProfile.fields.registerAddress', 'membership.institutionProfile.sections.registerAddress'),
    ('membership.withdrawn.basicInfo', 'membership.withdrawn.sections.basicInfoBlock'),
    ('membership.withdrawn.nomineeBlock', 'membership.withdrawn.sections.nomineeBlock'),
    ('membership.withdrawn.withdrawDetails', 'membership.withdrawn.sections.withdrawDetailsBlock'),
    ('membership.withdrawn.transactionBlock', 'membership.withdrawn.sections.transanctionBlock'),
    ('membership.withdrawn.fields.guardianName', 'membership.withdrawn.fields.gurdianName'),
    ('membership.withdrawn.placeholders.guardianName', 'membership.withdrawn.placeholders.gurdianName'),
    ('membership.withdrawn.fields.refVoucherNo', 'membership.withdrawn.fields.refVouchNo'),
    ('membership.withdrawn.placeholders.refVoucherNo', 'membership.withdrawn.placeholders.refVouchNo'),
    ('membership.shareIssue.accountDetails', 'membership.shareIssue.sections.accountDetails'),
    ('membership.shareIssue.transactionDetails', 'membership.shareIssue.sections.transactionDetails'),
    ('membership.shareIssue.fields.guardianName', 'membership.shareIssue.fields.gurdianName'),
    ('membership.shareIssue.placeholders.guardianName', 'membership.shareIssue.placeholders.gurdianName'),
    ('membership.shareIssue.fields.numberOfShares', 'membership.shareIssue.fields.noOfShare'),
    ('membership.shareIssue.placeholders.numberOfShares', 'membership.shareIssue.placeholders.noOfShare'),
    ('membership.shareIssue.placeholders.totalInWords', 'membership.shareIssue.placeholders.totalAmountInWords'),
    ('membership.shareIssue.fields.refVoucherNo', 'membership.shareIssue.fields.refVouchNo'),
    ('membership.shareIssue.placeholders.refVoucherNo', 'membership.shareIssue.placeholders.refVouchNo'),
    ('membership.shareRefund.accountDetails', 'membership.shareRefund.sections.accountDetails'),
    ('membership.shareRefund.transactionDetails', 'membership.shareRefund.sections.transactionDetails'),
    ('membership.shareRefund.fields.guardianName', 'membership.shareRefund.fields.gurdianName'),
    ('membership.shareRefund.placeholders.guardianName', 'membership.shareRefund.placeholders.gurdianName'),
    ('membership.shareRefund.fields.totalInWords', 'membership.shareRefund.placeholders.totalAmountInWords'),
    ('membership.shareRefund.fields.refVoucherNo', 'membership.shareRefund.fields.refVouchNo'),
    ('membership.shareRefund.placeholders.refVoucherNo', 'membership.shareRefund.placeholders.refVouchNo'),
    ('membership.issueMembership.basicInfo', 'membership.issueMembership.sections.basicInfoBlock'),
    ('membership.issueMembership.admission', 'membership.issueMembership.sections.admissionBlock'),
    ('membership.issueMembership.nominee', 'membership.issueMembership.sections.nomineeBlock'),
    ('membership.issueMembership.transaction', 'membership.issueMembership.sections.transanctionBlock'),
    ('membership.issueMembership.fields.guardianName', 'membership.issueMembership.fields.gurdianName'),
    ('membership.issueMembership.placeholders.guardianName', 'membership.issueMembership.placeholders.gurdianName'),
    ('membership.issueMembership.fields.totalInWords', 'membership.issueMembership.fields.totalAmountInWords'),
    ('membership.issueMembership.placeholders.totalInWords', 'membership.issueMembership.placeholders.totalAmountInWords'),
    ('membership.issueMembership.fields.refVoucherNo', 'membership.issueMembership.fields.refVouchNo'),
    ('membership.issueMembership.placeholders.refVoucherNo', 'membership.issueMembership.placeholders.refVouchNo'),
    ('membership.issueMembership.placeholders.balance', 'membership.issueMembership.placeholders.availableBalance'),
    ('membership.calculateDividend.accountInfo', 'membership.calculateDividend.sections.accountInfoBlock'),
    ('membership.calculateDividend.placeholders.rate', 'membership.calculateDividend.placeholders.dividendRate'),
    ('membership.calculateDividend.table.sl', 'membership.calculateDividend.table.sl'),
    ('membership.calculateDividend.fields.memberCode', 'membership.calculateDividend.table.memberCode'),
    ('membership.calculateDividend.fields.memberName', 'membership.calculateDividend.table.memberName'),
    ('membership.calculateDividend.fields.guardianName', 'membership.calculateDividend.table.guardianName'),
    ('membership.calculateDividend.fields.village', 'membership.calculateDividend.table.village'),
    ('membership.calculateDividend.fields.shareBalance', 'membership.calculateDividend.table.shareBalance'),
    ('membership.calculateDividend.fields.dividendAmount', 'membership.calculateDividend.table.dividendAmount'),
    ('membership.generateCertificate.shareCertificate', 'membership.generateCertificate.certificate.shareCertificateNo'),
    ('membership.generateCertificate.fields.issueDate', 'membership.generateCertificate.table.issueDate'),
    ('membership.generateCertificate.fields.issueAmount', 'membership.generateCertificate.table.issueAmount'),
    ('membership.generateCertificate.buttons.generate', 'common.buttons.generate'),
    ('membership.generateCertificate.buttons.print', 'common.buttons.print'),
    ('membership.passbookPrint.buttons.print', 'common.buttons.print'),
    ('membership.passbookPrint.buttons.next', 'common.next'),
    ('membership.mapGroupMember.addNew', 'membership.mapGroupMember.modes.addNew'),
    ('membership.mapGroupMember.viewExisting', 'membership.mapGroupMember.modes.viewExisting'),
    ('membership.mapGroupMember.placeholders.date', 'membership.mapGroupMember.placeholders.selectDate'),
    ('membership.mapGroupMember.placeholders.savings', 'membership.mapGroupMember.placeholders.defaultSavings'),
    ('membership.mapInstituteMember.addNew', 'membership.mapInstituteMember.modes.addNew'),
    ('membership.mapInstituteMember.viewExisting', 'membership.mapInstituteMember.modes.viewExisting'),
    ('membership.reports.preview.slNo', 'membership.reports.print.slNo'),
    ('membership.reports.preview.date', 'membership.reports.print.date'),
    ('membership.reports.preview.memberType', 'membership.reports.print.memberType'),
    ('membership.reports.preview.customerName', 'membership.reports.print.customerName'),
    ('membership.reports.preview.guardianName', 'membership.reports.print.guardianName'),
    ('membership.reports.preview.village', 'membership.reports.print.village'),
    ('membership.reports.preview.lfNo', 'membership.reports.print.lfNo'),
    ('membership.reports.preview.opening', 'membership.reports.print.opening'),
    ('membership.reports.preview.issue', 'membership.reports.print.issue'),
    ('membership.reports.preview.release', 'membership.reports.print.release'),
    ('membership.reports.preview.closing', 'membership.reports.print.closing'),
    ('membership.reports.preview.divBal', 'membership.reports.print.divBal'),
    ('membership.reports.preview.balance', 'membership.reports.print.balance'),
    ('membership.reports.preview.admFees', 'membership.reports.print.admFees'),
    ('membership.reports.preview.transMode', 'membership.reports.print.transMode'),
    ('membership.reports.preview.noOfShare', 'membership.reports.print.noOfShare'),
    ('membership.reports.preview.amount', 'membership.reports.print.amount'),
]


def fix_file(path: Path):
    text = path.read_text(encoding="utf-8")
    orig = text
    for a, b in STRINGIFIED:
        text = text.replace(a, b)
    for a, b in KEY_FIXES:
        text = text.replace(a, b)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("fixed keys", path.relative_to(COMP))


# --- 3) Multiline table headers in memberEnquiry ---
def fix_member_enquiry():
    path = COMP / "memberEnquiry" / "index.jsx"
    text = path.read_text(encoding="utf-8")
    reps = [
        (
            """                                  <TableHead className="whitespace-nowrap">
                                    Serial No.
                                  </TableHead>""",
            """                                  <TableHead className="whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.serialNo")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    Status
                                  </TableHead>""",
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.status")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    Balance
                                  </TableHead>""",
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.balance")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-right whitespace-nowrap">
                                    Action
                                  </TableHead>""",
            """                                  <TableHead className="text-right whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.action")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    Account No.
                                  </TableHead>""",
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.accountNo")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    Product Name
                                  </TableHead>""",
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.productName")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    Maturity Date
                                  </TableHead>""",
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.maturityDate")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    Repay Mode
                                  </TableHead>""",
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.repayMode")}
                                  </TableHead>""",
        ),
        (
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    Repay Within
                                  </TableHead>""",
            """                                  <TableHead className="text-center whitespace-nowrap">
                                    {t("membership.memberEnquiry.table.repayWithin")}
                                  </TableHead>""",
        ),
        ("Same as Permanent Address", '{t("membership.memberProfile.sameAsPermanent")}'),
    ]
    for a, b in reps:
        if a not in text:
            # try simpler single-line leftovers
            continue
        text = text.replace(a, b)
    # simple leftovers
    simple = [
        ("\n                                    Serial No.\n", '\n                                    {t("membership.memberEnquiry.table.serialNo")}\n'),
        ("\n                                    Status\n", '\n                                    {t("membership.memberEnquiry.table.status")}\n'),
        ("\n                                    Balance\n", '\n                                    {t("membership.memberEnquiry.table.balance")}\n'),
        ("\n                                    Action\n", '\n                                    {t("membership.memberEnquiry.table.action")}\n'),
        ("\n                                    Account No.\n", '\n                                    {t("membership.memberEnquiry.table.accountNo")}\n'),
        ("\n                                    Product Name\n", '\n                                    {t("membership.memberEnquiry.table.productName")}\n'),
        ("\n                                    Maturity Date\n", '\n                                    {t("membership.memberEnquiry.table.maturityDate")}\n'),
        ("\n                                    Repay Mode\n", '\n                                    {t("membership.memberEnquiry.table.repayMode")}\n'),
        ("\n                                    Repay Within\n", '\n                                    {t("membership.memberEnquiry.table.repayWithin")}\n'),
    ]
    for a, b in simple:
        text = text.replace(a, b)
    path.write_text(text, encoding="utf-8")
    print("memberEnquiry tables")


def fix_preview_headers():
    mapping = {
        "SL. NO.": 't("membership.reports.print.slNo")',
        "DATE": 't("membership.reports.print.date")',
        "MEMBER TYPE": 't("membership.reports.print.memberType")',
        "CUSTOMER NAME": 't("membership.reports.print.customerName")',
        "GUARDIAN NAME": 't("membership.reports.print.guardianName")',
        "VILLAGE": 't("membership.reports.print.village")',
        "L/F. NO.": 't("membership.reports.print.lfNo")',
        "OPENING": 't("membership.reports.print.opening")',
        "ISSUE": 't("membership.reports.print.issue")',
        "RELEASE": 't("membership.reports.print.release")',
        "CLOSING": 't("membership.reports.print.closing")',
        "DIV. BAL.": 't("membership.reports.print.divBal")',
        "BALANCE": 't("membership.reports.print.balance")',
        "ADM. FEES": 't("membership.reports.print.admFees")',
        "TRANS. MODE": 't("membership.reports.print.transMode")',
        "NO. OF SHARE": 't("membership.reports.print.noOfShare")',
        "AMOUNT": 't("membership.reports.print.amount")',
    }
    for path in (COMP / "report").glob("*Preview.jsx"):
        text = path.read_text(encoding="utf-8")
        for eng, tcall in mapping.items():
            # only replace standalone header text lines
            text = re.sub(
                rf"(<TableHead[^>]*>\s*){re.escape(eng)}(\s*</TableHead>)",
                rf"\1{{{tcall}}}\2",
                text,
            )
            text = re.sub(
                rf"(\n\s+){re.escape(eng)}(\n\s+</)",
                rf"\1{{{tcall}}}\2",
                text,
            )
        path.write_text(text, encoding="utf-8")
        print("preview", path.name)


def fix_member_profile_same_as():
    path = COMP / "memberProfile" / "index.jsx"
    text = path.read_text(encoding="utf-8")
    text = text.replace(
        "Same as {t(\"membership.memberProfile.sections.permanentAddress\")}",
        '{t("membership.memberProfile.sameAsPermanent")}',
    )
    text = text.replace(
        'Same as Permanent Address',
        '{t("membership.memberProfile.sameAsPermanent")}',
    )
    # Reset / Next
    text = text.replace("\n                    Reset\n", '\n                    {t("common.buttons.cancel")}\n')  # wrong - need Reset key
    # leave Reset/Next if no keys - check memberSearch.next
    text = re.sub(
        r"(>\s*)Reset(\s*<)",
        r'\1{t("common.buttons.cancel")}\2',  # better add reset - use literal fix
        text,
        count=0,
    )
    # Actually use memberSearch.next for Next and leave Reset as english or common
    text = re.sub(r"(>\s*)Next(\s*<)", r'\1{t("memberSearch.next")}\2', text)
    path.write_text(text, encoding="utf-8")
    print("memberProfile sameAs/next")


def ensure_map_institute_modes():
    """mapInstituteMember may lack modes — copy from group if missing in locales."""
    for lang in ("en", "hi", "bn", "or"):
        path = LOC / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        if "mapInstituteMember: {" not in text:
            continue
        # if modes missing under mapInstituteMember
        start = text.find("mapInstituteMember: {")
        end = text.find("report: {", start)
        block = text[start:end]
        if "modes:" not in block:
            # insert modes after opening
            insert = """
        modes: {
          viewExisting: "View Existing Members",
          addNew: "Add New Member"
        },"""
            if lang == "hi":
                insert = """
        modes: {
          viewExisting: "मौजूदा सदस्य देखें",
          addNew: "नया सदस्य जोड़ें"
        },"""
            elif lang == "bn":
                insert = """
        modes: {
          viewExisting: "বিদ্যমান সদস্য দেখুন",
          addNew: "নতুন সদস্য যোগ করুন"
        },"""
            elif lang == "or":
                insert = """
        modes: {
          viewExisting: "ବିଦ୍ୟମାନ ସଦସ୍ୟ ଦେଖନ୍ତୁ",
          addNew: "ନୂଆ ସଦସ୍ୟ ଯୋଡନ୍ତୁ"
        },"""
            text = text[: start + len("mapInstituteMember: {")] + insert + text[start + len("mapInstituteMember: {") :]
            path.write_text(text, encoding="utf-8")
            print("added modes", lang)


def main():
    for path in COMP.rglob("*.jsx"):
        fix_file(path)
    fix_member_enquiry()
    fix_preview_headers()
    fix_member_profile_same_as()
    ensure_map_institute_modes()
    # Fix Reset wrongly replaced - check
    mp = (COMP / "memberProfile" / "index.jsx").read_text(encoding="utf-8")
    if 't("common.buttons.cancel")' in mp and "Reset" not in mp:
        # restore Reset with a simple English or use update - add reset to common is overkill; use literal Reset via key from nowhere
        mp = mp.replace('{t("common.buttons.cancel")}', "Reset", 1)
        (COMP / "memberProfile" / "index.jsx").write_text(mp, encoding="utf-8")
    print("done")


if __name__ == "__main__":
    main()
