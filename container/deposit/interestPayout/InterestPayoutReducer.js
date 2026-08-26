import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  singleAccountData: [],
  bulkAccountData: [],
};
const InterestPayoutSlice = createSlice({
  name: "interestPayout",
  initialState,
  reducers: {
    getSingleAccountData: (state, action) => {
      state.singleAccountData = action.payload;
    },
    getBulkAccountData: (state, action) => {
      state.bulkAccountData = action.payload;
    },
  },
});
export const { getSingleAccountData, getBulkAccountData } =
  InterestPayoutSlice.actions;
export default InterestPayoutSlice.reducer;
