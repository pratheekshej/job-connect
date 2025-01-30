import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "app",
    initialState: {
        isPwdChange: false
    },
    reducers: {
        // actions
        setPwdChange: (state, action) => {
            state.isPwdChange = action.payload;
        },
    }
});

export const { setPwdChange } = appSlice.actions;
export default appSlice.reducer;