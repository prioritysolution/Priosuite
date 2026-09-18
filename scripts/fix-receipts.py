# -*- coding: utf-8 -*-
"""Fix remaining ShareIssueReceipt static strings (both copies)."""
from pathlib import Path

files = [
    Path("components/membership/shareIssue/ShareIssueReceipt.jsx"),
    Path("components/membership/issueMembership/ShareIssueReceipt.jsx"),
]

reps = [
    (
        """        <DialogHeader className="justify-center text-2xl font-medium">
          Share Issue Receipt
        </DialogHeader>""",
        """        <DialogHeader className="justify-center text-2xl font-medium">
          {t("membership.shareIssueReceipt.title")}
        </DialogHeader>""",
    ),
    (
        """                    <p className=" w-full h-1/2  text-center bg-black flex items-center justify-center text-white font-semibold">
                      Receipt No
                    </p>""",
        """                    <p className=" w-full h-1/2  text-center bg-black flex items-center justify-center text-white font-semibold">
                      {t("membership.shareIssueReceipt.receiptNo")}
                    </p>""",
    ),
    (
        """                    <p className="h-6 border-b-2 border-black flex items-center justify-center uppercase text-sm font-medium flex-shrink-0 flex-grow-0">
                      Particulars
                    </p>""",
        """                    <p className="h-6 border-b-2 border-black flex items-center justify-center uppercase text-sm font-medium flex-shrink-0 flex-grow-0">
                      {t("membership.shareIssueReceipt.particulars")}
                    </p>""",
    ),
    (
        "                          Total Rs.\n",
        '                          {t("membership.shareIssueReceipt.totalRs")}\n',
    ),
    (
        """                    <p className="h-6 border-b-2 border-black flex items-center justify-center text-sm  font-medium flex-shrink-0 flex-grow-0">
                      AMOUNT
                    </p>""",
        """                    <p className="h-6 border-b-2 border-black flex items-center justify-center text-sm  font-medium flex-shrink-0 flex-grow-0">
                      {t("membership.shareIssueReceipt.amount")}
                    </p>""",
    ),
    (
        "                        Cashier\n",
        '                        {t("membership.shareIssueReceipt.cashier")}\n',
    ),
]

for path in files:
    text = path.read_text(encoding="utf-8")
    for a, b in reps:
        c = text.count(a)
        if c == 0:
            print("WARN", path.name, repr(a[:50]))
        text = text.replace(a, b)
    path.write_text(text, encoding="utf-8")
    print("updated", path)
