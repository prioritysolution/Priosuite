# -*- coding: utf-8 -*-
"""Wire useTranslation into all membership components (static strings only)."""
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "components" / "membership"


def ensure_import(text, import_line='import { useTranslation } from "react-i18next";'):
    if "react-i18next" in text:
        return text
    if text.lstrip().startswith('"use client"'):
        # after use client line
        nl = text.find("\n")
        return text[: nl + 1] + import_line + "\n" + text[nl + 1 :]
    if text.startswith("import "):
        return import_line + "\n" + text
    return import_line + "\n" + text


def ensure_hook(text, fn_sig_substr):
    if "const { t } = useTranslation();" in text and text.find("const { t } = useTranslation();") < text.find(fn_sig_substr) + 200:
        # may already have hook in this component; still ok to skip duplicate if immediately after fn
        pass
    idx = text.find(fn_sig_substr)
    if idx < 0:
        raise SystemExit(f"fn not found: {fn_sig_substr[:60]!r}")
    brace = text.find("{", idx)
    # avoid double-insert for this component: check next 120 chars
    window = text[brace : brace + 120]
    if "useTranslation()" in window:
        return text
    return text[: brace + 1] + "\n  const { t } = useTranslation();\n" + text[brace + 1 :]


def apply_reps(text, reps, name):
    for a, b in reps:
        if a not in text:
            print(f"WARN {name} missing: {a[:70]!r}")
        else:
            text = text.replace(a, b)
    return text


def write(rel, text):
    p = root / rel
    p.write_text(text, encoding="utf-8")
    print("wired", rel.replace("\\", "/"))


# ---------- report tables (simple) ----------
def wire_table(rel, headers, total_key='common.total'):
    p = root / rel
    text = ensure_import(p.read_text(encoding="utf-8"))
    # find first const X = ({
    import re
    m = re.search(r"const \w+ = \(\{", text)
    if not m:
        raise SystemExit(f"no component in {rel}")
    text = ensure_hook(text, m.group(0))
    reps = []
    for en, key in headers:
        reps.append((f">{en}</TableHead>", f'{{t("{key}")}}</TableHead>'))
    reps.append((">Total</TableCell>", f'>{{t("{total_key}")}}</TableCell>'))
    reps.append((">Total</TableCell>", f'>{{t("{total_key}")}}</TableCell>'))  # noop if already
    text = apply_reps(text, reps, rel)
    # also colspan Total variants
    text = text.replace(">Total</TableCell>", f'>{{t("{total_key}")}}</TableCell>')
    write(rel, text)


wire_table(
    "report/DetailedListTable.jsx",
    [
        ("Sl No.", "membership.reports.slNo"),
        ("Date", "membership.reports.date"),
        ("Member Type", "membership.reports.memberType"),
        ("Customer Name", "membership.reports.customerName"),
        ("Gurdian Name", "membership.reports.guardianName"),
        ("Village", "membership.reports.village"),
        ("L/F No.", "membership.reports.lfNo"),
        ("Opening", "membership.reports.opening"),
        ("Issue", "membership.reports.issue"),
        ("Release", "membership.reports.release"),
        ("Closing", "membership.reports.closing"),
        ("Div. Bal.", "membership.reports.dividendBalance"),
    ],
)
wire_table(
    "report/DividendListTable.jsx",
    [
        ("Sl No.", "membership.reports.slNo"),
        ("Date", "membership.reports.date"),
        ("Member Type", "membership.reports.memberType"),
        ("Customer Name", "membership.reports.customerName"),
        ("Gurdian Name", "membership.reports.guardianName"),
        ("Village", "membership.reports.village"),
        ("L/F No.", "membership.reports.lfNo"),
        ("Balance", "membership.reports.balance"),
    ],
)
wire_table(
    "report/MemberRegisterTable.jsx",
    [
        ("Sl No.", "membership.reports.slNo"),
        ("Date", "membership.reports.date"),
        ("Member Type", "membership.reports.memberType"),
        ("Customer Name", "membership.reports.customerName"),
        ("Gurdian Name", "membership.reports.guardianName"),
        ("Village", "membership.reports.village"),
        ("L/F No.", "membership.reports.lfNo"),
        ("Admission Fees", "membership.reports.admissionFees"),
    ],
)
wire_table(
    "report/WithdrawnRegisterTable.jsx",
    [
        ("Sl No.", "membership.reports.slNo"),
        ("Date", "membership.reports.date"),
        ("Member Type", "membership.reports.memberType"),
        ("Customer Name", "membership.reports.customerName"),
        ("Gurdian Name", "membership.reports.guardianName"),
        ("Village", "membership.reports.village"),
        ("L/F No.", "membership.reports.lfNo"),
        ("Amount", "membership.reports.amount"),
    ],
)

# TransactionRegisterTable
p = root / "report/TransactionRegisterTable.jsx"
text = ensure_import(p.read_text(encoding="utf-8"))
text = ensure_hook(text, "const TransactionRegisterTable = ({")
reps = [
    (">Sl No.</TableHead>", '>{t("membership.reports.slNo")}</TableHead>'),
    (">Member Type</TableHead>", '>{t("membership.reports.memberType")}</TableHead>'),
    (">Customer Name</TableHead>", '>{t("membership.reports.customerName")}</TableHead>'),
    (">Gurdian Name</TableHead>", '>{t("membership.reports.guardianName")}</TableHead>'),
    (">Village</TableHead>", '>{t("membership.reports.village")}</TableHead>'),
    (">L/F No.</TableHead>", '>{t("membership.reports.lfNo")}</TableHead>'),
    (">Trans. Mode</TableHead>", '>{t("membership.reports.transactionMode")}</TableHead>'),
    (">No. of Share</TableHead>", '>{t("membership.reports.numberOfShares")}</TableHead>'),
    (">Issue</TableHead>", '>{t("membership.reports.issue")}</TableHead>'),
    (">Release</TableHead>", '>{t("membership.reports.release")}</TableHead>'),
    (">Action</TableHead>", '>{t("membership.reports.action")}</TableHead>'),
    (">Total</TableCell>", '>{t("common.total")}</TableCell>'),
]
text = apply_reps(text, reps, "TransactionRegisterTable")
write("report/TransactionRegisterTable.jsx", text)

print("tables done")
