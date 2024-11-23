import React, { useEffect } from 'react';
import { Client ,TokenProvider } from "@pusher/push-notifications-web";



console.log("Notifications component loaded");

const beamsClient = new Client({
    instanceId: "272a3cc0-cb19-4554-bab7-758a2ee42882",
});

const Notifications = ({ children }) => {
    useEffect(() => {
        const initializePushNotifications = async () => {
        const token = sessionStorage.getItem('token');
        const userExternalId = sessionStorage.getItem('externalId');

    if (!token || !userExternalId) {
        console.error('Token or External ID is missing!');
        return; 
    }


    const beamsTokenProvider = new TokenProvider({
                url: "/api/beams",
                headers: {
                    Authorization: "Bearer " + token,
                },
    });
    try {
                await beamsClient.start();
                await beamsClient.addDeviceInterest('global'); 
                console.log("Token beammmm",beamsTokenProvider)
                await beamsClient.setUserId(userExternalId, beamsTokenProvider);
                const deviceId = await beamsClient.getDeviceId();
        } catch (error) {
                console.error("Erreur d'initialisation des notifications push:", error);
        }
    };

        initializePushNotifications();
    }, []);

    return (
        <>
            {children}
        </>
    );
    
};

export default Notifications;