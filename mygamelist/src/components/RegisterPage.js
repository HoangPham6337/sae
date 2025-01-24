import React from "react";
import { Link } from "react-router-dom";
import "./auth.css"; // Import du CSS

function RegisterPage() {
  return (
    <div className="auth-page">
      {/* Section gauche : texte d'accueil */}
      <div className="welcome-section">
      <h1>Bienvenue sur <Link to="/" className="gameverse-link"> GameVerse</Link></h1>
        <p>Créez un compte pour commencer à organiser votre collection de jeux.</p>
      </div>

      {/* Section droite : formulaire d'inscription */}
      <div className="login-section">
        <h2>Inscription</h2>
        <form>
        <div class="input-group">
        <input type="text" id="text" class="input" required />
          <label For="text" class="user-label">Nom d'utilisateur</label> 
        </div>
        <div class="input-group">
        <input type="email" id="email" class="input" required />
        <label for="email" class="user-label">Email</label>
      </div>

          <div class="input-group">
          <input type="password" id="password" class="input" required />
          <label For="password" class="user-label">Mot de passe</label>
          </div>
          <button type="submit">S'inscrire</button>
        </form>
        <p>
          Déjà inscrit ? <Link to="/login">Connectez-vous ici</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
