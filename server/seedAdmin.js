require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  const adminEmail = 'admin@tutorlink.com';
  const adminPassword = 'adminpassword';

  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not set in server/.env file');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully.');

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log(`\nAn admin user with email "${adminEmail}" already exists in the database.`);
      console.log('You can log in using these credentials.');
      mongoose.disconnect();
      return;
    }

    // Create the admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      address: 'TutorLink Head Office',
      location: {
        type: 'Point',
        coordinates: [85.3240, 27.7172] // [longitude, latitude]
      },
      isApproved: true
    });

    console.log('\n=============================================');
    console.log('  Admin User Seeded Successfully!            ');
    console.log('=============================================');
    console.log(`  Name:     ${adminUser.name}`);
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
    console.log('=============================================\n');

    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
