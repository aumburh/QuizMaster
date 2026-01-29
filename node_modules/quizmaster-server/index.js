const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const adminRoutes = require('./routes/adminRoutes')
const authRoutes = require('./routes/authRoutes')
const quizRoutes = require('./routes/quizRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Pieslēgties MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://owner:owner@cluster0.37v21.mongodb.net/quizmaster', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected successfully')
    console.log('Database:', mongoose.connection.name)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

connectDB()

// Maršruti
app.use('/api/auth', authRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)


// Veselības pārbaudes galapunkts
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() })
})

// Kļūdu apstrādes middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// 404 apstrāde
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
