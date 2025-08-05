import { BlogCard } from '@/components/BlogCard';
import { BlogPost } from '@/types/blog';

export default function BlogCardsGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
} 