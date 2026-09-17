import { createSlice } from "@reduxjs/toolkit";

// memberDataById: [],

export const initialState = {
  noteDenomData: [],
  memberDataById: null,
  memberDataByName: [],
};
const IssueMembershipSlice = createSlice({
  name: "issueMembership",
  initialState,
  reducers: {
    getNoteDenomData: (state, action) => {
      state.noteDenomData = action.payload;
    },
    getMemberDataById: (state, action) => {
      state.memberDataById = action.payload;
    },
    getMemberDataByName: (state, action) => {
      state.memberDataByName = action.payload;
    },
  },
});
export const { getNoteDenomData, getMemberDataById, getMemberDataByName } =
  IssueMembershipSlice.actions;
export default IssueMembershipSlice.reducer;
