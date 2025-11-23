import { supabase } from '@/services/supabaseClient';

/**
 * Upload an image file to Supabase storage
 * @param file The image file to upload
 * @returns The public URL of the uploaded image, or null if upload failed
 */
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