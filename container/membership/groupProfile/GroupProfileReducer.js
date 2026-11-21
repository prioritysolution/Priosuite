import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  groupTypeData: [],
  agentListData: [],
};
const GroupProfileSlice = createSlice({
  name: "groupProfile",
  initialState,
  reducers: {
    getGroupTypeData: (state, action) => {
      state.groupTypeData = action.payload;
    },
    getAgentListData: (state, action) => {
      state.agentListData = action.payload;
    },
  },
});
export const { getGroupTypeData, getAgentListData } = GroupProfileSlice.actions;
export default GroupProfileSlice.reducer;
