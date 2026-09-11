const createApi = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/`;

export const endPoints = {
  test: `${createApi}test`,
  login: `${createApi}user/login`,
  getCheckFinYear: `${createApi}Org/CheckFinYear`,
  getLoginFinYear: `${createApi}Org/GetLoginFinYear`,
  getCheckDayBeginStatus: (date, orgId, yearId, branchId) =>
    `${createApi}Org/CheckDayBeginStatus?date=${date}&org_id=${orgId}&year_id=${yearId}&branch_id=${branchId}`,

  postBusinessDays: () =>
    `${createApi}/Org/StartBusinessDays?org_id=${orgId}&year_id=${yearId}&branch_id=${branchId}&date=${date}`,
  postTerminateActiveSession: `${createApi}Org/TerminateActiveSession`,
  getForgotPasswordOtp: (mail, mode) =>
    `${createApi}Org/GenereateOTP/${mail}/${mode}`,
  getVerifyForgotPasswordOtp: (otp, mail) =>
    `${createApi}Org/VerifyOTP/${otp}/${mail}`,
  postNewForgotPassword: `${createApi}Org/ForgotPassword`,
  getUserProfileDetails: `${createApi}Org/GetUserProfile`,
  updateUserProfileDetails: `${createApi}Org/UpdateUserProfile`,
  getFinancialYear: (orgId) =>
    `${createApi}Org/GetFinancialYear?org_id=${orgId}`,
  getSidebarData: (orgId) => `${createApi}Org/GetUserDashboard?org_id=${orgId}`,
  getDashboardItem: `${createApi}Org/GetDashboardItem`,
  getOpeningMemberDataById: (orgId, memberNo) =>
    `${createApi}Org/MemberShip/GetMembershipData?org_id=${orgId}&mem_no=${memberNo}`,
  addOpeningMembership: `${createApi}Org/ProcessOpening/Membership`,
  addOpeningDepositAccount: `${createApi}Org/ProcessOpening/DepositAccount`,
  addOpeningInvestmentAccount: `${createApi}Org/ProcessOpening/Investment`,
  addOpeningBankAccount: `${createApi}Org/ProcessOpening/BankAccount`,
  addOpeningBorrowingsAccount: `${createApi}Org/ProcessOpening/BankBorrowings`,
  addOpeningLoanAccount: `${createApi}Org/ProcessOpening/LoanAccount`,
  getOpeningLedgerBranch: (orgId, branchId) =>
    `${createApi}Org/ProcessOpening/GetBranchList?org_id=${orgId}&branch_id=${branchId}`,
  getOpeningLedgerMainHead: `${createApi}Org/ProcessOpening/GetAcctMainHead`,
  getOpeningLedgerSubHead: (headId) =>
    `${createApi}Org/ProcessOpening/GetSubHead`,
  getOpeningLedger: (orgId, subId) =>
    `${createApi}Org/ProcessOpening/GetLedger?org_id=${orgId}&sub_head=${subId}`,
  addOpeningLedger: `${createApi}Org/ProcessOpening/AddAcctBalance`,
  addDenomination: `${createApi}Org/ProcessOpening/OpnDenomBranch`,
  addMasterState: `${createApi}Org/MasterSetup/AddState`,
  updateMasterState: `${createApi}Org/MasterSetup/UpdateState`,
  getMasterStateData: (id) =>
    `${createApi}Org/MasterSetup/GetStateList?org_id=${id}`,
  addMasterDistrict: `${createApi}Org/MasterSetup/AddDistrict`,
  updateMasterDistrict: `${createApi}Org/MasterSetup/UpdateDist`,
  getMasterDistrictData: (id, page) =>
    `${createApi}Org/MasterSetup/GetDistList?org_id=${id}&page=${page}`,
  getMasterDistrictUnderStateData: (stateId, orgId) =>
    `${createApi}Org/MasterSetup/GetStateWistDist?state_id=${stateId}&org_id=${orgId}`,
  addMasterBlock: `${createApi}Org/MasterSetup/AddBlock`,
  updateMasterBlock: `${createApi}Org/MasterSetup/UpdateBlock`,
  getMasterBlockData: (id, page) =>
    `${createApi}Org/MasterSetup/GetBlockList?org_id=${id}&page=${page}`,
  getMasterBlockUnderDistrictData: (orgId, distId, stateId) =>
    `${createApi}Org/MasterSetup/GetDistWiseBlock?org_id=${orgId}&dist_id=${distId}&state_id=${stateId}`,
  addMasterPoliceStation: `${createApi}Org/MasterSetup/AddPoliceStation`,
  updateMasterPoliceStation: `${createApi}Org/MasterSetup/UpdatePoliceStation`,
  getMasterPoliceStationData: (id, page) =>
    `${createApi}Org/MasterSetup/GetPoliceList?org_id=${id}&page=${page}`,
  getMasterPoliceStationUnderDistrictData: (orgId, distId) =>
    `${createApi}Org/MasterSetup/GetDistWisePolice?org_id=${orgId}&dist_id=${distId}`,
  addMasterPostOffice: `${createApi}Org/MasterSetup/AddPostOffice`,
  updateMasterPostOffice: `${createApi}Org/MasterSetup/UpdatePostOffice`,
  getMasterPostOfficeData: (id, page) =>
    `${createApi}Org/MasterSetup/GetPostOffice?org_id=${id}&page=${page}`,
  getMasterPostOfficeUnderDistrictData: (orgId, distId) =>
    `${createApi}Org/MasterSetup/GetDistWisePost?org_id=${orgId}&dist_id=${distId}`,
  addMasterVillage: `${createApi}Org/MasterSetup/AddVillage`,
  updateMasterVillage: `${createApi}Org/MasterSetup/UpdateVillage`,
  getMasterVillageData: (id, page) =>
    `${createApi}Org/MasterSetup/GetVillageList?org_id=${id}&page=${page}`,
  getMasterVillageUnderBlockData: (orgId, blockId) =>
    `${createApi}Org/MasterSetup/GetBlockWiseVilleage?org_id=${orgId}&block_id=${blockId}`,
  addMasterUnit: `${createApi}Org/MasterSetup/AddUnit`,
  updateMasterUnit: `${createApi}Org/MasterSetup/UpdateUnit`,
  getMasterUnitData: (orgId, page, keyword) =>
    `${createApi}Org/MasterSetup/GetUnitList?org_id=${orgId}&page=${page}&keyword=${keyword}`,
  addSubLedger: `${createApi}Org/MasterSetup/AddSubLedger`,
  updateSubLedger: `${createApi}Org/MasterSetup/UpdateSubLedger`,
  getSubLedgerData: (orgId, branchId, page, keyword) =>
    `${createApi}Org/MasterSetup/GetSubledgerList?org_id=${orgId}&branch_id=${branchId}&page=${page}&keyword=${keyword}`,
  getSubLedgerHeadData: `${createApi}Org/MasterSetup/GetSubLedgHead`,
  getMemberType: (orgId) =>
    `${createApi}Org/Membership/GetMemberType?org_id=${orgId}`,
  getMemberTypeData: (orgId) =>
    `${createApi}OrgSetup/GetMemberType?org_id=${orgId}`,
  getShareProductDetails: (orgId, prodId) =>
    `${createApi}Org/MasterSetup/ShareProductDetails?org_id=${orgId}&prod_id=${prodId}`,
  addShareProduct: `${createApi}Org/MasterSetup/ProcessShareProduct`,
  // GetCashDenom
  getCashDemonData: `${createApi}Org/MasterSetup/GetCashDenom`,
  getRelationTypeData: (orgId) =>
    `${createApi}Org/MasterSetup/GetRelationType?org_id=${orgId}`,
  getGenderData: (orgId) =>
    `${createApi}Org/MasterSetup/GetGender?org_id=${orgId}`,
  getCasteData: (orgId) =>
    `${createApi}Org/MasterSetup/GetCaste?org_id=${orgId}`,
  getReligionData: (orgId) =>
    `${createApi}Org/MasterSetup/GetReligion?org_id=${orgId}`,
  getAgentPayout: (orgId) =>
    `${createApi}Org/MasterSetup/GetAgentPayout?org_id=${orgId}`,
  addDepositAgent: `${createApi}Org/MasterSetup/AddDepositAgent`,
  addDepositInterestSetup: `${createApi}Org/MasterSetup/DepositIntSlab`,
  getPassbookModule: (orgId) =>
    `${createApi}Org/MasterSetup/GetModuleActive?org_id=${orgId}`,
  getPassbookConfig: (orgId, moduleId) =>
    `${createApi}Org/MasterSetup/GetPassbookConfig?org_id=${orgId}&module_id=${moduleId}`,
  addPassbookSettings: `${createApi}Org/MasterSetup/ConfigPassBook`,
  postMemberProfile: `${createApi}Org/MemberShip/AddProfile`,
  updateMemberProfile: `${createApi}Org/MemberShip/UpdateMemberProfile`,
  getUpdateMemberDataById: (orgId, memberNo) =>
    `${createApi}Org/MemberShip/MemberUpdateData?org_id=${orgId}&mem_no=${memberNo}`,
  getMemberDataById: (orgId, memberNo) =>
    `${createApi}Org/MemberShip/GetMemberData?org_id=${orgId}&mem_no=${memberNo}`,
  getMemberDataByName: (orgId, page, name, type) =>
    `${createApi}Org/MemberShip/MemberSearch?org_id=${orgId}&page=${page}&keyword=${name}&type=${type}`,
  getMemberProductData: (orgId, typeId, memberNo) =>
    `${createApi}Org/MemberShip/GetProductData?org_id=${orgId}&type=${typeId}&mem_no=${memberNo}`,
  getCheckBalance: (accountId, date, orgId) =>
    `${createApi}Org/ProcessDeposit/GetBalance?Acct_Id=${accountId}&Date=${date}&org_id=${orgId}`,
  getShareLedger: (accountId, fromDate, toDate, orgId) =>
    `${createApi}Org/MemberShip/GetShareLedger?Acct_Id=${accountId}&form_date=${fromDate}&to_date=${toDate}&org_id=${orgId}`,
  addIssueMembership: `${createApi}Org/MemberShip/AddMembership`,
  getShareIssueDataById: (orgId, memberId, date) =>
    `${createApi}Org/MemberShip/GetShereData?org_id=${orgId}&mem_no=${memberId}&date=${date}`,
  addShareIssue: `${createApi}Org/MemberShip/IssueShare`,
  addShareRefund: `${createApi}Org/MemberShip/RefundShare`,
  addMembershipWithdraw: `${createApi}Org/MemberShip/WithdrwanMembership`,
  getMemberEnquiryInfo: (memberId, fromDate, toDate, orgId) =>
    `${createApi}Org/MemberShip/GetMemberInfo?mem_Id=${memberId}&form_date=${fromDate}&to_date=${toDate}&org_id=${orgId}`,
  getMemberPassbookPrint: (orgId, memberNo, date, sl, mode) =>
    `${createApi}Org/MemberShip/GetPassBookPrint?org_id=${orgId}&member_code=${memberNo}&trans_date=${date}&trans_sl=${sl}&mode=${mode}`,
  updateMemberPassbookTrans: `${createApi}Org/MemberShip/ProcessPassBookUpdate`,
  getMemberReportType: `${createApi}Org/ProcessModuleReport/Membership/GetReportType`,
  getLastDividendPaidDate: (orgId) =>
    `${createApi}Org/MemberShip/GetLastDivPaidDate?org_id=${orgId}`,
  getCalculateDividend: (orgId, fromDate, toDate, dividendRate) =>
    `${createApi}Org/MemberShip/CalculateDividend?org_id=${orgId}&frm_date=${fromDate}&to_date=${toDate}&rate=${dividendRate}`,
  addCalculateDividend: `${createApi}Org/MemberShip/PostDividend`,
  getMemberReportMemberRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    memberId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Membership/MemberRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&mem_id=${memberId}`,
  getMemberReportTransRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    memberId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Membership/TransRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&mem_id=${memberId}`,
  getMemberReportTransRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    memberId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Membership/TransRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&mem_id=${memberId}`,
  getMemberReportWithdrawnRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    memberId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Membership/WithdrwanRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&mem_id=${memberId}`,
  getMemberReportDetailedListData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    memberId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Membership/GetDetailedList?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&mem_id=${memberId}`,
  getMemberReportDividendListData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    memberId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Membership/GetDividendList?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&mem_id=${memberId}`,
  getTransactionShareReceipt: (orgId, transId, date) =>
    `${createApi}Org/ProcessModuleReport/Membership/GetReceipts?org_id=${orgId}&trans_Id=${transId}&date=${date}`,
  getDepositAccountTypeData: (orgId) =>
    `${createApi}Org/ProcessDeposit/GetProdType?org_id=${orgId}`,
  getDepositProductData: (orgId, typeId) =>
    `${createApi}Org/ProcessDeposit/GetProduct?org_id=${orgId}&type=${typeId}`,
  getDurationTypeData: (orgId) =>
    `${createApi}Org/ProcessDeposit/GetDuration?org_id=${orgId}`,
  getDepositInterestRate: (productId, duration, durationUnit, date, orgId) =>
    `${createApi}Org/ProcessDeposit/GetInttRate?prod_id=${productId}&duration=${duration}&duration_unit=${durationUnit}&date=${date}&org_id=${orgId}`,
  getMaturityInstructionData: (orgId) =>
    `${createApi}Org/ProcessDeposit/GetMaturInstruction?org_id=${orgId}`,
  getOperationModeData: (orgId) =>
    `${createApi}Org/ProcessDeposit/GetOperationMode?org_id=${orgId}`,
  getPayoutModeData: (orgId) =>
    `${createApi}Org/ProcessDeposit/GetIntPayoutMode?org_id=${orgId}`,
  checkDepositAmount: (productId, amount, orgId) =>
    `${createApi}Org/ProcessDeposit/CheckAmount?prod_id=${productId}&amount=${amount}&org_id=${orgId}`,
  checkDepositDuration: (productId, duration, durationUnit, orgId) =>
    `${createApi}Org/ProcessDeposit/CheckDuration?prod_id=${productId}&duration=${duration}&duration_unit=${durationUnit}&org_id=${orgId}`,
  getDepositMaturityAmount: (
    productId,
    duration,
    durationUnit,
    amount,
    roi,
    orgId,
  ) =>
    `${createApi}Org/ProcessDeposit/GetMaturityAmt?prod_id=${productId}&duration=${duration}&duration_unit=${durationUnit}&amount=${amount}&roi=${roi}&org_id=${orgId}`,
  getDepositPayoutAmount: (productId, typeId, amount, roi, orgId) =>
    `${createApi}Org/ProcessDeposit/GetPayoutAmount?prod_id=${productId}&type_id=${typeId}&amount=${amount}&roi=${roi}&org_id=${orgId}`,
  getDepositAgentData: (orgId) =>
    `${createApi}Org/MasterSetup/GetDepositAgent?org_id=${orgId}`,
  getDepositEcsAccount: (orgId, memberId) =>
    `${createApi}Org/ProcessDeposit/GetEcsAccount?org_id=${orgId}&memb_id=${memberId}`,
  addDepositAccount: `${createApi}Org/ProcessDeposit/AddDepositAccount`,
  //
  getAccountDetailsByAccountNo: (accountNo, type, date, orgId, prodId) =>
    `${createApi}Org/ProcessDeposit/GetAccountDetails?pAcct_No=${accountNo}&ptype=${type}&date=${date}&org_id=${orgId}&prod_id=${prodId}`,
  getStatusAccountDetailsByAccountNo: (accountNo, date, orgId) =>
    `${createApi}Org/ProcessDeposit/GetStatusAcctData?pAcct_No=${accountNo}&date=${date}&org_id=${orgId}`,
  getAccountList: (orgId, type, value, page) =>
    `${createApi}Org/ProcessDeposit/SearchAccount?org_id=${orgId}&type=${type}&keyword=${value}&page=${page}`,
  getDepositLedger: (accountId, fromDate, toDate, orgId) =>
    `${createApi}Org/ProcessDeposit/GetLedger?Acct_Id=${accountId}&form_date=${fromDate}&to_date=${toDate}&org_id=${orgId}`,
  addDeposit: `${createApi}Org/ProcessDeposit/PostDeposit`,
  addWithdrawn: `${createApi}Org/ProcessDeposit/PostWithdrwan`,
  getSpecimen: (orgId, acctId) =>
    `${createApi}Org/ProcessDeposit/GetSpecimen?org_id=${orgId}&acct_id=${acctId}`,
  getCheckCheque: (orgId, acctId, instrumentNo) =>
    `${createApi}Org/ProcessDeposit/CheckCheque?org_id=${orgId}&Acct_Id=${acctId}&Cheque_No=${instrumentNo}`,
  addWithdrawn: `${createApi}Org/ProcessDeposit/PostWithdrwan`,
  getDepositCloseAccount: (accountNo, date, orgId, prod_id) =>
    `${createApi}Org/ProcessDeposit/GetCloseData?acct_no=${accountNo}&date=${date}&org_id=${orgId}&prod_id=${prod_id}`,
  getSavingsAccountList: (orgId, type, value, page) =>
    `${createApi}Org/ProcessDeposit/SearchOnlySavings?org_id=${orgId}&type=${type}&value=${value}&page=${page}`,
  getDepositMatureAccount: (accountNo, date, orgId, prod_id) =>
    `${createApi}Org/ProcessDeposit/GetMatureData?acct_no=${accountNo}&date=${date}&org_id=${orgId}&prod_id=${prod_id}`,
  addDepositCloseAccount: `${createApi}Org/ProcessDeposit/PostCloseAccount`,
  getDepositMaturityInterest: (accountNo, date, roi, orgId) =>
    `${createApi}Org/ProcessDeposit/CalMatureInterest?acct_no=${accountNo}&date=${date}&man_roi=${roi}&org_id=${orgId}`,
  getDepositMaturityBonusInterest: (accountNo, date, roi, orgId) =>
    `${createApi}Org/ProcessDeposit/CalBonusInterest?acct_no=${accountNo}&date=${date}&roi=${roi}&org_id=${orgId}`,
  addDepositMatureAccount: `${createApi}Org/ProcessDeposit/MatureAccount`,
  addDepositRenewalAccount: `${createApi}Org/ProcessDeposit/ProcessRenewal`,
  getDepositPayoutAccount: (accountNo, date, month, year, mode, type, orgId) =>
    `${createApi}Org/ProcessDeposit/GetPayoutAccount?acct_no=${accountNo}&date=${date}&month=${month}&year=${year}&mode=${mode}&type=${type}&org_id=${orgId}`,
  addDepositSinglePayoutAccount: `${createApi}Org/ProcessDeposit/ProcessSingleInttPayout`,
  addDepositBulkPayoutAccount: `${createApi}Org/ProcessDeposit/ProcessBlkIntPayout`,
  addUploadSpecimen: `${createApi}Org/ProcessDeposit/UploadSpeciman`,
  getDepositReportProductType: (orgId) =>
    `${createApi}Org/ProcessModuleReport/Deposit/GetProduct?org_id=${orgId}`,
  getDepositPassbookPrint: (orgId, accountNo, date, sl, mode, prodId) =>
    `${createApi}Org/ProcessDeposit/GetPassBookPrint?org_id=${orgId}&account_no=${accountNo}&trans_date=${date}&trans_sl=${sl}&mode=${mode}&prod_id=${prodId || ""}`,
  updateDepositPassbookTrans: `${createApi}Org/ProcessDeposit/ProcessPassBookUpdate`,
  getDepositCertificatePrint: (orgId, accountNo) =>
    `${createApi}Org/ProcessDeposit/GetCertificate?org_id=${orgId}&Acct_No=${accountNo}`,
  getChequeAccountDetailsByAccountNo: (orgId, date, accountNo) =>
    `${createApi}Org/ProcessDeposit/GetChequeAccount?org_id=${orgId}&Date=${date}&Acct_No=${accountNo}`,
  addIssueCheque: `${createApi}Org/ProcessDeposit/ProcessChequeBook`,
  getDepositReportType: `${createApi}Org/ProcessModuleReport/Deposit/GetReportType`,
  getStatusList: `${createApi}Org/ProcessDeposit/GetAcctStatus`,
  updateAccountStatus: `${createApi}Org/ProcessDeposit/UpdateAcctStatus`,
  getDepositReportOpeningRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Deposit/OpeningRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getDepositReportTransRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Deposit/TransRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getDepositReportCloseRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Deposit/CloseRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getDepositReportInterestListData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Deposit/GetInterestList?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getDepositReportDetailedListData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Deposit/GetDetailedlist?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getTransactionDepositReceipt: (orgId, transId, date) =>
    `${createApi}Org/ProcessModuleReport/Deposit/GetReceipt?org_id=${orgId}&trans_Id=${transId}&date=${date}`,
  getBankAccountType: (orgId) =>
    `${createApi}Org/ProcessBankAccount/GetAccountType?org_id=${orgId}`,
  getBankGl: (orgId, typeId) =>
    `${createApi}Org/ProcessBankAccount/GetGl?org_id=${orgId}&type_id=${typeId}`,
  addOpenBankAccount: `${createApi}Org/ProcessBankAccount/AddAccount`,
  getBankAccount: (orgId, branch_id) =>
    `${createApi}Org/ProcessBankAccount/GetAccount?org_id=${orgId}&branch_id=${branch_id}`,
  getBankLedger: (orgId, bankId, fromDate, toDate) =>
    `${createApi}Org/ProcessBankAccount/GetLedger?org_id=${orgId}&bank_id=${bankId}&form_date=${fromDate}&to_date=${toDate}`,
  getBankBalance: (orgId, accountId, date) =>
    `${createApi}Org/ProcessBankAccount/GetBalance?org_id=${orgId}&account_id=${accountId}&date=${date}`,
  addBankDeposit: `${createApi}Org/ProcessBankAccount/Deposit`,
  addBankWithdrawn: `${createApi}Org/ProcessBankAccount/Withdrwan`,
  addBankTransfer: `${createApi}Org/ProcessBankAccount/Transfer`,
  addBankCloseAccount: `${createApi}Org/ProcessBankAccount/CloseAccount`,
  getBankReportType: `${createApi}Org/ProcessModuleReport/Bank/GetReportType`,
  getBankReportDetailedListData: (orgId, branchId, fromDate, toDate) =>
    `${createApi}Org/ProcessModuleReport/Bank/GetDetailedList?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}`,
  getLoanMemberInfo: (orgId, memberNo, date) =>
    `${createApi}Org/ProcessLoan/GetMemberInfo?org_id=${orgId}&mem_no=${memberNo}&date=${date}`,
  getLoanProductData: (orgId, typeId) =>
    `${createApi}Org/ProcessLoan/GetProduct?org_id=${orgId}${typeId ? `&prod_type=${typeId}` : ""}`,
  getLoanDurationUnitData: (prodId, orgId) =>
    `${createApi}Org/ProcessLoan/GetDuration?prod_id=${prodId}&org_id=${orgId}`,
  // todo
  getCheckLoanDurationUnitData: (orgId, prodId, duration, durationUnit) =>
    `${createApi}Org/ProcessLoan/CheckDuration?org_id=${orgId}&prod_id=${prodId}&duration=${duration}&dur_unit=${durationUnit}`,
  getLoanRepaymentModeData: (prodId, orgId) =>
    `${createApi}Org/ProcessLoan/GetRepayMode?prod_id=${prodId}&org_id=${orgId}`,
  // getLoanInterestRate: (orgId, prodId) =>
  //   `${createApi}Org/ProcessLoan/GetInterestRate?prod_id=${prodId}&org_id=${orgId}`,
  getCheckLoanSecurity: (orgId, prodId, memberId, date) =>
    `${createApi}Org/ProcessLoan/CheckLoanSecurity?org_id=${orgId}&prod_id=${prodId}&mem_id=${memberId}&date=${date}`,
  getLoanSecurityProduct: (orgId, memberId, date) =>
    `${createApi}Org/ProcessLoan/GetLoanSecurityProd?org_id=${orgId}&mem_id=${memberId}&date=${date}`,
  // todo
  checkLoanAmount: (orgId, productId, amount) =>
    `${createApi}Org/ProcessLoan/CheckAmount?org_id=${orgId}&prod_id=${productId}&amount=${amount}`,
  getLoanEmi: (orgId, principal, roi, duration) =>
    `${createApi}Org/ProcessLoan/GetEmi?org_id=${orgId}&principal=${principal}&roi=${roi}&duration=${duration}`,
  getCheckLoanEligible: (orgId, prodId, memberId, date) =>
    `${createApi}Org/ProcessLoan/EligibleLoan?org_id=${orgId}&prod_id=${prodId}&mem_id=${memberId}&date=${date}`,
  addLoanApplication: `${createApi}Org/ProcessLoan/AddApplication`,
  getDisburseList: (orgId, branchId, date) =>
    `${createApi}Org/ProcessLoan/GetDisbList?org_id=${orgId}&branch_id=${branchId}&date=  ${date}`,
  getLoanAccountSearch: (orgId, mode, memberName, memberNo, page) =>
    `${createApi}Org/ProcessLoan/SearchAccount?org_id=${orgId}&mode=${mode}&member_name=${memberName}&member_no=${memberNo}&page=${page}`,
  getLoanGenerateSchedule: (orgId, acctNo) =>
    `${createApi}Org/ProcessLoan/GenerateSchdule?org_id=${orgId}&acct_id=${acctNo}`,
  getLoanShareDepositBalance: (orgId, prodId, memberId, date) =>
    `${createApi}Org/ProcessLoan/DIsbShareDepBalance?org_id=${orgId}&prod_id=${prodId}&mem_id=${memberId}&date=${date}`,
  getLoanDisburseNeedAmount: (
    orgId,
    prodId,
    memberId,
    date,
    shareBal,
    disbAmount,
  ) =>
    `${createApi}Org/ProcessLoan/GetDisbNeedAmount?org_id=${orgId}&prod_id=${prodId}&mem_id=${memberId}&date=${date}&share_bal=${shareBal}&disb_amount=${disbAmount}`,
  addLoanDisburse: `${createApi}Org/ProcessLoan/DisburseLoan`,
  getLoanRepaymentAccountDetails: (orgId, accountNo, date) =>
    `${createApi}Org/ProcessLoan/GetRepayData?org_id=${orgId}&acct_no=${accountNo}&date=${date}`,
  getGuarranterSecurity: (orgId, accountId) =>
    `${createApi}Org/ProcessLoan/GetLoanGurrSec?org_id=${orgId}&Acct_Id=${accountId}`,
  getLoanLedger: (orgId, accountId, fromDate, toDate) =>
    `${createApi}Org/ProcessLoan/GetLedger?org_id=${orgId}&Acct_Id=${accountId}&form_date=${fromDate}&to_date=${toDate}`,
  addLoanRepayment: `${createApi}Org/ProcessLoan/PostRepay`,
  getLoanPassbookPrint: (orgId, accountNo, date, sl, mode) =>
    `${createApi}Org/ProcessLoan/GetPassBook?org_id=${orgId}&account_no=${accountNo}&trans_date=${date}&trans_sl=${sl}&mode=${mode}`,
  updateLoanPassbookTrans: `${createApi}Org/ProcessLoan/UpdatePassBook`,
  getLoanGuarantorDetails: (orgId, memberNo, date) =>
    `${createApi}Org/ProcessModuleReport/Loan/GuranteerDetails?org_id=${orgId}&mem_no=${memberNo}&date=${date}`,
  deleteGuarantor: `${createApi}Org/ProcessLoan/ReleaseGurantor`,
  getLoanReportType: `${createApi}Org/ProcessModuleReport/Loan/GetReportType`,
  getDefaulterListData: (
    orgId,
    productId,
    asOnDate,
    fromMonth,
    toMonth,
    reportType,
    viewType,
  ) =>
    `${createApi}Org/ProcessModuleReport/Loan/DefaultReport?org_id=${orgId}&prod_id=${productId}&date=${asOnDate}&frm_month=${fromMonth}&to_month=${toMonth}&report_type=${reportType}&view_type=${viewType}`,
  getAccountStatementData: (orgId, accountId, fromDate, toDate) =>
    `${createApi}Org/ProcessModuleReport/Loan/CurrOdLedger?org_id=${orgId}&acct_id=${accountId}&frm_date=${fromDate}&to_date=${toDate}`,
  getLoanReportDisburseRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Loan/GetDisburseRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getLoanReportRepayRegisterData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Loan/GetRepayRegister?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getLoanReportDetailedListData: (
    orgId,
    branchId,
    fromDate,
    toDate,
    productId,
  ) =>
    `${createApi}Org/ProcessModuleReport/Loan/GetDetailedList?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}&prod_id=${productId}`,
  getLoanRepaymentCollectionReceipt: (orgId, transId) =>
    `${createApi}Org/ProcessModuleReport/Loan/GetReceipt?org_id=${orgId}&trans_id=${transId}`,
  getInvestmentType: (orgId) =>
    `${createApi}Org/ProcessInvestment/GetInvestType?org_id=${orgId}`,
  getInvestmentAccountType: (orgId) =>
    `${createApi}Org/ProcessInvestment/GetAccountType?org_id=${orgId}`,
  getInvestmentInterestType: (orgId) =>
    `${createApi}Org/ProcessInvestment/GetInterestType?org_id=${orgId}`,
  getInvestmentDuration: (orgId) =>
    `${createApi}Org/ProcessInvestment/GetDuration?org_id=${orgId}`,
  getInvestmentMatureAmount: (
    orgId,
    accountType,
    amount,
    roi,
    duration,
    intType,
    durtype,
  ) =>
    `${createApi}Org/ProcessInvestment/CalMatureValue?org_id=${orgId}&acct_type=${accountType}&amount=${amount}&roi=${roi}&duration=${duration}&intt_type=${intType}${
      durtype !== undefined && durtype !== null && durtype !== ""
        ? `&dur_type=${durtype}`
        : ""
    }`,
  getInvestmentOpenLedger: (mode, org_id, type, acct_type) =>
    `${createApi}Org/ProcessInvestment/GetLedger?mode=${mode}&org_id=${org_id}&type=${type}&acct_type=${acct_type}`,
  addInvestmentOpenAccount: `${createApi}Org/ProcessInvestment/AddAccount`,
  getInvestmentAccount: (orgId, type) =>
    `${createApi}Org/ProcessInvestment/AccountList?org_id=${orgId}&type=${type}`,
  getInvestmentLedger: (orgId, investId, fromDate, toDate) =>
    `${createApi}Org/ProcessInvestment/GetInvestLedger?org_id=${orgId}&invest_id=${investId}&form_date=${fromDate}&to_date=${toDate}`,
  addInvestmentInterest: `${createApi}Org/ProcessInvestment/InterestPost`,
  addInvestmentInstallmentDeposit: `${createApi}Org/ProcessInvestment/InstallmentPost`,
  getInvestmentRenewalInfo: (orgId, accountNo) =>
    `${createApi}Org/ProcessInvestment/GetInvestInfo?org_id=${orgId}&invest_id=${accountNo}`,
  addInvestmentRenewal: `${createApi}Org/ProcessInvestment/ProcessRenewal`,
  getInvestmentClosingInterest: `${createApi}Org/ProcessInvestment/CalInterest`,
  addInvestmentClose: `${createApi}Org/ProcessInvestment/CloseAccount`,
  getInvestmentReportType: `${createApi}Org/ProcessModuleReport/Investment/GetReportType`,
  getInvestmentReportDetailedListData: (orgId, branchId, fromDate, toDate) =>
    `${createApi}Org/ProcessModuleReport/Investment/GetDetailedList?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}`,
  getBorrowingsProductType: (orgId) =>
    `${createApi}Org/ProcessBorrowings/GetProdType?org_id=${orgId}`,
  getBorrowingsRepayMode: (orgId) =>
    `${createApi}Org/ProcessBorrowings/GetRepayMode?org_id=${orgId}`,
  getBorrowingsLedgerData: (org_id, type) =>
    `${createApi}Org/ProcessBorrowings/GetLedger?org_id=${org_id}&type=${type}`,
  addBorrowingsNewApplication: `${createApi}Org/ProcessBorrowings/AddAccount`,
  getBorrowingsAccount: (orgId, branch_id) =>
    `${createApi}Org/ProcessBorrowings/GetAccountList?org_id=${orgId}&branch_id=${branch_id}`,
  getBorrowingsAccountInfo: (orgId, borrowId, date) =>
    `${createApi}Org/ProcessBorrowings/GetAcctInfo?org_id=${orgId}&borrow_id=${borrowId}&date=${date}`,
  getBorrowingsLedger: (orgId, borrowId, fromDate, toDate, mode) =>
    `${createApi}Org/ProcessBorrowings/GetBorrowLedger?org_id=${orgId}&borrow_id=${borrowId}&form_date=${fromDate}&to_date=${toDate}&mode=${mode}`,
  addBorrowingsTransactionDisburse: `${createApi}Org/ProcessBorrowings/Disburse`,
  addBorrowingsTransactionRepayment: `${createApi}Org/ProcessBorrowings/Repayment`,
  getBorrowingsReportType: `${createApi}Org/ProcessModuleReport/Borrowings/GetReportType`,
  getBorrowingsReportDetailedListData: (orgId, branchId, fromDate, toDate) =>
    `${createApi}Org/ProcessModuleReport/Borrowings/GetDetailedList?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}`,
  getGlBalancingReport: (orgId, branchId, date) =>
    `${createApi}Org/FinancialReporting/Glbalancing?org_id=${orgId}&branch_id=${branchId}&date=${date}`,
  getVoucherLedgerList: (orgId, head_id) =>
    `${createApi}Org/ProcessVoucherEntry/GetLedgerList?org_id=${orgId}&head_id=${head_id}`,
  getLedgerAcctType: (orgId) =>
    `${createApi}Org/ProcessVoucherEntry/GetAcctType?org_id=${orgId}`,
  getLedgerMainHead: (orgId, acctType) =>
    `${createApi}Org/ProcessVoucherEntry/GetMainHead?org_id=${orgId}&acct_type=${acctType}`,
  getLedgerSubHead: (orgId, acctHead) =>
    `${createApi}Org/ProcessVoucherEntry/GetSubHead?org_id=${orgId}&acct_head=${acctHead}`,
  searchLedger: (orgId, acctCat, acctHead, acctSubHead, keyword, page) =>
    `${createApi}Org/ProcessVoucherEntry/SearchLedger?org_id=${orgId}&acct_cat=${acctCat}&acct_head=${acctHead}&acct_sub_head=${acctSubHead}&keyword=${keyword}&page=${page}`,
  getLedger: (orgId, vouchType, ledgerCode) =>
    `${createApi}Org/ProcessVoucherEntry/GetLedger?org_id=${orgId}&vouch_type=${vouchType}&ledger_code=${ledgerCode}`,
  getVoucherSubLedgerList: (orgId, glId, page, keyword) =>
    `${createApi}Org/ProcessVoucherEntry/GetSubLedger?org_id=${orgId}&gl_id=${glId}&page=${page}&search=${keyword}`,
  getVoucherSubLedgerBalance: (orgId, subGlId, type, date) =>
    `${createApi}Org/ProcessVoucherEntry/GetSubLedgerBalance?org_id=${orgId}&subgl_id=${subGlId}&type=${type}&date=${date}`,
  addVoucherEntry: `${createApi}Org/ProcessVoucherEntry/PostVoucher`,
  getAdjustmentVoucherLedgerList: `${createApi}Org/ProcessVoucherEntry/GetAdjLedgerList`,
  addAdjustmentVoucher: `${createApi}Org/ProcessVoucherEntry/PostAdjVoucher`,
  addProvision: `${createApi}Org/ProcessVoucherEntry/PostProvision`,
  getDaybookReport: (orgId, branchId, date) =>
    `${createApi}Org/FinancialReporting/GetDayBook?org_id=${orgId}&branch_id=${branchId}&date=${date}`,
  getCashbookReport: (orgId, branchId, date) =>
    `${createApi}Org/FinancialReporting/GetCashBook?org_id=${orgId}&branch_id=${branchId}&date=${date}`,
  getCashAccountReport: (orgId, branchId, fromDate, toDate) =>
    `${createApi}Org/FinancialReporting/GetCashAcct?org_id=${orgId}&branch_id=${branchId}&form_date=${fromDate}&to_date=${toDate}`,
  getAccountLedgerDataReport: (orgId) =>
    `${createApi}Org/FinancialReporting/GetAcctLedger?org_id=${orgId}`,
  getAccountLedgerReport: (orgId, branchId, fromDate, toDate, ledgerId) =>
    `${createApi}Org/FinancialReporting/GenereateAcctLedger?org_id=${orgId}&branch_id=${branchId}&date=${fromDate}&to_date=${toDate}&ledger_id=${ledgerId}`,
  getReportVoucherList: (
    orgId,
    branchId,
    fromDate,
    toDate,
    mode,
    ledgerId,
    page,
  ) =>
    `${createApi}Org/FinancialReporting/GetVoucherList?org_id=${orgId}&branch_id=${branchId}&frm_date=${fromDate}&to_date=${toDate}&mode=${mode}&ledger_id=${ledgerId}&page=${page}`,
  getReportVoucherDetails: (orgId, txnId) =>
    `${createApi}Org/FinancialReporting/GetVoucherDetails?org_id=${orgId}&trans_id=${txnId}`,
  getTrailBalanceReport: (orgId, branchId, fromDate, toDate) =>
    `${createApi}Org/FinancialReporting/GenereateTrailBalance?org_id=${orgId}&branch_id=${branchId}&frm_date=${fromDate}&to_date=${toDate}`,
  getProfitLossReport: (orgId, branchId, fromDate, toDate) =>
    `${createApi}Org/FinancialReporting/GenereatePlAccount?org_id=${orgId}&branch_id=${branchId}&frm_date=${fromDate}&to_date=${toDate}`,
  getPlAppropiationReport: (orgId, branchId, toDate) =>
    `${createApi}Org/FinancialReporting/GenereatePlAppropriation?org_id=${orgId}&branch_id=${branchId}&to_date=${toDate}`,
  getBalanceSheetReport: (orgId, branchId, toDate) =>
    `${createApi}Org/FinancialReporting/GenereateBalancesheet?org_id=${orgId}&branch_id=${branchId}&to_date=${toDate}`,
  getScrollUserList: (orgId, branchId) =>
    `${createApi}Org/FinancialReporting/GetScrollUser?org_id=${orgId}&branch_id=${branchId}`,
  getUserScrollReport: (orgId, branchId, date, userId) =>
    `${createApi}Org/FinancialReporting/GetUserScroll?org_id=${orgId}&branch_id=${branchId}&date=${date}&user_id=${userId}`,
  getSubLedgerReport: (orgId, subLedgerId, fromDate, toDate) =>
    `${createApi}Org/FinancialReporting/SubrLedger?org_id=${orgId}&acct_id=${subLedgerId}&frm_date=${fromDate}&to_date=${toDate}`,
  getAllUserData: (orgId) => `${createApi}Org/GetAllUserList?org_id=${orgId}`,
  getUserRoleData: `${createApi}Org/GetUserRole`,
  addNewUser: `${createApi}Org/AddUser`,
  getRoleUserData: (orgId) => `${createApi}Org/GetUserList?org_id=${orgId}`,
  getRoleModuleData: (orgId) => `${createApi}Org/GetModuleList?org_id=${orgId}`,
  addUserRoleData: `${createApi}Org/MapUserModule`,
  getMembershipRectifyType: `${createApi}Org/ProcessRectify/Membership/GetRectifyType`,
  getRectifyMembershipDataById: (orgId, memberNo, date, type) =>
    `${createApi}Org/ProcessRectify/Membership/GetRectifyData?org_id=${orgId}&mem_no=${memberNo}&date=${date}&type=${type}`,
  addRectifyMembership: `${createApi}Org/ProcessRectify/Membership/ProcessRectify`,
  getDepositRectifyType: `${createApi}Org/ProcessRectify/Deposit/GetRectifyType`,
  getRectifyDepositDataById: (orgId, accountNo, date, type, prodId) =>
    `${createApi}Org/ProcessRectify/Deposit/GetRectifyData?org_id=${orgId}&acct_no=${accountNo}&date=${date}&type=${type}${
      prodId ? `&prod_id=${prodId}` : ""
    }`,
  addRectifyDeposit: `${createApi}Org/ProcessRectify/Deposit/ProcessRectify`,
  logout: `${createApi}Org/User/ProcessLogOut`,
  getGroupType: (orgId) =>
    `${createApi}Org/MemberShip/GetGroupType?org_id=${orgId}`,
  postGroupProfile: `${createApi}Org/MemberShip/AddGroupProfile`,
  postInstitutionProfile: `${createApi}Org/MemberShip/AddInstProfile`,
  // group profile

  // here is the api for getgropudata
  getGroupUpdateData: (org_id, mem_no) =>
    `${createApi}Org/MemberShip/GroupUpdateData?mem_no=${mem_no}&org_id=${org_id}`,
  // for update the group profile
  groupProfileUpdate: () => {
    return `${createApi}Org/MemberShip/ProcessGrpUpdate`;
  },

  // Instituion Profile
  getInstitutionProfileData: (org_id, mem_no) => {
    return `${createApi}Org/MemberShip/InstUpdateData?mem_no=${mem_no}&org_id=${org_id}`;
  },

  getInstitutionProfileUpdate: () => {
    return `${createApi}Org/MemberShip/UpdateInstProfile`;
  },

  CheckAllowProcessDeposit: (org_id, prod_id, cust_type) => {
    return `${createApi}Org/ProcessDeposit/CheckAllow?org_id=${org_id}&prod_id=${prod_id}&cust_type=${cust_type}`;
  },

  GetGrpInstData: (org_id, type, mem_no) => {
    return `${createApi}Org/MemberShip/GetGrpInstData?org_id=${org_id}&type=${type}&mem_no=${mem_no}`;
  },

  GetGrpDesig: (orgId) =>
    `${createApi}Org/MemberShip/GetGrpDesig?org_id=${orgId}`,
  GetInstDesig: (orgId) =>
    `${createApi}Org/MemberShip/GetInstDesig?org_id=${orgId}`,

  GetEcsAccount: (org_id, memb_id) => {
    return `${createApi}Org/ProcessDeposit/GetEcsAccount?org_id=${org_id}&memb_id=${memb_id}`;
  },

  PostMapGrpInstMember: `${createApi}Org/MemberShip/MapGrpInstMember`,
  UpdateMapMember: `${createApi}Org/MemberShip/UpdateMapMember`,
  DeleteMapMember: `${createApi}Org/MemberShip/RemoveMapMember`,
  GetGrpInstMember: (org_id, parr_id) => {
    return `${createApi}Org/MemberShip/GetGrpInstMember?org_id=${org_id}&parr_id=${parr_id}`;
  },

  GetProdType: (orgId) =>
    `${createApi}Org/ProcessLoan/GetProdType?org_id=${orgId}`,
  GetCheckProdEligible: (orgId, prodId, custType) => {
    return `${createApi}Org/ProcessLoan/CheckProdEligible?org_id=${orgId}&prod_id=${prodId}&cust_type=${custType}`;
  },

  GetLoanPurpose: (org_id) =>
    `${createApi}Org/ProcessLoan/GetLoanPurpose?org_id=${org_id}`,
  GetDeductionList: (orgId, prodid, amt, mode, share_bal, mem_id, date) => {
    return `${createApi}Org/ProcessLoan/GetDeductionList?org_id=${orgId}&prod_id=${prodid}&amt=${amt}&mode=${mode}&share_bal=${share_bal}&mem_id=${mem_id}&date=${date}`;
  },

  // sevingsInterestCalculate
  getOperateProduct: (orgId, screen) => {
    return `${createApi}Org/ProcessDeposit/GetOperateProduct?org_id=${orgId}&screen=${screen}`;
  },
  checkParam: (orgId, prod_id) => {
    return `${createApi}Org/ProcessDeposit/Interest/CheckParam?org_id=${orgId}&prod_id=${prod_id}`;
  },
  runProcess: (org_id, prod_id, frm_date, to_date, branch_id) => {
    return `${createApi}Org/ProcessDeposit/Interest/RunProcess?org_id=${org_id}&prod_id=${prod_id}&frm_date=${frm_date}&to_date=${to_date}&branch_id=${branch_id}`;
  },
  PostLedger: `${createApi}Org/ProcessDeposit/Interest/PostLedger`,
  getOperateProduct: (orgId, screen) => {
    return `${createApi}Org/ProcessDeposit/GetOperateProduct?org_id=${orgId}&screen=${screen}`;
  },
  getSubHead: (orgId) => {
    return `${createApi}Org/ProcessVoucherEntry/GetSubHead?org_id=${orgId}`;
  },
  getType: (orgId) => {
    return `${createApi}Org/ProcessDeposit/Charge/GetType?org_id=${orgId}`;
  },
  getParam: (orgId, charge_id, prod_id) => {
    return `${createApi}Org/ProcessDeposit/Charge/GetParam?org_id=${orgId}&charge_id=${charge_id}&prod_id=${prod_id}`;
  },
  getList: (charge_id, prod_id, date, branch_id, org_id) => {
    return `${createApi}Org/ProcessDeposit/Charge/GetList?charge_id=${charge_id}&prod_id=${prod_id}&date=${date}&branch_id=${branch_id}&org_id=${org_id}`;
  },

  PostLedgerCharge: `${createApi}Org/ProcessDeposit/Charge/PostLedger`,
  // approval banking
  ApprovalbankingGetList: (org_id, branch_id) => {
    return `${createApi}Org/ProcessApproval/Banking/GetList?org_id=${org_id}&branch_id=${branch_id}`;
  },
  ApprovalbankingGetDetails: (org_id, type_id, type) => {
    return `${createApi}Org/ProcessApproval/Banking/GetDetails?org_id=${org_id}&type_id=${type_id}&type=${type}`;
  },
  ApprovalbankingUpdateAccount: `${createApi}Org/ProcessBankAccount/UpdateAccount`,
  ApprovalbankingApprvReject: `${createApi}Org/ProcessApproval/Banking/ApprvReject`,
  CalClosingInterest: (org_id, acct_id, date) => {
    return `${createApi}Org/ProcessDeposit/CalClosingInterest?org_id=${org_id}&acct_id=${acct_id}&date=${date}`;
  },
  InvestmentApprovalGetList: (org_id, branch_id) => {
    return `${createApi}Org/ProcessApproval/Investment/GetList?org_id=${org_id}&branch_id=${branch_id}`;
  },
  InvestmentApprovalGetDetails: (org_id, type_id, type) => {
    return `${createApi}Org/ProcessApproval/Investment/GetDetails?org_id=${org_id}&type_id=${type_id}&type=${type}`;
  },
  InvestmentApprovalApprvReject: `${createApi}Org/ProcessApproval/Investment/ApprvReject`,
  BorrowingsGetList: (org_id, branch_id) => {
    return `${createApi}Org/ProcessApproval/Borrowings/GetList?org_id=${org_id}&branch_id=${branch_id}`;
  },
  BorrowingsApprvReject: `${createApi}Org/ProcessApproval/Borrowings/ApprvReject`,
  VoucherGetList: (org_id, branch_id) => {
    return `${createApi}Org/ProcessApproval/Voucher/GetList?org_id=${org_id}&branch_id=${branch_id}`;
  },
  VoucherGetDetails: (org_id, type_id) => {
    return `${createApi}Org/ProcessApproval/Voucher/GetDetails?org_id=${org_id}&type_id=${type_id}`;
  },
  VoucherApprvReject: `${createApi}Org/ProcessApproval/Transactions/ApprvReject`,
  GetSecurityType: (org_id) => {
    return `${createApi}Org/ProcessLoan/GetSecurityType?org_id=${org_id}`;
  },
  LoanGetList: (org_id, branch_id) => {
    return `${createApi}Org/ProcessApproval/Loan/GetList?org_id=${org_id}&branch_id=${branch_id}`;
  },
  LoanGetDetails: (org_id, appl_id, branch_id) => {
    return `${createApi}Org/ProcessApproval/Loan/GetDetails?org_id=${org_id}&appl_id=${appl_id}&branch_id=${branch_id}`;
  },
  LoanApprvReject: `${createApi}Org/ProcessApproval/Loan/ApprvReject`,
  UpdateDayBegin: `${createApi}Org/UpdateDayBegin`,
  ProcessCheckPassword: `${createApi}Org/ProcessCheckPassword`,

  LoanGetProduct: (org_id) => {
    return `${createApi}Org/ProcessModuleReport/Loan/GetProduct?org_id=${org_id}`;
  },

};
