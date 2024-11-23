import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./RegisterApi";
import Navbar from "../pages/navbar";
import { CustomError } from "../model/CustomError"; // Assurez-vous que le chemin est correct

export function Register() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const username = data.get("username") as string;
    const password = data.get("password") as string;
    const email = data.get("email") as string;

    // Vérification de la longueur de l'identifiant et du mot de passe
    if (username.length < 4) {
      setError("L'identifiant doit contenir au moins 4 caractères.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsSubmitting(true);
    registerUser(
      { username, password, email },
      () => {
        form.reset();
        setIsSubmitting(false);
        setError(null);
        navigate("/messages"); // Redirection vers la page de connexion après inscription réussie
      },
      (registerError: CustomError) => {  // Ajout du type CustomError ici
        setIsSubmitting(false);
        setError(registerError?.message || "Une erreur s'est produite lors de l'inscription.");
      }
    );
  };

  return (<>
        <div className="min-h-screen bg-white">
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div>
                  <Navbar/>
                </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit}  className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                    Idnetifiant
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                    
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
                      name="email"
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
         {error && <div className="mt-2 text-red-500">{error}</div>} 
        </>
  );
}