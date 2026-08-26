import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  allUserData: [],
  userRoleData: [],
};
const CreateUserSlice = createSlice({
  name: "createUserData",
  initialState,
  reducers: {
    getAllUserData: (state, action) => {
      state.allUserData = action.payload;
    },
    getUserRoleData: (state, action) => {
      state.userRoleData = action.payload;
    },
  },
});
export const { getAllUserData, getUserRoleData } = CreateUserSlice.actions;
export default CreateUserSlice.reducer;
