const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { strictLimiter } = require('../middleware/rateLimiter');

// Add reaction to comment
router.post('/:commentId/reactions', strictLimiter, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { user_id, reaction_type } = req.body;

    if (!user_id || !reaction_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate reaction type
    const validReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    if (!validReactions.includes(reaction_type)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    // Check if comment exists
    const { data: comment, error: commentError } = await supabase
      .from('blog_comments')
      .select('id')
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user already has this reaction
    const { data: existingReaction, error: existingError } = await supabase
      .from('comment_reactions')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user_id)
      .eq('reaction_type', reaction_type)
      .single();

    if (existingReaction) {
      // Remove reaction (toggle off)
      const { error: deleteError } = await supabase
        .from('comment_reactions')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user_id)
        .eq('reaction_type', reaction_type);

      if (deleteError) {
        console.error('Error removing reaction:', deleteError);
        return res.status(500).json({ error: 'Failed to remove reaction' });
      }

      return res.json({ action: 'removed', reaction_type });
    }

    // Add reaction
    const { data: newReaction, error: insertError } = await supabase
      .from('comment_reactions')
      .insert({
        comment_id: commentId,
        user_id,
        reaction_type
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding reaction:', insertError);
      return res.status(500).json({ error: 'Failed to add reaction' });
    }

    res.status(201).json({ action: 'added', reaction: newReaction });
  } catch (error) {
    console.error('Error in reaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reactions for a comment
router.get('/:commentId/reactions', async (req, res) => {
  try {
    const { commentId } = req.params;

    const { data: reactions, error } = await supabase
      .from('comment_reactions')
      .select('reaction_type, user_id')
      .eq('comment_id', commentId);

    if (error) {
      console.error('Error fetching reactions:', error);
      return res.status(500).json({ error: 'Failed to fetch reactions' });
    }

    // Group reactions by type
    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
      return acc;
    }, {});

    res.json({ reactions, counts: reactionCounts });
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Report a comment
router.post('/:commentId/report', strictLimiter, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reporter_user_id, report_reason, report_details } = req.body;

    if (!reporter_user_id || !report_reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate report reason
    const validReasons = ['spam', 'inappropriate', 'harassment', 'other'];
    if (!validReasons.includes(report_reason)) {
      return res.status(400).json({ error: 'Invalid report reason' });
    }

    // Check if comment exists
    const { data: comment, error: commentError } = await supabase
      .from('blog_comments')
      .select('id')
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user already reported this comment
    const { data: existingReport, error: existingError } = await supabase
      .from('comment_reports')
      .select('id')
      .eq('comment_id', commentId)
      .eq('reporter_user_id', reporter_user_id)
      .single();

    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this comment' });
    }

    // Create report
    const { data: newReport, error: insertError } = await supabase
      .from('comment_reports')
      .insert({
        comment_id: commentId,
        reporter_user_id,
        report_reason,
        report_details: report_details || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating report:', insertError);
      return res.status(500).json({ error: 'Failed to create report' });
    }

    res.status(201).json({ message: 'Comment reported successfully', report: newReport });
  } catch (error) {
    console.error('Error reporting comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reports for a comment (admin only)
router.get('/:commentId/reports', async (req, res) => {
  try {
    const { commentId } = req.params;

    const { data: reports, error } = await supabase
      .from('comment_reports')
      .select('*')
      .eq('comment_id', commentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      return res.status(500).json({ error: 'Failed to fetch reports' });
    }

    res.json(reports || []);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Moderate a comment (admin only)
router.patch('/:commentId/moderate', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { is_moderated, moderation_reason } = req.body;

    if (typeof is_moderated !== 'boolean') {
      return res.status(400).json({ error: 'is_moderated must be a boolean' });
    }

    const { data: updatedComment, error } = await supabase
      .from('blog_comments')
      .update({
        is_moderated,
        moderation_reason: moderation_reason || null
      })
      .eq('id', commentId)
      .select()
      .single();

    if (error) {
      console.error('Error moderating comment:', error);
      return res.status(500).json({ error: 'Failed to moderate comment' });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error('Error moderating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 