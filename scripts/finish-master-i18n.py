# -*- coding: utf-8 -*-
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "components" / "master"

replacements = {
    '>State Name</div>': '>{t("master.operationalArea.table.stateName")}</div>',
    '>District Name</div>': '>{t("master.operationalArea.table.districtName")}</div>',
    '>Block Name</div>': '>{t("master.operationalArea.table.blockName")}</div>',
    '>Unit No.</div>': '>{t("master.operationalArea.table.unitNumber")}</div>',
}

for path in (root / "operationalArea").rglob("*Table.jsx"):
    text = path.read_text(encoding="utf-8")
    orig = text
    for a, b in replacements.items():
        text = text.replace(a, b)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("updated", path.name)

# SubLedgerForm buttons
p = root / "subLedger" / "SubLedgerForm.jsx"
text = p.read_text(encoding="utf-8")
text = text.replace(
    """) : editData && Object.keys(editData).length > 0 ? (
              "Edit"
            ) : (
              "Add"
            )}""",
    """) : editData && Object.keys(editData).length > 0 ? (
              t("common.buttons.edit")
            ) : (
              t("common.buttons.add")
            )}""",
)
p.write_text(text, encoding="utf-8")
print("SubLedgerForm buttons")

# passbook use client order
p = root / "passbookSettings" / "index.jsx"
text = p.read_text(encoding="utf-8")
text = text.replace(
    '''

import { useTranslation } from "react-i18next";
"use client";
''',
    '''

"use client";

import { useTranslation } from "react-i18next";
''',
)
p.write_text(text, encoding="utf-8")
print("passbook header")

# tidy single-prop signatures
for rel in [
    "demandMaster/index.jsx",
    "depositAgent/index.jsx",
    "shareProduct/index.jsx",
    "operationalArea/state/StateTable.jsx",
]:
    path = root / rel
    text = path.read_text(encoding="utf-8")
    text2 = text.replace("= ({\n  loading }) =>", "= ({ loading }) =>")
    text2 = text2.replace(
        "= ({\n  loading, handleSubmit, form }) =>",
        "= ({ loading, handleSubmit, form }) =>",
    )
    text2 = text2.replace(
        "= ({\n  loading, form, handleSubmit }) =>",
        "= ({ loading, form, handleSubmit }) =>",
    )
    text2 = text2.replace(
        "= ({\n  data, handleEditData, loading }) =>",
        "= ({ data, handleEditData, loading }) =>",
    )
    if text2 != text:
        path.write_text(text2, encoding="utf-8")
        print("tidy", rel)
