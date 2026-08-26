import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  productTypeData: [],
};
const DepositReportSlice = createSlice({
  name: "depositReport",
  initialState,
  reducers: {
    getProductTypeData: (state, action) => {
      state.productTypeData = action.payload;
    },
  },
});
export const { getProductTypeData } = DepositReportSlice.actions;
export default DepositReportSlice.reducer;
