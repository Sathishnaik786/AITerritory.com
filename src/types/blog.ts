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
  date?: string; // For compatibility with mock data
  category?: string;
  featured?: boolean;
  reading_time?: string;
  readTime?: number; // For compatibility with mock data
  author_image_url?: string;
  author_bio?: string;
  author_social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  published?: boolean;
  summary?: string; // For compatibility with mock data
  bannerImage?: string; // For compatibility with mock data
  author?: string; // For compatibility with mock data
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}