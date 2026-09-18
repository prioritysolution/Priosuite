# -*- coding: utf-8 -*-
from pathlib import Path

p = Path("components/membership/issueMembership/index.jsx")
t = p.read_text(encoding="utf-8")
t = t.replace(
    "<FormLabel>Address</FormLabel>",
    '<FormLabel>{t("membership.issueMembership.fields.address")}</FormLabel>',
)
p.write_text(t, encoding="utf-8")
print("issueMembership Address")

p = Path("components/membership/memberEnquiry/index.jsx")
t = p.read_text(encoding="utf-8")
t = t.replace(
    "<FormLabel>CIF No.</FormLabel>",
    '<FormLabel>{t("membership.memberEnquiry.fields.cifNo")}</FormLabel>',
)
p.write_text(t, encoding="utf-8")
print("memberEnquiry CIF")

for rel in (
    "components/membership/mapgroupmember/index.jsx",
    "components/membership/mapinstitutemember/index.jsx",
):
    ns = "membership.mapGroupMember"
    p = Path(rel)
    t = p.read_text(encoding="utf-8")
    reps = [
        ('title="Group Basic Info"', f'title={{t("{ns}.sections.groupBasicInfo")}}'),
        ('title="Member Info"', f'title={{t("{ns}.sections.memberInfo")}}'),
        ('title="Added Members"', f'title={{t("{ns}.sections.addedMembers")}}'),
        (
            'title="Existing Group Members"',
            f'title={{t("{ns}.sections.existingGroupMembers")}}',
        ),
        (
            "\n                                Add Member\n",
            f'\n                                {{t("{ns}.buttons.addMember")}}\n',
        ),
        (" /> Remove", ' /> {t("common.buttons.remove")}'),
        (" /> Save Changes", ' /> {t("' + ns + '.buttons.saveChanges")}'),
        (
            "Edit Member Information",
            '{t("' + ns + '.dialog.editTitle")}',
        ),
    ]
    # only replace mode strings in label contexts carefully
    if 'label: "View Existing Members"' in t:
        reps.append(
            (
                'label: "View Existing Members"',
                'label: t("' + ns + '.modes.viewExisting")',
            )
        )
    if 'label: "Add New Member"' in t:
        reps.append(
            ('label: "Add New Member"', 'label: t("' + ns + '.modes.addNew")')
        )
    for a, b in reps:
        if a not in t:
            print("WARN", rel, a[:55])
        else:
            t = t.replace(a, b)
    p.write_text(t, encoding="utf-8")
    print("OK", rel)
