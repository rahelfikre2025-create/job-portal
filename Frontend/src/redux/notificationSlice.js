import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${USER_API_ENDPOINT}/notifications`, { withCredentials: true });
    return res.data.notifications;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const markNotificationRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${USER_API_ENDPOINT}/notifications/${id}/read`, {}, { withCredentials: true });
    return { id, success: res.data.success };
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const markAllNotificationsRead = createAsyncThunk('notifications/markAllRead', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${USER_API_ENDPOINT}/notifications/read-all`, {}, { withCredentials: true });
    return res.data.success;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    addNotificationLocal: (state, action) => {
      state.list.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchNotifications.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload; })
      .addCase(fetchNotifications.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const id = action.payload.id;
        const item = state.list.find(n => n._id === id);
        if (item) item.read = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.list = state.list.map(n => ({ ...n, read: true }));
      });
  }
});

export const { addNotificationLocal } = notificationSlice.actions;
export default notificationSlice.reducer;
