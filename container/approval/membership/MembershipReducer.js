import { createSlice } from "@reduxjs/toolkit";

export const membershipApprovalSlice = createSlice({
    name: "membershipApproval",
    initialState: {
        membershipList: [],
        loading: true,
    },
    reducers: {
        getMembershipList: (state, action) => {
            state.membershipList = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { getMembershipList, setLoading } = membershipApprovalSlice.actions;
export default membershipApprovalSlice.reducer;