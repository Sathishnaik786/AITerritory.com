const supabase = require('../config/database');

class Tool {
  static async findAll(filters = {}) {
    let query = supabase
      .from('tools')
      .select(`
        *,
        categories(id, name, slug),
        tool_tags(tags(id, name, slug))
      `);

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.is_featured) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters.is_trending) {
      query = query.eq('is_trending', filters.is_trending);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.search) {
      query = query.textSearch('name,description', filters.search);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories(id, name, slug),
        tool_tags(tags(id, name, slug)),
        sub_tools(*),
        reviews(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(toolData) {
    const { data, error } = await supabase
      .from('tools')
      .insert(toolData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, toolData) {
    const { data, error } = await supabase
      .from('tools')
      .update(toolData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = Tool;