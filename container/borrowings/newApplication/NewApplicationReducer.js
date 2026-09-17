import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  productTypeData: [],
  repayModeData: [],
  principalLedgerData: [],
  interestLedgerData: [],
};
const BorrowingsNewApplicationSlice = createSlice({
  name: "borrowingsNewApplication",
  initialState,
  reducers: {
    getProductTypeData: (state, action) => {
      state.productTypeData = action.payload;
    },
    getRepayModeData: (state, action) => {
      state.repayModeData = action.payload;
    },
    getPrincipalLedgerData: (state, action) => {
      state.principalLedgerData = action.payload;
    },
    getInterestLedgerData: (state, action) => {
      state.interestLedgerData = action.payload;
    },
  },
});
export const {
  getProductTypeData,
  getRepayModeData,
  getPrincipalLedgerData,
  getInterestLedgerData,
} = BorrowingsNewApplicationSlice.actions;
export default BorrowingsNewApplicationSlice.reducer;
