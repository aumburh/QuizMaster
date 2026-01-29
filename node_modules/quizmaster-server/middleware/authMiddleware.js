const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware aizsargā maršrutus — pārbauda JWT tokenu Authorization header
// Ja tokena nav vai tas ir nederīgs, atgriež 401. Ja tokena derīgs, pievieno req.user ar lietotāja objektu.
exports.protect = async (req, res, next) => {
  try {
    let token

    // Saņem tokenu no Authorization header (Bearer token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }

    // Verificē tokenu un nolasa payload (satur lietotāja ID)
    const decoded = jwt.verify(token, JWT_SECRET)

    // Iegūst lietotāju pēc tokenā norādītā ID
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }

    // Pievieno lietotāja objektu pie pieprasījuma, lai nākamie handleri var izmantot req.user
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    })
  }
}

// Middleware ierobežo piekļuvi pēc lomām (piem., admin, teacher)
// restrictTo('Admin', 'Teacher') — atgriež 403, ja lietotāja loma nav pieļaujama
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      })
    }
    next()
  }
}
