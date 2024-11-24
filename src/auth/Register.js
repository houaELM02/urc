import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../pages/navbar.jsx";
import { useDispatch , useSelector} from "react-redux";
import { registerUser } from "../redux/authSlice.js";


export function Register() {
 const navigate = useNavigate();
 const { user, loading, error } = useSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const registerHandle = (e) => {
    e.preventDefault() ;
    console.log({username,email,password});
    dispatch(registerUser({username,email,password}))
  }
  useEffect(() => {
    if (user) {
       
        navigate('/messages');
    }
}, [user, navigate]);

  return (<>
        <div className="min-h-screen bg-white">
        <div>
                  <Navbar/>
                </div>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center">
            
            <img
                src="/ubo.png"
                alt="Logo UBO"
                className="w-max h-max" 
            />
        </div>
        {loading && (
    <p className="text-center text-blue-500 font-semibold">
        Chargement...
    </p>
)}
{error && (
    <p className="text-center text-red-500 font-semibold bg-red-100 p-2 rounded">
        Erreur : {error}
    </p>
)}
              <form  onSubmit={registerHandle}  className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                    Idnetifiant
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                      Mot de passe
                    </label>
                    
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Inscrire
                  </button>
                 

                </div>
              </form>
    
             
            </div>
                </div>
         </div> 
        </>
  );
}

export default Register