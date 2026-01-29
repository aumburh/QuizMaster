const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer'],
    default: 'multiple-choice'
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  points: {
    type: Number,
    default: 1
  },
  timeLimit: {
    type: Number,
    default: 30
  },
  explanation: String
})

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    set: v => v ? v.toLowerCase() : 'medium'
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    default: 0 // 0 - nav laika limita
  },
  passingScore: {
    type: Number,
    default: 60
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indekss ātrākiem vaicājumiem
quizSchema.index({ title: 'text', description: 'text', tags: 'text' })
quizSchema.index({ creator: 1 })
quizSchema.index({ category: 1 })
quizSchema.index({ isPublic: 1 })

module.exports = mongoose.model('Quiz', quizSchema)
