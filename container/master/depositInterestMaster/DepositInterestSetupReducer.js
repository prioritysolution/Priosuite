import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  depositInterestProductData: [],
};
const DepositInterestSetupSlice = createSlice({
  name: "depositInterestSetup",
  initialState,
  reducers: {
    getDepositInterestProductData: (state, action) => {
      state.depositInterestProductData = action.payload;
    },
  },
});
export const { getDepositInterestProductData } =
  DepositInterestSetupSlice.actions;
export default DepositInterestSetupSlice.reducer;
