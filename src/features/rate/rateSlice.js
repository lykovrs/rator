import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { apiURL, dateTemplate, defaultDateAmount } from "../../constants";

// Thunk
export const fetchRateByDate = createAsyncThunk(
  "rate/fetchRateByDate",
  async (date) => {
    const result = await fetch(
      `${apiURL}/${date}?base=RUB&symbols=USD,EUR,RUB`
    );

    return await result.json();
  }
);

export const rateSlice = createSlice({
  name: "rates",
  initialState: {
    isActivePolling: true,
    currentDate: dayjs()
      .subtract(defaultDateAmount - 1, "day")
      .format(dateTemplate),
    history: [],
  },
  // Под капотом иммер, все имутабельно
  reducers: {
    // Начинает поллинг
    startPolling: (state) => {
      state.isActivePolling = true;
    },
    // Останавливает поллинг
    stopPolling: (state) => {
      state.isActivePolling = false;
    },
    // Останавливает поллинг
    togglePolling: (state) => {
      state.isActivePolling = !state.isActivePolling;
    },
  },
  extraReducers: {
    [fetchRateByDate.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchRateByDate.fulfilled]: (state, action) => {
      const nextDate = dayjs(state.currentDate)
        .add(1, "day")
        .format(dateTemplate);
      state.status = "succeeded";
      state.history = [
        ...state.history,
        { ...action.payload, date: state.currentDate },
      ];
      state.currentDate = nextDate;
    },
    [fetchRateByDate.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { startPolling, stopPolling, togglePolling } = rateSlice.actions;

export const selectCurrentDate = (state) => state.rate.currentDate;
export const selectRateHistory = (state) => state.rate.history;
export const selectRatePolling = (state) => state.rate.isActivePolling;

export default rateSlice.reducer;
