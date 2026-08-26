import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  openingLedgerBranchData: [],
};
const AdminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setOpeningLedgerBranchData: (state, action) => {
      state.openingLedgerBranchData = action.payload;
    },
  },
});
export const { setOpeningLedgerBranchData } = AdminDashboardSlice.actions;
export default AdminDashboardSlice.reducer;
