

import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  productList: [],
  interestDetails: [],
};

const sevingsInterestCalculateSlice = createSlice({
  name: "sevingsInterestCalculate",
  initialState,
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setInterestDetails: (state, action) => {
      state.interestDetails = action.payload;
    },
    clearSavingsInterestCalculate: (state) => {
      state.productList = [];
      state.interestDetails = [];
    },
  },
});

export const { setProductList, setInterestDetails, clearSavingsInterestCalculate } =
  sevingsInterestCalculateSlice.actions;

export default sevingsInterestCalculateSlice.reducer;
