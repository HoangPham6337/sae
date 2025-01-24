import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    game_id: { type: Number, required: true },
    content: { type: String, required: true },
    parent_id: { type: Number, required: true },
    likes: { type: [Number], default: [] },
    created_at: { type: Date, required: true }
  });
  
export default mongoose.model('Comment', commentSchema);