import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  GetListData: [],
  GetDetailsData: [],
  loading: true,
  bankAccountTypeData: [],
  bankGlData: [],
};

const approvalbankingSlice = createSlice({
  name: "approvalbanking",
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
    getBankAccountTypeData: (state, action) => {
      state.bankAccountTypeData = action.payload;
    },
    getBankGlData: (state, action) => {
      state.bankGlData = action.payload;
    },
  },
});

export const {
  GetListData,
  GetDetailsData,
  setLoading,
  getBankAccountTypeData,
  getBankGlData,
} = approvalbankingSlice.actions;
export default approvalbankingSlice.reducer;
