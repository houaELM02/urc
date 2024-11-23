import { getConnecterUser, triggerNotConnected } from "../lib/session.js";
import { Redis } from "@upstash/redis";
import { db } from '@vercel/postgres';
import PushNotifications from "@pusher/push-notifications-server";


const redis = Redis.fromEnv();

export default async (request, response) => {
    try {

        const headers = new Headers(request.headers);
        // Vérification de l'utilisateur connecté
        console.log("Checking user from token...");
        const user = await getConnecterUser(request);
        console.log("User fetched:", user);

        if (!user) {
            console.log("User not connected");
            return triggerNotConnected(response);
        }

        const message = await request.body;
        console.log("Message payload received:", message);

        if (!message || !message.receiver_id || !message.content) {
            console.error("Invalid message payload:", message);
            return response.status(400).json({
                error: "Invalid payload: receiver_id and content are required",
            });
        }

        // Génération de la clé de conversation
        const conversationKey = getConversationKey(user.id, message.receiver_id);
        console.log(`Generated conversation key: ${conversationKey}`);

        // Données du message
        const messageData = {
            sender_id: user.id,
            receiver_id: message.receiver_id,
            content: message.content,
            timestamp: Date.now(),
        };
        console.log("Message data to save:", messageData);

        // Interaction avec Redis
      
            await redis.lpush(conversationKey, JSON.stringify(messageData));
            await redis.expire(conversationKey, 24 * 60 * 60);
            console.log("Message successfully saved in Redis.");


        const beamsClient = new PushNotifications({
            instanceId: '272a3cc0-cb19-4554-bab7-758a2ee42882',
            secretKey: '9A864F59041C1C26BCC49CF3187DB651B6651073AE72C27E0362E1C956B60D4A',
        });    
            
        // Récupérer l'utilisateur destinataire
        //const targetUser = await redis.get(`users:${ message.receiver_id}`); 
        //const parsedTargetUser = JSON.parse(targetUser);

        //console.log("DESTINATAIRE ",targetUser);


        const sendPushNotification = async (externalId, message, user) => {
        try{
            await beamsClient.publishToUsers(externalId, {
                web: {
                    notification: {
                        title: user.username,
                        body: message.content,
                        icon: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                    },
                    data: {
                        conversationKey,
                    },
                },
            });
            console.log("Notification sent!!!!!");
        }catch (error) {
            console.error("Error sending notification:", error);
        }
    };
            
    const receiverResult = await db.sql`
                SELECT external_id
                FROM users
                WHERE user_id = ${message.receiver_id};
            `;

    if (receiverResult.rowCount > 0) {
                const receiverExternalId = receiverResult.rows[0].external_id;
                await sendPushNotification([receiverExternalId], message, user);
    } else {
                return response.status(404).json({ error: "Receiver not found." });
    }
        
        
    return response.status(200).json({ message: "Message saved successfully",date: messageData.timestamp });

    } catch (error) {
        console.error("Unhandled server error:", error);
        return response.status(500).json({ error: "Internal server error" });
    }
};

function getConversationKey(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `conversation:${sortedIds[0]}:${sortedIds[1]}`;
}
