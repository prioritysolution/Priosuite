# -*- coding: utf-8 -*-
"""Wire remaining membership feature screens."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "components" / "membership"
IMPORT = 'import { useTranslation } from "react-i18next";\n'


def ensure_import(text: str) -> str:
    if "react-i18next" in text:
        return text
    if text.lstrip().startswith('"use client"'):
        nl = text.find("\n")
        return text[: nl + 1] + IMPORT + text[nl + 1 :]
    return IMPORT + text


def ensure_hook(text: str, name_token: str) -> str:
    patterns = [
        rf"const {re.escape(name_token)} = \(\{{",
        rf"const {re.escape(name_token)} = \(",
    ]
    idx = -1
    for pat in patterns:
        m = re.search(pat, text)
        if m:
            idx = m.start()
            break
    if idx < 0:
        raise SystemExit(f"missing {name_token}")
    arrow = text.find("=>", idx)
    brace = text.find("{", arrow)
    if "useTranslation()" in text[brace : brace + 80]:
        return text
    return text[: brace + 1] + "\n  const { t } = useTranslation();\n" + text[brace + 1 :]


def apply(text, reps, name):
    for a, b in reps:
        if a not in text:
            print(f"WARN {name}: {a[:85]!r}")
        text = text.replace(a, b)
    return text


def wire(rel, component, reps):
    path = ROOT / rel
    text = ensure_import(path.read_text(encoding="utf-8"))
    text = ensure_hook(text, component)
    text = apply(text, reps, rel)
    path.write_text(text, encoding="utf-8")
    print("OK", rel)


def lab(s, k):
    return (f'label="{s}"', f'label={{t("{k}")}}')


def ph(s, k):
    return (f'placeholder="{s}"', f'placeholder={{t("{k}")}}')


def sph(s, k):
    return (f'searchPlaceholder="{s}"', f'searchPlaceholder={{t("{k}")}}')


def fl(s, k):
    return (f'formLabel="{s}"', f'formLabel={{t("{k}")}}')


def th(s, k):
    return (f">{s}</TableHead>", f'>{{t("{k}")}}</TableHead>')


# ---------- calculateDividend ----------
wire(
    "calculateDividend/index.jsx",
    "CalculateDividend",
    [
        (">Calculate Dividend</h3>", '>{t("membership.calculateDividend.title")}</h3>'),
        (">Account Info Block</h3>", '>{t("membership.calculateDividend.sections.accountInfoBlock")}</h3>'),
        lab("From Date", "membership.calculateDividend.fields.fromDate"),
        lab("Upto Date", "membership.calculateDividend.fields.uptoDate"),
        lab("Dividend Rate", "membership.calculateDividend.fields.dividendRate"),
        ph("Enter rate", "membership.calculateDividend.placeholders.dividendRate"),
        (
            '                    Calculate Dividend\n',
            '                    {t("membership.calculateDividend.buttons.calculate")}\n',
        ),
        (
            "                  Preview\n",
            '                  {t("membership.calculateDividend.buttons.preview")}\n',
        ),
        ('documentTitle: "Dividend List"', 'documentTitle: t("membership.calculateDividend.documentTitle")'),
        th("Sl.", "membership.calculateDividend.table.sl"),
        th("Member Code", "membership.calculateDividend.table.memberCode"),
        th("Member Name", "membership.calculateDividend.table.memberName"),
        th("Guardian Name", "membership.calculateDividend.table.guardianName"),
        th("Village", "membership.calculateDividend.table.village"),
        th("Share Balance", "membership.calculateDividend.table.shareBalance"),
        th("Dividend Amount", "membership.calculateDividend.table.dividendAmount"),
        ('<TableCell colSpan={6}>Total</TableCell>', '<TableCell colSpan={6}>{t("common.total")}</TableCell>'),
        lab("Posting Date", "membership.calculateDividend.fields.postingDate"),
        ('"Post Payble"', 't("membership.calculateDividend.buttons.postPayble")'),
    ],
)

wire(
    "calculateDividend/PreviewModal.jsx",
    "PreviewModal",
    [
        th("Sl.", "membership.calculateDividend.table.sl"),
        th("Member Code", "membership.calculateDividend.table.memberCode"),
        th("Member Name", "membership.calculateDividend.table.memberName"),
        th("Guardian Name", "membership.calculateDividend.table.guardianName"),
        th("Village", "membership.calculateDividend.table.village"),
        th("Share Balance", "membership.calculateDividend.table.shareBalance"),
        th("Dividend Amount", "membership.calculateDividend.table.dividendAmount"),
        ('>Total</TableCell>', '>{t("common.total")}</TableCell>'),
    ],
)

# ---------- passbookPrint ----------
wire(
    "passbookPrint/index.jsx",
    "PassbookPrint",
    [
        (">Passbook Print</h3>", '>{t("membership.passbookPrint.title")}</h3>'),
        ('documentTitle: "Front Page"', 'documentTitle: t("membership.passbookPrint.documentTitleFront")'),
        ('documentTitle: "Tansaction Page"', 'documentTitle: t("membership.passbookPrint.documentTitleTransaction")'),
        ('label: "Front Page"', 'label: t("membership.passbookPrint.frontPage")'),
        ('label: "Transaction Page"', 'label: t("membership.passbookPrint.transactionPage")'),
        lab("Date", "membership.passbookPrint.fields.date"),
        lab("Line", "membership.passbookPrint.fields.line"),
        ph("Enter line", "membership.passbookPrint.placeholders.line"),
        (
            "                    Print\n",
            '                    {t("common.buttons.print")}\n',
        ),
        (
            "                  Next\n",
            '                  {t("common.next")}\n',
        ),
        (">MANAGER</span>", '>{t("membership.passbookPrint.manager")}</span>'),
        (
            "Did you print successfully ?",
            '{t("membership.passbookPrint.printConfirmation")}',
        ),
        (">Yes</Button>", '>{t("common.yes")}</Button>'),
        (">No</Button>", '>{t("common.no")}</Button>'),
        th("Sl.", "membership.passbookPrint.table.sl"),
        th("Date", "membership.passbookPrint.fields.date"),
        th("Issue", "membership.passbookPrint.table.issue"),
        th("Release", "membership.passbookPrint.table.release"),
        th("Balance", "membership.passbookPrint.table.balance"),
    ],
)

# ---------- generateCertificate ----------
wire(
    "generateCertificate/index.jsx",
    "GenerateCertificate",
    [
        (">Generate Certificate</h3>", '>{t("membership.generateCertificate.title")}</h3>'),
        lab("Member No.", "membership.generateCertificate.fields.memberNo"),
        ph("Enter member no.", "membership.generateCertificate.placeholders.memberNo"),
        (">Generate</Button>", '>{t("common.buttons.generate")}</Button>'),
        th("Serial No.", "membership.generateCertificate.table.serialNo"),
        th("Issue Date", "membership.generateCertificate.table.issueDate"),
        th("Issue Amount", "membership.generateCertificate.table.issueAmount"),
        th("Action", "membership.generateCertificate.table.action"),
        (
            "              Print\n",
            '              {t("common.buttons.print")}\n',
        ),
        (
            "Share Certificate No. : 01",
            '{t("membership.generateCertificate.certificate.shareCertificateNo")}',
        ),
        (">Members Copy</", '>{t("membership.generateCertificate.certificate.membersCopy")}</'),
        (
            "This is to certify that",
            '{t("membership.generateCertificate.certificate.bodyPrefix")}',
        ),
        (">Seal</", '>{t("membership.generateCertificate.certificate.seal")}</'),
        (">Chairman</", '>{t("membership.generateCertificate.certificate.chairman")}</'),
        (">Secretary</", '>{t("membership.generateCertificate.certificate.secretary")}</'),
    ],
)

# ---------- report already done; shareIssue ----------
P = "membership.shareIssue"
wire(
    "shareIssue/index.jsx",
    "ShareIssue",
    [
        fl("Share Issue", f"{P}.title"),
        (">Account Details</h3>", f'>{{t("{P}.sections.accountDetails")}}</h3>'),
        (">Transaction Details</h3>", f'>{{t("{P}.sections.transactionDetails")}}</h3>'),
        lab("Member No.", f"{P}.fields.memberNo"),
        ph("Enter member no.", f"{P}.placeholders.memberNo"),
        lab("CIF No.", f"{P}.fields.cifNo"),
        ph("Enter cif no.", f"{P}.placeholders.cifNo"),
        lab("Member Name", f"{P}.fields.memberName"),
        ph("Enter member name", f"{P}.placeholders.memberName"),
        lab("Gurdian Name", f"{P}.fields.gurdianName"),
        ph("Enter gurdian name", f"{P}.placeholders.gurdianName"),
        lab("Address", f"{P}.fields.address"),
        ph("Enter address", f"{P}.placeholders.address"),
        lab("Mobile No.", f"{P}.fields.mobileNo"),
        ph("Enter mobile no.", f"{P}.placeholders.mobileNo"),
        lab("Branch Name", f"{P}.fields.branchName"),
        ph("Enter branch name", f"{P}.placeholders.branchName"),
        lab("Ledger Folio", f"{P}.fields.ledgerFolio"),
        ph("Enter ledger folio", f"{P}.placeholders.ledgerFolio"),
        lab("Available Balance", f"{P}.fields.availableBalance"),
        ph("Enter available balance", f"{P}.placeholders.availableBalance"),
        lab("No. of Share", f"{P}.fields.noOfShare"),
        ph("Enter number of share", f"{P}.placeholders.noOfShare"),
        lab("Rate of Share", f"{P}.fields.rateOfShare"),
        ph("Enter rate per share", f"{P}.placeholders.rateOfShare"),
        lab("Total", f"{P}.fields.total"),
        ph("Enter total amount", f"{P}.placeholders.total"),
        ph("Total amount in words", f"{P}.placeholders.totalAmountInWords"),
        lab("Ref. Vouch No.", f"{P}.fields.refVouchNo"),
        ph("Enter ref. vouch no.", f"{P}.placeholders.refVouchNo"),
        lab("Bank", f"{P}.fields.bank"),
        ph("Select bank", f"{P}.placeholders.bank"),
        sph("Search bank...", f"{P}.placeholders.searchBank"),
        lab("Savings", f"{P}.fields.savings"),
        ph("Select savings", f"{P}.placeholders.savings"),
        sph("Search savings...", f"{P}.placeholders.searchSavings"),
        lab("Account Holder Name", f"{P}.fields.accountHolderName"),
        ph("Enter name", f"{P}.placeholders.accountHolderName"),
        ph("Enter balance", f"{P}.placeholders.balance"),
        (">Cash</Label>", f'>{{t("{P}.fields.cash")}}</Label>'),
        (">Bank</Label>", f'>{{t("{P}.fields.bank")}}</Label>'),
        (">Savings</Label>", f'>{{t("{P}.fields.savings")}}</Label>'),
        ('nextLabel="Print Receipt"', f'nextLabel={{t("{P}.printReceipt")}}'),
        ('"Save"', 't("common.buttons.save")'),
        # formLabel Transaction Date on MemberSearchForm
        ('formLabel="Transaction Date"', f'formLabel={{t("{P}.fields.transactionDate")}}'),
    ],
)

print("phase3a done")
