# -*- coding: utf-8 -*-
"""Wire useTranslation into master components (static labels only)."""
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "components" / "master"


def ensure_import(text, import_line='import { useTranslation } from "react-i18next";'):
    if "react-i18next" in text:
        return text
    # after "use client"; if present, else at top after first import block start
    if text.startswith('"use client"'):
        nl = text.find("\n")
        return text[: nl + 1] + "\n" + import_line + "\n" + text[nl + 1 :]
    # insert before first import or at start
    if text.startswith("import "):
        return import_line + "\n" + text
    return import_line + "\n" + text


def ensure_hook(text, fn_sig_substr):
    """Insert const { t } = useTranslation(); after function opening brace."""
    if "useTranslation()" in text:
        return text
    idx = text.find(fn_sig_substr)
    if idx < 0:
        raise SystemExit(f"fn not found: {fn_sig_substr[:40]}")
    brace = text.find("{", idx)
    return text[: brace + 1] + "\n  const { t } = useTranslation();\n" + text[brace + 1 :]


# ---------- demandMaster ----------
p = root / "demandMaster" / "index.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const DemandMaster = ({ loading }) =>")
reps = [
    ('Demand Master', '{t("master.demandMaster.title")}'),
    ('label="Loan Product"', 'label={t("master.demandMaster.fields.loanProduct")}'),
    ('placeholder="Select loan product"', 'placeholder={t("master.demandMaster.placeholders.loanProduct")}'),
    ('searchPlaceholder="Search loan product..."', 'searchPlaceholder={t("master.demandMaster.placeholders.searchLoanProduct")}'),
    ('label="Deposit Product"', 'label={t("master.demandMaster.fields.depositProduct")}'),
    ('placeholder="Select deposit product"', 'placeholder={t("master.demandMaster.placeholders.depositProduct")}'),
    ('searchPlaceholder="Search deposit product..."', 'searchPlaceholder={t("master.demandMaster.placeholders.searchDepositProduct")}'),
    (">\n                  Add\n                </Button>", '>\n                  {t("master.demandMaster.buttons.add")}\n                </Button>'),
]
for a, b in reps:
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("demandMaster")

# ---------- depositAgent ----------
p = root / "depositAgent" / "index.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const DepositAgent = ({ loading, handleSubmit, form }) =>")
reps = [
    (">Deposit Agent</h3>", '>{t("master.depositAgent.title")}</h3>'),
    ('label="Agent Name"', 'label={t("master.depositAgent.fields.agentName")}'),
    ('placeholder="Enter agent name"', 'placeholder={t("master.depositAgent.placeholders.agentName")}'),
    ('label="Address"', 'label={t("master.depositAgent.fields.address")}'),
    ('placeholder="Enter address"', 'placeholder={t("master.depositAgent.placeholders.address")}'),
    ('label="Mobile No."', 'label={t("master.depositAgent.fields.mobileNo")}'),
    ('placeholder="Enter mobile no."', 'placeholder={t("master.depositAgent.placeholders.mobileNo")}'),
    ('label="Email"', 'label={t("master.depositAgent.fields.email")}'),
    ('placeholder="Enter email"', 'placeholder={t("master.depositAgent.placeholders.email")}'),
    ('label="Deposit Amount"', 'label={t("master.depositAgent.fields.depositAmount")}'),
    ('placeholder="Enter deposit amount"', 'placeholder={t("master.depositAgent.placeholders.depositAmount")}'),
    ('label="Maximum Days"', 'label={t("master.depositAgent.fields.maximumDays")}'),
    ('placeholder="Enter maximum days"', 'placeholder={t("master.depositAgent.placeholders.maximumDays")}'),
    ('label="Maximum Deposit"', 'label={t("master.depositAgent.fields.maximumDeposit")}'),
    ('placeholder="Enter maximum deposit"', 'placeholder={t("master.depositAgent.placeholders.maximumDeposit")}'),
    ('label="Payment Type"', 'label={t("master.depositAgent.fields.paymentType")}'),
    ('placeholder="Select payment type"', 'placeholder={t("master.depositAgent.placeholders.paymentType")}'),
    ('searchPlaceholder="Search payment type..."', 'searchPlaceholder={t("master.depositAgent.placeholders.searchPaymentType")}'),
    ('label="Payout Amount"', 'label={t("master.depositAgent.fields.payoutAmount")}'),
    ('placeholder="Enter payout amount"', 'placeholder={t("master.depositAgent.placeholders.payoutAmount")}'),
    (') : (\n                  "Add"\n                )}', ') : (\n                  t("master.depositAgent.buttons.add")\n                )}'),
]
for a, b in reps:
    if a not in text:
        print("WARN depositAgent missing:", a[:50])
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("depositAgent")

# ---------- shareProduct ----------
p = root / "shareProduct" / "index.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const ShareProduct = ({ loading, form, handleSubmit }) =>")
reps = [
    (">Share Product</h3>", '>{t("master.shareProduct.title")}</h3>'),
    ('label="Member Type"', 'label={t("master.shareProduct.fields.memberType")}'),
    ('placeholder="Select member type"', 'placeholder={t("master.shareProduct.placeholders.memberType")}'),
    ('searchPlaceholder="Search member type..."', 'searchPlaceholder={t("master.shareProduct.placeholders.searchMemberType")}'),
    ('label="Admission Fees"', 'label={t("master.shareProduct.fields.admissionFees")}'),
    ('placeholder="Enter admission fees"', 'placeholder={t("master.shareProduct.placeholders.admissionFees")}'),
    ('label="Rate Per Share"', 'label={t("master.shareProduct.fields.ratePerShare")}'),
    ('placeholder="Enter rate per share"', 'placeholder={t("master.shareProduct.placeholders.ratePerShare")}'),
    (') : (\n                    "Add"\n                  )}', ') : (\n                    t("master.shareProduct.buttons.add")\n                  )}'),
]
for a, b in reps:
    if a not in text:
        print("WARN shareProduct missing:", repr(a[:60]))
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("shareProduct")

# ---------- depositInterestSetup ----------
p = root / "depositInterestSetup" / "index.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const DepositInterestSetup = ({")
reps = [
    (">Deposit Interest Setup</h3>", '>{t("master.depositInterestSetup.title")}</h3>'),
    ('label="Product"', 'label={t("master.depositInterestSetup.fields.productName")}'),
    ('placeholder="Select product"', 'placeholder={t("master.depositInterestSetup.placeholders.productName")}'),
    ('searchPlaceholder="Search product..."', 'searchPlaceholder={t("master.depositInterestSetup.placeholders.searchProductName")}'),
    ('label="Effect From Date"', 'label={t("master.depositInterestSetup.fields.effectFrom")}'),
    ('label="Minimum Duration"', 'label={t("master.depositInterestSetup.fields.minimumDuration")}'),
    ('placeholder="Enter minimum duration"', 'placeholder={t("master.depositInterestSetup.placeholders.minimumDuration")}'),
    ('label="Maximum Duration"', 'label={t("master.depositInterestSetup.fields.maximumDuration")}'),
    ('placeholder="Enter maximum duration"', 'placeholder={t("master.depositInterestSetup.placeholders.maximumDuration")}'),
    ('label="Duration Unit"', 'label={t("master.depositInterestSetup.fields.durationUnit")}'),
    ('placeholder="Select duration unit"', 'placeholder={t("master.depositInterestSetup.placeholders.durationUnit")}'),
    ('searchPlaceholder="Search duration unit..."', 'searchPlaceholder={t("master.depositInterestSetup.placeholders.searchDurationUnit")}'),
    ('label="Rate Of Interest"', 'label={t("master.depositInterestSetup.fields.rateOfInterest")}'),
    ('placeholder="Enter rate of interest"', 'placeholder={t("master.depositInterestSetup.placeholders.rateOfInterest")}'),
    ('>Add</Button>', '>{t("master.depositInterestSetup.buttons.add")}</Button>'),
    ("A list of your deposit interest of product.", '{t("master.depositInterestSetup.table.caption")}'),
    (">\n                        Product Name\n                      </TableHead>", '>\n                        {t("master.depositInterestSetup.table.productName")}\n                      </TableHead>'),
    (">Effect From</TableHead>", '>{t("master.depositInterestSetup.table.effectFrom")}</TableHead>'),
    (">\n                        Rate Of Interest\n                      </TableHead>", '>\n                        {t("master.depositInterestSetup.table.rateOfInterest")}\n                      </TableHead>'),
    ("No data found.", '{t("master.depositInterestSetup.table.noData")}'),
    (') : (\n                "Submit"\n              )}', ') : (\n                t("master.depositInterestSetup.buttons.submit")\n              )}'),
]
for a, b in reps:
    if a not in text:
        print("WARN depositInterestSetup missing:", repr(a[:70]))
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("depositInterestSetup")

# ---------- passbookSettings ----------
p = root / "passbookSettings" / "index.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const PassbookSettings = ({ loading, form, handleSubmit }) =>")
reps = [
    (">\n            Passbook Settings\n          </h3>", '>\n            {t("master.passbookSettings.title")}\n          </h3>'),
    ("Configure page layout and line spacing for passbook printing.", '{t("master.passbookSettings.subtitle")}'),
    (">Module</SectionLabel>", '>{t("master.passbookSettings.sections.module")}</SectionLabel>'),
    ('label="Module"', 'label={t("master.passbookSettings.fields.module")}'),
    ('placeholder="Select module"', 'placeholder={t("master.passbookSettings.placeholders.module")}'),
    ('searchPlaceholder="Search module..."', 'searchPlaceholder={t("master.passbookSettings.placeholders.searchModule")}'),
    (">Page Size</SectionLabel>", '>{t("master.passbookSettings.sections.pageSize")}</SectionLabel>'),
    ('label="Page Height (cm)"', 'label={t("master.passbookSettings.fields.pageHeight")}'),
    ('placeholder="e.g. 29.7"', 'placeholder={t("master.passbookSettings.placeholders.pageHeight")}'),
    ('label="Page Width (cm)"', 'label={t("master.passbookSettings.fields.pageWidth")}'),
    ('placeholder="e.g. 21.0"', 'placeholder={t("master.passbookSettings.placeholders.pageWidth")}'),
    (">Line Configuration</SectionLabel>", '>{t("master.passbookSettings.sections.lineConfiguration")}</SectionLabel>'),
    ('label="First Page Top"', 'label={t("master.passbookSettings.fields.firstPageTop")}'),
    ('placeholder="e.g. 10"', 'placeholder={t("master.passbookSettings.placeholders.firstPageTop")}'),
    ('label="Lines in First Page"', 'label={t("master.passbookSettings.fields.linesFirstPage")}'),
    ('placeholder="e.g. 24"', 'placeholder={t("master.passbookSettings.placeholders.linesFirstPage")}'),
    ('label="Lines in Second Page"', 'label={t("master.passbookSettings.fields.linesSecondPage")}'),
    ('placeholder="e.g. 30"', 'placeholder={t("master.passbookSettings.placeholders.linesSecondPage")}'),
    ('label="Gap in Middle Page"', 'label={t("master.passbookSettings.fields.gapMiddlePage")}'),
    ('placeholder="e.g. 5"', 'placeholder={t("master.passbookSettings.placeholders.gapMiddlePage")}'),
    (">Pagination</SectionLabel>", '>{t("master.passbookSettings.sections.pagination")}</SectionLabel>'),
    ('label="Gap of Next Page"', 'label={t("master.passbookSettings.fields.gapNextPage")}'),
    ('placeholder="e.g. 8"', 'placeholder={t("master.passbookSettings.placeholders.gapNextPage")}'),
    (') : (\n                      "Save Settings"\n                    )}', ') : (\n                      t("master.passbookSettings.buttons.save")\n                    )}'),
]
for a, b in reps:
    if a not in text:
        print("WARN passbook missing:", repr(a[:70]))
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("passbookSettings")

# ---------- subLedger index ----------
p = root / "subLedger" / "index.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const SubLedger = ({")
reps = [
    (">Sub Ledger</h2>", '>{t("master.subLedger.title")}</h2>'),
    (">\n              Add New Sub Ledger\n            </Button>", '>\n              {t("master.subLedger.addNew")}\n            </Button>'),
    ('{editData ? "Edit " : "Add "}\n                  Sub Ledger', '{editData ? t("common.buttons.edit") + " " : t("common.buttons.add") + " "}\n                  {t("master.subLedger.title")}'),
]
for a, b in reps:
    if a not in text:
        print("WARN subLedger index missing:", repr(a[:70]))
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("subLedger index")

# ---------- subLedger form ----------
p = root / "subLedger" / "SubLedgerForm.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const SubLedgerForm = ({")
reps = [
    ('label="Ledger Name"', 'label={t("master.subLedger.fields.ledgerName")}'),
    ('placeholder="Enter ledger name"', 'placeholder={t("master.subLedger.placeholders.ledgerName")}'),
    ('label="Under Head"', 'label={t("master.subLedger.fields.underHead")}'),
    ('placeholder="Select under head"', 'placeholder={t("master.subLedger.placeholders.underHead")}'),
    ('searchPlaceholder="Search under head..."', 'searchPlaceholder={t("master.subLedger.placeholders.searchUnderHead")}'),
    ('label="Opening Balance"', 'label={t("master.subLedger.fields.openingBalance")}'),
    ('placeholder="Enter opening balance"', 'placeholder={t("master.subLedger.placeholders.openingBalance")}'),
    (') : (\n              "Edit"\n            ) : (\n              "Add"\n            )}',
     ') : (\n              t("common.buttons.edit")\n            ) : (\n              t("common.buttons.add")\n            )}'),
]
for a, b in reps:
    if a not in text:
        print("WARN SubLedgerForm missing:", repr(a[:70]))
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("SubLedgerForm")

# ---------- subLedger table ----------
p = root / "subLedger" / "SubLedgerTable.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const SubLedgerTable = ({")
reps = [
    (">Serial No</div>", '>{t("common.serialNo")}</div>'),
    ("\n            Sub Ledger Name\n            <ArrowUpDown", '\n            {t("master.subLedger.table.subLedgerName")}\n            <ArrowUpDown'),
    (">Head Name</div>", '>{t("master.subLedger.table.headName")}</div>'),
    (">Opening Balance</div>", '>{t("master.subLedger.table.openingBalance")}</div>'),
    (">Actions</div>", '>{t("common.actions")}</div>'),
    (">\n              Edit\n              <FaRegEdit", '>\n              {t("common.buttons.edit")}\n              <FaRegEdit'),
    ("No results.", '{t("common.noResults")}'),
    (">\n                Previous\n              </Button>", '>\n                {t("common.previous")}\n              </Button>'),
    (">\n                Next\n              </Button>", '>\n                {t("common.next")}\n              </Button>'),
]
for a, b in reps:
    if a not in text:
        print("WARN SubLedgerTable missing:", repr(a[:70]))
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("SubLedgerTable")

print("done main screens")
