import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  disburseData: [],
};
const Disburse = createSlice({
  name: "disburse",
  initialState,
  reducers: {
    getDisburseData: (state, action) => {
      state.disburseData = action.payload;
    },
  },
});
export const { getDisburseData } = Disburse.actions;
export default Disburse.reducer;
