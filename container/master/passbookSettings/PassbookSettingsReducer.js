import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  moduleData: [],
};
const PassbookSettingsSlice = createSlice({
  name: "passbookSettings",
  initialState,
  reducers: {
    getModuleData: (state, action) => {
      state.moduleData = action.payload;
    },
  },
});
export const { getModuleData } = PassbookSettingsSlice.actions;
export default PassbookSettingsSlice.reducer;
