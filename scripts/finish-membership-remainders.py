# -*- coding: utf-8 -*-
from pathlib import Path
import re

COMP = Path(__file__).resolve().parents[1] / "components" / "membership"

# Remap mapInstituteMember field keys -> mapGroupMember (locale incomplete)
p = COMP / "mapinstitutemember" / "index.jsx"
t = p.read_text(encoding="utf-8")

def repl(m):
    key = m.group(1)
    if key.startswith(("modes.", "buttons.")) or key in ("title", "secondaryFormLabel"):
        return m.group(0)
    return f't("membership.mapGroupMember.{key}")'

t = re.sub(r't\("membership\.mapInstituteMember\.([^"]+)"\)', repl, t)
# placeholders.date was wrong key - mapGroup has selectDate
t = t.replace(
    't("membership.mapGroupMember.placeholders.date")',
    't("membership.mapGroupMember.placeholders.selectDate")',
)
p.write_text(t, encoding="utf-8")
print("institute remapped")

# Reset button
mp = COMP / "memberProfile" / "index.jsx"
mt = mp.read_text(encoding="utf-8")
# Only the Reset div (first cancel used for Reset wrongly)
mt = mt.replace('{t("common.buttons.cancel")}', "Reset", 1)
mp.write_text(mt, encoding="utf-8")
print("reset")

# Institution profile section labels
ip = COMP / "institutionProfile" / "index.jsx"
it = ip.read_text(encoding="utf-8")
it = it.replace(
    "\n                    Register Address\n",
    '\n                    {t("membership.institutionProfile.sections.registerAddress")}\n',
)
it = it.replace(
    "\n                    Office Address\n",
    '\n                    {t("membership.institutionProfile.sections.officeAddress")}\n',
)
it = it.replace(
    'addressLabel="Register Address"',
    'addressLabel={t("membership.institutionProfile.fields.address")}',
)
it = it.replace(
    'addressLabel="Office Address"',
    'addressLabel={t("membership.institutionProfile.fields.address")}',
)
it = it.replace(
    "Same as Register Address",
    '{t("membership.institutionProfile.sameAsRegister")}',
)
ip.write_text(it, encoding="utf-8")
print("institution sections")

# Preview modal table headers
pm = COMP / "calculateDividend" / "PreviewModal.jsx"
pt = pm.read_text(encoding="utf-8")
for eng, key in [
    ("Sl.", "table.sl"),
    ("Member Code", "table.memberCode"),
    ("Member Name", "table.memberName"),
    ("Guardian Name", "table.guardianName"),
    ("Village", "table.village"),
    ("Share Balance", "table.shareBalance"),
    ("Dividend Amount", "table.dividendAmount"),
]:
    pt = re.sub(
        rf"(\n\s+){re.escape(eng)}(\n)",
        rf'\1{{t("membership.calculateDividend.{key}")}}\2',
        pt,
    )
pm.write_text(pt, encoding="utf-8")
print("preview modal")

# calculateDividend remaining Dividend Amount header
cd = COMP / "calculateDividend" / "index.jsx"
ct = cd.read_text(encoding="utf-8")
ct = re.sub(
    r"(\n\s+)Dividend Amount(\n)",
    r'\1{t("membership.calculateDividend.table.dividendAmount")}\2',
    ct,
)
cd.write_text(ct, encoding="utf-8")

# generateCertificate Serial No.
gc = COMP / "generateCertificate" / "index.jsx"
gt = gc.read_text(encoding="utf-8")
gt = re.sub(
    r"(\n\s+)Serial No\.(\n)",
    r'\1{t("membership.generateCertificate.table.serialNo")}\2',
    gt,
)
gc.write_text(gt, encoding="utf-8")

# Receipts Cancel/Print
for rel in [
    "issueMembership/ShareIssueReceipt.jsx",
    "shareIssue/ShareIssueReceipt.jsx",
]:
    rp = COMP / rel
    rt = rp.read_text(encoding="utf-8")
    rt = rt.replace(">Cancel<", '>{t("common.buttons.cancel")}<')
    rt = rt.replace(">Print<", '>{t("common.buttons.print")}<')
    rt = rt.replace('"Cancel"', 't("common.buttons.cancel")')
    rt = rt.replace('"Print"', 't("common.buttons.print")')
    # multiline
    rt = re.sub(r">\s*Cancel\s*<", '>{t("common.buttons.cancel")}<', rt)
    rt = re.sub(r">\s*Print\s*<", '>{t("common.buttons.print")}<', rt)
    rp.write_text(rt, encoding="utf-8")
    print("receipt", rel)

# mapgroupmember column labels and buttons
mg = COMP / "mapgroupmember" / "index.jsx"
mt = mg.read_text(encoding="utf-8")
mt = mt.replace('{ key: "sl", label: "#" }', '{ key: "sl", label: t("membership.mapGroupMember.table.hash") }')
mt = mt.replace('{ key: "actions", label: "Actions" }', '{ key: "actions", label: t("membership.mapGroupMember.table.actions") }')
mt = mt.replace(
    '{ name: "gmemberNo", label: "Group No." }',
    '{ name: "gmemberNo", label: t("membership.mapGroupMember.fields.groupNo") }',
)
mt = mt.replace("<Pencil className=\"w-3 h-3\" /> Edit", '<Pencil className="w-3 h-3" /> {t("membership.mapGroupMember.buttons.edit")}')
mt = mt.replace("<X className=\"w-4 h-4\" /> Cancel", '<X className="w-4 h-4" /> {t("common.buttons.cancel")}')
mt = mt.replace("Edit Member Information", '{t("membership.mapGroupMember.dialog.editTitle")}')
# table body column headers that are still plain - common patterns in columns arrays
for eng, key in [
    ("Group CIF", "fields.groupCif"),
    ("Group Name", "fields.groupName"),
    ("Group No.", "fields.groupNo"),
    ("Guardian Name", "fields.guardianName"),
    ("Joining Date", "fields.joiningDate"),
    ("Member CIF", "fields.memberCif"),
    ("Member Name", "fields.memberName"),
    ("Member No.", "fields.memberNo"),
    ("Mobile No.", "fields.mobileNo"),
    ("No. of Members", "fields.noOfMembers"),
    ("Relation", "fields.relation"),
    ("Savings A/C", "fields.savingsAc"),
    ("Status", "fields.status"),
    ("CIF No.", "fields.cifNo"),
    ("Designation", "fields.designation"),
    ("Action", "table.action"),
    ("Actions", "table.actions"),
]:
    # only in label: "..." contexts
    mt = mt.replace(f'label: "{eng}"', f'label: t("membership.mapGroupMember.{key}")')
mg.write_text(mt, encoding="utf-8")
print("mapgroup columns")

# same for mapinstitutemember column defs
mi = COMP / "mapinstitutemember" / "index.jsx"
mit = mi.read_text(encoding="utf-8")
mit = mit.replace('{ key: "sl", label: "#" }', '{ key: "sl", label: t("membership.mapGroupMember.table.hash") }')
mit = mit.replace('{ key: "actions", label: "Actions" }', '{ key: "actions", label: t("membership.mapGroupMember.table.actions") }')
mit = mit.replace("<Pencil className=\"w-3 h-3\" /> Edit", '<Pencil className="w-3 h-3" /> {t("membership.mapGroupMember.buttons.edit")}')
mit = mit.replace("<X className=\"w-4 h-4\" /> Cancel", '<X className="w-4 h-4" /> {t("common.buttons.cancel")}')
for eng, key in [
    ("Group CIF", "fields.groupCif"),
    ("Group Name", "fields.groupName"),
    ("Group No.", "fields.groupNo"),
    ("Guardian Name", "fields.guardianName"),
    ("Joining Date", "fields.joiningDate"),
    ("Member CIF", "fields.memberCif"),
    ("Member Name", "fields.memberName"),
    ("Member No.", "fields.memberNo"),
    ("Mobile No.", "fields.mobileNo"),
    ("No. of Members", "fields.noOfMembers"),
    ("Relation", "fields.relation"),
    ("Status", "fields.status"),
    ("CIF No.", "fields.cifNo"),
    ("Designation", "fields.designation"),
    ("Action", "table.action"),
    ("Actions", "table.actions"),
]:
    mit = mit.replace(f'label: "{eng}"', f'label: t("membership.mapGroupMember.{key}")')
mi.write_text(mit, encoding="utf-8")
print("mapinstitute columns")

# memberEnquiry Search button text leftover
me = COMP / "memberEnquiry" / "index.jsx"
met = me.read_text(encoding="utf-8")
met = re.sub(r">\s*Search\s*<", '>{t("memberSearch.search")}<', met)
me.write_text(met, encoding="utf-8")
print("enquiry search")
print("done")
