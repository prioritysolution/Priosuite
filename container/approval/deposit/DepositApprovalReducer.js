import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    depositList: [],
    loading: true,
    error: null,
};

const DepositApprovalSlice = createSlice({
    name: "depositApproval",
    initialState,
    reducers: {
        setDepositList: (state, action) => {
            state.depositList = action.payload;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { setDepositList, setLoading, setError } =
    DepositApprovalSlice.actions;
export default DepositApprovalSlice.reducer;