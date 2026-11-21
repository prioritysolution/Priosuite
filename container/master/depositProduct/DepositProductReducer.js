import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  depositProductList: [],
  productTypeData: [],
  durationUnitData: [],
  memberTypeData: [],
  ledgerData: [],
  principalLedgerData: [],
  interestLedgerData: [],
  provisionLedgerData: [],
  payoutModeData: [],
  depTypeData: [],
  interestTypeData: [],
  fineOnData: [],
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
    getDepTypeData: (state, action) => {
      state.depTypeData = action.payload || [];
    },
    getInterestTypeData: (state, action) => {
      state.interestTypeData = action.payload || [];
    },
    getFineOnData: (state, action) => {
      state.fineOnData = action.payload || [];
    },
    getDurationUnitData: (state, action) => {
      state.durationUnitData = action.payload || [];
    },
    getMemberTypeData: (state, action) => {
      state.memberTypeData = action.payload;
    },
    getLedgerData: (state, action) => {
      state.ledgerData = action.payload;
    },
    getPrincipalLedgerData: (state, action) => {
      state.principalLedgerData = action.payload || [];
    },
    getInterestLedgerData: (state, action) => {
      state.interestLedgerData = action.payload || [];
    },
    getProvisionLedgerData: (state, action) => {
      state.provisionLedgerData = action.payload || [];
    },
    getPayoutModeData: (state, action) => {
      state.payoutModeData = action.payload || [];
    },
  },
});

export const {
  getDepositProductListData,
  getProductTypeData,
  getDepTypeData,
  getInterestTypeData,
  getFineOnData,
  getDurationUnitData,
  getMemberTypeData,
  getLedgerData,
  getPrincipalLedgerData,
  getInterestLedgerData,
  getProvisionLedgerData,
  getPayoutModeData,
} = DepositProductSlice.actions;

export default DepositProductSlice.reducer;
