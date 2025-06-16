const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Clerk integration
  clerkId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Basic user info
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  
  // User preferences
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    }
  },
  
  // User activity
  bookmarkedTools: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool'
  }],
  
  submittedTools: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tool'
  }],
  
  reviews: [{
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tool'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User role and permissions
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Analytics
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ clerkId: 1 });
userSchema.index({ username: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

// Static methods
userSchema.statics.findByClerkId = function(clerkId) {
  return this.findOne({ clerkId });
};

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Instance methods
userSchema.methods.addBookmark = function(toolId) {
  if (!this.bookmarkedTools.includes(toolId)) {
    this.bookmarkedTools.push(toolId);
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.removeBookmark = function(toolId) {
  this.bookmarkedTools = this.bookmarkedTools.filter(id => !id.equals(toolId));
  return this.save();
};

userSchema.methods.addReview = function(toolId, rating, comment) {
  // Remove existing review for this tool
  this.reviews = this.reviews.filter(review => !review.tool.equals(toolId));
  
  // Add new review
  this.reviews.push({
    tool: toolId,
    rating,
    comment
  });
  
  return this.save();
};

userSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);