const supabase = require('../config/database');

class Tag {
  static async findAll() {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findBySlug(slug) {
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
      .insert(tagData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, tagData) {
    const { data, error } = await supabase
      .from('tags')
      .update(tagData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = Tag;