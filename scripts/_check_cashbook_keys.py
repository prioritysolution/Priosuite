# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("i18n/locales/en.js").read_text(encoding="utf-8")
m = re.search(r"\n    common: \{([\s\S]*?)\n    \},\n    bank:", t)
common = m.group(1) if m else ""
for k in [
    "receipt", "payment", "openingBalance", "closingBalance", "headOfAccount",
    "drAmount", "crAmount", "zero", "generatedBy", "thisReportIsGeneratedByPrioSuite",
    "generatedOn", "denomination", "quantity", "value", "ledgerName", "particulars",
    "amount", "slNo", "sl", "total", "print", "voucherDate", "narration",
]:
    mm = re.search(rf'\n      {k}: "([^"]*)"', common)
    print("common." + k, "->", mm.group(1) if mm else "MISSING")

vm = re.search(r"\n    voucher: \{([\s\S]*?)\n    \},\n    adjustmentVoucher:", t)
voucher = vm.group(1) if vm else ""
for k in ["voucherType", "voucherNo", "refVcNo", "voucherDate"]:
    mm = re.search(rf'\n      {k}: "([^"]*)"', voucher)
    print("voucher." + k, "->", mm.group(1) if mm else "MISSING")

print("top report", bool(re.search(r"\n    report: \{", t)))
print("report.cashbook", bool(re.search(r"\n      cashbook: \{", t)))
