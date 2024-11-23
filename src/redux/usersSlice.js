import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch("/api/users", {
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
            const { user } = getState(); // Utilisez `getState` pour obtenir l'utilisateur connecté
            return data.filter((u) => u.user_id !== user.id); // Exclure l'utilisateur connecté
        } catch (error) {
            return rejectWithValue(error.message || "Erreur réseau");
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        selectedUser: null,
        loading: false,
        error: null,
    },
    reducers: {
        selectUser: (state, action) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                state.error = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { selectUser } = usersSlice.actions;
export default usersSlice.reducer;