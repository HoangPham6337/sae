import React, { useEffect, useState } from "react";
import "./GameDetails.css";
import Commentaire from "./Commentaires.js";

function GameDetails({ game, onBack }) {
  const [artwork, setArtwork] = useState(null); // Utiliser une seule image d'artwork
  const [video, setVideo] = useState(null);
  const [added, setAdded] = useState(false); // État pour savoir si le jeu est ajouté

  const handleAddClick = () => {
    if (!added) {
      setAdded(true);
    }
  };

  useEffect(() => {
    if (game.artworks && game.artworks.length > 0) {
      // Récupérer uniquement le premier artwork
      setArtwork(game.artworks[0]?.original);
    }

    if (game.videos && game.videos.length > 0) {
      const videoUrl = game.videos[0];
      const videoId = videoUrl.split("v=")[1]?.split("&")[0];
      setVideo(videoId);
    }
  }, [game]);

  const renderDataBlock = (title, content) => (
    <div className="data-block">
      <strong>{title}:</strong>
      <span>{content || "Pas d'information"}</span>
    </div>
  );

  const renderDataArray = (title, items) => (
    <div className="data-block">
      <strong>{title}:</strong>
      <div className="data-list">
        {items.length > 0 ? (
          items.map((item, index) => (
            <span key={index} className="data-item">{item}</span>
          ))
        ) : (
          <span>Pas d'information</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="game-details">
      <button className="back-button" onClick={onBack}>
        Retour
      </button>

      <div className="artwork-container">
        {/* Afficher uniquement le premier artwork */}
        {artwork ? (
          <img
            src={artwork} // Utilisation du premier artwork
            alt="Artwork du jeu"
            className="game-artwork"
          />
        ) : (
          <p>Aucun artwork disponible</p>
        )}
      </div>

      <div className="game-cover-container">
        <img
          src={game.cover?.original || ""}
          alt={game.title || "Couverture indisponible"}
          className="game-cover"
        />
        <button
          className={`add-button ${added ? 'added' : ''}`}
          onClick={handleAddClick}
        >
          {added ? 'Ajouté' : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              className="icon"
            >
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                strokeWidth="1.5"
                fill="none"
              ></path>
              <path d="M8 12H16" strokeWidth="1.5" fill="none" stroke="white"></path>
              <path d="M12 16V8" strokeWidth="1.5" fill="none" stroke="white"></path>
            </svg>
          )}
        </button>
      </div>

      <h2 className="game-title">{game.title || "Titre indisponible"}</h2>

      <div className="game-meta">
        {game.description && (
          <div className="data-block description">
            <strong>Description:</strong>
            <span>{game.description || "Pas d'information"}</span>
          </div>
        )}

        {renderDataArray("Genres", game.genres || [])}
        {renderDataArray("Plateformes", game.platforms || [])}
        {renderDataArray("Développeurs", game.developers || [])}
        {renderDataArray("Éditeurs", game.publishers || [])}
        {renderDataArray("Modes de jeu", game.game_modes || [])}
        {renderDataArray("Perspectives du joueur", game.player_perspectives || [])}
        {renderDataArray("Thèmes", game.themes || [])}
        {renderDataBlock("Date de sortie", game.release_date || "Pas d'information")}
        {renderDataArray("Franchise", game.franchises || ["Pas d'information"])}
        {renderDataArray("DLC", game.dlcs?.length > 0 ? game.dlcs : ["Pas de DLC"])}
        {renderDataArray("Moteur de jeu", game.game_engines || ["Pas d'information"])}

        {video ? (
          <div className="data-block">
            <strong>Vidéo:</strong>
            <iframe
              src={`https://www.youtube.com/embed/${video}`}
              title="Video trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="video-iframe"
            />
          </div>
        ) : (
          <div className="data-block">
            <strong>Vidéo:</strong> Non disponible
          </div>
        )}
        
      </div>
      <div className="comments-section">
   
        <Commentaire />
      </div>
    </div>
  );
}

export default GameDetails;
