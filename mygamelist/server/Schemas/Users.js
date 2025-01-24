import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_id: { type: Number, required: true },
    username: { type: String, required: true },
    pass: { type: String, required: true },
    email: { type: String, required: true },
    game_list: { type: [Schema.Types.ObjectId], ref: 'Game', default: [] },
    profile_picture: { type: String, default: 'https://example.com/default-profile.png' },
    created_at: { type: Date, required: true }
  });

export default mongoose.model('Users', userSchema);
