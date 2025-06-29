const supabase = require('../config/database');

class Tool {
  static async findAll(filters = {}) {
    console.log('Tool.findAll filters:', filters);
    let query;
    
    // Always include the tool_tags relationship for tag filtering
    query = supabase
      .from('tools')
      .select(`*, categories(id, name, slug), tool_tags(tags(id, name, slug))`);

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
      query = query.ilike('name', `%${filters.search}%`);
    }

    // Fix tag filtering to use the proper many-to-many relationship
    if (filters.tag) {
      // First, find the tag ID by name or slug
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .select('id')
        .or(`name.eq.${filters.tag},slug.eq.${filters.tag}`)
        .single();
      
      if (tagError) {
        console.error('Tag not found:', filters.tag);
        return { tools: [], totalPages: 1 };
      }
      
      // Then filter tools that have this tag
      const { data: toolTagData, error: toolTagError } = await supabase
        .from('tool_tags')
        .select('tool_id')
        .eq('tag_id', tagData.id);
      
      if (toolTagError) {
        console.error('Error finding tools with tag:', toolTagError);
        return { tools: [], totalPages: 1 };
      }
      
      const toolIds = toolTagData.map(tt => tt.tool_id);
      if (toolIds.length === 0) {
        return { tools: [], totalPages: 1 };
      }
      
      query = query.in('id', toolIds);
    }

    if (filters.pricing_type) {
      query = query.eq('pricing_type', filters.pricing_type);
    }

    if (filters.min_rating) {
      query = query.gte('rating', filters.min_rating);
    }

    // Pagination
    let rangeFrom, rangeTo;
    if (filters.page && filters.pageSize) {
      const page = parseInt(filters.page, 10) || 1;
      const pageSize = parseInt(filters.pageSize, 10) || 12;
      rangeFrom = (page - 1) * pageSize;
      rangeTo = rangeFrom + pageSize - 1;
      query = query.range(rangeFrom, rangeTo);
    }

    // Sorting
    let orderBy = { column: 'created_at', ascending: false };
    if (filters.sort === 'highest_rating') {
      orderBy = { column: 'rating', ascending: false };
    } else if (filters.sort === 'most_reviewed') {
      orderBy = { column: 'review_count', ascending: false };
    }

    const { data, error, count } = await query.order(orderBy.column, { ascending: orderBy.ascending }).select('*', { count: 'exact' });

    if (error) throw error;
    let totalPages = 1;
    if (filters.pageSize && count !== null && count !== undefined) {
      totalPages = Math.ceil(count / parseInt(filters.pageSize, 10));
      return { tools: data, totalPages };
    }
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

  static async updateRatingAndCount(id, avg, count) {
    const { data, error } = await supabase
      .from('tools')
      .update({ rating: avg, review_count: count })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = Tool;