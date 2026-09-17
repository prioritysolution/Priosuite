import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  reportTypeData: [],
};
const MemberReportSlice = createSlice({
  name: "memberReport",
  initialState,
  reducers: {
    getReportTypeData: (state, action) => {
      state.reportTypeData = action.payload;
    },
  },
});
export const { getReportTypeData } = MemberReportSlice.actions;
export default MemberReportSlice.reducer;
