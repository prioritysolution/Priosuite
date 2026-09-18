# -*- coding: utf-8 -*-
"""Insert report.subLedger locales and wire subLedger components."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LOC = ROOT / "i18n" / "locales"
SL = ROOT / "components" / "report" / "subLedger"


def js_obj(d, indent=8):
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


SUB_LEDGER = {
    "en": {
        "subLedgerReport": "Sub Ledger Report",
        "subLedgerFromTo": "Sub Ledger From {{fromDate}} To {{toDate}}",
        "transDate": "Trans. Date",
        "print": {
            "slNo": "SL. NO.",
            "transDate": "TRANS. DATE",
            "voucherNo": "VOUCHER NO.",
            "narration": "NARRATION",
            "debit": "DEBIT",
            "credit": "CREDIT",
            "balance": "BALANCE",
        },
    },
    "hi": {
        "subLedgerReport": "सब लेजर रिपोर्ट",
        "subLedgerFromTo": "{{fromDate}} से {{toDate}} तक सब लेजर",
        "transDate": "लेनदेन दिनांक",
        "print": {
            "slNo": "क्रमांक",
            "transDate": "लेनदेन दिनांक",
            "voucherNo": "वाउचर संख्या",
            "narration": "विवरण",
            "debit": "डेबिट",
            "credit": "क्रेडिट",
            "balance": "शेष",
        },
    },
    "bn": {
        "subLedgerReport": "সাব লেজার রিপোর্ট",
        "subLedgerFromTo": "{{fromDate}} থেকে {{toDate}} পর্যন্ত সাব লেজার",
        "transDate": "লেনদেনের তারিখ",
        "print": {
            "slNo": "ক্রমিক নং",
            "transDate": "লেনদেনের তারিখ",
            "voucherNo": "ভাউচার নম্বর",
            "narration": "বিবরণ",
            "debit": "ডেবিট",
            "credit": "ক্রেডিট",
            "balance": "ব্যালেন্স",
        },
    },
    "or": {
        "subLedgerReport": "ସବ୍ ଲେଜର୍ ରିପୋର୍ଟ",
        "subLedgerFromTo": "{{fromDate}} ରୁ {{toDate}} ପର୍ଯ୍ୟନ୍ତ ସବ୍ ଲେଜର୍",
        "transDate": "କାରବାର ତାରିଖ",
        "print": {
            "slNo": "କ୍ରମିକ ନମ୍ବର",
            "transDate": "କାରବାର ତାରିଖ",
            "voucherNo": "ଭାଉଚର୍ ନମ୍ବର",
            "narration": "ବିବରଣୀ",
            "debit": "ଡେବିଟ୍",
            "credit": "କ୍ରେଡିଟ୍",
            "balance": "ବାଲାନ୍ସ",
        },
    },
}

COMMON_EXTRA = {
    "en": {"subLedger": "Sub Ledger"},
    "hi": {"subLedger": "सब लेजर"},
    "bn": {"subLedger": "সাব লেজার"},
    "or": {"subLedger": "ସବ୍ ଲେଜର୍"},
}


def add_to_bank_common(text: str, extras: dict) -> str:
    bank = text.find("\n    bank: {")
    if bank < 0:
        raise SystemExit("bank: not found")
    common_start = text.rfind("\n    common: {", 0, bank)
    if common_start < 0:
        raise SystemExit("bank-era common not found")
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


def insert_after_block(text: str, block_name: str, new_block: str) -> str:
    m = re.search(rf"(\n      {re.escape(block_name)}:\s*\{{)", text)
    if not m:
        raise SystemExit(f"{block_name} not found")
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

    if re.search(r"\n      subLedger:\s*\{", text):
        # only match under report (6-space indent under report)
        print(f"{lang}: checking report.subLedger...")
    # report blocks use 6 spaces: "      subLedger:"
    if re.search(r"\n      subLedger:\s*\{", text) and "subLedgerFromTo" in text:
        print(f"{lang}: report.subLedger already present")
    else:
        block = (
            "      subLedger: {\n"
            + js_obj(SUB_LEDGER[lang], indent=8)
            + "\n      },"
        )
        for anchor in (
            "balanceSheet",
            "plAppropiation",
            "profitLoss",
            "trialBalance",
            "accountLedger",
            "balancing",
            "userScroll",
            "cashAccount",
            "cashbook",
            "daybook",
        ):
            if re.search(rf"\n      {anchor}:\s*\{{", text):
                text = insert_after_block(text, anchor, block)
                print(f"{lang}: inserted after {anchor}")
                break
        else:
            raise SystemExit(f"{lang}: no anchor")

    text2 = add_to_bank_common(text, COMMON_EXTRA[lang])
    if text2 != text:
        print(f"{lang}: merged common.subLedger")
        text = text2
    else:
        print(f"{lang}: common ok")

    text = text.replace(",,", ",")
    path.write_text(text, encoding="utf-8")


def wire_index():
    p = SL / "index.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            '"use client";\n',
            '"use client";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "}) => {\n  const [showReportForm, setShowReportForm] = useState(true);",
            "}) => {\n  const { t } = useTranslation();\n  const [showReportForm, setShowReportForm] = useState(true);",
            1,
        )

    repls = [
        (
            '<h3 className="text-xl font-semibold ">Sub Ledger Report</h3>',
            '<h3 className="text-xl font-semibold ">\n                  {t("report.subLedger.subLedgerReport")}\n                </h3>',
        ),
        ('label="From Date"', 'label={t("common.fromDate")}'),
        ('label="To Date"', 'label={t("common.toDate")}'),
        ('label="Branch"', 'label={t("common.branch")}'),
        ('placeholder="Select branch"', 'placeholder={t("common.selectBranch")}'),
        (
            'searchPlaceholder="Search branch..."',
            'searchPlaceholder={t("common.searchBranch")}',
        ),
        ('label="Sub Ledger"', 'label={t("common.subLedger")}'),
        (
            """                    <TableHead className=" text-white text-center w-16">
                      Sl
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      Trans. Date
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Voucher No.
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Narration
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Debit
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Credit
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      Balance
                    </TableHead>""",
            """                    <TableHead className=" text-white text-center w-16">
                      {t("common.sl")}
                    </TableHead>
                    <TableHead className=" text-white  border-l border-white text-center">
                      {t("report.subLedger.transDate")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.voucherNo")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.narration")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.debit")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.credit")}
                    </TableHead>
                    <TableHead className=" text-white border-l border-white text-center">
                      {t("common.balance")}
                    </TableHead>""",
        ),
        (
            """                      Total
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalDebit}
                    </TableCell>""",
            """                      {t("common.total")}
                    </TableCell>
                    <TableCell className="font-medium border border-secondary">
                      {totalDebit}
                    </TableCell>""",
        ),
        (
            """                <span className="font-semibold">Voucher Type :</span>{" "}""",
            """                <span className="font-semibold">
                  {t("voucher.voucherType")} :
                </span>{" "}""",
        ),
        (
            """                <span className="font-semibold">Voucher No. :</span>{" "}""",
            """                <span className="font-semibold">
                  {t("voucher.voucherNo")} :
                </span>{" "}""",
        ),
        (
            """                <span className="font-semibold">Ref. Vc. No :</span>{" "}""",
            """                <span className="font-semibold">
                  {t("voucher.refVcNo")} :
                </span>{" "}""",
        ),
        (
            """                <span className="font-semibold">Voucher Date :</span>{" "}""",
            """                <span className="font-semibold">
                  {t("common.voucherDate")} :
                </span>{" "}""",
        ),
        (
            """                    <TableHead className="w-[100px]">Sl.</TableHead>
                    <TableHead>Head Of Account</TableHead>
                    <TableHead>Dr. Amount</TableHead>
                    <TableHead>Cr. Amount</TableHead>""",
            """                    <TableHead className="w-[100px]">
                      {t("common.sl")}
                    </TableHead>
                    <TableHead>{t("common.headOfAccount")}</TableHead>
                    <TableHead>{t("common.drAmount")}</TableHead>
                    <TableHead>{t("common.crAmount")}</TableHead>""",
        ),
        (
            """                    <TableCell colSpan={2}>Total</TableCell>""",
            """                    <TableCell colSpan={2}>{t("common.total")}</TableCell>""",
        ),
        (
            """              <span className="font-semibold">Narration : </span>""",
            """              <span className="font-semibold">
                {t("common.narration")} :{" "}
              </span>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("INDEX MISSING:", repr(old[:100]))
        else:
            n = t.count(old)
            t = t.replace(old, new)
            print(f"INDEX OK x{n}:", old[:55].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("index done")


def wire_preview():
    p = SL / "PreviewModal.jsx"
    t = p.read_text(encoding="utf-8")

    if "react-i18next" not in t:
        t = t.replace(
            'import { formatDate } from "date-fns";\n',
            'import { formatDate } from "date-fns";\nimport { useTranslation } from "react-i18next";\n',
            1,
        )
    if "const { t } = useTranslation()" not in t:
        t = t.replace(
            "  subLedgerId,\n}) => {\n  const [userName, setUserName] = useState(\"\");",
            "  subLedgerId,\n}) => {\n  const { t } = useTranslation();\n\n  const [userName, setUserName] = useState(\"\");",
            1,
        )

    repls = [
        (
            """            <p className="text-sm">
              Sub Ledger From {fromDate} To {toDate}
            </p>""",
            """            <p className="text-sm">
              {t("report.subLedger.subLedgerFromTo", {
                fromDate,
                toDate,
              })}
            </p>""",
        ),
        (
            """                  <TableHead className="text-black p-0 border-black text-center w-[40px]">
                    SL. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    TRANS. DATE
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    VOUCHER NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">
                    NARRATION
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    DEBIT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    CREDIT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    BALANCE
                  </TableHead>""",
            """                  <TableHead className="text-black p-0 border-black text-center w-[40px]">
                    {t("report.subLedger.print.slNo")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.subLedger.print.transDate")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.subLedger.print.voucherNo")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">
                    {t("report.subLedger.print.narration")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.subLedger.print.debit")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("report.subLedger.print.credit")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    {t("report.subLedger.print.balance")}
                  </TableHead>""",
        ),
        (
            """                      Total
                    </TableCell>""",
            """                      {t("common.total")}
                    </TableCell>""",
        ),
        (
            """            <p className="text-nowrap">Generated By: {userName}</p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
              This report is generated by PrioSuite.
            </p>
            <p className="text-nowrap">
              Generated On: {currentDate} {currentTime}
            </p>""",
            """            <p className="text-nowrap">
              {t("common.generatedBy")}: {userName}
            </p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
              {t("common.thisReportIsGeneratedByPrioSuite")}
            </p>
            <p className="text-nowrap">
              {t("common.generatedOn")}: {currentDate} {currentTime}
            </p>""",
        ),
    ]

    for old, new in repls:
        if old not in t:
            print("PREVIEW MISSING:", repr(old[:100]))
        else:
            t = t.replace(old, new)
            print("PREVIEW OK:", old[:55].replace("\n", " "))

    p.write_text(t, encoding="utf-8")
    print("preview done")


def main():
    for lang in ("en", "hi", "bn", "or"):
        insert_lang(lang)
    wire_index()
    wire_preview()


if __name__ == "__main__":
    main()
