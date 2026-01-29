const mongoose = require('mongoose');

const dbConnect = async () => {
  // Saņem MongoDB URI no vides mainīgā vai izmanto noklusējuma connection string
  const uri = process.env.MONGODB_URI || 'mongodb+srv://owner:owner@cluster0.37v21.mongodb.net/quizmaster';
  try {
    // Mongoose savienojuma opcijas: nodrošina moderno URL parseri un uzlabotu topoloģijas vadību
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

  } catch (err) {
    // Ja savienojums neizdodas, izdrukā kļūdas ziņojumu un izbeidz procesu
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Eksportē funkciju, lai to var izsaukt no servera palaišanas koda (piem., index.js)
module.exports = dbConnect;
