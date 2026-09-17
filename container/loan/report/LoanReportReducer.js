import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loanProductList: [],
};

export const loanReportSlice = createSlice({
  name: "loanReport",
  initialState,
  reducers: {
    getLoanProductList: (state, action) => {
      state.loanProductList = action.payload;
    },
  },
});

export const { getLoanProductList } = loanReportSlice.actions;
export default loanReportSlice.reducer;
