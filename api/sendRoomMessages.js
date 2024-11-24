import { getConnecterUser, triggerNotConnected } from "../lib/session.js";
import { Redis } from "@upstash/redis";
import { db } from '@vercel/postgres';
import PushNotifications from "@pusher/push-notifications-server";

const redis = Redis.fromEnv();

export default async function (request, response) {
    try {
        // Vérification de l'utilisateur connecté
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("User not connected");
            return triggerNotConnected(response);
        }

        // Récupération du message
        const message = await request.body;
        if (!message || !message.room_id || !message.content) {
            console.error("Invalid message payload:", message);
            return response.status(400).json({
                error: "Invalid payload: room_id and content are required",
            });
        }

        // Génération de la clé pour le salon
        const roomKey = `room:${message.room_id}`;
        console.log(`Generated room key: ${roomKey}`);

        // Données du message
        const messageData = {
            sender_id: user.id,
            room_id: message.room_id,
            content: message.content,
            timestamp: Date.now(),
        };

        // Enregistrement du message dans Redis
        await redis.lpush(roomKey, JSON.stringify(messageData));
        await redis.expire(roomKey, 24 * 60 * 60);
        console.log("Message successfully saved in Redis.");

        // Configuration de Pusher Beams
        const beamsClient = new PushNotifications({
            instanceId: '272a3cc0-cb19-4554-bab7-758a2ee42882',
            secretKey: '9A864F59041C1C26BCC49CF3187DB651B6651073AE72C27E0362E1C956B60D4A',
        });

        // Récupération des utilisateurs du salon
        const roomMembersResult = await db.sql`
            SELECT external_id
            FROM users;
        `;

        if (roomMembersResult.rowCount > 0) {
            const externalIds = roomMembersResult.rows.map((row) => row.external_id);

            // Envoyer des notifications push à tous les membres du salon
            await beamsClient.publishToUsers(externalIds, {
                web: {
                    notification: {
                        title: `Message dans ${message.room_id}`,
                        body: message.content,
                        icon: "https://www.univ-brest.fr/themes/custom/ubo_parent/favicon.ico",
                    },
                    data: {
                        roomKey,
                    },
                },
            });
            console.log("Notifications sent to room members.");
        } else {
            console.warn("No members found for the room.");
        }

        return response.status(200).json({
            sender_id: messageData.sender_id,
            message: "Message sent successfully",
            date: messageData.timestamp,
        });
    } catch (error) {
        console.error("Unhandled server error:", error);
        return response.status(500).json({ error: "Internal server error" });
    }
}
