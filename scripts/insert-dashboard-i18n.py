# -*- coding: utf-8 -*-
"""Insert dashboard locales and wire dashboard components for static i18n."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
DASH = ROOT / "components" / "dashboard"

# English source of truth; other langs override
EN = {
    "welcome": "Welcome, {{name}}",
    "member": "Member",
    "lastLogin": "Last Login:",
    "updateDayBeginDate": "Update Day Begin Date",
    "currentBeginDate": "Current Begin Date",
    "newDate": "New Date",
    "selectNewBeginDate": "Select new begin date",
    "pleaseSelectNewBeginDate": "Please select a new begin date",
    "pleaseSelectNewBeginDatePeriod": "Please select a new begin date.",
    "recentTransactions": "Recent Transactions",
    "viewAll": "View All",
    "date": "Date",
    "description": "Description",
    "acNo": "A/c No.",
    "type": "Type",
    "amount": "Amount",
    "balance": "Balance",
    "credit": "Credit",
    "debit": "Debit",
    "accountSummary": "Account Summary",
    "savingsAccount": "Savings Account",
    "primary": "Primary",
    "viewStatement": "View Statement",
    "accountDetails": "Account Details",
    "accountNumber": "Account Number",
    "accountType": "Account Type",
    "ifscCode": "IFSC Code",
    "availableBalance": "Available Balance",
    "quickActions": "Quick Actions",
    "quickActionsDesc": "Jump to the most used banking tasks",
    "close": "Close",
    "hideBalance": "Hide balance",
    "showBalance": "Show balance",
    "totalBalance": "Total Balance",
    "fixedDeposits": "Fixed Deposits",
    "activeLoans": "Active Loans",
    "totalInFdAccounts": "Total in 2 FD Accounts",
    "totalOutstanding": "Total Outstanding",
    "fundTransfer": "Fund Transfer",
    "openFixedDeposit": "Open Fixed Deposit",
    "applyForLoan": "Apply for Loan",
    "downloadPassbook": "Download Passbook",
    "updateKyc": "Update KYC",
    "addMember": "Add Member",
    "addMemberDesc": "Register a new society member",
    "openAccount": "Open Account",
    "openAccountDesc": "Open a new deposit account",
    "newDeposit": "New Deposit",
    "newDepositDesc": "Accept cash or bank deposit",
    "newLoan": "New Loan",
    "newLoanDesc": "Start a new loan application",
    "sendNotice": "Send Notice",
    "sendNoticeDesc": "Review pending membership notices",
    "viewReports": "View Reports",
    "viewReportsDesc": "Open daybook and reports",
    "branchLiquidityTitle": "Multi-Branch Operations & Liquidity Matrix",
    "branchLiquidityDesc": "Branch-wise loan book, collection, and vault cash",
    "selectBranch": "Select branch",
    "searchBranch": "Search branch...",
    "activeBranches": "{{count}} Active Branches",
    "branchName": "Branch Name",
    "activeLoanBook": "Active Loan Book (₹)",
    "todaysCollection": "Today's Collection (₹)",
    "branchVaultCash": "Branch Vault Cash (₹)",
    "openLoans": "Open Loans",
    "recoveryPct": "Recovery %",
    "fieldAgentTitle": "Field Collection Agent Performance & Live Wallet",
    "fieldAgentDesc": "Real-time tracking of field collection targets and wallet balances",
    "fieldAgentsActive": "{{count}} Field Agents Active",
    "agentName": "Agent Name",
    "assignedKendras": "Assigned Kendras",
    "todayTarget": "Today Target",
    "collected": "Collected",
    "liveFieldWallet": "Live Field Wallet",
    "status": "Status",
    "inField": "In Field",
    "returningToVault": "Returning to Vault",
    "totalLiquidFunds": "Total Liquid Funds",
    "cashInHand": "Cash In Hand (Branch Vaults):",
    "bankBalances": "Bank Balances (Commercial Banks):",
    "realtimeCbs": "Real-time CBS Cashbook",
    "openFullLedger": "Open Full General Ledger →",
    "cashTallyTitle": "Physical Cash Denomination Tally",
    "cashNoteCount": "Cash note tally",
    "reconciledZero": "Reconciled Zero Variance",
    "totalPhysicalCash": "Total Physical Counted Cash:",
    "varianceBalanced": "Variance: {{amount}} (Balanced)",
    "notes500": "₹500 Notes",
    "notes200": "₹200 Notes",
    "notes100": "₹100 Notes",
    "notes50": "₹50 Notes",
    "notes20": "₹20 Notes",
    "notes10": "₹10 Notes",
    "grossLoanPortfolio": "Gross Loan Portfolio",
    "disbursed": "Disbursed: ₹40,000",
    "qualifying100": "100% Qualifying",
    "collectionEfficiency": "Collection Efficiency",
    "mtd": "MTD: ₹15,400",
    "todayAmt": "Today: ₹3,788",
    "par30": "Portfolio at Risk (PAR 30+)",
    "par90": "PAR 90 (NPA): 0.00%",
    "healthyAsset": "Healthy Asset",
    "activeBorrowers": "Active Borrowers",
    "clients1": "1 Clients",
    "kendras1": "1 Kendras",
    "activeJlgs1": "1 Active JLGs",
    "grossNpa": "GROSS NPA (DR 121230)",
    "grossNpaSub": "Total non-performing assets",
    "netNpa": "NET NPA %",
    "netNpaSub": "Well within RBI limits (<3%)",
}

HI = {
    **EN,
    "welcome": "स्वागत है, {{name}}",
    "member": "सदस्य",
    "lastLogin": "अंतिम लॉगिन:",
    "updateDayBeginDate": "दिन प्रारंभ तिथि अपडेट करें",
    "currentBeginDate": "वर्तमान प्रारंभ तिथि",
    "newDate": "नई तिथि",
    "selectNewBeginDate": "नई प्रारंभ तिथि चुनें",
    "pleaseSelectNewBeginDate": "कृपया नई प्रारंभ तिथि चुनें",
    "pleaseSelectNewBeginDatePeriod": "कृपया नई प्रारंभ तिथि चुनें।",
    "recentTransactions": "हाल के लेनदेन",
    "viewAll": "सभी देखें",
    "date": "दिनांक",
    "description": "विवरण",
    "acNo": "खाता संख्या",
    "type": "प्रकार",
    "amount": "राशि",
    "balance": "शेष",
    "credit": "जमा",
    "debit": "नामे",
    "accountSummary": "खाता सारांश",
    "savingsAccount": "बचत खाता",
    "primary": "प्राथमिक",
    "viewStatement": "स्टेटमेंट देखें",
    "accountDetails": "खाता विवरण",
    "quickActions": "त्वरित क्रियाएँ",
    "quickActionsDesc": "सबसे उपयोग किए जाने वाले बैंकिंग कार्यों पर जाएँ",
    "close": "बंद करें",
    "hideBalance": "शेष छिपाएँ",
    "showBalance": "शेष दिखाएँ",
    "totalBalance": "कुल शेष",
    "fixedDeposits": "सावधि जमा",
    "activeLoans": "सक्रिय ऋण",
    "availableBalance": "उपलब्ध शेष",
    "branchLiquidityTitle": "मल्टी-ब्रांच संचालन और तरलता मैट्रिक्स",
    "fieldAgentTitle": "फील्ड संग्रह एजेंट प्रदर्शन और लाइव वॉलेट",
    "cashTallyTitle": "भौतिक नकद मूल्यवर्ग गणना",
    "cashNoteCount": "नकद नोट हिसाब",
    "totalLiquidFunds": "कुल तरल निधि",
}

BN = {
    **EN,
    "welcome": "স্বাগতম, {{name}}",
    "member": "সদস্য",
    "lastLogin": "শেষ লগইন:",
    "updateDayBeginDate": "দিন শুরুর তারিখ আপডেট করুন",
    "currentBeginDate": "বর্তমান শুরুর তারিখ",
    "newDate": "নতুন তারিখ",
    "selectNewBeginDate": "নতুন শুরুর তারিখ নির্বাচন করুন",
    "pleaseSelectNewBeginDate": "অনুগ্রহ করে নতুন শুরুর তারিখ নির্বাচন করুন",
    "pleaseSelectNewBeginDatePeriod": "অনুগ্রহ করে নতুন শুরুর তারিখ নির্বাচন করুন।",
    "recentTransactions": "সাম্প্রতিক লেনদেন",
    "viewAll": "সব দেখুন",
    "date": "তারিখ",
    "description": "বিবরণ",
    "acNo": "অ্যাকাউন্ট নং",
    "type": "ধরন",
    "amount": "পরিমাণ",
    "balance": "ব্যালেন্স",
    "credit": "জমা",
    "debit": "উত্তোলন",
    "accountSummary": "অ্যাকাউন্ট সারাংশ",
    "savingsAccount": "সঞ্চয় অ্যাকাউন্ট",
    "primary": "প্রাথমিক",
    "viewStatement": "স্টেটমেন্ট দেখুন",
    "accountDetails": "অ্যাকাউন্ট বিবরণ",
    "quickActions": "দ্রুত কাজ",
    "quickActionsDesc": "সবচেয়ে ব্যবহৃত ব্যাংকিং কাজে যান",
    "close": "বন্ধ করুন",
    "hideBalance": "ব্যালেন্স লুকান",
    "showBalance": "ব্যালেন্স দেখান",
    "totalBalance": "মোট ব্যালেন্স",
    "fixedDeposits": "স্থায়ী আমানত",
    "activeLoans": "সক্রিয় ঋণ",
    "availableBalance": "উপলব্ধ ব্যালেন্স",
    "cashNoteCount": "নগদ নোট হিসাব",
    "cashTallyTitle": "ভৌত নগদ মূল্যমান গণনা",
    "totalLiquidFunds": "মোট তরল তহবিল",
    "grossNpaSub": "মোট নন-পারফর্মিং সম্পদ",
}

OR_ = {
    **EN,
    "welcome": "ସ୍ୱାଗତ, {{name}}",
    "member": "ସଦସ୍ୟ",
    "lastLogin": "ଶେଷ ଲଗଇନ୍:",
    "updateDayBeginDate": "ଦିନ ଆରମ୍ଭ ତାରିଖ ଅପଡେଟ୍ କରନ୍ତୁ",
    "currentBeginDate": "ବର୍ତ୍ତମାନ ଆରମ୍ଭ ତାରିଖ",
    "newDate": "ନୂତନ ତାରିଖ",
    "selectNewBeginDate": "ନୂତନ ଆରମ୍ଭ ତାରିଖ ବାଛନ୍ତୁ",
    "pleaseSelectNewBeginDate": "ଦୟାକରି ନୂତନ ଆରମ୍ଭ ତାରିଖ ବାଛନ୍ତୁ",
    "pleaseSelectNewBeginDatePeriod": "ଦୟାକରି ନୂତନ ଆରମ୍ଭ ତାରିଖ ବାଛନ୍ତୁ।",
    "recentTransactions": "ସାମ୍ପ୍ରତିକ କାରବାର",
    "viewAll": "ସବୁ ଦେଖନ୍ତୁ",
    "quickActions": "ଦ୍ରୁତ କାର୍ଯ୍ୟ",
    "close": "ବନ୍ଦ କରନ୍ତୁ",
    "cashTallyTitle": "ଭୌତିକ ନଗଦ ମୂଲ୍ୟାଙ୍କନ ଗଣନା",
    "cashNoteCount": "ନଗଦ ନୋଟ୍ ହିସାବ",
}

LOCALES = {"en": EN, "hi": HI, "bn": BN, "or": OR_}


def js_obj(d, indent=6):
    pad = " " * indent
    items = list(d.items())
    lines = []
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


def insert_after_top_block(text, block_name, new_block):
    m = re.search(rf"(\n    {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"missing {block_name}")
    depth = 0
    i = m.end(1) - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                j = i + 1
                if j < len(text) and text[j] == ",":
                    j += 1
                return text[:j] + "\n" + new_block + text[j:]
        i += 1
    raise SystemExit(f"unclosed {block_name}")


def ensure_common_save(text, lang):
    matches = list(re.finditer(r"\n    common:\s*\{", text))
    m = matches[-1]
    depth = 0
    i = m.end() - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                end = i
                block = text[m.start() : end]
                break
        i += 1
    extras = []
    saves = {
        "en": ("Save", "Cancel"),
        "hi": ("सहेजें", "रद्द करें"),
        "bn": ("সংরক্ষণ", "বাতিল"),
        "or": ("ସେଭ୍", "ବାତିଲ୍"),
    }
    save_v, cancel_v = saves[lang]
    if not re.search(r"\n      save:", block):
        extras.append(f'      save: "{save_v}"')
    if not re.search(r"\n      cancel:", block):
        extras.append(f'      cancel: "{cancel_v}"')
    if not extras:
        return text
    prefix = text[:end].rstrip()
    if not prefix.endswith(","):
        prefix += ","
    return prefix + "\n" + ",\n".join(extras) + "\n    " + text[end:]


def insert_lang(lang):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    text = ensure_common_save(text, lang)
    if re.search(r"\n    dashboard:\s*\{", text):
        print(f"{lang}: dashboard already present")
    else:
        block = "    dashboard: {\n" + js_obj(LOCALES[lang], indent=6) + "\n    },"
        text = insert_after_top_block(text, "footer", block)
        print(f"{lang}: inserted dashboard")
    path.write_text(text, encoding="utf-8")


def patch(path: Path, repls):
    text = path.read_text(encoding="utf-8")
    for old, new in repls:
        if old not in text:
            print(f"  MISS {path.name}: {old[:60]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK {path.name}: {old[:40]!r}")
    path.write_text(text, encoding="utf-8")


def ensure_t_import(text):
    if "useTranslation" in text:
        return text
    # after "use client";
    if text.startswith('"use client"'):
        return text.replace(
            '"use client";\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    return 'import { useTranslation } from "react-i18next";\n' + text


def wire_index():
    p = DASH / "index.jsx"
    text = p.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text.split("const Dashboard")[1].split("const AdminDashboard")[0]:
        text = text.replace(
            "const Dashboard = ({ dashboardItemData }) => {\n  const [userName, setUserName] = useState(\"Member\");",
            "const Dashboard = ({ dashboardItemData }) => {\n  const { t } = useTranslation();\n  const [userName, setUserName] = useState(\"\");",
        )
    text = text.replace(
        'setUserName(getCookieData("userName") || "Member");',
        'setUserName(getCookieData("userName") || t("dashboard.member"));',
    )
    # fix useEffect dependency - add t
    text = text.replace(
        """  useEffect(() => {
    setUserName(getCookieData("userName") || t("dashboard.member"));
    setLastLogin(format(new Date(), "dd MMM yyyy, hh:mm a"));
  }, []);""",
        """  useEffect(() => {
    setUserName(getCookieData("userName") || t("dashboard.member"));
    setLastLogin(format(new Date(), "dd MMM yyyy, hh:mm a"));
  }, [t]);""",
    )
    text = text.replace(
        "            Welcome, {userName} <span aria-hidden>👋</span>",
        '            {t("dashboard.welcome", { name: userName })}{" "}\n            <span aria-hidden>👋</span>',
    )
    text = text.replace(
        "              Last Login: {lastLogin}",
        '              {t("dashboard.lastLogin")} {lastLogin}',
    )
    # DayBeginDialog
    if "DayBeginDialog" in text and "useTranslation()" not in text[text.find("DayBeginDialog"):text.find("MainDashboard")]:
        text = text.replace(
            """}) => {
  const beg_date_cookie = getCookieData("beg_date");
  const fin_start_date = getCookieData("fin_start_date");
  const fin_end_date = getCookieData("fin_end_date");

  const dayBeginSchema = yup.object({
    currentBeginDate: yup.string().nullable(),
    newBeginDate: yup
      .mixed()
      .test(
        "required-date",
        "Please select a new begin date",
        (value) => value instanceof Date && !isNaN(value.getTime()),
      ),
  });""",
            """}) => {
  const { t } = useTranslation();
  const beg_date_cookie = getCookieData("beg_date");
  const fin_start_date = getCookieData("fin_start_date");
  const fin_end_date = getCookieData("fin_end_date");

  const dayBeginSchema = yup.object({
    currentBeginDate: yup.string().nullable(),
    newBeginDate: yup
      .mixed()
      .test(
        "required-date",
        t("dashboard.pleaseSelectNewBeginDate"),
        (value) => value instanceof Date && !isNaN(value.getTime()),
      ),
  });""",
        )
    repls = [
        (
            'toast.error("Please select a new begin date.");',
            'toast.error(t("dashboard.pleaseSelectNewBeginDatePeriod"));',
        ),
        (
            'message: "Please select a new begin date",',
            'message: t("dashboard.pleaseSelectNewBeginDate"),',
        ),
        (
            "<DialogTitle>Update Day Begin Date</DialogTitle>",
            '<DialogTitle>{t("dashboard.updateDayBeginDate")}</DialogTitle>',
        ),
        ('label="Current Begin Date"', 'label={t("dashboard.currentBeginDate")}'),
        ('label="New Date"', 'label={t("dashboard.newDate")}'),
        (
            'placeholder="Select new begin date"',
            'placeholder={t("dashboard.selectNewBeginDate")}',
        ),
        (
            """              >
                Cancel
              </Button>""",
            """              >
                {t("common.cancel")}
              </Button>""",
        ),
        (
            """                ) : (
                  "Save"
                )}""",
            """                ) : (
                  t("common.save")
                )}""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS index: {old[:50]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK index: {old[:40]!r}")
    p.write_text(text, encoding="utf-8")


def wire_member_summary():
    p = DASH / "MemberSummaryCards.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "const SummaryCard = ({ card }) => {\n  const [visible, setVisible] = useState(true);",
        "const SummaryCard = ({ card }) => {\n  const { t } = useTranslation();\n  const [visible, setVisible] = useState(true);",
    )
    # label map by id
    text = text.replace(
        "            {card.label}",
        """            {card.id === "total-balance"
              ? t("dashboard.totalBalance")
              : card.id === "savings"
                ? t("dashboard.savingsAccount")
                : card.id === "fixed-deposits"
                  ? t("dashboard.fixedDeposits")
                  : card.id === "active-loans"
                    ? t("dashboard.activeLoans")
                    : card.label}""",
    )
    text = text.replace(
        '                aria-label={visible ? "Hide balance" : "Show balance"}',
        '                aria-label={visible ? t("dashboard.hideBalance") : t("dashboard.showBalance")}',
    )
    text = text.replace(
        '          <p className="mt-1 truncate text-xs text-slate-500">{card.subtext}</p>',
        """          <p className="mt-1 truncate text-xs text-slate-500">
            {card.id === "total-balance"
              ? t("dashboard.availableBalance")
              : card.id === "fixed-deposits"
                ? t("dashboard.totalInFdAccounts")
                : card.id === "active-loans"
                  ? t("dashboard.totalOutstanding")
                  : card.subtext}
          </p>""",
    )
    p.write_text(text, encoding="utf-8")
    print("  MemberSummaryCards wired")


def wire_txn_table():
    p = DASH / "MemberTransactionTable.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "const MemberTransactionTable = () => {\n  const router = useRouter();",
        "const MemberTransactionTable = () => {\n  const { t } = useTranslation();\n  const router = useRouter();",
    )
    repls = [
        ("          Recent Transactions\n", '          {t("dashboard.recentTransactions")}\n'),
        ("          View All\n", '          {t("dashboard.viewAll")}\n'),
        (">Date</TableHead>", '>{t("dashboard.date")}</TableHead>'),
        (">Description</TableHead>", '>{t("dashboard.description")}</TableHead>'),
        (">A/c No.</TableHead>", '>{t("dashboard.acNo")}</TableHead>'),
        (">Type</TableHead>", '>{t("dashboard.type")}</TableHead>'),
        (
            'className="whitespace-nowrap text-right">Amount</TableHead>',
            'className="whitespace-nowrap text-right">{t("dashboard.amount")}</TableHead>',
        ),
        (
            'className="whitespace-nowrap text-right">Balance</TableHead>',
            'className="whitespace-nowrap text-right">{t("dashboard.balance")}</TableHead>',
        ),
        (
            '{isCredit ? "Credit" : "Debit"}',
            '{isCredit ? t("dashboard.credit") : t("dashboard.debit")}',
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS txn: {old!r}")
        else:
            text = text.replace(old, new, 1)
    p.write_text(text, encoding="utf-8")
    print("  MemberTransactionTable wired")


def wire_account_summary():
    p = DASH / "AccountSummary.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "const AccountSummary = () => {\n  const router = useRouter();",
        "const AccountSummary = () => {\n  const { t } = useTranslation();\n  const router = useRouter();",
    )
    repls = [
        ("          Account Summary\n", '          {t("dashboard.accountSummary")}\n'),
        (
            '<p className="text-sm font-medium text-slate-700">Savings Account</p>',
            '<p className="text-sm font-medium text-slate-700">{t("dashboard.savingsAccount")}</p>',
        ),
        (
            """          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            Primary
          </span>""",
            """          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            {t("dashboard.primary")}
          </span>""",
        ),
        (
            '<dt className="text-slate-500">{detail.label}</dt>',
            """<dt className="text-slate-500">
                  {detail.label === "Account Number"
                    ? t("dashboard.accountNumber")
                    : detail.label === "Account Type"
                      ? t("dashboard.accountType")
                      : detail.label === "IFSC Code"
                        ? t("dashboard.ifscCode")
                        : detail.label === "Available Balance"
                          ? t("dashboard.availableBalance")
                          : detail.label}
                </dt>""",
        ),
        ("            View Statement\n", '            {t("dashboard.viewStatement")}\n'),
        ("            Account Details\n", '            {t("dashboard.accountDetails")}\n'),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS acct: {old[:50]!r}")
        else:
            text = text.replace(old, new, 1)
    p.write_text(text, encoding="utf-8")
    print("  AccountSummary wired")


def wire_member_quick():
    p = DASH / "MemberQuickActions.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "const MemberQuickActions = () => {\n  const router = useRouter();",
        "const MemberQuickActions = () => {\n  const { t } = useTranslation();\n  const router = useRouter();",
    )
    text = text.replace(
        "          Quick Actions\n",
        '          {t("dashboard.quickActions")}\n',
    )
    text = text.replace(
        '{action.label}',
        """{action.id === "fund-transfer"
                  ? t("dashboard.fundTransfer")
                  : action.id === "open-fd"
                    ? t("dashboard.openFixedDeposit")
                    : action.id === "apply-loan"
                      ? t("dashboard.applyForLoan")
                      : action.id === "download-passbook"
                        ? t("dashboard.downloadPassbook")
                        : action.id === "update-kyc"
                          ? t("dashboard.updateKyc")
                          : action.label}""",
    )
    p.write_text(text, encoding="utf-8")
    print("  MemberQuickActions wired")


def wire_quick_actions():
    p = DASH / "QuickActions.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "const QuickActions = () => {\n  const router = useRouter();",
        "const QuickActions = () => {\n  const { t } = useTranslation();\n  const router = useRouter();",
    )
    repls = [
        ('aria-label="Quick Actions"', 'aria-label={t("dashboard.quickActions")}'),
        (
            """          <TooltipContent side="bottom" className="sm:block">
            Quick Actions
          </TooltipContent>""",
            """          <TooltipContent side="bottom" className="sm:block">
            {t("dashboard.quickActions")}
          </TooltipContent>""",
        ),
        (
            '<DrawerTitle className="text-slate-800">Quick Actions</DrawerTitle>',
            '<DrawerTitle className="text-slate-800">{t("dashboard.quickActions")}</DrawerTitle>',
        ),
        (
            """          <DrawerDescription>
            Jump to the most used banking tasks
          </DrawerDescription>""",
            """          <DrawerDescription>
            {t("dashboard.quickActionsDesc")}
          </DrawerDescription>""",
        ),
        (
            """                    <span className="block text-sm font-semibold text-slate-800">
                      {action.label}
                    </span>""",
            """                    <span className="block text-sm font-semibold text-slate-800">
                      {action.id === "add-member"
                        ? t("dashboard.addMember")
                        : action.id === "open-account"
                          ? t("dashboard.openAccount")
                          : action.id === "new-deposit"
                            ? t("dashboard.newDeposit")
                            : action.id === "new-loan"
                              ? t("dashboard.newLoan")
                              : action.id === "send-notice"
                                ? t("dashboard.sendNotice")
                                : action.id === "view-reports"
                                  ? t("dashboard.viewReports")
                                  : action.label}
                    </span>""",
        ),
        (
            """                      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 sm:text-xs">
                        {action.description}
                      </span>""",
            """                      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500 sm:text-xs">
                        {action.id === "add-member"
                          ? t("dashboard.addMemberDesc")
                          : action.id === "open-account"
                            ? t("dashboard.openAccountDesc")
                            : action.id === "new-deposit"
                              ? t("dashboard.newDepositDesc")
                              : action.id === "new-loan"
                                ? t("dashboard.newLoanDesc")
                                : action.id === "send-notice"
                                  ? t("dashboard.sendNoticeDesc")
                                  : action.id === "view-reports"
                                    ? t("dashboard.viewReportsDesc")
                                    : action.description}
                      </span>""",
        ),
        (
            """            <Button type="button" variant="outline" className="h-10 w-full">
              Close
            </Button>""",
            """            <Button type="button" variant="outline" className="h-10 w-full">
              {t("dashboard.close")}
            </Button>""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS quick: {old[:50]!r}")
        else:
            text = text.replace(old, new, 1)
    p.write_text(text, encoding="utf-8")
    print("  QuickActions wired")


def wire_branch():
    p = DASH / "BranchLiquidityTable.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        """}) {
  return (""",
        """}) {
  const { t } = useTranslation();
  return (""",
    )
    repls = [
        (
            """          <CardTitle className="text-lg text-slate-900">
            Multi-Branch Operations &amp; Liquidity Matrix
          </CardTitle>
          <CardDescription>
            Branch-wise loan book, collection, and vault cash
          </CardDescription>""",
            """          <CardTitle className="text-lg text-slate-900">
            {t("dashboard.branchLiquidityTitle")}
          </CardTitle>
          <CardDescription>
            {t("dashboard.branchLiquidityDesc")}
          </CardDescription>""",
        ),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("dashboard.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("dashboard.searchBranch")}',
        ),
        (
            """          <span className="text-sm font-medium text-slate-500">
            {branches.length} Active Branches
          </span>""",
            """          <span className="text-sm font-medium text-slate-500">
            {t("dashboard.activeBranches", { count: branches.length })}
          </span>""",
        ),
        ("                Branch Name\n", '                {t("dashboard.branchName")}\n'),
        (
            "                Active Loan Book (₹)\n",
            '                {t("dashboard.activeLoanBook")}\n',
        ),
        (
            "                Today&apos;s Collection (₹)\n",
            '                {t("dashboard.todaysCollection")}\n',
        ),
        (
            "                Branch Vault Cash (₹)\n",
            '                {t("dashboard.branchVaultCash")}\n',
        ),
        ("                Open Loans\n", '                {t("dashboard.openLoans")}\n'),
        ("                Recovery %\n", '                {t("dashboard.recoveryPct")}\n'),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS branch: {old[:50]!r}")
        else:
            text = text.replace(old, new, 1)
    p.write_text(text, encoding="utf-8")
    print("  BranchLiquidityTable wired")


def wire_field_agent():
    p = DASH / "FieldAgentTable.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "export default function FieldAgentTable({ agents }) {\n  return (",
        "export default function FieldAgentTable({ agents }) {\n  const { t } = useTranslation();\n  return (",
    )
    repls = [
        (
            """            <CardTitle className="text-base text-slate-900 sm:text-lg">
              Field Collection Agent Performance &amp; Live Wallet
            </CardTitle>
            <CardDescription className="mt-1">
              Real-time tracking of field collection targets and wallet balances
            </CardDescription>""",
            """            <CardTitle className="text-base text-slate-900 sm:text-lg">
              {t("dashboard.fieldAgentTitle")}
            </CardTitle>
            <CardDescription className="mt-1">
              {t("dashboard.fieldAgentDesc")}
            </CardDescription>""",
        ),
        (
            """        <Badge className="w-fit shrink-0 border-0 bg-blue-50 font-medium text-blue-700">
          {agents.length} Field Agents Active
        </Badge>""",
            """        <Badge className="w-fit shrink-0 border-0 bg-blue-50 font-medium text-blue-700">
          {t("dashboard.fieldAgentsActive", { count: agents.length })}
        </Badge>""",
        ),
        ("                Agent Name\n", '                {t("dashboard.agentName")}\n'),
        (
            "                Assigned Kendras\n",
            '                {t("dashboard.assignedKendras")}\n',
        ),
        ("                Today Target\n", '                {t("dashboard.todayTarget")}\n'),
        ("                Collected\n", '                {t("dashboard.collected")}\n'),
        (
            "                Live Field Wallet\n",
            '                {t("dashboard.liveFieldWallet")}\n',
        ),
        ("                Status\n", '                {t("dashboard.status")}\n'),
        (
            """                    {agent.status}
                  </Badge>""",
            """                    {agent.status === "In Field"
                      ? t("dashboard.inField")
                      : agent.status === "Returning to Vault"
                        ? t("dashboard.returningToVault")
                        : agent.status}
                  </Badge>""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS field: {old[:50]!r}")
        else:
            text = text.replace(old, new, 1)
    p.write_text(text, encoding="utf-8")
    print("  FieldAgentTable wired")


def wire_liquid():
    p = DASH / "LiquidFundsCard.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "export default function LiquidFundsCard({ data }) {\n  return (",
        "export default function LiquidFundsCard({ data }) {\n  const { t } = useTranslation();\n  return (",
    )
    repls = [
        ("          {data.totalLabel}\n", '          {t("dashboard.totalLiquidFunds")}\n'),
        (
            """            <span style={{ color: "#e2e8f0" }}>
              Cash In Hand (Branch Vaults):{" "}
              <span className="font-semibold text-white">
                {formatINR(data.cashInHand)}
              </span>
            </span>""",
            """            <span style={{ color: "#e2e8f0" }}>
              {t("dashboard.cashInHand")}{" "}
              <span className="font-semibold text-white">
                {formatINR(data.cashInHand)}
              </span>
            </span>""",
        ),
        (
            """            <span style={{ color: "#e2e8f0" }}>
              Bank Balances (Commercial Banks):{" "}
              <span className="font-semibold text-white">
                {formatINR(data.bankBalance)}
              </span>
            </span>""",
            """            <span style={{ color: "#e2e8f0" }}>
              {t("dashboard.bankBalances")}{" "}
              <span className="font-semibold text-white">
                {formatINR(data.bankBalance)}
              </span>
            </span>""",
        ),
        ("          {data.footerLabel}\n", '          {t("dashboard.realtimeCbs")}\n'),
        ("          {data.footerLinkText}\n", '          {t("dashboard.openFullLedger")}\n'),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS liquid: {old[:50]!r}")
        else:
            text = text.replace(old, new, 1)
    p.write_text(text, encoding="utf-8")
    print("  LiquidFundsCard wired")


def wire_cash():
    p = DASH / "CashDenominationTally.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "export default function CashDenominationTally({ data }) {\n  const [counts, setCounts]",
        "export default function CashDenominationTally({ data }) {\n  const { t } = useTranslation();\n  const [counts, setCounts]",
    )
    note_map = {
        "500": "notes500",
        "200": "notes200",
        "100": "notes100",
        "50": "notes50",
        "20": "notes20",
        "10": "notes10",
    }
    repls = [
        (
            """          <CardTitle className="text-lg text-slate-900">
            Physical Cash Denomination Tally
          </CardTitle>
          <p className="mt-1 text-sm text-slate-500">নগদ নোট হিসাব</p>""",
            """          <CardTitle className="text-lg text-slate-900">
            {t("dashboard.cashTallyTitle")}
          </CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            {t("dashboard.cashNoteCount")}
          </p>""",
        ),
        (
            """          <Badge className="border-0 bg-emerald-50 font-medium text-emerald-700">
            Reconciled Zero Variance
          </Badge>""",
            """          <Badge className="border-0 bg-emerald-50 font-medium text-emerald-700">
            {t("dashboard.reconciledZero")}
          </Badge>""",
        ),
        (
            '              <p className="text-xs font-medium text-slate-500">{row.label}</p>',
            """              <p className="text-xs font-medium text-slate-500">
                {row.id === "500"
                  ? t("dashboard.notes500")
                  : row.id === "200"
                    ? t("dashboard.notes200")
                    : row.id === "100"
                      ? t("dashboard.notes100")
                      : row.id === "50"
                        ? t("dashboard.notes50")
                        : row.id === "20"
                          ? t("dashboard.notes20")
                          : row.id === "10"
                            ? t("dashboard.notes10")
                            : row.label}
              </p>""",
        ),
        (
            """          <p className="text-sm font-semibold text-slate-900">
            Total Physical Counted Cash: {formatINR(totalCounted)}
          </p>""",
            """          <p className="text-sm font-semibold text-slate-900">
            {t("dashboard.totalPhysicalCash")} {formatINR(totalCounted)}
          </p>""",
        ),
        (
            "            Variance: {formatINR(data.variance)} (Balanced)\n",
            '            {t("dashboard.varianceBalanced", { amount: formatINR(data.variance) })}\n',
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS cash: {old[:50]!r}")
        else:
            text = text.replace(old, new, 1)
    p.write_text(text, encoding="utf-8")
    print("  CashDenominationTally wired")


def wire_npa():
    p = DASH / "NpaCards.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    text = text.replace(
        "export default function NpaCards({ metrics }) {\n  return (",
        "export default function NpaCards({ metrics }) {\n  const { t } = useTranslation();\n  return (",
    )
    text = text.replace(
        """                <p className="text-sm font-medium text-slate-500">
                  {metric.label}
                </p>""",
        """                <p className="text-sm font-medium text-slate-500">
                  {metric.id === "gross"
                    ? t("dashboard.grossNpa")
                    : metric.id === "net"
                      ? t("dashboard.netNpa")
                      : metric.label}
                </p>""",
    )
    text = text.replace(
        """                  <p className="mt-0.5 text-xs text-slate-500">
                    {metric.subLabel}
                  </p>""",
        """                  <p className="mt-0.5 text-xs text-slate-500">
                    {metric.id === "gross"
                      ? t("dashboard.grossNpaSub")
                      : metric.id === "net"
                        ? t("dashboard.netNpaSub")
                        : metric.subLabel}
                  </p>""",
    )
    p.write_text(text, encoding="utf-8")
    print("  NpaCards wired")


def wire_stat_card():
    p = DASH / "MicrofinanceStatCard.jsx"
    text = ensure_t_import(p.read_text(encoding="utf-8"))
    # find component function
    text = text.replace(
        "export default function MicrofinanceStatCard({ card }) {\n",
        "export default function MicrofinanceStatCard({ card }) {\n  const { t } = useTranslation();\n",
    )
    # if already has something else after {
    if "const { t } = useTranslation();\n  const { t }" in text:
        text = text.replace("  const { t } = useTranslation();\n  const { t } = useTranslation();\n", "  const { t } = useTranslation();\n")
    text = text.replace(
        '          <p className="text-sm font-medium text-slate-500">{card.label}</p>',
        """          <p className="text-sm font-medium text-slate-500">
            {card.id === "glp"
              ? t("dashboard.grossLoanPortfolio")
              : card.id === "collection"
                ? t("dashboard.collectionEfficiency")
                : card.id === "par"
                  ? t("dashboard.par30")
                  : card.id === "borrowers"
                    ? t("dashboard.activeBorrowers")
                    : card.label}
          </p>""",
    )
    text = text.replace(
        '            <p className="text-xs text-slate-500">{card.subLabel}</p>',
        """            <p className="text-xs text-slate-500">
              {card.id === "glp"
                ? t("dashboard.disbursed")
                : card.id === "collection"
                  ? t("dashboard.mtd")
                  : card.id === "par"
                    ? t("dashboard.par90")
                    : card.id === "borrowers"
                      ? t("dashboard.kendras1")
                      : card.subLabel}
            </p>""",
    )
    text = text.replace(
        '            <p className="text-xs text-slate-500">{card.extraLabel}</p>',
        """            <p className="text-xs text-slate-500">
              {card.id === "collection"
                ? t("dashboard.todayAmt")
                : card.id === "borrowers"
                  ? t("dashboard.activeJlgs1")
                  : card.extraLabel}
            </p>""",
    )
    # badge text
    if "card.badge.text" in text:
        text = text.replace(
            "{card.badge.text}",
            """{card.id === "glp"
                  ? t("dashboard.qualifying100")
                  : card.id === "par"
                    ? t("dashboard.healthyAsset")
                    : card.badge.text}""",
        )
    # borrowers value "1 Clients" is in card.value - leave as data (dynamic mock)
    p.write_text(text, encoding="utf-8")
    print("  MicrofinanceStatCard wired")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    print("wiring components...")
    wire_index()
    wire_member_summary()
    wire_txn_table()
    wire_account_summary()
    wire_member_quick()
    wire_quick_actions()
    wire_branch()
    wire_field_agent()
    wire_liquid()
    wire_cash()
    wire_npa()
    wire_stat_card()
    print("done")
