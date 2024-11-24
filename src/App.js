import './App.css';
import {Login} from "./user/Login.tsx";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Acceuil from './pages/Acceuil.jsx';
import Register from './auth/Register.js';
import React, { useEffect } from 'react';
import Notifications from "../src/components/pusher.js";

function App() {

  
  window.Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log("Notifications autorisées");
    } else {
      console.log("Notifications non autorisées");
    }
  });

  useEffect(() => {
    // Assurez-vous que le service worker est disponible
    if ('serviceWorker' in navigator) {
      const sw = navigator.serviceWorker;

      // Écouter le message envoyé depuis le service worker
      sw.onmessage = (event) => {
        console.log('Got event from SW:', event.data);

        // Vous pouvez traiter le message ici. Par exemple, vous pouvez afficher un toast, une alerte ou mettre à jour l'état
        const { title, message } = event.data;  // Assurez-vous que `event.data` contient les bonnes informations
        alert(`New Notification: ${title} - ${message}`);
      };
    }
  }, []);

  return (
    <Notifications>
    <Router>
    
    <main >
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/messages' element={<Acceuil/>} />
        <Route path='/messages/user/:user_id' element={<Acceuil/>} />
        <Route path='/messages/room/:room_id' element={<Acceuil/>} />
        </Routes>
    </main>
  </Router>
  </Notifications>
  );
}

export default App;

/** const isAuthenticated = !!sessionStorage.getItem('token'); // Vérifie si l'utilisateur est connecté

    return (
        <Router>
            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    ); */
