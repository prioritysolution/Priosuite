# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("i18n/locales/en.js").read_text(encoding="utf-8")
# bank-era common only
bank = t.find("\n    bank: {")
common_start = t.rfind("\n    common: {", 0, bank)
body = t[common_start:bank]
for k in [
    "fromDate", "toDate", "to", "receipt", "payment", "receipts", "payments",
    "cash", "transfer", "total", "grandTotal", "openingBalance", "closingBalance",
    "particulars", "sl", "slNo", "headOfAccount", "drAmount", "crAmount",
    "narration", "voucherDate", "rupees", "only", "zero", "generatedBy",
    "generatedOn", "thisReportIsGeneratedByPrioSuite", "denomination",
    "quantity", "value", "branch", "selectBranch", "searchBranch",
]:
    mm = re.search(rf'\n      {k}: "([^"]*)"', body)
    print("common." + k, "->", mm.group(1) if mm else "MISSING")

print("cashAccount in report", bool(re.search(r"\n      cashAccount:\s*\{", t)))
print("voucher.voucherNo", bool(re.search(r'\n    voucher: \{[\s\S]*?\n      voucherNo:', t)))
print("voucher.refVcNo", bool(re.search(r'\n    voucher: \{[\s\S]*?\n      refVcNo:', t)))
