import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http, { getErrorMessage } from "../../api/httpClient.js";

export const fetchAttendance = createAsyncThunk("attendance/fetch", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await http.get("/api/attendance", { params });
    return data.data || [];
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const markAttendance = createAsyncThunk("attendance/mark", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await http.post("/api/attendance", payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    records: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.records = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.records = [action.payload, ...state.records];
      });
  },
});

export default attendanceSlice.reducer;
