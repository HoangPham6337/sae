import React from "react";
import { useNavigate } from "react-router-dom";


const fetchWrapper = async (link, authRequired) => {
  let accesToken;
  authRequired && (accesToken = localStorage.getItem('accessToken'));

  

    const response = await fetch(link, {
      method: "POST",
      credentials: "include",
      headers:{
        ...(accesToken && {'Authorization': accesToken ? `Bearer ${accesToken}` : ''}),
        'Content-Type': 'application/json',
      }
    }
  )
  
 return response;
 
  
}
const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetchWrapper("http://localhost:5001/logout",true);
      
      if (response.ok) {
        console.log("Déconnexion réussie.");
        
        localStorage.removeItem('accessToken');
        navigate("/"); // Rediriger vers la page d'accueil
      } else {
        console.error("Erreur lors de la déconnexion.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  return (
    <div>
      <h1>Déconnexion</h1>
      <input
        type="button"
        value="Se déconnecter"
        onClick={handleLogout}
      />
    </div>
  );
};

export default Logout;
