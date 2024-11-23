import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";

const initialState = {
    msg: "",
    user:"",
    token:"",
    loading:false,
    error:"",
}




export const registerUser = createAsyncThunk(
    'auth/register',
    async (user, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || "Erreur lors de l'inscription");
            }

            const result = await response.json();
            return result; // Le payload retourné en cas de succès
        } catch (error) {
            return rejectWithValue(error.message || "Erreur réseau");
        }
    }
);




const autSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        logout: (state) =>{
            state.user = null;
            state.error = null;
            state.token =null;
            state.msg = "Deconnexion";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
})


export const {logout} = autSlice.actions;
export default autSlice.reducer;
