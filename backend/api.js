const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Game = require("./models/Game");
const Filters = require("./models/filters");

// Configuration
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Objet regroupant les fonctions API
const apiFunctions = {
  transformToFrench: (game) => {
    const transformedGame = { ...game._doc };

    // Formater la date de sortie
    if (transformedGame.release_date) {
      transformedGame.release_date = new Date(transformedGame.release_date).toISOString().split("T")[0];
    }

    transformedGame.description = game.description?.fr || game.description?.en;
    transformedGame.genres = game.genres?.fr || game.genres?.en;
    transformedGame.game_modes = game.game_modes?.fr || game.game_modes?.en;
    transformedGame.player_perspectives = game.player_perspectives?.fr || game.player_perspectives?.en;
    transformedGame.themes = game.themes?.fr || game.themes?.en;
    return transformedGame;
  },
  getFilters: async () => {
    try {
      const filters = await Filters.findOne({});
      if (!filters) {
        throw new Error("Filtres non trouvés");
      }
      return filters;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des filtres : ${error.message}`);
    }
  },
  

  searchGames: (query, page_number = 1) => {
    return new Promise(async (resolve, reject) => {
      try {
        const maxGamesPerPage = 9;
        const skip = (page_number - 1) * maxGamesPerPage;
  
        const dbQuery = {};
        const queryWithLanguage = ["genres", "game_modes", "player_perspectives", "themes"];
        const simpleFilters = ["developers", "publishers", "game_engines", "platforms"];
  
        Object.keys(query).forEach((key) => {
          const value = query[key]?.trim(); // Supprime les espaces inutiles et vérifie si vide
          if (value && key !== "page_number") {
            // Gérer les filtres avec une structure multilingue
            if (queryWithLanguage.includes(key)) {
              dbQuery[`${key}.fr`] = {
                $all: value.split(",").map((v) => new RegExp(v.trim(), "i")),
              };
            }
            // Gérer les filtres simples (inclut maintenant "platforms")
            else if (simpleFilters.includes(key)) {
              dbQuery[key] = {
                $all: value.split(",").map((v) => new RegExp(v.trim(), "i")),
              };
            }
            // Gérer les titres avec regex
            else if (key === "title") {
              dbQuery[key] = { $regex: new RegExp(value, "i") };
            }
          }
        });
  
        const totalResults = await Game.countDocuments(dbQuery);
  
        if (skip >= totalResults) {
          return resolve([]);
        }
  
        const games = await Game.find(dbQuery).skip(skip).limit(maxGamesPerPage);
  
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },
   
  


  getGameById: (game_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const game = await Game.findOne({ game_id: Number(game_id) });
        if (!game) {
          return reject(new Error("Jeu non trouvé"));
        }
        resolve(apiFunctions.transformToFrench(game));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedByField: (field, value, lang) => {
    return new Promise(async (resolve, reject) => {
      const fieldWithLanguage = ["genres", "game_modes", "themes_modes"];

      const filter = fieldWithLanguage.includes(field) && lang ? { [`${field}.${lang}`] : value} : { [field]: value };
      
      try {
        const games = await Game.find(filter).sort({ added: -1 }).limit(10);
        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour le champ : ${field}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedGamesByGenre: (genre) => {
    return new Promise(async (resolve, reject) => {
      try {
        const games = await Game.find({ "genres.fr": { $regex: genre, $options: "i" } })
          .sort({ total_rating: -1 })
          .limit(10);
        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour le genre : ${genre}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedByPublisher: (publisher) => {
    return new Promise(async (resolve, reject) => {
      try {
        const games = await Game.find({ publishers: { $regex: publisher, $options: "i" } })
          .sort({ total_rating: -1 })
          .limit(10);
        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour l'éditeur : ${publisher}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedByPlatform: (platform) => {
    return new Promise(async (resolve, reject) => {
      try {
        const games = await Game.find({ platforms: { $regex: platform, $options: "i" } })
          .sort({ total_rating: -1 })
          .limit(10);
        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour la plateforme : ${platform}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedByGameMode: (game_mode) => {
    return new Promise(async (resolve, reject) => {
      try {
        const games = await Game.find({ "game_modes.fr": { $regex: game_mode, $options: "i" } })
          .sort({ total_rating: -1 })
          .limit(10);
        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour le mode de jeu : ${game_mode}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedByGameEngine: (game_engine) => {
    return new Promise(async (resolve, reject) => {
      try {
        const games = await Game.find({ game_engines: { $regex: game_engine, $options: "i" } })
          .sort({ total_rating: -1 })
          .limit(10);
        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour le moteur de jeu : ${game_engine}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedByDeveloper: (developer) => {
    return new Promise(async (resolve, reject) => {
      try {
        const games = await Game.find({ developers: { $regex: developer, $options: "i" } })
          .sort({ total_rating: -1 })
          .limit(10);

        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour le studio développeur : ${developer}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getTopRatedByTheme: (theme) => {
    return new Promise(async (resolve, reject) => {
      try {
        const games = await Game.find({ "themes.fr": { $regex: theme, $options: "i" } })
          .sort({ total_rating: -1 })
          .limit(10);
        if (!games.length) {
          return reject(new Error(`Aucun jeu trouvé pour le thème : ${theme}`));
        }
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },

  getMostRecentGames: (page_number = 1) => {
    return new Promise(async (resolve, reject) => {
      try {
        const maxGamesPerPage = 10;
        const skip = (page_number - 1) * maxGamesPerPage;

        const games = await Game.find()
          .sort({ release_date: -1 })
          .skip(skip)
          .limit(maxGamesPerPage);
        resolve(games.map(apiFunctions.transformToFrench));
      } catch (error) {
        reject(error);
      }
    });
  },
};

// Routes API

app.get("/top_rated_by_field", async (req, res) => {
  const { field, value, lang = "fr" } = req.query;
  if (!publisher) {
    return res.status(400).json({ error: "Un paramètre est requis." });
  }
  try {
    const games = await apiFunctions.getTopRatedByField(field, value, lang);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux : ${error.message}` });
  }
});

app.get("/filters", async (req, res) => {
  try {
    const filters = await apiFunctions.getFilters();
    res.status(200).json(filters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/top_rated_by_platform", async (req, res) => {
  const { platform } = req.query;
  if (!platform) {
    return res.status(400).json({ error: "Le paramètre platform est requis." });
  }
  try {
    const games = await apiFunctions.getTopRatedByPlatform(platform);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux pour la plateforme : ${error.message}` });
  }
});

app.get("/top_rated_by_game_mode", async (req, res) => {
  const { game_mode } = req.query;
  if (!game_mode) {
    return res.status(400).json({ error: "Le paramètre game_mode est requis." });
  }
  try {
    const games = await apiFunctions.getTopRatedByGameMode(game_mode);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux pour le mode de jeu : ${error.message}` });
  }
});
app.get("/top_rated_by_publisher", async (req, res) => {
  const { publisher } = req.query;
  if (!publisher) {
    return res.status(400).json({ error: "Le paramètre publisher est requis." });
  }
  try {
    const games = await apiFunctions.getTopRatedByPublisher(publisher);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux pour l'éditeur : ${error.message}` });
  }
});

app.get("/top_rated_by_game_engine", async (req, res) => {
  const { game_engine } = req.query;
  if (!game_engine) {
    return res.status(400).json({ error: "Le paramètre game_engine est requis." });
  }
  try {
    const games = await apiFunctions.getTopRatedByGameEngine(game_engine);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux pour le moteur de jeu : ${error.message}` });
  }
});

app.get("/top_rated_by_developer", async (req, res) => {
  const { developer } = req.query;
  if (!developer) {
    return res.status(400).json({ error: "Le paramètre developer est requis." });
  }
  try {
    const games = await apiFunctions.getTopRatedByDeveloper(developer);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux pour le studio développeur : ${error.message}` });
  }
});

app.get("/top_rated_by_theme", async (req, res) => {
  const { theme } = req.query;
  if (!theme) {
    return res.status(400).json({ error: "Le paramètre theme est requis." });
  }
  try {
    const games = await apiFunctions.getTopRatedByTheme(theme);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux pour le thème : ${error.message}` });
  }
});

app.get("/search_game", async (req, res) => {
  try {
    const games = await apiFunctions.searchGames(req.query, req.query.page_number);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la recherche des jeux : ${error.message}` });
  }
});

app.get("/game/:game_id", async (req, res) => {
  try {
    const game = await apiFunctions.getGameById(req.params.game_id);
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération du jeu : ${error.message}` });
  }
});

app.get("/top_rated_by_genre", async (req, res) => {
  try {
    const games = await apiFunctions.getTopRatedGamesByGenre(req.query.genre);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux par genre : ${error.message}` });
  }
});

app.get("/most_recent_games", async (req, res) => {
  try {
    const games = await apiFunctions.getMostRecentGames(req.query.page_number);
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des jeux récents : ${error.message}` });
  }
});

// Démarrage du serveur uniquement après la connexion à MongoDB
const startServer = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/gameLibrary", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connecté à MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur API en cours d'exécution sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion à MongoDB :", error.message);
  }
};

// Démarrer le serveur
startServer();