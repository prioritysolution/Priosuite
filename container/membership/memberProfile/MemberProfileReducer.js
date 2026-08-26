import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  relationTypeData: [],
  genderData: [],
  casteData: [],
  religionData: [],
};
const MemberProfileSlice = createSlice({
  name: "memberProfile",
  initialState,
  reducers: {
    getRelationTypeData: (state, action) => {
      state.relationTypeData = action.payload;
    },
    getGenderData: (state, action) => {
      state.genderData = action.payload;
    },
    getCasteData: (state, action) => {
      state.casteData = action.payload;
    },
    getReligionData: (state, action) => {
      state.religionData = action.payload;
    },
  },
});
export const {
  getRelationTypeData,
  getGenderData,
  getCasteData,
  getReligionData,
} = MemberProfileSlice.actions;
export default MemberProfileSlice.reducer;
