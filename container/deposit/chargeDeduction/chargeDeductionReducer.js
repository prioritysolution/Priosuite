import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  productList: [],
  chargeTypeList: [],
  chargeParam: {},
  chargeList: [],
};

const chargeDeductionSlice = createSlice({
  name: "chargeDeduction",
  initialState,
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setChargeTypeList: (state, action) => {
      state.chargeTypeList = action.payload;
    },
    clearChargeDeduction: (state) => {
      state.productList = [];
      state.chargeTypeList = [];
    },
    setChargeParam: (state, action) => {
      state.chargeParam = action.payload;
    },
    clearChargeParam: (state) => {
      state.chargeParam = {};
    },
    setChargeList: (state, action) => {
      state.chargeList = action.payload;
    },
    clearChargeList: (state) => {
      state.chargeList = [];
    },
  },
});

export const {
  setProductList,
  setChargeTypeList,
  clearChargeDeduction,
  setChargeParam,
  clearChargeParam,
  setChargeList,
  clearChargeList,
} = chargeDeductionSlice.actions;

export default chargeDeductionSlice.reducer;
