import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUser } from '../redux/usersSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectConversation } from '../redux/conversationSlice';



export function UserList(){
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const selectedConversation = useSelector((state) => state.conversations.selectedConversation);
    const location = useLocation(); 

    const { list: users, loading, error } = useSelector((state) => state.users);

    const currentUserName = sessionStorage.getItem("username");
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        console.log(currentUserName);
    if (!token) {
    console.error("Token introuvable dans sessionStorage");
    }

        dispatch(fetchUsers());
    }, [dispatch]);

    const handleUserClick = (user) => {
        dispatch(selectUser(user));
        dispatch(selectConversation(user));
        //navigate(`user/${user.user_id}`);

        const newPath = `/messages/user/${user.user_id}`;

        // Vérifie si l'URL actuelle est différente de la nouvelle URL
        if (location.pathname !== newPath) {
            navigate(newPath, { replace: true }); // Met à jour l'URL sans ajouter un segment supplémentaire
        }
    };

    
    
    //if (loading) return <p>Chargement des utilisateurs...</p>;
    //if (error) return <p>Erreur : {error}</p>;

    return (
        <ul className="space-y-4">
    {users
        .filter((user) => user.username !== currentUserName)
        .map((user) => (
            <li key={user.user_id}
            className="p-2 cursor-pointer hover:bg-gray-200 rounded"
                
            >
                <button
                    onClick={() => handleUserClick(user)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            handleUserClick(user);
                        }
                    }}
                    style={{
                        all: "unset",
                        cursor: "pointer",
                        display: "inline",
                    }}
                >
                    
                    <p className="font-medium">{user.username}</p>
                    <p className="text-xs text-gray-500">{new Date(user.last_login).toLocaleString()}</p>
                
                     </button>
            </li>
        ))}
</ul>


    );
    
}

export default UserList;