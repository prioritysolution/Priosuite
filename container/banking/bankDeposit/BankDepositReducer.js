import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  bankAccountData: [],
};
const BankDepositSlice = createSlice({
  name: "bankDeposit",
  initialState,
  reducers: {
    getBankAccountData: (state, action) => {
      state.bankAccountData = action.payload;
    },
  },
});
export const { getBankAccountData } = BankDepositSlice.actions;
export default BankDepositSlice.reducer;
