import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GameDetails from "./GameDetails.js";
import "./TopGames.css";

const TopGames = () => {
  const { type, value } = useParams(); // Récupère `type` et `value` depuis l'URL
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);

        // Construire dynamiquement l'URL basée sur `type` et `value`
        const url = `http://localhost:5001/top_rated_by_${type}?${type}=${value}`;

        console.log("Requête URL:", url);

        const response = await fetch(url);

        // Vérifier si la réponse est bien du JSON
        const text = await response.text(); // Lire la réponse en texte
        try {
          const data = JSON.parse(text); // Essayer de parser la réponse
          if (!response.ok) {
            throw new Error(`Erreur de réponse: ${data.message || 'Erreur inconnue'}`);
          }

          setGames(data); // Si la réponse est valide, la mettre dans le state
        } catch (err) {
          console.error("Erreur lors de la lecture de la réponse JSON:", err);
          setError("La réponse du serveur n'est pas au format JSON.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des jeux:", error);
        setError("Erreur lors de la récupération des jeux.");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [type, value]); // Rechargement de l'effet chaque fois que `type` ou `value` change

  if (loading) {
    return <p>Chargement des jeux...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Erreur: {error}</p>;
  }

  const handleBack = () => {
    if (selectedGame) {
      setSelectedGame(null);
    } else {
      navigate(-1);
    }
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  if (selectedGame) {
    return <GameDetails game={selectedGame} onBack={handleBack} />;
  }

  const getTypeLabel = (type) => {
    const filterMap = {
      genres: "le genre",
      themes: "le thème",
      platforms: "la plateforme",
      developers: "le développeur",
      publishers: "l'éditeur",
    };

    return filterMap[type] || "le classement";
  };

  return (
    <div className="top-games">
      <h3>
        Top Jeux pour {getTypeLabel(type)} : {value}
      </h3>
      <button className="back-button" onClick={handleBack}>
        Retour
      </button>

      {games.length > 0 ? (
        <>
          <div className="top-three">
            {games.slice(0, 3).map((game, index) => (
              <div key={index} className="game-container">
                <span className={`rank-badge-${index + 1}`}>#{index + 1}</span>
                <div className="game-cover" onClick={() => handleGameClick(game)}>
                  <img src={game.cover.original} alt={game.title} />
                </div>
                <p className="game-title">{game.title}</p>
              </div>
            ))}
          </div>

          <div className="game-table">
            <table>
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Nom</th>
                  <th>Platformes</th>
                  <th>Genres</th>
                  <th>Développeurs</th>
                  <th>Éditeurs</th>
                  <th>Thèmes</th>
                  <th>Date de sortie</th>
                </tr>
              </thead>
              <tbody>
                {games.slice(3).map((game, index) => (
                  <tr key={index}>
                    <td>{index + 4}</td>
                    <td onClick={() => handleGameClick(game)}>
                      <a href="#">{game.title}</a>
                    </td>
                    <td>{game.platforms?.join(", ")}</td>
                    <td>{game.genres?.join(", ")}</td>
                    <td>{game.developers?.join(", ")}</td>
                    <td>{game.publishers?.join(", ")}</td>
                    <td>{game.themes?.join(", ")}</td>
                    <td>{game.release_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Aucun jeu trouvé pour {getTypeLabel(type)} {value}.</p>
      )}
    </div>
  );
};

export default TopGames;
