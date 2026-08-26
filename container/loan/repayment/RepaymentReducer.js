import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loanAccountSearchData: [],
};
const Repayment = createSlice({
  name: "repayment",
  initialState,
  reducers: {
    getLoanAccountSearchData: (state, action) => {
      state.loanAccountSearchData = action.payload;
    },
  },
});
export const { getLoanAccountSearchData } = Repayment.actions;
export default Repayment.reducer;
