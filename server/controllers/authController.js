const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Ģenerē JWT tokenu, ko lietos autentifikācijai
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

const authController = {
  // Reģistrē jaunu lietotāju
  // Sagaida - username, email, password, (name, role)
  // Atgriež - token un lietotāja pamatinformāciju
  register: async (req, res) => {
    try {
      const { username, email, password, name, role } = req.body

      // Validācija
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide username, email, and password'
        })
      }

      // Pārbauda, vai lietotājs jau eksistē
      const existingUser = await User.findOne({ $or: [{ email }, { username }] })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        })
      }

      // Izveido lietotāju
      const user = await User.create({
        username,
        email,
        password,
        name: name || username,
        role: role || 'Student' // Ja nav norādīta loma, noklusē kā Student
      })

      // Ģenerē JWT
      const token = generateToken(user._id)

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({
        success: false,
        message: error.message || 'Registration failed'
      })
    }
  },

  // Lietotāja pieslēgšanās
  // Sagaida - email, password
  // Atgriež - token un lietotāja informāciju
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      // Validācija
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        })
      }

      // Atrodam lietotāju pēc e-pasta (iekļauj parolei nepieciešamo lauku)
      const user = await User.findOne({ email }).select('+password')
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Pārbauda paroli
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Atjauno pēdējo pieslēgšanās laiku
      user.lastLogin = new Date()
      await user.save()

      // Ģenerē tokenu
      const token = generateToken(user._id)

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Login failed'
      })
    }
  },

  // Saņemt pašreiz pieslēgto lietotāju
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.json({
        success: true,
        user
      })
    } catch (error) {
      console.error('Get current user error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get user'
      })
    }
  },

  // Atjaunot lietotāja profilu (vārds, avatārs utml.)
  updateProfile: async (req, res) => {
    try {
      const { name, avatar } = req.body
      const updateData = {}

      if (name) updateData.name = name
      if (avatar !== undefined) updateData.avatar = avatar

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      )

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      })
    }
  }
}

module.exports = authController
