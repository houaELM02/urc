import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk pour récupérer les messages d'un groupe
export const fetchRoomMessages = createAsyncThunk(
    'room/fetchRoomMessages',
    async (roomId, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`/api/roomMessages/${roomId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Erreur lors de la récupération des messages du groupe');
            }

            const data = await response.json();
            return { roomId, messages: data };
        } catch (error) {
            return rejectWithValue(error.message || 'Erreur réseau');
        }
    }
);

const convRoomSlice = createSlice({
    name: 'room',
    initialState: {
        selectedRoom: null, // Groupe actuellement sélectionné
        loading: false,
        error: null,
    },
    reducers: {
        selectRoomConversation: (state, action) => {
            state.selectedRoom = {
                ...action.payload,
                messages: [], // Initialise les messages à une liste vide
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomMessages.fulfilled, (state, action) => {
                const { messages } = action.payload;
                if (state.selectedRoom) {
                    state.selectedRoom.messages = messages; // Met à jour les messages du groupe sélectionné
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchRoomMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { selectRoomConversation } = convRoomSlice.actions;
export default convRoomSlice.reducer;
