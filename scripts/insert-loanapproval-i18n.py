# -*- coding: utf-8 -*-
"""Insert loanApproval locales and wire Loanapproal components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BASE = ROOT / "components" / "approval" / "Loanapproal"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


# Compact EN/HI/BN/OR for list + modal static UI
def build_loan(lang_map):
    return lang_map


LOAN = {
    "en": {
        "loanApproval": "Loan Approval",
        "searchPlaceholder": "Search by app no, name, product...",
        "applicationNo": "Application No",
        "date": "Date",
        "caseNo": "Case No",
        "applicantName": "Applicant Name",
        "product": "Product",
        "noPendingApprovals": "No pending approvals found matching your search.",
        "loanApplicationDetails": "Loan Application Details",
        "appNo": "App No:",
        "caseNoLabel": "Case No:",
        "applicationInfo": "Application Info",
        "applicationDate": "Application Date",
        "productName": "Product Name",
        "applicantAmount": "Applicant Amount",
        "roi": "ROI (%)",
        "duration": "Duration",
        "repaymentMode": "Repayment Mode",
        "finalRepaymentDate": "Final Repayment Date",
        "ecsMode": "ECS Mode",
        "appliedBy": "Applied By",
        "createdOn": "Created On",
        "loanPurpose": "Loan Purpose",
        "jointHolderDetails": "Joint Holder Details",
        "jointHolder1": "Joint Holder 1",
        "jointHolder2": "Joint Holder 2",
        "loanBasedOn": "Loan Based On",
        "viewGuarantorDetails": "View Guarantor Details",
        "noGuarantorDetails": "No Guarantor Details",
        "viewProjectDetails": "View Project Details",
        "noProjectDetails": "No Project Details",
        "viewSecurityDetails": "View Security Details",
        "noSecurityDetails": "No Security Details",
        "close": "Close",
        "reject": "Reject",
        "approve": "Approve",
        "guarantorDetails": "Guarantor Details",
        "guarantorName": "Guarantor Name",
        "projectDetails": "Project Details",
        "projectName": "Project Name",
        "projectCost": "Project Cost",
        "ownContribution": "Own Contribution",
        "mouza": "Mouza",
        "plotNo": "Plot No",
        "landArea": "Land Area",
        "hypothecatedValue": "Hypothecated Value",
        "incomeGenAmount": "Income Gen Amount",
        "securityDetails": "Security Details",
        "depositCertificateSecurities": "Deposit / Certificate Securities",
        "certType": "Cert Type",
        "certNo": "Cert No",
        "issueDate": "Issue Date",
        "depositAmt": "Deposit Amt",
        "maturityDate": "Maturity Date",
        "maturityAmt": "Maturity Amt",
        "propertySecurities": "Property Securities",
        "typeName": "Type Name",
        "location": "Location",
        "area": "Area",
        "owner": "Owner",
        "coOwner": "Co-Owner",
        "details": "Details",
        "latitude": "Latitude",
        "longitude": "Longitude",
        "value": "Value",
        "itemName": "Item Name",
        "brand": "Brand",
        "cost": "Cost",
        "ownCont": "Own Cont.",
        "rejectLoanApplication": "Reject Loan Application",
        "rejectionRemarks": "Rejection Remarks",
        "enterRejectionReason": "Enter reason for rejection...",
        "pleaseEnterRejectionRemarks": "Please enter remarks for rejection.",
        "confirmRejection": "Confirm Rejection",
        "approveLoanApplication": "Approve Loan Application",
        "sanctionDate": "Sanction Date",
        "appliedAmount": "Applied Amount",
        "sanctionAmount": "Sanction Amount",
        "enterSanctionAmount": "Enter Sanction amount",
        "pleaseSelectApprovalDate": "Please select an approval date.",
        "pleaseEnterValidApprovedAmount": "Please enter a valid approved amount.",
        "approvedAmountExceeds": "Approved amount cannot be greater than applied amount ({{amount}}).",
        "errorLoadingDeductions": "Error loading deduction charges list.",
        "loading": "Loading...",
        "submit": "Submit",
        "deductionChargesList": "Deduction Charges List",
        "chargeName": "Charge Name",
        "transactionBlock": "Transaction Block",
        "cash": "Cash",
        "bank": "Bank",
        "savings": "Savings",
        "enterRefVouchNo": "Enter ref. vouch no.",
        "selectBank": "Select bank",
        "searchBank": "Search bank...",
        "selectSavings": "Select savings",
        "searchSavings": "Search savings...",
        "accountHolderName": "Account Holder Name",
        "enterName": "Enter name",
        "availableBalance": "Available Balance",
        "enterBalance": "Enter balance",
        "back": "Back",
    },
}

# Translate HI/BN/OR for critical UI; field labels can mirror EN structure with translations
LOAN["hi"] = {
    **{k: v for k, v in LOAN["en"].items()},
    "loanApproval": "ऋण अनुमोदन",
    "searchPlaceholder": "ऐप नंबर, नाम, उत्पाद से खोजें...",
    "applicationNo": "आवेदन संख्या",
    "date": "दिनांक",
    "caseNo": "केस नंबर",
    "applicantName": "आवेदक का नाम",
    "product": "उत्पाद",
    "noPendingApprovals": "आपकी खोज से मेल खाने वाला कोई लंबित अनुमोदन नहीं मिला।",
    "loanApplicationDetails": "ऋण आवेदन विवरण",
    "appNo": "आवेदन संख्या:",
    "caseNoLabel": "केस संख्या:",
    "applicationInfo": "आवेदन जानकारी",
    "close": "बंद करें",
    "reject": "अस्वीकार करें",
    "approve": "अनुमोदित करें",
    "cancel": "रद्द करें",
    "loading": "लोड हो रहा है...",
    "submit": "जमा करें",
    "back": "वापस",
    "pleaseEnterRejectionRemarks": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
    "confirmRejection": "अस्वीकृति की पुष्टि करें",
    "rejectLoanApplication": "ऋण आवेदन अस्वीकार करें",
    "approveLoanApplication": "ऋण आवेदन अनुमोदित करें",
    "pleaseSelectApprovalDate": "कृपया अनुमोदन दिनांक चुनें।",
    "pleaseEnterValidApprovedAmount": "कृपया मान्य अनुमोदित राशि दर्ज करें।",
    "approvedAmountExceeds": "अनुमोदित राशि आवेदन राशि ({{amount}}) से अधिक नहीं हो सकती।",
    "errorLoadingDeductions": "कटौती शुल्क सूची लोड करने में त्रुटि।",
}
LOAN["bn"] = {
    **{k: v for k, v in LOAN["en"].items()},
    "loanApproval": "ঋণ অনুমোদন",
    "searchPlaceholder": "অ্যাপ নম্বর, নাম, পণ্য দিয়ে অনুসন্ধান করুন...",
    "applicationNo": "আবেদন নম্বর",
    "date": "তারিখ",
    "caseNo": "কেস নম্বর",
    "applicantName": "আবেদনকারীর নাম",
    "product": "পণ্য",
    "noPendingApprovals": "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো মুলতুবি অনুমোদন পাওয়া যায়নি।",
    "loanApplicationDetails": "ঋণ আবেদনের বিবরণ",
    "appNo": "আবেদন নং:",
    "caseNoLabel": "কেস নং:",
    "applicationInfo": "আবেদনের তথ্য",
    "close": "বন্ধ করুন",
    "reject": "প্রত্যাখ্যান",
    "approve": "অনুমোদন",
    "loading": "লোড হচ্ছে...",
    "submit": "জমা দিন",
    "back": "পিছনে",
    "pleaseEnterRejectionRemarks": "প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
    "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
    "rejectLoanApplication": "ঋণ আবেদন প্রত্যাখ্যান",
    "approveLoanApplication": "ঋণ আবেদন অনুমোদন",
    "pleaseSelectApprovalDate": "অনুমোদনের তারিখ নির্বাচন করুন।",
    "pleaseEnterValidApprovedAmount": "বৈধ অনুমোদিত পরিমাণ লিখুন।",
    "approvedAmountExceeds": "অনুমোদিত পরিমাণ আবেদনকৃত পরিমাণ ({{amount}}) এর বেশি হতে পারে না।",
    "errorLoadingDeductions": "কাটছাঁট চার্জ তালিকা লোড করতে ত্রুটি।",
}
LOAN["or"] = {
    **{k: v for k, v in LOAN["en"].items()},
    "loanApproval": "ଋଣ ଅନୁମୋଦନ",
    "searchPlaceholder": "ଆବେଦନ ନମ୍ବର, ନାମ, ଉତ୍ପାଦ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
    "applicationNo": "ଆବେଦନ ନମ୍ବର",
    "date": "ତାରିଖ",
    "caseNo": "କେସ୍ ନମ୍ବର",
    "applicantName": "ଆବେଦନକାରୀଙ୍କ ନାମ",
    "product": "ଉତ୍ପାଦ",
    "noPendingApprovals": "ଆପଣଙ୍କ ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
    "loanApplicationDetails": "ଋଣ ଆବେଦନ ବିବରଣୀ",
    "appNo": "ଆବେଦନ ନଂ:",
    "caseNoLabel": "କେସ୍ ନଂ:",
    "applicationInfo": "ଆବେଦନ ସୂଚନା",
    "close": "ବନ୍ଦ କରନ୍ତୁ",
    "reject": "ପ୍ରତ୍ୟାଖ୍ୟାନ",
    "approve": "ଅନୁମୋଦନ",
    "loading": "ଲୋଡ୍ ହେଉଛି...",
    "submit": "ଦାଖଲ କରନ୍ତୁ",
    "back": "ପଛକୁ",
    "pleaseEnterRejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ପାଇଁ ମନ୍ତବ୍ୟ ଲେଖନ୍ତୁ।",
    "confirmRejection": "ପ୍ରତ୍ୟାଖ୍ୟାନ ନିଶ୍ଚିତ କରନ୍ତୁ",
    "rejectLoanApplication": "ଋଣ ଆବେଦନ ପ୍ରତ୍ୟାଖ୍ୟାନ",
    "approveLoanApplication": "ଋଣ ଆବେଦନ ଅନୁମୋଦନ",
    "pleaseSelectApprovalDate": "ଅନୁମୋଦନ ତାରିଖ ଚୟନ କରନ୍ତୁ।",
    "pleaseEnterValidApprovedAmount": "ବୈଧ ଅନୁମୋଦିତ ରାଶି ପ୍ରବେଶ କରନ୍ତୁ।",
    "approvedAmountExceeds": "ଅନୁମୋଦିତ ରାଶି ଆବେଦନ ରାଶି ({{amount}}) ଠାରୁ ଅଧିକ ହୋଇପାରିବ ନାହିଁ।",
    "errorLoadingDeductions": "କଟତି ଚାର୍ଜ ତାଲିକା ଲୋଡ୍ କରିବାରେ ତ୍ରୁଟି।",
}

COMMON_EXTRA = {
    "en": {
        "showing": "Showing",
        "of": "of",
        "entries": "entries",
    },
    "hi": {
        "showing": "दिखाया जा रहा है",
        "of": "में से",
        "entries": "प्रविष्टियां",
    },
    "bn": {
        "showing": "দেখানো হচ্ছে",
        "of": "এর মধ্যে",
        "entries": "এন্ট্রি",
    },
    "or": {
        "showing": "ଦେଖାଯାଉଛି",
        "of": "ମଧ୍ୟରୁ",
        "entries": "ଏଣ୍ଟ୍ରି",
    },
}


def add_to_bank_common(text: str, extras: dict) -> str:
    bank = text.find("\n    bank: {")
    common_start = text.rfind("\n    common: {", 0, bank)
    body_start = common_start + len("\n    common: {")
    pre = text[body_start:bank]
    inner_end = pre.rfind("\n    },")
    body = pre[:inner_end]
    adds = []
    for k, v in extras.items():
        if re.search(rf"\n      {re.escape(k)}:", body):
            continue
        esc = v.replace("\\", "\\\\").replace('"', '\\"')
        adds.append(f'      {k}: "{esc}"')
    if not adds:
        return text
    body = body.rstrip()
    if body and not body.endswith(","):
        body += ","
    body = body + "\n" + ",\n".join(adds) + "\n"
    return text[:body_start] + body + pre[inner_end:] + text[bank:]


def insert_after_top_block(text: str, block_name: str, new_block: str) -> str:
    m = re.search(rf"(\n    {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"top-level {block_name} not found")
    depth = 0
    i = m.end(1) - 1
    end = None
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                j = i + 1
                if j < len(text) and text[j] == ",":
                    j += 1
                end = j
                break
        i += 1
    if end is None:
        raise SystemExit(f"could not close {block_name}")
    return text[:end] + "\n" + new_block + text[end:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    if re.search(r"\n    loanApproval:\s*\{", text):
        print(f"{lang}: loanApproval already present")
    else:
        block = (
            "    loanApproval: {\n"
            + js_obj(LOAN[lang], indent=6)
            + "\n    },"
        )
        for anchor in (
            "depositApproval",
            "rejectReasonModal",
            "membershipApproval",
            "kycApproval",
        ):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common pagination keys")
        text = text2
    else:
        print(f"{lang}: common ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_index():
    p = BASE / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\n',
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "const LoanapproalComponent = (props) => {\n  const {",
            "const LoanapproalComponent = (props) => {\n  const { t } = useTranslation();\n\n  const {",
            1,
        )

    repls = [
        (
            """          Loan Approval
        </h2>""",
            """          {t("loanApproval.loanApproval")}
        </h2>""",
        ),
        (
            'placeholder="Search by app no, name, product..."',
            'placeholder={t("loanApproval.searchPlaceholder")}',
        ),
        (
            """                <TableHead className="w-[50px] font-semibold">Sl</TableHead>
                <TableHead className="font-semibold">Application No</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Case No</TableHead>
                <TableHead className="font-semibold">Applicant Name</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>""",
            """                <TableHead className="w-[50px] font-semibold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("loanApproval.applicationNo")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("loanApproval.date")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("loanApproval.caseNo")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("loanApproval.applicantName")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("loanApproval.product")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.amount")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("common.action")}
                </TableHead>""",
        ),
        (
            "<p>No pending approvals found matching your search.</p>",
            '<p>{t("loanApproval.noPendingApprovals")}</p>',
        ),
        (
            """            <div className="text-sm text-gray-500">
              Showing{" "}
              {kycList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </div>""",
            """            <div className="text-sm text-gray-500">
              {t("common.showing")}{" "}
              {kycList.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              {t("common.to")}{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
              {t("common.of")} {totalItems} {t("common.entries")}
            </div>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("INDEX MISSING:", repr(old[:90]))
        else:
            t = t.replace(old, new)
            print("INDEX OK:", old[:50].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_modal():
    p = BASE / "LoanActionModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        # find a stable import to inject after
        if 'import DoubleCashDenomTable' in t:
            t = t.replace(
                'import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";\n',
                'import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";\nimport { useTranslation } from "react-i18next";\n',
                1,
            )
        else:
            t = 'import { useTranslation } from "react-i18next";\n' + t

    if "const { t } = useTranslation()" not in t:
        # inject after component start - look for first useState
        t = t.replace(
            "  const [guarantorOpen, setGuarantorOpen] = useState(false);",
            '  const { t } = useTranslation();\n\n  const [guarantorOpen, setGuarantorOpen] = useState(false);',
            1,
        )

    repls = [
        (
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Loan Application Details
              </DialogTitle>""",
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                {t("loanApproval.loanApplicationDetails")}
              </DialogTitle>""",
        ),
        (
            "App No: {selectedApplication.Appl_No || \"—\"}",
            '{t("loanApproval.appNo")}{" "}\n                  {selectedApplication.Appl_No || "—"}',
        ),
        (
            "Case No: {selectedApplication.Loan_CaseNo || \"—\"}",
            '{t("loanApproval.caseNoLabel")}{" "}\n                  {selectedApplication.Loan_CaseNo || "—"}',
        ),
        ("<span>Application Info</span>", '<span>{t("loanApproval.applicationInfo")}</span>'),
        ('"Application Date"', 't("loanApproval.applicationDate")'),
        ('renderField("Product Name"', 'renderField(t("loanApproval.productName")'),
        ('renderField("Applicant Name"', 'renderField(t("loanApproval.applicantName")'),
        ('"Applicant Amount"', 't("loanApproval.applicantAmount")'),
        ('renderField("ROI (%)"', 'renderField(t("loanApproval.roi")'),
        ('"Duration"', 't("loanApproval.duration")'),
        ('"Repayment Mode"', 't("loanApproval.repaymentMode")'),
        ('"Final Repayment Date"', 't("loanApproval.finalRepaymentDate")'),
        ('renderField("ECS Mode"', 'renderField(t("loanApproval.ecsMode")'),
        ('renderField("Applied By"', 'renderField(t("loanApproval.appliedBy")'),
        ('"Created On"', 't("loanApproval.createdOn")'),
        ('renderField("Loan Purpose"', 'renderField(t("loanApproval.loanPurpose")'),
        ("<span>Joint Holder Details</span>", '<span>{t("loanApproval.jointHolderDetails")}</span>'),
        ('"Joint Holder 1"', 't("loanApproval.jointHolder1")'),
        ('"Joint Holder 2"', 't("loanApproval.jointHolder2")'),
        ("<span>Loan Based On</span>", '<span>{t("loanApproval.loanBasedOn")}</span>'),
        (
            """                        View Guarantor Details
                      </Button>""",
            """                        {t("loanApproval.viewGuarantorDetails")}
                      </Button>""",
        ),
        (
            """                        No Guarantor Details
""",
            """                        {t("loanApproval.noGuarantorDetails")}
""",
        ),
        (
            """                        View Project Details
                      </Button>""",
            """                        {t("loanApproval.viewProjectDetails")}
                      </Button>""",
        ),
        (
            """                        No Project Details
""",
            """                        {t("loanApproval.noProjectDetails")}
""",
        ),
        (
            """                        View Security Details
                      </Button>""",
            """                        {t("loanApproval.viewSecurityDetails")}
                      </Button>""",
        ),
        (
            """                        No Security Details
""",
            """                        {t("loanApproval.noSecurityDetails")}
""",
        ),
        (
            """            >
              Close
            </Button>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                className="bg-[#991B1B]""",
            """            >
              {t("loanApproval.close")}
            </Button>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                className="bg-[#991B1B]""",
        ),
        (
            '<Ban className="w-4 h-4 mr-2" /> Reject',
            '<Ban className="w-4 h-4 mr-2" /> {t("loanApproval.reject")}',
        ),
        (
            '<CheckCircle2 className="w-4 h-4 mr-2" /> Approve\n              </Button>\n            </div>\n          </div>\n        </DialogContent>\n      </Dialog>\n\n      {/* 3. Guarantor',
            '<CheckCircle2 className="w-4 h-4 mr-2" /> {t("loanApproval.approve")}\n              </Button>\n            </div>\n          </div>\n        </DialogContent>\n      </Dialog>\n\n      {/* 3. Guarantor',
        ),
        (
            """              Guarantor Details
            </DialogTitle>""",
            """              {t("loanApproval.guarantorDetails")}
            </DialogTitle>""",
        ),
        ("<TableHead>Guarantor Name</TableHead>", '<TableHead>{t("loanApproval.guarantorName")}</TableHead>'),
        (
            """              Project Details
            </DialogTitle>""",
            """              {t("loanApproval.projectDetails")}
            </DialogTitle>""",
        ),
        ('renderField("Project Name"', 'renderField(t("loanApproval.projectName")'),
        ('renderField("Project Cost"', 'renderField(t("loanApproval.projectCost")'),
        ('renderField("Own Contribution"', 'renderField(t("loanApproval.ownContribution")'),
        ('renderField("Mouza"', 'renderField(t("loanApproval.mouza")'),
        ('renderField("Plot No"', 'renderField(t("loanApproval.plotNo")'),
        ('renderField("Land Area"', 'renderField(t("loanApproval.landArea")'),
        ('renderField("Hypothecated Value"', 'renderField(t("loanApproval.hypothecatedValue")'),
        ('renderField("Income Gen Amount"', 'renderField(t("loanApproval.incomeGenAmount")'),
        (
            """              Security Details
            </DialogTitle>""",
            """              {t("loanApproval.securityDetails")}
            </DialogTitle>""",
        ),
        (
            "Deposit / Certificate Securities",
            '{t("loanApproval.depositCertificateSecurities")}',
        ),
        ("<TableHead>Cert Type</TableHead>", '<TableHead>{t("loanApproval.certType")}</TableHead>'),
        ("<TableHead>Cert No</TableHead>", '<TableHead>{t("loanApproval.certNo")}</TableHead>'),
        ("<TableHead>Issue Date</TableHead>", '<TableHead>{t("loanApproval.issueDate")}</TableHead>'),
        ("<TableHead>Deposit Amt</TableHead>", '<TableHead>{t("loanApproval.depositAmt")}</TableHead>'),
        ("<TableHead>ROI (%)</TableHead>", '<TableHead>{t("loanApproval.roi")}</TableHead>'),
        ("<TableHead>Maturity Date</TableHead>", '<TableHead>{t("loanApproval.maturityDate")}</TableHead>'),
        ("<TableHead>Maturity Amt</TableHead>", '<TableHead>{t("loanApproval.maturityAmt")}</TableHead>'),
        ("Property Securities", '{t("loanApproval.propertySecurities")}'),
        ("<TableHead>Type Name</TableHead>", '<TableHead>{t("loanApproval.typeName")}</TableHead>'),
        ("<TableHead>Location</TableHead>", '<TableHead>{t("loanApproval.location")}</TableHead>'),
        ("<TableHead>Area</TableHead>", '<TableHead>{t("loanApproval.area")}</TableHead>'),
        ("<TableHead>Owner</TableHead>", '<TableHead>{t("loanApproval.owner")}</TableHead>'),
        ("<TableHead>Co-Owner</TableHead>", '<TableHead>{t("loanApproval.coOwner")}</TableHead>'),
        ("<TableHead>Details</TableHead>", '<TableHead>{t("loanApproval.details")}</TableHead>'),
        ("<TableHead>Latitude</TableHead>", '<TableHead>{t("loanApproval.latitude")}</TableHead>'),
        ("<TableHead>Longitude</TableHead>", '<TableHead>{t("loanApproval.longitude")}</TableHead>'),
        ("<TableHead>Value</TableHead>", '<TableHead>{t("loanApproval.value")}</TableHead>'),
        ("<TableHead>Item Name</TableHead>", '<TableHead>{t("loanApproval.itemName")}</TableHead>'),
        ("<TableHead>Brand</TableHead>", '<TableHead>{t("loanApproval.brand")}</TableHead>'),
        ("<TableHead>Cost</TableHead>", '<TableHead>{t("loanApproval.cost")}</TableHead>'),
        ("<TableHead>Own Cont.</TableHead>", '<TableHead>{t("loanApproval.ownCont")}</TableHead>'),
        (
            """              Reject Loan Application
            </DialogTitle>""",
            """              {t("loanApproval.rejectLoanApplication")}
            </DialogTitle>""",
        ),
        (
            """              Rejection Remarks <span className="text-red-500">*</span>""",
            """              {t("loanApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>""",
        ),
        (
            'placeholder="Enter reason for rejection..."',
            'placeholder={t("loanApproval.enterRejectionReason")}',
        ),
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("loanApproval.pleaseEnterRejectionRemarks"));',
        ),
        (
            """            >
              Confirm Rejection
            </Button>""",
            """            >
              {t("loanApproval.confirmRejection")}
            </Button>""",
        ),
        (
            """              Approve Loan Application
            </DialogTitle>""",
            """              {t("loanApproval.approveLoanApplication")}
            </DialogTitle>""",
        ),
        ('label="Sanction Date"', 'label={t("loanApproval.sanctionDate")}'),
        ('label="Applied Amount"', 'label={t("loanApproval.appliedAmount")}'),
        ('label="Sanction Amount"', 'label={t("loanApproval.sanctionAmount")}'),
        (
            'placeholder="Enter Sanction amount"',
            'placeholder={t("loanApproval.enterSanctionAmount")}',
        ),
        (
            'message: "Please select an approval date.",',
            'message: t("loanApproval.pleaseSelectApprovalDate"),',
        ),
        (
            'toast.error("Please select an approval date.");',
            'toast.error(t("loanApproval.pleaseSelectApprovalDate"));',
        ),
        (
            'message: "Please enter a valid approved amount.",',
            'message: t("loanApproval.pleaseEnterValidApprovedAmount"),',
        ),
        (
            'toast.error("Please enter a valid approved amount.");',
            'toast.error(t("loanApproval.pleaseEnterValidApprovedAmount"));',
        ),
        (
            """                    message: `Approved amount cannot be greater than applied amount (${selectedApplication.Appl_Amount}).`,
                  });
                  toast.error(
                    `Approved amount cannot be greater than applied amount (${selectedApplication.Appl_Amount}).`,
                  );""",
            """                    message: t("loanApproval.approvedAmountExceeds", {
                      amount: selectedApplication.Appl_Amount,
                    }),
                  });
                  toast.error(
                    t("loanApproval.approvedAmountExceeds", {
                      amount: selectedApplication.Appl_Amount,
                    }),
                  );""",
        ),
        (
            'toast.error("Error loading deduction charges list.");',
            'toast.error(t("loanApproval.errorLoadingDeductions"));',
        ),
        (
            '{deductionsLoading ? "Loading..." : "Submit"}',
            '{deductionsLoading\n                ? t("loanApproval.loading")\n                : t("loanApproval.submit")}',
        ),
        (
            """              Deduction Charges List
            </DialogTitle>""",
            """              {t("loanApproval.deductionChargesList")}
            </DialogTitle>""",
        ),
        ("<TableHead>Charge Name</TableHead>", '<TableHead>{t("loanApproval.chargeName")}</TableHead>'),
        (
            '<TableHead className="text-right">Amount</TableHead>',
            '<TableHead className="text-right">{t("common.amount")}</TableHead>',
        ),
        (
            "<TableCell colSpan={2}>Grand Total</TableCell>",
            '<TableCell colSpan={2}>{t("common.grandTotal")}</TableCell>',
        ),
        (
            """              <h3 className="w-full text-center text-xl font-semibold">
                Transaction Block
              </h3>""",
            """              <h3 className="w-full text-center text-xl font-semibold">
                {t("loanApproval.transactionBlock")}
              </h3>""",
        ),
        (
            """                              <FormLabel className="font-normal">
                                Cash
                              </FormLabel>""",
            """                              <FormLabel className="font-normal">
                                {t("loanApproval.cash")}
                              </FormLabel>""",
        ),
        (
            """                              <FormLabel className="font-normal">
                                Bank
                              </FormLabel>""",
            """                              <FormLabel className="font-normal">
                                {t("loanApproval.bank")}
                              </FormLabel>""",
        ),
        (
            """                              <FormLabel className="font-normal">
                                Savings
                              </FormLabel>""",
            """                              <FormLabel className="font-normal">
                                {t("loanApproval.savings")}
                              </FormLabel>""",
        ),
        (
            'placeholder="Enter ref. vouch no."',
            'placeholder={t("loanApproval.enterRefVouchNo")}',
        ),
        ('label="Bank"', 'label={t("loanApproval.bank")}'),
        ('placeholder="Select bank"', 'placeholder={t("loanApproval.selectBank")}'),
        (
            'searchPlaceholder="Search bank..."',
            'searchPlaceholder={t("loanApproval.searchBank")}',
        ),
        ('label="Savings"', 'label={t("loanApproval.savings")}'),
        (
            'placeholder="Select savings"',
            'placeholder={t("loanApproval.selectSavings")}',
        ),
        (
            'searchPlaceholder="Search savings..."',
            'searchPlaceholder={t("loanApproval.searchSavings")}',
        ),
        (
            'label="Account Holder Name"',
            'label={t("loanApproval.accountHolderName")}',
        ),
        ('placeholder="Enter name"', 'placeholder={t("loanApproval.enterName")}'),
        (
            'label="Available Balance"',
            'label={t("loanApproval.availableBalance")}',
        ),
        (
            'placeholder="Enter balance"',
            'placeholder={t("loanApproval.enterBalance")}',
        ),
        (
            """            >
              Back
            </Button>""",
            """            >
              {t("loanApproval.back")}
            </Button>""",
        ),
        (
            """            >
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};""",
            """            >
              {t("loanApproval.approve")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};""",
        ),
    ]

    # Close buttons that appear multiple times - replace remaining standalone Close
    # after specific ones handled
    close_btn = """            >
              Close
            </Button>"""
    close_t = """            >
              {t("loanApproval.close")}
            </Button>"""

    cancel_btn = """            <Button variant="outline" onClick={() => setShowRejectModal(false)} className="w-full sm:w-auto">
              Cancel
            </Button>"""
    cancel_t = """            <Button variant="outline" onClick={() => setShowRejectModal(false)} className="w-full sm:w-auto">
              {t("common.cancel")}
            </Button>"""

    cancel2 = """            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>"""
    cancel2_t = """            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              className="w-full sm:w-auto"
            >
              {t("common.cancel")}
            </Button>"""

    for old, new in repls + [(close_btn, close_t), (cancel_btn, cancel_t), (cancel2, cancel2_t)]:
        if old not in t:
            print("MODAL MISSING:", repr(old[:80]))
        else:
            n = t.count(old)
            t = t.replace(old, new)
            print(f"MODAL OK x{n}:", old[:45].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("modal done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_index()
    wire_modal()


if __name__ == "__main__":
    main()
