import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice";
import usersReducer from "../redux/usersSlice";
import conversationsReducer from "../redux/conversationSlice";
import messagesReducer from "../redux/messageSlice";


const store = configureStore({
    reducer: {
        user: authSlice,
        users: usersReducer,
        conversations: conversationsReducer,
        messages: messagesReducer,

    },
})
export default store;