const supabase = require('../config/database');

const getYouTubeContent = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('id, video_id, title, description, video_type, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getYouTubeContent,
}; 