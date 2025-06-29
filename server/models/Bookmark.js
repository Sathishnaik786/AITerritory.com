const { supabase } = require('../lib/supabase');

const TABLE = 'user_bookmarks';

async function isBookmarked(user_id, tool_id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', user_id)
    .eq('tool_id', tool_id)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

async function addBookmark(user_id, tool_id) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ user_id, tool_id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function removeBookmark(user_id, tool_id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('user_id', user_id)
    .eq('tool_id', tool_id);
  if (error) throw error;
  return true;
}

async function getBookmarksForUser(user_id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('tool_id')
    .eq('user_id', user_id);
  if (error) throw error;
  return data.map(row => row.tool_id);
}

module.exports = {
  isBookmarked,
  addBookmark,
  removeBookmark,
  getBookmarksForUser,
}; 