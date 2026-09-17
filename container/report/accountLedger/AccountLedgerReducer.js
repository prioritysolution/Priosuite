import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  ledgerData: [],
};
const AccountLedgerSlice = createSlice({
  name: "accountLedger",
  initialState,
  reducers: {
    getLedgerData: (state, action) => {
      state.ledgerData = action.payload;
    },
  },
});
export const { getLedgerData } = AccountLedgerSlice.actions;
export default AccountLedgerSlice.reducer;
