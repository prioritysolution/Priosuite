import {
  UserRound,
  BadgePlus,
  Share2,
  Search,
  Wallet,
  PiggyBank,
  BanknoteArrowDown,
  BookOpen,
  FilePlus2,
  HandCoins,
  BookMarked,
  ScrollText,
} from "lucide-react";

export const quickActionGroups = [
  {
    id: "membership",
    title: "Membership",
    items: [
      {
        id: "member-profile",
        label: "Member Profile",
        icon: UserRound,
        href: "/membership/memberProfile",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-700",
      },
      {
        id: "issue-membership",
        label: "Issue Membership",
        icon: BadgePlus,
        href: "/membership/issueMembership",
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-700",
      },
      {
        id: "share-issue",
        label: "Share Issue",
        icon: Share2,
        href: "/membership/shareIssue",
        iconBg: "bg-violet-50",
        iconColor: "text-violet-700",
      },
      {
        id: "member-enquiry",
        label: "Member Enquiry",
        icon: Search,
        href: "/membership/memberEnquiry",
        iconBg: "bg-sky-50",
        iconColor: "text-sky-700",
      },
    ],
  },
  {
    id: "deposit",
    title: "Deposit",
    items: [
      {
        id: "open-deposit-account",
        label: "Open Deposit Account",
        icon: Wallet,
        href: "/deposit/openDepositAccount",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-700",
      },
      {
        id: "deposit",
        label: "Deposit",
        icon: PiggyBank,
        href: "/deposit/deposit",
        iconBg: "bg-teal-50",
        iconColor: "text-teal-700",
      },
      {
        id: "withdrawn",
        label: "Withdrawal",
        icon: BanknoteArrowDown,
        href: "/deposit/withdrawn",
        iconBg: "bg-rose-50",
        iconColor: "text-rose-700",
      },
      {
        id: "passbook",
        label: "Passbook",
        icon: BookOpen,
        href: "/deposit/passbookPrint",
        iconBg: "bg-cyan-50",
        iconColor: "text-cyan-700",
      },
    ],
  },
  {
    id: "loan",
    title: "Loan",
    items: [
      {
        id: "new-application",
        label: "New Application",
        icon: FilePlus2,
        href: "/loan/newApplication",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-700",
      },
      {
        id: "repayment",
        label: "Repayment",
        icon: HandCoins,
        href: "/loan/repayment",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-700",
      },
    ],
  },
  {
    id: "report",
    title: "Reports",
    items: [
      {
        id: "daybook",
        label: "Daybook",
        icon: BookMarked,
        href: "/report/daybook",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-700",
      },
      {
        id: "user-scroll",
        label: "User Scroll",
        icon: ScrollText,
        href: "/report/userScroll",
        iconBg: "bg-stone-100",
        iconColor: "text-stone-700",
      },
    ],
  },
];

/** Flat list kept for any consumer that still expects `quickActions`. */
export const quickActions = quickActionGroups.flatMap((group) => group.items);
