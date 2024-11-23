/*import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, addMessage } from '../redux/conversationSlice';

const Messages = () => {
    const dispatch = useDispatch();
    const messagesEndRef = useRef(null);
    const [messageContent, setMessageContent] = useState('');

    const { selectedConversation, loading, error } = useSelector((state) => state.conversation);

    // Charger les messages pour la conversation sélectionnée
    useEffect(() => {
        if (selectedConversation?.id) {
            dispatch(fetchMessages(selectedConversation.id));
        }
    }, [dispatch, selectedConversation]);

    // Auto-scroll vers le dernier message
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    const handleSendMessage = () => {
        if (messageContent.trim() && selectedConversation) {
            dispatch(addMessage({ receiver_id: selectedConversation.id, content: messageContent }));
            setMessageContent(''); // Réinitialise le champ de saisie
        }
    };

    if (loading) return <p>Chargement des messages...</p>;
    if (error) return <p>Erreur : {error}</p>;

    return (
        <div>
            <div style={{ padding: '10px', overflowY: 'auto', maxHeight: '500px' }}>
                {selectedConversation?.messages.map((msg) => (
                    <div
                        key={msg.timestamp}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems:
                                msg.sender_id === Number(sessionStorage.getItem('username')) ? 'flex-end' : 'flex-start',
                            margin: '10px 0',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '70%',
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor:
                                    msg.sender_id === Number(sessionStorage.getItem('username')) ? '#d1ffd1' : '#f1f1f1',
                            }}
                        >
                            <p style={{ margin: 0 }}>{msg.content}</p>
                            <small style={{ fontSize: '0.8em', color: 'gray' }}>
                                {msg.sender_id === Number(sessionStorage.getItem('username'))
                                    ? 'Vous'
                                    : `Utilisateur ${msg.sender_id}`} - {new Date(msg.timestamp).toLocaleString()}
                            </small>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div style={{ marginTop: '10px' }}>
                <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Tapez votre message"
                    style={{ width: '80%', padding: '10px' }}
                />
                <button onClick={handleSendMessage} style={{ padding: '10px' }}>
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Messages;*/
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, addMessage } from '../redux/conversationSlice';

const Messages = () => {
    const dispatch = useDispatch();
    const [messageContent, setMessageContent] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const messagesEndRef = useRef(null);

    const { selectedConversation, loading, error } = useSelector((state) => state.conversations);
    const users = useSelector((state) => state.users.list);

    // Charger les messages pour la conversation sélectionnée
    useEffect(() => {
        if (selectedConversation?.id) {
            dispatch(fetchMessages(selectedConversation.id));
            setReceiverId(selectedConversation.id); // Définit le destinataire
        }
    }, [dispatch, selectedConversation]);

    // Auto-scroll vers le dernier message
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedConversation?.messages]);

    const handleSendMessage = () => {
        if (!receiverId) {
            alert('Veuillez sélectionner un utilisateur.');
            return;
        }

        if (messageContent.trim()) {
            dispatch(addMessage({ receiver_id: receiverId, content: messageContent }));
            setMessageContent(''); // Réinitialise le champ
        } else {
            alert('Le message est vide.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Section Messages */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                {selectedConversation ? (
                    <>
                        <h2>Discussion avec {selectedConversation.username}</h2>
                        {loading ? (
                            <p>Chargement des messages...</p>
                        ) : error ? (
                            <p>Erreur : {error}</p>
                        ) : (
                            selectedConversation.messages.map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent:
                                            msg.sender_id === Number(sessionStorage.getItem('user_id'))
                                                ? 'flex-end'
                                                : 'flex-start',
                                        margin: '10px 0',
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: '70%',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            backgroundColor:
                                                msg.sender_id === Number(sessionStorage.getItem('user_id'))
                                                    ? '#d1ffd1'
                                                    : '#f1f1f1',
                                        }}
                                    >
                                        <p style={{ margin: 0 }}>{msg.content}</p>
                                        <small style={{ fontSize: '0.8em', color: 'gray' }}>
                                            {msg.sender_id === Number(sessionStorage.getItem('user_id'))
                                                ? 'Vous'
                                                : `Utilisateur ${msg.sender_id}`} -{' '}
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef}></div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                        <p>Aucune conversation sélectionnée. Rédigez un nouveau message.</p>
                    </div>
                )}
            </div>

            {/* Section Composer */}
            <div style={{ borderTop: '1px solid #ddd', padding: '10px' }}>
                {!selectedConversation && (
                    <select
                        value={receiverId}
                        onChange={(e) => setReceiverId(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    >
                        <option value="">-- Sélectionnez un utilisateur --</option>
                        {users.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                )}
                <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Tapez votre message ici..."
                    rows="3"
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                    }}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Messages;
