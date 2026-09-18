# -*- coding: utf-8 -*-
"""Insert deposit approval + rejectReasonModal locales and wire components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BASE = ROOT / "components" / "approval" / "deposit"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


REJECT = {
    "en": {
        "rejectApplication": "Reject Application",
        "reasonForRejection": "Reason for Rejection",
        "pleaseEnterReason": "Please enter the reason...",
        "remarksRequired": "Remarks is required for rejection",
        "confirmReject": "Confirm Reject",
    },
    "hi": {
        "rejectApplication": "आवेदन अस्वीकार करें",
        "reasonForRejection": "अस्वीकृति का कारण",
        "pleaseEnterReason": "कृपया कारण दर्ज करें...",
        "remarksRequired": "अस्वीकृति के लिए टिप्पणी आवश्यक है",
        "confirmReject": "अस्वीकृति की पुष्टि करें",
    },
    "bn": {
        "rejectApplication": "আবেদন প্রত্যাখ্যান করুন",
        "reasonForRejection": "প্রত্যাখ্যানের কারণ",
        "pleaseEnterReason": "অনুগ্রহ করে কারণ লিখুন...",
        "remarksRequired": "প্রত্যাখ্যানের জন্য মন্তব্য আবশ্যক",
        "confirmReject": "প্রত্যাখ্যান নিশ্চিত করুন",
    },
    "or": {
        "rejectApplication": "ଆବେଦନ ପ୍ରତ୍ୟାଖ୍ୟାନ କରନ୍ତୁ",
        "reasonForRejection": "ପ୍ରତ୍ୟାଖ୍ୟାନର କାରଣ",
        "pleaseEnterReason": "ଦୟାକରି କାରଣ ଲେଖନ୍ତୁ...",
        "remarksRequired": "ପ୍ରତ୍ୟାଖ୍ୟାନ ପାଇଁ ମନ୍ତବ୍ୟ ଆବଶ୍ୟକ",
        "confirmReject": "ପ୍ରତ୍ୟାଖ୍ୟାନ ନିଶ୍ଚିତ କରନ୍ତୁ",
    },
}

DEPOSIT = {
    "en": {
        "depositApproval": "Deposit Approval",
        "searchPlaceholder": "Search by App/Acc No, Queue No...",
        "transDate": "Trans Date",
        "queueNo": "Queue No",
        "appAccNo": "App / Acc No",
        "particulars": "Particulars",
        "type": "Type",
        "enteredBy": "Entered By",
        "enteredOn": "Entered On",
        "unknown": "Unknown",
        "noPendingApprovals": "No pending approvals found.",
        "showing": "Showing",
        "to": "to",
        "of": "of",
        "records": "records",
        "approvalPortal": "Deposit Approval Portal",
        "appAccNoLabel": "App / Acc No:",
        "unknownMember": "Unknown Member",
        "close": "Close",
        "transactionAmount": "Transaction Amount",
        "availableBalance": "Available Balance",
        "applicationDetails": "Application Details",
        "transactionDate": "Transaction Date",
        "voucherType": "Voucher Type",
        "accountInformation": "Account Information",
        "referenceAcNo": "Reference Ac No",
        "ledgerFolio": "Ledger Folio",
        "operationMode": "Operation Mode",
        "cbsAccountNo": "CBS Account No",
        "productFinancials": "Product & Financials",
        "productName": "Product Name",
        "productType": "Product Type",
        "chequeNo": "Cheque No",
        "amount": "Amount",
        "interestRateRoi": "Interest Rate (ROI)",
        "installmentAmt": "Installment Amt",
        "mandatoryAmt": "Mandatory Amt",
        "termMaturityDetails": "Term & Maturity Details",
        "duration": "Duration",
        "maturityDate": "Maturity Date",
        "maturityAmount": "Maturity Amount",
        "paymentConfiguration": "Payment Configuration",
        "ecsMode": "ECS Mode",
        "payoutMode": "Payout Mode",
        "jointAccountHolders": "Joint Account Holders",
        "relation": "Relation:",
        "nomineeInformation": "Nominee Information",
        "nomineeName": "Nominee Name",
        "relationLabel": "Relation",
        "ageDob": "Age / DOB",
        "sharePercentage": "Share Percentage",
        "reviewBeforeApprove": "* Please review all details before approving.",
        "reject": "Reject",
        "approve": "Approve",
        "pleaseEnterRejectionRemarks": "Please enter remarks for rejection.",
        "rejectApplication": "Reject Application",
        "rejectionRemarks": "Rejection Remarks",
        "enterRejectionReason": "Enter reason for rejection...",
        "confirmRejection": "Confirm Rejection",
    },
    "hi": {
        "depositApproval": "जमा अनुमोदन",
        "searchPlaceholder": "आवेदन/खाता संख्या, कतार संख्या से खोजें...",
        "transDate": "लेनदेन दिनांक",
        "queueNo": "कतार संख्या",
        "appAccNo": "आवेदन / खाता संख्या",
        "particulars": "विवरण",
        "type": "प्रकार",
        "enteredBy": "दर्ज करने वाला",
        "enteredOn": "दर्ज किया गया",
        "unknown": "अज्ञात",
        "noPendingApprovals": "कोई लंबित अनुमोदन नहीं मिला।",
        "showing": "दिखा रहे हैं",
        "to": "से",
        "of": "में से",
        "records": "रिकॉर्ड",
        "approvalPortal": "जमा अनुमोदन पोर्टल",
        "appAccNoLabel": "आवेदन / खाता संख्या:",
        "unknownMember": "अज्ञात सदस्य",
        "close": "बंद करें",
        "transactionAmount": "लेनदेन राशि",
        "availableBalance": "उपलब्ध शेष",
        "applicationDetails": "आवेदन विवरण",
        "transactionDate": "लेनदेन दिनांक",
        "voucherType": "वाउचर प्रकार",
        "accountInformation": "खाता जानकारी",
        "referenceAcNo": "संदर्भ खाता संख्या",
        "ledgerFolio": "लेजर फोलियो",
        "operationMode": "संचालन मोड",
        "cbsAccountNo": "CBS खाता संख्या",
        "productFinancials": "उत्पाद और वित्तीय",
        "productName": "उत्पाद नाम",
        "productType": "उत्पाद प्रकार",
        "chequeNo": "चेक संख्या",
        "amount": "राशि",
        "interestRateRoi": "ब्याज दर (ROI)",
        "installmentAmt": "किस्त राशि",
        "mandatoryAmt": "अनिवार्य राशि",
        "termMaturityDetails": "अवधि और परिपक्वता विवरण",
        "duration": "अवधि",
        "maturityDate": "परिपक्वता दिनांक",
        "maturityAmount": "परिपक्वता राशि",
        "paymentConfiguration": "भुगतान कॉन्फ़िगरेशन",
        "ecsMode": "ECS मोड",
        "payoutMode": "पेआउट मोड",
        "jointAccountHolders": "संयुक्त खाताधारक",
        "relation": "संबंध:",
        "nomineeInformation": "नामांकित व्यक्ति जानकारी",
        "nomineeName": "नामांकित व्यक्ति का नाम",
        "relationLabel": "संबंध",
        "ageDob": "आयु / जन्म तिथि",
        "sharePercentage": "शेयर प्रतिशत",
        "reviewBeforeApprove": "* अनुमोदन से पहले सभी विवरण की समीक्षा करें।",
        "reject": "अस्वीकार करें",
        "approve": "अनुमोदित करें",
        "pleaseEnterRejectionRemarks": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
        "rejectApplication": "आवेदन अस्वीकार करें",
        "rejectionRemarks": "अस्वीकृति टिप्पणी",
        "enterRejectionReason": "अस्वीकृति का कारण दर्ज करें...",
        "confirmRejection": "अस्वीकृति की पुष्टि करें",
    },
    "bn": {
        "depositApproval": "আমানত অনুমোদন",
        "searchPlaceholder": "আবেদন/অ্যাকাউন্ট নং, কিউ নং দিয়ে অনুসন্ধান...",
        "transDate": "লেনদেনের তারিখ",
        "queueNo": "কিউ নম্বর",
        "appAccNo": "আবেদন / অ্যাকাউন্ট নং",
        "particulars": "বিবরণ",
        "type": "ধরন",
        "enteredBy": "প্রবেশ করিয়েছেন",
        "enteredOn": "প্রবেশের তারিখ",
        "unknown": "অজানা",
        "noPendingApprovals": "কোনো অপেক্ষমাণ অনুমোদন পাওয়া যায়নি।",
        "showing": "দেখানো হচ্ছে",
        "to": "থেকে",
        "of": "এর মধ্যে",
        "records": "রেকর্ড",
        "approvalPortal": "আমানত অনুমোদন পোর্টাল",
        "appAccNoLabel": "আবেদন / অ্যাকাউন্ট নং:",
        "unknownMember": "অজানা সদস্য",
        "close": "বন্ধ করুন",
        "transactionAmount": "লেনদেনের পরিমাণ",
        "availableBalance": "উপলব্ধ ব্যালেন্স",
        "applicationDetails": "আবেদনের বিবরণ",
        "transactionDate": "লেনদেনের তারিখ",
        "voucherType": "ভাউচারের ধরন",
        "accountInformation": "অ্যাকাউন্ট তথ্য",
        "referenceAcNo": "রেফারেন্স অ্যাকাউন্ট নং",
        "ledgerFolio": "লেজার ফোলিও",
        "operationMode": "অপারেশন মোড",
        "cbsAccountNo": "CBS অ্যাকাউন্ট নং",
        "productFinancials": "পণ্য ও আর্থিক",
        "productName": "পণ্যের নাম",
        "productType": "পণ্যের ধরন",
        "chequeNo": "চেক নম্বর",
        "amount": "পরিমাণ",
        "interestRateRoi": "সুদের হার (ROI)",
        "installmentAmt": "কিস্তির পরিমাণ",
        "mandatoryAmt": "বাধ্যতামূলক পরিমাণ",
        "termMaturityDetails": "মেয়াদ ও পরিপক্কতার বিবরণ",
        "duration": "সময়কাল",
        "maturityDate": "পরিপক্কতার তারিখ",
        "maturityAmount": "পরিপক্কতার পরিমাণ",
        "paymentConfiguration": "পেমেন্ট কনফিগারেশন",
        "ecsMode": "ECS মোড",
        "payoutMode": "পেআউট মোড",
        "jointAccountHolders": "যৌথ অ্যাকাউন্টধারী",
        "relation": "সম্পর্ক:",
        "nomineeInformation": "নমিনি তথ্য",
        "nomineeName": "নমিনির নাম",
        "relationLabel": "সম্পর্ক",
        "ageDob": "বয়স / জন্ম তারিখ",
        "sharePercentage": "শেয়ার শতাংশ",
        "reviewBeforeApprove": "* অনুমোদনের আগে সব বিবরণ পর্যালোচনা করুন।",
        "reject": "প্রত্যাখ্যান",
        "approve": "অনুমোদন",
        "pleaseEnterRejectionRemarks": "প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
        "rejectApplication": "আবেদন প্রত্যাখ্যান",
        "rejectionRemarks": "প্রত্যাখ্যানের মন্তব্য",
        "enterRejectionReason": "প্রত্যাখ্যানের কারণ লিখুন...",
        "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
    },
    "or": {
        "depositApproval": "ଜମା ଅନୁମୋଦନ",
        "searchPlaceholder": "ଆବେଦନ/ଖାତା ନଂ, କ୍ୟୁ ନଂ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
        "transDate": "କାରବାର ତାରିଖ",
        "queueNo": "କ୍ୟୁ ନମ୍ବର",
        "appAccNo": "ଆବେଦନ / ଖାତା ନଂ",
        "particulars": "ବିବରଣୀ",
        "type": "ପ୍ରକାର",
        "enteredBy": "ଦାଖଲ କରିଛନ୍ତି",
        "enteredOn": "ଦାଖଲ ତାରିଖ",
        "unknown": "ଅଜଣା",
        "noPendingApprovals": "କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
        "showing": "ଦେଖାଯାଉଛି",
        "to": "ରୁ",
        "of": "ମଧ୍ୟରୁ",
        "records": "ରେକର୍ଡ",
        "approvalPortal": "ଜମା ଅନୁମୋଦନ ପୋର୍ଟାଲ୍",
        "appAccNoLabel": "ଆବେଦନ / ଖାତା ନଂ:",
        "unknownMember": "ଅଜଣା ସଦସ୍ୟ",
        "close": "ବନ୍ଦ କରନ୍ତୁ",
        "transactionAmount": "କାରବାର ରାଶି",
        "availableBalance": "ଉପଲବ୍ଧ ବାଲାନ୍ସ",
        "applicationDetails": "ଆବେଦନ ବିବରଣୀ",
        "transactionDate": "କାରବାର ତାରିଖ",
        "voucherType": "ଭାଉଚର୍ ପ୍ରକାର",
        "accountInformation": "ଖାତା ସୂଚନା",
        "referenceAcNo": "ରେଫରେନ୍ସ ଖାତା ନଂ",
        "ledgerFolio": "ଲେଜର୍ ଫୋଲିଓ",
        "operationMode": "ଅପରେସନ୍ ମୋଡ୍",
        "cbsAccountNo": "CBS ଖାତା ନଂ",
        "productFinancials": "ଉତ୍ପାଦ ଏବଂ ଆର୍ଥିକ",
        "productName": "ଉତ୍ପାଦ ନାମ",
        "productType": "ଉତ୍ପାଦ ପ୍ରକାର",
        "chequeNo": "ଚେକ୍ ନମ୍ବର",
        "amount": "ରାଶି",
        "interestRateRoi": "ସୁଧ ହାର (ROI)",
        "installmentAmt": "କିସ୍ତି ରାଶି",
        "mandatoryAmt": "ବାଧ୍ୟତାମୂଳକ ରାଶି",
        "termMaturityDetails": "ଅବଧି ଏବଂ ପରିପକ୍ୱତା ବିବରଣୀ",
        "duration": "ଅବଧି",
        "maturityDate": "ପରିପକ୍ୱତା ତାରିଖ",
        "maturityAmount": "ପରିପକ୍ୱତା ରାଶି",
        "paymentConfiguration": "ପେମେଣ୍ଟ କନଫିଗରେସନ୍",
        "ecsMode": "ECS ମୋଡ୍",
        "payoutMode": "ପେଆଉଟ୍ ମୋଡ୍",
        "jointAccountHolders": "ଯୌଥ ଖାତାଧାରୀ",
        "relation": "ସମ୍ପର୍କ:",
        "nomineeInformation": "ନମିନି ସୂଚନା",
        "nomineeName": "ନମିନି ନାମ",
        "relationLabel": "ସମ୍ପର୍କ",
        "ageDob": "ବୟସ / ଜନ୍ମ ତାରିଖ",
        "sharePercentage": "ସେୟାର୍ ଶତକଡ଼ା",
        "reviewBeforeApprove": "* ଅନୁମୋଦନ ପୂର୍ବରୁ ସମସ୍ତ ବିବରଣୀ ସମୀକ୍ଷା କରନ୍ତୁ।",
        "reject": "ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "approve": "ଅନୁମୋଦନ",
        "pleaseEnterRejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ପାଇଁ ମନ୍ତବ୍ୟ ଲେଖନ୍ତୁ।",
        "rejectApplication": "ଆବେଦନ ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "rejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ମନ୍ତବ୍ୟ",
        "enterRejectionReason": "ପ୍ରତ୍ୟାଖ୍ୟାନର କାରଣ ଲେଖନ୍ତୁ...",
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

    if not re.search(r"\n    rejectReasonModal:\s*\{", text):
        block = (
            "    rejectReasonModal: {\n"
            + js_obj(REJECT[lang], indent=6)
            + "\n    },"
        )
        for anchor in ("membershipApproval", "kycApproval", "about", "createUser"):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted rejectReasonModal after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor for rejectReasonModal")
    else:
        print(f"{lang}: rejectReasonModal already present")

    if not re.search(r"\n    depositApproval:\s*\{", text):
        block = (
            "    depositApproval: {\n"
            + js_obj(DEPOSIT[lang], indent=6)
            + "\n    },"
        )
        for anchor in ("rejectReasonModal", "membershipApproval", "kycApproval"):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted depositApproval after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor for depositApproval")
    else:
        print(f"{lang}: depositApproval already present")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_reject():
    p = BASE / "RejectReasonModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import { ClipLoader } from "react-spinners";\n',
            'import { ClipLoader } from "react-spinners";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  actionLoading,\n}) => {\n  return (",
            "  actionLoading,\n}) => {\n  const { t } = useTranslation();\n\n  return (",
            1,
        )

    repls = [
        (
            '<DialogTitle className="text-red-600">Reject Application</DialogTitle>',
            '<DialogTitle className="text-red-600">\n            {t("rejectReasonModal.rejectApplication")}\n          </DialogTitle>',
        ),
        (
            'label="Reason for Rejection"',
            'label={t("rejectReasonModal.reasonForRejection")}',
        ),
        (
            'placeholder="Please enter the reason..."',
            'placeholder={t("rejectReasonModal.pleaseEnterReason")}',
        ),
        (
            'rules={{ required: "Remarks is required for rejection" }}',
            'rules={{\n                required: t("rejectReasonModal.remarksRequired"),\n              }}',
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
                  "Confirm Reject"
                )}""",
            """                ) : (
                  t("rejectReasonModal.confirmReject")
                )}""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("REJECT MISSING:", repr(old[:80]))
        else:
            t = t.replace(old, new)
            print("REJECT OK:", old[:45].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("reject done")


def wire_index():
    p = BASE / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import { format, parseISO } from "date-fns";\n',
            'import { format, parseISO } from "date-fns";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "}) => {\n  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination",
            "}) => {\n  const { t } = useTranslation();\n\n  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination",
            1,
        )

    # Avoid clash with useTranslation `t`
    t = t.replace(
        """  const getBadgeVariant = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("receipt")) return "success";
    if (t.includes("payment")) return "destructive";
    return "secondary";
  };""",
        """  const getBadgeVariant = (type) => {
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("receipt")) return "success";
    if (typeLower.includes("payment")) return "destructive";
    return "secondary";
  };""",
    )

    repls = [
        (
            """            <h2 className="text-xl font-bold tracking-tight text-gray-800">
              Deposit Approval
            </h2>""",
            """            <h2 className="text-xl font-bold tracking-tight text-gray-800">
              {t("depositApproval.depositApproval")}
            </h2>""",
        ),
        (
            'placeholder="Search by App/Acc No, Queue No..."',
            'placeholder={t("depositApproval.searchPlaceholder")}',
        ),
        (
            """                <TableHead className="w-[60px] text-white font-semibold h-11">
                  Sl
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Trans Date
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Queue No
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  App / Acc No
                </TableHead>
                <TableHead className="text-white font-semibold h-11">
                  Particulars
                </TableHead>
                <TableHead className="text-white font-semibold h-11 text-center">
                  Type
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Entered By
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Entered On
                </TableHead>
                <TableHead className="text-center text-white font-semibold h-11">
                  Action
                </TableHead>""",
            """                <TableHead className="w-[60px] text-white font-semibold h-11">
                  {t("common.sl")}
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  {t("depositApproval.transDate")}
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  {t("depositApproval.queueNo")}
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  {t("depositApproval.appAccNo")}
                </TableHead>
                <TableHead className="text-white font-semibold h-11">
                  {t("depositApproval.particulars")}
                </TableHead>
                <TableHead className="text-white font-semibold h-11 text-center">
                  {t("depositApproval.type")}
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  {t("depositApproval.enteredBy")}
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  {t("depositApproval.enteredOn")}
                </TableHead>
                <TableHead className="text-center text-white font-semibold h-11">
                  {t("common.action")}
                </TableHead>""",
        ),
        (
            '{item.Appl_No || item.Account_No || "N/A"}',
            '{item.Appl_No || item.Account_No || t("common.notAvailable")}',
        ),
        (
            "{item.Vouch_Type || \"Unknown\"}",
            '{item.Vouch_Type || t("depositApproval.unknown")}',
        ),
        (
            '<Eye className="w-3.5 h-3.5 mr-2" /> View',
            '<Eye className="w-3.5 h-3.5 mr-2" /> {t("common.view")}',
        ),
        (
            """                      <p className="text-sm font-medium">
                        No pending approvals found.
                      </p>""",
            """                      <p className="text-sm font-medium">
                        {t("depositApproval.noPendingApprovals")}
                      </p>""",
        ),
        (
            """            <div className="text-xs text-gray-500 font-medium">
              Showing{" "}
              <span className="text-gray-900 font-bold">
                {depositList.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="text-gray-900 font-bold">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="text-gray-900 font-bold">{totalItems}</span>{" "}
              records
            </div>""",
            """            <div className="text-xs text-gray-500 font-medium">
              {t("depositApproval.showing")}{" "}
              <span className="text-gray-900 font-bold">
                {depositList.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}
              </span>{" "}
              {t("depositApproval.to")}{" "}
              <span className="text-gray-900 font-bold">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              {t("depositApproval.of")}{" "}
              <span className="text-gray-900 font-bold">{totalItems}</span>{" "}
              {t("depositApproval.records")}
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


def wire_action():
    p = BASE / "DepositActionModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import { cn } from "@/lib/utils";\n',
            'import { cn } from "@/lib/utils";\nimport { useTranslation } from "react-i18next";\n',
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
            'return "Unknown Member";',
            'return t("depositApproval.unknownMember");',
        ),
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("depositApproval.pleaseEnterRejectionRemarks"));',
        ),
        (
            'return renderSmartField("Installment Amt", appData?.Installment_Amount, true);',
            'return renderSmartField(t("depositApproval.installmentAmt"), appData?.Installment_Amount, true);',
        ),
        (
            'return renderSmartField("Mandatory Amt", appData?.Mandatory_Amount, true);',
            'return renderSmartField(t("depositApproval.mandatoryAmt"), appData?.Mandatory_Amount, true);',
        ),
        (
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                Deposit Approval Portal
              </DialogTitle>""",
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                {t("depositApproval.approvalPortal")}
              </DialogTitle>""",
        ),
        (
            "App / Acc No: {appData?.Appl_No || appData?.Account_No || \"N/A\"}",
            '{t("depositApproval.appAccNoLabel")}{" "}\n                  {appData?.Appl_No || appData?.Account_No || t("common.notAvailable")}',
        ),
        (
            '<XCircle className="w-4 h-4 mr-2" /> Close',
            '<XCircle className="w-4 h-4 mr-2" /> {t("depositApproval.close")}',
        ),
        (
            '<span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Transaction Amount</span>',
            '<span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t("depositApproval.transactionAmount")}</span>',
        ),
        (
            '<span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Available Balance</span>',
            '<span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t("depositApproval.availableBalance")}</span>',
        ),
        (
            '<SectionHeader title="Application Details" />',
            '<SectionHeader title={t("depositApproval.applicationDetails")} />',
        ),
        (
            'renderSmartField("Transaction Date", appData?.Trans_Date, false, true)',
            'renderSmartField(t("depositApproval.transactionDate"), appData?.Trans_Date, false, true)',
        ),
        (
            'renderSmartField("Queue No", appData?.Queue_No)',
            'renderSmartField(t("depositApproval.queueNo"), appData?.Queue_No)',
        ),
        (
            'renderSmartField("Voucher Type", appData?.Vouch_Type)',
            'renderSmartField(t("depositApproval.voucherType"), appData?.Vouch_Type)',
        ),
        (
            'renderSmartField("Entered By", appData?.Entred_By)',
            'renderSmartField(t("depositApproval.enteredBy"), appData?.Entred_By)',
        ),
        (
            'renderSmartField("Entered On", appData?.Entred_On)',
            'renderSmartField(t("depositApproval.enteredOn"), appData?.Entred_On)',
        ),
        (
            '<SectionHeader title="Account Information" />',
            '<SectionHeader title={t("depositApproval.accountInformation")} />',
        ),
        (
            'renderSmartField("Reference Ac No", appData?.Ref_Ac_No)',
            'renderSmartField(t("depositApproval.referenceAcNo"), appData?.Ref_Ac_No)',
        ),
        (
            'renderSmartField("Ledger Folio", appData?.Ledg_Folio)',
            'renderSmartField(t("depositApproval.ledgerFolio"), appData?.Ledg_Folio)',
        ),
        (
            'renderSmartField("Operation Mode", appData?.Oper_Mode)',
            'renderSmartField(t("depositApproval.operationMode"), appData?.Oper_Mode)',
        ),
        (
            'renderSmartField("CBS Account No", appData?.CBS_Ac_No)',
            'renderSmartField(t("depositApproval.cbsAccountNo"), appData?.CBS_Ac_No)',
        ),
        (
            '<SectionHeader title="Product & Financials" />',
            '<SectionHeader title={t("depositApproval.productFinancials")} />',
        ),
        (
            'renderSmartField("Product Name", appData?.Prod_Name || appData?.Particular, false, false, true)',
            'renderSmartField(t("depositApproval.productName"), appData?.Prod_Name || appData?.Particular, false, false, true)',
        ),
        (
            'renderSmartField("Product Type", appData?.Product_Type)',
            'renderSmartField(t("depositApproval.productType"), appData?.Product_Type)',
        ),
        (
            'renderSmartField("Cheque No", appData?.Cheque_No)',
            'renderSmartField(t("depositApproval.chequeNo"), appData?.Cheque_No)',
        ),
        (
            '{!isPayment && renderSmartField("Amount", appData?.Amount, true)}',
            '{!isPayment && renderSmartField(t("depositApproval.amount"), appData?.Amount, true)}',
        ),
        (
            'renderSmartField("Interest Rate (ROI)", appData?.ROI, false, false, false, "%")',
            'renderSmartField(t("depositApproval.interestRateRoi"), appData?.ROI, false, false, false, "%")',
        ),
        (
            '<SectionHeader title="Term & Maturity Details" />',
            '<SectionHeader title={t("depositApproval.termMaturityDetails")} />',
        ),
        (
            'renderSmartField(\n                        "Duration",',
            'renderSmartField(\n                        t("depositApproval.duration"),',
        ),
        (
            'renderSmartField("Maturity Date", appData?.Maturity_Date, false, true)',
            'renderSmartField(t("depositApproval.maturityDate"), appData?.Maturity_Date, false, true)',
        ),
        (
            'renderSmartField("Maturity Amount", appData?.Maturity_Amount, true)',
            'renderSmartField(t("depositApproval.maturityAmount"), appData?.Maturity_Amount, true)',
        ),
        (
            '<SectionHeader title="Payment Configuration" />',
            '<SectionHeader title={t("depositApproval.paymentConfiguration")} />',
        ),
        (
            'renderSmartField("ECS Mode", appData?.Ecs_Mode)',
            'renderSmartField(t("depositApproval.ecsMode"), appData?.Ecs_Mode)',
        ),
        (
            'renderSmartField("Payout Mode", appData?.Payout_Mode)',
            'renderSmartField(t("depositApproval.payoutMode"), appData?.Payout_Mode)',
        ),
        (
            'renderSmartField("Particulars", appData?.Particular, false, false, true)',
            'renderSmartField(t("depositApproval.particulars"), appData?.Particular, false, false, true)',
        ),
        (
            '<SectionHeader title="Joint Account Holders" />',
            '<SectionHeader title={t("depositApproval.jointAccountHolders")} />',
        ),
        (
            "Relation: {holder.Relation || \"N/A\"}",
            '{t("depositApproval.relation")}{" "}\n                              {holder.Relation || t("common.notAvailable")}',
        ),
        (
            '<SectionHeader title="Nominee Information" />',
            '<SectionHeader title={t("depositApproval.nomineeInformation")} />',
        ),
        (
            'renderSmartField("Nominee Name", nom.Nom_Name || nom.Nominee_Name)',
            'renderSmartField(t("depositApproval.nomineeName"), nom.Nom_Name || nom.Nominee_Name)',
        ),
        (
            'renderSmartField("Relation", nom.Nom_Rel || nom.Relation)',
            'renderSmartField(t("depositApproval.relationLabel"), nom.Nom_Rel || nom.Relation)',
        ),
        (
            'renderSmartField("Age / DOB", nom.Nom_Age || nom.DOB)',
            'renderSmartField(t("depositApproval.ageDob"), nom.Nom_Age || nom.DOB)',
        ),
        (
            'renderSmartField("Share Percentage", nom.Nom_Perc || nom.Percentage, false, false, false, "%")',
            'renderSmartField(t("depositApproval.sharePercentage"), nom.Nom_Perc || nom.Percentage, false, false, false, "%")',
        ),
        (
            """            <div className="text-xs text-gray-400 font-medium">
              * Please review all details before approving.
            </div>""",
            """            <div className="text-xs text-gray-400 font-medium">
              {t("depositApproval.reviewBeforeApprove")}
            </div>""",
        ),
        (
            '<Ban className="w-4 h-4 mr-2" /> Reject',
            '<Ban className="w-4 h-4 mr-2" /> {t("depositApproval.reject")}',
        ),
        (
            '<CheckCircle2 className="w-5 h-5 mr-2" /> Approve',
            '<CheckCircle2 className="w-5 h-5 mr-2" /> {t("depositApproval.approve")}',
        ),
        (
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Application
            </DialogTitle>""",
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("depositApproval.rejectApplication")}
            </DialogTitle>""",
        ),
        (
            """              Rejection Remarks <span className="text-red-500">*</span>""",
            """              {t("depositApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>""",
        ),
        (
            'placeholder="Enter reason for rejection..."',
            'placeholder={t("depositApproval.enterRejectionReason")}',
        ),
        (
            """            <Button variant="outline" onClick={() => setShowRejectModal(false)} disabled={actionLoading}>
              Cancel
            </Button>""",
            """            <Button variant="outline" onClick={() => setShowRejectModal(false)} disabled={actionLoading}>
              {t("common.cancel")}
            </Button>""",
        ),
        (
            """              ) : (
                "Confirm Rejection"
              )}""",
            """              ) : (
                t("depositApproval.confirmRejection")
              )}""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("ACTION MISSING:", repr(old[:90]))
        else:
            t = t.replace(old, new)
            print("ACTION OK:", old[:50].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("action done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_reject()
    wire_index()
    wire_action()


if __name__ == "__main__":
    main()
