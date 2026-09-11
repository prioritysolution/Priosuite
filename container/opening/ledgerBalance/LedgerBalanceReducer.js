import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  branchData: [],
  acctTypeData: [],
  mainHeadData: [],
  subHeadData: [],
  ledgerData: [],
};
const LedgerBalanceSlice = createSlice({
  name: "ledgerBalance",
  initialState,
  reducers: {
    getBranchData: (state, action) => {
      state.branchData = action.payload;
    },
    getAcctTypeData: (state, action) => {
      state.acctTypeData = action.payload;
    },
    getMainHeadData: (state, action) => {
      state.mainHeadData = action.payload;
    },
    getSubHeadData: (state, action) => {
      state.subHeadData = action.payload;
    },
    getLedgerData: (state, action) => {
      state.ledgerData = action.payload;
    },
  },
});
export const {
  getBranchData,
  getAcctTypeData,
  getMainHeadData,
  getSubHeadData,
  getLedgerData,
} = LedgerBalanceSlice.actions;
export default LedgerBalanceSlice.reducer;
