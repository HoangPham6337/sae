import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  game_id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  platforms: { type: [String], required: true },
  platform_logos: [
    {
      thumb: { type: String, required: true },
      original: { type: String, required: true }
    }
  ],
  genres: { type: [String], required: true },
  cover: {
    thumb: { type: String, required: true },
    original: { type: String, required: true }
  },
  developers: { type: [String], required: true },
  publishers: { type: [String], required: true },
  artworks: [
    {
      thumb: { type: String, required: true },
      original: { type: String, required: true }
    }
  ],
  game_modes: { type: [String], required: true },
  player_perspectives: { type: [String], required: true },
  themes: { type: [String], required: true },
  franchises: { type: [String], default: [] },
  dlcs: { type: [String], default: [] },
  game_engines: { type: [String], required: true },
  videos: { type: [String], default: [] },
  release_date: { type: Date, required: true },
  total_rating: { type: Number, required: true },
  total_rating_count: { type: Number, required: true },
  added: { type: Number, required: true }
});

export default mongoose.model('Games', gameSchema);
