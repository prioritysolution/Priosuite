# -*- coding: utf-8 -*-
"""Fix multiline TableHead / Total labels in membership report previews."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "components" / "membership" / "report"

MAP = {
    "DetailedListPreview.jsx": {
        "SL. NO.": "membership.reports.print.slNo",
        "DATE": "membership.reports.print.date",
        "MEMBER TYPE": "membership.reports.print.memberType",
        "CUSTOMER NAME": "membership.reports.print.customerName",
        "GUARDIAN NAME": "membership.reports.print.guardianName",
        "VILLAGE": "membership.reports.print.village",
        "L/F. NO.": "membership.reports.print.lfNo",
        "OPENING": "membership.reports.print.opening",
        "ISSUE": "membership.reports.print.issue",
        "RELEASE": "membership.reports.print.release",
        "CLOSING": "membership.reports.print.closing",
        "DIV. BAL.": "membership.reports.print.divBal",
        "Total": "common.total",
    },
    "DividendListPreview.jsx": {
        "SL. NO.": "membership.reports.print.slNo",
        "DATE": "membership.reports.print.date",
        "MEMBER TYPE": "membership.reports.print.memberType",
        "CUSTOMER NAME": "membership.reports.print.customerName",
        "GUARDIAN NAME": "membership.reports.print.guardianName",
        "VILLAGE": "membership.reports.print.village",
        "L/F. NO.": "membership.reports.print.lfNo",
        "BALANCE": "membership.reports.print.balance",
        "Total": "common.total",
    },
    "MemberRegisterPreview.jsx": {
        "SL. NO.": "membership.reports.print.slNo",
        "DATE": "membership.reports.print.date",
        "MEMBER TYPE": "membership.reports.print.memberType",
        "CUSTOMER NAME": "membership.reports.print.customerName",
        "GUARDIAN NAME": "membership.reports.print.guardianName",
        "VILLAGE": "membership.reports.print.village",
        "L/F. NO.": "membership.reports.print.lfNo",
        "ADM. FEES": "membership.reports.print.admFees",
        "Total": "common.total",
    },
    "WithdrawnRegisterPreview.jsx": {
        "SL. NO.": "membership.reports.print.slNo",
        "DATE": "membership.reports.print.date",
        "MEMBER TYPE": "membership.reports.print.memberType",
        "CUSTOMER NAME": "membership.reports.print.customerName",
        "GUARDIAN NAME": "membership.reports.print.guardianName",
        "VILLAGE": "membership.reports.print.village",
        "L/F. NO.": "membership.reports.print.lfNo",
        "AMOUNT": "membership.reports.print.amount",
        "Total": "common.total",
    },
    "TransactionRegisterPreview.jsx": {
        "SL. NO.": "membership.reports.print.slNo",
        "MEMBER TYPE": "membership.reports.print.memberType",
        "CUSTOMER NAME": "membership.reports.print.customerName",
        "GUARDIAN NAME": "membership.reports.print.guardianName",
        "VILLAGE": "membership.reports.print.village",
        "L/F. NO.": "membership.reports.print.lfNo",
        "TRANS. MODE": "membership.reports.print.transMode",
        "NO. OF SHARE": "membership.reports.print.noOfShare",
        "ISSUE": "membership.reports.print.issue",
        "RELEASE": "membership.reports.print.release",
    },
}


def replace_inner(text: str, label: str, key: str) -> str:
    # Multiline child of TableHead or TableCell
    pat = re.compile(
        rf"(<(?:TableHead|TableCell)[^>]*>)\s*{re.escape(label)}\s*(</(?:TableHead|TableCell)>)",
        re.M,
    )
    new, n = pat.subn(rf'\1{{t("{key}")}}\2', text, count=1)
    if n == 0:
        # try any remaining occurrences (print headers once each)
        new, n = pat.subn(rf'\1{{t("{key}")}}\2', text)
    return new, n


for fname, mapping in MAP.items():
    path = ROOT / fname
    text = path.read_text(encoding="utf-8")
    for label, key in mapping.items():
        text, n = replace_inner(text, label, key)
        if n == 0:
            print(f"WARN {fname}: {label!r}")
        else:
            print(f"  {fname}: {label} x{n}")
    path.write_text(text, encoding="utf-8")
    print("fixed", fname)
