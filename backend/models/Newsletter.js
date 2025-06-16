const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
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
  source: {
    type: String,
    default: 'website' // website, popup, footer, etc.
  },
  interests: [{
    type: String,
    enum: ['ai-tools', 'tutorials', 'news', 'business', 'development']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  unsubscribedAt: Date,
  unsubscribeReason: String
}, {
  timestamps: true
});

// Indexes
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });

// Static methods
newsletterSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Instance methods
newsletterSchema.methods.unsubscribe = function(reason) {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  this.unsubscribeReason = reason;
  return this.save();
};

module.exports = mongoose.model('Newsletter', newsletterSchema);