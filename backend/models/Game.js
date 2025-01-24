const mongoose = require("mongoose");

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
    default: null,
  },
  added: { type: Number, default: 0 },
});

// Modèle pour les jeux
const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
