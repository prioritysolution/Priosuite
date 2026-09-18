# -*- coding: utf-8 -*-
"""Wire remaining leftover static strings in membership."""
from pathlib import Path

def rep(path, pairs):
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    for a, b in pairs:
        if a not in t:
            print("WARN", path, repr(a[:60]))
        else:
            t = t.replace(a, b)
    p.write_text(t, encoding="utf-8")
    print("OK", path)

rep(
    "components/membership/groupProfile/index.jsx",
    [
        ("\n                    Reset\n", '\n                    {t("common.buttons.reset")}\n'),
        ("\n                    Next\n", '\n                    {t("common.next")}\n'),
        ('addressLabel="Address"', 'addressLabel={t("membership.groupProfile.fields.address")}'),
    ],
)

rep(
    "components/membership/institutionProfile/index.jsx",
    [
        ("\n                    Reset\n", '\n                    {t("common.buttons.reset")}\n'),
        ("\n                    Next\n", '\n                    {t("common.next")}\n'),
        (
            'addressLabel="Register Address"',
            'addressLabel={t("membership.institutionProfile.sections.registerAddress")}',
        ),
        (
            'addressLabel="Office Address"',
            'addressLabel={t("membership.institutionProfile.sections.officeAddress")}',
        ),
    ],
)

rep(
    "components/membership/memberProfile/index.jsx",
    [
        ("\n                    Reset\n", '\n                    {t("common.buttons.reset")}\n'),
        (
            'addressLabel="Permanent Address"',
            'addressLabel={t("membership.memberProfile.sections.permanentAddress")}',
        ),
        (
            'addressLabel="Present Address"',
            'addressLabel={t("membership.memberProfile.sections.presentAddress")}',
        ),
    ],
)

rep(
    "components/membership/issueMembership/index.jsx",
    [
        (
            'nextLabel="Print Receipt"',
            'nextLabel={t("membership.issueMembership.printReceipt")}',
        ),
    ],
)

rep(
    "components/membership/mapgroupmember/index.jsx",
    [
        (
            'emptyText="No existing members found for this group."',
            'emptyText={t("membership.mapGroupMember.empty.existing")}',
        ),
        (
            'emptyText="No members added yet. Use the form above to add members."',
            'emptyText={t("membership.mapGroupMember.empty.added")}',
        ),
        (
            'emptyText = "No data found."',
            'emptyText = undefined /* default via t below */',
        ),
    ],
)

rep(
    "components/membership/mapinstitutemember/index.jsx",
    [
        (
            'emptyText="No existing members found for this group."',
            'emptyText={t("membership.mapGroupMember.empty.existing")}',
        ),
        (
            'emptyText="No members added yet. Use the form above to add members."',
            'emptyText={t("membership.mapGroupMember.empty.added")}',
        ),
    ],
)

rep(
    "components/membership/memberEnquiry/index.jsx",
    [
        (
            "\n                          Membership\n",
            '\n                          {t("membership.memberEnquiry.tabs.membership")}\n',
        ),
        (
            "\n                          Deposit\n",
            '\n                          {t("membership.memberEnquiry.tabs.deposit")}\n',
        ),
        (
            "\n                          Loan\n",
            '\n                          {t("membership.memberEnquiry.tabs.loan")}\n',
        ),
        (
            "\n                                        Active\n",
            '\n                                        {t("membership.memberEnquiry.accountStatus.active")}\n',
        ),
        (
            "\n                                        Closed\n",
            '\n                                        {t("membership.memberEnquiry.accountStatus.closed")}\n',
        ),
    ],
)

rep(
    "components/membership/passbookPrint/index.jsx",
    [
        ("\n              No\n", '\n              {t("common.no")}\n'),
        ("\n              Yes\n", '\n              {t("common.yes")}\n'),
    ],
)

# StatusBadge N/A
for rel in ("mapgroupmember/index.jsx", "mapinstitutemember/index.jsx"):
    p = Path("components/membership") / rel
    t = p.read_text(encoding="utf-8")
    t = t.replace('{status || "N/A"}', '{status || t("common.na")}')
    # ResponsiveTable default emptyText
    if 'emptyText = undefined' in t or 'emptyText = "No data found."' in t:
        # ensure ResponsiveTable uses t for default
        old = """const ResponsiveTable = ({
  headers,
  rows,
  emptyIcon: EmptyIcon = Users,
  emptyText = undefined /* default via t below */,
}) => {
  if (rows.length === 0) {"""
        new = """const ResponsiveTable = ({
  headers,
  rows,
  emptyIcon: EmptyIcon = Users,
  emptyText,
}) => {
  const { t } = useTranslation();
  const resolvedEmpty = emptyText ?? t("membership.mapGroupMember.empty.default");
  if (rows.length === 0) {"""
        if old in t:
            t = t.replace(old, new)
            t = t.replace("{emptyText}", "{resolvedEmpty}")
        else:
            # try original default
            old2 = """const ResponsiveTable = ({
  headers,
  rows,
  emptyIcon: EmptyIcon = Users,
  emptyText = "No data found.",
}) => {
  if (rows.length === 0) {"""
            new2 = """const ResponsiveTable = ({
  headers,
  rows,
  emptyIcon: EmptyIcon = Users,
  emptyText,
}) => {
  const { t } = useTranslation();
  const resolvedEmpty = emptyText ?? t("membership.mapGroupMember.empty.default");
  if (rows.length === 0) {"""
            if old2 in t:
                t = t.replace(old2, new2)
                t = t.replace("{emptyText}", "{resolvedEmpty}")
            else:
                print("WARN ResponsiveTable signature", rel)
    # StatusBadge needs hook
    if 'const StatusBadge = ({ status }) => {' in t and 'const StatusBadge = ({ status }) => {\n  const { t }' not in t:
        t = t.replace(
            "const StatusBadge = ({ status }) => {",
            "const StatusBadge = ({ status }) => {\n  const { t } = useTranslation();",
        )
    p.write_text(t, encoding="utf-8")
    print("patched map helpers", rel)

print("leftovers pass done")
