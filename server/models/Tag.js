import { supabase } from '../config/database.js';

export class Tag {
  static async getAll() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getBySlug(slug) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(tagData) {
    const { data, error } = await supabase
      .from('tags')
      .insert([tagData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findOrCreate(tagName) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-');
    
    // Try to find existing tag
    let { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code === 'PGRST116') {
      // Tag doesn't exist, create it
      const { data: newTag, error: createError } = await supabase
        .from('tags')
        .insert([{ name: tagName, slug }])
        .select()
        .single();

      if (createError) throw createError;
      return newTag;
    }

    if (error) throw error;
    return data;
  }

  static async getPopular(limit = 20) {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        *,
        tool_tags(count)
      `)
      .order('tool_tags.count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}