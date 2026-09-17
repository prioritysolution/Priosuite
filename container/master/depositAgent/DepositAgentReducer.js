import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  paymentTypeData: [],
};
const DepositAgentSlice = createSlice({
  name: "depositAgent",
  initialState,
  reducers: {
    getPaymentTypeData: (state, action) => {
      state.paymentTypeData = action.payload;
    },
  },
});
export const { getPaymentTypeData } = DepositAgentSlice.actions;
export default DepositAgentSlice.reducer;
