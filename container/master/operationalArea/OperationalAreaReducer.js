import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  stateData: [],
  districtData: [],
  blockData: [],
  districtUnderStateData: [],
  policeStationData: [],
  postOfficeData: [],
  blockUnderDistrict: [],
  villageData: [],
  unitData: [],
  policeStationUnderDistrict: [],
  postOfficeUnderDistrict: [],
  villageUnderBlockData: [],
};
const OperationalAreaSlice = createSlice({
  name: "operationalArea",
  initialState,
  reducers: {
    getStateData: (state, action) => {
      state.stateData = action.payload;
    },
    getDistrictData: (state, action) => {
      state.districtData = action.payload;
    },
    getBlockData: (state, action) => {
      state.blockData = action.payload;
    },
    getDistrictUnderStateData: (state, action) => {
      state.districtUnderStateData = action.payload;
    },
    getPoliceStationData: (state, action) => {
      state.policeStationData = action.payload;
    },
    getPostOfficeData: (state, action) => {
      state.postOfficeData = action.payload;
    },
    getBlockUnderDistrictData: (state, action) => {
      state.blockUnderDistrict = action.payload;
    },
    getVillageData: (state, action) => {
      state.villageData = action.payload;
    },
    getUnitData: (state, action) => {
      state.unitData = action.payload;
    },
    getPoliceStationUnderDistrictData: (state, action) => {
      state.policeStationUnderDistrict = action.payload;
    },
    getPostOfficeUnderDistrictData: (state, action) => {
      state.postOfficeUnderDistrict = action.payload;
    },
    getVillageUnderBlockData: (state, action) => {
      state.villageUnderBlockData = action.payload;
    },
  },
});
export const {
  getStateData,
  getDistrictData,
  getBlockData,
  getDistrictUnderStateData,
  getPoliceStationData,
  getPostOfficeData,
  getBlockUnderDistrictData,
  getVillageData,
  getUnitData,
  getPoliceStationUnderDistrictData,
  getPostOfficeUnderDistrictData,
  getVillageUnderBlockData,
} = OperationalAreaSlice.actions;
export default OperationalAreaSlice.reducer;
