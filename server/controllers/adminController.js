const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// Saņem platformas statistiku
exports.getStats = async (req, res) => {
  try {
    // Saņem lietotāju statistiku
    const totalUsers = await User.countDocuments();
    const studentsCount = await User.countDocuments({ role: 'Student' });
    const teachersCount = await User.countDocuments({ role: 'Teacher' });
    const adminsCount = await User.countDocuments({ role: 'Admin' });
    const activeUsers = await User.countDocuments({ isActive: true });

    // Saņem viktorīnu statistiku
    const totalQuizzes = await Quiz.countDocuments();
    const publicQuizzes = await Quiz.countDocuments({ isPublic: true });
    const featuredQuizzes = await Quiz.countDocuments({ isFeatured: true });

    // Pēdējās darbības — noder admin panelī, lai redzētu nesen pievienotos lietotājus un viktorīnas
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    const recentQuizzes = await Quiz.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('creator', 'username')
      .select('title category difficulty createdAt');

    // Aprēķina kopējo mēģinājumu skaitu no viktorīnām
    const totalAttempts = await Quiz.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAttempts' } } }
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          students: studentsCount,
          teachers: teachersCount,
          admins: adminsCount,
          active: activeUsers
        },
        quizzes: {
          total: totalQuizzes,
          public: publicQuizzes,
          featured: featuredQuizzes
        },
        activity: {
          totalAttempts: totalAttempts[0]?.total || 0
        },
        recent: {
          users: recentUsers,
          quizzes: recentQuizzes
        }
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

// Saņemt visus lietotājus ar lapošanas un filtrēšanas atbalstu
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;

    const query = {};

    // Pievieno lomas filtru tikai, ja tā sniegta
    if (role && role.trim() !== '') {
      query.role = role;
    }

    // Pievieno isActive filtru tikai, ja tas sniegts
    if (isActive && isActive.trim() !== '') {
      query.isActive = isActive === 'true';
    }

    // Meklēšanas filtrs (username, email, name)
    if (search && search.trim() !== '') {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password') // Neiekļauj paroli atbildē
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Atjaunot lietotāja datus (loma, aktīvs statuss, vārds utt.)
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, isActive, name } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Aizsargā administratoru no sava konta deaktivizēšanas
    if (userId === req.user.id && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    // Atjauno atļautās laukas
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (name) user.name = name;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
};

// Dzēst lietotāju un ar to saistītos datus
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Aizsargā administratoru no sava konta dzēšanas
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Dzēš lietotāja izveidotās viktorīnas
    await Quiz.deleteMany({ creator: userId });

    // Dzēš lietotāju
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Saņemt visas viktorīnas ar lapošanu un filtriem
exports.getAllQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, difficulty, search } = req.query;

    const query = {};

    // Pievieno kategorijas filtru, ja sniegts
    if (category && category.trim() !== '') {
      query.category = category;
    }

    // Pievieno grūtības filtru, ja sniegts
    if (difficulty && difficulty.trim() !== '') {
      query.difficulty = difficulty;
    }

    // Pievieno meklēšanas filtru, ja sniegts
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const quizzes = await Quiz.find(query)
      .populate('creator', 'username email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Quiz.countDocuments(query);

    res.json({
      success: true,
      quizzes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes'
    });
  }
};

// Pārslēgt viktorīnas "featured" statusu
exports.toggleFeaturedQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    quiz.isFeatured = !quiz.isFeatured;
    await quiz.save();

    res.json({
      success: true,
      message: `Quiz ${quiz.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      quiz
    });
  } catch (error) {
    console.error('Toggle featured quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status'
    });
  }
};

// Dzēst viktorīnu
exports.deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    await Quiz.findByIdAndDelete(quizId);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz'
    });
  }
};
