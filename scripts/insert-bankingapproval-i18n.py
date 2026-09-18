# -*- coding: utf-8 -*-
"""Insert bankingApproval locales and wire Approvalbanking components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BASE = ROOT / "components" / "approval" / "Approvalbanking"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


BANKING = {
    "en": {
        "bankingApproval": "Banking Approval",
        "searchPlaceholder": "Search by bank, account, type...",
        "transactionType": "Transaction Type",
        "queueNo": "Queue No",
        "noPendingApprovals": "No pending approvals found matching your search.",
        "bankingApprovalPortal": "Banking Approval Portal",
        "queueNoLabel": "Queue No:",
        "editDetails": "Edit Details",
        "cancelEdit": "Cancel Edit",
        "saveAndUpdate": "Save & Update",
        "openingDate": "Opening Date",
        "bankName": "Bank Name",
        "bankBranch": "Bank Branch",
        "ifscCode": "IFSC Code",
        "accountNo": "Account No",
        "accountType": "Account Type",
        "bankGl": "Bank GL",
        "transactionDate": "Transaction Date",
        "amount": "Amount",
        "selectAccountType": "Select Account Type",
        "searchAccountType": "Search account type...",
        "selectBankGl": "Select Bank GL",
        "searchBankGl": "Search bank gl...",
        "reject": "Reject",
        "approve": "Approve",
        "rejectApplication": "Reject Application",
        "rejectionRemarks": "Rejection Remarks",
        "enterRejectionReason": "Enter reason for rejection...",
        "pleaseEnterRejectionRemarks": "Please enter remarks for rejection.",
        "confirmRejection": "Confirm Rejection",
    },
    "hi": {
        "bankingApproval": "बैंकिंग अनुमोदन",
        "searchPlaceholder": "बैंक, खाता, प्रकार से खोजें...",
        "transactionType": "लेनदेन प्रकार",
        "queueNo": "क्यू नंबर",
        "noPendingApprovals": "आपकी खोज से मेल खाने वाले कोई लंबित अनुमोदन नहीं मिले।",
        "bankingApprovalPortal": "बैंकिंग अनुमोदन पोर्टल",
        "queueNoLabel": "क्यू नंबर:",
        "editDetails": "विवरण संपादित करें",
        "cancelEdit": "संपादन रद्द करें",
        "saveAndUpdate": "सहेजें और अपडेट करें",
        "openingDate": "खाता खोलने की तिथि",
        "bankName": "बैंक का नाम",
        "bankBranch": "बैंक शाखा",
        "ifscCode": "IFSC कोड",
        "accountNo": "खाता संख्या",
        "accountType": "खाता प्रकार",
        "bankGl": "बैंक जीएल",
        "transactionDate": "लेनदेन दिनांक",
        "amount": "राशि",
        "selectAccountType": "खाता प्रकार चुनें",
        "searchAccountType": "खाता प्रकार खोजें...",
        "selectBankGl": "बैंक जीएल चुनें",
        "searchBankGl": "बैंक जीएल खोजें...",
        "reject": "अस्वीकार करें",
        "approve": "अनुमोदित करें",
        "rejectApplication": "आवेदन अस्वीकार करें",
        "rejectionRemarks": "अस्वीकृति टिप्पणी",
        "enterRejectionReason": "अस्वीकृति का कारण दर्ज करें...",
        "pleaseEnterRejectionRemarks": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
        "confirmRejection": "अस्वीकृति की पुष्टि करें",
    },
    "bn": {
        "bankingApproval": "ব্যাংকিং অনুমোদন",
        "searchPlaceholder": "ব্যাংক, অ্যাকাউন্ট, টাইপ দিয়ে খুঁজুন...",
        "transactionType": "লেনদেনের ধরন",
        "queueNo": "কিউ নম্বর",
        "noPendingApprovals": "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পেন্ডিং অনুমোদন পাওয়া যায়নি।",
        "bankingApprovalPortal": "ব্যাংকিং অনুমোদন পোর্টাল",
        "queueNoLabel": "কিউ নম্বর:",
        "editDetails": "বিবরণ সম্পাদনা",
        "cancelEdit": "সম্পাদনা বাতিল",
        "saveAndUpdate": "সংরক্ষণ ও আপডেট",
        "openingDate": "খোলার তারিখ",
        "bankName": "ব্যাংকের নাম",
        "bankBranch": "ব্যাংক শাখা",
        "ifscCode": "IFSC কোড",
        "accountNo": "অ্যাকাউন্ট নম্বর",
        "accountType": "অ্যাকাউন্টের ধরন",
        "bankGl": "ব্যাংক জিএল",
        "transactionDate": "লেনদেনের তারিখ",
        "amount": "পরিমাণ",
        "selectAccountType": "অ্যাকাউন্টের ধরন নির্বাচন করুন",
        "searchAccountType": "অ্যাকাউন্টের ধরন খুঁজুন...",
        "selectBankGl": "ব্যাংক জিএল নির্বাচন করুন",
        "searchBankGl": "ব্যাংক জিএল খুঁজুন...",
        "reject": "প্রত্যাখ্যান",
        "approve": "অনুমোদন",
        "rejectApplication": "আবেদন প্রত্যাখ্যান",
        "rejectionRemarks": "প্রত্যাখ্যানের মন্তব্য",
        "enterRejectionReason": "প্রত্যাখ্যানের কারণ লিখুন...",
        "pleaseEnterRejectionRemarks": "প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
        "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
    },
    "or": {
        "bankingApproval": "ବ୍ୟାଙ୍କିଂ ଅନୁମୋଦନ",
        "searchPlaceholder": "ବ୍ୟାଙ୍କ, ଆକାଉଣ୍ଟ, ପ୍ରକାର ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
        "transactionType": "କାରବାର ପ୍ରକାର",
        "queueNo": "କ୍ୟୁ ନମ୍ବର",
        "noPendingApprovals": "ଆପଣଙ୍କ ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
        "bankingApprovalPortal": "ବ୍ୟାଙ୍କିଂ ଅନୁମୋଦନ ପୋର୍ଟାଲ୍",
        "queueNoLabel": "କ୍ୟୁ ନମ୍ବର:",
        "editDetails": "ବିବରଣୀ ସମ୍ପାଦନା",
        "cancelEdit": "ସମ୍ପାଦନା ବାତିଲ୍",
        "saveAndUpdate": "ସେଭ୍ ଏବଂ ଅପଡେଟ୍",
        "openingDate": "ଖୋଲିବା ତାରିଖ",
        "bankName": "ବ୍ୟାଙ୍କ ନାମ",
        "bankBranch": "ବ୍ୟାଙ୍କ ଶାଖା",
        "ifscCode": "IFSC କୋଡ୍",
        "accountNo": "ଆକାଉଣ୍ଟ ନମ୍ବର",
        "accountType": "ଆକାଉଣ୍ଟ ପ୍ରକାର",
        "bankGl": "ବ୍ୟାଙ୍କ ଜିଏଲ୍",
        "transactionDate": "କାରବାର ତାରିଖ",
        "amount": "ରାଶି",
        "selectAccountType": "ଆକାଉଣ୍ଟ ପ୍ରକାର ବାଛନ୍ତୁ",
        "searchAccountType": "ଆକାଉଣ୍ଟ ପ୍ରକାର ଖୋଜନ୍ତୁ...",
        "selectBankGl": "ବ୍ୟାଙ୍କ ଜିଏଲ୍ ବାଛନ୍ତୁ",
        "searchBankGl": "ବ୍ୟାଙ୍କ ଜିଏଲ୍ ଖୋଜନ୍ତୁ...",
        "reject": "ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "approve": "ଅନୁମୋଦନ",
        "rejectApplication": "ଆବେଦନ ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "rejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ମନ୍ତବ୍ୟ",
        "enterRejectionReason": "ପ୍ରତ୍ୟାଖ୍ୟାନର କାରଣ ଲେଖନ୍ତୁ...",
        "pleaseEnterRejectionRemarks": "ଦୟାକରି ପ୍ରତ୍ୟାଖ୍ୟାନ ପାଇଁ ମନ୍ତବ୍ୟ ଲେଖନ୍ତୁ।",
        "confirmRejection": "ପ୍ରତ୍ୟାଖ୍ୟାନ ନିଶ୍ଚିତ କରନ୍ତୁ",
    },
}


def insert_after_top_block(text: str, block_name: str, new_block: str) -> str:
    m = re.search(rf"(\n    {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"top-level {block_name} not found")
    depth = 0
    i = m.end(1) - 1
    end = None
    while i < len(text):
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
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
    if re.search(r"\n    bankingApproval:\s*\{", text):
        print(f"{lang}: bankingApproval already present")
        return
    block = (
        "    bankingApproval: {\n"
        + js_obj(BANKING[lang], indent=6)
        + "\n    },"
    )
    for anchor in ("voucherApproval", "loanApproval", "depositApproval"):
        if re.search(rf"\n    {anchor}:\s*\{{", text):
            text = insert_after_top_block(text, anchor, block)
            path.write_text(text, encoding="utf-8")
            print(f"{lang}: inserted after {anchor}")
            return
    raise SystemExit(f"{lang}: no anchor found")


def wire_index() -> None:
    path = BASE / "index.jsx"
    text = path.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\n',
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            "  bankGlData,\n}) => {\n  const getMappedName",
            "  bankGlData,\n}) => {\n  const { t } = useTranslation();\n\n  const getMappedName",
        )

    repls = [
        (
            """        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          Banking Approval
        </h2>""",
            """        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          {t("bankingApproval.bankingApproval")}
        </h2>""",
        ),
        (
            'placeholder="Search by bank, account, type..."',
            'placeholder={t("bankingApproval.searchPlaceholder")}',
        ),
        (
            """                <TableHead className="w-[50px]  font-semibold">
                  Sl
                </TableHead>
                <TableHead className=" font-semibold">
                  Transaction Type
                </TableHead>
                <TableHead className=" font-semibold">
                  Queue No
                </TableHead>
                <TableHead className=" font-semibold">
                  Bank Name
                </TableHead>
                <TableHead className=" font-semibold">
                  Account No
                </TableHead>
                <TableHead className=" font-semibold">Amount</TableHead>
                <TableHead className="text-right font-semibold">
                  Action
                </TableHead>""",
            """                <TableHead className="w-[50px]  font-semibold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("bankingApproval.transactionType")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("bankingApproval.queueNo")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("common.bankName")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("common.accountNo")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("common.amount")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("common.action")}
                </TableHead>""",
        ),
        (
            "<p>No pending approvals found matching your search.</p>",
            '<p>{t("bankingApproval.noPendingApprovals")}</p>',
        ),
        (
            """              Showing{" "}
              {kycList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries""",
            """              {t("common.showing")}{" "}
              {kycList.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              {t("common.to")}{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
              {t("common.of")} {totalItems} {t("common.entries")}""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"INDEX MISS: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"INDEX OK: {old[:50]!r}")
    path.write_text(text, encoding="utf-8")
    print("index done")


def wire_modal() -> None:
    path = BASE / "BankingActionModal.jsx"
    text = path.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import Spinner from "@/common/loader/Spinner";\n',
            'import Spinner from "@/common/loader/Spinner";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            "  loading,\n}) => {\n  const [showRejectModal, setShowRejectModal] = useState(false);",
            "  loading,\n}) => {\n  const { t } = useTranslation();\n  const [showRejectModal, setShowRejectModal] = useState(false);",
        )

    # Date check must use field name so translated labels still format dates
    text = text.replace(
        'if (label && label.toLowerCase().includes("date")) {',
        'if (name && String(name).toLowerCase().includes("date")) {',
        1,
    )

    repls = [
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("bankingApproval.pleaseEnterRejectionRemarks"));',
        ),
        (
            'placeholder="Select Account Type"',
            'placeholder={t("bankingApproval.selectAccountType")}',
        ),
        (
            'searchPlaceholder="Search account type..."',
            'searchPlaceholder={t("bankingApproval.searchAccountType")}',
        ),
        (
            'placeholder="Select Bank GL"',
            'placeholder={t("bankingApproval.selectBankGl")}',
        ),
        (
            'searchPlaceholder="Search bank gl..."',
            'searchPlaceholder={t("bankingApproval.searchBankGl")}',
        ),
        (
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Banking Approval Portal
              </DialogTitle>""",
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                {t("bankingApproval.bankingApprovalPortal")}
              </DialogTitle>""",
        ),
        (
            """                <span className="font-medium">
                  Queue No: {selectedApplication.Queue_No}
                </span>""",
            """                <span className="font-medium">
                  {t("bankingApproval.queueNoLabel")}{" "}
                  {selectedApplication.Queue_No}
                </span>""",
        ),
        (
            """                    Edit Details
                  </Button>""",
            """                    {t("bankingApproval.editDetails")}
                  </Button>""",
        ),
        (
            """                    Cancel Edit
                  </Button>""",
            """                    {t("bankingApproval.cancelEdit")}
                  </Button>""",
        ),
        (
            '                      "Opening Date",',
            '                      t("bankingApproval.openingDate"),',
        ),
        (
            '                      "Bank Name",\n                      "bank_name",\n                      selectedApplication.Bank_Name ||\n                        selectedApplication.bankName,\n                      true,',
            '                      t("bankingApproval.bankName"),\n                      "bank_name",\n                      selectedApplication.Bank_Name ||\n                        selectedApplication.bankName,\n                      true,',
        ),
        (
            '                      "Bank Branch",',
            '                      t("bankingApproval.bankBranch"),',
        ),
        (
            '                      "IFSC Code",',
            '                      t("bankingApproval.ifscCode"),',
        ),
        (
            '                      "Account No",\n                      "account_no",\n                      selectedApplication.Account_No ||\n                        selectedApplication.accountNo,\n                      true,',
            '                      t("bankingApproval.accountNo"),\n                      "account_no",\n                      selectedApplication.Account_No ||\n                        selectedApplication.accountNo,\n                      true,',
        ),
        (
            '                      "Account Type",',
            '                      t("bankingApproval.accountType"),',
        ),
        (
            '                      "Bank GL",',
            '                      t("bankingApproval.bankGl"),',
        ),
        (
            '                      "Transaction Date",',
            '                      t("bankingApproval.transactionDate"),',
        ),
        (
            '                      "Queue No",\n                      "queue_no",',
            '                      t("bankingApproval.queueNo"),\n                      "queue_no",',
        ),
        (
            '                      "Transaction Type",',
            '                      t("bankingApproval.transactionType"),',
        ),
        (
            '                      "Bank Name",\n                      "bank_name",\n                      selectedApplication.Bank_Name,\n                    )',
            '                      t("bankingApproval.bankName"),\n                      "bank_name",\n                      selectedApplication.Bank_Name,\n                    )',
        ),
        (
            '                      "Account No",\n                      "account_no",\n                      selectedApplication.Account_No ||\n                        selectedApplication.accountNo,\n                    )',
            '                      t("bankingApproval.accountNo"),\n                      "account_no",\n                      selectedApplication.Account_No ||\n                        selectedApplication.accountNo,\n                    )',
        ),
        (
            '{renderField("Amount", "amount", selectedApplication.Amount)}',
            '{renderField(t("bankingApproval.amount"), "amount", selectedApplication.Amount)}',
        ),
        (
            """                  Save & Update
                </Button>""",
            """                  {t("bankingApproval.saveAndUpdate")}
                </Button>""",
        ),
        (
            '<Ban className="w-4 h-4 mr-2" /> Reject',
            '<Ban className="w-4 h-4 mr-2" /> {t("bankingApproval.reject")}',
        ),
        (
            '<CheckCircle2 className="w-4 h-4 mr-2" /> Approve',
            '<CheckCircle2 className="w-4 h-4 mr-2" /> {t("bankingApproval.approve")}',
        ),
        (
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Application
            </DialogTitle>""",
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("bankingApproval.rejectApplication")}
            </DialogTitle>""",
        ),
        (
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              Rejection Remarks <span className="text-red-500">*</span>
            </Label>""",
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              {t("bankingApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>""",
        ),
        (
            'placeholder="Enter reason for rejection..."',
            'placeholder={t("bankingApproval.enterRejectionReason")}',
        ),
        (
            """            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>""",
            """            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              {t("common.cancel")}
            </Button>""",
        ),
        (
            """              Confirm Rejection
            </Button>""",
            """              {t("bankingApproval.confirmRejection")}
            </Button>""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"MODAL MISS: {old[:80]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"MODAL OK: {old[:50]!r}")
    path.write_text(text, encoding="utf-8")
    print("modal done")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_index()
    wire_modal()
