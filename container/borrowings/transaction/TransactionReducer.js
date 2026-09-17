import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  borrowingAccountData: [],
};
const BorrowingTransactionSlice = createSlice({
  name: "borrowingTransaction",
  initialState,
  reducers: {
    getBorrowingAccountData: (state, action) => {
      state.borrowingAccountData = action.payload;
    },
  },
});
export const { getBorrowingAccountData } = BorrowingTransactionSlice.actions;
export default BorrowingTransactionSlice.reducer;
