import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  investmentTypeData: [],
  investmentAccountTypeData: [],
  investmentInterestTypeData: [],
  investmentPrincipalLedgerData: [],
  investmentInterestLedgerData: [],
  investmentDurationData: [],
};
const InvestmentOpenAccountSlice = createSlice({
  name: "investmentOpenAccount",
  initialState,
  reducers: {
    getInvestmentTypeData: (state, action) => {
      state.investmentTypeData = action.payload;
    },
    getInvestmentAccountTypeData: (state, action) => {
      state.investmentAccountTypeData = action.payload;
    },
    getInvestmentInterestTypeData: (state, action) => {
      state.investmentInterestTypeData = action.payload;
    },
    getInvestmentPrincipalLedgerData: (state, action) => {
      state.investmentPrincipalLedgerData = action.payload;
    },
    getInvestmentInterestLedgerData: (state, action) => {
      state.investmentInterestLedgerData = action.payload;
    },
    getInvestmentDurationData: (state, action) => {
      state.investmentDurationData = action.payload;
    },
  },
});
export const {
  getInvestmentTypeData,
  getInvestmentAccountTypeData,
  getInvestmentInterestTypeData,
  getInvestmentPrincipalLedgerData,
  getInvestmentInterestLedgerData,
  getInvestmentDurationData,
} = InvestmentOpenAccountSlice.actions;
export default InvestmentOpenAccountSlice.reducer;
