import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    id:null,
}

const handleState = createSlice({
    name:"chat",
    initialState,
    reducers:{
     setUser:(state,action) => {
        state.user = action.payload.name;
        state.id = action.payload.id;
     }  
    }
})

export const {
   setUser ,
} = handleState.actions;

export default handleState.reducer;