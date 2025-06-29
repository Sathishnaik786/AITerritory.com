require('dotenv').config();
const supabase = require('../config/database');

// Static data from AIBusiness.tsx (copy the businessFunctions array here, but use icon as string, e.g., 'Edit', 'Lightbulb', etc.)
const businessFunctions = [
  {
    icon: 'Edit',
    title: 'Writing & Editing',
    description: 'AI-powered writing tools generate content, edit grammar, and even rephrase sentences for better readability.',
    adoptionPercentage: 85,
    trendingTools: ['prompt generators', 'writing generators', 'paraphrasing', 'storyteller', 'copywriting', 'summarizer'],
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
    icon: 'Lightbulb',
    title: 'Design & Creative',
    description: 'AI tools that assist with graphic design, video editing, and content creation, enabling more efficient and innovative creative processes.',
    adoptionPercentage: 83,
    trendingTools: ['cartoon generators', 'portrait generators', 'image generators', 'video enhancer', 'audio editing', 'image editing', 'avatars', 'text to speech', 'music', 'video editing', 'video generators', 'text to image', 'text to video', 'transcriber', '3D'],
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
    icon: 'Users',
    title: 'Customer Service & Support',
    description: 'AI-driven solutions for automated support, personalized customer interactions, and efficient management of inquiries.',
    adoptionPercentage: 70,
    trendingTools: ['chatbots', 'virtual assistants', 'sentiment analysis', 'ticketing systems', 'CRM integration'],
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
    icon: 'TrendingUp',
    title: 'Sales & Marketing',
    description: 'Leverage AI for lead generation, targeted campaigns, content personalization, and sales forecasting to boost revenue.',
    adoptionPercentage: 75,
    trendingTools: ['CRM AI', 'lead scoring', 'content personalization', 'ad optimization', 'sales forecasting'],
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
    icon: 'BarChart',
    title: 'Data & Analytics',
    description: 'Transform raw data into actionable insights with AI-powered analytics, predictive modeling, and business intelligence tools.',
    adoptionPercentage: 88,
    trendingTools: ['predictive analytics', 'BI dashboards', 'data visualization', 'machine learning models'],
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
    icon: 'Layers',
    title: 'Operations & Automation',
    description: 'Automate repetitive tasks, optimize workflows, and improve efficiency across various business operations.',
    adoptionPercentage: 65,
    trendingTools: ['RPA', 'workflow automation', 'supply chain optimization', 'inventory management AI'],
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

async function insertBusinessFunctions() {
  for (const func of businessFunctions) {
    // Insert business function
    const { data: bfData, error: bfError } = await supabase
      .from('business_functions')
      .insert({
        icon: func.icon,
        title: func.title,
        description: func.description,
        adoption_percentage: func.adoptionPercentage,
      })
      .select()
      .single();
    if (bfError) {
      console.error(`Error inserting business function ${func.title}:`, bfError);
      continue;
    }
    const business_function_id = bfData.id;

    // Insert trending tools
    for (const toolName of func.trendingTools) {
      const { error: ttError } = await supabase
        .from('business_trending_tools')
        .insert({
          business_function_id,
          name: toolName,
        });
      if (ttError) {
        console.error(`Error inserting trending tool '${toolName}' for function '${func.title}':`, ttError);
      }
    }

    // Insert trending courses
    for (const course of func.trendingCourses) {
      const { error: tcError } = await supabase
        .from('business_trending_courses')
        .insert({
          business_function_id,
          title: course.title,
          image: course.image,
          link: course.link,
        });
      if (tcError) {
        console.error(`Error inserting trending course '${course.title}' for function '${func.title}':`, tcError);
      }
    }
  }
  console.log('All business functions, trending tools, and courses inserted!');
}

insertBusinessFunctions(); 