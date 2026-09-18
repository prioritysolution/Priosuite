# -*- coding: utf-8 -*-
"""Wire i18n into operationalArea forms/tables/index."""
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "components" / "master" / "operationalArea"


def ensure_import(text, import_line='import { useTranslation } from "react-i18next";'):
    if "react-i18next" in text:
        return text
    if text.startswith('"use client"'):
        nl = text.find("\n")
        return text[: nl + 1] + "\n" + import_line + "\n" + text[nl + 1 :]
    if text.startswith("import "):
        return import_line + "\n" + text
    return import_line + "\n" + text


def ensure_hook(text, fn_sig_substr):
    if "useTranslation()" in text:
        return text
    idx = text.find(fn_sig_substr)
    if idx < 0:
        raise SystemExit(f"fn not found: {fn_sig_substr}")
    brace = text.find("{", idx)
    return text[: brace + 1] + "\n  const { t } = useTranslation();\n" + text[brace + 1 :]


def apply(path, fn_sig, reps):
    text = path.read_text(encoding="utf-8")
    text = ensure_import(text)
    text = ensure_hook(text, fn_sig)
    for a, b in reps:
        if a not in text:
            print(f"WARN {path.name} missing: {a[:60]!r}")
        text = text.replace(a, b)
    path.write_text(text, encoding="utf-8")
    print("ok", path.relative_to(root.parent))


common_btn_reps = [
    (">\n            Cancel\n          </Button>", '>\n            {t("common.buttons.cancel")}\n          </Button>'),
    (') : isEdit ? (\n              "Update"\n            ) : (\n              "Add"\n            )}',
     ') : isEdit ? (\n              t("common.buttons.update")\n            ) : (\n              t("common.buttons.add")\n            )}'),
]

# StateForm
apply(
    root / "state" / "StateForm.jsx",
    "const StateForm = ({",
    [
        ('label="State Name"', 'label={t("master.operationalArea.fields.stateName")}'),
        ('placeholder="Enter state name"', 'placeholder={t("master.operationalArea.placeholders.stateName")}'),
        *common_btn_reps,
    ],
)

# DistrictForm
apply(
    root / "district" / "DistrictForm.jsx",
    "const DistrictForm = ({",
    [
        ('label="District Name"', 'label={t("master.operationalArea.fields.districtName")}'),
        ('placeholder="Enter district name"', 'placeholder={t("master.operationalArea.placeholders.districtName")}'),
        ('label="State"', 'label={t("master.operationalArea.fields.state")}'),
        ('placeholder="Select state"', 'placeholder={t("master.operationalArea.placeholders.state")}'),
        ('searchPlaceholder="Search state..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchState")}'),
        *common_btn_reps,
    ],
)

# BlockForm
apply(
    root / "block" / "BlockForm.jsx",
    "const BlockForm = ({",
    [
        ('label="Block Name"', 'label={t("master.operationalArea.fields.blockName")}'),
        ('placeholder="Enter block name"', 'placeholder={t("master.operationalArea.placeholders.blockName")}'),
        ('label="State"', 'label={t("master.operationalArea.fields.state")}'),
        ('placeholder="Select state"', 'placeholder={t("master.operationalArea.placeholders.state")}'),
        ('searchPlaceholder="Search state..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchState")}'),
        ('label="District"', 'label={t("master.operationalArea.fields.district")}'),
        ('placeholder="Select district"', 'placeholder={t("master.operationalArea.placeholders.district")}'),
        ('searchPlaceholder="Search district..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchDistrict")}'),
        *common_btn_reps,
    ],
)

# PoliceStationForm
apply(
    root / "policeStation" / "PoliceStationForm.jsx",
    "const PoliceStationForm = ({",
    [
        ('label="Police Station Name"', 'label={t("master.operationalArea.fields.policeStationName")}'),
        ('placeholder="Enter police station name"', 'placeholder={t("master.operationalArea.placeholders.policeStationName")}'),
        ('label="State"', 'label={t("master.operationalArea.fields.state")}'),
        ('placeholder="Select state"', 'placeholder={t("master.operationalArea.placeholders.state")}'),
        ('searchPlaceholder="Search state..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchState")}'),
        ('label="District"', 'label={t("master.operationalArea.fields.district")}'),
        ('placeholder="Select district"', 'placeholder={t("master.operationalArea.placeholders.district")}'),
        ('searchPlaceholder="Search district..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchDistrict")}'),
        *common_btn_reps,
    ],
)

# PostOfficeForm
apply(
    root / "postOffice" / "PostOfficeForm.jsx",
    "const PostOfficeForm = ({",
    [
        ('label="Post Office Name"', 'label={t("master.operationalArea.fields.postOfficeName")}'),
        ('placeholder="Enter post office name"', 'placeholder={t("master.operationalArea.placeholders.postOfficeName")}'),
        ('label="Pin Code"', 'label={t("master.operationalArea.fields.pinCode")}'),
        ('placeholder="Enter pin code"', 'placeholder={t("master.operationalArea.placeholders.pinCode")}'),
        ('label="State"', 'label={t("master.operationalArea.fields.state")}'),
        ('placeholder="Select state"', 'placeholder={t("master.operationalArea.placeholders.state")}'),
        ('searchPlaceholder="Search state..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchState")}'),
        ('label="District"', 'label={t("master.operationalArea.fields.district")}'),
        ('placeholder="Select district"', 'placeholder={t("master.operationalArea.placeholders.district")}'),
        ('searchPlaceholder="Search district..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchDistrict")}'),
        *common_btn_reps,
    ],
)

# VillageForm
apply(
    root / "village" / "VillageForm.jsx",
    "const VillageForm = ({",
    [
        ('label="Village Name"', 'label={t("master.operationalArea.fields.villageName")}'),
        ('placeholder="Enter village name"', 'placeholder={t("master.operationalArea.placeholders.villageName")}'),
        ('label="State"', 'label={t("master.operationalArea.fields.state")}'),
        ('placeholder="Select state"', 'placeholder={t("master.operationalArea.placeholders.state")}'),
        ('searchPlaceholder="Search state..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchState")}'),
        ('label="District"', 'label={t("master.operationalArea.fields.district")}'),
        ('placeholder="Select district"', 'placeholder={t("master.operationalArea.placeholders.district")}'),
        ('searchPlaceholder="Search district..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchDistrict")}'),
        ('label="Block"', 'label={t("master.operationalArea.fields.block")}'),
        ('placeholder="Select block"', 'placeholder={t("master.operationalArea.placeholders.block")}'),
        ('searchPlaceholder="Search block..."', 'searchPlaceholder={t("master.operationalArea.placeholders.searchBlock")}'),
        *common_btn_reps,
    ],
)

# UnitForm
apply(
    root / "unit" / "UnitForm.jsx",
    "const UnitForm = ({",
    [
        ('label="Unit Name"', 'label={t("master.operationalArea.fields.unitName")}'),
        ('placeholder="Enter unit name"', 'placeholder={t("master.operationalArea.placeholders.unitName")}'),
        ('label="Unit Number"', 'label={t("master.operationalArea.fields.unitNumber")}'),
        ('placeholder="Enter unit number"', 'placeholder={t("master.operationalArea.placeholders.unitNumber")}'),
        *common_btn_reps,
    ],
)

# Table common replacements helper
table_common = [
    (">Serial No</div>", '>{t("common.serialNo")}</div>'),
    (">Actions</div>", '>{t("common.actions")}</div>'),
    (">\n              Edit\n              <FaRegEdit", '>\n              {t("common.buttons.edit")}\n              <FaRegEdit'),
    ("No results.", '{t("common.noResults")}'),
    (">\n                Previous\n              </Button>", '>\n                {t("common.previous")}\n              </Button>'),
    (">\n                Next\n              </Button>", '>\n                {t("common.next")}\n              </Button>'),
]

apply(
    root / "state" / "StateTable.jsx",
    "const StateTable = ({",
    [
        ("\n            State Name\n            <ArrowUpDown", '\n            {t("master.operationalArea.table.stateName")}\n            <ArrowUpDown'),
        *table_common,
    ],
)

# For other tables, read headers from files via grepping - use flexible patterns
apply(
    root / "district" / "DistrictTable.jsx",
    "const DistrictTable = ({",
    [
        ("District Name", '{t("master.operationalArea.table.districtName")}'),
        *table_common,
    ],
)

apply(
    root / "block" / "BlockTable.jsx",
    "const BlockTable = ({",
    [
        ("Block Name", '{t("master.operationalArea.table.blockName")}'),
        *table_common,
    ],
)

apply(
    root / "policeStation" / "PoliceStationTable.jsx",
    "const PoliceStationTable = ({",
    [
        ("Police Station Name", '{t("master.operationalArea.table.policeStationName")}'),
        *table_common,
    ],
)

apply(
    root / "postOffice" / "PostOfficeTable.jsx",
    "const PostOfficeTable = ({",
    [
        ("Post Office Name", '{t("master.operationalArea.table.postOfficeName")}'),
        ("Pin Code", '{t("master.operationalArea.table.pinCode")}'),
        ("PIN Code", '{t("master.operationalArea.table.pinCode")}'),
        *table_common,
    ],
)

apply(
    root / "village" / "VillageTable.jsx",
    "const VillageTable = ({",
    [
        ("Village Name", '{t("master.operationalArea.table.villageName")}'),
        *table_common,
    ],
)

apply(
    root / "unit" / "UnitTable.jsx",
    "const UnitTable = ({",
    [
        ("Unit Name", '{t("master.operationalArea.table.unitName")}'),
        ("Unit Number", '{t("master.operationalArea.table.unitNumber")}'),
        *table_common,
    ],
)

# OperationalArea index - more careful rewrite for formList labels
p = root / "index.jsx"
text = p.read_text(encoding="utf-8")
text = ensure_import(text)
text = ensure_hook(text, "const OperationalArea = ({")

# Replace formList labels
replacements = [
    ('label: "State",', 'label: t("master.operationalArea.tabs.state"),'),
    ('label: "District",', 'label: t("master.operationalArea.tabs.district"),'),
    ('label: "Block",', 'label: t("master.operationalArea.tabs.block"),'),
    ('label: "Police Station",', 'label: t("master.operationalArea.tabs.policeStation"),'),
    ('label: "Post Office",', 'label: t("master.operationalArea.tabs.postOffice"),'),
    ('label: "Village",', 'label: t("master.operationalArea.tabs.village"),'),
    ('label: "Unit",', 'label: t("master.operationalArea.tabs.unit"),'),
    (
        "Operational Area — {item.label}",
        '{t("master.operationalArea.heading", { name: item.label })}',
    ),
    (
        "Add {item.label}",
        '{t("master.operationalArea.addItem", { name: item.label })}',
    ),
    (
        """{editStateData ||
                editDistrictData ||
                editBlockData ||
                editPoliceStationData ||
                editPostOfficeData ||
                editVillageData ||
                editUnitData
                  ? "Update"
                  : "Add"}{" "}
                {formList[activeForm].label}""",
        """{editStateData ||
                editDistrictData ||
                editBlockData ||
                editPoliceStationData ||
                editPostOfficeData ||
                editVillageData ||
                editUnitData
                  ? t("common.buttons.update")
                  : t("common.buttons.add")}{" "}
                {formList[activeForm].label}""",
    ),
    (
        """{editStateData ||
                editDistrictData ||
                editBlockData ||
                editPoliceStationData ||
                editPostOfficeData ||
                editVillageData ||
                editUnitData
                  ? `Update the selected ${formList[activeForm].label.toLowerCase()} details below.`
                  : `Fill in the details to add a new ${formList[activeForm].label.toLowerCase()}.`}""",
        """{editStateData ||
                editDistrictData ||
                editBlockData ||
                editPoliceStationData ||
                editPostOfficeData ||
                editVillageData ||
                editUnitData
                  ? t("master.operationalArea.dialogUpdate", {
                      name: formList[activeForm].label.toLowerCase(),
                    })
                  : t("master.operationalArea.dialogAdd", {
                      name: formList[activeForm].label.toLowerCase(),
                    })}""",
    ),
]
for a, b in replacements:
    if a not in text:
        print("WARN OA index missing:", repr(a[:80]))
    text = text.replace(a, b)
p.write_text(text, encoding="utf-8")
print("ok operationalArea/index")
print("done OA")
