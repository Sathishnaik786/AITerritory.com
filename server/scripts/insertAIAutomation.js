require('dotenv').config();
const supabase = require('../config/database');

const automationTools = [
  {
    title: "Zapier AI",
    description: "Automate workflows with AI-powered integrations.",
    image: "https://logowik.com/content/uploads/images/zapier2402.jpg",
    link: "https://zapier.com/ai",
    category: "Workflow Automation"
  },
  {
    title: "Make.com",
    description: "Create powerful automation workflows with AI assistance.",
    image: "https://play-lh.googleusercontent.com/LnfwvB-MMikpcp3KGMueSJZdrNXtB8ibIJSmeF7fNDD7w5E7QCX68MsMgyH4_B8He335=h500",
    link: "https://www.make.com/en/ai",
    category: "Integration Platform"
  },
  {
    title: "n8n",
    description: "Open-source workflow automation with AI capabilities.",
    image: "https://images.opencollective.com/n8n/40721f5/logo/256.png",
    link: "https://n8n.io/ai",
    category: "Open Source"
  }
];

const useCases = [
  {
    title: "Customer Service",
    description: "Automate support with AI chatbots and ticket routing.",
    image: "https://cdn.zapier.com/zapier/images/logos/zapier-logo.png",
    link: "https://youtu.be/_3-ZOKKo7II",
    duration: "45 min",
    level: "Beginner"
  },
  {
    title: "Data Processing",
    description: "Automate data extraction, cleaning, and analysis tasks.",
    image: "https://www.make.com/en/images/make-logo.svg",
    link: "https://youtu.be/swp1QJZQzEw",
    duration: "1 hour",
    level: "Intermediate"
  },
  {
    title: "Business Operations",
    description: "Streamline business processes with AI automation.",
    image: "https://n8n.io/images/n8n-logo.svg",
    link: "https://youtu.be/r0c7RhMFcww",
    duration: "1.5 hours",
    level: "Advanced"
  }
];

const implementationGuides = [
  {
    title: "Getting Started with AI Automation",
    description: "Learn the basics of implementing AI automation in your workflow",
    video_link: "https://youtu.be/2GZ2SNXWK-c"
  },
  {
    title: "Best Practices for AI Automation",
    description: "Tips and tricks for successful AI automation implementation",
    video_link: "https://youtu.be/ZHH3sr234zY"
  }
];

async function insertAIAutomation() {
  // Insert automation tools
  for (const tool of automationTools) {
    const { error } = await supabase.from('ai_automation_tools').insert(tool);
    if (error) {
      console.error(`Error inserting automation tool ${tool.title}:`, JSON.stringify(error, null, 2));
    }
  }
  // Insert use cases
  for (const useCase of useCases) {
    const { error } = await supabase.from('ai_automation_use_cases').insert(useCase);
    if (error) {
      console.error(`Error inserting use case ${useCase.title}:`, JSON.stringify(error, null, 2));
    }
  }
  // Insert implementation guides
  for (const guide of implementationGuides) {
    const { error } = await supabase.from('ai_automation_guides').insert(guide);
    if (error) {
      console.error(`Error inserting guide ${guide.title}:`, JSON.stringify(error, null, 2));
    }
  }
  console.log('All AI automation tools, use cases, and guides inserted!');
}

insertAIAutomation(); 