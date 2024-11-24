import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchRooms = createAsyncThunk(
    'rooms/fetchRooms',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch("/api/getRooms", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Erreur lors de la récupération des utilisateurs");
            }

            const data = await response.json();
            //const { user } = getState(); // Utilisez `getState` pour obtenir l'utilisateur connecté
            return data // Exclure l'utilisateur connecté
        } catch (error) {
            return rejectWithValue(error.message || "Erreur réseau");
        }
    }
);
const roomsSlice = createSlice({
    name: "rooms",
    initialState: {
        list: [],
        selectedRoom: null,
        loading: false,
        error: null,
    },
    reducers: {
        selectRoom: (state, action) => {
            state.selectedRoom = action.payload;
        },
    }, 
    extraReducers: (builder) => {
        builder
            .addCase(fetchRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { selectRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
