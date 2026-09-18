# -*- coding: utf-8 -*-
"""Insert borrowingsApproval locales and wire Borrowingsapproval components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BASE = ROOT / "components" / "approval" / "Borrowingsapproval"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


COMMON_EXTRA = {
    "en": {
        "transactionDate": "Transaction Date",
        "principal": "Principal",
        "interest": "Interest",
        "reject": "Reject",
        "approve": "Approve",
    },
    "hi": {
        "transactionDate": "लेनदेन दिनांक",
        "principal": "मूलधन",
        "interest": "ब्याज",
        "reject": "अस्वीकार करें",
        "approve": "अनुमोदित करें",
    },
    "bn": {
        "transactionDate": "লেনদেনের তারিখ",
        "principal": "মূলধন",
        "interest": "সুদ",
        "reject": "প্রত্যাখ্যান",
        "approve": "অনুমোদন",
    },
    "or": {
        "transactionDate": "କାରବାର ତାରିଖ",
        "principal": "ମୂଳଧନ",
        "interest": "ସୁଧ",
        "reject": "ଅସ୍ୱୀକାର",
        "approve": "ଅନୁମୋଦନ",
    },
}

REJECT_EXTRA = {
    "en": {
        "rejectionRemarks": "Rejection Remarks",
        "enterReason": "Enter reason for rejection...",
        "confirmRejection": "Confirm Rejection",
    },
    "hi": {
        "rejectionRemarks": "अस्वीकृति टिप्पणी",
        "enterReason": "अस्वीकृति का कारण दर्ज करें...",
        "confirmRejection": "अस्वीकृति की पुष्टि करें",
    },
    "bn": {
        "rejectionRemarks": "প্রত্যাখ্যানের মন্তব্য",
        "enterReason": "প্রত্যাখ্যানের কারণ লিখুন...",
        "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
    },
    "or": {
        "rejectionRemarks": "ଅସ୍ୱୀକାର ମନ୍ତବ୍ୟ",
        "enterReason": "ଅସ୍ୱୀକାରର କାରଣ ଲେଖନ୍ତୁ...",
        "confirmRejection": "ଅସ୍ୱୀକାର ନିଶ୍ଚିତ କରନ୍ତୁ",
    },
}

BORROW = {
    "en": {
        "borrowingsApproval": "Borrowings Approval",
        "searchPlaceholder": "Search by product, bank, account...",
        "noPendingApprovals": "No pending approvals found matching your search.",
        "borrowingsType": "Borrowings Type",
        "productName": "Product Name",
        "repaymentMode": "Repayment Mode",
        "disburseAmount": "Disburse Amount",
        "remarksRequired": "Please enter remarks for rejection.",
    },
    "hi": {
        "borrowingsApproval": "उधार अनुमोदन",
        "searchPlaceholder": "उत्पाद, बैंक, खाता से खोजें...",
        "noPendingApprovals": "आपकी खोज से मेल खाने वाले कोई लंबित अनुमोदन नहीं मिले।",
        "borrowingsType": "उधार प्रकार",
        "productName": "उत्पाद का नाम",
        "repaymentMode": "पुनर्भुगतान मोड",
        "disburseAmount": "वितरण राशि",
        "remarksRequired": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
    },
    "bn": {
        "borrowingsApproval": "ঋণ অনুমোদন",
        "searchPlaceholder": "পণ্য, ব্যাংক, অ্যাকাউন্ট দিয়ে খুঁজুন...",
        "noPendingApprovals": "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পেন্ডিং অনুমোদন পাওয়া যায়নি।",
        "borrowingsType": "ঋণের ধরন",
        "productName": "পণ্যের নাম",
        "repaymentMode": "পরিশোধের মোড",
        "disburseAmount": "বিতরণ পরিমাণ",
        "remarksRequired": "অনুগ্রহ করে প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
    },
    "or": {
        "borrowingsApproval": "ଋଣ ଅନୁମୋଦନ",
        "searchPlaceholder": "ଉତ୍ପାଦ, ବ୍ୟାଙ୍କ, ଆକାଉଣ୍ଟ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
        "noPendingApprovals": "ଆପଣଙ୍କ ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
        "borrowingsType": "ଋଣ ପ୍ରକାର",
        "productName": "ଉତ୍ପାଦ ନାମ",
        "repaymentMode": "ପରିଶୋଧ ମୋଡ୍",
        "disburseAmount": "ବଣ୍ଟନ ରାଶି",
        "remarksRequired": "ଦୟାକରି ଅସ୍ୱୀକାର ପାଇଁ ମନ୍ତବ୍ୟ ଦିଅନ୍ତୁ।",
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


def ensure_keys_in_block(text: str, block_name: str, extras: dict, indent=6) -> str:
    """Add missing keys before closing brace of named top-level block."""
    matches = list(re.finditer(rf"\n    {re.escape(block_name)}:\s*\{{", text))
    if not matches:
        raise SystemExit(f"{block_name} not found")
    m = matches[-1] if block_name == "common" else matches[0]
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
    else:
        raise SystemExit(f"could not close {block_name}")

    to_add = []
    pad = " " * indent
    for key, val in extras.items():
        if not re.search(rf"\n{pad}{key}:", block):
            esc = val.replace("\\", "\\\\").replace('"', '\\"')
            to_add.append(f'{pad}{key}: "{esc}"')
    if not to_add:
        return text

    prefix = text[:end].rstrip()
    if not prefix.endswith(","):
        prefix += ","
    # keep closing brace indentation (4 spaces for top-level under translation)
    return prefix + "\n" + ",\n".join(to_add) + "\n    " + text[end:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    text = ensure_keys_in_block(text, "common", COMMON_EXTRA[lang], indent=6)
    text = ensure_keys_in_block(text, "rejectReasonModal", REJECT_EXTRA[lang], indent=6)

    if re.search(r"\n    borrowingsApproval:\s*\{", text):
        print(f"{lang}: borrowingsApproval already present")
    else:
        block = (
            "    borrowingsApproval: {\n"
            + js_obj(BORROW[lang], indent=6)
            + "\n    },"
        )
        for anchor in ("investmentApproval", "bankingApproval", "voucherApproval"):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor found")

    path.write_text(text, encoding="utf-8")


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
            "  branchId,\n}) => {\n  return (",
            "  branchId,\n}) => {\n  const { t } = useTranslation();\n\n  return (",
        )

    repls = [
        (
            """        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          Borrowings Approval
        </h2>""",
            """        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          {t("borrowingsApproval.borrowingsApproval")}
        </h2>""",
        ),
        (
            'placeholder="Search by product, bank, account..."',
            'placeholder={t("borrowingsApproval.searchPlaceholder")}',
        ),
        (
            """                <TableHead className="w-[50px] font-semibold">Sl</TableHead>
                <TableHead className="font-semibold">Queue No</TableHead>
                <TableHead className="font-semibold">Transaction Date</TableHead>
                <TableHead className="font-semibold">Transaction Type</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>""",
            """                <TableHead className="w-[50px] font-semibold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.queueNo")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.transactionDate")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.transactionType")}
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
            '<p>{t("borrowingsApproval.noPendingApprovals")}</p>',
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
    path = BASE / "BorrowingsActionModal.jsx"
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

    repls = [
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("borrowingsApproval.remarksRequired"));',
        ),
        (
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Borrowings Approval
              </DialogTitle>""",
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                {t("borrowingsApproval.borrowingsApproval")}
              </DialogTitle>""",
        ),
        (
            """                <span className="font-medium">
                  Queue No: {selectedApplication.Queue_No || "N/A"}
                </span>""",
            """                <span className="font-medium">
                  {t("common.queueNo")}:{" "}
                  {selectedApplication.Queue_No || "N/A"}
                </span>""",
        ),
        (
            '{renderField("Transaction Date", formatDate(selectedApplication.Trans_Date))}',
            '{renderField(t("common.transactionDate"), formatDate(selectedApplication.Trans_Date))}',
        ),
        (
            '{renderField("Transaction Type", selectedApplication.Type)}',
            '{renderField(t("common.transactionType"), selectedApplication.Type)}',
        ),
        (
            '{renderField("Borrowings Type", selectedApplication.Borrow_Type)}',
            '{renderField(t("borrowingsApproval.borrowingsType"), selectedApplication.Borrow_Type)}',
        ),
        (
            '{renderField("Product Name", selectedApplication.Product_Name)}',
            '{renderField(t("borrowingsApproval.productName"), selectedApplication.Product_Name)}',
        ),
        (
            '{renderField("Bank Name", selectedApplication.Bank_Name)}',
            '{renderField(t("common.bankName"), selectedApplication.Bank_Name)}',
        ),
        (
            '{renderField("Account No", selectedApplication.Account_No)}',
            '{renderField(t("common.accountNo"), selectedApplication.Account_No)}',
        ),
        (
            '{renderField("Repayment Mode", selectedApplication.Repay_Mode)}',
            '{renderField(t("borrowingsApproval.repaymentMode"), selectedApplication.Repay_Mode)}',
        ),
        (
            '{isDisbursement && renderField("Disburse Amount", selectedApplication.Prn_Amount)}',
            '{isDisbursement &&\n                  renderField(\n                    t("borrowingsApproval.disburseAmount"),\n                    selectedApplication.Prn_Amount,\n                  )}',
        ),
        (
            '{renderField("Principal", selectedApplication.Prn_Amount)}',
            '{renderField(t("common.principal"), selectedApplication.Prn_Amount)}',
        ),
        (
            '{renderField("Interest", selectedApplication.Intt_Amount || selectedApplication.inter)}',
            '{renderField(\n                      t("common.interest"),\n                      selectedApplication.Intt_Amount ||\n                        selectedApplication.inter,\n                    )}',
        ),
        (
            '{renderField("Total Amount", selectedApplication.Amount)}',
            '{renderField(t("common.totalAmount"), selectedApplication.Amount)}',
        ),
        (
            '{renderField("Transaction Mode", selectedApplication.Trans_Mode)}',
            '{renderField(t("common.transactionMode"), selectedApplication.Trans_Mode)}',
        ),
        (
            '<Ban className="w-4 h-4 mr-2" /> Reject',
            '<Ban className="w-4 h-4 mr-2" /> {t("common.reject")}',
        ),
        (
            '<CheckCircle2 className="w-4 h-4 mr-2" /> Approve',
            '<CheckCircle2 className="w-4 h-4 mr-2" /> {t("common.approve")}',
        ),
        (
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Application
            </DialogTitle>""",
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("rejectReasonModal.rejectApplication")}
            </DialogTitle>""",
        ),
        (
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              Rejection Remarks <span className="text-red-500">*</span>
            </Label>""",
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              {t("rejectReasonModal.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>""",
        ),
        (
            'placeholder="Enter reason for rejection..."',
            'placeholder={t("rejectReasonModal.enterReason")}',
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
            """              {t("rejectReasonModal.confirmRejection")}
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
