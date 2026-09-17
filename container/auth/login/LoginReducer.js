import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  token: null,
  beg_date: null,
};
const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    token: (state, action) => {
      state.modalState = action.payload;
    },
    beg_date: (state, action) => {
      state.beg_date = action.payload;
    },
  },
});
export const { token, beg_date } = LoginSlice.actions;
export default LoginSlice.reducer;
