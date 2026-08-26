import {
  Wallet,
  Landmark,
  Lock,
  Building2,
  ArrowLeftRight,
  ShieldCheck,
  FileText,
  ScrollText,
  BadgeCheck,
} from "lucide-react";

export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return amount;
  return `₹ ${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const memberSummaryCards = [
  {
    id: "total-balance",
    label: "Total Balance",
    labelColor: "text-emerald-600",
    value: "₹ 2,45,680.50",
    subtext: "Available Balance",
    icon: Wallet,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    maskable: true,
  },
  {
    id: "savings",
    label: "Savings Account",
    labelColor: "text-blue-600",
    value: "₹ 1,25,680.50",
    subtext: "A/c No: 10023456789",
    icon: Landmark,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "fixed-deposits",
    label: "Fixed Deposits",
    labelColor: "text-violet-600",
    value: "₹ 1,00,000.00",
    subtext: "Total in 2 FD Accounts",
    icon: Lock,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    id: "active-loans",
    label: "Active Loans",
    labelColor: "text-orange-600",
    value: "₹ 75,000.00",
    subtext: "Total Outstanding",
    icon: Building2,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    valueColor: "text-orange-600",
  },
];

export const memberTransactions = [
  {
    id: "txn-1",
    date: "20 May 2024",
    description: "Cash Deposit",
    accountNo: "10023456789",
    type: "credit",
    amount: 20000.0,
    balance: 125680.5,
  },
  {
    id: "txn-2",
    date: "18 May 2024",
    description: "NEFT Received",
    accountNo: "10023456789",
    type: "credit",
    amount: 15000.0,
    balance: 105680.5,
  },
  {
    id: "txn-3",
    date: "16 May 2024",
    description: "UPI Payment",
    accountNo: "10023456789",
    type: "debit",
    amount: 2450.0,
    balance: 90680.5,
  },
  {
    id: "txn-4",
    date: "15 May 2024",
    description: "Cash Withdrawal",
    accountNo: "10023456789",
    type: "debit",
    amount: 5000.0,
    balance: 93130.5,
  },
  {
    id: "txn-5",
    date: "14 May 2024",
    description: "Interest Credited",
    accountNo: "10023456789",
    type: "credit",
    amount: 680.5,
    balance: 98130.5,
  },
];

export const accountDetails = [
  { label: "Account Number", value: "10023456789" },
  { label: "Account Type", value: "Savings" },
  { label: "IFSC Code", value: "SBCR0001234" },
  { label: "Available Balance", value: "₹ 1,25,680.50", highlight: true },
];

export const memberQuickActions = [
  {
    id: "fund-transfer",
    label: "Fund Transfer",
    icon: ArrowLeftRight,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    href: "/banking/transfer",
  },
  {
    id: "open-fd",
    label: "Open Fixed Deposit",
    icon: ShieldCheck,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    href: "/deposit/openDepositAccount",
  },
  {
    id: "apply-loan",
    label: "Apply for Loan",
    icon: FileText,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    href: "/loan/newApplication",
  },
  {
    id: "download-passbook",
    label: "Download Passbook",
    icon: ScrollText,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    href: "/deposit/passbookPrint",
  },
  {
    id: "update-kyc",
    label: "Update KYC",
    icon: BadgeCheck,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    href: "/approval/kyc",
  },
];

const parseAmount = (value) => {
  if (value == null || value === "") return null;
  const num = Number(String(value).replace(/,/g, ""));
  return Number.isNaN(num) ? null : num;
};

export const getMemberSummaryCards = (dashboardItemData) => {
  if (!dashboardItemData) return memberSummaryCards;

  return memberSummaryCards.map((card) => {
    if (card.id === "total-balance") {
      const amount = parseAmount(dashboardItemData.Mem_Deposit);
      if (amount != null) return { ...card, value: formatCurrency(amount) };
    }
    if (card.id === "savings") {
      const amount = parseAmount(dashboardItemData.Bank_Deposit);
      if (amount != null) return { ...card, value: formatCurrency(amount) };
    }
    if (card.id === "active-loans") {
      const amount = parseAmount(dashboardItemData.Demand_Loan);
      if (amount != null) return { ...card, value: formatCurrency(amount) };
    }
    return card;
  });
};
