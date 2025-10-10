export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author?: {
    name?: string;
    avatar?: string;
  };
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  isFree?: boolean;
  price?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  usageInstructions?: string;
  bestPractices?: string;
  compatibleModels?: string[];
  image?: string;
}