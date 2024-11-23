import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk pour récupérer les messages
export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async ({ receiver_id }, { getState, rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch('/api/getMessages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ receiver_id }),
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

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload); // Ajoute le message localement
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload; // Stocke les messages
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Stocke l'erreur
            });
    },
});


export const { addMessage , clearMessages} = messageSlice.actions;
export default messageSlice.reducer;
