const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false // Exclude from queries by default
    },
    role: {
      type: String,
      enum: ['student', 'tutor', 'admin'],
      required: [true, 'Please specify a role']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Please add location coordinates']
      }
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    isApproved: {
      type: Boolean,
      default: function () {
        // Tutors need approval, students/admins are auto-approved
        return this.role !== 'tutor';
      }
    }
  },
  {
    timestamps: true
  }
);

// GeoJSON index for geospatial queries
UserSchema.index({ location: '2dsphere' });

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
