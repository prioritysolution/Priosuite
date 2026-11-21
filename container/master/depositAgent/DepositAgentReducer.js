import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  paymentTypeData: [],
  agentList: [],
};
const DepositAgentSlice = createSlice({
  name: "depositAgent",
  initialState,
  reducers: {
    getPaymentTypeData: (state, action) => {
      state.paymentTypeData = action.payload;
    },
    getAgentListData: (state, action) => {
      state.agentList = action.payload;
    },
  },
});
export const { getPaymentTypeData, getAgentListData } = DepositAgentSlice.actions;
export default DepositAgentSlice.reducer;
