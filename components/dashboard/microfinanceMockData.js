export const microfinanceStatCards = [
  {
    id: "glp",
    label: "Gross Loan Portfolio",
    value: "₹33,814.66",
    subLabel: "Disbursed: ₹40,000",
    badge: { text: "100% Qualifying", tone: "success" },
    icon: "wallet",
    accentColor: "blue",
  },
  {
    id: "collection",
    label: "Collection Efficiency",
    value: "99.4%",
    subLabel: "MTD: ₹15,400",
    extraLabel: "Today: ₹3,788",
    icon: "trending-up",
    accentColor: "green",
  },
  {
    id: "par",
    label: "Portfolio at Risk (PAR 30+)",
    value: "0%",
    subLabel: "PAR 90 (NPA): 0.00%",
    badge: { text: "Healthy Asset", tone: "success" },
    icon: "alert-triangle",
    accentColor: "orange",
  },
  {
    id: "borrowers",
    label: "Active Borrowers",
    value: "1 Clients",
    subLabel: "1 Kendras",
    extraLabel: "1 Active JLGs",
    icon: "users",
    accentColor: "purple",
  },
];

export const liquidFunds = {
  totalLabel: "Total Liquid Funds",
  total: 78352.63,
  cashInHand: 35652.63,
  bankBalance: 43300,
  footerLabel: "Real-time CBS Cashbook",
  footerLinkText: "Open Full General Ledger →",
};

export const fieldAgents = [
  {
    id: "1",
    name: "Priya Sharma",
    code: "FCO-01",
    assignedKendras: "K-12, K-14",
    todayTarget: 12000,
    collected: 9800,
    liveFieldWallet: 9800,
    status: "In Field",
  },
  {
    id: "2",
    name: "Amit Roy",
    code: "FCO-02",
    assignedKendras: "K-07, K-09",
    todayTarget: 10000,
    collected: 10000,
    liveFieldWallet: 4200,
    status: "Returning to Vault",
  },
  {
    id: "3",
    name: "Suman Das",
    code: "FCO-03",
    assignedKendras: "K-03",
    todayTarget: 8000,
    collected: 6500,
    liveFieldWallet: 6500,
    status: "In Field",
  },
];

export const branchLiquidity = [
  {
    id: "1",
    name: "Head Office",
    localName: "প্রধান কার্যালয়",
    activeLoanBook: 18500,
    todaysCollection: 2100,
    branchVaultCash: 15652.63,
    openLoans: 12,
    recoveryPct: 98.5,
  },
  {
    id: "2",
    name: "North Branch",
    localName: "উত্তর শাখা",
    activeLoanBook: 9200,
    todaysCollection: 980,
    branchVaultCash: 11200,
    openLoans: 8,
    recoveryPct: 97.2,
  },
  {
    id: "3",
    name: "South Branch",
    localName: "দক্ষিণ শাখা",
    activeLoanBook: 6114.66,
    todaysCollection: 708,
    branchVaultCash: 8800,
    openLoans: 5,
    recoveryPct: 99.1,
  },
];

export const cashTally = {
  isReconciled: true,
  variance: -127330,
  denominations: [
    { id: "500", label: "₹500 Notes", count: 400, value: 200000 },
    { id: "200", label: "₹200 Notes", count: 150, value: 30000 },
    { id: "100", label: "₹100 Notes", count: 200, value: 20000 },
    { id: "50", label: "₹50 Notes", count: 180, value: 9000 },
    { id: "20", label: "₹20 Notes", count: 160, value: 3200 },
    { id: "10", label: "₹10 Notes", count: 87, value: 870 },
  ],
};

export const npaMetrics = [
  {
    id: "gross",
    label: "GROSS NPA (DR 121230)",
    value: "₹ 5,100",
    subLabel: "মোট নন-পারফর্মিং সম্পদ",
    tone: "danger",
  },
  {
    id: "net",
    label: "NET NPA %",
    value: "0.03%",
    subLabel: "Well within RBI limits (<3%)",
    tone: "success",
  },
];
