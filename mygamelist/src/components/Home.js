import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import SearchBar from "./SearchBar.js";
import Carousel from "./Carousel.js";
import GameDetails from "./GameDetails.js";

// Fonction pour récupérer les jeux par genre depuis l'API
const fetchTopRatedGamesByGenre = async (genre) => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
  try {
    const response = await fetch(`${BASE_URL}/top_rated_by_genre?genre=${genre}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux par genre :", error);
    return [];
  }
};

function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gamesByGenre, setGamesByGenre] = useState({
    Plateforme: [],
    Aventure: [],
    Indépendant: [],
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showAllRankings, setShowAllRankings] = useState(false);
  const logoRef = useRef(null);
  const navigate = useNavigate();
  const timeoutId = useRef(null);

  // Fonction pour afficher ou cacher le pop-up
  const handleMouseToggle = (visible) => {
    if (visible) {
      setShowPopup(true);
      clearTimeout(timeoutId.current);
    } else {
      timeoutId.current = setTimeout(() => setShowPopup(false), 1000);
    }
  };

  const handleGenreClick = (genre) => {
    navigate(`/classement/genre/${genre}`);
  };

  useEffect(() => {
    const loadGamesByGenre = async () => {
      try {
        const plateformeGames = await fetchTopRatedGamesByGenre("Plateforme");
        const aventureGames = await fetchTopRatedGamesByGenre("Aventure");
        const independantGames = await fetchTopRatedGamesByGenre("Indépendant");

        setGamesByGenre({
          Plateforme: plateformeGames || [],
          Aventure: aventureGames || [],
          Indépendant: independantGames || [],
        });
      } catch (error) {
        console.error("Erreur lors du chargement des jeux :", error);
      }
    };

    loadGamesByGenre();
  }, []);

  const handleSearchClick = () => {
    setIsSearching(true);
    setSelectedGame(null);
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (selectedGame) {
      setSelectedGame(null);
    } else {
      setIsSearching(false);
    }
  };

  const toggleShowAll = () => {
    setShowAllRankings((prev) => !prev);
  };

  const genresList = [
    "Plateforme",
    "Aventure",
    "Tir",
    "Casse-tête",
    "Indépendant",
    "Jeu de rôle (RPG)",
    "Hack and slash / Beat 'em up",
    "Stratégie",
    "Stratégie au tour par tour (TBS)",
    "Simulateur",
  ];

  const genresToShow = showAllRankings ? genresList : genresList.slice(0, 3);

  if (selectedGame) {
    return <GameDetails game={selectedGame} onBack={handleBack} />;
  }

  if (isSearching) {
    return (
      <div className="search-only">
        <div className="search-header">
          <button className="back-button" onClick={handleBack}>
            Retour
          </button>
          <SearchBar
            images={Object.values(gamesByGenre).flat()}
            onGameSelect={handleGameSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="header">
        <span className="logo-text">GameVerse</span>
        <nav className="nav-icons">
          <button onClick={handleSearchClick} className="nav-item search-logo-button">
            <span className="nav-text">Recherche</span>
            <img src="/images/search.svg" alt="Recherche" className="icon responsive-only" />
          </button>
          <div
            className="logo"
            ref={logoRef}
            onMouseEnter={() => handleMouseToggle(true)}
            onMouseLeave={() => handleMouseToggle(false)}
          >
            <Link to="/classement" className="nav-item">
              <span className="nav-text">Classement</span>
              <img src="/images/crown.svg" alt="Classement" className="icon responsive-only" />
            </Link>
            {showPopup && (
              <div className={`popup ${showPopup ? "visible" : ""}`}>
                <ul className="ranking-list">
                  {genresToShow.map((genre, index) => (
                    <li key={genre} onClick={() => handleGenreClick(genre)}>
                      Les meilleurs jeux du genre {genre}
                    </li>
                  ))}
                </ul>
                <button className="voir-plus-btn" onClick={toggleShowAll}>
                  {showAllRankings ? "Voir moins" : "Voir plus"}
                </button>
              </div>
            )}
          </div>
          <Link to="/favorites" className="nav-item">
            <span className="nav-text">Favoris</span>
            <img src="/images/favorite.svg" alt="Favoris" className="icon responsive-only" />
          </Link>
          <Link to="/login" className="nav-item">
            <span className="nav-text">Compte</span>
            <img src="/images/profile.svg" alt="Compte" className="icon responsive-only" />
          </Link>
        </nav>
      </header>

      <div className="cover-section">
        <img src="/images/affiche3.jpg" alt="Découvrez les jeux" className="cover-image" />
        <div className="cover-text">
          <h1 className="main-title">
            Découvrez les Meilleurs Jeux Vidéo
            <br />
            <span className="secondary-title">
              Trouvez. Explorez et Favorisez vos Nouveautés !
            </span>
          </h1>
          <p className="sub-title">
            Explorez des milliers de jeux vidéos dans toutes les catégories. Trouvez ce qui vous correspond
            le mieux grâce à notre moteur de recherche intuitif. Découvrez les jeux les mieux notés dans
            chaque catégorie et consultez les classements les plus populaires pour ne jamais manquer les
            incontournables.
          </p>
        </div>
      </div>

      <section className="trending">
        <h2>Les jeux les plus appréciés</h2>
        <div className="carousel-container">
          {["Plateforme", "Aventure", "Indépendant"].map((genre) => {
            const topGames = gamesByGenre[genre] || [];
            return (
              <div key={genre} className="genre-section">
                <h3 className="genre-title">{genre}</h3>
                {topGames.length > 0 ? (
                  <Carousel images={topGames} onGameSelect={handleGameSelect} />
                ) : (
                  <p className="no-games">Aucun jeu trouvé pour ce genre.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="Logo" className="footer-logo-img" />
          </div>
          <div className="footer-links">
            <ul>
              <li><Link to="./about">À propos</Link></li>
              <li><Link to="./terms">Conditions d'utilisation</Link></li>
              <li><Link to="./privacy">Politique de confidentialité</Link></li>
            </ul>
          </div>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" className="social-icon">Facebook</a>
            <a href="https://twitter.com" target="_blank" className="social-icon">Twitter</a>
            <a href="https://instagram.com" target="_blank" className="social-icon">Instagram</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 GameVerse. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
