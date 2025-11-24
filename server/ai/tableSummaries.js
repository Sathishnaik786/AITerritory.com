/**
 * Utility functions for generating table summaries for AI context
 */

/**
 * Generate high-level summaries for database tables
 * @param {Object} allData - Raw table data from Supabase
 * @returns {Object} Summarized table data
 */
function generateTableSummaries(allData) {
  if (!allData || typeof allData !== 'object') {
    return {};
  }

  const summaries = {};
  
  for (const [tableName, rows] of Object.entries(allData)) {
    if (!Array.isArray(rows) || rows.length === 0) {
      summaries[tableName] = {
        count: 0,
        description: `Table ${tableName} is empty or unavailable`
      };
      continue;
    }
    
    // Generate summary based on table type
    switch (tableName) {
      case 'tools':
        summaries[tableName] = summarizeTools(rows);
        break;
      case 'testimonials':
        summaries[tableName] = summarizeTestimonials(rows);
        break;
      case 'blogs':
        summaries[tableName] = summarizeBlogs(rows);
        break;
      case 'prompts':
        summaries[tableName] = summarizePrompts(rows);
        break;
      case 'ai_agents':
        summaries[tableName] = summarizeAIAgents(rows);
        break;
      case 'categories':
        summaries[tableName] = summarizeCategories(rows);
        break;
      default:
        summaries[tableName] = summarizeGenericTable(rows, tableName);
    }
  }
  
  return summaries;
}

/**
 * Summarize tools table
 * @param {Array} rows - Tool records
 * @returns {Object} Summary of tools
 */
function summarizeTools(rows) {
  const count = rows.length;
  const featured = rows.filter(tool => tool.is_featured).length;
  const categories = [...new Set(rows.map(tool => tool.category).filter(Boolean))];
  
  // Get top tools by rating
  const topTools = rows
    .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
    .slice(0, 3)
    .map(tool => ({
      name: tool.name,
      rating: tool.average_rating,
      description: tool.short_description || tool.description?.substring(0, 100) + '...'
    }));
  
  return {
    count,
    featured,
    categories: categories.slice(0, 5),
    top_rated: topTools,
    description: `Contains ${count} AI tools${featured > 0 ? `, including ${featured} featured tools` : ''}`
  };
}

/**
 * Summarize testimonials table
 * @param {Array} rows - Testimonial records
 * @returns {Object} Summary of testimonials
 */
function summarizeTestimonials(rows) {
  const count = rows.length;
  const approved = rows.filter(t => t.approved).length;
  const ratings = rows.map(t => t.rating).filter(Boolean);
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
    : 'N/A';
  
  // Get recent testimonials
  const recent = rows
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 2)
    .map(t => ({
      user: t.user_name,
      role: t.user_role,
      company: t.company_name,
      content: t.content?.substring(0, 100) + '...'
    }));
  
  return {
    count,
    approved: approved,
    average_rating: averageRating,
    recent_testimonials: recent,
    description: `Contains ${count} testimonials${approved > 0 ? `, with ${approved} approved` : ''}`
  };
}

/**
 * Summarize blogs table
 * @param {Array} rows - Blog records
 * @returns {Object} Summary of blogs
 */
function summarizeBlogs(rows) {
  const count = rows.length;
  const published = rows.filter(b => b.status === 'published').length;
  const categories = [...new Set(rows.map(b => b.category).filter(Boolean))];
  
  // Get recent blogs
  const recent = rows
    .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at))
    .slice(0, 3)
    .map(b => ({
      title: b.title,
      excerpt: b.excerpt || b.content?.substring(0, 100) + '...'
    }));
  
  return {
    count,
    published,
    categories: categories.slice(0, 5),
    recent_posts: recent,
    description: `Contains ${count} blog posts${published > 0 ? `, with ${published} published` : ''}`
  };
}

/**
 * Summarize prompts table
 * @param {Array} rows - Prompt records
 * @returns {Object} Summary of prompts
 */
function summarizePrompts(rows) {
  const count = rows.length;
  const categories = [...new Set(rows.map(p => p.category).filter(Boolean))];
  const approved = rows.filter(p => p.status === 'approved').length;
  
  // Get popular prompts
  const popular = rows
    .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
    .slice(0, 3)
    .map(p => ({
      title: p.title,
      category: p.category,
      likes: p.like_count
    }));
  
  return {
    count,
    approved,
    categories: categories.slice(0, 5),
    popular_prompts: popular,
    description: `Contains ${count} prompts${approved > 0 ? `, with ${approved} approved` : ''}`
  };
}

/**
 * Summarize AI agents table
 * @param {Array} rows - AI agent records
 * @returns {Object} Summary of AI agents
 */
function summarizeAIAgents(rows) {
  const count = rows.length;
  const categories = [...new Set(rows.map(a => a.category).filter(Boolean))];
  
  // Get featured agents
  const featured = rows
    .filter(a => a.is_featured)
    .slice(0, 3)
    .map(a => ({
      name: a.name,
      category: a.category,
      description: a.short_description || a.description?.substring(0, 100) + '...'
    }));
  
  return {
    count,
    categories: categories.slice(0, 5),
    featured_agents: featured,
    description: `Contains ${count} AI agents`
  };
}

/**
 * Summarize categories table
 * @param {Array} rows - Category records
 * @returns {Object} Summary of categories
 */
function summarizeCategories(rows) {
  const count = rows.length;
  
  // Group by parent category
  const parentCategories = rows
    .filter(c => !c.parent_id)
    .map(c => ({
      name: c.name,
      slug: c.slug,
      description: c.description
    }));
  
  return {
    count,
    parent_categories: parentCategories,
    description: `Contains ${count} categories`
  };
}

/**
 * Generic table summarization for tables without specific handlers
 * @param {Array} rows - Table records
 * @param {string} tableName - Name of the table
 * @returns {Object} Generic summary
 */
function summarizeGenericTable(rows, tableName) {
  const count = rows.length;
  
  // Get column names from first row
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  
  // Sample a few rows for context
  const sampleRows = rows.slice(0, 2).map(row => {
    const simplified = {};
    // Take only first few columns to keep it concise
    Object.keys(row).slice(0, 5).forEach(key => {
      simplified[key] = truncateValue(row[key]);
    });
    return simplified;
  });
  
  return {
    count,
    columns: columns.slice(0, 10),
    sample_data: sampleRows,
    description: `Table ${tableName} contains ${count} records with ${columns.length} columns`
  };
}

/**
 * Truncate values to keep summaries concise
 * @param {*} value - Value to truncate
 * @returns {*} Truncated value
 */
function truncateValue(value) {
  if (typeof value === 'string' && value.length > 100) {
    return value.substring(0, 100) + '...';
  }
  return value;
}

module.exports = { generateTableSummaries };