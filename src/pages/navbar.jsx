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
        <nav>
           
              
           <button onClick={() => navigate('/register')}>INSCRIRE</button>
              {isAuthenticated ? (
                <button onClick={handleLogout}>DECONNEXION</button>
            ) : (
                <button onClick={() => navigate('/')}>CONNEXION</button>
            )}
            
        </nav>
    )
}