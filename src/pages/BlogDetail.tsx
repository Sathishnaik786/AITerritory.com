import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, Tag } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import { BlogPost } from '../types/blog';
import { NextBlogs } from '../components/NextBlogs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const foundPost = blogPosts.find(p => p.slug === slug);
      setPost(foundPost || null);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 sm:w-1/4 mb-3 sm:mb-4"></div>
            <div className="h-8 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded w-5/6 sm:w-3/4 mb-4 sm:mb-6"></div>
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 sm:w-1/2 mb-6 sm:mb-8"></div>
            <div className="h-64 sm:h-96 bg-gray-200 dark:bg-gray-700 rounded mb-6 sm:mb-8"></div>
            <div className="space-y-3 sm:space-y-4">
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Article Not Found
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Button onClick={() => navigate('/blog')} size="sm" className="text-sm sm:text-base">
              Back to Blog
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Convert markdown-like content to HTML (simple implementation)
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">{line.substring(4)}</h3>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="text-lg font-semibold text-gray-900 dark:text-white my-4">{line.substring(2, line.length - 2)}</p>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="text-gray-700 dark:text-gray-300 my-1">{line.substring(2)}</li>;
        }
        if (line.startsWith('```')) {
          return <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto">{line.substring(3)}</div>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed my-4">{line}</p>;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 scroll-smooth">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-muted-foreground hover:text-gray-900 dark:hover:text-white text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </motion.div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Category and Featured Badge */}
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Badge variant="secondary" className="text-xs sm:text-sm px-2 py-1">
              {post.category}
            </Badge>
            {post.featured && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm px-2 py-1">
                Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Summary */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
            {post.summary}
          </p>

          {/* Author and Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{post.readTime} min read</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
              >
                <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <div className="aspect-[16/9] overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
            <img
              src={post.bannerImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-gray dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl"
        >
          {renderContent(post.content)}
        </motion.div>

        {/* Author Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                    {post.author}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    AI enthusiast and content creator at AI Territory
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </article>

      {/* Recommended Posts */}
      <NextBlogs posts={blogPosts} currentPostId={post.id} />
    </div>
  );
};

export default BlogDetail; 