// src/redux/slices/gymSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  gyms: [],
  loading: false,
  error: null,
};

// Async thunk for fetching gyms
export const fetchGyms = createAsyncThunk('gyms/fetchGyms', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/admin/gyms', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.gyms;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for adding a gym
export const addGym = createAsyncThunk('gyms/addGym', async (gymData, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:5000/api/v1/admin/gyms', gymData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.gym;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for updating a gym
export const updateGym = createAsyncThunk('gyms/updateGym', async ({ id, gymData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/v1/admin/gyms/${id}`, gymData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.gym;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for deleting a gym
export const deleteGym = createAsyncThunk('gyms/deleteGym', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/v1/admin/gyms/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Gym slice
const gymSlice = createSlice({
  name: 'gyms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGyms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGyms.fulfilled, (state, action) => {
        state.loading = false;
        state.gyms = action.payload;
      })
      .addCase(fetchGyms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addGym.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGym.fulfilled, (state, action) => {
        state.loading = false;
        state.gyms.push(action.payload);
      })
      .addCase(addGym.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGym.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGym.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.gyms.findIndex(gym => gym._id === action.payload._id);
        if (index !== -1) {
          state.gyms[index] = action.payload;
        }
      })
      .addCase(updateGym.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGym.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGym.fulfilled, (state, action) => {
        state.loading = false;
        state.gyms = state.gyms.filter(gym => gym._id !== action.payload);
      })
      .addCase(deleteGym.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError } = gymSlice.actions;
export default gymSlice.reducer;