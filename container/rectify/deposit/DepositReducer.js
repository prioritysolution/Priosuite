import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  rectifyTypeData: [],
};
const RectifyDepositSlice = createSlice({
  name: "rectifyDeposit",
  initialState,
  reducers: {
    getRectifyTypeData: (state, action) => {
      state.rectifyTypeData = action.payload;
    },
  },
});
export const { getRectifyTypeData } = RectifyDepositSlice.actions;
export default RectifyDepositSlice.reducer;
