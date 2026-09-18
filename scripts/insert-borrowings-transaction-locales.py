# -*- coding: utf-8 -*-
"""Add borrowings transaction keys + missing common keys."""
from pathlib import Path
import json
import re

LOC = Path(__file__).resolve().parents[1] / "i18n" / "locales"

BOR_EXTRA = {
    "en": {
        "transaction": "Transaction",
        "selectMode": "Select mode",
        "disburse": "Disburse",
        "repayment": "Repayment",
        "accountInfoBlock": "Account Info Block",
        "disburseDate": "Disburse Date",
        "enterDisburseDate": "Enter disburse date",
        "enterBalance": "Enter balance",
        "block": "Block",
        "principal": "Principal",
        "interestAmount": "Interest Amount",
        "enterInterestAmount": "Enter interest amount",
        "enterTotalAmount": "Enter total amount",
        "selectAccount": "Select account",
        "searchAccount": "Search account...",
        "operationBlock": "Operation Block",
    },
    "hi": {
        "transaction": "लेन-देन",
        "selectMode": "मोड चुनें",
        "disburse": "वितरण",
        "repayment": "भुगतान",
        "accountInfoBlock": "खाता जानकारी ब्लॉक",
        "disburseDate": "वितरण तारीख",
        "enterDisburseDate": "वितरण तारीख दर्ज करें",
        "enterBalance": "शेष राशि दर्ज करें",
        "block": "ब्लॉक",
        "principal": "मूलधन",
        "interestAmount": "ब्याज राशि",
        "enterInterestAmount": "ब्याज राशि दर्ज करें",
        "enterTotalAmount": "कुल राशि दर्ज करें",
        "selectAccount": "खाता चुनें",
        "searchAccount": "खाता खोजें...",
        "operationBlock": "ऑपरेशन ब्लॉक",
    },
    "bn": {
        "transaction": "লেনদেন",
        "selectMode": "মোড নির্বাচন করুন",
        "disburse": "বিতরণ",
        "repayment": "পরিশোধ",
        "accountInfoBlock": "অ্যাকাউন্ট তথ্য ব্লক",
        "disburseDate": "বিতরণের তারিখ",
        "enterDisburseDate": "বিতরণের তারিখ লিখুন",
        "enterBalance": "ব্যালেন্স লিখুন",
        "block": "ব্লক",
        "principal": "মূলধন",
        "interestAmount": "সুদের পরিমাণ",
        "enterInterestAmount": "সুদের পরিমাণ লিখুন",
        "enterTotalAmount": "মোট পরিমাণ লিখুন",
        "selectAccount": "অ্যাকাউন্ট নির্বাচন করুন",
        "searchAccount": "অ্যাকাউন্ট অনুসন্ধান করুন...",
        "operationBlock": "অপারেশন ব্লক",
    },
    "or": {
        "transaction": "କାରବାର",
        "selectMode": "ମୋଡ୍ ବାଛନ୍ତୁ",
        "disburse": "ବଣ୍ଟନ",
        "repayment": "ପରିଶୋଧ",
        "accountInfoBlock": "ଆକାଉଣ୍ଟ ସୂଚନା ବ୍ଲକ୍",
        "disburseDate": "ବଣ୍ଟନ ତାରିଖ",
        "enterDisburseDate": "ବଣ୍ଟନ ତାରିଖ ଦିଅନ୍ତୁ",
        "enterBalance": "ବାଲାନ୍ସ ଦିଅନ୍ତୁ",
        "block": "ବ୍ଲକ୍",
        "principal": "ମୂଳଧନ",
        "interestAmount": "ସୁଧ ରାଶି",
        "enterInterestAmount": "ସୁଧ ରାଶି ଦିଅନ୍ତୁ",
        "enterTotalAmount": "ମୋଟ ରାଶି ଦିଅନ୍ତୁ",
        "selectAccount": "ଆକାଉଣ୍ଟ ବାଛନ୍ତୁ",
        "searchAccount": "ଆକାଉଣ୍ଟ ଖୋଜନ୍ତୁ...",
        "operationBlock": "ଅପରେସନ୍ ବ୍ଲକ୍",
    },
}

COMMON_EXTRA = {
    "en": {
        "account": "Account",
        "dueDate": "Due Date",
        "balance": "Balance",
        "enter": "Enter",
        "totalAmount": "Total Amount",
        "selectTransactionMode": "Select transaction mode",
    },
    "hi": {
        "account": "खाता",
        "dueDate": "नियत तारीख",
        "balance": "शेष राशि",
        "enter": "दर्ज करें",
        "totalAmount": "कुल राशि",
        "selectTransactionMode": "लेन-देन का तरीका चुनें",
    },
    "bn": {
        "account": "অ্যাকাউন্ট",
        "dueDate": "নির্ধারিত তারিখ",
        "balance": "ব্যালেন্স",
        "enter": "লিখুন",
        "totalAmount": "মোট পরিমাণ",
        "selectTransactionMode": "লেনদেনের মোড নির্বাচন করুন",
    },
    "or": {
        "account": "ଆକାଉଣ୍ଟ",
        "dueDate": "ନିର୍ଦ୍ଧାରିତ ତାରିଖ",
        "balance": "ବାଲାନ୍ସ",
        "enter": "ଦିଅନ୍ତୁ",
        "totalAmount": "ମୋଟ ରାଶି",
        "selectTransactionMode": "କାରବାର ମୋଡ୍ ବାଛନ୍ତୁ",
    },
}


def insert_keys_into_object(t, obj_name, extras, lang, before_sibling=None):
    m = re.search(rf"\n    {obj_name}: \{{", t)
    if not m:
        raise SystemExit(f"{lang}: {obj_name} missing")
    idx = m.start() + 1
    brace = 0
    i = t.find("{", idx)
    for j in range(i, len(t)):
        if t[j] == "{":
            brace += 1
        elif t[j] == "}":
            brace -= 1
            if brace == 0:
                end_brace = j
                break
    else:
        raise SystemExit(f"{lang}: brace fail {obj_name}")
    end = end_brace + 1
    had_comma = end < len(t) and t[end] == ","
    if had_comma:
        end += 1
    section = t[idx:end]
    body_start = section.find("{") + 1
    brace = 0
    for j, ch in enumerate(section):
        if ch == "{":
            brace += 1
        elif ch == "}":
            brace -= 1
            if brace == 0:
                body = section[body_start:j]
                break
    body = body.rstrip()
    if body.endswith("}"):
        body = body + ","
    elif not body.endswith(",") and not body.endswith("{"):
        lines = body.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
            lines[-1] = lines[-1] + ","
        body = "\n".join(lines)
    body += "\n"
    added = []
    for k, v in extras[lang].items():
        if re.search(rf"^\s{{6}}{k}:", body, re.M):
            continue
        body += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added.append(k)
    new_section = (
        f"    {obj_name}: {{\n"
        + body.rstrip().rstrip(",")
        + "\n    }"
        + ("," if had_comma else "")
    )
    return t[:idx] + new_section + t[end:], added


for name in ["en", "hi", "bn", "or"]:
    p = LOC / f"{name}.js"
    t = p.read_text(encoding="utf-8")

    # common: insert inside before bank using same method as before
    idx = t.rfind("    common: {")
    end = t.find("\n    bank:", idx)
    section = t[idx:end]
    close = section.rfind("\n    },")
    before = section[:close].rstrip()
    if not before.endswith(","):
        lines = before.split("\n")
        if lines[-1].strip() and not lines[-1].rstrip().endswith(","):
            lines[-1] = lines[-1] + ","
        before = "\n".join(lines)
    before += "\n"
    added_c = []
    for k, v in COMMON_EXTRA[name].items():
        if re.search(rf"^\s{{6}}{k}:", before, re.M):
            continue
        before += f"      {k}: {json.dumps(v, ensure_ascii=False)},\n"
        added_c.append(k)
    t = t[:idx] + before + "    }," + t[end:]
    print(name, "common+", added_c)

    t, added_b = insert_keys_into_object(t, "borrowings", BOR_EXTRA, name)
    print(name, "borrowings+", added_b)

    while ",," in t:
        t = t.replace(",,", ",")
    p.write_text(t, encoding="utf-8")
