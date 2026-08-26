import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  subLedgerData: [],
  headData: [],
};
const SubLedgerSlice = createSlice({
  name: "subLedger",
  initialState,
  reducers: {
    getSubLedgerData: (state, action) => {
      state.subLedgerData = action.payload;
    },
    getSubLedgerHeadData: (state, action) => {
      state.headData = action.payload;
    },
  },
});
export const { getSubLedgerData, getSubLedgerHeadData } =
  SubLedgerSlice.actions;
export default SubLedgerSlice.reducer;
