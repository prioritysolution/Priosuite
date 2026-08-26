import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  searchAccountData: [],
  operateProductData: [],
};
const DepositSlice = createSlice({
  name: "deposit",
  initialState,
  reducers: {
    getSearchAccountData: (state, action) => {
      state.searchAccountData = action.payload;
    },
    getOperateProductData: (state, action) => {
      state.operateProductData = action.payload;
    },
  },
});
export const { getSearchAccountData, getOperateProductData } =
  DepositSlice.actions;
export default DepositSlice.reducer;
