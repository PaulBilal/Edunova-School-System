// User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'lecturer', 'admin'],
    default: 'student'
  },
  studentNumber: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  staffNumber: {
    type: String,
    required: function() { return this.role === 'lecturer' || this.role === 'admin'; }
  },
  faculty: {
    type: String,
    enum: [
      'Engineering',
      'Science',
      'Arts & Humanities',
      'Business',
      'Law',
      'Education',
      'Information Communication and Technology'
    ],
    required: function() { return this.role === 'student' || this.role === 'lecturer'; }
  },
  campus: {
    type: String,
    enum: [
      'Main Campus',
      'Art Campus',
      'Science Campus',
      'Soshanguve North Campus',
      'Soshanguve South Campus'
    ],
    required: function() { return this.role === 'student' || this.role === 'lecturer'; }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);