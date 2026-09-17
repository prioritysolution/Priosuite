import { createSlice } from "@reduxjs/toolkit";

export const kycSlice = createSlice({
    name: "kyc",
    initialState: {
        kycList: [],
        loading: true,
        error: null,
    },
    reducers: {
        getKycList: (state, action) => {
            state.kycList = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { getKycList, setLoading, setError } = kycSlice.actions;
export default kycSlice.reducer;