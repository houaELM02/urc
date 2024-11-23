import React from 'react';



const AddMessage = ({ receiverId, messageContent, onSuccess, onError }) => {
   
    const handleSendMessage = async () => {
        try {
            const token = sessionStorage.getItem('token'); // Supposons que le token est stocké dans sessionStorage
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiver_id: receiverId,
                    content: messageContent,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (onError) onError(errorData.error || 'Échec de l’envoi du message.');
                return;
            }

            //if (onSuccess) onSuccess(messageContent);
            const result = await response.json();
            //onSuccess(result);
            if (onSuccess) onSuccess({msg : messageContent, date : result.date});
        } catch (err) {
            if (onError) onError('Erreur réseau ou serveur.');
        }
    };

    return (
        <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
            ENVOYER
        </button>
    );
};

export default AddMessage;
