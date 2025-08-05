const Review = require('../models/Review');
const Tool = require('../models/Tool');
const { sanitizeText } = require('../lib/sanitizeHtml');

// GET /api/tools/:toolId/reviews
async function getReviews(req, res, next) {
  try {
    const { toolId } = req.params;
    if (!toolId) return res.status(400).json({ error: 'toolId is required' });
    const reviews = await Review.getReviewsByToolId(toolId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
}

// POST /api/tools/:toolId/reviews
async function addReview(req, res, next) {
  try {
    const { toolId } = req.params;
    let { user_id, user_name, rating, comment } = req.body;
    if (!toolId || !user_name || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be 1-5' });
    }
    // Sanitize input
    user_name = sanitizeText(String(user_name).trim().slice(0, 50));
    comment = sanitizeText(String(comment).trim().slice(0, 1000));
    // Prevent duplicate review by user_name for this tool
    const existing = await Review.findByUserNameAndToolId(user_name, toolId);
    if (existing) {
      return res.status(409).json({ error: 'You have already reviewed this tool.' });
    }
    const review = await Review.addReview({ tool_id: toolId, user_id, user_name, rating, comment });
    // Update tool's average rating and review count
    const { avg, count } = await Review.getAverageRatingAndCount(toolId);
    await Tool.updateRatingAndCount(toolId, avg, count);
    res.status(201).json({ review, avg, count });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/tools/:toolId/reviews/:reviewId
async function editReview(req, res, next) {
  try {
    const { toolId, reviewId } = req.params;
    const { user_id, rating, comment } = req.body;
    if (!user_id || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Only allow user to edit their own review
    const review = await Review.getReviewById(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.user_id !== user_id) return res.status(403).json({ error: 'Not authorized' });
    const updated = await Review.updateReview(reviewId, { rating, comment });
    // Update tool's average rating and review count
    const { avg, count } = await Review.getAverageRatingAndCount(toolId);
    await Tool.updateRatingAndCount(toolId, avg, count);
    res.json({ review: updated, avg, count });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/tools/:toolId/reviews/:reviewId
async function deleteReview(req, res, next) {
  try {
    const { toolId, reviewId } = req.params;
    const { user_id, isAdmin } = req.body;
    const review = await Review.getReviewById(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    // Only allow user to delete their own review, or admin
    if (!isAdmin && review.user_id !== user_id) return res.status(403).json({ error: 'Not authorized' });
    await Review.deleteReview(reviewId);
    // Update tool's average rating and review count
    const { avg, count } = await Review.getAverageRatingAndCount(toolId);
    await Tool.updateRatingAndCount(toolId, avg, count);
    res.json({ success: true, avg, count });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/tools/:toolId/reviews/:reviewId/moderate
async function moderateReview(req, res, next) {
  try {
    const { reviewId } = req.params;
    const { status, isAdmin } = req.body;
    if (!isAdmin) return res.status(403).json({ error: 'Not authorized' });
    if (!['approved', 'hidden', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const updated = await Review.setModerationStatus(reviewId, status);
    res.json({ review: updated });
  } catch (error) {
    next(error);
  }
}

// GET /api/reviews?user_id=...
async function getReviewsByUser(req, res, next) {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const reviews = await Review.getReviewsByUserId(user_id);
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getReviews,
  addReview,
  editReview,
  deleteReview,
  moderateReview,
  getReviewsByUser,
}; 