import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:"",
}

const handleState = createSlice({
    name:"chat",
    initialState,
    reducers:{
        user:(state,action) => {
            state.user = action.payload.name;
        }
    }
})

export const {
    user,
} = handleState.actions;

export default handleState.reducer;