# -*- coding: utf-8 -*-
from pathlib import Path
import re

t = Path("i18n/locales/en.js").read_text(encoding="utf-8")
bank = t.find("\n    bank: {")
body = t[t.rfind("\n    common: {", 0, bank):bank]
for k in [
    "fromDate", "toDate", "branch", "selectBranch", "searchBranch", "ledger",
    "selectLedger", "searchLedger", "sl", "slNo", "voucherNo", "narration",
    "debit", "credit", "balance", "total", "to", "headOfAccount", "drAmount",
    "crAmount", "voucherDate", "generatedBy", "generatedOn",
    "thisReportIsGeneratedByPrioSuite",
]:
    mm = re.search(rf'\n      {k}: "([^"]*)"', body)
    print("common." + k, "->", mm.group(1) if mm else "MISSING")
print("voucher ok", bool(re.search(r'\n    voucher: \{[\s\S]*?\n      voucherNo:', t)))
print("accountLedger", bool(re.search(r"\n      accountLedger:\s*\{", t)))
