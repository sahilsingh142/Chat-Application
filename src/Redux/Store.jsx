import { configureStore } from "@reduxjs/toolkit";
import storeSlice from "./HandleSlice.jsx"

export const store = configureStore({
    reducer:{
        chat: storeSlice,
    },
});