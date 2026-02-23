import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import http, { getErrorMessage } from "../api/httpClient.js";

const createCrudSlice = ({ name, endpoint }) => {
  const fetchItems = createAsyncThunk(`${name}/fetchAll`, async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get(endpoint);
      return data.data || [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  });

  const createItem = createAsyncThunk(`${name}/create`, async (body, { rejectWithValue }) => {
    try {
      const { data } = await http.post(endpoint, body);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  });

  const updateItem = createAsyncThunk(`${name}/update`, async ({ id, body }, { rejectWithValue }) => {
    try {
      const { data } = await http.put(`${endpoint}/${id}`, body);
      return data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  });

  const deleteItem = createAsyncThunk(`${name}/delete`, async (id, { rejectWithValue }) => {
    try {
      await http.delete(`${endpoint}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  });

  const slice = createSlice({
    name,
    initialState: {
      items: [],
      status: "idle",
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchItems.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(fetchItems.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.items = action.payload;
        })
        .addCase(fetchItems.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || action.error.message;
        })
        .addCase(createItem.fulfilled, (state, action) => {
          state.items.push(action.payload);
        })
        .addCase(updateItem.fulfilled, (state, action) => {
          const idx = state.items.findIndex((item) => item._id === action.payload._id);
          if (idx >= 0) {
            state.items[idx] = action.payload;
          }
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
          state.items = state.items.filter((item) => item._id !== action.payload);
        });
    },
  });

  return {
    reducer: slice.reducer,
    thunks: {
      fetchItems,
      createItem,
      updateItem,
      deleteItem,
    },
  };
};

export default createCrudSlice;
