import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
        users: [],
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
    }
});

export const { setAllApplicants, setUsers } = applicationSlice.actions;
export default applicationSlice.reducer;