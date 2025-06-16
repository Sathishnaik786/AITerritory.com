const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  toolCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  metaTitle: String,
  metaDescription: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });
categorySchema.index({ featured: -1, order: 1 });

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Static methods
categorySchema.statics.findFeatured = function() {
  return this.find({ featured: true, isActive: true }).sort({ order: 1 });
};

categorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true });
};

// Instance methods
categorySchema.methods.updateToolCount = async function() {
  const Tool = mongoose.model('Tool');
  this.toolCount = await Tool.countDocuments({ category: this.name, approved: true });
  return this.save();
};

module.exports = mongoose.model('Category', categorySchema);