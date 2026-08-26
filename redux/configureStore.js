"use client";
import { configureStore } from "@reduxjs/toolkit";
import demoSlice from "./demoReducer"; // <--- Not for use, this is just an example
// import loginSlice from "@/container/auth/login/LoginReducer";
import loginSlice from "../container/auth/login/LoginReducer";
import sidebarSlice from "../container/sidebar/SidebarReducer";
import footerSlice from "../container/footer/FooterReducer";
import ledgerBalanceSlice from "../container/opening/ledgerBalance/LedgerBalanceReducer";
import operationalAreaSlice from "../container/master/operationalArea/OperationalAreaReducer";
import subLedgerSlice from "../container/master/subLedger/SubLedgerReducer";
import issueMembershipSlice from "../container/membership/issueMembership/IssueMembershipReducer";
import memberProfileSlice from "../container/membership/memberProfile/MemberProfileReducer";
import groupProfileSlice from "../container/membership/groupProfile/GroupProfileReducer";
import memberReportSlice from "../container/membership/report/MemberReportReducer";
import shareProductSlice from "../container/master/shareProduct/ShareProductReducer";
import depositInterestSetupSlice from "../container/master/depositInterestMaster/DepositInterestSetupReducer";
import depositAgentSlice from "../container/master/depositAgent/DepositAgentReducer";
import passbookSettingsSlice from "../container/master/passbookSettings/PassbookSettingsReducer";
import openDepositAccountSlice from "../container/deposit/openDepositAccount/OpenDepositAccountReducer";
import depositSlice from "../container/deposit/deposit/DepositReducer";
import depositReportSlice from "../container/deposit/report/DepositReportReducer";
import openBankAccountSlice from "../container/banking/openBankAccount/OpenBankAccountReducer";
import bankDepositSlice from "../container/banking/bankDeposit/BankDepositReducer";
import interestPayoutSlice from "../container/deposit/interestPayout/InterestPayoutReducer";
import newApplicationSlice from "../container/loan/newApplication/NewApplicationReducer";
import disburseSlice from "../container/loan/disburse/DisburseReducer";
import repaymentSlice from "../container/loan/repayment/RepaymentReducer";
import investmentOpenAccountSlice from "../container/investment/investmentOpenAccount/InvestmentOpenAccountReducer";
import investmentInterestSlice from "../container/investment/investmentInterest/InvestmentInterestReducer";
import borrowingsNewApplicationSlice from "../container/borrowings/newApplication/NewApplicationReducer";
import borrowingTransactionSlice from "../container/borrowings/transaction/TransactionReducer";
import daybookSlice from "../container/report/daybook/DaybookReducer";
import accountLedgerSlice from "../container/report/accountLedger/AccountLedgerReducer";
import voucherEntrySlice from "../container/voucher/voucherEntry/VoucherEntryReducer";
import createUserSlice from "../container/tools/createUser/CreateUserReducer";
import userRoleSlice from "../container/tools/userRole/UserRoleReducer";
import membershipSlice from "../container/rectify/membership/MembershipReducer";
import membershipApprovalReducer from "@/container/approval/membership/MembershipReducer";
import depositRectifySlice from "../container/rectify/deposit/DepositReducer";
import kycSlice from "../container/approval/kyc/KycReducer";
import mapGroupMemberSlice from "../container/membership/mapgroupmember/mapgroupmemberReduces";
import DepositApprovalReducer from "@/container/approval/deposit/DepositApprovalReducer";
import adminDashboardSlice from "../container/AdminDashboard/adminReducer";
import passbookPrintSlice from "../container/deposit/passbookPrint/passbookPrintReducer";
import sevingsInterestCalculateSlice from "../container/deposit/sevingsInterestCalculate/sevingsInterestCalculateReducer";
import matureSlice from "../container/deposit/mature/MatureReducer";
import chargeDeductionSlice from "../container/deposit/chargeDeduction/chargeDeductionReducer";
import approvalbankingSlice from "../container/approval/Approvalbanking/ApprovalbankingReducer";
import investmentApprovalSlice from "../container/approval/Investmentapproval/InvestmentapprovalReducer";
import borrowingsApprovalSlice from "../container/approval/Borrowingsapproval/BorrowingsapprovalReducer";
import voucherApprovalSlice from "../container/approval/Voucherapprova/VoucherapprovaReducer";
import loanReportSlice from "../container/loan/report/LoanReportReducer";

export const store = configureStore({
  reducer: {
    abc: demoSlice,
    login: loginSlice,
    sidebar: sidebarSlice,
    footer: footerSlice,
    ledgerBalance: ledgerBalanceSlice,
    operationalArea: operationalAreaSlice,
    subLedger: subLedgerSlice,
    issueMembership: issueMembershipSlice,
    memberProfile: memberProfileSlice,
    groupProfile: groupProfileSlice,
    memberReport: memberReportSlice,
    shareProduct: shareProductSlice,
    depositInterestSetup: depositInterestSetupSlice,
    depositAgent: depositAgentSlice,
    passbookSettings: passbookSettingsSlice,
    openDepositAccount: openDepositAccountSlice,
    deposit: depositSlice,
    depositReport: depositReportSlice,
    openBankAccount: openBankAccountSlice,
    bankDeposit: bankDepositSlice,
    interestPayout: interestPayoutSlice,
    newApplication: newApplicationSlice,
    disburse: disburseSlice,
    repayment: repaymentSlice,
    investmentOpenAccount: investmentOpenAccountSlice,
    investmentInterest: investmentInterestSlice,
    borrowingsNewApplication: borrowingsNewApplicationSlice,
    borrowingTransaction: borrowingTransactionSlice,
    daybook: daybookSlice,
    accountLedger: accountLedgerSlice,
    voucherEntry: voucherEntrySlice,
    createUser: createUserSlice,
    userRole: userRoleSlice,
    rectifyMembership: membershipSlice,
    rectifyDeposit: depositRectifySlice,
    kyc: kycSlice,
    membershipApproval: membershipApprovalReducer,
    mapGroupMember: mapGroupMemberSlice,
    depositApproval: DepositApprovalReducer,
    adminDashboard: adminDashboardSlice,
    passbookPrint: passbookPrintSlice,
    sevingsInterestCalculate: sevingsInterestCalculateSlice,
    chargeDeduction: chargeDeductionSlice,
    mature: matureSlice,
    approvalbanking: approvalbankingSlice,
    investmentApproval: investmentApprovalSlice,
    borrowingsApproval: borrowingsApprovalSlice,
    voucherApproval: voucherApprovalSlice,
    loanReport: loanReportSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat((store) => (next) => (action) => {
      console.groupCollapsed(action.type);
      console.info("dispatching", action);
      const result = next(action);
      console.log("next state", store.getState());
      console.groupEnd();
      return result;
    }),
});
