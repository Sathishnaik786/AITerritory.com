export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  bannerImage: string;
  author: string;
  date: string;
  readTime: number; // in minutes
  category: string;
  tags: string[];
  slug: string;
  featured?: boolean;
  published: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
} 