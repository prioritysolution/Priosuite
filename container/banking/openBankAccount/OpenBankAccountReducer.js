import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  bankAccountTypeData: [],
  bankGlData: [],
};
const OpenBankAccountSlice = createSlice({
  name: "openBankAccount",
  initialState,
  reducers: {
    getBankAccountTypeData: (state, action) => {
      state.bankAccountTypeData = action.payload;
    },
    getBankGlData: (state, action) => {
      state.bankGlData = action.payload;
    },
  },
});
export const { getBankAccountTypeData, getBankGlData } =
  OpenBankAccountSlice.actions;
export default OpenBankAccountSlice.reducer;
