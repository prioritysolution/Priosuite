import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  sidebarData: [],
};
const sidebarSlice = createSlice({
  name: "sidebarData",
  initialState,
  reducers: {
    getSidebarData: (state, action) => {
      state.sidebarData = action.payload;
    },
  },
});
export const { getSidebarData } = sidebarSlice.actions;
export default sidebarSlice.reducer;
