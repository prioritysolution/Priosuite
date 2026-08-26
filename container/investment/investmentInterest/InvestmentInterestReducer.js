import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  investmentAccountData: [],
};
const InvestmentInterestSlice = createSlice({
  name: "investmentInterest",
  initialState,
  reducers: {
    getInvestmentAccountData: (state, action) => {
      state.investmentAccountData = action.payload;
    },
  },
});
export const { getInvestmentAccountData } = InvestmentInterestSlice.actions;
export default InvestmentInterestSlice.reducer;
