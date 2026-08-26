import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  voucherList: [],
  voucherDetails: [],
};
const DaybookSlice = createSlice({
  name: "daybook",
  initialState,
  reducers: {
    getVoucherListData: (state, action) => {
      state.voucherList = action.payload;
    },
    getVoucherDetailsData: (state, action) => {
      state.voucherDetails = action.payload;
    },
  },
});
export const { getVoucherListData, getVoucherDetailsData } =
  DaybookSlice.actions;
export default DaybookSlice.reducer;
