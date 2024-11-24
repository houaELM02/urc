import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk pour récupérer les messages d'une conversation
export const fetchMessages = createAsyncThunk(
    'conversation/fetchMessages',
    async (conversationId, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`/api/message/${conversationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Erreur lors de la récupération des messages');
            }

            const data = await response.json();
            return { conversationId, messages: data };
        } catch (error) {
            return rejectWithValue(error.message || 'Erreur réseau');
        }
    }
);




// Slice Redux
const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        selectedConversation: null, // Stocke la conversation actuellement sélectionnée
        loading: false,
        error: null,
    },
    reducers: {
        selectConversation: (state, action) => {
            state.selectedConversation = {
                ...action.payload,
                messages: [], // Initialise les messages à une liste vide
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { messages } = action.payload;
                if (state.selectedConversation) {
                    state.selectedConversation.messages = messages; // Met à jour les messages de la conversation sélectionnée
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { selectConversation } = conversationSlice.actions;
export default conversationSlice.reducer;
