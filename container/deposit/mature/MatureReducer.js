import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  operateProductData: [],
};
const MatureSlice = createSlice({
  name: "mature",
  initialState,
  reducers: {
    getOperateProductData: (state, action) => {
      state.operateProductData = action.payload;
    },
  },
});
export const { getOperateProductData } = MatureSlice.actions;
export default MatureSlice.reducer;
