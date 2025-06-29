export interface Tool {
  id: string;
  name: string;
  description: string;
  category_id?: string;
  company?: string;
  link: string;
  image_url?: string;
  icon?: string;
  status: string;
  release_date?: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_trending: boolean;
  pricing_type: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  categories?: Category;
  tool_tags?: ToolTag[];
  sub_tools?: SubTool[];
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ToolTag {
  id: string;
  tool_id: string;
  tag_id: string;
  created_at: string;
  tags?: Tag;
}

export interface SubTool {
  id: string;
  parent_tool_id: string;
  name: string;
  description?: string;
  link?: string;
  created_at: string;
}

export interface Review {
  id: string;
  tool_id: string;
  user_id?: string;
  rating: number;
  comment?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}