import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  rectifyTypeData: [],
};
const RectifyMembershipSlice = createSlice({
  name: "rectifyMembership",
  initialState,
  reducers: {
    getRectifyTypeData: (state, action) => {
      state.rectifyTypeData = action.payload;
    },
  },
});
export const { getRectifyTypeData } = RectifyMembershipSlice.actions;
export default RectifyMembershipSlice.reducer;
