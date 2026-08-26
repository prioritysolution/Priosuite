import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  footerData: {},
};
const footerSlice = createSlice({
  name: "footerData",
  initialState,
  reducers: {
    getFooterData: (state, action) => {
      state.footerData = action.payload;
    },
  },
});
export const { getFooterData } = footerSlice.actions;
export default footerSlice.reducer;
