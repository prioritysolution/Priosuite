import { createSlice } from "@reduxjs/toolkit";

// mst_appl_option Opt_Grp_Id = 6 (Loan Type)
export const LOAN_TYPE_OPTIONS = [
  { Id: 1, Option_Value: "EMI Based" },
  { Id: 2, Option_Value: "Non-EMI Based" },
  { Id: 3, Option_Value: "EMI Based Fixed Principal" },
];

// mst_appl_option Opt_Grp_Id = 10 (Loan Overdue Charge)
export const OVERDUE_ON_OPTIONS = [
  { Id: 1, Option_Value: "OD Principal" },
  { Id: 2, Option_Value: "Outstanding" },
];

// mst_appl_option Opt_Grp_Id = 11 (Loan Grace Type)
export const GRACE_ON_OPTIONS = [
  { Id: 1, Option_Value: "Principal" },
  { Id: 2, Option_Value: "Principal + Interest" },
];

// mst_appl_option Opt_Grp_Id = 31 (Loan Finance Type)
export const FINANCE_TYPE_OPTIONS = [
  { Id: 1, Option_Value: "Refinance Loan" },
  { Id: 2, Option_Value: "Own Fund" },
  { Id: 3, Option_Value: "Govt. Grant" },
];

export const YES_NO_OPTIONS = [
  { Id: 0, Option_Value: "No" },
  { Id: 1, Option_Value: "Yes" },
];

// Fallback if ProcessLoan/GetProdType is unavailable (Opt_Grp_Id = 5)
export const PRODUCT_TYPE_OPTIONS = [
  { Id: 1, Option_Value: "Deposit" },
  { Id: 2, Option_Value: "Pledge" },
  { Id: 3, Option_Value: "Short Term" },
  { Id: 4, Option_Value: "Mid Term" },
  { Id: 5, Option_Value: "Long Term" },
  { Id: 6, Option_Value: "Cash Credit" },
];

// mst_appl_option Opt_Grp_Id = 4 (Duration Unit)
export const DURATION_UNIT_OPTIONS = [
  { Id: 1, Option_Value: "Days" },
  { Id: 2, Option_Value: "Months" },
  { Id: 3, Option_Value: "Years" },
];

export const initialState = {
  loanProductList: [],
  productTypeData: PRODUCT_TYPE_OPTIONS,
  loanTypeData: LOAN_TYPE_OPTIONS,
  durationUnitData: DURATION_UNIT_OPTIONS,
  memberTypeData: [],
  ledgerData: [],
  secureProductData: [],
  overdueOnData: OVERDUE_ON_OPTIONS,
  graceOnData: GRACE_ON_OPTIONS,
  financeTypeData: FINANCE_TYPE_OPTIONS,
  yesNoData: YES_NO_OPTIONS,
};

const LoanProductSlice = createSlice({
  name: "loanProduct",
  initialState,
  reducers: {
    getLoanProductListData: (state, action) => {
      state.loanProductList = action.payload;
    },
    getProductTypeData: (state, action) => {
      state.productTypeData =
        action.payload?.length > 0 ? action.payload : PRODUCT_TYPE_OPTIONS;
    },
    getDurationUnitData: (state, action) => {
      state.durationUnitData =
        action.payload?.length > 0 ? action.payload : DURATION_UNIT_OPTIONS;
    },
    getMemberTypeData: (state, action) => {
      state.memberTypeData = action.payload;
    },
    getLedgerData: (state, action) => {
      state.ledgerData = action.payload;
    },
    getSecureProductData: (state, action) => {
      state.secureProductData = action.payload;
    },
  },
});

export const {
  getLoanProductListData,
  getProductTypeData,
  getDurationUnitData,
  getMemberTypeData,
  getLedgerData,
  getSecureProductData,
} = LoanProductSlice.actions;

export default LoanProductSlice.reducer;
