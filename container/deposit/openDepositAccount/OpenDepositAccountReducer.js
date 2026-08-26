import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  depositAccountTypeData: [],
  depositProductData: [],
  durationTypeData: [],
  maturityInstructionData: [],
  operationModeData: [],
  payoutModeData: [],
  depositAgentData: [],
  ecsAccountData: [],
};
const OpenDepositAccountSlice = createSlice({
  name: "openDepositAccount",
  initialState,
  reducers: {
    getDepositAccountTypeData: (state, action) => {
      state.depositAccountTypeData = action.payload;
    },
    getDepositProductData: (state, action) => {
      state.depositProductData = action.payload;
    },
    getDurationTypeData: (state, action) => {
      state.durationTypeData = action.payload;
    },
    getMaturityInstructionData: (state, action) => {
      state.maturityInstructionData = action.payload;
    },
    getOperationModeData: (state, action) => {
      state.operationModeData = action.payload;
    },
    getPayoutModeData: (state, action) => {
      state.payoutModeData = action.payload;
    },
    getDepositAgentData: (state, action) => {
      state.depositAgentData = action.payload;
    },
    getEcsAccountData: (state, action) => {
      state.ecsAccountData = action.payload;
    },
  },
});
export const {
  getDepositAccountTypeData,
  getDepositProductData,
  getDurationTypeData,
  getMaturityInstructionData,
  getOperationModeData,
  getPayoutModeData,
  getDepositAgentData,
  getEcsAccountData,
} = OpenDepositAccountSlice.actions;
export default OpenDepositAccountSlice.reducer;
