import { supabase } from './supabaseClient';

export async function logBlogEvent({ event_type, blog_id, user_id, platform }: { event_type: string; blog_id: string; user_id?: string; platform?: string }) {
  await supabase.from('blog_events').insert([
    {
      event_type,
      blog_id,
      user_id: user_id || null,
      platform: platform || null,
    },
  ]);
} 