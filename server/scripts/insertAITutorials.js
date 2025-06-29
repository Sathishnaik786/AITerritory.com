require('dotenv').config();
const supabase = require('../config/database');

const featuredTutorials = [
  {
    title: "ChatGPT Tutorial: How to Use ChatGPT for Beginners",
    description: "Complete guide to using ChatGPT effectively for various tasks.",
    image: "https://openai.com/content/images/2023/11/chatgpt.png",
    duration: "45 min",
    level: "Beginner",
    link: "https://www.youtube.com/watch?v=JTxsNm9IdYU"
  },
  {
    title: "ChatGPT Advanced Tutorial: 10x Your Productivity",
    description: "Learn advanced ChatGPT techniques to boost your productivity.",
    image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
    duration: "2 hours",
    level: "Intermediate",
    link: "https://youtu.be/HGDxu3kPErs"
  },
  {
    title: "ChatGPT Prompt Engineering Masterclass",
    description: "Master the art of crafting effective prompts for ChatGPT.",
    image: "https://openai.com/content/images/2023/11/gpt-4.png",
    duration: "1.5 hours",
    level: "Advanced",
    link: "https://youtu.be/5i2Hn8OG94o"
  }
];

const latestTutorials = [
  {
    title: "ChatGPT for Business: Complete Guide",
    description: "Learn how to use ChatGPT to grow your business and increase productivity.",
    image: "https://openai.com/content/images/2023/11/gpt-4.png",
    duration: "1 hour",
    level: "Intermediate",
    link: "https://www.youtube.com/watch?v=jCoH82LPgdk"
  },
  {
    title: "ChatGPT for Developers: Code Generation",
    description: "Master ChatGPT for coding, debugging, and software development.",
    image: "https://openai.com/content/images/2023/11/dall-e-3.png",
    duration: "1.5 hours",
    level: "Advanced",
    link: "https://youtu.be/Ndu21YMD8Jg"
  }
];

const learningPaths = [
  {
    title: "ChatGPT Fundamentals",
    description: "Learn the essential concepts and best practices of using ChatGPT.",
    image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
    courses: [
      {
        title: "ChatGPT Basics",
        description: "Getting started with ChatGPT",
        image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
        duration: "30 min",
        level: "Beginner",
        link: "https://www.youtube.com/watch?v=JTxsNm9IdYU"
      },
      {
        title: "ChatGPT for Content Creation",
        description: "Using ChatGPT for writing and content",
        image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
        duration: "45 min",
        level: "Beginner",
        link: "https://youtu.be/BtSD3vf6NEg"
      }
    ]
  },
  {
    title: "Advanced ChatGPT",
    description: "Master advanced ChatGPT techniques and applications.",
    image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
    courses: [
      {
        title: "ChatGPT API Integration",
        description: "Integrate ChatGPT into your applications",
        image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
        duration: "1 hour",
        level: "Intermediate",
        link: "https://youtu.be/V_-O81YEVyw"
      },
      {
        title: "ChatGPT for Data Analysis",
        description: "Using ChatGPT for data processing and analysis",
        image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
        duration: "1.5 hours",
        level: "Advanced",
        link: "https://www.youtube.com/watch?v=jCoH82LPgdk"
      }
    ]
  },
  {
    title: "ChatGPT Business Applications",
    description: "Apply ChatGPT to solve real-world business problems.",
    image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
    courses: [
      {
        title: "ChatGPT for Marketing",
        description: "Using ChatGPT for marketing and sales",
        image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
        duration: "1 hour",
        level: "Intermediate",
        link: "https://www.youtube.com/watch?v=JTxsNm9IdYU"
      },
      {
        title: "ChatGPT for Customer Service",
        description: "Implementing ChatGPT in customer support",
        image: "https://www.python.org/static/community_logos/python-logo-generic.svg",
        duration: "45 min",
        level: "Beginner",
        link: "https://youtu.be/XSH4jQWHsDQ"
      }
    ]
  }
];

async function insertAITutorials() {
  // Insert featured tutorials
  for (const tutorial of featuredTutorials) {
    const { error } = await supabase.from('ai_tutorials').insert({
      type: 'featured',
      title: tutorial.title,
      description: tutorial.description,
      image: tutorial.image,
      duration: tutorial.duration,
      level: tutorial.level,
      link: tutorial.link,
    });
    if (error) {
      console.error(`Error inserting featured tutorial ${tutorial.title}:`, JSON.stringify(error, null, 2));
    }
  }
  // Insert latest tutorials
  for (const tutorial of latestTutorials) {
    const { error } = await supabase.from('ai_tutorials').insert({
      type: 'latest',
      title: tutorial.title,
      description: tutorial.description,
      image: tutorial.image,
      duration: tutorial.duration,
      level: tutorial.level,
      link: tutorial.link,
    });
    if (error) {
      console.error(`Error inserting latest tutorial ${tutorial.title}:`, JSON.stringify(error, null, 2));
    }
  }
  // Insert learning paths and their courses
  for (const path of learningPaths) {
    const { data: pathData, error: pathError } = await supabase.from('ai_learning_paths').insert({
      title: path.title,
      description: path.description,
      image: path.image,
    }).select().single();
    if (pathError) {
      console.error(`Error inserting learning path ${path.title}:`, JSON.stringify(pathError, null, 2));
      continue;
    }
    const learning_path_id = pathData.id;
    for (const course of path.courses) {
      const { error: courseError } = await supabase.from('ai_learning_path_courses').insert({
        learning_path_id,
        title: course.title,
        description: course.description,
        image: course.image,
        duration: course.duration,
        level: course.level,
        link: course.link,
      });
      if (courseError) {
        console.error(`Error inserting course ${course.title} for path ${path.title}:`, JSON.stringify(courseError, null, 2));
      }
    }
  }
  console.log('All AI tutorials, learning paths, and courses inserted!');
}

insertAITutorials(); 