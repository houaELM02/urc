import React from 'react';
import Navbar from "./navbar.jsx";
import UserList from "../components/UserList.js";
import UserMessage from '../components/UserMessage.js';
import { useSelector } from 'react-redux';

export  function Acceuil(){
    const { selectedConversation } = useSelector((state) => state.conversations);
    return (
        <>
        <Navbar/>
        <div className="flex h-screen overflow-hidden">
            {/* Liste des utilisateurs à gauche */}
            <div className="w-1/4 border-r border-gray-300 overflow-y-auto p-4">
                <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>
                <UserList />
            </div>

            {/* Section Messages et Composition à droite */}
            <div className="flex-1 flex flex-col p-6">
                <UserMessage />
            </div>
        </div>
        </>
    );

}
export default Acceuil;