import { supabase } from '../config/database.js';

export class Tool {
  static async getAll(filters = {}) {
    let query = supabase
      .from('tools')
      .select(`
        *,
        categories(name, slug),
        tool_tags(tags(name, slug)),
        sub_tools(*)
      `);

    // Apply filters
    if (filters.category) {
      query = query.eq('categories.slug', filters.category);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.featured) {
      query = query.eq('is_featured', true);
    }

    if (filters.trending) {
      query = query.eq('is_trending', true);
    }

    if (filters.search) {
      query = query.textSearch('name,description', filters.search);
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.in('tool_tags.tags.slug', filters.tags);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  static async getById(id) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories(name, slug),
        tool_tags(tags(name, slug)),
        sub_tools(*),
        reviews(rating, comment, created_at)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async create(toolData) {
    const { data, error } = await supabase
      .from('tools')
      .insert([toolData])
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

  static async search(query, filters = {}) {
    let searchQuery = supabase
      .from('tools')
      .select(`
        *,
        categories(name, slug),
        tool_tags(tags(name, slug))
      `)
      .textSearch('name,description', query);

    // Apply additional filters
    if (filters.category) {
      searchQuery = searchQuery.eq('categories.slug', filters.category);
    }

    if (filters.minRating) {
      searchQuery = searchQuery.gte('rating', filters.minRating);
    }

    const { data, error } = await searchQuery.limit(filters.limit || 20);

    if (error) throw error;
    return data;
  }

  static async getFeatured(limit = 6) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories(name, slug),
        tool_tags(tags(name, slug))
      `)
      .eq('is_featured', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async getTrending(limit = 10) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories(name, slug),
        tool_tags(tags(name, slug))
      `)
      .eq('is_trending', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async getByCategory(categorySlug, limit = 20) {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories!inner(name, slug),
        tool_tags(tags(name, slug))
      `)
      .eq('categories.slug', categorySlug)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async addTags(toolId, tagIds) {
    const toolTags = tagIds.map(tagId => ({
      tool_id: toolId,
      tag_id: tagId
    }));

    const { data, error } = await supabase
      .from('tool_tags')
      .insert(toolTags)
      .select();

    if (error) throw error;
    return data;
  }

  static async removeTags(toolId, tagIds) {
    const { error } = await supabase
      .from('tool_tags')
      .delete()
      .eq('tool_id', toolId)
      .in('tag_id', tagIds);

    if (error) throw error;
    return true;
  }
}