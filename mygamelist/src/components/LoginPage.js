import React from "react";
import { Link } from "react-router-dom";
import "./auth.css";

function LoginPage() {
  return (
    <div className="auth-page">
      {/* Section gauche avec le texte d'accueil */}
      <div className="welcome-section">
  <h1>Bienvenue sur <Link to="/" className="gameverse-link"> GameVerse</Link></h1>
  <p>
    Découvrez, suivez et organisez votre collection de jeux en toute simplicité.
    <br />
    <em>Le jeu n'est pas seulement un divertissement, c'est une aventure où chaque choix façonne notre destin, comme un capitaine qui guide son navire à travers l'océan de possibilités.</em>
  </p>
</div>


      {/* Section droite avec le formulaire */}
      <div className="login-section">
        <h2>Connexion</h2>
        <form>
        <div class="input-group">
        <input type="email" id="email" class="input"  required />
        <label for="email" class="user-label">Email</label>
      </div>
      <div class="input-group">
        <input type="password" id="password" class="input" required />
        <label for="password" class="user-label">Mot de passe</label>
      </div>
          <button type="submit">Se connecter</button>
        </form>
        <p>
          Pas encore inscrit ? <Link to="/register">Créez un compte</Link>
        </p>
        <p>
          Mot de passe oublié ? <Link to="/change-password">Changez-le ici</Link>
        </p>
        <p className="terms">
          En cliquant sur "Se connecter", vous acceptez nos{" "}
          <Link to="/terms">Conditions d'utilisation</Link> et notre{" "}
          <Link to="/privacy">Politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
