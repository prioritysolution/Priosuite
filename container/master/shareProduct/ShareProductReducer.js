import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  memberTypeData: [],
  memberType: [],
};
const ShareProductSlice = createSlice({
  name: "shareProduct",
  initialState,
  reducers: {
    getMemberTypeData: (state, action) => {
      state.memberTypeData = action.payload;
    },
    getMemberType: (state, action) => {
      state.memberType = action.payload;
    },
  },
});
export const { getMemberTypeData, getMemberType } = ShareProductSlice.actions;
export default ShareProductSlice.reducer;
