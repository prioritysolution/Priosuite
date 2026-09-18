# -*- coding: utf-8 -*-
"""Wire radio Cash/Bank/Savings + passbook headers + Search Members."""
from pathlib import Path

CASH_BLOCK = """                                          <FormLabel className="font-normal">
                                            Cash
                                          </FormLabel>"""
BANK_BLOCK = """                                          <FormLabel className="font-normal">
                                            Bank
                                          </FormLabel>"""
SAV_BLOCK = """                                          <FormLabel className="font-normal">
                                            Savings
                                          </FormLabel>"""


def wire_radios(path, ns):
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    t = t.replace(
        CASH_BLOCK,
        f"""                                          <FormLabel className="font-normal">
                                            {{t("{ns}.fields.cash")}}
                                          </FormLabel>""",
    )
    t = t.replace(
        BANK_BLOCK,
        f"""                                          <FormLabel className="font-normal">
                                            {{t("{ns}.fields.bank")}}
                                          </FormLabel>""",
    )
    t = t.replace(
        SAV_BLOCK,
        f"""                                          <FormLabel className="font-normal">
                                            {{t("{ns}.fields.savings")}}
                                          </FormLabel>""",
    )
    p.write_text(t, encoding="utf-8")
    print("radios", path)


for path, ns in [
    ("components/membership/shareIssue/index.jsx", "membership.shareIssue"),
    ("components/membership/shareRefund/index.jsx", "membership.shareRefund"),
    ("components/membership/issueMembership/index.jsx", "membership.issueMembership"),
    ("components/membership/membershipWithdrawn/index.jsx", "membership.withdrawn"),
]:
    wire_radios(path, ns)

# passbook print headers
p = Path("components/membership/passbookPrint/index.jsx")
t = p.read_text(encoding="utf-8")
t = t.replace(
    """                          <p className="border-x-2 border-black font-medium text-center">
                            Sl.
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Date
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Issue
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Release
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            Balance
                          </p>""",
    """                          <p className="border-x-2 border-black font-medium text-center">
                            {t("membership.passbookPrint.table.sl")}
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            {t("membership.passbookPrint.fields.date")}
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            {t("membership.passbookPrint.table.issue")}
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            {t("membership.passbookPrint.table.release")}
                          </p>
                          <p className="border-r-2 border-black font-medium text-center">
                            {t("membership.passbookPrint.table.balance")}
                          </p>""",
)
p.write_text(t, encoding="utf-8")
print("passbook headers")

# Search Members dialog
p = Path("components/membership/memberEnquiry/index.jsx")
t = p.read_text(encoding="utf-8")
t = t.replace(
    """                      <DialogTitle className="text-base sm:text-lg">
                        Search Members
                      </DialogTitle>""",
    """                      <DialogTitle className="text-base sm:text-lg">
                        {t("memberSearch.searchMembers")}
                      </DialogTitle>""",
)
# also Next button in memberEnquiry may still be hard if not
p.write_text(t, encoding="utf-8")
print("memberEnquiry search dialog")

# Select transanction mode FormLabel leftovers
for path, key in [
    (
        "components/membership/issueMembership/index.jsx",
        "membership.issueMembership.fields.selectTransanctionMode",
    ),
    (
        "components/membership/membershipWithdrawn/index.jsx",
        "membership.withdrawn.fields.selectTransanctionMode",
    ),
]:
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    old = "Select transanction mode"
    if old in t:
        t = t.replace(old, f'{{t("{key}")}}')
        # might double-wrap if already in {} - check
        t = t.replace(f'>{{t("{key}")}}<', f'>{{t("{key}")}}<')
        p.write_text(t, encoding="utf-8")
        print("mode label", path)
    else:
        print("skip mode", path)

print("done")
