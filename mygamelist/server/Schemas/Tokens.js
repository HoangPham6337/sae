import mongoose from "mongoose";

const Schema = mongoose.Schema;
 
const tokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    type: { type: String, enum: ['access', 'refresh'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiredAt: { type: Date },
    isRevoked: { type: Boolean, default: false },
    revokedAt: { type: Date, default: null },
    ipAddress: { type: String },
    deviceInfo: { type: String },
  });

export default mongoose.model('Tokens', tokenSchema);