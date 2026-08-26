import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  GetListData: [],
  GetDetailsData: [],
  loading: true,
};

const investmentApprovalSlice = createSlice({
  name: "investmentApproval",
  initialState,
  reducers: {
    GetListData: (state, action) => {
      state.GetListData = action.payload;
    },
    GetDetailsData: (state, action) => {
      state.GetDetailsData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { GetListData, GetDetailsData, setLoading } =
  investmentApprovalSlice.actions;
export default investmentApprovalSlice.reducer;
