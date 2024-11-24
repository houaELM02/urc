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

        // Vérifier si un room_id est fourni
        const { room_id } = req.query;
        if (!room_id) {
            return res.status(400).json({ error: "Room ID is required" });
        }

        console.log(`Fetching messages for room: ${room_id}`);

        // Récupération des messages depuis Redis
        const messages = await redis.lrange(`room:${room_id}`, 0, -1);

        // Parser les messages
        const parsedMessages = messages.map((msg) => {
            try {
                return JSON.parse(msg);
            } catch (error) {
                console.error("Error parsing message:", msg);
                throw new Error("Invalid message format in Redis");
            }
        }).reverse();

        // Retourner les messages au client
        res.status(200).json(parsedMessages);
    } catch (error) {
        console.error("Error fetching room messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
