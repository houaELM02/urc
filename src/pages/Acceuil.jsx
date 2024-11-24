import React from "react";
import Navbar from "./navbar.jsx";
import UserList from "../components/UserList.js";
import RoomList from "../components/RoomList.js";
import UserMessage from "../components/UserMessage.js";
import RoomMessage from "../components/RoomMessage.js";
import { useSelector } from "react-redux";

export function Acceuil() {
    const { selectedConversation } = useSelector((state) => state.conversations);
    const { selectedRoom } = useSelector((state) => state.roomConversations);

    console.log("conversation selected",selectedConversation);
    console.log("roomselected",selectedRoom)
    return (
        <>
            <Navbar />
            <div className="flex h-screen overflow-hidden">
                {/* Colonne gauche */}
                <div className="w-1/4 border-r border-gray-300 overflow-y-auto p-4">
                    {/* Liste des utilisateurs */}
                    <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>
                    <UserList />

                    {/* Liste des rooms */}
                    <h2 className="text-lg font-semibold mt-8 mb-4">Rooms</h2>
                    <RoomList />
                </div>

                {/* Section Messages à droite */}
                <div className="flex-1 flex flex-col p-6">
                    { selectedConversation ? (
                        <UserMessage />
                    ) :  selectedRoom? (
                        <RoomMessage/>
                    ) : (
                        <div className="text-center text-gray-500">
                            Sélectionnez un utilisateur ou un salon pour commencer la discussion.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Acceuil;
