import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetGrpDesigDataAPI, GetEcsAccountDataAPI } from "./mapgroupmemberApis";

// Async thunks for API calls
export const getGrpDesigData = createAsyncThunk(
  "mapGroupMember/getGrpDesigData",
  async (orgId, { rejectWithValue }) => {
    try {
      console.log("Redux: Calling GetGrpDesigDataAPI");
      const response = await GetGrpDesigDataAPI(orgId);
      console.log("Redux: GetGrpDesigDataAPI response:", response);
      console.log("Redux: response.message:", response.message);
      console.log("Redux: response.details type:", typeof response.details);
      console.log(
        "Redux: response.details isArray:",
        Array.isArray(response.details),
      );
      if (response.message === "Data Found" || response.message === "Success") {
        // Ensure we return an array with the expected structure
        const data = Array.isArray(response.details) ? response.details : [];
        console.log("Redux: Returning designation data:", data);
        return data;
      } else {
        const msg =
          typeof response.details === "string"
            ? response.details
            : response.details?.message
              ? String(response.details.message)
              : "Failed to fetch designation data";
        return rejectWithValue(msg);
      }
    } catch (error) {
      console.error("Redux: GetGrpDesigDataAPI error:", error);
      return rejectWithValue(
        error?.message ? String(error.message) : "Something went wrong",
      );
    }
  },
);

export const getEcsAccountData = createAsyncThunk(
  "mapGroupMember/getEcsAccountData",
  async ({ orgId, memb_id }, { rejectWithValue }) => {
    try {
      console.log("Redux: Calling GetEcsAccountDataAPI with:", {
        orgId,
        memb_id,
      });
      const response = await GetEcsAccountDataAPI(orgId, memb_id);
      console.log("Redux: GetEcsAccountDataAPI response:", response);
      console.log("Redux: response.details type:", typeof response.details);
      console.log(
        "Redux: response.details isArray:",
        Array.isArray(response.details),
      );
      if (response.message === "Data Found" || response.message === "Success") {
        // Ensure we return an array with the expected structure
        const data = Array.isArray(response.details) ? response.details : [];
        console.log("Redux: Returning ECS data:", data);
        return data;
      } else if (response.message === "No Data Found") {
        // Clear ECS data when no data found
        console.log("Redux: No ECS data found, clearing store");
        return [];
      } else {
        const msg =
          typeof response.details === "string"
            ? response.details
            : response.details?.message
              ? String(response.details.message)
              : "Failed to fetch ECS account data";
        return rejectWithValue(msg);
      }
    } catch (error) {
      console.error("Redux: GetEcsAccountDataAPI error:", error);
      return rejectWithValue(
        error?.message ? String(error.message) : "Something went wrong",
      );
    }
  },
);

// Initial state
const initialState = {
  grpDesigData: [],
  ecsAccountData: [],
  loading: {
    grpDesig: false,
    ecsAccount: false,
  },
  error: {
    grpDesig: null,
    ecsAccount: null,
  },
};

// Create slice
const mapGroupMemberSlice = createSlice({
  name: "mapGroupMember",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {};
    },
    resetEcsAccountData: (state) => {
      state.ecsAccountData = [];
    },
    resetGrpDesigData: (state) => {
      state.grpDesigData = [];
    },
  },
  extraReducers: (builder) => {
    // Get Group Designation Data
    builder
      .addCase(getGrpDesigData.pending, (state) => {
        state.loading.grpDesig = true;
        state.error.grpDesig = null;
      })
      .addCase(getGrpDesigData.fulfilled, (state, action) => {
        state.loading.grpDesig = false;
        state.grpDesigData = action.payload;
      })
      .addCase(getGrpDesigData.rejected, (state, action) => {
        state.loading.grpDesig = false;
        state.error.grpDesig = action.payload;
      });

    // Get ECS Account Data
    builder
      .addCase(getEcsAccountData.pending, (state) => {
        state.loading.ecsAccount = true;
        state.error.ecsAccount = null;
      })
      .addCase(getEcsAccountData.fulfilled, (state, action) => {
        state.loading.ecsAccount = false;
        state.ecsAccountData = action.payload;
      })
      .addCase(getEcsAccountData.rejected, (state, action) => {
        state.loading.ecsAccount = false;
        state.error.ecsAccount = action.payload;
      });
  },
});

// Export actions
export const { clearErrors, resetEcsAccountData, resetGrpDesigData } =
  mapGroupMemberSlice.actions;

// Export reducer
export default mapGroupMemberSlice.reducer;

// Selectors
export const selectGrpDesigData = (state) => {
  const data = state.mapGroupMember?.grpDesigData;
  console.log("Redux selectGrpDesigData - raw data:", data);
  console.log("Redux selectGrpDesigData - isArray:", Array.isArray(data));
  const result = Array.isArray(data) ? data : [];
  console.log("Redux selectGrpDesigData - returning:", result);
  return result;
};

export const selectEcsAccountData = (state) => {
  const data = state.mapGroupMember?.ecsAccountData;
  console.log("Redux selectEcsAccountData - raw data:", data);
  console.log("Redux selectEcsAccountData - isArray:", Array.isArray(data));
  const result = Array.isArray(data) ? data : [];
  console.log("Redux selectEcsAccountData - returning:", result);
  return result;
};

export const selectMapGroupMemberLoading = (state) =>
  state.mapGroupMember?.loading || {};
export const selectMapGroupMemberError = (state) =>
  state.mapGroupMember?.error || {};
