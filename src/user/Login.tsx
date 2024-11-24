import {useState} from "react";
import {loginUser} from "./loginApi";
import {Session} from "../model/common";
import {CustomError} from "../model/CustomError";
import Navbar from "../pages/navbar.jsx";
import { useNavigate } from "react-router-dom";

export function Login() {

    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        loginUser({user_id: -1, username:  data.get('login') as string, password: data.get('password') as string},
            (result: Session) => {
                console.log(result);
                setSession(result);
                form.reset();
                setError(new CustomError(""));
                navigate("/messages");
            }, (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                setSession({} as Session);
            });
    };
    

    return(<>

        <div className="min-h-screen bg-white">
                <div>
                  <Navbar/>
                </div>
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="flex justify-center">
            
            <img
                src="/ubo.png"
                alt="Logo UBO"
                className="w-max h-max" 
            />
        </div>
               
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {session.token && (
                    <div className="p-4 bg-green-100 text-green-700 rounded-md shadow-md mb-4">
                        <span className="font-semibold">Connecté en tant que : </span>
                        <span>{session.username}</span>
                        <span className="ml-2 font-mono text-xs text-gray-500">Token: {session.token}</span>
                    </div>
                )}

                {error.message && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md shadow-md mb-4">
                        <span className="font-semibold">Erreur : </span>
                        <span>{error.message}</span>
                    </div>
                )}
              <form onSubmit={handleSubmit}  className="space-y-6">
                <div>
                  <label htmlFor="login" className="block text-sm/6 font-medium text-gray-900">
                    Idnetifiant
                  </label>
                  <div className="mt-2">
                    <input
                      id="login"
                      name="login"
                      type="text"
                      required
                    
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
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    CONNEXION
                  </button>
                </div>
              </form>
    
             
            </div>
                </div>
         </div>   
        </>
        );
}