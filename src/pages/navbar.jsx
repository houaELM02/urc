import { Link } from "react-router-dom";
import { logout } from "../redux/authSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Navbar(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = !!sessionStorage.getItem('token');
    const handleLogout = () => {
        dispatch(logout()); // Déclenche l’action logout
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('externalId')
        sessionStorage.removeItem('username')
        navigate('/'); // Redirige vers la page de connexion
    };

    return(
        <nav className="flex justify-between items-center w-full bg-indigo-600 px-4 py-2 shadow-md">
           
           <div className="flex-1 text-center">
                <h1 className="text-white font-bold text-lg">Chat Application</h1>
            </div>
              
            <div className="flex space-x-4">
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/register')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        INSCRIRE
                    </button>
                )}
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        DECONNEXION
                    </button>
                ) : (
                    <button
                        onClick={() => navigate('/')}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        CONNEXION
                    </button>
                )}
            </div>
        </nav>
    )
}