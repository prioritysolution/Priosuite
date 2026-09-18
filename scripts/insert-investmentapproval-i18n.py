# -*- coding: utf-8 -*-
"""Insert investmentApproval locales and wire Investmentapproval components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
BASE = ROOT / "components" / "approval" / "Investmentapproval"


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
        "transactionType": "Transaction Type",
        "queueNo": "Queue No",
    },
    "hi": {
        "transactionType": "लेनदेन प्रकार",
        "queueNo": "क्यू नंबर",
    },
    "bn": {
        "transactionType": "লেনদেনের ধরন",
        "queueNo": "কিউ নম্বর",
    },
    "or": {
        "transactionType": "କାରବାର ପ୍ରକାର",
        "queueNo": "କ୍ୟୁ ନମ୍ବର",
    },
}

INVEST = {
    "en": {
        "investmentApproval": "Investment Approval",
        "searchPlaceholder": "Search by investment type, bank, account...",
        "investType": "Invest Type",
        "noPendingApprovals": "No pending approvals found matching your search.",
        "queueNoLabel": "Queue No:",
        "typeFallback": "Type {{type}}",
        "investmentType": "Investment Type",
        "bankName": "Bank Name",
        "accountNo": "Account No",
        "openingDate": "Opening Date",
        "investmentAmount": "Investment Amount",
        "roi": "ROI",
        "durationMonth": "Duration (Month)",
        "maturityDate": "Maturity Date",
        "maturityValue": "Maturity Value",
        "voucherDate": "Voucher Date",
        "transactionMode": "Transaction Mode",
        "fromBankAccount": "From Bank Account",
        "transactionType": "Transaction Type",
        "amount": "Amount",
        "reject": "Reject",
        "approve": "Approve",
        "rejectApplication": "Reject Application",
        "rejectionRemarks": "Rejection Remarks",
        "enterRejectionReason": "Enter reason for rejection...",
        "pleaseEnterRejectionRemarks": "Please enter remarks for rejection.",
        "confirmRejection": "Confirm Rejection",
    },
    "hi": {
        "investmentApproval": "निवेश अनुमोदन",
        "searchPlaceholder": "निवेश प्रकार, बैंक, खाता से खोजें...",
        "investType": "निवेश प्रकार",
        "noPendingApprovals": "आपकी खोज से मेल खाने वाले कोई लंबित अनुमोदन नहीं मिले।",
        "queueNoLabel": "क्यू नंबर:",
        "typeFallback": "प्रकार {{type}}",
        "investmentType": "निवेश प्रकार",
        "bankName": "बैंक का नाम",
        "accountNo": "खाता संख्या",
        "openingDate": "खाता खोलने की तिथि",
        "investmentAmount": "निवेश राशि",
        "roi": "ROI",
        "durationMonth": "अवधि (माह)",
        "maturityDate": "परिपक्वता तिथि",
        "maturityValue": "परिपक्वता मूल्य",
        "voucherDate": "वाउचर दिनांक",
        "transactionMode": "लेनदेन मोड",
        "fromBankAccount": "बैंक खाते से",
        "transactionType": "लेनदेन प्रकार",
        "amount": "राशि",
        "reject": "अस्वीकार करें",
        "approve": "अनुमोदित करें",
        "rejectApplication": "आवेदन अस्वीकार करें",
        "rejectionRemarks": "अस्वीकृति टिप्पणी",
        "enterRejectionReason": "अस्वीकृति का कारण दर्ज करें...",
        "pleaseEnterRejectionRemarks": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
        "confirmRejection": "अस्वीकृति की पुष्टि करें",
    },
    "bn": {
        "investmentApproval": "বিনিয়োগ অনুমোদন",
        "searchPlaceholder": "বিনিয়োগের ধরন, ব্যাংক, অ্যাকাউন্ট দিয়ে খুঁজুন...",
        "investType": "বিনিয়োগের ধরন",
        "noPendingApprovals": "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো পেন্ডিং অনুমোদন পাওয়া যায়নি।",
        "queueNoLabel": "কিউ নম্বর:",
        "typeFallback": "ধরন {{type}}",
        "investmentType": "বিনিয়োগের ধরন",
        "bankName": "ব্যাংকের নাম",
        "accountNo": "অ্যাকাউন্ট নম্বর",
        "openingDate": "খোলার তারিখ",
        "investmentAmount": "বিনিয়োগের পরিমাণ",
        "roi": "ROI",
        "durationMonth": "সময়কাল (মাস)",
        "maturityDate": "পরিপক্কতার তারিখ",
        "maturityValue": "পরিপক্কতার মূল্য",
        "voucherDate": "ভাউচার তারিখ",
        "transactionMode": "লেনদেন মোড",
        "fromBankAccount": "ব্যাংক অ্যাকাউন্ট থেকে",
        "transactionType": "লেনদেনের ধরন",
        "amount": "পরিমাণ",
        "reject": "প্রত্যাখ্যান",
        "approve": "অনুমোদন",
        "rejectApplication": "আবেদন প্রত্যাখ্যান",
        "rejectionRemarks": "প্রত্যাখ্যানের মন্তব্য",
        "enterRejectionReason": "প্রত্যাখ্যানের কারণ লিখুন...",
        "pleaseEnterRejectionRemarks": "প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
        "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
    },
    "or": {
        "investmentApproval": "ନିବେଶ ଅନୁମୋଦନ",
        "searchPlaceholder": "ନିବେଶ ପ୍ରକାର, ବ୍ୟାଙ୍କ, ଆକାଉଣ୍ଟ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
        "investType": "ନିବେଶ ପ୍ରକାର",
        "noPendingApprovals": "ଆପଣଙ୍କ ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
        "queueNoLabel": "କ୍ୟୁ ନମ୍ବର:",
        "typeFallback": "ପ୍ରକାର {{type}}",
        "investmentType": "ନିବେଶ ପ୍ରକାର",
        "bankName": "ବ୍ୟାଙ୍କ ନାମ",
        "accountNo": "ଆକାଉଣ୍ଟ ନମ୍ବର",
        "openingDate": "ଖୋଲିବା ତାରିଖ",
        "investmentAmount": "ନିବେଶ ରାଶି",
        "roi": "ROI",
        "durationMonth": "ଅବଧି (ମାସ)",
        "maturityDate": "ପରିପକ୍ୱତା ତାରିଖ",
        "maturityValue": "ପରିପକ୍ୱତା ମୂଲ୍ୟ",
        "voucherDate": "ଭାଉଚର୍ ତାରିଖ",
        "transactionMode": "କାରବାର ମୋଡ୍",
        "fromBankAccount": "ବ୍ୟାଙ୍କ ଆକାଉଣ୍ଟରୁ",
        "transactionType": "କାରବାର ପ୍ରକାର",
        "amount": "ରାଶି",
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


def ensure_common_keys(text: str, lang: str) -> str:
    """Add transactionType/queueNo to the last common block if missing."""
    matches = list(re.finditer(r"\n    common:\s*\{", text))
    if not matches:
        raise SystemExit(f"{lang}: common not found")
    m = matches[-1]
    depth = 0
    i = m.end() - 1
    while i < len(text):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                common_end = i
                common_block = text[m.start() : common_end]
                break
        i += 1
    else:
        raise SystemExit(f"{lang}: could not close common")

    extras = []
    for key, val in COMMON_EXTRA[lang].items():
        if not re.search(rf"\n      {key}:", common_block):
            esc = val.replace("\\", "\\\\").replace('"', '\\"')
            extras.append(f'      {key}: "{esc}"')
    if not extras:
        return text
    # insert before closing of common (before common_end)
    insert = ",\n" + ",\n".join(extras) + "\n"
    # if last non-ws before } has no comma, we already start with comma after previous entry
    # find last property line
    before = text[:common_end].rstrip()
    if not before.endswith(","):
        # add comma to last line end
        # last char of content before }
        pass
    # safer: inject before the closing brace with leading comma on new keys
    # Ensure previous last key has trailing comma
    prefix = text[:common_end]
    # strip trailing whitespace inside common
    stripped = prefix.rstrip()
    if not stripped.endswith(","):
        stripped = stripped + ","
    return stripped + "\n" + ",\n".join(extras) + "\n    " + text[common_end:]


def insert_lang(lang: str) -> None:
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")
    text = ensure_common_keys(text, lang)

    if re.search(r"\n    investmentApproval:\s*\{", text):
        print(f"{lang}: investmentApproval already present")
    else:
        block = (
            "    investmentApproval: {\n"
            + js_obj(INVEST[lang], indent=6)
            + "\n    },"
        )
        for anchor in ("bankingApproval", "voucherApproval", "loanApproval"):
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
          Investment Approval
        </h2>""",
            """        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          {t("investmentApproval.investmentApproval")}
        </h2>""",
        ),
        (
            'placeholder="Search by investment type, bank, account..."',
            'placeholder={t("investmentApproval.searchPlaceholder")}',
        ),
        (
            """                <TableHead className="w-[50px] font-semibold">Sl</TableHead>
                <TableHead className="font-semibold">Transaction Type</TableHead>
                <TableHead className="font-semibold">Queue No</TableHead>
                <TableHead className="font-semibold">Invest Type</TableHead>
                <TableHead className="font-semibold">Account No</TableHead>
                <TableHead className="font-semibold">Amount</TableHead>
                <TableHead className="text-right font-semibold">Action</TableHead>""",
            """                <TableHead className="w-[50px] font-semibold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.transactionType")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.queueNo")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("investmentApproval.investType")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.accountNo")}
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
            '<p>{t("investmentApproval.noPendingApprovals")}</p>',
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
    path = BASE / "InvestmentActionModal.jsx"
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

    # Support isDate so translated labels still format dates
    text = text.replace(
        "  const renderField = (label, value) => {\n    let displayValue = value;\n    if (label && label.toLowerCase().includes(\"date\")) {\n      displayValue = formatDate(value);\n    }",
        "  const renderField = (label, value, isDate = false) => {\n    let displayValue = value;\n    if (isDate || (label && label.toLowerCase().includes(\"date\"))) {\n      displayValue = formatDate(value);\n    }",
        1,
    )

    repls = [
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("investmentApproval.pleaseEnterRejectionRemarks"));',
        ),
        (
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Investment Approval
              </DialogTitle>""",
            """              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                {t("investmentApproval.investmentApproval")}
              </DialogTitle>""",
        ),
        (
            """                <span className="font-medium">
                  Queue No: {selectedApplication.Queue_No || "N/A"}
                </span>""",
            """                <span className="font-medium">
                  {t("investmentApproval.queueNoLabel")}{" "}
                  {selectedApplication.Queue_No || "N/A"}
                </span>""",
        ),
        (
            """                  {selectedApplication.Type_Name ||
                    selectedApplication.Trans_Type ||
                    `Type ${type}`}""",
            """                  {selectedApplication.Type_Name ||
                    selectedApplication.Trans_Type ||
                    t("investmentApproval.typeFallback", { type })}""",
        ),
        # type === 0 block labels
        (
            """                    {renderField(
                      "Investment Type",
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField("Bank Name", selectedApplication.Bank_Name)}
                    {renderField("Account No", selectedApplication.Account_No)}
                    {renderField("Opening Date", selectedApplication.Open_Date)}
                    {renderField(
                      "Investment Amount",
                      selectedApplication.Invest_Amt ||
                        selectedApplication.Amount,
                    )}
                    {renderField(
                      "ROI",
                      selectedApplication.ROI || selectedApplication.Roi,
                    )}
                    {renderField(
                      "Duration (Month)",
                      selectedApplication.Duration ||
                        selectedApplication.Duration_Month,
                    )}
                    {renderField(
                      "Maturity Date",
                      selectedApplication.Mature_Date,
                    )}
                    {renderField(
                      "Maturity Value",
                      selectedApplication.Mature_Val,
                    )}
                    {renderField(
                      "Voucher Date",
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                    )}
                    {renderField(
                      "Transaction Mode",
                      selectedApplication.Trans_Mode,
                    )}
                    {String(selectedApplication.Bank_No) !== "" &&
                      selectedApplication.Bank_No !== null &&
                      renderField(
                        "From Bank Account",
                        selectedApplication.Bank_No,
                      )}""",
            """                    {renderField(
                      t("investmentApproval.investmentType"),
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField(t("investmentApproval.bankName"), selectedApplication.Bank_Name)}
                    {renderField(t("investmentApproval.accountNo"), selectedApplication.Account_No)}
                    {renderField(t("investmentApproval.openingDate"), selectedApplication.Open_Date, true)}
                    {renderField(
                      t("investmentApproval.investmentAmount"),
                      selectedApplication.Invest_Amt ||
                        selectedApplication.Amount,
                    )}
                    {renderField(
                      t("investmentApproval.roi"),
                      selectedApplication.ROI || selectedApplication.Roi,
                    )}
                    {renderField(
                      t("investmentApproval.durationMonth"),
                      selectedApplication.Duration ||
                        selectedApplication.Duration_Month,
                    )}
                    {renderField(
                      t("investmentApproval.maturityDate"),
                      selectedApplication.Mature_Date,
                      true,
                    )}
                    {renderField(
                      t("investmentApproval.maturityValue"),
                      selectedApplication.Mature_Val,
                    )}
                    {renderField(
                      t("investmentApproval.voucherDate"),
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                      true,
                    )}
                    {renderField(
                      t("investmentApproval.transactionMode"),
                      selectedApplication.Trans_Mode,
                    )}
                    {String(selectedApplication.Bank_No) !== "" &&
                      selectedApplication.Bank_No !== null &&
                      renderField(
                        t("investmentApproval.fromBankAccount"),
                        selectedApplication.Bank_No,
                      )}""",
        ),
        # type === 1
        (
            """                    {renderField(
                      "Investment Type",
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField("Bank Name", selectedApplication.Bank_Name)}
                    {renderField("Account No", selectedApplication.Account_No)}
                    {renderField(
                      "Opening Date",
                      selectedApplication.Opening_Date,
                    )}
                    {renderField(
                      "Investment Amount",
                      selectedApplication.Invest_Amt ||
                        selectedApplication.Amount,
                    )}
                    {renderField(
                      "ROI",
                      selectedApplication.ROI || selectedApplication.Roi,
                    )}
                    {renderField(
                      "Duration (Month)",
                      selectedApplication.Duration ||
                        selectedApplication.Duration_Month,
                    )}
                    {renderField(
                      "Maturity Date",
                      selectedApplication.Maturity_Date,
                    )}
                    {renderField(
                      "Maturity Value",
                      selectedApplication.Maturity_Val ||
                        selectedApplication.Maturity_Value,
                    )}
                    {renderField(
                      "Voucher Date",
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                    )}""",
            """                    {renderField(
                      t("investmentApproval.investmentType"),
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField(t("investmentApproval.bankName"), selectedApplication.Bank_Name)}
                    {renderField(t("investmentApproval.accountNo"), selectedApplication.Account_No)}
                    {renderField(
                      t("investmentApproval.openingDate"),
                      selectedApplication.Opening_Date,
                      true,
                    )}
                    {renderField(
                      t("investmentApproval.investmentAmount"),
                      selectedApplication.Invest_Amt ||
                        selectedApplication.Amount,
                    )}
                    {renderField(
                      t("investmentApproval.roi"),
                      selectedApplication.ROI || selectedApplication.Roi,
                    )}
                    {renderField(
                      t("investmentApproval.durationMonth"),
                      selectedApplication.Duration ||
                        selectedApplication.Duration_Month,
                    )}
                    {renderField(
                      t("investmentApproval.maturityDate"),
                      selectedApplication.Maturity_Date,
                      true,
                    )}
                    {renderField(
                      t("investmentApproval.maturityValue"),
                      selectedApplication.Maturity_Val ||
                        selectedApplication.Maturity_Value,
                    )}
                    {renderField(
                      t("investmentApproval.voucherDate"),
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                      true,
                    )}""",
        ),
        # type === 2
        (
            """                    {renderField(
                      "Investment Type",
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField("Bank Name", selectedApplication.Bank_Name)}
                    {renderField("Account No", selectedApplication.Account_No)}
                    {renderField(
                      "Transaction Type",
                      selectedApplication.Trans_Type,
                    )}
                    {renderField(
                      "Amount",
                      selectedApplication.Amount ||
                        selectedApplication.Invest_Amt,
                    )}
                    {renderField(
                      "Voucher Date",
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                    )}""",
            """                    {renderField(
                      t("investmentApproval.investmentType"),
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField(t("investmentApproval.bankName"), selectedApplication.Bank_Name)}
                    {renderField(t("investmentApproval.accountNo"), selectedApplication.Account_No)}
                    {renderField(
                      t("investmentApproval.transactionType"),
                      selectedApplication.Trans_Type,
                    )}
                    {renderField(
                      t("investmentApproval.amount"),
                      selectedApplication.Amount ||
                        selectedApplication.Invest_Amt,
                    )}
                    {renderField(
                      t("investmentApproval.voucherDate"),
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                      true,
                    )}""",
        ),
        (
            '<Ban className="w-4 h-4 mr-2" /> Reject',
            '<Ban className="w-4 h-4 mr-2" /> {t("investmentApproval.reject")}',
        ),
        (
            '<CheckCircle2 className="w-4 h-4 mr-2" /> Approve',
            '<CheckCircle2 className="w-4 h-4 mr-2" /> {t("investmentApproval.approve")}',
        ),
        (
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Application
            </DialogTitle>""",
            """            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("investmentApproval.rejectApplication")}
            </DialogTitle>""",
        ),
        (
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              Rejection Remarks <span className="text-red-500">*</span>
            </Label>""",
            """            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              {t("investmentApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>""",
        ),
        (
            'placeholder="Enter reason for rejection..."',
            'placeholder={t("investmentApproval.enterRejectionReason")}',
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
            """              {t("investmentApproval.confirmRejection")}
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
