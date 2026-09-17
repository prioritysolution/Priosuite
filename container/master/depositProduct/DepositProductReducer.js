import { createSlice } from "@reduxjs/toolkit";

// mst_appl_option Opt_Grp_Id = 2 (Deposit Type) — no dedicated list API yet
export const DEP_TYPE_OPTIONS = [
  { Id: 1, Option_Value: "Savings" },
  { Id: 2, Option_Value: "Recurring Monthly" },
  { Id: 3, Option_Value: "Fixed" },
  { Id: 4, Option_Value: "MIS" },
];

// mst_appl_option Opt_Grp_Id = 3 (Dep Interest Type) — no dedicated list API yet
export const INTEREST_TYPE_OPTIONS = [
  { Id: 1, Option_Value: "Daily Product Basic" },
  { Id: 2, Option_Value: "Monthly Product Basic" },
  { Id: 3, Option_Value: "Simple" },
  { Id: 4, Option_Value: "Quarterly Compound" },
];

// mst_appl_option Opt_Grp_Id = 4 (Duration Unit) — fallback if GetDuration is empty
export const DURATION_UNIT_OPTIONS = [
  { Id: 1, Option_Value: "Days" },
  { Id: 2, Option_Value: "Months" },
  { Id: 3, Option_Value: "Years" },
];

export const initialState = {
  depositProductList: [],
  productTypeData: [],
  durationUnitData: DURATION_UNIT_OPTIONS,
  memberTypeData: [],
  ledgerData: [],
  depTypeData: DEP_TYPE_OPTIONS,
  interestTypeData: INTEREST_TYPE_OPTIONS,
};

const DepositProductSlice = createSlice({
  name: "depositProduct",
  initialState,
  reducers: {
    getDepositProductListData: (state, action) => {
      state.depositProductList = action.payload;
    },
    getProductTypeData: (state, action) => {
      state.productTypeData = action.payload;
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
  },
});

export const {
  getDepositProductListData,
  getProductTypeData,
  getDurationUnitData,
  getMemberTypeData,
  getLedgerData,
} = DepositProductSlice.actions;

export default DepositProductSlice.reducer;
