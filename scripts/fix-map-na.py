# -*- coding: utf-8 -*-
from pathlib import Path

for rel in (
    "components/membership/mapgroupmember/index.jsx",
    "components/membership/mapinstitutemember/index.jsx",
):
    p = Path(rel)
    t = p.read_text(encoding="utf-8")
    t = t.replace('|| "N/A"', '|| t("common.na")')
    t = t.replace('"N/A"\n', 't("common.na")\n')
    t = t.replace(
        "Update the details below, then click Save to confirm.",
        '{t("membership.mapGroupMember.dialog.description")}',
    )
    if "Save Changes" in t:
        t = t.replace(
            "Save Changes",
            '{t("membership.mapGroupMember.buttons.saveChanges")}',
        )
    p.write_text(t, encoding="utf-8")
    print(
        "fixed",
        rel,
        "N/A left",
        t.count('"N/A"'),
        "Save Changes left",
        t.count("Save Changes"),
    )
