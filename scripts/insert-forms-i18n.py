# -*- coding: utf-8 -*-
"""Insert forms i18n keys and wire common/forms (static UI only)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
FORMS = ROOT / "common" / "forms"

EN = {
    "next": "Next",
    "search": "Search",
    "previous": "Previous",
    "product": "Product",
    "selectProduct": "Select Product",
    "accountNo": "Account No.",
    "enterAccountNo": "Enter account no.",
    "memberNo": "Member No.",
    "name": "Name",
    "searchAccount": "Search Account",
    "byMemberNo": "By Member No.",
    "byName": "By Name",
    "byMemberName": "By Member Name",
    "searchByMemberNo": "Search by enter member no.",
    "searchByName": "Search by enter name",
    "pleaseEnterMemberNo": "Please enter member no.",
    "pleaseEnterName": "Please enter name",
    "searchLedger": "Search Ledger",
    "searchLedgerAria": "Search ledger",
    "selectType": "Select Type",
    "selectTypePh": "Select type",
    "searchType": "Search type...",
    "selectMainHead": "Select Main Head",
    "selectMainHeadPh": "Select main head",
    "searchMainHead": "Search main head...",
    "selectSubHead": "Select Sub Head",
    "selectSubHeadPh": "Select sub head",
    "searchSubHead": "Search sub head...",
    "keyword": "Keyword",
    "enterKeyword": "Enter keyword",
    "sl": "Sl",
    "categoryName": "Category Name",
    "mainHead": "Main Head",
    "subHead": "Sub Head",
    "ledgerName": "Ledger Name",
    "noResults": "No results.",
}

HI = {
    **EN,
    "next": "आगे",
    "search": "खोजें",
    "previous": "पिछला",
    "product": "उत्पाद",
    "selectProduct": "उत्पाद चुनें",
    "accountNo": "खाता संख्या",
    "enterAccountNo": "खाता संख्या दर्ज करें",
    "memberNo": "सदस्य संख्या",
    "name": "नाम",
    "searchAccount": "खाता खोजें",
    "byMemberNo": "सदस्य संख्या से",
    "byName": "नाम से",
    "byMemberName": "सदस्य नाम से",
    "searchByMemberNo": "सदस्य संख्या दर्ज कर खोजें",
    "searchByName": "नाम दर्ज कर खोजें",
    "pleaseEnterMemberNo": "कृपया सदस्य संख्या दर्ज करें",
    "pleaseEnterName": "कृपया नाम दर्ज करें",
    "searchLedger": "लेजर खोजें",
    "searchLedgerAria": "लेजर खोजें",
    "selectType": "प्रकार चुनें",
    "selectTypePh": "प्रकार चुनें",
    "searchType": "प्रकार खोजें...",
    "selectMainHead": "मुख्य हेड चुनें",
    "selectMainHeadPh": "मुख्य हेड चुनें",
    "searchMainHead": "मुख्य हेड खोजें...",
    "selectSubHead": "उप हेड चुनें",
    "selectSubHeadPh": "उप हेड चुनें",
    "searchSubHead": "उप हेड खोजें...",
    "keyword": "कीवर्ड",
    "enterKeyword": "कीवर्ड दर्ज करें",
    "sl": "क्र.",
    "categoryName": "श्रेणी का नाम",
    "mainHead": "मुख्य हेड",
    "subHead": "उप हेड",
    "ledgerName": "लेजर नाम",
    "noResults": "कोई परिणाम नहीं।",
}

BN = {
    **EN,
    "next": "পরবর্তী",
    "search": "খুঁজুন",
    "previous": "পূর্ববর্তী",
    "product": "পণ্য",
    "selectProduct": "পণ্য নির্বাচন করুন",
    "accountNo": "অ্যাকাউন্ট নং",
    "enterAccountNo": "অ্যাকাউন্ট নং লিখুন",
    "memberNo": "সদস্য নং",
    "name": "নাম",
    "searchAccount": "অ্যাকাউন্ট খুঁজুন",
    "byMemberNo": "সদস্য নং দিয়ে",
    "byName": "নাম দিয়ে",
    "byMemberName": "সদস্যের নাম দিয়ে",
    "searchByMemberNo": "সদস্য নং দিয়ে খুঁজুন",
    "searchByName": "নাম দিয়ে খুঁজুন",
    "pleaseEnterMemberNo": "অনুগ্রহ করে সদস্য নং লিখুন",
    "pleaseEnterName": "অনুগ্রহ করে নাম লিখুন",
    "searchLedger": "লেজার খুঁজুন",
    "searchLedgerAria": "লেজার খুঁজুন",
    "selectType": "ধরন নির্বাচন করুন",
    "selectTypePh": "ধরন নির্বাচন করুন",
    "searchType": "ধরন খুঁজুন...",
    "selectMainHead": "মেইন হেড নির্বাচন করুন",
    "selectMainHeadPh": "মেইন হেড নির্বাচন করুন",
    "searchMainHead": "মেইন হেড খুঁজুন...",
    "selectSubHead": "সাব হেড নির্বাচন করুন",
    "selectSubHeadPh": "সাব হেড নির্বাচন করুন",
    "searchSubHead": "সাব হেড খুঁজুন...",
    "keyword": "কীওয়ার্ড",
    "enterKeyword": "কীওয়ার্ড লিখুন",
    "sl": "ক্র.",
    "categoryName": "ক্যাটাগরির নাম",
    "mainHead": "মেইন হেড",
    "subHead": "সাব হেড",
    "ledgerName": "লেজারের নাম",
    "noResults": "কোনো ফলাফল নেই।",
}

OR_ = {
    **EN,
    "next": "ପରବର୍ତ୍ତୀ",
    "search": "ଖୋଜନ୍ତୁ",
    "previous": "ପୂର୍ବ",
    "product": "ଉତ୍ପାଦ",
    "selectProduct": "ଉତ୍ପାଦ ବାଛନ୍ତୁ",
    "accountNo": "ଖାତା ନଂ",
    "enterAccountNo": "ଖାତା ନଂ ଲେଖନ୍ତୁ",
    "memberNo": "ସଦସ୍ୟ ନଂ",
    "name": "ନାମ",
    "searchAccount": "ଖାତା ଖୋଜନ୍ତୁ",
    "byMemberNo": "ସଦସ୍ୟ ନଂ ଦ୍ୱାରା",
    "byName": "ନାମ ଦ୍ୱାରା",
    "byMemberName": "ସଦସ୍ୟ ନାମ ଦ୍ୱାରା",
    "searchByMemberNo": "ସଦସ୍ୟ ନଂ ଲେଖି ଖୋଜନ୍ତୁ",
    "searchByName": "ନାମ ଲେଖି ଖୋଜନ୍ତୁ",
    "pleaseEnterMemberNo": "ଦୟାକରି ସଦସ୍ୟ ନଂ ଲେଖନ୍ତୁ",
    "pleaseEnterName": "ଦୟାକରି ନାମ ଲେଖନ୍ତୁ",
    "searchLedger": "ଲେଜର୍ ଖୋଜନ୍ତୁ",
    "searchLedgerAria": "ଲେଜର୍ ଖୋଜନ୍ତୁ",
    "selectType": "ପ୍ରକାର ବାଛନ୍ତୁ",
    "selectTypePh": "ପ୍ରକାର ବାଛନ୍ତୁ",
    "searchType": "ପ୍ରକାର ଖୋଜନ୍ତୁ...",
    "selectMainHead": "ମୁଖ୍ୟ ହେଡ୍ ବାଛନ୍ତୁ",
    "selectMainHeadPh": "ମୁଖ୍ୟ ହେଡ୍ ବାଛନ୍ତୁ",
    "searchMainHead": "ମୁଖ୍ୟ ହେଡ୍ ଖୋଜନ୍ତୁ...",
    "selectSubHead": "ସବ୍ ହେଡ୍ ବାଛନ୍ତୁ",
    "selectSubHeadPh": "ସବ୍ ହେଡ୍ ବାଛନ୍ତୁ",
    "searchSubHead": "ସବ୍ ହେଡ୍ ଖୋଜନ୍ତୁ...",
    "keyword": "କୀୱର୍ଡ",
    "enterKeyword": "କୀୱର୍ଡ ଲେଖନ୍ତୁ",
    "sl": "କ୍ର.",
    "categoryName": "ବର୍ଗ ନାମ",
    "mainHead": "ମୁଖ୍ୟ ହେଡ୍",
    "subHead": "ସବ୍ ହେଡ୍",
    "ledgerName": "ଲେଜର୍ ନାମ",
    "noResults": "କୌଣସି ଫଳାଫଳ ନାହିଁ।",
}

LOCALES = {"en": EN, "hi": HI, "bn": BN, "or": OR_}

MS_PLEASE = {
    "en": "Please enter name",
    "hi": "कृपया नाम दर्ज करें",
    "bn": "অনুগ্রহ করে নাম লিখুন",
    "or": "ଦୟାକରି ନାମ ଲେଖନ୍ତୁ",
}


def js_obj(d, indent=6):
    pad = " " * indent
    items = list(d.items())
    lines = []
    for i, (k, v) in enumerate(items):
        comma = "," if i < len(items) - 1 else ""
        esc = str(v).replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'{pad}{k}: "{esc}"{comma}')
    return "\n".join(lines)


def find_block_end(text, start_brace_idx):
    depth = 0
    i = start_brace_idx
    while i < len(text):
        ch = text[i]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise SystemExit("unclosed block")


def insert_forms(lang):
    path = LOC / f"{lang}.js"
    text = path.read_text(encoding="utf-8")

    # ensure memberSearch.pleaseEnterName
    m = re.search(r"\n    memberSearch:\s*\{", text)
    if not m:
        raise SystemExit(f"{lang}: no memberSearch")
    brace = m.end() - 1
    end = find_block_end(text, brace)
    block = text[m.start() : end + 1]
    if "pleaseEnterName:" not in block:
        # insert before closing
        ins = f',\n      pleaseEnterName: "{MS_PLEASE[lang]}"'
        text = text[:end] + ins + text[end:]
        print(f"{lang}: added memberSearch.pleaseEnterName")
    else:
        print(f"{lang}: memberSearch.pleaseEnterName ok")

    if re.search(r"\n    forms:\s*\{", text):
        print(f"{lang}: forms already present")
        path.write_text(text, encoding="utf-8")
        return

    # insert forms after memberSearch block
    m = re.search(r"\n    memberSearch:\s*\{", text)
    brace = m.end() - 1
    end = find_block_end(text, brace)
    j = end + 1
    if j < len(text) and text[j] == ",":
        j += 1
    block = "\n    forms: {\n" + js_obj(LOCALES[lang], indent=6) + "\n    },"
    text = text[:j] + block + text[j:]
    path.write_text(text, encoding="utf-8")
    print(f"{lang}: inserted forms")


def ensure_t_import(text):
    if "useTranslation" in text:
        return text
    if text.startswith('"use client"'):
        return text.replace(
            '"use client";\n',
            '"use client";\n\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    return 'import { useTranslation } from "react-i18next";\n' + text


def patch(path: Path, repls):
    text = path.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    for old, new in repls:
        if old not in text:
            print(f"  MISS {path.name}: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK {path.name}: {old[:50]!r}")
    path.write_text(text, encoding="utf-8")


def wire_member_search():
    p = FORMS / "MemberSearchForm.jsx"
    patch(
        p,
        [
            (
                'toast.error("Please enter name");',
                'toast.error(t("memberSearch.pleaseEnterName"));',
            ),
            (
                "label={label}",
                'label={label === "Date" ? t("common.date") : label}',
            ),
        ],
    )


def wire_member_passbook():
    p = FORMS / "MemberPassbookSearchForm.jsx"
    text = p.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const dispatch = useDispatch();",
            "}) => {\n  const { t } = useTranslation();\n  const dispatch = useDispatch();",
        )
    repls = [
        ('toast.error("Please enter name");', 'toast.error(t("memberSearch.pleaseEnterName"));'),
        ("CIF/REF No.", '{t("memberSearch.cifRefNo")}'),
        ('placeholder="Enter member no."', 'placeholder={t("memberSearch.memberNoPlaceholder")}'),
        ("Search Members", '{t("memberSearch.searchMembers")}'),
        ("Member Name", '{t("memberSearch.memberName")}'),
        (
            'placeholder="Search by enter member name"',
            'placeholder={t("memberSearch.searchByMemberName")}',
        ),
        (">\n              Search\n            </Button>", '>\n              {t("memberSearch.search")}\n            </Button>'),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS {p.name}: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK {p.name}: {old[:50]!r}")
    # fix FormLabel wrapping for CIF - was text content
    text = text.replace(
        '<FormLabel className="text-sm font-medium text-muted-foreground">\n              {t("memberSearch.cifRefNo")}\n            </FormLabel>',
        '<FormLabel className="text-sm font-medium text-muted-foreground">\n              {t("memberSearch.cifRefNo")}\n            </FormLabel>',
    )
    # DialogTitle and FormLabel may have broken JSX if we only replaced inner text wrongly
    # CIF was: >\n              CIF/REF No.\n            <  -> >\n              {t(...)}\n            <  OK
    # Search Members in DialogTitle similarly OK
    # Member Name in FormLabel OK
    p.write_text(text, encoding="utf-8")


def wire_account_search():
    p = FORMS / "AccountSearchForm.jsx"
    text = p.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text.split("const AccountSearchForm")[1][:400]:
        text = text.replace(
            "}) => {\n  const startDate = getCookieData(\"fin_start_date\");",
            "}) => {\n  const { t } = useTranslation();\n  const startDate = getCookieData(\"fin_start_date\");",
        )
    repls = [
        ('toast.error("Please enter member no.");', 'toast.error(t("forms.pleaseEnterMemberNo"));'),
        ('toast.error("Please enter name");', 'toast.error(t("forms.pleaseEnterName"));'),
        ('label="Product"', 'label={t("forms.product")}'),
        ('placeholder="Select Product"', 'placeholder={t("forms.selectProduct")}'),
        ('label="Date"', 'label={t("common.date")}'),
        ("Account No.", '{t("forms.accountNo")}'),
        ('placeholder="Enter account no."', 'placeholder={t("forms.enterAccountNo")}'),
        (
            """) : (
                    "Next"
                  )}""",
            """) : (
                    t("forms.next")
                  )}""",
        ),
        ("View Ledger", '{t("common.viewLedger")}'),
        ("Search Account", '{t("forms.searchAccount")}'),
        ("By Member No.", '{t("forms.byMemberNo")}'),
        ("By Name", '{t("forms.byName")}'),
        ("Member No.", '{t("forms.memberNo")}'),
        ('placeholder="Search by enter member no."', 'placeholder={t("forms.searchByMemberNo")}'),
        (">\n                        Search\n                      </Button>", '>\n                        {t("forms.search")}\n                      </Button>'),
        ("<FormLabel>Name</FormLabel>", '<FormLabel>{t("forms.name")}</FormLabel>'),
        ('placeholder="Search by enter name"', 'placeholder={t("forms.searchByName")}'),
    ]
    # second Search button
    for old, new in repls:
        count = text.count(old)
        if count == 0:
            print(f"  MISS {p.name}: {old[:70]!r}")
        else:
            text = text.replace(old, new)  # all occurrences for Search button / shared
            print(f"  OK {p.name} x{count}: {old[:40]!r}")
    p.write_text(text, encoding="utf-8")


def wire_account_passbook():
    p = FORMS / "AccountPassbookSearchForm.jsx"
    text = p.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const dispatch = useDispatch();",
            "}) => {\n  const { t } = useTranslation();\n  const dispatch = useDispatch();",
        )
    repls = [
        ('toast.error("Please enter member no.");', 'toast.error(t("forms.pleaseEnterMemberNo"));'),
        ('toast.error("Please enter name");', 'toast.error(t("forms.pleaseEnterName"));'),
        ('label="Account No."', 'label={t("forms.accountNo")}'),
        ('placeholder="Enter account no."', 'placeholder={t("forms.enterAccountNo")}'),
        ("Search Account", '{t("forms.searchAccount")}'),
        ("By Member No.", '{t("forms.byMemberNo")}'),
        ("By Name", '{t("forms.byName")}'),
        ('label="Member No."', 'label={t("forms.memberNo")}'),
        ('placeholder="Search by enter member no."', 'placeholder={t("forms.searchByMemberNo")}'),
        (">\n                      Search\n                    </Button>", '>\n                      {t("forms.search")}\n                    </Button>'),
        ('label="Name"', 'label={t("forms.name")}'),
        ('placeholder="Search by enter name"', 'placeholder={t("forms.searchByName")}'),
    ]
    for old, new in repls:
        count = text.count(old)
        if count == 0:
            print(f"  MISS {p.name}: {old[:70]!r}")
        else:
            text = text.replace(old, new)
            print(f"  OK {p.name} x{count}: {old[:40]!r}")
    p.write_text(text, encoding="utf-8")


def wire_loan_account():
    p = FORMS / "LoanAccountSearchForm.jsx"
    text = p.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const dispatch = useDispatch();",
            "}) => {\n  const { t } = useTranslation();\n  const dispatch = useDispatch();",
        )
    repls = [
        ('toast.error("Please enter member no.");', 'toast.error(t("forms.pleaseEnterMemberNo"));'),
        ('toast.error("Please enter name");', 'toast.error(t("forms.pleaseEnterName"));'),
        ('label="Date"', 'label={t("common.date")}'),
        ("Account No.", '{t("forms.accountNo")}'),
        ('placeholder="Enter account no."', 'placeholder={t("forms.enterAccountNo")}'),
        ("{buttonLabel}", '{buttonLabel === "Next" ? t("forms.next") : buttonLabel}'),
        ("{printButtonLabel}", '{printButtonLabel === "Print" ? t("common.print") : printButtonLabel}'),
        ("View Ledger", '{t("common.viewLedger")}'),
        ("Search Account", '{t("forms.searchAccount")}'),
        ("By Member No.", '{t("forms.byMemberNo")}'),
        ("By Member Name", '{t("forms.byMemberName")}'),
        ("Member No.", '{t("forms.memberNo")}'),
        ('placeholder="Search by enter member no."', 'placeholder={t("forms.searchByMemberNo")}'),
        (">\n                        Search\n                      </Button>", '>\n                        {t("forms.search")}\n                      </Button>'),
        ("<FormLabel>Name</FormLabel>", '<FormLabel>{t("forms.name")}</FormLabel>'),
        ('placeholder="Search by enter name"', 'placeholder={t("forms.searchByName")}'),
    ]
    for old, new in repls:
        count = text.count(old)
        if count == 0:
            print(f"  MISS {p.name}: {old[:70]!r}")
        else:
            text = text.replace(old, new)
            print(f"  OK {p.name} x{count}: {old[:40]!r}")
    p.write_text(text, encoding="utf-8")


def wire_loan_passbook():
    p = FORMS / "LoanAccountPassbookSearchForm.jsx"
    text = p.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            "}) => {\n  const dispatch = useDispatch();",
            "}) => {\n  const { t } = useTranslation();\n  const dispatch = useDispatch();",
        )
    repls = [
        ('toast.error("Please enter member no.");', 'toast.error(t("forms.pleaseEnterMemberNo"));'),
        ('toast.error("Please enter name");', 'toast.error(t("forms.pleaseEnterName"));'),
        ("Account No.", '{t("forms.accountNo")}'),
        ('placeholder="Enter account no."', 'placeholder={t("forms.enterAccountNo")}'),
        ("Search Account", '{t("forms.searchAccount")}'),
        ("By Member No.", '{t("forms.byMemberNo")}'),
        ("By Name", '{t("forms.byName")}'),
        ("Member No.", '{t("forms.memberNo")}'),
        ('placeholder="Search by enter member no."', 'placeholder={t("forms.searchByMemberNo")}'),
        (">\n                        Search\n                      </Button>", '>\n                        {t("forms.search")}\n                      </Button>'),
        ("<FormLabel>Name</FormLabel>", '<FormLabel>{t("forms.name")}</FormLabel>'),
        ('placeholder="Search by enter name"', 'placeholder={t("forms.searchByName")}'),
    ]
    for old, new in repls:
        count = text.count(old)
        if count == 0:
            print(f"  MISS {p.name}: {old[:70]!r}")
        else:
            text = text.replace(old, new)
            print(f"  OK {p.name} x{count}: {old[:40]!r}")
    p.write_text(text, encoding="utf-8")


def wire_ledger():
    p = FORMS / "LedgerSearchForm.jsx"
    text = p.read_text(encoding="utf-8")
    text = ensure_t_import(text)
    if "const { t } = useTranslation();" not in text:
        text = text.replace(
            'const LedgerSearchForm = ({ form, fieldName = "ledgerCode" }) => {\n  const [dialougeOpen, setDialougeOpen] = useState(false);',
            'const LedgerSearchForm = ({ form, fieldName = "ledgerCode" }) => {\n  const { t } = useTranslation();\n  const [dialougeOpen, setDialougeOpen] = useState(false);',
        )
    repls = [
        ('aria-label="Search ledger"', 'aria-label={t("forms.searchLedgerAria")}'),
        ("Search Ledger", '{t("forms.searchLedger")}'),
        ('label="Select Type"', 'label={t("forms.selectType")}'),
        ('placeholder="Select type"', 'placeholder={t("forms.selectTypePh")}'),
        ('searchPlaceholder="Search type..."', 'searchPlaceholder={t("forms.searchType")}'),
        ('label="Select Main Head"', 'label={t("forms.selectMainHead")}'),
        ('placeholder="Select main head"', 'placeholder={t("forms.selectMainHeadPh")}'),
        ('searchPlaceholder="Search main head..."', 'searchPlaceholder={t("forms.searchMainHead")}'),
        ('label="Select Sub Head"', 'label={t("forms.selectSubHead")}'),
        ('placeholder="Select sub head"', 'placeholder={t("forms.selectSubHeadPh")}'),
        ('searchPlaceholder="Search sub head..."', 'searchPlaceholder={t("forms.searchSubHead")}'),
        ('label="Keyword"', 'label={t("forms.keyword")}'),
        ('placeholder="Enter keyword"', 'placeholder={t("forms.enterKeyword")}'),
        (
            """) : (
                    "Search"
                  )}""",
            """) : (
                    t("forms.search")
                  )}""",
        ),
        (
            """<TableHead className="w-[60px] whitespace-nowrap">
                        Sl
                      </TableHead>""",
            """<TableHead className="w-[60px] whitespace-nowrap">
                        {t("forms.sl")}
                      </TableHead>""",
        ),
        (
            """<TableHead className="whitespace-nowrap">
                        Category Name
                      </TableHead>""",
            """<TableHead className="whitespace-nowrap">
                        {t("forms.categoryName")}
                      </TableHead>""",
        ),
        (
            """<TableHead className="whitespace-nowrap">
                        Main Head
                      </TableHead>""",
            """<TableHead className="whitespace-nowrap">
                        {t("forms.mainHead")}
                      </TableHead>""",
        ),
        (
            """<TableHead className="whitespace-nowrap">
                        Sub Head
                      </TableHead>""",
            """<TableHead className="whitespace-nowrap">
                        {t("forms.subHead")}
                      </TableHead>""",
        ),
        (
            """<TableHead className="whitespace-nowrap">
                        Ledger Name
                      </TableHead>""",
            """<TableHead className="whitespace-nowrap">
                        {t("forms.ledgerName")}
                      </TableHead>""",
        ),
        ("No results.", '{t("forms.noResults")}'),
        (">\n                          Previous\n                        </Button>", '>\n                          {t("forms.previous")}\n                        </Button>'),
        (">\n                          Next\n                        </Button>", '>\n                          {t("forms.next")}\n                        </Button>'),
    ]
    for old, new in repls:
        if old not in text:
            print(f"  MISS {p.name}: {old[:70]!r}")
        else:
            text = text.replace(old, new, 1)
            print(f"  OK {p.name}: {old[:40]!r}")
    p.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    for lang in ("en", "hi", "bn", "or"):
        insert_forms(lang)
    print("--- wire ---")
    wire_member_search()
    wire_member_passbook()
    wire_account_search()
    wire_account_passbook()
    wire_loan_account()
    wire_loan_passbook()
    wire_ledger()
    print("done")
