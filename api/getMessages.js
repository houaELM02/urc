import { getConnecterUser, triggerNotConnected } from "../lib/session.js";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async (request, response) => {
    try {
        const user = await getConnecterUser(request);
        if (!user) {
            console.log("User not connected");
            return triggerNotConnected(response);
        }

        const {receiver_id } = await request.body;

        if (!receiver_id) {
            return response.status(400).json({ error: "receiver_id is required" });
        }

        const conversationKey = getConversationKey(user.id, receiver_id);
        

        // Récupérer les messages depuis Redis
        const messages = await redis.lrange(conversationKey, 0, -1);

        // Décoder les messages JSON
        const parsedMessages = messages.map((msg) => {
            try {
                return typeof msg === "string" ? JSON.parse(msg) : msg;
            } catch (error) {
                console.error("Error parsing message:", msg);
                throw new Error("Invalid message format in Redis");
            }
        }).reverse();

        response.status(200).json(parsedMessages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        response.status(500).json({ error: "Internal server error" });
    }
};

function getConversationKey(userId1, userId2) {
    const sortedIds = [userId1, userId2].sort();
    return `conversation:${sortedIds[0]}:${sortedIds[1]}`;
}
