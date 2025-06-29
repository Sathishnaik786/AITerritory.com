const supabase = require('../config/database');

const TABLE = 'reviews';

async function getReviewsByToolId(toolId) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Review getReviewsByToolId error:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Review getReviewsByToolId error:', error);
    return [];
  }
}

async function addReview({ tool_id, user_id, user_name, rating, comment }) {
  try {
    console.log('Review addReview input:', { tool_id, user_id, user_name, rating, comment });
    
    const { data, error } = await supabase
      .from(TABLE)
      .insert([
        { tool_id, user_id, user_name, rating, comment }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Review addReview error:', error);
      throw error;
    }
    
    console.log('Review addReview success:', data);
    return data;
  } catch (error) {
    console.error('Review addReview error:', error);
    throw error;
  }
}

async function getAverageRatingAndCount(toolId) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('rating')
      .eq('tool_id', toolId);
    
    if (error) {
      console.error('Review getAverageRatingAndCount error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) return { avg: 0, count: 0 };
    
    const ratings = data.map(r => r.rating).filter(r => typeof r === 'number');
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    
    return { avg, count: ratings.length };
  } catch (error) {
    console.error('Review getAverageRatingAndCount error:', error);
    return { avg: 0, count: 0 };
  }
}

async function findByUserAndToolId(user_id, toolId) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('tool_id', toolId)
      .eq('user_id', user_id)
      .maybeSingle();
    
    if (error) {
      console.error('Review findByUserAndToolId error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Review findByUserAndToolId error:', error);
    return null;
  }
}

async function updateReview(reviewId, { rating, comment }) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ rating, comment, updated_at: new Date().toISOString() })
      .eq('id', reviewId)
      .select()
      .single();
    
    if (error) {
      console.error('Review updateReview error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Review updateReview error:', error);
    throw error;
  }
}

async function deleteReview(reviewId) {
  try {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', reviewId);
    
    if (error) {
      console.error('Review deleteReview error:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Review deleteReview error:', error);
    throw error;
  }
}

async function getReviewById(reviewId) {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', reviewId)
      .maybeSingle();
    
    if (error) {
      console.error('Review getReviewById error:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Review getReviewById error:', error);
    return null;
  }
}

module.exports = {
  getReviewsByToolId,
  addReview,
  getAverageRatingAndCount,
  findByUserAndToolId,
  updateReview,
  deleteReview,
  getReviewById,
}; 