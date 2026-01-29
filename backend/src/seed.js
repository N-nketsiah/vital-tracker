const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Import models
const User = require('./models/User');
const HealthEntry = require('./models/HealthEntry');

const ghanaianNames = [
  { name: 'Kwame Asante', email: 'kwame@example.com' },
  { name: 'Ama Boateng', email: 'ama@example.com' },
  { name: 'Kofi Mensah', email: 'kofi@example.com' },
  { name: 'Abena Osei', email: 'abena@example.com' },
  { name: 'Yaw Adjei', email: 'yaw@example.com' },
  { name: 'Nana Owusu', email: 'nana@example.com' }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vitaltrack');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await HealthEntry.deleteMany({});
    console.log('Cleared existing data');

    // Create users with health entries
    for (const userData of ghanaianNames) {
    // Create user (password will be hashed by pre-save hook)
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: 'password123', // Will be hashed by model pre-save hook
        age: Math.floor(Math.random() * (65 - 20 + 1)) + 20,
        height: Math.floor(Math.random() * (200 - 150 + 1)) + 150,
        weight: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
        gender: Math.random() > 0.5 ? 'male' : 'female'
      });

      console.log(`Created user: ${userData.name}`);

      // Create health entries for this user
      const healthEntries = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        healthEntries.push({
          userId: user._id,
          date: date,
          heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
          bloodPressureSys: Math.floor(Math.random() * (140 - 90 + 1)) + 90,
          bloodPressureDia: Math.floor(Math.random() * (90 - 60 + 1)) + 60,
          weight: user.weight + (Math.random() * 5 - 2.5),
          steps: Math.floor(Math.random() * (15000 - 3000 + 1)) + 3000,
          water: Math.floor(Math.random() * 10) + 1,
          sleep: Math.floor(Math.random() * (9 - 5 + 1)) + 5,
          mood: Math.floor(Math.random() * (10 - 5 + 1)) + 5,
          notes: [
            'Feeling energetic today',
            'Had a good workout',
            'Slept well',
            'Busy day at work',
            'Relaxing evening'
          ][Math.floor(Math.random() * 5)]
        });
      }

      await HealthEntry.insertMany(healthEntries);
      console.log(`Created 30 health entries for ${userData.name}`);
    }

    console.log('✅ Database seeded successfully with Ghanaian names!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
