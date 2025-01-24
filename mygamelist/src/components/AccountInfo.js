import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileOverlay from './ProfileOverlay.js';
import './AccountInfo.css';

const fetchTopRatedGamesByGenre = async (genre) => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  try {
    const response = await fetch(`${BASE_URL}/top_rated_games_by_genre?genre=${genre}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux par genre :", error);
    return [];
  }
};

const AccountInfo = () => {
  const [gameList, setGameList] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [connectedDevices, setConnectedDevices] = useState(['Device 1', 'Device 2']);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const genres = ["Aventure"];

  useEffect(() => {
    const loadGamesByGenre = async () => {
      setLoadingGames(true);
      try {
        const promises = genres.map((genre) => fetchTopRatedGamesByGenre(genre));
        const results = await Promise.all(promises);
        const newGamesByGenre = genres.reduce((acc, genre, index) => {
          acc[genre] = results[index] || [];
          return acc;
        }, {});

        setGameList(newGamesByGenre["Aventure"] || []);
      } catch (err) {
        setError("Erreur lors du chargement des jeux");
      } finally {
        setLoadingGames(false);
      }
    };

    loadGamesByGenre();
  }, []);

  const handleBack = () => {
    navigate(-1); // Retour à la page précédente
  };

  const handleLogout = () => {
    // Logique de déconnexion ici
    console.log('Déconnecté');
  };

  const handleDeleteAccount = () => {
    // Logique pour supprimer le compte
    console.log('Compte supprimé');
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    // Logique pour modifier le mot de passe
    console.log("Mot de passe modifié :", { oldPassword, newPassword });
  };

  return (
    <div className="account-info">
      <button className="back-button" onClick={handleBack}>Retour</button>
      <h2 className="account-title">Mon Compte</h2>

      {/* ProfileOverlay avec les informations du compte, avatar, bio et sélection de jeux */}
      <ProfileOverlay 
        gameList={gameList}
        loadingGames={loadingGames}
        error={error}
        connectedDevices={connectedDevices}
      />

      <div className="account-actions">
        {/* Section pour afficher les derniers appareils connectés */}
        <div className="action">
          <h4>Derniers Appareils Connectés</h4>
          <p>Liste des appareils récemment utilisés pour accéder à votre compte </p>
          <ul>
            {connectedDevices.map((device, index) => (
              <li key={index}>{device}</li>
            ))}
          </ul>
        </div>

        {/* Section pour modifier le mot de passe */}
        <div className="action">
          <h4>Modifier le Mot de Passe</h4>
          <p>Pour des raisons de sécurité, nous vous recommandons de modifier votre mot de passe régulièrement</p>
          <div className="password-change">
            <input
              type="password"
              placeholder="Ancien mot de passe"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="btn blue-outline" onClick={handleChangePassword}>
            Modifier le Mot de Passe
            </button>
          </div>
        </div>

        {/* Section pour se déconnecter */}
        <div className="action">
          <h4>Se Déconnecter</h4>
          <p>Terminez votre session actuelle en toute sécurité </p>
          <button onClick={handleLogout} className="btn red-outline">
            Se déconnecter
          </button>
        </div>

        {/* Section pour supprimer le compte */}
        <div className="action">
          <h4>Supprimer le Compte</h4>
          <p>Cette action est <span className='alert'>irréversible</span>. Supprimez votre compte et toutes les données associées </p>
          <button onClick={handleDeleteAccount} className="btn red">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
