import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  // Page layout parameters from res.details.Parameater[0]
  pageParameter: null,
  // Front-page account detail object (mode 1)
  frontPageDetail: null,
  // Transaction rows array (mode 3)
  pageData: [],
  // "FIRST" | "TRANS" | "" – which page view to show
  showPage: "",
  // Starting line for transaction page
  showLine: 1,
  // Last transaction item (used when updating passbook after print)
  lastItem: null,
  // Last printed date (used to decide whether to send sl)
  lastDate: "",
  // Last transaction serial number
  sl: "",
};

const passbookPrintSlice = createSlice({
  name: "passbookPrint",
  initialState,
  reducers: {
    // Called after a successful front-page API call (mode 1)
    setFrontPageData: (state, action) => {
      const { parameter, details } = action.payload;
      state.pageParameter = parameter;
      state.frontPageDetail = details; // raw account object
      state.pageData = [];             // clear any old trans rows
      state.showPage = "FIRST";
    },

    // Called after a successful transaction-page API call (mode 3)
    setTransPageData: (state, action) => {
      const { parameter, details, showLine } = action.payload;
      state.pageParameter = parameter;
      state.pageData = details;
      state.lastItem = details[details.length - 1];
      state.showLine = showLine;
      state.showPage = "TRANS";
    },

    // Called after a successful params API call (mode 2)
    // Stores last-printed date and sl for the transaction form
    setTransParams: (state, action) => {
      const { lastDate, lastLine, lastTransSl } = action.payload;
      state.lastDate = lastDate;
      state.sl = lastTransSl;
      // showLine is set here so the form field can be pre-filled via selector
      state.showLine = lastLine;
    },

    // Reset page data (e.g. on API error or page type switch)
    clearPageData: (state) => {
      state.pageParameter = null;
      state.frontPageDetail = null;
      state.pageData = [];
      state.showPage = "";
      state.lastItem = null;
    },

    // Reset the entire slice back to initial state
    resetPassbookPrint: () => initialState,
  },
});

export const {
  setFrontPageData,
  setTransPageData,
  setTransParams,
  clearPageData,
  resetPassbookPrint,
} = passbookPrintSlice.actions;

export default passbookPrintSlice.reducer;
