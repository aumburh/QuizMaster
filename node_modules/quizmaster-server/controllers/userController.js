const User = require('../models/User')
const Quiz = require('../models/Quiz')
const Result = require('../models/Result')

// Saņemt lietotāja profilu un detalizētus statistikas datus
// Atgriež profilu, kopējo statistiku, laika salīdzinājumus un rangu
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id

    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Aprēķini - pašreizējais datums, pagājušā nedēļa un divas nedēļas atpakaļ
    const now = new Date()
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    const twoWeeksAgo = new Date()
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

    // Lietotāja izveidoto viktorīnu skaits
    const createdQuizzes = await Quiz.countDocuments({ creator: userId })

    // Visas lietotāja rezultātu ieraksti
    const allResults = await Result.find({ user: userId })

    // Pagājušās nedēļas rezultāti (salīdzināšanai)
    const lastWeekResults = await Result.find({
      user: userId,
      completedAt: { $gte: lastWeek }
    })

    // Iepriekšējās nedēļas rezultāti (pirms pagājušās nedēļas)
    const previousWeekResults = await Result.find({
      user: userId,
      completedAt: { $gte: twoWeeksAgo, $lt: lastWeek }
    })

    const quizzesTaken = allResults.length
    const lastWeekQuizzesTaken = lastWeekResults.length
    const previousWeekQuizzesTaken = previousWeekResults.length
    const quizzesPassed = allResults.filter(r => r.percentage >= 60).length
    const averageScore = allResults.length > 0
      ? allResults.reduce((sum, r) => sum + r.percentage, 0) / allResults.length
      : 0

    // Kopējais pavadītais laiks sekundēs
    const totalTimeSpent = allResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0)
    const lastWeekTimeSpent = lastWeekResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0)
    const previousWeekTimeSpent = previousWeekResults.reduce((sum, r) => sum + (r.timeSpent || 0), 0)

    // Kopējie punkti
    const totalPoints = allResults.reduce((sum, r) => sum + (r.score || 0), 0)
    const lastWeekPoints = lastWeekResults.reduce((sum, r) => sum + (r.score || 0), 0)

    // Aprēķina lietotāju rangus pēc kopējiem punktiem
    const allUsersScores = await Result.aggregate([
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' }
        }
      },
      { $sort: { totalScore: -1 } }
    ])

    const userRank = allUsersScores.findIndex(u => u._id.toString() === userId.toString()) + 1

    // Pagājušās nedēļas rangs
    const lastWeekUsersScores = await Result.aggregate([
      {
        $match: {
          completedAt: { $lt: lastWeek }
        }
      },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' }
        }
      },
      { $sort: { totalScore: -1 } }
    ])

    const lastWeekRank = lastWeekUsersScores.findIndex(u => u._id.toString() === userId.toString()) + 1

    // Rangas izmaiņas aprēķins (pozitīvs = uzlabojums)
    let rankChange = 0
    if (lastWeekRank === 0 && userRank > 0) {
      // Ja nav bijis rangs iepriekš, bet tagad ir
      rankChange = userRank
    } else if (lastWeekRank > 0 && userRank > 0) {
      // Aprēķina starpību
      rankChange = lastWeekRank - userRank
    }

    // Vidējais rezultāts pagājušajā un iepriekšējā nedēļā
    const lastWeekAverage = lastWeekResults.length > 0
      ? lastWeekResults.reduce((sum, r) => sum + r.percentage, 0) / lastWeekResults.length
      : 0

    const previousWeekAverage = previousWeekResults.length > 0
      ? previousWeekResults.reduce((sum, r) => sum + r.percentage, 0) / previousWeekResults.length
      : 0

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      },
      stats: {
        createdQuizzes,
        quizzesTaken,
        quizzesPassed,
        averageScore: Math.round(averageScore),
        totalTimeSpent: totalTimeSpent, // Sekundes
        totalTimeSpentUnit: totalTimeSpent >= 3600 ? 'hours' : totalTimeSpent >= 60 ? 'minutes' : 'seconds',
        totalPoints: Math.round(totalPoints),
        rank: userRank || 0
      },
      weeklyComparison: {
        quizzesTaken: lastWeekQuizzesTaken - previousWeekQuizzesTaken,
        averageScore: Math.round(lastWeekAverage - previousWeekAverage),
        timeSpent: lastWeekTimeSpent - previousWeekTimeSpent, // Sekundes
        timeSpentUnit: Math.abs(lastWeekTimeSpent - previousWeekTimeSpent) >= 60 ? 'minutes' : 'seconds',
        rankChange: rankChange,
        pointsEarned: lastWeekPoints
      }
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    })
  }
}

// Saņemt lietotāja rezultātus
exports.getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate('quiz', 'title category difficulty')
      .sort({ completedAt: -1 })
      .limit(20)

    res.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Get user results error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results'
    })
  }
}

// Saņemt līderu sarakstu (pēc perioda)
exports.getLeaderboard = async (req, res) => {
  try {
    const { period = 'all', limit = 10 } = req.query

    let dateFilter = {}
    if (period === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      dateFilter = { completedAt: { $gte: weekAgo } }
    } else if (period === 'month') {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      dateFilter = { completedAt: { $gte: monthAgo } }
    }

    // Apkopo lietotāju punktus un papildus informāciju
    const leaderboard = await Result.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          quizzesTaken: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          userId: '$_id',
          username: '$userInfo.username',
          name: '$userInfo.name',
          totalScore: 1,
          quizzesTaken: 1,
          averageScore: { $round: ['$averageScore', 0] }
        }
      }
    ])

    res.json({
      success: true,
      leaderboard
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    })
  }
}
