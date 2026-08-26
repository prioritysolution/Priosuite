import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  userData: [],
  moduleData: [],
};
const UserRoleSlice = createSlice({
  name: "userRoleData",
  initialState,
  reducers: {
    getUserData: (state, action) => {
      state.userData = action.payload;
    },
    getModuleData: (state, action) => {
      state.moduleData = action.payload;
    },
  },
});
export const { getUserData, getModuleData } = UserRoleSlice.actions;
export default UserRoleSlice.reducer;
