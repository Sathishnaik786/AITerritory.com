const supabase = require('../config/database');

class Category {
  static async findAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = Category;