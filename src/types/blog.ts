export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  content: string;
  author_name: string;
  tags: string[];
  created_at: string;
  category?: string;
  featured?: boolean;
  reading_time?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
} 