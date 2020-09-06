import { configureStore } from "@reduxjs/toolkit";
import rateReducer from "../features/rate/rateSlice.js";

/**
 * Конфигурируем стор
 */
export default configureStore({
  reducer: {
    rate: rateReducer,
  },
});
