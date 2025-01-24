import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RankingsPage.css"; // Importation du fichier CSS

const RankingsPage = () => {
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  // Récupération des données de l'API `/filters`
  useEffect(() => {
    const fetchFilters = async () => {
      const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
      try {
        const response = await fetch(`${BASE_URL}/filters`);
        const data = await response.json();
        setFilters(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des filtres :", error);
      }
    };

    fetchFilters();
  }, []);

  // Tableaux statiques pour les développeurs et éditeurs
  const selectedDevelopers = [
    "Naughty Dog",
    "CD Projekt Red",
    "FromSoftware",
    "Rockstar Games",
    "Bungie",
    "Bethesda Game Studios",
    "Ubisoft Montreal",
    "Santa Monica Studio",
    "Square Enix",
  ];

  const selectedPublishers = [
    "Electronic Arts",
    "Activision",
    "Ubisoft",
    "Sony Interactive Entertainment",
    "Nintendo",
    "Microsoft Studios",
    "SEGA",
    "Capcom",
    "Bandai Namco Entertainment",
  ];

  const selectedConsoles = [
    "PlayStation 5",
    "Xbox Series X|S",
    "Nintendo Switch",
    "PlayStation 4",
    "Xbox One",
    "Wii U",
    "Nintendo 3DS",
    "PlayStation 3",
    "Xbox 360",
    "Wii",
    "PlayStation 2",
    "Nintendo GameCube",
    "Game Boy Advance",
    "PlayStation Portable",
    "Dreamcast",
  ];
  

  // Affichage d'un message si les données ne sont pas encore chargées
  if (!filters || Object.keys(filters).length === 0) {
    return <div>Chargement des classements...</div>;
  }

  return (
    <div className="rankings-page">
      {/* Bouton Retour */}
      <button className="back-button" onClick={() => navigate(-1)}>
        Retour
      </button>

      <h1 className="rankings-title">Classements des jeux</h1>

      {/* Grille des classements dynamiques */}
      <div className="rankings-grid">
        {/* Section Genres */}
        <div className="ranking-category">
          <h2>Genres</h2>
          <div className="ranking-items-grid">
            {filters.genres?.slice(0, 23).map((genre, index) => (
              <div key={index} className="ranking-item">
                <Link
                  to={`/classement/genre/${encodeURIComponent(genre)}`}
                  className="ranking-link"
                >
                  Les meilleurs jeux du genre{" "}
                  <span className="ranking-genre">{genre}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Section Thèmes */}
        <div className="ranking-category">
          <h2>Thèmes</h2>
          <div className="ranking-items-grid">
            {filters.themes?.slice(0, 22).map((theme, index) => (
              <div key={index} className="ranking-item">
                <Link
                  to={`/classement/theme/${encodeURIComponent(theme)}`}
                  className="ranking-link"
                >
                  Les meilleurs jeux ayant le thème{" "}
                  <span className="ranking-genre">{theme}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="ranking-category">
  <h2>Consoles</h2>
  <div className="ranking-items-grid">
    {selectedConsoles.map((console, index) => (
      <div key={index} className="ranking-item">
        <Link to={`/classement/platform/${encodeURIComponent(console)}`} className="ranking-link">
          Les meilleurs jeux sur <span className="ranking-genre">{console}</span>
        </Link>
      </div>
    ))}
  </div>
</div>


        {/* Section Développeurs */}
        <div className="ranking-category">
          <h2>Développeurs</h2>
          <div className="ranking-items-grid">
            {selectedDevelopers.map((developer, index) => (
              <div key={index} className="ranking-item">
                <Link
                  to={`/classement/developer/${encodeURIComponent(developer)}`}
                  className="ranking-link"
                >
                  Les meilleurs jeux du développeur{" "}
                  <span className="ranking-genre">{developer}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Section Éditeurs */}
        <div className="ranking-category">
          <h2>Éditeurs</h2>
          <div className="ranking-items-grid">
            {selectedPublishers.map((publisher, index) => (
              <div key={index} className="ranking-item">
                <Link
                  to={`/classement/publisher/${encodeURIComponent(publisher)}`}
                  className="ranking-link"
                >
                  Les meilleurs jeux de l'éditeur{" "}
                  <span className="ranking-genre">{publisher}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;
