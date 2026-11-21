import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  depositInterestProductData: [],
  interestSlabList: [],
};
const DepositInterestSetupSlice = createSlice({
  name: "depositInterestSetup",
  initialState,
  reducers: {
    getDepositInterestProductData: (state, action) => {
      state.depositInterestProductData = action.payload;
    },
    getInterestSlabListData: (state, action) => {
      state.interestSlabList = action.payload;
    },
  },
});
export const { getDepositInterestProductData, getInterestSlabListData } =
  DepositInterestSetupSlice.actions;
export default DepositInterestSetupSlice.reducer;
