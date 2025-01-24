import React, { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

const SearchBar = ({ images, onGameSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [developerQuery, setDeveloperQuery] = useState("");
  const [publisherQuery, setPublisherQuery] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    platforms: [],
    game_modes: [],
    player_perspectives: [],
    game_engines: [],
    themes: [],
  });
  const [activeFilters, setActiveFilters] = useState({
    genres: [],
    platforms: [],
    game_modes: [],
    player_perspectives: [],
    game_engines: [],
    themes: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedFilters, setExpandedFilters] = useState({
    genres: false,
    platforms: false,
    game_modes: false,
    player_perspectives: false,
    game_engines: false,
    themes: false,
  });
  const filterRef = useRef(null);
  const imagesPerPage = 9;

  // Détecte si l'écran est mobile
  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    window.addEventListener("resize", checkIsMobile);
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Fetch des options de filtres depuis l'API
  const fetchFilters = async () => {
    try {
      const response = await fetch("http://localhost:5001/filters");
      const data = await response.json();
      setFilterOptions({
        genres: data.genres || [],
        platforms: data.platforms || [],
        game_modes: data.game_modes || [],
        player_perspectives: data.player_perspectives || [],
        game_engines: data.engines || [],
        themes: data.themes || [],
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des filtres :", error);
    }
  };

  // Fetch des jeux
  const fetchGames = async (title = "", developers = "", publishers = "", page_number = 1, filters = {}) => {
    try {
      const params = new URLSearchParams({
        title,
        developers,
        publishers,
        page_number,
        ...filters,
      }).toString();

      const response = await fetch(`http://localhost:5001/search_game?${params}`);
      const data = await response.json();
      console.log("Données récupérées :", data); // Debug
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des jeux :", error);
      return [];
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    const loadGames = async () => {
      // Prépare les filtres actifs au format attendu
      const filters = {
        genres: activeFilters.genres.join(","),
        platforms: activeFilters.platforms.join(","),
        game_modes: activeFilters.game_modes.join(","),
        player_perspectives: activeFilters.player_perspectives.join(","),
        game_engines: activeFilters.game_engines.join(","),
        themes: activeFilters.themes.join(","),
      };
      const games = await fetchGames(searchQuery, developerQuery, publisherQuery, currentPage, filters);
      setFilteredImages(games || []);
    };

    loadGames();
  }, [searchQuery, developerQuery, publisherQuery, currentPage, activeFilters]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeveloperSearch = (e) => {
    setDeveloperQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePublisherSearch = (e) => {
    setPublisherQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => {
      if (typeof prev[key] === "boolean") {
        return { ...prev, [key]: value };
      } else {
        const updatedFilter = prev[key].includes(value)
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value];
        return { ...prev, [key]: updatedFilter };
      }
    });
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleClearFilters = () => {
    setActiveFilters({
      genres: [],
      platforms: [],
      game_modes: [],
      player_perspectives: [],
      game_engines: [],
      themes: [],
    });
    setSearchQuery("");
    setDeveloperQuery("");
    setPublisherQuery("");
    setCurrentPage(1);
  };

  const toggleExpandFilter = (key) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const renderFilterSection = (key, options) => (
    <div className="filter-section" key={key}>
      <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
      <div className="filter-options">
        {options.slice(0, expandedFilters[key] ? options.length : 4).map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={activeFilters[key].includes(option)}
              onChange={() => handleFilterChange(key, option)}
            />
            {option}
          </label>
        ))}
      </div>
      {options.length > 4 && (
        <button className="see-more" onClick={() => toggleExpandFilter(key)}>
          {expandedFilters[key] ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </div>
  );

  return (
    <div className="search-page">
      {isMobile && (
        <button className="filter-toggle" onClick={() => setShowFilters(true)}>
          <img src="/images/filter.svg" alt="Filter" />
        </button>
      )}

      <div
        className={`filter-block ${
          isMobile ? (showFilters ? "show" : "hidden") : "visible"
        }`}
        ref={filterRef}
      >
        {isMobile && (
          <button className="close-filter" onClick={() => setShowFilters(false)}>
            &times;
          </button>
        )}
        <h3>Filtres</h3>
        {Object.keys(filterOptions).map((key) =>
          renderFilterSection(key, filterOptions[key])
        )}
        <button className="apply-filters-button" onClick={handleClearFilters}>
          Réinitialiser les filtres
        </button>
      </div>
      <div className="results-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher des jeux..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <input
            type="text"
            placeholder="Rechercher par développeur..."
            value={developerQuery}
            onChange={handleDeveloperSearch}
          />
          <input
            type="text"
            placeholder="Rechercher par éditeur..."
            value={publisherQuery}
            onChange={handlePublisherSearch}
          />
        </div>
        <div className="search-results">
          {filteredImages.map((image) => (
            <div
              key={image.title}
              className="search-result-item"
              onClick={() => onGameSelect(image)}
            >
              <img src={image.cover.original} alt={image.title} />
            </div>
          ))}
        </div>
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span>Page {currentPage}</span>
          <button
            className="pagination-button"
            onClick={() => handlePageChange("next")}
            disabled={!filteredImages.length || filteredImages.length < imagesPerPage}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
