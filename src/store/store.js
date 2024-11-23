import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice.js";
import usersReducer from "../redux/usersSlice.js";
import conversationsReducer from "../redux/conversationSlice.js";
import messagesReducer from "../redux/messageSlice.js";


const store = configureStore({
    reducer: {
        user: authSlice,
        users: usersReducer,
        conversations: conversationsReducer,
        messages: messagesReducer,

    },
})
export default store;