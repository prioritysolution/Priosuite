import {
  Users,
  Landmark,
  HandCoins,
  ArrowLeftRight,
  UserPlus,
  Wallet,
  PiggyBank,
  FilePlus2,
  BellRing,
  FileBarChart,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Percent,
} from "lucide-react";

export const statCards = [
  {
    id: "members",
    label: "Total Members",
    value: "5,842",
    change: "4.35% from last month",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "deposits",
    label: "Total Deposits",
    value: "₹ 28.75 Cr",
    change: "6.21% from last month",
    icon: Landmark,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "loans",
    label: "Total Loans",
    value: "₹ 18.45 Cr",
    change: "3.18% from last month",
    icon: HandCoins,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "transactions",
    label: "Total Transactions",
    value: "12,985",
    change: "8.42% from last month",
    icon: ArrowLeftRight,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
];

export const depositsLoansTrend = [
  { month: "Jan", deposits: 18, loans: 11 },
  { month: "Feb", deposits: 21, loans: 13 },
  { month: "Mar", deposits: 22, loans: 14.5 },
  { month: "Apr", deposits: 24.5, loans: 15 },
  { month: "May", deposits: 26, loans: 16 },
  { month: "Jun", deposits: 27, loans: 15.5 },
  { month: "Jul", deposits: 28.75, loans: 18.45 },
];

export const accountsOverview = [
  {
    id: "savings",
    label: "Savings",
    value: 6125,
    percent: "69.9%",
    color: "#2563eb",
    dotClass: "bg-blue-600",
  },
  {
    id: "current",
    label: "Current",
    value: 1842,
    percent: "21.0%",
    color: "#16a34a",
    dotClass: "bg-green-600",
  },
  {
    id: "rd",
    label: "RD",
    value: 542,
    percent: "6.2%",
    color: "#f97316",
    dotClass: "bg-orange-500",
  },
  {
    id: "fd",
    label: "FD",
    value: 243,
    percent: "2.8%",
    color: "#ef4444",
    dotClass: "bg-red-500",
  },
];

export const totalAccounts = accountsOverview.reduce(
  (sum, slice) => sum + slice.value,
  0,
);

export const recentTransactions = [
  {
    id: "t1",
    title: "Cash Deposit",
    account: "A/c No: 10023456",
    amount: "₹ 25,000",
    time: "Today, 10:30 AM",
    icon: ArrowDownToLine,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "t2",
    title: "Cash Withdrawal",
    account: "A/c No: 10015566",
    amount: "₹ 10,000",
    time: "Today, 09:45 AM",
    icon: ArrowUpFromLine,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    id: "t3",
    title: "NEFT Received",
    account: "A/c No: 10024567",
    amount: "₹ 50,000",
    time: "Yesterday, 04:15 PM",
    icon: Send,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "t4",
    title: "Interest Credited",
    account: "A/c No: 10023456",
    amount: "₹ 1,250",
    time: "Yesterday, 11:20 AM",
    icon: Percent,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
];

export const quickActions = [
  {
    id: "add-member",
    label: "Add Member",
    description: "Register a new society member",
    icon: UserPlus,
    href: "/membership/issueMembership",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "open-account",
    label: "Open Account",
    description: "Open a new deposit account",
    icon: Wallet,
    href: "/deposit/openDepositAccount",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "new-deposit",
    label: "New Deposit",
    description: "Accept cash or bank deposit",
    icon: PiggyBank,
    href: "/deposit/deposit",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    id: "new-loan",
    label: "New Loan",
    description: "Start a new loan application",
    icon: FilePlus2,
    href: "/loan/newApplication",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "send-notice",
    label: "Send Notice",
    description: "Review pending membership notices",
    icon: BellRing,
    href: "/approval/membership",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "view-reports",
    label: "View Reports",
    description: "Open daybook and reports",
    icon: FileBarChart,
    href: "/report/daybook",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
  },
];

export const pendingApprovals = [
  {
    id: "loan-applications",
    label: "Loan Applications",
    count: 18,
    href: "/approval/Loanapproal",
    icon: HandCoins,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    badgeClass: "bg-violet-100 text-violet-700",
  },
  {
    id: "new-members",
    label: "New Member Requests",
    count: 7,
    href: "/approval/membership",
    icon: UserPlus,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
];

export const systemAlerts = [
  {
    id: "a1",
    message: "3 loan applications pending for more than 7 days",
    href: "/approval/Loanapproal",
  },
  {
    id: "a2",
    message: "KYC pending for 25 members",
    href: "/approval/kyc",
  },
];

const formatCount = (value) => {
  const num = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("en-IN");
};

export const getStatCards = (dashboardItemData) => {
  if (!dashboardItemData) return statCards;

  return statCards.map((card) => {
    if (card.id === "members" && dashboardItemData.Member != null) {
      return { ...card, value: formatCount(dashboardItemData.Member) };
    }
    if (card.id === "deposits" && dashboardItemData.Mem_Deposit != null) {
      return { ...card, value: `₹ ${dashboardItemData.Mem_Deposit}` };
    }
    if (card.id === "loans" && dashboardItemData.Demand_Loan != null) {
      return { ...card, value: `₹ ${dashboardItemData.Demand_Loan}` };
    }
    if (card.id === "transactions" && dashboardItemData.Deposit != null) {
      return { ...card, value: formatCount(dashboardItemData.Deposit) };
    }
    return card;
  });
};
