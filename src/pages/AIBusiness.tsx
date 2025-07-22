import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Edit, Layers, Lightbulb, TrendingUp, Users } from 'lucide-react';
import { useBusinessFunctions } from '../hooks/useBusinessFunctions';
import { useTools } from '../hooks/useTools';
import { ToolGrid } from '../components/ToolGrid';
import SEO from '../components/SEO';

const iconMap: Record<string, React.ElementType> = {
  Edit,
  Lightbulb,
  Users,
  TrendingUp,
  BarChart,
  Layers,
};

import { Tool } from '../types/tool';

interface BusinessFunction {
  id: string;
  title: string;
  description: string;
  icon: string;
  adoption_percentage: number;
  trendingTools: { id: string; name: string }[];
  trendingCourses: { id: string; title: string; link: string; image: string }[];
}

interface Course {
    id: string;
    title: string;
    link: string;
    image: string;
}

const ToolCarousel = ({ tools, loading, variant }: { tools: Tool[]; loading: boolean; variant: 'featured' | 'compact'; }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const interval = 5000; // 5 seconds, not 0.5
  const [direction, setDirection] = React.useState<'left' | 'right'>('left');

  React.useEffect(() => {
    if (!tools || tools.length === 0) return;
    const timer = setInterval(() => {
      setDirection('left');
      setCurrentIndex((prev) => (prev + 1) % tools.length);
    }, interval);
    return () => clearInterval(timer);
  }, [tools]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!tools || tools.length === 0) {
    return <div>No tools found.</div>;
  }

  const goTo = (idx: number, dir: 'left' | 'right') => {
    setDirection(dir);
    setCurrentIndex(idx);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full flex items-center justify-center">
        <div className="w-full transition-transform duration-500" style={{ transform: `translateX(0)` }}>
          <ToolGrid tools={[tools[currentIndex]]} loading={false} variant={variant} columns={1} />
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {tools.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx, idx > currentIndex ? 'left' : 'right')}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              idx === currentIndex
                ? 'bg-blue-600 scale-125'
                : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const renderCircularProgress = (percentage: number) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className="text-blue-600 dark:text-blue-400"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        </svg>
        <span className="absolute text-lg font-bold text-gray-900 dark:text-white">{percentage}%</span>
        <span className="absolute text-xs bottom-4 text-muted-foreground">Learned</span>
      </div>
    );
  };

const AIBusiness = () => {
  const { data: businessFunctions, isLoading } = useBusinessFunctions();
  
  if (isLoading) return <div>Loading...</div>;
  if (!businessFunctions) return <div>No business functions found.</div>;

  return (
    <>
      <SEO
        title="AI for Business | AI Territory"
        description="Discover how businesses are using AI across functions like marketing, sales, and operations. Find the best tools and courses to get started."
      />
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            AI Use by <span className="text-blue-600">Business Function</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Here's a comprehensive breakdown of how businesses across industries are using AI—by function and adoption percentage. To help you understand where to start. Explore each category to see real-world applications and discover the best tools and lessons to get you started.
          </p>
        </header>

        <div className="space-y-12">
          {businessFunctions.map((func: BusinessFunction) => {
            const Icon = iconMap[func.icon] || Edit;
            return (
              <article key={func.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{func.title}</h2>
                      <p className="text-gray-700 dark:text-gray-300">{func.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {renderCircularProgress(func.adoption_percentage)}
                  </div>
                </header>
                <section className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Trending Tools:</h3>
                  <div className="flex flex-wrap gap-2">
                    {func.trendingTools.map((tool: { id: string; name: string }, idx: number) => (
                      <span key={tool.id || idx} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full">
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </section>
                <section className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Trending Courses:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {func.trendingCourses.map((course: Course) => (
                      <Link to={course.link} target="_blank" rel="noopener noreferrer" key={course.id} className="block border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group p-0">
                        <div className="relative w-full">
                          <img src={course.image} alt={course.title} className="w-full object-cover" style={{ aspectRatio: '16/9', display: 'block' }} loading="lazy" />
                          <div className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md flex items-center">
                            <span className="mr-1">▶</span> View Course
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {course.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
                <footer className="text-right mt-6">
                  <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-end">
                    Explore Courses <span className="ml-2">→</span>
                  </Link>
                </footer>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default AIBusiness;