const { supabase } = require('../lib/supabase');

// Get share count for a tool
exports.getShareCount = async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const { count, error } = await supabase
      .from('shares')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId)
      .eq('platform', 'social'); // Only count actual social media shares

    if (error) {
      console.error('Error getting share count:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ count: count || 0 });
  } catch (error) {
    console.error('Error in getShareCount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a share to a tool (only for actual social media redirects, requires authentication)
exports.addShare = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { userId, platform, toolUrl, toolName } = req.body;

    // Require user authentication
    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Validate platform
    const validPlatforms = ['instagram', 'facebook', 'twitter', 'whatsapp'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    // Add the share
    const { data, error } = await supabase
      .from('shares')
      .insert([
        {
          tool_id: toolId,
          user_id: userId,
          platform: platform,
          tool_url: toolUrl,
          tool_name: toolName
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding share:', error);
      return res.status(500).json({ error: error.message });
    }

    // Get updated count
    const { count } = await supabase
      .from('shares')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId)
      .eq('platform', 'social');

    res.json({ 
      success: true, 
      share: data, 
      count: count || 0 
    });
  } catch (error) {
    console.error('Error in addShare:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get shares by platform
exports.getSharesByPlatform = async (req, res) => {
  try {
    const { toolId } = req.params;
    
    const { data, error } = await supabase
      .from('shares')
      .select('platform')
      .eq('tool_id', toolId)
      .eq('platform', 'social');

    if (error) {
      console.error('Error getting shares by platform:', error);
      return res.status(500).json({ error: error.message });
    }

    // Group by platform
    const platformCounts = data.reduce((acc, share) => {
      acc[share.platform] = (acc[share.platform] || 0) + 1;
      return acc;
    }, {});

    res.json(platformCounts);
  } catch (error) {
    console.error('Error in getSharesByPlatform:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate social media share URLs
exports.getShareUrls = async (req, res) => {
  try {
    const { toolId } = req.params;
    const { toolUrl, toolName, toolDescription } = req.body;

    if (!toolUrl || !toolName) {
      return res.status(400).json({ error: 'Tool URL and name are required' });
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(toolUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(toolUrl)}&text=${encodeURIComponent(toolName)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${toolName} - ${toolUrl}`)}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing via URL
      copyLink: toolUrl
    };

    res.json({ shareUrls });
  } catch (error) {
    console.error('Error in getShareUrls:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get share count for multiple tools
exports.getShareCounts = async (req, res) => {
  try {
    const { toolIds } = req.body; // Array of tool IDs

    if (!Array.isArray(toolIds)) {
      return res.status(400).json({ error: 'toolIds must be an array' });
    }

    const { data, error } = await supabase
      .from('shares')
      .select('tool_id')
      .in('tool_id', toolIds);

    if (error) {
      console.error('Error getting share counts:', error);
      return res.status(500).json({ error: error.message });
    }

    // Count shares per tool
    const shareCounts = {};
    toolIds.forEach(toolId => {
      shareCounts[toolId] = data.filter(share => share.tool_id === toolId).length;
    });

    res.json(shareCounts);
  } catch (error) {
    console.error('Error in getShareCounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all shares for a user
exports.getSharesByUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }
    const { data, error } = await supabase
      .from('shares')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching shares by user:', error);
      return res.status(500).json({ error: error.message });
    }
    res.json({ shares: data || [] });
  } catch (error) {
    console.error('Error in getSharesByUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 