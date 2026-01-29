const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenId: { type: String, required: true },
  sessionType: { type: String, enum: ['standard', 'extended'], default: 'standard' },
  issuedAt: { type: Number, required: true },
  expiresAt: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  userAgent: { type: String },
  ip: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Session', sessionSchema)

