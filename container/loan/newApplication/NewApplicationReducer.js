import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  loanProductData: [],
  durationUnitData: [],
  repaymentModeData: [],
  securityData: [],
  prodTypeData: [],
  loanPurpose: [],
  currentProductType: null,
  currentProduct: null,
  ecsAccountData: [],
  ecsAccountNo: null,
  DeductionList: [],
};
const NewApplicationSlice = createSlice({
  name: "newApplication",
  initialState,
  reducers: {
    getLoanProductData: (state, action) => {
      // console.log("getLoanProductData reducer called with:", action.payload);
      state.loanProductData = action.payload;
    },
    getDurationUnitData: (state, action) => {
      state.durationUnitData = action.payload;
    },
    getRepaymentModeData: (state, action) => {
      state.repaymentModeData = action.payload;
    },
    getSecurityData: (state, action) => {
      state.securityData = action.payload;
    },
    getProdTypeData: (state, action) => {
      state.prodTypeData = action.payload;
    },
    getLoanPurposeData: (state, action) => {
      // console.log("getLoanPurposeData reducer called with:", action.payload);
      state.loanPurpose = action.payload;
    },
    setCurrentProductType: (state, action) => {
      state.currentProductType = action.payload;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    getEcsAccountData: (state, action) => {
      state.ecsAccountData = action.payload;
    },
    setEcsAccountNo: (state, action) => {
      state.ecsAccountNo = action.payload;
    },
    setDeductionList: (state, action) => {
      state.DeductionList = action.payload;
    },
    resetDeductionList: (state) => {
      state.DeductionList = [];
    },
  },
});
export const {
  getLoanProductData,
  getDurationUnitData,
  getRepaymentModeData,
  getSecurityData,
  getProdTypeData,
  getLoanPurposeData,
  setCurrentProductType,
  setCurrentProduct,
  getEcsAccountData,
  setEcsAccountNo,
  setDeductionList,
  resetDeductionList,
} = NewApplicationSlice.actions;

export default NewApplicationSlice.reducer;
