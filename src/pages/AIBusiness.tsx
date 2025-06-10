import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Edit, Layers, Lightbulb, TrendingUp, Users } from 'lucide-react';

interface BusinessFunction {
  id: string;
  icon: React.ElementType; // Icon component from lucide-react
  title: string;
  description: string;
  trendingTools: string[];
  adoptionPercentage: number;
  trendingCourses: {
    title: string;
    image: string;
    link: string;
  }[];
}

const businessFunctions: BusinessFunction[] = [
  {
    id: 'writing-editing',
    icon: Edit,
    title: 'Writing & Editing',
    description: 'AI-powered writing tools generate content, edit grammar, and even rephrase sentences for better readability.',
    trendingTools: ['prompt generators', 'writing generators', 'paraphrasing', 'storyteller', 'copywriting', 'summarizer'],
    adoptionPercentage: 85,
    trendingCourses: [
      {
        title: 'AI For SEO Content Creation',
        image: 'https://cdn2.futurepedia.io/2025-02-15T10-44-50.736Z-K3_G00oOPySf5oczvcyYuYECBE-VOD9p4.jpg?w=384',
        link: 'https://www.coursera.org/projects/ai-content-creation-with-dall-e-visual-seo-strategy--',
      },
      {
        title: 'Google NotebookLM Course',
        image: 'https://cdn2.futurepedia.io/2025-02-15T10-45-23.356Z-2_Yd_oQLaRu5YKYsHEL5f1udAkPjiOpGC.jpg?w=384',
        link: 'https://notebooklm.google/',
      },
      {
        title: 'Notion AI: From Beginner to Expert',
        image: 'https://cdn2.futurepedia.io/2025-02-15T10-46-27.936Z-dh-czj_iy5Itb9upF4b9Fk-C209iabVMn.jpg?w=384',
        link: 'https://www.coursera.org/projects/notionai-for-beginners-design-a-product-launch',
      },
    ],
  },
  {
    id: 'design-creative',
    icon: Lightbulb,
    title: 'Design & Creative',
    description: 'AI tools that assist with graphic design, video editing, and content creation, enabling more efficient and innovative creative processes.',
    trendingTools: ['cartoon generators', 'portrait generators', 'image generators', 'video enhancer', 'audio editing', 'image editing', 'avatars', 'text to speech', 'music', 'video editing', 'video generators', 'text to image', 'text to video', 'transcriber', '3D'],
    adoptionPercentage: 83,
    trendingCourses: [
      {
        title: 'AI-Powered Design for Entrepreneurs',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-38-19.949Z-acD-Hhgrj83HBVPnjypTOb9oU6TwnE00y.jpg?w=384',
        link: 'https://www.andrewmiles.com/resources/ai-powered-design-for-entrepreneurs/',
      },
      {
        title: 'Canva Magic Studio: Mastering AI-Driven Design',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-38-56.269Z-cfyYWCANAVc52BE53Q-HDGPlXpM61cFhI.jpg?w=384',
        link: 'https://skillleap.viralai.com/courses/canva-magic-studio',
      },
      {
        title: 'Mastering Midjourney',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-39-18.171Z-4Cme7AMuPB2qbdVTCX_txoHWhw5FkOpsH.jpg?w=384',
        link: 'https://skillleap.viralai.com/courses/midjourney-mastery',
      },
    ],
  },
  {
    id: 'customer-service-support',
    icon: Users,
    title: 'Customer Service & Support',
    description: 'AI-driven solutions for automated support, personalized customer interactions, and efficient management of inquiries.',
    trendingTools: ['chatbots', 'virtual assistants', 'sentiment analysis', 'ticketing systems', 'CRM integration'],
    adoptionPercentage: 70,
    trendingCourses: [
      {
        title: 'AI in Customer Support Excellence',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-42-51.291Z-FxyxxHNxjt3_8hx_D-rY7NQTjIP4NmKYh.jpg?w=384',
        link: 'https://stock.adobe.com/search?k=artificial+intelligence+customer+service',
      },
      {
        title: 'Building Smart Chatbots',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-43-33.191Z-XHV6COGEsd3d_6ii0hqBzgXkeIXd18ch3.jpg?w=384',
        link: 'https://www.coursera.org/learn/building-ai-powered-chatbots',
      },
      {
        title: 'Personalizing Customer Experience with AI',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-43-58.068Z-MrIxE1wkTBwj8E3raFw6lf4xx0ZQ6hm5G.jpg?w=384',
        link: '#',
      },
    ],
  },
  {
    id: 'sales-marketing',
    icon: TrendingUp,
    title: 'Sales & Marketing',
    description: 'Leverage AI for lead generation, targeted campaigns, content personalization, and sales forecasting to boost revenue.',
    trendingTools: ['CRM AI', 'lead scoring', 'content personalization', 'ad optimization', 'sales forecasting'],
    adoptionPercentage: 75,
    trendingCourses: [
      {
        title: 'AI for Digital Marketing',
        image: 'https://cdn2.futurepedia.io/2025-02-15T10-44-50.736Z-K3_G00oOPySf5oczvcyYuYECBE-VOD9p4.jpg?w=384',
        link: '#',
      },
      {
        title: 'AI-Driven Sales Strategies',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-48-05.752Z-HDRPKJk8fc_SmHXcPqC30GVzrMXVdx6jT.jpg?w=384',
        link: '#',
      },
      {
        title: 'Content Personalization with AI',
        image: 'https://cdn2.futurepedia.io/2025-02-15T11-48-37.570Z-IhCEyPLC8GdhhwfXw06m6HxYZPogWz7gw.jpg?w=384',
        link: '#',
      },
    ],
  },
  {
    id: 'data-analytics',
    icon: BarChart,
    title: 'Data & Analytics',
    description: 'Transform raw data into actionable insights with AI-powered analytics, predictive modeling, and business intelligence tools.',
    trendingTools: ['predictive analytics', 'BI dashboards', 'data visualization', 'machine learning models'],
    adoptionPercentage: 88,
    trendingCourses: [
      {
        title: 'Advanced AI for Data Scientists',
        image: 'https://datascience.one/wp-content/uploads/2024/07/aiappliedds_webst-1-e1724162040957-760x424.png',
        link: '#',
      },
      {
        title: 'Business Intelligence with AI',
        image: 'https://s3.amazonaws.com/coursera_assets/meta_images/generated/XDP/XDP~COURSE!~generative-ai-elevate-your-business-intelligence-career/XDP~COURSE!~generative-ai-elevate-your-business-intelligence-career.jpeg',
        link: '#',
      },
      {
        title: 'Mastering Predictive Analytics',
        image: 'https://verpex.com/assets/uploads/images/blog/Predictive-Analytics.webp?v=1716204292',
        link: '#',
      },
    ],
  },
  {
    id: 'operations-automation',
    icon: Layers,
    title: 'Operations & Automation',
    description: 'Automate repetitive tasks, optimize workflows, and improve efficiency across various business operations.',
    trendingTools: ['RPA', 'workflow automation', 'supply chain optimization', 'inventory management AI'],
    adoptionPercentage: 65,
    trendingCourses: [
      {
        title: 'Robotic Process Automation (RPA) Course',
        image: 'https://i.ytimg.com/vi/n6nxTBB16ag/maxresdefault.jpg',
        link: '#',
      },
      {
        title: 'AI for Supply Chain Management',
        image: 'https://images.contentstack.io/v3/assets/blt71da4c740e00faaa/bltcf88e1de0e5df61b/6517514662df44a29d6da4af/EXX-Blog-ai-in-use-SPM-1.jpg?format=webp',
        link: '#',
      },
      {
        title: 'Optimizing Operations with AI',
        image: 'https://media.geeksforgeeks.org/wp-content/uploads/20250218120526240224/What-is--Artificial--Intelligence-optimization.webp',
        link: '#',
      },
    ],
  },
];

const AIBusiness = () => {
  const renderCircularProgress = (percentage: number) => {
    const radius = 40; // Adjusted for the smaller size
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          AI Use by <span className="text-blue-600">Business Function</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Here's a comprehensive breakdown of how businesses across industries are using AI—by function and adoption percentage. To help you understand where to start. Explore each category to see real-world applications and discover the best tools and lessons to get you started.
        </p>
      </div>

      <div className="space-y-12">
        {businessFunctions.map((func) => (
          <div key={func.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                  <func.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{func.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300">{func.description}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {renderCircularProgress(func.adoptionPercentage)}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Trending Tools:</h3>
              <div className="flex flex-wrap gap-2">
                {func.trendingTools.map((tool, idx) => (
                  <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Trending Courses:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {func.trendingCourses.map((course, courseIndex) => (
                  <a href={course.link} target="_blank" rel="noopener noreferrer" key={courseIndex} className="block border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                    <img src={course.image} alt={course.title} className="w-full h-50 object-cover" style={{ width: '360px', height: '200px' }} />
                    <div className="p-4">
                      <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {course.title}
                      </h4>
                    </div>
                    <Link to={course.link} className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-md flex items-center">
                      <span className="mr-1">▶</span> View Course
                    </Link>
                  </a>
                ))}
              </div>
            </div>

            <div className="text-right mt-6">
              <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-end">
                Explore Courses <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIBusiness; 