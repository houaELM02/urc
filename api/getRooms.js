import { db } from "@vercel/postgres";
import { getConnecterUser, triggerNotConnected } from "../lib/session.js";

export default async (req, res) => {
    try {
        // Vérification de l'utilisateur connecté
        const user = await getConnecterUser(req);
        if (!user) {
            console.error("User not connected");
            return triggerNotConnected(res);
        }

        // Récupérer les rooms depuis la base de données
        const result = await db.query("SELECT * FROM rooms ORDER BY created_on DESC");

        // Filtrer les rooms si nécessaire (optionnel)
        const filteredRooms = result.rows; // Vous pouvez ajouter une logique de filtrage basée sur `user`

        res.status(200).json(filteredRooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
