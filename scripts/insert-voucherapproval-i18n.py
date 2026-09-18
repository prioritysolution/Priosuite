# -*- coding: utf-8 -*-
"""Insert voucherApproval locales and wire Voucherapprova components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BASE = ROOT / "components" / "approval" / "Voucherapprova"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


VOUCHER = {
    "en": {
        "voucherApproval": "Voucher Approval",
        "searchPlaceholder": "Search by queue no, type...",
        "queueNo": "Queue No",
        "queueNoLabel": "Queue No:",
        "transactionDate": "Transaction Date",
        "type": "Type",
        "noPendingApprovals": "No pending approvals found matching your search.",
        "voucherDetails": "Voucher Details",
        "ledgerName": "Ledger Name",
        "debit": "Debit",
        "credit": "Credit",
        "total": "Total",
        "noVoucherDetails": "No voucher details found.",
        "subledgerList": "Subledger List ({{name}})",
        "ledgerId": "Ledger ID: {{id}}",
        "accountNo": "Account No",
        "name": "Name",
        "remarks": "Remarks",
        "reject": "Reject",
        "approve": "Approve",
        "rejectVoucher": "Reject Voucher",
        "rejectionRemarks": "Rejection Remarks",
        "enterRejectionReason": "Enter reason for rejection...",
        "pleaseEnterRejectionRemarks": "Please enter remarks for rejection.",
        "confirmRejection": "Confirm Rejection",
        "amount": "Amount",
        "particulars": "Particulars",
    },
    "hi": {
        "voucherApproval": "वाउचर अनुमोदन",
        "searchPlaceholder": "क्यू नंबर, प्रकार से खोजें...",
        "queueNo": "क्यू नंबर",
        "queueNoLabel": "क्यू नंबर:",
        "transactionDate": "लेनदेन दिनांक",
        "type": "प्रकार",
        "noPendingApprovals": "आपकी खोज से मेल खाने वाला कोई लंबित अनुमोदन नहीं मिला।",
        "voucherDetails": "वाउचर विवरण",
        "ledgerName": "खाता नाम",
        "debit": "डेबिट",
        "credit": "क्रेडिट",
        "total": "कुल",
        "noVoucherDetails": "कोई वाउचर विवरण नहीं मिला।",
        "subledgerList": "सबलेजर सूची ({{name}})",
        "ledgerId": "लेजर आईडी: {{id}}",
        "accountNo": "खाता संख्या",
        "name": "नाम",
        "remarks": "टिप्पणी",
        "reject": "अस्वीकार करें",
        "approve": "अनुमोदित करें",
        "rejectVoucher": "वाउचर अस्वीकार करें",
        "rejectionRemarks": "अस्वीकृति टिप्पणी",
        "enterRejectionReason": "अस्वीकृति का कारण दर्ज करें...",
        "pleaseEnterRejectionRemarks": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
        "confirmRejection": "अस्वीकृति की पुष्टि करें",
        "amount": "राशि",
        "particulars": "विवरण",
    },
    "bn": {
        "voucherApproval": "ভাউচার অনুমোদন",
        "searchPlaceholder": "কিউ নম্বর, ধরন দিয়ে অনুসন্ধান করুন...",
        "queueNo": "কিউ নম্বর",
        "queueNoLabel": "কিউ নম্বর:",
        "transactionDate": "লেনদেনের তারিখ",
        "type": "ধরন",
        "noPendingApprovals": "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো মুলতুবি অনুমোদন পাওয়া যায়নি।",
        "voucherDetails": "ভাউচার বিবরণ",
        "ledgerName": "লেজারের নাম",
        "debit": "ডেবিট",
        "credit": "ক্রেডিট",
        "total": "মোট",
        "noVoucherDetails": "কোনো ভাউচার বিবরণ পাওয়া যায়নি।",
        "subledgerList": "সাবলেজার তালিকা ({{name}})",
        "ledgerId": "লেজার আইডি: {{id}}",
        "accountNo": "অ্যাকাউন্ট নম্বর",
        "name": "নাম",
        "remarks": "মন্তব্য",
        "reject": "প্রত্যাখ্যান",
        "approve": "অনুমোদন",
        "rejectVoucher": "ভাউচার প্রত্যাখ্যান",
        "rejectionRemarks": "প্রত্যাখ্যানের মন্তব্য",
        "enterRejectionReason": "প্রত্যাখ্যানের কারণ লিখুন...",
        "pleaseEnterRejectionRemarks": "প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
        "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
        "amount": "পরিমাণ",
        "particulars": "বিবরণ",
    },
    "or": {
        "voucherApproval": "ଭାଉଚର୍ ଅନୁମୋଦନ",
        "searchPlaceholder": "କ୍ୟୁ ନମ୍ବର, ପ୍ରକାର ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
        "queueNo": "କ୍ୟୁ ନମ୍ବର",
        "queueNoLabel": "କ୍ୟୁ ନମ୍ବର:",
        "transactionDate": "କାରବାର ତାରିଖ",
        "type": "ପ୍ରକାର",
        "noPendingApprovals": "ଆପଣଙ୍କ ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
        "voucherDetails": "ଭାଉଚର୍ ବିବରଣୀ",
        "ledgerName": "ଲେଜର୍ ନାମ",
        "debit": "ଡେବିଟ୍",
        "credit": "କ୍ରେଡିଟ୍",
        "total": "ମୋଟ",
        "noVoucherDetails": "କୌଣସି ଭାଉଚର୍ ବିବରଣୀ ମିଳିଲା ନାହିଁ।",
        "subledgerList": "ସବଲେଜର୍ ତାଲିକା ({{name}})",
        "ledgerId": "ଲେଜର୍ ଆଇଡି: {{id}}",
        "accountNo": "ଖାତା ନମ୍ବର",
        "name": "ନାମ",
        "remarks": "ମନ୍ତବ୍ୟ",
        "reject": "ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "approve": "ଅନୁମୋଦନ",
        "rejectVoucher": "ଭାଉଚର୍ ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "rejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ମନ୍ତବ୍ୟ",
        "enterRejectionReason": "ପ୍ରତ୍ୟାଖ୍ୟାନର କାରଣ ଲେଖନ୍ତୁ...",
        "pleaseEnterRejectionRemarks": "ଦୟାକରି ପ୍ରତ୍ୟାଖ୍ୟାନ ପାଇଁ ମନ୍ତବ୍ୟ ଲେଖନ୍ତୁ।",
        "confirmRejection": "ପ୍ରତ୍ୟାଖ୍ୟାନ ନିଶ୍ଚିତ କରନ୍ତୁ",
        "amount": "ରାଶି",
        "particulars": "ବିବରଣୀ",
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
    if re.search(r"\n    voucherApproval:\s*\{", text):
        print(f"{lang}: voucherApproval already present")
        return
    block = (
        "    voucherApproval: {\n"
        + js_obj(VOUCHER[lang], indent=6)
        + "\n    },"
    )
    for anchor in ("loanApproval", "depositApproval", "membershipApproval", "kycApproval"):
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
        # inject hook after props destructure opening - after }) => {
        text = text.replace(
            "  orgId,\n  branchId,\n}) => {\n  return (",
            "  orgId,\n  branchId,\n}) => {\n  const { t } = useTranslation();\n\n  return (",
        )

    repls = [
        ("Voucher Approval", '{t("voucherApproval.voucherApproval")}'),
        (
            'placeholder="Search by queue no, type..."',
            'placeholder={t("voucherApproval.searchPlaceholder")}',
        ),
        ("<TableHead className=\"w-[50px] font-semibold\">Sl</TableHead>",
         '<TableHead className="w-[50px] font-semibold">\n                  {t("common.sl")}\n                </TableHead>'),
        ("<TableHead className=\"font-semibold\">Queue No</TableHead>",
         '<TableHead className="font-semibold">\n                  {t("voucherApproval.queueNo")}\n                </TableHead>'),
        ("<TableHead className=\"font-semibold\">Transaction Date</TableHead>",
         '<TableHead className="font-semibold">\n                  {t("voucherApproval.transactionDate")}\n                </TableHead>'),
        ("<TableHead className=\"font-semibold\">Type</TableHead>",
         '<TableHead className="font-semibold">\n                  {t("voucherApproval.type")}\n                </TableHead>'),
        ("<TableHead className=\"font-semibold\">Particulars</TableHead>",
         '<TableHead className="font-semibold">\n                  {t("common.particulars")}\n                </TableHead>'),
        ("<TableHead className=\"font-semibold\">Amount</TableHead>",
         '<TableHead className="font-semibold">\n                  {t("common.amount")}\n                </TableHead>'),
        ('<TableHead className="text-right font-semibold">Action</TableHead>',
         '<TableHead className="text-right font-semibold">\n                  {t("common.action")}\n                </TableHead>'),
        (
            "<p>No pending approvals found matching your search.</p>",
            '<p>{t("voucherApproval.noPendingApprovals")}</p>',
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
            print(f"INDEX MISS: {old[:60]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"INDEX OK: {old[:50]!r}")
    path.write_text(text, encoding="utf-8")
    print("index done")


def wire_modal() -> None:
    path = BASE / "VoucherActionModal.jsx"
    text = path.read_text(encoding="utf-8")
    if "useTranslation" not in text:
        text = text.replace(
            'import toast from "react-hot-toast";\n',
            'import toast from "react-hot-toast";\n'
            'import { useTranslation } from "react-i18next";\n',
        )
        text = text.replace(
            "  loading,\n}) => {\n  const [showRejectModal, setShowRejectModal] = useState(false);",
            "  loading,\n}) => {\n  const { t } = useTranslation();\n  const [showRejectModal, setShowRejectModal] = useState(false);",
        )

    repls = [
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("voucherApproval.pleaseEnterRejectionRemarks"));',
        ),
        (
            'const ledgerName = item.Ledger_Name || `Ledger ID: ${item.Ledger_Id}`;',
            'const ledgerName =\n        item.Ledger_Name ||\n        t("voucherApproval.ledgerId", { id: item.Ledger_Id });',
        ),
        (
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Voucher Approval
              </DialogTitle>""",
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                {t("voucherApproval.voucherApproval")}
              </DialogTitle>""",
        ),
        (
            """                <span className="font-medium">
                  Queue No: {selectedApplication.Queue_No || "N/A"}
                </span>""",
            """                <span className="font-medium">
                  {t("voucherApproval.queueNoLabel")}{" "}
                  {selectedApplication.Queue_No || "N/A"}
                </span>""",
        ),
        (
            '{renderField("Transaction Date", formatDate(selectedApplication.Trans_Date))}',
            '{renderField(t("voucherApproval.transactionDate"), formatDate(selectedApplication.Trans_Date))}',
        ),
        (
            '{renderField("Queue No", selectedApplication.Queue_No)}',
            '{renderField(t("voucherApproval.queueNo"), selectedApplication.Queue_No)}',
        ),
        (
            '{renderField("Type", selectedApplication.Type)}',
            '{renderField(t("voucherApproval.type"), selectedApplication.Type)}',
        ),
        (
            '{renderField("Amount", selectedApplication.Amount)}',
            '{renderField(t("voucherApproval.amount"), selectedApplication.Amount)}',
        ),
        (
            '{renderField("Particulars", selectedApplication.Particular)}',
            '{renderField(t("voucherApproval.particulars"), selectedApplication.Particular)}',
        ),
        (
            """              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                Voucher Details
              </h3>""",
            """              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                {t("voucherApproval.voucherDetails")}
              </h3>""",
        ),
        (
            '<TableHead className="w-[50px] font-semibold text-gray-700">Sl</TableHead>\n'
            '                        <TableHead className="font-semibold text-gray-700">Ledger Name</TableHead>\n'
            '                        <TableHead className="font-semibold text-gray-700 text-right">Debit</TableHead>\n'
            '                        <TableHead className="font-semibold text-gray-700 text-right">Credit</TableHead>',
            '<TableHead className="w-[50px] font-semibold text-gray-700">{t("common.sl")}</TableHead>\n'
            '                        <TableHead className="font-semibold text-gray-700">{t("voucherApproval.ledgerName")}</TableHead>\n'
            '                        <TableHead className="font-semibold text-gray-700 text-right">{t("voucherApproval.debit")}</TableHead>\n'
            '                        <TableHead className="font-semibold text-gray-700 text-right">{t("voucherApproval.credit")}</TableHead>',
        ),
        (
            """                        <TableCell colSpan={2} className="text-left text-gray-800">
                          Total
                        </TableCell>""",
            """                        <TableCell colSpan={2} className="text-left text-gray-800">
                          {t("voucherApproval.total")}
                        </TableCell>""",
        ),
        (
            """                <p className="text-sm text-gray-500 text-center py-4">
                  No voucher details found.
                </p>""",
            """                <p className="text-sm text-gray-500 text-center py-4">
                  {t("voucherApproval.noVoucherDetails")}
                </p>""",
        ),
        (
            """                    <h3 className="text-md font-bold text-gray-800 border-b pb-2">
                      Subledger List ({ledgerName})
                    </h3>""",
            """                    <h3 className="text-md font-bold text-gray-800 border-b pb-2">
                      {t("voucherApproval.subledgerList", { name: ledgerName })}
                    </h3>""",
        ),
        (
            '<TableHead className="w-[50px] font-semibold text-gray-700">Sl</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">Account No</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">Name</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">Type</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700 text-right">Amount</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">Remarks</TableHead>',
            '<TableHead className="w-[50px] font-semibold text-gray-700">{t("common.sl")}</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.accountNo")}</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.name")}</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.type")}</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700 text-right">{t("common.amount")}</TableHead>\n'
            '                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.remarks")}</TableHead>',
        ),
        (
            '<Ban className="w-4 h-4 mr-2" /> Reject',
            '<Ban className="w-4 h-4 mr-2" /> {t("voucherApproval.reject")}',
        ),
        (
            '<CheckCircle2 className="w-4 h-4 mr-2" /> Approve',
            '<CheckCircle2 className="w-4 h-4 mr-2" /> {t("voucherApproval.approve")}',
        ),
        (
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Voucher
            </DialogTitle>""",
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("voucherApproval.rejectVoucher")}
            </DialogTitle>""",
        ),
        (
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              Rejection Remarks <span className="text-red-500">*</span>
            </Label>""",
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              {t("voucherApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>""",
        ),
        (
            'placeholder="Enter reason for rejection..."',
            'placeholder={t("voucherApproval.enterRejectionReason")}',
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
            """              {t("voucherApproval.confirmRejection")}
            </Button>""",
        ),
    ]
    for old, new in repls:
        if old not in text:
            print(f"MODAL MISS: {old[:70]!r}")
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
