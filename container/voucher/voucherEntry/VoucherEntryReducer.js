import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  ledgerList: [],
  subLedgerList: [],
  subHead: [],
};
const VoucherEntrySlice = createSlice({
  name: "voucherEntry",
  initialState,
  reducers: {
    getLedgerListData: (state, action) => {
      state.ledgerList = action.payload;
    },
    getSubLedgerListData: (state, action) => {
      state.subLedgerList = action.payload;
    },
    getSubHeadData: (state, action) => {
      state.subHead = action.payload;
    },
  },
});
export const { getLedgerListData, getSubLedgerListData, getSubHeadData } =
  VoucherEntrySlice.actions;
export default VoucherEntrySlice.reducer;
