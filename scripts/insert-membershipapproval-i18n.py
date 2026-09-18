# -*- coding: utf-8 -*-
"""Insert membershipApproval locales and wire membership approval UI."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
CONTAINER = ROOT / "container" / "approval" / "membership" / "index.jsx"
MODAL = ROOT / "components" / "approval" / "membership" / "MembershipActionModal.jsx"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


MEMBERSHIP = {
    "en": {
        "membershipApproval": "Membership Approval",
        "searchPlaceholder": "Search particular, voucher...",
        "transactionDate": "Transaction Date",
        "queueNo": "Queue No",
        "particulars": "Particulars",
        "voucherType": "Voucher Type",
        "enteredBy": "Entered By",
        "enteredOn": "Entered On",
        "noPendingApprovals": "No pending approvals found matching your search.",
        "transactionApproval": "Membership Transaction Approval",
        "queue": "Queue:",
        "type": "Type:",
        "memberInformation": "Member Information",
        "fullName": "Full Name",
        "admissionNo": "Admission No",
        "relationName": "Relation Name",
        "transactionOverview": "Transaction Overview",
        "transactionType": "Transaction Type",
        "totalAmount": "Total Amount",
        "transferOn": "Transfer On",
        "shareFinancialDetails": "Share & Financial Details",
        "noOfShares": "No. of Shares",
        "shareRate": "Share Rate",
        "admissionFees": "Admission Fees",
        "systemInformation": "System Information",
        "reject": "Reject",
        "approve": "Approve",
        "pleaseEnterRejectionRemarks": "Please enter remarks for rejection.",
        "confirmRejection": "Confirm Rejection",
        "rejectConfirmMessage": "Are you sure you want to reject this transaction? This action cannot be undone. Please provide a reason.",
        "rejectionRemarks": "Rejection Remarks",
        "enterRejectionReason": "Enter detailed reason for rejection...",
        "confirmReject": "Confirm Reject",
    },
    "hi": {
        "membershipApproval": "सदस्यता अनुमोदन",
        "searchPlaceholder": "विवरण, वाउचर खोजें...",
        "transactionDate": "लेनदेन दिनांक",
        "queueNo": "कतार संख्या",
        "particulars": "विवरण",
        "voucherType": "वाउचर प्रकार",
        "enteredBy": "दर्ज करने वाला",
        "enteredOn": "दर्ज किया गया",
        "noPendingApprovals": "आपकी खोज से मेल खाने वाला कोई लंबित अनुमोदन नहीं मिला।",
        "transactionApproval": "सदस्यता लेनदेन अनुमोदन",
        "queue": "कतार:",
        "type": "प्रकार:",
        "memberInformation": "सदस्य जानकारी",
        "fullName": "पूरा नाम",
        "admissionNo": "प्रवेश संख्या",
        "relationName": "संबंधित व्यक्ति का नाम",
        "transactionOverview": "लेनदेन अवलोकन",
        "transactionType": "लेनदेन प्रकार",
        "totalAmount": "कुल राशि",
        "transferOn": "स्थानांतरण पर",
        "shareFinancialDetails": "शेयर और वित्तीय विवरण",
        "noOfShares": "शेयरों की संख्या",
        "shareRate": "शेयर दर",
        "admissionFees": "प्रवेश शुल्क",
        "systemInformation": "सिस्टम जानकारी",
        "reject": "अस्वीकार करें",
        "approve": "अनुमोदित करें",
        "pleaseEnterRejectionRemarks": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
        "confirmRejection": "अस्वीकृति की पुष्टि करें",
        "rejectConfirmMessage": "क्या आप वाकई इस लेनदेन को अस्वीकार करना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती। कृपया कारण बताएं।",
        "rejectionRemarks": "अस्वीकृति टिप्पणी",
        "enterRejectionReason": "अस्वीकृति का विस्तृत कारण दर्ज करें...",
        "confirmReject": "अस्वीकृति की पुष्टि करें",
    },
    "bn": {
        "membershipApproval": "সদস্যতা অনুমোদন",
        "searchPlaceholder": "বিবরণ, ভাউচার অনুসন্ধান করুন...",
        "transactionDate": "লেনদেনের তারিখ",
        "queueNo": "কিউ নম্বর",
        "particulars": "বিবরণ",
        "voucherType": "ভাউচারের ধরন",
        "enteredBy": "প্রবেশ করিয়েছেন",
        "enteredOn": "প্রবেশের তারিখ",
        "noPendingApprovals": "আপনার অনুসন্ধানের সাথে মিলে যাওয়া কোনো অপেক্ষমাণ অনুমোদন পাওয়া যায়নি।",
        "transactionApproval": "সদস্যতা লেনদেন অনুমোদন",
        "queue": "কিউ:",
        "type": "ধরন:",
        "memberInformation": "সদস্য তথ্য",
        "fullName": "পূর্ণ নাম",
        "admissionNo": "ভর্তি নম্বর",
        "relationName": "সম্পর্কের নাম",
        "transactionOverview": "লেনদেনের সারাংশ",
        "transactionType": "লেনদেনের ধরন",
        "totalAmount": "মোট পরিমাণ",
        "transferOn": "স্থানান্তরের তারিখ",
        "shareFinancialDetails": "শেয়ার ও আর্থিক বিবরণ",
        "noOfShares": "শেয়ারের সংখ্যা",
        "shareRate": "শেয়ার হার",
        "admissionFees": "ভর্তি ফি",
        "systemInformation": "সিস্টেম তথ্য",
        "reject": "প্রত্যাখ্যান",
        "approve": "অনুমোদন",
        "pleaseEnterRejectionRemarks": "প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
        "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
        "rejectConfirmMessage": "আপনি কি নিশ্চিত যে এই লেনদেন প্রত্যাখ্যান করতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না। অনুগ্রহ করে কারণ দিন।",
        "rejectionRemarks": "প্রত্যাখ্যানের মন্তব্য",
        "enterRejectionReason": "প্রত্যাখ্যানের বিস্তারিত কারণ লিখুন...",
        "confirmReject": "প্রত্যাখ্যান নিশ্চিত করুন",
    },
    "or": {
        "membershipApproval": "ସଦସ୍ୟତା ଅନୁମୋଦନ",
        "searchPlaceholder": "ବିବରଣୀ, ଭାଉଚର୍ ଖୋଜନ୍ତୁ...",
        "transactionDate": "କାରବାର ତାରିଖ",
        "queueNo": "କ୍ୟୁ ନମ୍ବର",
        "particulars": "ବିବରଣୀ",
        "voucherType": "ଭାଉଚର୍ ପ୍ରକାର",
        "enteredBy": "ଦାଖଲ କରିଛନ୍ତି",
        "enteredOn": "ଦାଖଲ ତାରିଖ",
        "noPendingApprovals": "ଆପଣଙ୍କ ଖୋଜ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
        "transactionApproval": "ସଦସ୍ୟତା କାରବାର ଅନୁମୋଦନ",
        "queue": "କ୍ୟୁ:",
        "type": "ପ୍ରକାର:",
        "memberInformation": "ସଦସ୍ୟ ସୂଚନା",
        "fullName": "ପୂର୍ଣ୍ଣ ନାମ",
        "admissionNo": "ଭର୍ତ୍ତି ନମ୍ବର",
        "relationName": "ସମ୍ପର୍କୀୟଙ୍କ ନାମ",
        "transactionOverview": "କାରବାର ସମୀକ୍ଷା",
        "transactionType": "କାରବାର ପ୍ରକାର",
        "totalAmount": "ମୋଟ ରାଶି",
        "transferOn": "ଟ୍ରାନ୍ସଫର୍ ତାରିଖ",
        "shareFinancialDetails": "ସେୟାର୍ ଏବଂ ଆର୍ଥିକ ବିବରଣୀ",
        "noOfShares": "ସେୟାର୍ ସଂଖ୍ୟା",
        "shareRate": "ସେୟାର୍ ରେଟ୍",
        "admissionFees": "ଭର୍ତ୍ତି ଫି",
        "systemInformation": "ସିଷ୍ଟମ୍ ସୂଚନା",
        "reject": "ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "approve": "ଅନୁମୋଦନ",
        "pleaseEnterRejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ପାଇଁ ମନ୍ତବ୍ୟ ଲେଖନ୍ତୁ।",
        "confirmRejection": "ପ୍ରତ୍ୟାଖ୍ୟାନ ନିଶ୍ଚିତ କରନ୍ତୁ",
        "rejectConfirmMessage": "ଆପଣ ନିଶ୍ଚିତ କି ଏହି କାରବାରକୁ ପ୍ରତ୍ୟାଖ୍ୟାନ କରିବାକୁ ଚାହୁଁଛନ୍ତି? ଏହି କାର୍ଯ୍ୟ ପୂର୍ବାବସ୍ଥାକୁ ଫେରାଯାଇ ପାରିବ ନାହିଁ। ଦୟାକରି କାରଣ ଦିଅନ୍ତୁ।",
        "rejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ମନ୍ତବ୍ୟ",
        "enterRejectionReason": "ପ୍ରତ୍ୟାଖ୍ୟାନର ବିସ୍ତୃତ କାରଣ ଲେଖନ୍ତୁ...",
        "confirmReject": "ପ୍ରତ୍ୟାଖ୍ୟାନ ନିଶ୍ଚିତ କରନ୍ତୁ",
    },
}

COMMON_EXTRA = {
    "en": {"view": "View"},
    "hi": {"view": "देखें"},
    "bn": {"view": "দেখুন"},
    "or": {"view": "ଦେଖନ୍ତୁ"},
}


def add_to_bank_common(text: str, extras: dict) -> str:
    bank = text.find("\n    bank: {")
    if bank < 0:
        raise SystemExit("bank: not found")
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

    if re.search(r"\n    membershipApproval:\s*\{", text):
        print(f"{lang}: membershipApproval already present")
    else:
        block = (
            "    membershipApproval: {\n"
            + js_obj(MEMBERSHIP[lang], indent=6)
            + "\n    },"
        )
        for anchor in ("kycApproval", "about", "createUser", "userRole", "report"):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common.view")
        text = text2
    else:
        print(f"{lang}: common ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_container():
    t = CONTAINER.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import SuccessMessage from "@/common/dialog/SuccessMessage";',
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\nimport { useTranslation } from "react-i18next";',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "const MembershipApproval = () => {\n  const {",
            "const MembershipApproval = () => {\n  const { t } = useTranslation();\n\n  const {",
            1,
        )

    repls = [
        (
            """          Membership Approval
        </h2>""",
            """          {t("membershipApproval.membershipApproval")}
        </h2>""",
        ),
        (
            'placeholder="Search particular, voucher..."',
            'placeholder={t("membershipApproval.searchPlaceholder")}',
        ),
        (
            """                <TableHead className="w-[50px] text-white font-bold">
                  Sl
                </TableHead>
                <TableHead className="text-white font-bold">
                  Transaction Date
                </TableHead>
                <TableHead className="text-white font-bold">Queue No</TableHead>
                <TableHead className="text-white font-bold">
                  Particulars
                </TableHead>
                <TableHead className="text-white font-bold">
                  Voucher Type
                </TableHead>
                <TableHead className="text-white font-bold">
                  Entered By
                </TableHead>
                <TableHead className="text-white font-bold">
                  Entered On
                </TableHead>
                <TableHead className="text-right text-white font-bold text-center">
                  Action
                </TableHead>""",
            """                <TableHead className="w-[50px] text-white font-bold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.transactionDate")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.queueNo")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.particulars")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.voucherType")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.enteredBy")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.enteredOn")}
                </TableHead>
                <TableHead className="text-right text-white font-bold text-center">
                  {t("common.action")}
                </TableHead>""",
        ),
        ('{item.Queue_No || "N/A"}', '{item.Queue_No || t("common.notAvailable")}'),
        (
            "{item.Particular || \"N/A\"}",
            '{item.Particular || t("common.notAvailable")}',
        ),
        (
            "{item.Vouch_Type || \"N/A\"}",
            '{item.Vouch_Type || t("common.notAvailable")}',
        ),
        (
            "{item.Entred_By || \"N/A\"}",
            '{item.Entred_By || t("common.notAvailable")}',
        ),
        (
            '<Eye className="w-4 h-4 mr-2" /> View',
            '<Eye className="w-4 h-4 mr-2" /> {t("common.view")}',
        ),
        (
            "<p>No pending approvals found matching your search.</p>",
            '<p>{t("membershipApproval.noPendingApprovals")}</p>',
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("CONTAINER MISSING:", repr(old[:90]))
        else:
            t = t.replace(old, new)
            print("CONTAINER OK:", old[:50].replace("\n", " "))

    CONTAINER.write_text(t, encoding="utf-8")
    print("container done")


def wire_modal():
    t = MODAL.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import Spinner from "@/common/loader/Spinner";\n',
            'import Spinner from "@/common/loader/Spinner";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  loading,\n}) => {\n  const [showRejectModal, setShowRejectModal] = useState(false);",
            "  loading,\n}) => {\n  const { t } = useTranslation();\n\n  const [showRejectModal, setShowRejectModal] = useState(false);",
            1,
        )

    repls = [
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("membershipApproval.pleaseEnterRejectionRemarks"));',
        ),
        (
            """              <DialogTitle className="text-xl font-bold text-gray-800 tracking-tight">
                Membership Transaction Approval
              </DialogTitle>""",
            """              <DialogTitle className="text-xl font-bold text-gray-800 tracking-tight">
                {t("membershipApproval.transactionApproval")}
              </DialogTitle>""",
        ),
        (
            '<span className="font-medium">Queue:</span>',
            '<span className="font-medium">{t("membershipApproval.queue")}</span>',
        ),
        (
            '<span className="font-medium">Type:</span>',
            '<span className="font-medium">{t("membershipApproval.type")}</span>',
        ),
        (
            """                    <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-primary pl-2">
                      Member Information
                    </h3>""",
            """                    <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-primary pl-2">
                      {t("membershipApproval.memberInformation")}
                    </h3>""",
        ),
        ('label="Full Name"', 'label={t("membershipApproval.fullName")}'),
        ('label="Admission No"', 'label={t("membershipApproval.admissionNo")}'),
        (
            'label="Relation Name"',
            'label={t("membershipApproval.relationName")}',
        ),
        (
            """                  <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-blue-500 pl-2">
                    Transaction Overview
                  </h3>""",
            """                  <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-blue-500 pl-2">
                    {t("membershipApproval.transactionOverview")}
                  </h3>""",
        ),
        ('label="Particulars"', 'label={t("membershipApproval.particulars")}'),
        (
            'label="Transaction Type"',
            'label={t("membershipApproval.transactionType")}',
        ),
        (
            'label="Transaction Date"',
            'label={t("membershipApproval.transactionDate")}',
        ),
        ('label="Total Amount"', 'label={t("membershipApproval.totalAmount")}'),
        ('label="Transfer On"', 'label={t("membershipApproval.transferOn")}'),
        (
            """                    <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-green-500 pl-2">
                      Share & Financial Details
                    </h3>""",
            """                    <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-green-500 pl-2">
                      {t("membershipApproval.shareFinancialDetails")}
                    </h3>""",
        ),
        ('label="No. of Shares"', 'label={t("membershipApproval.noOfShares")}'),
        ('label="Share Rate"', 'label={t("membershipApproval.shareRate")}'),
        (
            'label="Admission Fees"',
            'label={t("membershipApproval.admissionFees")}',
        ),
        (
            """                  <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-gray-400 pl-2">
                    System Information
                  </h3>""",
            """                  <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-gray-400 pl-2">
                    {t("membershipApproval.systemInformation")}
                  </h3>""",
        ),
        ('label="Entered By"', 'label={t("membershipApproval.enteredBy")}'),
        ('label="Entered On"', 'label={t("membershipApproval.enteredOn")}'),
        (
            '<Ban className="w-4 h-4 mr-2" /> Reject',
            '<Ban className="w-4 h-4 mr-2" /> {t("membershipApproval.reject")}',
        ),
        (
            '<CheckCircle2 className="w-4 h-4 mr-2" /> Approve',
            '<CheckCircle2 className="w-4 h-4 mr-2" /> {t("membershipApproval.approve")}',
        ),
        (
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Rejection
            </DialogTitle>""",
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              {t("membershipApproval.confirmRejection")}
            </DialogTitle>""",
        ),
        (
            """            <p className="text-sm text-gray-600">
              Are you sure you want to reject this transaction? This action
              cannot be undone. Please provide a reason.
            </p>""",
            """            <p className="text-sm text-gray-600">
              {t("membershipApproval.rejectConfirmMessage")}
            </p>""",
        ),
        (
            """                Rejection Remarks <span className="text-red-500">*</span>""",
            """                {t("membershipApproval.rejectionRemarks")}{" "}
                <span className="text-red-500">*</span>""",
        ),
        (
            'placeholder="Enter detailed reason for rejection..."',
            'placeholder={t("membershipApproval.enterRejectionReason")}',
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
            """            >
              Confirm Reject
            </Button>""",
            """            >
              {t("membershipApproval.confirmReject")}
            </Button>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("MODAL MISSING:", repr(old[:90]))
        else:
            t = t.replace(old, new)
            print("MODAL OK:", old[:50].replace("\n", " "))

    MODAL.write_text(t, encoding="utf-8")
    print("modal done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_container()
    wire_modal()


if __name__ == "__main__":
    main()
