import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Thunk
export const fetchRateByDate = createAsyncThunk(
  "rate/fetchRateByDate",
  async (date) => {
    const result = await fetch(
      `https://api.exchangeratesapi.io/${date}?base=RUB&symbols=USD,EUR,RUB`
    );

    return await result.json();
  }
);

export const rateSlice = createSlice({
  name: "rates",
  initialState: {
    isActivePolling: false,
    currentDate: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    history: [],
  },
  reducers: {
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
        .format("YYYY-MM-DD");
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

export const { togglePolling } = rateSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectCurrentDate = (state) => state.rate.currentDate;
export const selectRateHistory = (state) => state.rate.history;
export const selectRatePolling = (state) => state.rate.isActivePolling;

export default rateSlice.reducer;
