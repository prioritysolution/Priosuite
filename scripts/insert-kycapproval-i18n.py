# -*- coding: utf-8 -*-
"""Insert kycApproval locales and wire KYC approval UI."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
CONTAINER = ROOT / "container" / "approval" / "kyc" / "index.jsx"
MODAL = ROOT / "components" / "approval" / "kyc" / "KycActionModal.jsx"


def js_obj(d, indent=6):
    pad = " " * indent
    lines = []
    items = list(d.items())
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        if isinstance(v, dict):
            inner = js_obj(v, indent + 2)
            lines.append(f"{pad}{k}: {{\n{inner}\n{pad}}}{comma}")
        else:
            esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
            lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


KYC = {
    "en": {
        "kycApproval": "KYC Approval",
        "searchPlaceholder": "Search by name, app no...",
        "applicationNo": "Application No",
        "customerType": "Customer Type",
        "customerName": "Customer Name",
        "relationName": "Relation Name",
        "mobileNo": "Mobile No",
        "enteredBy": "Entered By",
        "enteredOn": "Entered On",
        "noPendingApprovals": "No pending approvals found matching your search.",
        "showing": "Showing",
        "to": "to",
        "of": "of",
        "entries": "entries",
        "appNo": "App No:",
        "updateProfile": "Update Profile",
        "cancelEdit": "Cancel Edit",
        "saveAndUpdate": "Save & Update",
        "reject": "Reject",
        "approve": "Approve",
        "locationDetails": "Location Details",
        "permanentAddress": "Permanent Address",
        "presentAddress": "Present Address",
        "identityDocuments": "Identity Documents",
        "noChangesDetected": "No changes detected. Please modify at least one field before updating.",
        "pleaseEnterRejectionRemarks": "Please enter remarks for rejection.",
        "rejectApplication": "Reject Application",
        "rejectionRemarks": "Rejection Remarks",
        "enterRejectionReason": "Enter reason for rejection...",
        "confirmRejection": "Confirm Rejection",
        "enterField": "Enter {{field}}",
        "fields": {
            "groupNo": "Group No.",
            "groupType": "Group Type",
            "groupName": "Group Name",
            "dateOfFormation": "Date of Formation",
            "noOfBeneficiary": "No Of Beneficiary",
            "mobileNo": "Mobile No.",
            "address": "Address",
            "regDocumentNo": "Reg. / Document No",
            "state": "State",
            "district": "District",
            "block": "Block",
            "policeStation": "Police Station",
            "postOffice": "Post Office",
            "villageWardNo": "village / Ward No.",
            "institutionName": "Institution Name",
            "memberNo": "Member No.",
            "memberType": "Member Type",
            "firstName": "First Name",
            "middleName": "Middle Name",
            "lastName": "Last Name",
            "relationName": "Relation Name",
            "relationType": "Relation Type",
            "dateOfBirth": "Date of Birth",
            "gender": "Gender",
            "caste": "Caste",
            "religion": "Religion",
            "email": "Email",
            "aadhaarNo": "Aadhaar No.",
            "voterId": "Voter Id",
            "rationCard": "Ration Card",
            "panCard": "Pan Card",
        },
    },
    "hi": {
        "kycApproval": "केवाईसी अनुमोदन",
        "searchPlaceholder": "नाम, आवेदन संख्या से खोजें...",
        "applicationNo": "आवेदन संख्या",
        "customerType": "ग्राहक प्रकार",
        "customerName": "ग्राहक का नाम",
        "relationName": "संबंधित व्यक्ति का नाम",
        "mobileNo": "मोबाइल नंबर",
        "enteredBy": "दर्ज करने वाला",
        "enteredOn": "दर्ज किया गया",
        "noPendingApprovals": "आपकी खोज से मेल खाने वाला कोई लंबित अनुमोदन नहीं मिला।",
        "showing": "दिखा रहे हैं",
        "to": "से",
        "of": "में से",
        "entries": "प्रविष्टियां",
        "appNo": "आवेदन संख्या:",
        "updateProfile": "प्रोफ़ाइल अपडेट करें",
        "cancelEdit": "संपादन रद्द करें",
        "saveAndUpdate": "सहेजें और अपडेट करें",
        "reject": "अस्वीकार करें",
        "approve": "अनुमोदित करें",
        "locationDetails": "स्थान विवरण",
        "permanentAddress": "स्थायी पता",
        "presentAddress": "वर्तमान पता",
        "identityDocuments": "पहचान दस्तावेज़",
        "noChangesDetected": "कोई परिवर्तन नहीं मिला। कृपया अपडेट करने से पहले कम से कम एक फ़ील्ड संशोधित करें।",
        "pleaseEnterRejectionRemarks": "कृपया अस्वीकृति के लिए टिप्पणी दर्ज करें।",
        "rejectApplication": "आवेदन अस्वीकार करें",
        "rejectionRemarks": "अस्वीकृति टिप्पणी",
        "enterRejectionReason": "अस्वीकृति का कारण दर्ज करें...",
        "confirmRejection": "अस्वीकृति की पुष्टि करें",
        "enterField": "{{field}} दर्ज करें",
        "fields": {
            "groupNo": "समूह संख्या",
            "groupType": "समूह प्रकार",
            "groupName": "समूह का नाम",
            "dateOfFormation": "गठन की तिथि",
            "noOfBeneficiary": "लाभार्थियों की संख्या",
            "mobileNo": "मोबाइल नंबर",
            "address": "पता",
            "regDocumentNo": "पंजीकरण / दस्तावेज़ संख्या",
            "state": "राज्य",
            "district": "जिला",
            "block": "ब्लॉक",
            "policeStation": "थाना",
            "postOffice": "डाकघर",
            "villageWardNo": "गाँव / वार्ड संख्या",
            "institutionName": "संस्थान का नाम",
            "memberNo": "सदस्य संख्या",
            "memberType": "सदस्य प्रकार",
            "firstName": "पहला नाम",
            "middleName": "मध्य नाम",
            "lastName": "अंतिम नाम",
            "relationName": "संबंधित व्यक्ति का नाम",
            "relationType": "संबंध प्रकार",
            "dateOfBirth": "जन्म तिथि",
            "gender": "लिंग",
            "caste": "जाति",
            "religion": "धर्म",
            "email": "ईमेल",
            "aadhaarNo": "आधार संख्या",
            "voterId": "मतदाता पहचान पत्र",
            "rationCard": "राशन कार्ड",
            "panCard": "पैन कार्ड",
        },
    },
    "bn": {
        "kycApproval": "KYC অনুমোদন",
        "searchPlaceholder": "নাম, আবেদন নম্বর দিয়ে অনুসন্ধান করুন...",
        "applicationNo": "আবেদন নম্বর",
        "customerType": "গ্রাহকের ধরন",
        "customerName": "গ্রাহকের নাম",
        "relationName": "সম্পর্কের নাম",
        "mobileNo": "মোবাইল নম্বর",
        "enteredBy": "প্রবেশ করিয়েছেন",
        "enteredOn": "প্রবেশের তারিখ",
        "noPendingApprovals": "আপনার অনুসন্ধানের সাথে মিলে যাওয়া কোনো অপেক্ষমাণ অনুমোদন পাওয়া যায়নি।",
        "showing": "দেখানো হচ্ছে",
        "to": "থেকে",
        "of": "এর মধ্যে",
        "entries": "এন্ট্রি",
        "appNo": "আবেদন নং:",
        "updateProfile": "প্রোফাইল আপডেট করুন",
        "cancelEdit": "সম্পাদনা বাতিল",
        "saveAndUpdate": "সংরক্ষণ ও আপডেট",
        "reject": "প্রত্যাখ্যান",
        "approve": "অনুমোদন",
        "locationDetails": "অবস্থানের বিবরণ",
        "permanentAddress": "স্থায়ী ঠিকানা",
        "presentAddress": "বর্তমান ঠিকানা",
        "identityDocuments": "পরিচয়পত্র",
        "noChangesDetected": "কোনো পরিবর্তন পাওয়া যায়নি। আপডেট করার আগে অন্তত একটি ক্ষেত্র পরিবর্তন করুন।",
        "pleaseEnterRejectionRemarks": "প্রত্যাখ্যানের জন্য মন্তব্য লিখুন।",
        "rejectApplication": "আবেদন প্রত্যাখ্যান",
        "rejectionRemarks": "প্রত্যাখ্যানের মন্তব্য",
        "enterRejectionReason": "প্রত্যাখ্যানের কারণ লিখুন...",
        "confirmRejection": "প্রত্যাখ্যান নিশ্চিত করুন",
        "enterField": "{{field}} লিখুন",
        "fields": {
            "groupNo": "গ্রুপ নম্বর",
            "groupType": "গ্রুপের ধরন",
            "groupName": "গ্রুপের নাম",
            "dateOfFormation": "গঠনের তারিখ",
            "noOfBeneficiary": "উপকারভোগীর সংখ্যা",
            "mobileNo": "মোবাইল নম্বর",
            "address": "ঠিকানা",
            "regDocumentNo": "নিবন্ধন / নথি নম্বর",
            "state": "রাজ্য",
            "district": "জেলা",
            "block": "ব্লক",
            "policeStation": "থানা",
            "postOffice": "ডাকঘর",
            "villageWardNo": "গ্রাম / ওয়ার্ড নং",
            "institutionName": "প্রতিষ্ঠানের নাম",
            "memberNo": "সদস্য নম্বর",
            "memberType": "সদস্যের ধরন",
            "firstName": "প্রথম নাম",
            "middleName": "মধ্য নাম",
            "lastName": "শেষ নাম",
            "relationName": "সম্পর্কের নাম",
            "relationType": "সম্পর্কের ধরন",
            "dateOfBirth": "জন্ম তারিখ",
            "gender": "লিঙ্গ",
            "caste": "জাতি",
            "religion": "ধর্ম",
            "email": "ইমেল",
            "aadhaarNo": "আধার নম্বর",
            "voterId": "ভোটার আইডি",
            "rationCard": "রেশন কার্ড",
            "panCard": "প্যান কার্ড",
        },
    },
    "or": {
        "kycApproval": "KYC ଅନୁମୋଦନ",
        "searchPlaceholder": "ନାମ, ଆବେଦନ ନମ୍ବର ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
        "applicationNo": "ଆବେଦନ ନମ୍ବର",
        "customerType": "ଗ୍ରାହକ ପ୍ରକାର",
        "customerName": "ଗ୍ରାହକଙ୍କ ନାମ",
        "relationName": "ସମ୍ପର୍କୀୟଙ୍କ ନାମ",
        "mobileNo": "ମୋବାଇଲ୍ ନମ୍ବର",
        "enteredBy": "ଦାଖଲ କରିଛନ୍ତି",
        "enteredOn": "ଦାଖଲ ତାରିଖ",
        "noPendingApprovals": "ଆପଣଙ୍କ ଖୋଜ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ବିଚାରାଧୀନ ଅନୁମୋଦନ ମିଳିଲା ନାହିଁ।",
        "showing": "ଦେଖାଯାଉଛି",
        "to": "ରୁ",
        "of": "ମଧ୍ୟରୁ",
        "entries": "ଏଣ୍ଟ୍ରି",
        "appNo": "ଆବେଦନ ନଂ:",
        "updateProfile": "ପ୍ରୋଫାଇଲ୍ ଅପଡେଟ୍ କରନ୍ତୁ",
        "cancelEdit": "ସମ୍ପାଦନା ବାତିଲ୍",
        "saveAndUpdate": "ସେଭ୍ ଏବଂ ଅପଡେଟ୍",
        "reject": "ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "approve": "ଅନୁମୋଦନ",
        "locationDetails": "ଅବସ୍ଥାନ ବିବରଣୀ",
        "permanentAddress": "ସ୍ଥାୟୀ ଠିକଣା",
        "presentAddress": "ବର୍ତ୍ତମାନ ଠିକଣା",
        "identityDocuments": "ପରିଚୟ ଦସ୍ତାବିଜ",
        "noChangesDetected": "କୌଣସି ପରିବର୍ତ୍ତନ ମିଳିଲା ନାହିଁ। ଅପଡେଟ୍ କରିବା ପୂର୍ବରୁ ଅତିକମରେ ଗୋଟିଏ ଫିଲ୍ଡ ପରିବର୍ତ୍ତନ କରନ୍ତୁ।",
        "pleaseEnterRejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ପାଇଁ ମନ୍ତବ୍ୟ ଲେଖନ୍ତୁ।",
        "rejectApplication": "ଆବେଦନ ପ୍ରତ୍ୟାଖ୍ୟାନ",
        "rejectionRemarks": "ପ୍ରତ୍ୟାଖ୍ୟାନ ମନ୍ତବ୍ୟ",
        "enterRejectionReason": "ପ୍ରତ୍ୟାଖ୍ୟାନର କାରଣ ଲେଖନ୍ତୁ...",
        "confirmRejection": "ପ୍ରତ୍ୟାଖ୍ୟାନ ନିଶ୍ଚିତ କରନ୍ତୁ",
        "enterField": "{{field}} ପ୍ରବେଶ କରନ୍ତୁ",
        "fields": {
            "groupNo": "ଗ୍ରୁପ୍ ନମ୍ବର",
            "groupType": "ଗ୍ରୁପ୍ ପ୍ରକାର",
            "groupName": "ଗ୍ରୁପ୍ ନାମ",
            "dateOfFormation": "ଗଠନ ତାରିଖ",
            "noOfBeneficiary": "ହିତାଧିକାରୀ ସଂଖ୍ୟା",
            "mobileNo": "ମୋବାଇଲ୍ ନମ୍ବର",
            "address": "ଠିକଣା",
            "regDocumentNo": "ପଞ୍ଜିକରଣ / ଦସ୍ତାବିଜ ନମ୍ବର",
            "state": "ରାଜ୍ୟ",
            "district": "ଜିଲ୍ଲା",
            "block": "ବ୍ଲକ୍",
            "policeStation": "ଥାନା",
            "postOffice": "ଡାକଘର",
            "villageWardNo": "ଗାଁ / ୱାର୍ଡ ନଂ",
            "institutionName": "ଅନୁଷ୍ଠାନ ନାମ",
            "memberNo": "ସଦସ୍ୟ ନମ୍ବର",
            "memberType": "ସଦସ୍ୟ ପ୍ରକାର",
            "firstName": "ପ୍ରଥମ ନାମ",
            "middleName": "ମଧ୍ୟ ନାମ",
            "lastName": "ଶେଷ ନାମ",
            "relationName": "ସମ୍ପର୍କୀୟଙ୍କ ନାମ",
            "relationType": "ସମ୍ପର୍କ ପ୍ରକାର",
            "dateOfBirth": "ଜନ୍ମ ତାରିଖ",
            "gender": "ଲିଙ୍ଗ",
            "caste": "ଜାତି",
            "religion": "ଧର୍ମ",
            "email": "ଇମେଲ୍",
            "aadhaarNo": "ଆଧାର ନମ୍ବର",
            "voterId": "ଭୋଟର୍ ଆଇଡି",
            "rationCard": "ରେସନ୍ କାର୍ଡ",
            "panCard": "ପ୍ୟାନ୍ କାର୍ଡ",
        },
    },
}

COMMON_EXTRA = {
    "en": {"notAvailable": "N/A"},
    "hi": {"notAvailable": "उपलब्ध नहीं"},
    "bn": {"notAvailable": "উপলব্ধ নয়"},
    "or": {"notAvailable": "ଉପଲବ୍ଧ ନାହିଁ"},
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

    if re.search(r"\n    kycApproval:\s*\{", text):
        print(f"{lang}: kycApproval already present")
    else:
        block = (
            "    kycApproval: {\n"
            + js_obj(KYC[lang], indent=6)
            + "\n    },"
        )
        for anchor in ("about", "createUser", "userRole", "report"):
            if re.search(rf"\n    {anchor}:\s*\{{", text):
                text = insert_after_top_block(text, anchor, block)
                print(f"{lang}: inserted after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common.notAvailable")
        text = text2
    else:
        print(f"{lang}: common ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_container():
    t = CONTAINER.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\n',
            'import SuccessMessage from "@/common/dialog/SuccessMessage";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "const KycApproval = () => {\n  const {",
            "const KycApproval = () => {\n  const { t } = useTranslation();\n\n  const {",
            1,
        )

    repls = [
        (
            'if (!id || !list) return id || "N/A";',
            'if (!id || !list) return id || t("common.notAvailable");',
        ),
        (
            """          KYC Approval
        </h2>""",
            """          {t("kycApproval.kycApproval")}
        </h2>""",
        ),
        (
            'placeholder="Search by name, app no..."',
            'placeholder={t("kycApproval.searchPlaceholder")}',
        ),
        (
            """                <TableHead className="w-[50px]  font-semibold">
                  Sl
                </TableHead>
                <TableHead className=" font-semibold">
                  Application No
                </TableHead>
                <TableHead className=" font-semibold">
                  Customer Type
                </TableHead>
                <TableHead className=" font-semibold">
                  Customer Name
                </TableHead>
                <TableHead className=" font-semibold">
                  Relation Name
                </TableHead>
                <TableHead className=" font-semibold">Mobile No</TableHead>
                <TableHead className=" font-semibold">Entered By</TableHead>
                <TableHead className=" font-semibold">Entered On</TableHead>
                <TableHead className="text-right font-semibold">
                  Action
                </TableHead>""",
            """                <TableHead className="w-[50px]  font-semibold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("kycApproval.applicationNo")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("kycApproval.customerType")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("kycApproval.customerName")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("kycApproval.relationName")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("kycApproval.mobileNo")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("kycApproval.enteredBy")}
                </TableHead>
                <TableHead className=" font-semibold">
                  {t("kycApproval.enteredOn")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("common.action")}
                </TableHead>""",
        ),
        (
            'item.Full_Name || item.Customer_Name || "N/A";',
            'item.Full_Name || item.Customer_Name || t("common.notAvailable");',
        ),
        (
            "{item.Relation_Name || \"N/A\"}",
            '{item.Relation_Name || t("common.notAvailable")}',
        ),
        (
            "{item.Cust_Mob || \"N/A\"}",
            '{item.Cust_Mob || t("common.notAvailable")}',
        ),
        (
            "{item.Entred_By || \"N/A\"}",
            '{item.Entred_By || t("common.notAvailable")}',
        ),
        (
            """                      <p>
                        No pending approvals found matching your search.
                      </p>""",
            """                      <p>
                        {t("kycApproval.noPendingApprovals")}
                      </p>""",
        ),
        (
            """            <div className="text-sm text-gray-500">
              Showing{" "}
              {kycList.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
              {totalItems} entries
            </div>""",
            """            <div className="text-sm text-gray-500">
              {t("kycApproval.showing")}{" "}
              {kycList.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}{" "}
              {t("kycApproval.to")}{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
              {t("kycApproval.of")} {totalItems}{" "}
              {t("kycApproval.entries")}
            </div>""",
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


LABEL_MAP = [
    ('label: "Group No."', 'label: t("kycApproval.fields.groupNo")'),
    ('label: "Group Type"', 'label: t("kycApproval.fields.groupType")'),
    ('label: "Group Name"', 'label: t("kycApproval.fields.groupName")'),
    ('label: "Date of Formation"', 'label: t("kycApproval.fields.dateOfFormation")'),
    ('label: "No Of Beneficiary"', 'label: t("kycApproval.fields.noOfBeneficiary")'),
    ('label: "Mobile No."', 'label: t("kycApproval.fields.mobileNo")'),
    ('label: "Address"', 'label: t("kycApproval.fields.address")'),
    ('label: "Reg. / Document No"', 'label: t("kycApproval.fields.regDocumentNo")'),
    ('label: "State"', 'label: t("kycApproval.fields.state")'),
    ('label: "District"', 'label: t("kycApproval.fields.district")'),
    ('label: "Block"', 'label: t("kycApproval.fields.block")'),
    ('label: "Police Station"', 'label: t("kycApproval.fields.policeStation")'),
    ('label: "Post Office"', 'label: t("kycApproval.fields.postOffice")'),
    ('label: "village / Ward No."', 'label: t("kycApproval.fields.villageWardNo")'),
    ('label: "Institution Name"', 'label: t("kycApproval.fields.institutionName")'),
    ('label: "Member No."', 'label: t("kycApproval.fields.memberNo")'),
    ('label: "Member Type"', 'label: t("kycApproval.fields.memberType")'),
    ('label: "First Name"', 'label: t("kycApproval.fields.firstName")'),
    ('label: "Middle Name"', 'label: t("kycApproval.fields.middleName")'),
    ('label: "Last Name"', 'label: t("kycApproval.fields.lastName")'),
    ('label: "Relation Name"', 'label: t("kycApproval.fields.relationName")'),
    ('label: "Relation Type"', 'label: t("kycApproval.fields.relationType")'),
    ('label: "Date of Birth"', 'label: t("kycApproval.fields.dateOfBirth")'),
    ('label: "Gender"', 'label: t("kycApproval.fields.gender")'),
    ('label: "Caste"', 'label: t("kycApproval.fields.caste")'),
    ('label: "Religion"', 'label: t("kycApproval.fields.religion")'),
    ('label: "Email"', 'label: t("kycApproval.fields.email")'),
    ('label: "Aadhaar No."', 'label: t("kycApproval.fields.aadhaarNo")'),
    ('label: "Voter Id"', 'label: t("kycApproval.fields.voterId")'),
    ('label: "Ration Card"', 'label: t("kycApproval.fields.rationCard")'),
    ('label: "Pan Card"', 'label: t("kycApproval.fields.panCard")'),
]


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
            "  loading,\n}) => {\n  const { control, handleSubmit, getValues, reset } = form;",
            "  loading,\n}) => {\n  const { t } = useTranslation();\n  const { control, handleSubmit, getValues, reset } = form;",
            1,
        )

    for old, new in LABEL_MAP:
        n = t.count(old)
        if n == 0:
            print("LABEL MISSING:", old)
        else:
            t = t.replace(old, new)
            print(f"LABEL OK x{n}:", old)

    ui_repls = [
        (
            """      toast.error(
        "No changes detected. Please modify at least one field before updating.",
      );""",
            """      toast.error(t("kycApproval.noChangesDetected"));""",
        ),
        (
            'return value || "N/A";',
            'return value || t("common.notAvailable");',
        ),
        (
            """            displayValue !== ""
              ? displayValue
              : "N/A"}""",
            """            displayValue !== ""
              ? displayValue
              : t("common.notAvailable")}""",
        ),
        (
            "placeholder={`Enter ${label.toLowerCase()}`}",
            'placeholder={t("kycApproval.enterField", { field: label })}',
        ),
        (
            'toast.error("Please enter remarks for rejection.");',
            'toast.error(t("kycApproval.pleaseEnterRejectionRemarks"));',
        ),
        (
            """              <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight leading-tight">
                KYC Approval
              </DialogTitle>""",
            """              <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight leading-tight">
                {t("kycApproval.kycApproval")}
              </DialogTitle>""",
        ),
        (
            '<span className="text-gray-400">App No:</span>{" "}',
            '<span className="text-gray-400">{t("kycApproval.appNo")}</span>{" "}',
        ),
        (
            """                      <Edit className="w-4 h-4 mr-2 shrink-0" />
                      Update Profile
                    </Button>""",
            """                      <Edit className="w-4 h-4 mr-2 shrink-0" />
                      {t("kycApproval.updateProfile")}
                    </Button>""",
        ),
        (
            """                      <XCircle className="w-4 h-4 mr-2 shrink-0" />
                      Cancel Edit
                    </Button>""",
            """                      <XCircle className="w-4 h-4 mr-2 shrink-0" />
                      {t("kycApproval.cancelEdit")}
                    </Button>""",
        ),
        (
            """                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              Location Details
                            </h4>""",
            """                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              {t("kycApproval.locationDetails")}
                            </h4>""",
        ),
        (
            """                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              Permanent Address
                            </h4>""",
            """                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              {t("kycApproval.permanentAddress")}
                            </h4>""",
        ),
        (
            """                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              Present Address
                            </h4>""",
            """                            <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                              {t("kycApproval.presentAddress")}
                            </h4>""",
        ),
        (
            """                          <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                            Identity Documents
                          </h4>""",
            """                          <h4 className="text-xs sm:text-sm font-bold text-primary/80 uppercase tracking-tighter">
                            {t("kycApproval.identityDocuments")}
                          </h4>""",
        ),
        (
            '<Save className="w-4 h-4 mr-2 shrink-0" /> Save & Update',
            '<Save className="w-4 h-4 mr-2 shrink-0" /> {t("kycApproval.saveAndUpdate")}',
        ),
        (
            '<Ban className="w-4 h-4 mr-2 shrink-0" /> Reject',
            '<Ban className="w-4 h-4 mr-2 shrink-0" /> {t("kycApproval.reject")}',
        ),
        (
            '<CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> Approve',
            '<CheckCircle2 className="w-4 h-4 mr-2 shrink-0" /> {t("kycApproval.approve")}',
        ),
        (
            """            <DialogTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              Reject Application
            </DialogTitle>""",
            """            <DialogTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {t("kycApproval.rejectApplication")}
            </DialogTitle>""",
        ),
        (
            """              Rejection Remarks <span className="text-red-500">*</span>""",
            """              {t("kycApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>""",
        ),
        (
            'placeholder="Enter reason for rejection..."',
            'placeholder={t("kycApproval.enterRejectionReason")}',
        ),
        (
            """            >
              Cancel
            </Button>""",
            """            >
              {t("common.cancel")}
            </Button>""",
        ),
        (
            """            >
              Confirm Rejection
            </Button>""",
            """            >
              {t("kycApproval.confirmRejection")}
            </Button>""",
        ),
    ]

    for old, new in ui_repls:
        if old not in t:
            print("MODAL UI MISSING:", repr(old[:90]))
        else:
            t = t.replace(old, new)
            print("MODAL UI OK:", old[:50].replace("\n", " "))

    MODAL.write_text(t, encoding="utf-8")
    print("modal done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_container()
    wire_modal()


if __name__ == "__main__":
    main()
