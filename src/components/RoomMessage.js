import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SendMessage from "./sendMessage.js";
import { fetchRoomMessages, addRoomMessage, clearRoomMessages } from "../redux/roomMessageSlice.js";


export function RoomMessage() {
    const dispatch = useDispatch();
    const [messageContent, setMessageContent] = useState('');
    const { selectedRoom } = useSelector((state) => state.roomConversations); // Sélection du salon
    const { messages, loading, error } = useSelector((state) => state.roomMessages);

    const [status, setStatus] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleSendMessageSuccess = (msg) => {
        console.log("Message ajouté localement :", msg.messageContent.msg);
        console.log("Message date :", msg.messageContent.date);

        dispatch(
            addRoomMessage({
                content: msg.messageContent.msg,
                timestamp: msg.messageContent.date,
            })
        );

        setStatus({ type: 'success', message: "Message envoyé avec succès" });
        setMessageContent(''); // Réinitialise le champ de saisie

        setTimeout(() => {
            setStatus(null);
        }, 3000);
    };

    const handleSendMessageError = (error) => {
        setStatus({ type: 'error', message: error });
        setTimeout(() => {
            setStatus(null);
        }, 3000);
    };

    useEffect(() => {

        if (selectedRoom) {
            
            console.log("Fetching room messages for:", selectedRoom.room_id);
            dispatch(fetchRoomMessages({ room_id: selectedRoom.room_id }));
        }else {
            dispatch(clearRoomMessages());
        }

    }, [dispatch, selectedRoom]);
   


    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            {/* Affichage des messages ou champ vide */}
            <div className="flex-1 overflow-y-auto mb-4">
                {selectedRoom ? (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Salon : {selectedRoom.name}
                        </h2>
                        {
                        <div>
                            {messages.map((msg, index) => {
                           const username =
                           msg?.user?.username || (msg.sender_id ? `Utilisateur inconnu (${msg.sender_id})` : "username");
               
                       // Détermine la classe CSS pour l'affichage
                       const isSenderUnknown = username === "username";
                       const isSenderMessage = msg?.user?.id === msg.sender_id;
                         return (
                            <div
                key={index}
                className={`p-2 my-2 rounded ${
                    isSenderUnknown
                        ? 'bg-blue-200 text-right' 
                        : isSenderMessage
                        ? 'text-right bg-blue-200' 
                        : 'text-left bg-gray-200'  
                }`}
            >
            <div className="font-semibold mb-4">
                    {isSenderUnknown ? "username" : username}
                </div>
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleString()}
            </p>
        </div>
    );
})}

                        </div>}
                       
                         
                        <div ref={messagesEndRef}></div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        Sélectionnez un salon pour afficher les messages.
                    </div>
                )}
            </div>

            {/* Section de composition de message */}
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Message"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded"
                />
                {status && (
                    <p
                        className={`text-sm ${
                            status.type === 'success' ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                        {status.message}
                    </p>
                )}
                <SendMessage
                    roomId={selectedRoom?.room_id}
                    messageContent={messageContent}
                    onSuccess={(messageContent) =>
                        handleSendMessageSuccess({
                            messageContent,
                            room_id: selectedRoom.room_id,
                        })
                    }
                    onError={handleSendMessageError}
                />
            </div>
        </div>
    );
}

export default RoomMessage;

