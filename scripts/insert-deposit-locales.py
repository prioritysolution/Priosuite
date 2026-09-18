# -*- coding: utf-8 -*-
"""Parse deposit locale from text file and insert into en/hi/bn/or; add extras for openDeposit/report."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
TEXT = (ROOT / "text").read_text(encoding="utf-8")
LOC = ROOT / "i18n" / "locales"


def extract_js_block(lang_marker: str) -> str:
    """Extract deposit: { ... }, following a language section marker."""
    # Find ```js after marker then deposit:
    idx = TEXT.find(lang_marker)
    if idx < 0:
        raise SystemExit(f"marker not found: {lang_marker}")
    d = TEXT.find("deposit: {", idx)
    if d < 0:
        raise SystemExit("deposit not found")
    # brace match from deposit: {
    start = TEXT.find("{", d)
    depth = 0
    i = start
    while i < len(TEXT):
        if TEXT[i] == "{":
            depth += 1
        elif TEXT[i] == "}":
            depth -= 1
            if depth == 0:
                return TEXT[start : i + 1]
        i += 1
    raise SystemExit("unclosed")


def js_object_to_py(s: str):
    """Very light converter: deposit object literal -> python via json after quoting keys."""
    # Already mostly valid if we use eval-like with json - convert unquoted keys
    # Use a simpler approach: keep as JS string fragment for insertion
    return s


EN_BLOCK = extract_js_block("### `en.js`")
# Hindi/BN/OR blocks are incomplete (missing feature nests). We'll deep-merge EN structure with translations.

# Extras to merge into EN for screens not fully covered
EXTRAS_EN = {
    "openDepositAccount": {
        "title": "Open Deposit Account",
    },
    "depositTxn": {
        "title": "Deposit",
    },
    "report": {
        "title": "Deposit Report",
        "fields": {
            "fromDate": "From Date",
            "toDate": "To Date",
            "productType": "Product Type",
            "reportType": "Report Type",
            "branch": "Branch",
        },
        "placeholders": {
            "productType": "Select product type",
            "searchProductType": "Search product type...",
            "reportType": "Select report type",
            "searchReportType": "Search report type...",
            "branch": "Select branch",
            "searchBranch": "Search branch...",
        },
    },
    "reports": {
        "slNo": "Sl No.",
        "date": "Date",
        "customerName": "Customer Name",
        "guardianName": "Gurdian Name",
        "accountNo": "Account No.",
        "refAcNo": "Ref. Ac. No.",
        "lfNo": "L/F No.",
        "operationMode": "Operation Mode",
        "nominee": "Nominee",
        "opening": "Opening",
        "openingDate": "Opening Date",
        "deposit": "Deposit",
        "withdrawn": "Withdrawn",
        "closing": "Closing",
        "roi": "ROI",
        "maturityDate": "Maturity Date",
        "dueIntt": "Due Intt.",
        "paidIntt": "Paid Intt.",
        "amount": "Amount",
        "narration": "Narration",
        "interest": "Interest",
        "transMode": "Trans. Mode",
        "action": "Action",
        "print": {
            "slNo": "SL. NO.",
            "date": "DATE",
            "customerName": "CUSTOMER NAME",
            "guardianName": "GUARDIAN NAME",
            "accountNo": "ACCOUNT NO.",
            "accNo": "ACC. NO.",
            "refAcNo": "REF. AC. NO.",
            "lfNo": "L/F. NO.",
            "operationMode": "OPERATION MODE",
            "nominee": "NOMINEE",
            "opening": "OPENING",
            "openingDate": "OPENING DATE",
            "deposit": "DEPOSIT",
            "withdrawn": "WITHDRAWN",
            "closing": "CLOSING",
            "roi": "ROI.",
            "maturityDate": "MATURITY DATE",
            "dueIntt": "DUE INTT.",
            "paidIntt": "PAID INTT.",
            "amount": "AMOUNT",
            "narration": "NARRATION",
            "interest": "INTEREST",
            "transMode": "TRANS. MODE",
        },
    },
    "fieldsExtra": {
        "joint1": "Joint 1",
        "joint2": "Joint 2",
        "paidUpto": "Paid Upto",
        "lastDepositDate": "Last Deposit Date",
        "fromNo": "From No.",
        "toNo": "To No.",
        "noOfLeaves": "No. of Leaves",
        "chargeAmount": "Charge Amount",
        "amountInWords": "Amount in Words",
        "cifNoDot": "CIF. No.",
        "asOn": "As On",
        "chargeType": "Charge Type",
        "lineNo": "Line No.",
        "fromDateLower": "From date",
    },
}


def fmt_dict(data, level=1):
    pad = " " * (4 * level)
    pad2 = " " * (4 * (level + 1))
    if isinstance(data, dict):
        lines = ["{"]
        items = list(data.items())
        for i, (k, v) in enumerate(items):
            comma = "," if i < len(items) - 1 else ""
            lines.append(f"{pad2}{k}: {fmt_dict(v, level + 1)}{comma}")
        lines.append(pad + "}")
        return "\n".join(lines)
    return json.dumps(data, ensure_ascii=False)


# Build EN by taking the block from text and appending extras before final closing
# EN_BLOCK is `{ fields: ..., common: {...} }`
# Insert extras before last `}` of the deposit object

def inject_extras(block: str, extras: dict) -> str:
    # block ends with `}` — insert comma + extras keys before final brace
    extras_js = ",\n".join(f"  {k}: {fmt_dict(v, 1)}" for k, v in extras.items())
    # Also merge fieldsExtra into fields — simpler: add as sibling keys
    inner = block.strip()
    if not inner.endswith("}"):
        raise SystemExit("bad block")
    # remove trailing }
    body = inner[:-1].rstrip()
    if not body.endswith(","):
        body += ","
    # fieldsExtra merge as deposit.fieldsExtra and also we reference deposit.fields.* for common
    return body + "\n" + extras_js + "\n}"


def translate_block(en_obj_text: str, lang: str, leaf_map: dict) -> str:
    """Replace \"English\" strings in JS object with translations when mapped."""
    def repl(m):
        s = json.loads(m.group(0))  # includes quotes
        return json.dumps(leaf_map.get(s, s), ensure_ascii=False)

    return re.sub(r'"(?:\\.|[^"\\])*"', repl, en_obj_text)


# Collect leaf maps from HI/BN/OR partial text blocks
def leaf_map_from_block(block: str) -> dict:
    """Pair is hard — instead extract all \"...\" values isn't enough.
    Build map from EN full vs LANG partial by parsing key paths — skip.
    Use explicit maps from text fields/placeholders/sections/buttons only.
    """
    m = {}
    # Extract key: "value" pairs
    for km in re.finditer(r'(\w+)\s*:\s*"((?:\\.|[^"\\])*)"', block):
        # can't map without EN — collect values only for reverse from EN keys
        pass
    return m


# Simpler strategy: insert full EN into en.js; for hi/bn/or insert EN structure then apply
# string replacements for known translations from the text partial blocks.

def pairs_from_partial(en_block: str, lang_block: str) -> dict:
    """Match by key name within fields/placeholders/sections/buttons only."""
    mapping = {}

    def collect(section_name, block):
        m = re.search(rf"{section_name}\s*:\s*\{{", block)
        if not m:
            return {}
        start = block.find("{", m.start())
        depth = 0
        i = start
        while i < len(block):
            if block[i] == "{":
                depth += 1
            elif block[i] == "}":
                depth -= 1
                if depth == 0:
                    return dict(re.findall(r'(\w+)\s*:\s*"((?:\\.|[^"\\])*)"', block[start : i + 1]))
            i += 1
        return {}

    en_f = collect("fields", en_block)
    lang_f = collect("fields", lang_block)
    for k, ev in en_f.items():
        if k in lang_f:
            mapping[ev] = lang_f[k]
    for sec in ("placeholders", "sections", "buttons"):
        en_s = collect(sec, en_block)
        lang_s = collect(sec, lang_block)
        for k, ev in en_s.items():
            if k in lang_s:
                mapping[ev] = lang_s[k]
    return mapping


HI_BLOCK = extract_js_block("## 3. Hindi")
BN_BLOCK = extract_js_block("## 4. Bengali")
OR_BLOCK = extract_js_block("## 5. Odia")

FEATURE_TR = {
    "hi": {
        "Change Account Status": "खाता स्थिति बदलें",
        "Certificate Print": "प्रमाणपत्र प्रिंट",
        "Passbook Print": "पासबुक प्रिंट",
        "Upload Specimen": "नमूना अपलोड करें",
        "Withdrawn": "निकासी",
        "Issue Cheque": "चेक जारी करें",
        "Renewal": "नवीनीकरण",
        "Close / Mature": "बंद / परिपक्व",
        "Interest Payout": "ब्याज भुगतान",
        "Interest Posting": "ब्याज पोस्टिंग",
        "Generate Savings Interest": "बचत ब्याज जनरेट करें",
        "Charge Deduction": "चार्ज कटौती",
        "Deposit Receipt": "जमा रसीद",
        "Open Deposit Account": "जमा खाता खोलें",
        "Deposit": "जमा",
        "Deposit Report": "जमा रिपोर्ट",
        "Current Status": "वर्तमान स्थिति",
        "New Status": "नई स्थिति",
        "Select new status": "नई स्थिति चुनें",
        "DUPLICATE": "डुप्लिकेट",
        "Did you print successfully ?": "क्या आपने सफलतापूर्वक प्रिंट किया?",
        "Print Type": "प्रिंट प्रकार",
        "Front page": "सामने का पृष्ठ",
        "Transaction page": "लेनदेन पृष्ठ",
        "Confirm print": "प्रिंट की पुष्टि करें",
        "No preview data available": "कोई पूर्वावलोकन डेटा उपलब्ध नहीं",
        "Previous Specimen": "पिछला नमूना",
        "New Specimen": "नया नमूना",
        "Photo": "फोटो",
        "Signature": "हस्ताक्षर",
        "Upload photo": "फोटो अपलोड करें",
        "Upload signature": "हस्ताक्षर अपलोड करें",
        "Profile": "प्रोफ़ाइल",
        "Withdrawn Details": "निकासी विवरण",
        "Select renewal type": "नवीनीकरण प्रकार चुनें",
        "Principal Value": "मूल राशि",
        "Maturity Value": "परिपक्वता मूल्य",
        "Operation Type": "संचालन प्रकार",
        "Mature": "परिपक्व",
        "Mature Date Exceeds": "परिपक्वता तिथि पार",
        "Your maturity date is": "आपकी परिपक्वता तिथि है",
        "Do you want bonus interest to this account ?": "क्या आप इस खाते पर बोनस ब्याज चाहते हैं?",
        "Payout Interest": "भुगतान ब्याज",
        "This Is a premature account, please enter payout interest.": "यह समयपूर्व खाता है, कृपया भुगतान ब्याज दर्ज करें।",
        "Select payout on": "भुगतान चुनें",
        "On fixed Deposit": "सावधि जमा पर",
        "On MIS Deposit": "एमआईएस जमा पर",
        "Select posting type": "पोस्टिंग प्रकार चुनें",
        "Single Account": "एकल खाता",
        "Bulk Account": "बल्क खाता",
        "Interest Details": "ब्याज विवरण",
        "Serial No.": "क्रम संख्या",
        "Name": "नाम",
        "Date": "तिथि",
        "No results.": "कोई परिणाम नहीं।",
        "Total": "कुल",
        "Processing interest calculation...": "ब्याज गणना प्रगति पर...",
        "Total Interest Amount": "कुल ब्याज राशि",
        "Confirm Posting": "पोस्टिंग की पुष्टि करें",
        "Do you want to post of personal Data?": "क्या आप डेटा पोस्ट करना चाहते हैं?",
        "Processing charge calculation...": "चार्ज गणना प्रगति पर...",
        "Total Charge Amount": "कुल चार्ज राशि",
        "Branch": "शाखा",
        "Address": "पता",
        "Scheme": "योजना",
        "Receipt No": "रसीद संख्या",
        "Particulars": "विवरण",
        "Fine Amount": "जुर्माना राशि",
        "Received Mode": "प्राप्ति मोड",
        "Received By": "प्राप्तकर्ता",
        "Printed On": "प्रिंट तिथि",
        "Cashier": "कैशियर",
        "E. & O.E.": "E. & O.E.",
        "Cash": "नकद",
        "From Date": "से तिथि",
        "To Date": "तक तिथि",
        "Product Type": "उत्पाद प्रकार",
        "Report Type": "रिपोर्ट प्रकार",
    },
    "bn": {
        "Change Account Status": "অ্যাকাউন্ট স্ট্যাটাস পরিবর্তন",
        "Certificate Print": "সার্টিফিকেট প্রিন্ট",
        "Passbook Print": "পাসবুক প্রিন্ট",
        "Upload Specimen": "নমুনা আপলোড",
        "Withdrawn": "উত্তোলন",
        "Issue Cheque": "চেক ইস্যু",
        "Renewal": "নবীকরণ",
        "Close / Mature": "বন্ধ / মেয়াদপূর্তি",
        "Interest Payout": "সুদ পেআউট",
        "Interest Posting": "সুদ পোস্টিং",
        "Generate Savings Interest": "সঞ্চয় সুদ তৈরি করুন",
        "Charge Deduction": "চার্জ কর্তন",
        "Deposit Receipt": "ডিপোজিট রসিদ",
        "Open Deposit Account": "ডিপোজিট অ্যাকাউন্ট খুলুন",
        "Deposit": "ডিপোজিট",
        "Deposit Report": "ডিপোজিট রিপোর্ট",
        "Current Status": "বর্তমান স্থিতি",
        "New Status": "নতুন স্থিতি",
        "Select new status": "নতুন স্থিতি নির্বাচন করুন",
        "Previous Specimen": "পূর্ববর্তী নমুনা",
        "New Specimen": "নতুন নমুনা",
        "Photo": "ছবি",
        "Signature": "স্বাক্ষর",
        "Upload photo": "ছবি আপলোড করুন",
        "Upload signature": "স্বাক্ষর আপলোড করুন",
        "Profile": "প্রোফাইল",
        "Withdrawn Details": "উত্তোলনের বিবরণ",
        "Close": "বন্ধ",
        "Mature": "মেয়াদপূর্তি",
        "Total": "মোট",
        "Cash": "নগদ",
        "From Date": "শুরুর তারিখ",
        "To Date": "শেষ তারিখ",
        "Product Type": "পণ্যের ধরন",
        "Report Type": "রিপোর্টের ধরন",
        "Branch": "শাখা",
        "Serial No.": "ক্রমিক নং",
        "Name": "নাম",
        "Date": "তারিখ",
        "No results.": "কোনো ফলাফল নেই।",
        "Confirm Posting": "পোস্টিং নিশ্চিত করুন",
        "Do you want to post of personal Data?": "আপনি কি ডেটা পোস্ট করতে চান?",
        "Total Interest Amount": "মোট সুদের পরিমাণ",
        "Total Charge Amount": "মোট চার্জ পরিমাণ",
        "Processing interest calculation...": "সুদ গণনা চলছে...",
        "Processing charge calculation...": "চার্জ গণনা চলছে...",
    },
    "or": {
        "Change Account Status": "ଖାତା ସ୍ଥିତି ବଦଳାନ୍ତୁ",
        "Certificate Print": "ପ୍ରମାଣପତ୍ର ପ୍ରିଣ୍ଟ",
        "Passbook Print": "ପାସବୁକ୍ ପ୍ରିଣ୍ଟ",
        "Upload Specimen": "ନମୁନା ଅପଲୋଡ୍",
        "Withdrawn": "ଉଠାଣ",
        "Issue Cheque": "ଚେକ୍ ଜାରି କରନ୍ତୁ",
        "Renewal": "ନବୀକରଣ",
        "Close / Mature": "ବନ୍ଦ / ପରିପକ୍ୱ",
        "Interest Payout": "ସୁଧ ପେଆଉଟ୍",
        "Interest Posting": "ସୁଧ ପୋଷ୍ଟିଂ",
        "Generate Savings Interest": "ସଞ୍ଚୟ ସୁଧ ତିଆରି କରନ୍ତୁ",
        "Charge Deduction": "ଚାର୍ଜ କଟତି",
        "Deposit Receipt": "ଜମା ରସିଦ",
        "Open Deposit Account": "ଜମା ଖାତା ଖୋଲନ୍ତୁ",
        "Deposit": "ଜମା",
        "Deposit Report": "ଜମା ରିପୋର୍ଟ",
        "Current Status": "ବର୍ତ୍ତମାନ ସ୍ଥିତି",
        "New Status": "ନୂଆ ସ୍ଥିତି",
        "Select new status": "ନୂଆ ସ୍ଥିତି ଚୟନ କରନ୍ତୁ",
        "Previous Specimen": "ପୂର୍ବ ନମୁନା",
        "New Specimen": "ନୂଆ ନମୁନା",
        "Photo": "ଫଟୋ",
        "Signature": "ହସ୍ତାକ୍ଷର",
        "Upload photo": "ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ",
        "Upload signature": "ହସ୍ତାକ୍ଷର ଅପଲୋଡ୍ କରନ୍ତୁ",
        "Profile": "ପ୍ରୋଫାଇଲ୍",
        "Withdrawn Details": "ଉଠାଣ ବିବରଣୀ",
        "Close": "ବନ୍ଦ",
        "Mature": "ପରିପକ୍ୱ",
        "Total": "ମୋଟ",
        "Cash": "ନଗଦ",
        "From Date": "ଠାରୁ ତାରିଖ",
        "To Date": "ପର୍ଯ୍ୟନ୍ତ ତାରିଖ",
        "Product Type": "ଉତ୍ପାଦ ପ୍ରକାର",
        "Report Type": "ରିପୋର୍ଟ ପ୍ରକାର",
        "Branch": "ଶାଖା",
        "Serial No.": "କ୍ରମିକ ସଂଖ୍ୟା",
        "Name": "ନାମ",
        "Date": "ତାରିଖ",
        "No results.": "କୌଣସି ଫଳାଫଳ ନାହିଁ।",
        "Confirm Posting": "ପୋଷ୍ଟିଂ ନିଶ୍ଚିତ କରନ୍ତୁ",
        "Do you want to post of personal Data?": "ଆପଣ ତଥ୍ୟ ପୋଷ୍ଟ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
        "Total Interest Amount": "ମୋଟ ସୁଧ ରାଶି",
        "Total Charge Amount": "ମୋଟ ଚାର୍ଜ ରାଶି",
        "Processing interest calculation...": "ସୁଧ ଗଣନା ଚାଲିଛି...",
        "Processing charge calculation...": "ଚାର୍ଜ ଗଣନା ଚାଲିଛି...",
    },
}


def apply_map(block: str, mapping: dict) -> str:
    def repl(m):
        raw = m.group(0)
        try:
            s = json.loads(raw)
        except Exception:
            return raw
        if s in mapping:
            return json.dumps(mapping[s], ensure_ascii=False)
        return raw

    return re.sub(r'"(?:\\.|[^"\\])*"', repl, block)


def main():
    en_full = inject_extras(EN_BLOCK, EXTRAS_EN)
    # also merge fieldsExtra into fields in a post-step via string insert
    # Insert fieldsExtra keys into fields section
    for k, v in EXTRAS_EN["fieldsExtra"].items():
        needle = 'roi: "ROI",'
        if needle in en_full and f"{k}:" not in en_full.split("fields:")[1].split("placeholders:")[0]:
            en_full = en_full.replace(
                needle,
                needle + f'\n    {k}: {json.dumps(v)},',
                1,
            )

    hi_map = pairs_from_partial(EN_BLOCK, HI_BLOCK)
    hi_map.update(FEATURE_TR["hi"])
    bn_map = pairs_from_partial(EN_BLOCK, BN_BLOCK)
    bn_map.update(FEATURE_TR["bn"])
    or_map = pairs_from_partial(EN_BLOCK, OR_BLOCK)
    or_map.update(FEATURE_TR["or"])

    blocks = {
        "en": en_full,
        "hi": apply_map(en_full, hi_map),
        "bn": apply_map(en_full, bn_map),
        "or": apply_map(en_full, or_map),
    }

    for lang, block in blocks.items():
        path = LOC / f"{lang}.js"
        text = path.read_text(encoding="utf-8")
        if "\n    deposit: {" in text and "changeAccountStatus:" in text:
            print("skip existing deposit", lang)
            continue
        # remove incomplete deposit if any (only membership deposit tab etc.)
        insert = "    deposit: " + block + ",\n\n"
        # format indent: block uses 2-space from text — reindent to 4-space children
        # The extracted block uses 2 spaces; wrap as-is under deposit with 4-space base by adding 2 spaces per line
        lines = block.splitlines()
        indented = []
        for i, line in enumerate(lines):
            if i == 0:
                indented.append(line)  # {
            else:
                indented.append("  " + line if line else line)
        insert = "    deposit: " + "\n".join(indented) + ",\n\n"
        needle = "    memberSearch:"
        if needle not in text:
            raise SystemExit(f"no memberSearch in {lang}")
        text = text.replace(needle, insert + needle, 1)
        path.write_text(text, encoding="utf-8")
        print("inserted deposit", lang)


if __name__ == "__main__":
    main()
