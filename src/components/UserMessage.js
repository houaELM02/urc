import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddMessage from './AddMessage';
import { fetchMessages, addMessage, clearMessages } from '../redux/messageSlice';



export function UserMessage(){
    const dispatch = useDispatch();
    const [messageContent, setMessageContent] = useState('');
    const { selectedConversation } = useSelector((state) => state.conversations);
    const { messages, loading, error } = useSelector((state) => state.messages);

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

        console.log("wa ban a ladate", new Date(msg.messageContent.date).toLocaleString());

        dispatch(addMessage({content: msg.messageContent.msg, timestamp: msg.messageContent.date  }));
        setStatus({ type: 'success', message: "Message envoyé avec succès Usrrr" });

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
        if (selectedConversation) {
            dispatch(fetchMessages({ receiver_id: selectedConversation.user_id }));
        } else {
            dispatch(clearMessages()); // Action pour réinitialiser les messages
        }
    }, [dispatch, selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    
    return (
        <div className="flex flex-col h-full">
            {/* Affichage des messages ou champ vide */}
            <div className="flex-1 overflow-y-auto mb-4">
                
                {selectedConversation ? (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Conversation avec {selectedConversation.username}
                        </h2>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 my-2 rounded ${
                                    msg.sender_id === selectedConversation.user_id
                                        ? 'text-left bg-gray-200'
                                        : 'text-right bg-blue-200'
                                }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </p>
                            </div>

                        ))}
                        <div ref={messagesEndRef}></div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        Sélectionnez un utilisateur pour commencer la discussion.
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
                <AddMessage
                    receiverId={selectedConversation?.user_id}
                    messageContent={messageContent}
                    onSuccess={(messageContent) => handleSendMessageSuccess({ messageContent, receiver_id: selectedConversation.user_id })}
                    onError={handleSendMessageError}
                />
            </div>
        </div>
    );
}
export default UserMessage;
