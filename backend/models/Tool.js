const mongoose = require('mongoose');

const subToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  link: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Free', 'Freemium', 'Paid', 'Released', 'Upcoming', 'Beta'],
    default: 'Released'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true,
    index: true
  }],
  image: {
    type: String,
    default: null
  },
  company: {
    type: String,
    trim: true,
    index: true
  },
  subTools: [subToolSchema],
  
  // Additional fields for enhanced functionality
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  bookmarkCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  pricing: {
    type: String,
    enum: ['Free', 'Freemium', 'Paid', 'Active deal'],
    default: 'Free'
  },
  
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Submission tracking
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: Date,
  
  // Analytics
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
toolSchema.index({ name: 'text', description: 'text', tags: 'text' });
toolSchema.index({ category: 1, featured: -1 });
toolSchema.index({ rating: -1, reviewCount: -1 });
toolSchema.index({ createdAt: -1 });
toolSchema.index({ viewCount: -1 });

// Virtual for average rating calculation
toolSchema.virtual('averageRating').get(function() {
  return this.reviewCount > 0 ? (this.rating / this.reviewCount).toFixed(1) : 0;
});

// Pre-save middleware to generate slug
toolSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  this.lastUpdated = new Date();
  next();
});

// Static methods
toolSchema.statics.findByCategory = function(category) {
  return this.find({ category, approved: true }).sort({ featured: -1, rating: -1 });
};

toolSchema.statics.findFeatured = function() {
  return this.find({ featured: true, approved: true }).sort({ rating: -1 }).limit(10);
};

toolSchema.statics.searchTools = function(query) {
  return this.find({
    $and: [
      { approved: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
          { company: { $regex: query, $options: 'i' } }
        ]
      }
    ]
  }).sort({ rating: -1, viewCount: -1 });
};

// Instance methods
toolSchema.methods.incrementView = function() {
  this.viewCount += 1;
  return this.save();
};

toolSchema.methods.updateRating = function(newRating) {
  this.rating = ((this.rating * this.reviewCount) + newRating) / (this.reviewCount + 1);
  this.reviewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Tool', toolSchema);