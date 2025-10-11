import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  console.warn('For development, you can add them to your .env file:');
  console.warn('VITE_SUPABASE_URL=your_supabase_url');
  console.warn('VITE_SUPABASE_ANON_KEY=your_anon_key');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key'
);

// Image upload utility function
export const uploadImageToSupabase = async (file: File) => {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`public/${fileName}`, file);

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("images")
      .getPublicUrl(`public/${fileName}`);

    return publicUrl.publicUrl;
  } catch (err) {
    console.error("Supabase upload error:", err.message);
    return null;
  }
};