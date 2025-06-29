require('dotenv').config();
const supabase = require('../config/database');

const featuredAgents = [
  {
    title: "AutoGPT",
    description: "An experimental open-source attempt to make GPT-4 fully autonomous.",
    image: "https://aial-prod.s3.eu-central-1.amazonaws.com/agents/autogpt.webp",
    link: "https://github.com/Significant-Gravitas/AutoGPT",
    category: "Autonomous AI",
    stars: "45k+"
  },
  {
    title: "BabyAGI",
    description: "An AI agent that can perform tasks and learn from its experiences.",
    image: "https://avatars.githubusercontent.com/u/1701418?v=4https://miro.medium.com/v2/resize:fit:1400/1*_8jJgQZQZQZQZQZQZQZQZQ.png",
    link: "https://github.com/yoheinakajima/babyagi",
    category: "Task Management",
    stars: "15k+"
  },
  {
    title: "GPT Engineer",
    description: "An AI agent that can build entire codebases from a single prompt.",
    image: "https://miro.medium.com/v2/resize:fit:1200/1*TM90Cemr3ID-mIfE1VK3XA.jpeg",
    link: "https://github.com/AntonOsika/gpt-engineer",
    category: "Development",
    stars: "25k+"
  }
];

const popularAgents = [
  {
    title: "LangChain",
    description: "Framework for developing applications powered by language models.",
    image: "https://cdn.analyticsvidhya.com/wp-content/uploads/2024/11/Retrievers-in-LangChain.webp",
    link: "https://github.com/langchain-ai/langchain",
    category: "Framework"
  },
  {
    title: "AgentGPT",
    description: "Assemble, configure, and deploy autonomous AI agents in your browser.",
    image: "https://agentgpt.io/wp-content/uploads/2023/08/thumbnile.png",
    link: "https://github.com/reworkd/AgentGPT",
    category: "Browser-based"
  },
  {
    title: "SuperAGI",
    description: "Build, manage, and run useful autonomous AI agents.",
    image: "https://media.licdn.com/dms/image/v2/D5612AQFya9xiWHvlpw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1684838144152?e=2147483647&v=beta&t=5MJwMIwsz_Cq2roqnrwFln6-FmL0uZ0dcbSGdtSfKWQ",
    link: "https://github.com/TransformerOptimus/SuperAGI",
    category: "Framework"
  }
];

async function insertAIAgents() {
  for (const agent of featuredAgents) {
    const { error } = await supabase.from('ai_agents').insert({
      type: 'featured',
      title: agent.title,
      description: agent.description,
      image: agent.image,
      link: agent.link,
      category: agent.category,
      stars: agent.stars || null,
    });
    if (error) {
      console.error(`Error inserting featured agent ${agent.title}:`, error);
    }
  }
  for (const agent of popularAgents) {
    const { error } = await supabase.from('ai_agents').insert({
      type: 'popular',
      title: agent.title,
      description: agent.description,
      image: agent.image,
      link: agent.link,
      category: agent.category,
      stars: agent.stars || null,
    });
    if (error) {
      console.error(`Error inserting popular agent ${agent.title}:`, error);
    }
  }
  console.log('All AI agents inserted!');
}

insertAIAgents(); 