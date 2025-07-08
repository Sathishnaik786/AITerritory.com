import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogService } from '../services/blogService';
import { BlogPost } from '../types/blog';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setNotFound(false);
      BlogService.getBySlug(slug)
        .then(data => {
          setBlog(data);
          setNotFound(false);
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            setNotFound(true);
          }
          setBlog(null);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (notFound) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-2xl font-bold mb-4">Blog not found</div>
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={() => navigate('/blog')}
      >
        Back to Blog List
      </button>
    </div>
  );
  if (!blog) return <div className="py-12 text-center">Not found</div>;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 scroll-smooth overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
        <img src={blog.cover_image_url} alt={blog.title} className="w-full rounded mb-4" />
        <div className="mb-4 text-muted-foreground">By {blog.author_name} | {new Date(blog.created_at).toLocaleDateString()}</div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div>
  );
};

export default BlogDetail; 