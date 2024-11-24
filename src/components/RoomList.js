import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms, selectRoom } from "../redux/roomsSlice.js";
import { useNavigate, useLocation } from "react-router-dom";
import {selectRoomConversation} from "../redux/convRoomSlice.js";

export function RoomList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { list: rooms, loading, error } = useSelector((state) => state.rooms);

    const currentUserName = sessionStorage.getItem("username");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        console.log(currentUserName);
    if (!token) {
    console.error("Token introuvable dans sessionStorage");
    }

        dispatch(fetchRooms());
    }, [dispatch]);

    const handleRoomClick = (room) => {

        console.log("roooooooooom",room);
        dispatch(selectRoom(room));
        dispatch(selectRoomConversation(room));
        navigate(`/messages/room/${room.room_id}`);
    };
    

    return (
        <ul className="space-y-4">
            {rooms.map((room) => (
                <li
                    key={room.room_id}
                    className="p-2 cursor-pointer hover:bg-gray-200 rounded"
                >
                    <button
                        onClick={() => handleRoomClick(room)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                handleRoomClick(room);
                            }
                        }}
                        style={{
                            all: "unset",
                            cursor: "pointer",
                            display: "inline",
                        }}

                    >
                        
                        <p className="font-medium">{room.name}</p>
                        
                        <p className="text-xs text-gray-500">
                            Créé le {new Date(room.created_on).toLocaleString()}
                        </p>
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default RoomList;
