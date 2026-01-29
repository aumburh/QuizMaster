const Quiz = require('../models/Quiz')
const Result = require('../models/Result')

// Saņemt visas publiskās viktorīnas ar filtriem un lapošanu
exports.getAllQuizzes = async (req, res) => {
  try {
    const { category, difficulty, search, page = 1, limit = 10 } = req.query

    const query = { isPublic: true }

    // Pievieno filtrus, ja sniegti
    if (category) query.category = category
    if (difficulty) query.difficulty = difficulty
    if (search) {
      query.$text = { $search: search }
    }

    const skip = (page - 1) * limit

    const quizzes = await Quiz.find(query)
      .populate('creator', 'username name')
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)

    const total = await Quiz.countDocuments(query)

    res.json({
      success: true,
      quizzes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get all quizzes error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes'
    })
  }
}

// Saņemt viktorīnu pēc ID (slēpt pareizās atbildes)
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('creator', 'username name avatar')
      .select('-questions.correctAnswer')

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      })
    }

    res.json({
      success: true,
      quiz
    })
  } catch (error) {
    console.error('Get quiz by ID error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz'
    })
  }
}

// Izveidot jaunu viktorīnu
exports.createQuiz = async (req, res) => {
  try {
    const quizData = {
      ...req.body,
      creator: req.user.id
    }

    // Normalizē grūtības līmeni
    if (quizData.difficulty) {
      quizData.difficulty = quizData.difficulty.toLowerCase()
    }

    const quiz = await Quiz.create(quizData)

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    })
  } catch (error) {
    console.error('Create quiz error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create quiz'
    })
  }
}

// Atjaunot viktorīnu
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      })
    }

    // Pārbauda, vai lietotājs ir autors vai admins
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this quiz. Only the creator or admin can edit it.'
      })
    }

    // Normalizē grūtības līmeni
    if (req.body.difficulty) {
      req.body.difficulty = req.body.difficulty.toLowerCase()
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      quiz: updatedQuiz
    })
  } catch (error) {
    console.error('Update quiz error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update quiz'
    })
  }
}

// Dzēst viktorīnu
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      })
    }

    // Pārbauda, vai lietotājs ir autors vai admins
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this quiz. Only the creator or admin can delete it.'
      })
    }

    await Quiz.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    })
  } catch (error) {
    console.error('Delete quiz error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz'
    })
  }
}

// Iesniegt viktorīnas atbildes — aprēķina rezultātu un saglabā to
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      })
    }

    const { answers, timeSpent } = req.body

    // Validācija - atbilžu masīvs
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format. Answers must be an array.'
      })
    }

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        success: false,
        message: `Expected ${quiz.questions.length} answers but received ${answers.length}`
      })
    }

    let score = 0
    const results = []

    // Aprēķina punktus par katru jautājumu
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index]

      // Derive user's selected text and index (if possible)
      let userSelectedText = ''
      let selectedOptionIndex = null

      if (userAnswer == null) {
        userSelectedText = ''
      } else if (typeof userAnswer === 'number') {
        // user sent option index
        selectedOptionIndex = userAnswer
        if (Array.isArray(question.options) && question.options[selectedOptionIndex] != null) {
          userSelectedText = String(question.options[selectedOptionIndex])
        } else {
          userSelectedText = String(userAnswer)
        }
      } else {
        // user sent option text (string) or short answer
        userSelectedText = String(userAnswer)
        // if there are options, try to find matching index (case-insensitive)
        if (Array.isArray(question.options)) {
          const found = question.options.findIndex(opt => String(opt).trim().toLowerCase() === userSelectedText.trim().toLowerCase())
          if (found !== -1) selectedOptionIndex = found
        }
      }

      // Short-answer questions are left for manual grading
      if (question.type === 'short-answer') {
        results.push({
          question: question.question,
          userAnswer,
          selectedOption: selectedOptionIndex,
          correctAnswer: question.correctAnswer,
          correctOptionText: null,
          isCorrect: null, // pending
          explanation: question.explanation
        })
        return
      }

      // Determine the correct answer text for comparison (non-short-answer)
      let correctOptionText
      if (typeof question.correctAnswer === 'number' && Array.isArray(question.options) && question.options[question.correctAnswer] != null) {
        correctOptionText = String(question.options[question.correctAnswer])
      } else if (question.correctAnswer != null) {
        correctOptionText = String(question.correctAnswer)
      } else {
        correctOptionText = ''
      }

      const normalizedUser = userSelectedText.trim().toLowerCase()
      const normalizedCorrect = correctOptionText.trim().toLowerCase()

      const isCorrect = normalizedUser !== '' && normalizedUser === normalizedCorrect

      if (isCorrect) {
        score += question.points || 1
      }

      results.push({
        question: question.question,
        userAnswer,
        selectedOption: selectedOptionIndex,
        correctAnswer: question.correctAnswer,
        correctOptionText,
        isCorrect,
        explanation: question.explanation
      })
    })

    const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0
    const passed = percentage >= quiz.passingScore

    // Atjaunina viktorīnas statistiku droši
    const currentAttempts = quiz.totalAttempts || 0
    const currentAverage = quiz.averageScore || 0

    quiz.totalAttempts = currentAttempts + 1
    quiz.averageScore = ((currentAverage * currentAttempts) + percentage) / quiz.totalAttempts
    await quiz.save()

    // Sagatavo rezultāta ierakstu datubāzei
    const resultData = {
      user: req.user.id,
      quiz: quiz._id,
      score: score,
      percentage: Math.round(percentage),
      answers: results.map((r, idx) => ({
        questionIndex: idx,
        selectedOption: typeof r.selectedOption === 'number' ? r.selectedOption : null,
        userAnswer: r.userAnswer,
        isCorrect: r.isCorrect
      })),
      timeSpent: parseInt(timeSpent) || 0,
      completedAt: new Date()
    }

    console.log('Creating result with data:', resultData)
    console.log('TimeSpent being saved:', resultData.timeSpent)

    await Result.create(resultData)

    res.json({
      success: true,
      score,
      totalPoints,
      percentage: Math.round(percentage),
      passed,
      results
    })
  } catch (error) {
    console.error('Submit quiz error:', error)
    console.error('Error stack:', error.stack)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit quiz'
    })
  }
}

// Pievienot vērtēšanas galapunktu - viktorīnas veidotājs (vai administrators) var manuāli vērtēt īso atbilžu jautājumus
exports.gradeResult = async (req, res) => {
  try {
    const { quizId, resultId } = req.params
    const { questionIndex, isCorrect } = req.body

    const quiz = await Quiz.findById(quizId)
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' })

// Vērtēt var tikai testa veidotājs vai administrators
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to grade this quiz' })
    }

    const result = await Result.findById(resultId)
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' })

// Jautājumu indeksa validēšana
    const question = quiz.questions[questionIndex]
    if (!question) return res.status(400).json({ success: false, message: 'Invalid question index' })
    if (question.type !== 'short-answer') return res.status(400).json({ success: false, message: 'Only short-answer questions can be graded manually' })

// Atrast atbildes ierakstu rezultātā
    const answerEntry = result.answers.find(a => a.questionIndex === Number(questionIndex))
    if (!answerEntry) return res.status(404).json({ success: false, message: 'Answer entry not found in result' })

// Atjaunināt vērtējumu
    answerEntry.isCorrect = isCorrect === true

// Pārrēķināt kopējo punktu skaitu visos jautājumos, pamatojoties uz pašreizējo rezultātu.answers
    let newScore = 0
    quiz.questions.forEach((q, idx) => {
      const ans = result.answers.find(a => a.questionIndex === idx)
      if (ans && ans.isCorrect === true) {
        newScore += q.points || 1
      }
    })

    result.score = newScore
    const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)
    result.percentage = totalPoints > 0 ? Math.round((newScore / totalPoints) * 100) : 0

    await result.save()

// Pārrēķināt viktorīnas vidējo rezultātu no visiem rezultātiem (lai saglabātu precīzu statistiku)
    const allResults = await Result.find({ quiz: quiz._id })
    if (allResults.length > 0) {
      quiz.averageScore = allResults.reduce((acc, r) => acc + (r.percentage || 0), 0) / allResults.length
      await quiz.save()
    }

    res.json({ success: true, result })
  } catch (error) {
    console.error('Grade result error:', error)
    res.status(500).json({ success: false, message: error.message || 'Failed to grade result' })
  }
}

// Saņemt lietotāja izveidotās viktorīnas
exports.getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.id })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      quizzes
    })
  } catch (error) {
    console.error('Get user quizzes error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user quizzes'
    })
  }
}

// Saņemt izceltās viktorīnas
exports.getFeaturedQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublic: true, isFeatured: true })
      .populate('creator', 'username name')
      .select('-questions.correctAnswer')
      .limit(6)
      .sort({ averageRating: -1 })

    res.json({
      success: true,
      quizzes
    })
  } catch (error) {
    console.error('Get featured quizzes error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured quizzes'
    })
  }
}

// Saņemt kategorijas
exports.getCategories = async (req, res) => {
  try {
    const categories = await Quiz.distinct('category', { isPublic: true })

    res.json({
      success: true,
      categories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    })
  }
}

// Iegūt visus viktorīnas rezultātus (tikai veidotājam vai administratoram)
exports.getQuizResults = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' })

// Tikai veidotājs vai administrators
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const results = await Result.find({ quiz: quiz._id }).populate('user', 'username name').sort({ completedAt: -1 })

    res.json({ success: true, results })
  } catch (error) {
    console.error('Get quiz results error:', error)
    res.status(500).json({ success: false, message: error.message || 'Failed to get quiz results' })
  }
}

// Iegūt vienu rezultātu pēc ID (nodrošināt testa veidotāju/administratoru vai rezultāta īpašnieku)
exports.getResult = async (req, res) => {
  try {
    const { quizId, resultId } = req.params
    const quiz = await Quiz.findById(quizId)
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' })

    const result = await Result.findById(resultId).populate('user', 'username name')
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' })

// Atļaut piekļuvi, ja pieprasītājs ir viktorīnas veidotājs/administrators vai rezultāta īpašnieks
    if (quiz.creator.toString() !== req.user.id && req.user.role !== 'admin' && result.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this result' })
    }

    res.json({ success: true, result })
  } catch (error) {
    console.error('Get result error:', error)
    res.status(500).json({ success: false, message: error.message || 'Failed to get result' })
  }
}
