import { Redis } from "@upstash/redis";
import { getConnecterUser, triggerNotConnected } from "../lib/session.js";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    try {
        // Vérification de l'utilisateur connecté
        const user = await getConnecterUser(req);
        if (!user) {
            console.error("User not connected");
            return triggerNotConnected(res);
        }

        // Vérifier la méthode de requête
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed. Use POST." });
        }

        // Extraction du room_id depuis le corps de la requête
        const { room_id } = await req.body;
        if (!room_id) {
            return res.status(400).json({ error: "Room ID is required." });
        }

        console.log(`Fetching messages for room ID: ${room_id}`);

        const roomKey = `room:${room_id}`;
        const messages = await redis.lrange(roomKey, 0, -1);
        console.log('Raw messages from Redis:', messages);
        console.log("User current", user.id , user.username);

        //const parsedMessages = messages.map(messages);
        //res.status(200).json(parsedMessages.reverse());
        //res.status(200).json({messages : messages.reverse(), user_id: user.user_id});
   
        //res.status(200).json(messages.reverse());

        const enrichedMessages = messages.reverse().map((message) => ({
            ...message, // Données du message existant
            user: {
                id: user.id, // ID de l'utilisateur
                username: user.username, // Nom d'utilisateur
            },
        }));

        // Envoyer la réponse JSON
        res.status(200).json(enrichedMessages);
    } catch (error) {
        console.error("Error fetching room messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
