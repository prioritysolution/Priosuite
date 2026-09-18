# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("i18n/locales/en.js").read_text(encoding="utf-8")
bank = t.find("\n    bank: {")
common_start = t.rfind("\n    common: {", 0, bank)
body = t[common_start:bank]
for k in [
    "date", "branch", "selectBranch", "searchBranch", "user", "selectUser",
    "searchUser", "slNo", "refVoucher", "voucherNo", "particulars", "receipt",
    "payment", "total", "grandTotal", "generatedBy", "generatedOn",
    "thisReportIsGeneratedByPrioSuite",
]:
    mm = re.search(rf'\n      {k}: "([^"]*)"', body)
    print("common." + k, "->", mm.group(1) if mm else "MISSING")
print("userScroll", bool(re.search(r"\n      userScroll:\s*\{", t)))
