"use client";
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  users: [],
  loading: false,
  error: false,
};
const demoSlice = createSlice({
  name: "user", //
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.users = action.payload;
      state.loading = true;
      state.error = false;
    },
    deleteUser: (state, action) => {
      state.users?.filter((user) => user?.id !== action.payload.id);
      state.loading = false;
    },
  },
});
export const { deleteUser, getUser } = demoSlice.actions;
export default demoSlice.reducer;
