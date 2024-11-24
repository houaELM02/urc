import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRoomMessages = createAsyncThunk(
    "roomMessages/fetchRoomMessages",
    async ({ room_id }, { getState, rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('/api/getRoomMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ room_id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.error || 'Failed to fetch messages');
            }

            return await response.json(); // Les messages
        } catch (error) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

const roomMessageSlice = createSlice({
    name: "roomMessages",
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        addRoomMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearRoomMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.loading = false;
            })
            .addCase(fetchRoomMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addRoomMessage, clearRoomMessages } = roomMessageSlice.actions;
export default roomMessageSlice.reducer;
