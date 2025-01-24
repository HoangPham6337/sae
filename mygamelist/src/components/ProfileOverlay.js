import React, { useState } from 'react';
import './ProfileOverlay.css';

const ProfileOverlay = ({ gameList, loadingGames, error }) => {
  const [username] = useState('MikyAT');
  const [email] = useState('michaelatici9@email.com');
  const [memberSince] = useState('Janvier 2025');
  const [bio] = useState('Salut la team !');
  const [avatar, setAvatar] = useState(null);
  const [selectedGames, setSelectedGames] = useState([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const colors = [
    "#ff5733", "#33ff57", "#3357ff", "#ff33a8", "#a833ff",
    "#33ffe4", "#ffe433", "#ff8333", "#6eff33", "#ff3333"
  ];

  const changeColor = () => {
    setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleGameSelection = (e) => {
    const selectedGame = e.target.value;
    if (selectedGames.length < 3 && !selectedGames.includes(selectedGame)) {
      setSelectedGames([...selectedGames, selectedGame]);
    }
  };

  const handleGameRemove = (gameTitle) => {
    setSelectedGames(selectedGames.filter((game) => game !== gameTitle));
  };

  return (
    <div className="overlay-card">
      <div
        className="overlay-editable-header"
        style={{
          backgroundColor: colors[currentColorIndex],
        }}
      ></div>
      <div className="overlay-content">
        

        <div className="avatar-section">
          <div className="avatar-container">
            <div
              className="avatar"
              style={{
                backgroundImage: `url(${avatar || ''})`,
                backgroundColor: avatar ? 'transparent' : '#191c1f',
              }}
            ></div>
            <input
              type="file"
              id="avatar-upload"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload" className="edit-avatar-btn">Modifier l'avatar</label>
          </div>
        </div>
        <div className="bio-section">
          <textarea
            value={bio}
            readOnly
            className="bio-textarea"
          />
        </div>
        <div className="account-info">
          <h3 className="account-title">{username}</h3>
          <p className="account-details">{email}</p>
          <p className="account-details">Membre depuis: {memberSince}</p>
        </div>

        <div className="account-actions-game">
          <h4>Choisir vos jeux</h4>
          <select onChange={handleGameSelection} value="">
            <option value="">Choisir un jeu</option>
            {gameList.length > 0 ? (
              gameList.map((game, index) => (
                <option key={index} value={game.title}>
                  {game.title}
                </option>
              ))
            ) : loadingGames ? (
              <option>Chargement...</option>
            ) : (
              <option>{error || 'Aucun jeu disponible'}</option>
            )}
          </select>

          <div className="selected-games">
            {selectedGames.length === 0 ? (
              <p>Aucun jeu sélectionné</p>
            ) : (
              selectedGames.map((gameTitle, index) => (
                <div key={index} className="game-item">
                  <p>{gameTitle}</p>
                  <button onClick={() => handleGameRemove(gameTitle)} className="remove-game-btn">
                    Supprimer
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <button onClick={changeColor} className="change-color-btn">
        Changer la couleur
      </button>
    </div>
  );
};

export default ProfileOverlay;
