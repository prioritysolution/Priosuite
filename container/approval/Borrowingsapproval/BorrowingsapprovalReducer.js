import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  GetListData: [],
  loading: true,
};

const borrowingsApprovalSlice = createSlice({
  name: "borrowingsApproval",
  initialState,
  reducers: {
    GetListData: (state, action) => {
      state.GetListData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { GetListData, setLoading } = borrowingsApprovalSlice.actions;
export default borrowingsApprovalSlice.reducer;
