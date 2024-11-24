import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/authSlice.js";
import usersReducer from "../redux/usersSlice.js";
import conversationsReducer from "../redux/conversationSlice.js";
import messagesReducer from "../redux/messageSlice.js";
import roomsReducer from "../redux/roomsSlice.js";
import roomMessagesReducer from "../redux/roomMessageSlice.js";
import convRoomReducer from "../redux/convRoomSlice.js";


const store = configureStore({
    reducer: {
        user: authSlice,
        users: usersReducer,
        conversations: conversationsReducer,
        messages: messagesReducer,
        rooms: roomsReducer,
        roomConversations: convRoomReducer,
        roomMessages: roomMessagesReducer,
        
      

    },
})
export default store;