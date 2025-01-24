const mongoose = require("mongoose");

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

module.exports = Filters;
