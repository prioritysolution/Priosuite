import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  GetListData: [],
  loading: true,
};

const voucherApprovalSlice = createSlice({
  name: "voucherApproval",
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

export const { GetListData, setLoading } = voucherApprovalSlice.actions;
export default voucherApprovalSlice.reducer;
