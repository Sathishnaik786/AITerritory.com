/**
 * AI Analytics Routes
 * Provides endpoints for AI assistant analytics data
 */

const express = require('express');
const router = express.Router();

// Import the database connection
const { database } = require('../lib/supabase');

/**
 * GET /ai-insights/overview
 * Get overview analytics data
 */
router.get('/overview', async (req, res) => {
  try {
    // Get total chats count
    const { count: totalChats, error: chatsError } = await database
      .from('ai_logs')
      .select('*', { count: 'exact', head: true });

    if (chatsError) {
      console.error('Error fetching total chats:', chatsError);
      return res.status(500).json({ error: 'Failed to fetch chat data' });
    }

    // Get chats per day for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: dailyChats, error: dailyChatsError } = await database
      .from('ai_logs')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (dailyChatsError) {
      console.error('Error fetching daily chats:', dailyChatsError);
      return res.status(500).json({ error: 'Failed to fetch daily chat data' });
    }

    // Process daily chats data
    const chatsPerDay = {};
    dailyChats.forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0];
      chatsPerDay[date] = (chatsPerDay[date] || 0) + 1;
    });

    // Format for chart
    const chartData = Object.entries(chatsPerDay).map(([date, chats]) => ({
      date,
      chats
    }));

    // Get unique users (assuming we have a user identifier in the future)
    // For now, we'll use a placeholder
    const uniqueUsers = 42; // Placeholder value

    // Calculate average response time (placeholder)
    const avgResponseTime = 1.2; // Placeholder value in seconds

    // Calculate satisfaction rate (placeholder)
    const satisfactionRate = 92; // Placeholder value in percentage

    res.json({
      totalChats: totalChats || 0,
      uniqueUsers,
      avgResponseTime,
      satisfactionRate,
      chartData
    });
  } catch (error) {
    console.error('Error in /ai-insights/overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /ai-insights/top-questions
 * Get most asked questions
 */
router.get('/top-questions', async (req, res) => {
  try {
    // Get all messages from ai_logs
    const { data: logs, error } = await database
      .from('ai_logs')
      .select('message')
      .order('created_at', { ascending: false })
      .limit(1000); // Limit to avoid performance issues

    if (error) {
      console.error('Error fetching logs:', error);
      return res.status(500).json({ error: 'Failed to fetch log data' });
    }

    // Count occurrences of similar questions
    const questionCounts = {};
    logs.forEach(log => {
      const message = log.message.trim();
      // Simple grouping by message (in a real implementation, you might want to use
      // more sophisticated similarity matching)
      questionCounts[message] = (questionCounts[message] || 0) + 1;
    });

    // Convert to array and sort by count
    const topQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 questions

    res.json(topQuestions);
  } catch (error) {
    console.error('Error in /ai-insights/top-questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /ai-insights/trends
 * Get trend data for charts
 */
router.get('/trends', async (req, res) => {
  try {
    // Get data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: logs, error } = await database
      .from('ai_logs')
      .select('created_at, message')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching trend data:', error);
      return res.status(500).json({ error: 'Failed to fetch trend data' });
    }

    // Group data by week
    const weeklyData = {};
    logs.forEach(log => {
      const date = new Date(log.created_at);
      // Get the Monday of the week for grouping
      const monday = new Date(date);
      const day = monday.getDay();
      const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
      monday.setDate(diff);
      monday.setHours(0, 0, 0, 0);
      
      const weekKey = monday.toISOString().split('T')[0];
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
    });

    // Format for line chart
    const trendData = Object.entries(weeklyData)
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

    // Get some sample questions for display
    const recentQuestions = logs
      .slice(-5)
      .map(log => log.message)
      .filter((message, index, self) => self.indexOf(message) === index); // Remove duplicates

    res.json({
      trendData,
      recentQuestions
    });
  } catch (error) {
    console.error('Error in /ai-insights/trends:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;