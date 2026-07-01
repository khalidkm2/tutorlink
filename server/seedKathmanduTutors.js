require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const TutorProfile = require('./models/TutorProfile');

const tutors = [
  {
    name: 'Anisha Shrestha',
    email: 'anisha.shrestha@example.com',
    password: 'tutor1234',
    address: 'New Baneshwor, Kathmandu',
    coordinates: [85.3374, 27.6949],
    subjects: ['Mathematics', 'Science'],
    classes: ['8', '9', '10'],
    hourlyFee: 900,
    experience: 6,
    qualifications: 'BSc in Mathematics, experienced in SEE preparation and concept-based learning.',
    availability: [
      { day: 'Monday', slots: ['16:00-18:00', '18:00-20:00'] },
      { day: 'Wednesday', slots: ['16:00-18:00'] },
      { day: 'Saturday', slots: ['10:00-12:00', '14:00-16:00'] }
    ]
  },
  {
    name: 'Sujan Karki',
    email: 'sujan.karki@example.com',
    password: 'tutor1234',
    address: 'Putalisadak, Kathmandu',
    coordinates: [85.3227, 27.7075],
    subjects: ['English', 'Nepali'],
    classes: ['6', '7', '8', '9', '10'],
    hourlyFee: 750,
    experience: 5,
    qualifications: 'MA in English Literature with strong communication and writing coaching background.',
    availability: [
      { day: 'Tuesday', slots: ['16:00-18:00', '18:00-20:00'] },
      { day: 'Thursday', slots: ['16:00-18:00'] },
      { day: 'Sunday', slots: ['10:00-12:00'] }
    ]
  },
  {
    name: 'Pratima Adhikari',
    email: 'pratima.adhikari@example.com',
    password: 'tutor1234',
    address: 'Maharajgunj, Kathmandu',
    coordinates: [85.3331, 27.7441],
    subjects: ['Science', 'Biology', 'Chemistry'],
    classes: ['8', '9', '10', '11', '12'],
    hourlyFee: 1100,
    experience: 8,
    qualifications: 'MSc in Biotechnology with school and entrance exam tutoring experience.',
    availability: [
      { day: 'Monday', slots: ['10:00-12:00'] },
      { day: 'Wednesday', slots: ['16:00-18:00', '18:00-20:00'] },
      { day: 'Friday', slots: ['10:00-12:00'] }
    ]
  },
  {
    name: 'Ramesh Thapa',
    email: 'ramesh.thapa@example.com',
    password: 'tutor1234',
    address: 'Koteshwor, Kathmandu',
    coordinates: [85.3496, 27.6784],
    subjects: ['Mathematics', 'Accountancy'],
    classes: ['9', '10', '11', '12'],
    hourlyFee: 850,
    experience: 7,
    qualifications: 'BBA graduate focused on practical mathematics and accountancy coaching.',
    availability: [
      { day: 'Tuesday', slots: ['16:00-18:00'] },
      { day: 'Thursday', slots: ['10:00-12:00', '16:00-18:00'] },
      { day: 'Saturday', slots: ['14:00-16:00'] }
    ]
  },
  {
    name: 'Nima Gurung',
    email: 'nima.gurung@example.com',
    password: 'tutor1234',
    address: 'Kalanki, Kathmandu',
    coordinates: [85.2558, 27.6927],
    subjects: ['Computer', 'Mathematics'],
    classes: ['6', '7', '8', '9', '10', '11'],
    hourlyFee: 950,
    experience: 4,
    qualifications: 'Computer engineering student teaching coding basics and school math.',
    availability: [
      { day: 'Monday', slots: ['18:00-20:00'] },
      { day: 'Wednesday', slots: ['16:00-18:00'] },
      { day: 'Saturday', slots: ['10:00-12:00'] }
    ]
  },
  {
    name: 'Bibek Gautam',
    email: 'bibek.gautam@example.com',
    password: 'tutor1234',
    address: 'Jawalakhel, Lalitpur',
    coordinates: [85.3132, 27.6710],
    subjects: ['Economics', 'Social Studies'],
    classes: ['8', '9', '10', '11', '12'],
    hourlyFee: 800,
    experience: 5,
    qualifications: 'MA in Economics with project-based social studies and exam preparation coaching.',
    availability: [
      { day: 'Tuesday', slots: ['10:00-12:00'] },
      { day: 'Friday', slots: ['16:00-18:00'] },
      { day: 'Sunday', slots: ['14:00-16:00'] }
    ]
  },
  {
    name: 'Saraswati Joshi',
    email: 'saraswati.joshi@example.com',
    password: 'tutor1234',
    address: 'Lagankhel, Lalitpur',
    coordinates: [85.3194, 27.6590],
    subjects: ['English', 'Communication Skills'],
    classes: ['5', '6', '7', '8', '9'],
    hourlyFee: 700,
    experience: 9,
    qualifications: 'Senior English tutor with a focus on speaking, reading, and foundational grammar.',
    availability: [
      { day: 'Monday', slots: ['10:00-12:00'] },
      { day: 'Thursday', slots: ['16:00-18:00'] },
      { day: 'Saturday', slots: ['10:00-12:00', '12:00-14:00'] }
    ]
  },
  {
    name: 'Kiran Bhattarai',
    email: 'kiran.bhattarai@example.com',
    password: 'tutor1234',
    address: 'Boudha, Kathmandu',
    coordinates: [85.3672, 27.7215],
    subjects: ['Physics', 'Mathematics'],
    classes: ['9', '10', '11', '12'],
    hourlyFee: 1200,
    experience: 10,
    qualifications: 'Physics lecturer with entrance exam and SEE/NEB specialization.',
    availability: [
      { day: 'Tuesday', slots: ['18:00-20:00'] },
      { day: 'Thursday', slots: ['18:00-20:00'] },
      { day: 'Sunday', slots: ['10:00-12:00'] }
    ]
  }
];

const seedTutors = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not set in server/.env file');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully.');

    for (const tutorData of tutors) {
      const existingUser = await User.findOne({ email: tutorData.email });

      if (existingUser) {
        await TutorProfile.findOneAndUpdate(
          { userId: existingUser._id },
          {
            subjects: tutorData.subjects,
            classes: tutorData.classes,
            hourlyFee: tutorData.hourlyFee,
            experience: tutorData.experience,
            qualifications: tutorData.qualifications,
            availability: tutorData.availability
          },
          { new: true, upsert: true, runValidators: true }
        );

        continue;
      }

      const user = await User.create({
        name: tutorData.name,
        email: tutorData.email,
        password: tutorData.password,
        role: 'tutor',
        address: tutorData.address,
        location: {
          type: 'Point',
          coordinates: tutorData.coordinates
        },
        isApproved: true
      });

      await TutorProfile.create({
        userId: user._id,
        subjects: tutorData.subjects,
        classes: tutorData.classes,
        hourlyFee: tutorData.hourlyFee,
        experience: tutorData.experience,
        qualifications: tutorData.qualifications,
        availability: tutorData.availability,
        averageRating: 0,
        reviewCount: 0
      });
    }

    console.log('\nKathmandu tutor seed completed successfully.');
    console.log('Seeded tutors cover central Kathmandu and Lalitpur so recommendation distance matching has real nearby options.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding Kathmandu tutors:', error);
    process.exit(1);
  }
};

seedTutors();