import React from "react";

const SendMessage = ({ roomId,messageContent , onSuccess, onError }) => {


    const sendMessage = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await fetch("/api/sendRoomMessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ room_id: roomId, content: messageContent }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (onError) onError(errorData.error || 'Échec de l’envoi du message.');
                return;
            }

            //if (onSuccess) onSuccess(messageContent);
            const result = await response.json();
            //onSuccess(result);
            if (onSuccess) onSuccess({sender_id : result.sender_id, msg : messageContent, date : result.date});
        } catch (err) {
           
            if (onError) onError(err);
        }
    };

    return (
        <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
            ENVOYER
        </button>
    );
};

export default SendMessage;
