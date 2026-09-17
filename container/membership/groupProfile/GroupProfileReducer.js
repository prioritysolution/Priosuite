import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  groupTypeData: [],
};
const GroupProfileSlice = createSlice({
  name: "groupProfile",
  initialState,
  reducers: {
    getGroupTypeData: (state, action) => {
      state.groupTypeData = action.payload;
    },
  },
});
export const { getGroupTypeData } = GroupProfileSlice.actions;
export default GroupProfileSlice.reducer;
