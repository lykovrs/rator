import { configureStore } from "@reduxjs/toolkit";
import rateReducer from "../features/rate/rateSlice.js";

export default configureStore({
  reducer: {
    rate: rateReducer,
  },
});
