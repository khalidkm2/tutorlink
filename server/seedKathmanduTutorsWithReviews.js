require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const TutorProfile = require('./models/TutorProfile');
const TuitionRequest = require('./models/TuitionRequest');
const Review = require('./models/Review');
// const { tutorSeedData, studentSeedData, reviewSeedData } = require('./seedAllData');

const tutorSeedData = [
  {
    name: 'Ujjwal Bastola',
    email: 'ujjwal.bastola.seed@example.com',
    password: 'tutor1234',
    address: 'Balaju, Kathmandu',
    coordinates: [85.3057, 27.7274],
    subjects: ['Mathematics', 'Science'],
    classes: ['6', '7', '8'],
    hourlyFee: 800,
    experience: 4,
    qualifications: 'BSc graduate specializing in building strong basics for junior-level students.',
    availability: [
      { day: 'Sunday', slots: ['15:00-17:00'] },
      { day: 'Wednesday', slots: ['15:00-17:00'] },
      { day: 'Friday', slots: ['15:00-17:00'] }
    ]
  },
  {
    name: 'Sneha Dahal',
    email: 'sneha.dahal.seed@example.com',
    password: 'tutor1234',
    address: 'Min Bhawan, Kathmandu',
    coordinates: [85.3435, 27.6889],
    subjects: ['English', 'Social Studies'],
    classes: ['9', '10'],
    hourlyFee: 780,
    experience: 6,
    qualifications: 'MA in English with focus on SEE essay writing and comprehension skills.',
    availability: [
      { day: 'Monday', slots: ['17:00-19:00'] },
      { day: 'Thursday', slots: ['17:00-19:00'] },
      { day: 'Saturday', slots: ['09:00-11:00'] }
    ]
  },
  {
    name: 'Aakash Bhusal',
    email: 'aakash.bhusal.seed@example.com',
    password: 'tutor1234',
    address: 'Tokha, Kathmandu',
    coordinates: [85.3396, 27.7480],
    subjects: ['Physics', 'Chemistry'],
    classes: ['10', '11', '12'],
    hourlyFee: 1250,
    experience: 10,
    qualifications: 'MSc in Physics with strong record in engineering entrance coaching.',
    availability: [
      { day: 'Tuesday', slots: ['16:00-18:00'] },
      { day: 'Thursday', slots: ['16:00-18:00', '18:00-20:00'] },
      { day: 'Sunday', slots: ['13:00-15:00'] }
    ]
  },
  {
    name: 'Bandana Chhetri',
    email: 'bandana.chhetri.seed@example.com',
    password: 'tutor1234',
    address: 'Kupondole, Lalitpur',
    coordinates: [85.3161, 27.6867],
    subjects: ['Nepali', 'English'],
    classes: ['5', '6', '7'],
    hourlyFee: 650,
    experience: 3,
    qualifications: 'BEd student teacher passionate about language development for young learners.',
    availability: [
      { day: 'Monday', slots: ['14:00-16:00'] },
      { day: 'Wednesday', slots: ['14:00-16:00'] },
      { day: 'Saturday', slots: ['11:00-13:00'] }
    ]
  },
  {
    name: 'Milan Shakya',
    email: 'milan.shakya.seed@example.com',
    password: 'tutor1234',
    address: 'Bhaktapur Durbar Square, Bhaktapur',
    coordinates: [85.4278, 27.6725],
    subjects: ['Computer', 'Mathematics'],
    classes: ['9', '10', '11', '12'],
    hourlyFee: 1000,
    experience: 5,
    qualifications: 'BSc CSIT graduate teaching programming and applied math for senior grades.',
    availability: [
      { day: 'Tuesday', slots: ['17:00-19:00'] },
      { day: 'Friday', slots: ['17:00-19:00'] },
      { day: 'Sunday', slots: ['10:00-12:00'] }
    ]
  },
  {
    name: 'Pooja Rimal',
    email: 'pooja.rimal.seed@example.com',
    password: 'tutor1234',
    address: 'Kalimati, Kathmandu',
    coordinates: [85.2949, 27.6963],
    subjects: ['Biology', 'Science'],
    classes: ['8', '9', '10'],
    hourlyFee: 900,
    experience: 5,
    qualifications: 'BSc in Zoology with a focus on diagram-based learning and lab concepts.',
    availability: [
      { day: 'Monday', slots: ['10:00-12:00'] },
      { day: 'Wednesday', slots: ['10:00-12:00'] },
      { day: 'Friday', slots: ['10:00-12:00'] }
    ]
  },
  {
    name: 'Sagar Oli',
    email: 'sagar.oli.seed@example.com',
    password: 'tutor1234',
    address: 'Chapagaun, Lalitpur',
    coordinates: [85.3067, 27.6218],
    subjects: ['Mathematics', 'Accountancy', 'Economics'],
    classes: ['11', '12'],
    hourlyFee: 1100,
    experience: 8,
    qualifications: 'Chartered accountancy candidate teaching commerce math with real-world cases.',
    availability: [
      { day: 'Tuesday', slots: ['15:00-17:00'] },
      { day: 'Thursday', slots: ['15:00-17:00'] },
      { day: 'Saturday', slots: ['16:00-18:00'] }
    ]
  },
  {
    name: 'Rina Waiba',
    email: 'rina.waiba.seed@example.com',
    password: 'tutor1234',
    address: 'Budhanilkantha, Kathmandu',
    coordinates: [85.3616, 27.7809],
    subjects: ['English', 'Science'],
    classes: ['4', '5', '6'],
    hourlyFee: 600,
    experience: 4,
    qualifications: 'Primary teacher with certification in phonics-based reading instruction.',
    availability: [
      { day: 'Monday', slots: ['12:00-14:00'] },
      { day: 'Wednesday', slots: ['12:00-14:00'] },
      { day: 'Sunday', slots: ['09:00-11:00'] }
    ]
  },
  {
    name: 'Deepesh Karmacharya',
    email: 'deepesh.karmacharya.seed@example.com',
    password: 'tutor1234',
    address: 'Banepa, Kavre',
    coordinates: [85.5217, 27.6316],
    subjects: ['Physics', 'Mathematics'],
    classes: ['9', '10', '11'],
    hourlyFee: 950,
    experience: 6,
    qualifications: 'Engineering graduate offering focused SEE and NEB physics coaching.',
    availability: [
      { day: 'Sunday', slots: ['15:00-17:00'] },
      { day: 'Tuesday', slots: ['18:00-20:00'] },
      { day: 'Thursday', slots: ['18:00-20:00'] }
    ]
  },
  {
    name: 'Sabnam Ghising',
    email: 'sabnam.ghising.seed@example.com',
    password: 'tutor1234',
    address: 'Sankhu, Kathmandu',
    coordinates: [85.4514, 27.7386],
    subjects: ['Social Studies', 'Nepali'],
    classes: ['6', '7', '8', '9'],
    hourlyFee: 680,
    experience: 7,
    qualifications: 'Long-time school teacher focused on exam writing techniques and civics.',
    availability: [
      { day: 'Monday', slots: ['16:00-18:00'] },
      { day: 'Thursday', slots: ['16:00-18:00'] },
      { day: 'Saturday', slots: ['12:00-14:00'] }
    ]
  }
];

const studentSeedData = [
  {
    name: 'Rupak Silwal',
    email: 'rupak.silwal.seed@example.com',
    password: 'student123',
    address: 'Gokarna, Kathmandu',
    coordinates: [85.3826, 27.7439]
  },
  {
    name: 'Ishika Manandhar',
    email: 'ishika.manandhar.seed@example.com',
    password: 'student123',
    address: 'Nagarkot Road, Bhaktapur',
    coordinates: [85.4184, 27.6650]
  },
  {
    name: 'Bishal Katuwal',
    email: 'bishal.katuwal.seed@example.com',
    password: 'student123',
    address: 'Godawari, Lalitpur',
    coordinates: [85.3936, 27.5972]
  },
  {
    name: 'Sadichha Regmi',
    email: 'sadichha.regmi.seed@example.com',
    password: 'student123',
    address: 'Sukedhara, Kathmandu',
    coordinates: [85.3402, 27.7350]
  },
  {
    name: 'Nirajan Tiwari',
    email: 'nirajan.tiwari.seed@example.com',
    password: 'student123',
    address: 'Sankhamul, Kathmandu',
    coordinates: [85.3316, 27.6841]
  },
  {
    name: 'Ojaswi Baral',
    email: 'ojaswi.baral.seed@example.com',
    password: 'student123',
    address: 'Harisiddhi, Lalitpur',
    coordinates: [85.3453, 27.6488]
  },
  {
    name: 'Kritan Joshi',
    email: 'kritan.joshi.seed@example.com',
    password: 'student123',
    address: 'Jorpati, Kathmandu',
    coordinates: [85.3808, 27.7280]
  }
];

const reviewSeedData = [
  { tutorEmail: 'ujjwal.bastola.seed@example.com', studentEmail: 'rupak.silwal.seed@example.com', subject: 'Mathematics', classGrade: '7', hourlyFee: 800, rating: 4, comment: 'Very encouraging with beginners and explains steps slowly and clearly.' },
  { tutorEmail: 'sneha.dahal.seed@example.com', studentEmail: 'ishika.manandhar.seed@example.com', subject: 'English', classGrade: '10', hourlyFee: 780, rating: 5, comment: 'Helped a lot with essay structure and confidence before the SEE exam.' },
  { tutorEmail: 'aakash.bhusal.seed@example.com', studentEmail: 'bishal.katuwal.seed@example.com', subject: 'Physics', classGrade: '12', hourlyFee: 1250, rating: 5, comment: 'Excellent depth of knowledge, especially for tricky numerical problems.' },
  { tutorEmail: 'aakash.bhusal.seed@example.com', studentEmail: 'sadichha.regmi.seed@example.com', subject: 'Chemistry', classGrade: '11', hourlyFee: 1250, rating: 4, comment: 'Clear explanations though sessions can move a bit fast at times.' },
  { tutorEmail: 'bandana.chhetri.seed@example.com', studentEmail: 'nirajan.tiwari.seed@example.com', subject: 'Nepali', classGrade: '6', hourlyFee: 650, rating: 4, comment: 'Friendly teaching style that keeps younger students engaged throughout.' },
  { tutorEmail: 'milan.shakya.seed@example.com', studentEmail: 'ojaswi.baral.seed@example.com', subject: 'Computer', classGrade: '10', hourlyFee: 1000, rating: 5, comment: 'Great mix of theory and hands-on coding practice every session.' },
  { tutorEmail: 'pooja.rimal.seed@example.com', studentEmail: 'kritan.joshi.seed@example.com', subject: 'Biology', classGrade: '9', hourlyFee: 900, rating: 4, comment: 'Uses diagrams really well, which made revision so much easier.' },
  { tutorEmail: 'sagar.oli.seed@example.com', studentEmail: 'rupak.silwal.seed@example.com', subject: 'Accountancy', classGrade: '12', hourlyFee: 1100, rating: 5, comment: 'Explains ledger concepts with practical examples that actually make sense.' },
  { tutorEmail: 'rina.waiba.seed@example.com', studentEmail: 'ishika.manandhar.seed@example.com', subject: 'English', classGrade: '5', hourlyFee: 600, rating: 5, comment: 'Wonderful with kids, sessions are always fun and encouraging.' },
  { tutorEmail: 'deepesh.karmacharya.seed@example.com', studentEmail: 'sadichha.regmi.seed@example.com', subject: 'Physics', classGrade: '10', hourlyFee: 950, rating: 4, comment: 'Solid teaching and always willing to repeat topics until they click.' },
  { tutorEmail: 'sabnam.ghising.seed@example.com', studentEmail: 'nirajan.tiwari.seed@example.com', subject: 'Social Studies', classGrade: '8', hourlyFee: 680, rating: 3, comment: 'Decent sessions overall, though pacing felt slow at times.' }
];

module.exports = { tutorSeedData, studentSeedData, reviewSeedData };

const seedKathmanduTutorsWithReviews = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI is not set in server/.env file');
      process.exit(1);
    }

    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected successfully.');

    const seedEmails = [
      ...tutorSeedData.map((tutor) => tutor.email),
      ...studentSeedData.map((student) => student.email)
    ];

    const existingUsers = await User.find({ email: { $in: seedEmails } }).select('_id');
    const existingUserIds = existingUsers.map((user) => user._id);

    if (existingUserIds.length > 0) {
      await Review.deleteMany({ $or: [{ tutorId: { $in: existingUserIds } }, { studentId: { $in: existingUserIds } }] });
      await TuitionRequest.deleteMany({ $or: [{ tutorId: { $in: existingUserIds } }, { studentId: { $in: existingUserIds } }] });
      await TutorProfile.deleteMany({ userId: { $in: existingUserIds } });
      await User.deleteMany({ _id: { $in: existingUserIds } });
    }

    const studentMap = new Map();
    for (const studentData of studentSeedData) {
      const student = await User.create({
        name: studentData.name,
        email: studentData.email,
        password: studentData.password,
        role: 'student',
        address: studentData.address,
        location: { type: 'Point', coordinates: studentData.coordinates },
        isApproved: true
      });

      studentMap.set(studentData.email, student);
    }

    const tutorMap = new Map();
    for (const tutorData of tutorSeedData) {
      const tutor = await User.create({
        name: tutorData.name,
        email: tutorData.email,
        password: tutorData.password,
        role: 'tutor',
        address: tutorData.address,
        location: { type: 'Point', coordinates: tutorData.coordinates },
        isApproved: true
      });

      tutorMap.set(tutorData.email, tutor);

      await TutorProfile.create({
        userId: tutor._id,
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

    for (const reviewData of reviewSeedData) {
      const tutor = tutorMap.get(reviewData.tutorEmail);
      const student = studentMap.get(reviewData.studentEmail);

      if (!tutor || !student) {
        throw new Error(`Missing tutor or student for review seed: ${reviewData.tutorEmail}`);
      }

      const request = await TuitionRequest.create({
        studentId: student._id,
        tutorId: tutor._id,
        subject: reviewData.subject,
        classGrade: reviewData.classGrade,
        hourlyFee: reviewData.hourlyFee,
        status: 'completed',
        message: `Seeded request for ${reviewData.subject} tutoring in Kathmandu.`
      });

      await Review.create({
        studentId: student._id,
        tutorId: tutor._id,
        requestId: request._id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
    }

    console.log('\nKathmandu tutors, requests, and reviews seeded successfully.');
    console.log('The seeded tutors cover multiple Kathmandu neighborhoods with mixed ratings from 3 to 5 stars.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding Kathmandu tutors with reviews:', error);
    process.exit(1);
  }
};

seedKathmanduTutorsWithReviews();