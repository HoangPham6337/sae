const mongoose = require("mongoose");
const fs = require("fs");

// Chemin vers ton fichier JSON
const jsonFilePath = "./GamesDATA.json";

// Connexion à MongoDB
const dbName = "gameLibrary";
const mongoURI = `mongodb://localhost:27017/${dbName}`;

// Schéma pour les filtres
const filtersSchema = new mongoose.Schema({
  genres: [String],
  themes: [String],
  platforms: [String],
  publishers: [String],
  developers: [String],
  game_modes: [String],
  player_perspectives: [String],
  engines: [String],
});

const Filters = mongoose.model("Filters", filtersSchema);

// Schéma pour les jeux
const gameSchema = new mongoose.Schema({
  game_id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  description: {
    en: String,
    fr: String,
  },
  platforms: [String],
  platform_logos: [
    {
      thumb: String,
      original: String,
    },
  ],
  genres: {
    en: [String],
    fr: [String],
  },
  cover: {
    thumb: String,
    original: String,
  },
  developers: [String],
  publishers: [String],
  artworks: [
    {
      thumb: String,
      original: String,
    },
  ],
  game_modes: {
    en: [String],
    fr: [String],
  },
  player_perspectives: {
    en: [String],
    fr: [String],
  },
  themes: {
    en: [String],
    fr: [String],
  },
  franchises: [String],
  dlcs: [String],
  game_engines: [String],
  videos: [String],
  release_date: {
    type: Date,
    validate: {
      validator: function (value) {
        return value instanceof Date || value === null;
      },
      message: "release_date doit être une date valide ou null.",
    },
    default: null,
  },
  added: { type: Number, default: 0 },
});

const Game = mongoose.model("Game", gameSchema);

// Fonction pour importer les données JSON et générer les filtres
async function importData() {
  try {
    console.log("📥 Lecture et nettoyage des données JSON...");
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));

    const cleanedData = jsonData.map((game) => {
      delete game.total_rating;
      delete game.total_rating_count;

      return {
        ...game,
        release_date: isValidDate(game.release_date) ? new Date(game.release_date) : null,
      };
    });

    const dataWithIds = cleanedData.map((game, index) => ({
      ...game,
      game_id: index + 1,
    }));

    console.log("🗄️ Insertion des jeux dans la base de données...");
    await Game.insertMany(dataWithIds);
    console.log("✅ Données des jeux importées avec succès !");

    console.log("📊 Génération des filtres...");
    await generateFilters();
  } catch (error) {
    console.error("❌ Erreur lors de l'import des données :", error);
  }
}

// Générer les filtres et les sauvegarder dans la base
const generateFilters = async () => {
  try {
    const filters = {
      genres: await Game.distinct("genres.fr"),
      themes: await Game.distinct("themes.fr"),
      platforms: await Game.distinct("platforms"),
      publishers: await Game.distinct("publishers"),
      developers: await Game.distinct("developers"),
      game_modes: await Game.distinct("game_modes.fr"),
      player_perspectives: await Game.distinct("player_perspectives.fr"),
      engines: await Game.distinct("game_engines"),
    };

    await Filters.deleteMany({}); // Supprime les anciens filtres
    await Filters.create(filters); // Crée un nouveau document
    console.log("✅ Filtres générés et sauvegardés avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors de la génération des filtres :", error.message);
  }
};

// Vérifier si une date est valide
function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

// Connexion à MongoDB et exécution
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Connecté à MongoDB");
    console.log(`🗑️ Suppression de la base de données "${dbName}"...`);
    await mongoose.connection.db.dropDatabase(); // Suppression de la base
    console.log("📦 Recréation de la base de données...");
    await importData(); // Importer les données JSON et générer les filtres
    process.exit(0); // Terminer après le traitement
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion MongoDB :", error);
    process.exit(1);
  });

// Exporter les modèles pour des utilisations ultérieures
module.exports = { Game, Filters };
