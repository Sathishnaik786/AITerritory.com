export interface Tool {
  id: number;
  name: string;
  category: string;
  description: string;
  icon?: string;
  link: string;
  status?: string;
  releaseDate?: string;
  tags?: string[];
  image?: string;
  company?: string;
  subTools?: {
    name: string;
    description: string;
    link: string;
  }[];
}

export const toolsData: Tool[] = [
  // Google AI Tools
  {
    id: 1,
    name: "Gemini",
    category: "AI Language Models",
    description: "Google's most capable AI model, capable of understanding and generating text, code, and images. Features multimodal capabilities and advanced reasoning.",
    icon: "🤖",
    link: "https://gemini.google.com",
    status: "Released",
    releaseDate: "2024-02",
    company: "Google",
    image: "https://static.vecteezy.com/system/resources/previews/055/687/055/non_2x/rectangle-gemini-google-icon-symbol-logo-free-png.png",
    tags: ["AI", "Language Model", "Multimodal"],
    subTools: [
      {
        name: "Gemini Pro",
        description: "Advanced language model for complex tasks and reasoning",
        link: "https://gemini.google.com/pro"
      },
      {
        name: "Gemini Ultra",
        description: "Most capable model for highly complex tasks",
        link: "https://gemini.google.com/ultra"
      }
    ]
  },
  {
    id: 2,
    name: "Google AI Studio",
    category: "AI Development",
    description: "Comprehensive platform for building and deploying AI applications with Google's latest models and tools.",
    icon: "⚡",
    link: "https://ai.google.dev",
    status: "Released",
    releaseDate: "2023-12",
    company: "Google",
    image: "https://ai.google.dev/static/site-assets/images/share.png",
    tags: ["Development", "AI Platform", "API"],
    subTools: [
      {
        name: "Vertex AI",
        description: "Managed ML platform for building and deploying models",
        link: "https://cloud.google.com/vertex-ai"
      },
      {
        name: "PaLM API",
        description: "Access to Google's large language models",
        link: "https://ai.google.dev/api"
      }
    ]
  },

  // Microsoft AI Tools
  {
    id: 3,
    name: "Copilot",
    category: "AI Assistants",
    description: "Microsoft's AI-powered coding assistant that helps developers write better code faster. Integrated with Visual Studio and GitHub.",
    icon: "👨‍💻",
    link: "https://github.com/features/copilot",
    status: "Released",
    releaseDate: "2023-11",
    company: "Microsoft",
    image: "https://static.vecteezy.com/system/resources/previews/046/861/635/non_2x/copilot-icon-transparent-background-free-png.png",
    tags: ["Coding", "AI Assistant", "Development"],
    subTools: [
      {
        name: "GitHub Copilot",
        description: "AI pair programmer for code completion",
        link: "https://github.com/features/copilot"
      },
      {
        name: "Copilot Chat",
        description: "Interactive AI chat for coding assistance",
        link: "https://github.com/features/copilot/chat"
      }
    ]
  },
  {
    id: 4,
    name: "Azure AI",
    category: "Cloud AI Services",
    description: "Microsoft's comprehensive suite of AI services on Azure, including machine learning, cognitive services, and AI infrastructure.",
    icon: "☁️",
    link: "https://azure.microsoft.com/services/cognitive-services",
    status: "Released",
    releaseDate: "2023-10",
    company: "Microsoft",
    image: "https://azure.microsoft.com/svghandler/cognitive-services",
    tags: ["Cloud", "AI Services", "Enterprise"],
    subTools: [
      {
        name: "Azure OpenAI Service",
        description: "Access to OpenAI models on Azure",
        link: "https://azure.microsoft.com/services/openai"
      },
      {
        name: "Azure Machine Learning",
        description: "End-to-end ML platform",
        link: "https://azure.microsoft.com/services/machine-learning"
      }
    ]
  },

  // NVIDIA AI Tools
  {
    id: 5,
    name: "NVIDIA AI Enterprise",
    category: "Enterprise AI",
    description: "End-to-end AI platform for enterprises, featuring optimized frameworks, tools, and support for AI development and deployment.",
    icon: "🚀",
    link: "https://www.nvidia.com/en-us/ai-data-science/ai-enterprise",
    status: "Released",
    releaseDate: "2023-09",
    company: "NVIDIA",
    image: "https://i.pinimg.com/736x/93/7e/c3/937ec3640a2c82348a1cdb28211c3a56.jpg",
    tags: ["Enterprise", "AI Platform", "GPU"],
    subTools: [
      {
        name: "NVIDIA NeMo",
        description: "Framework for conversational AI",
        link: "https://developer.nvidia.com/nemo"
      },
      {
        name: "NVIDIA TAO",
        description: "Transfer learning toolkit",
        link: "https://developer.nvidia.com/tao-toolkit"
      }
    ]
  },
  {
    id: 6,
    name: "NVIDIA Omniverse",
    category: "3D & Simulation",
    description: "Real-time 3D design collaboration and simulation platform powered by NVIDIA's AI and graphics technologies.",
    icon: "🎮",
    link: "https://www.nvidia.com/en-us/omniverse",
    status: "Released",
    releaseDate: "2023-08",
    company: "NVIDIA",
    image: "https://lh5.googleusercontent.com/gjpebnnq0HqmZB25NleLdKvmv2wO3HIOL4z_GrZdoGtIp-ZUx9iTLX3I22sMKlTUEqlZvm6BNrNBFnW4vD0y7ymktuvcwvb7BuNVyUjyrDcgeY9m8T9keNk6zR1YGu4-mtda2bJa",
    tags: ["3D", "Simulation", "Collaboration"],
    subTools: [
      {
        name: "Omniverse Create",
        description: "3D design and simulation tool",
        link: "https://www.nvidia.com/en-us/omniverse/create"
      },
      {
        name: "Omniverse Replicator",
        description: "Synthetic data generation",
        link: "https://developer.nvidia.com/omniverse-replicator"
      }
    ]
  },

  // OpenAI Tools
  {
    id: 7,
    name: "ChatGPT",
    category: "AI Language Models",
    description: "Advanced conversational AI model capable of understanding and generating human-like text across various domains and tasks.",
    icon: "💬",
    link: "https://chat.openai.com",
    status: "Released",
    releaseDate: "2023-11",
    company: "OpenAI",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    tags: ["AI", "Chatbot", "Language Model"],
    subTools: [
      {
        name: "GPT-4",
        description: "Most advanced language model",
        link: "https://openai.com/gpt-4"
      },
      {
        name: "GPT-3.5",
        description: "Fast and efficient language model",
        link: "https://openai.com/gpt-3.5"
      }
    ]
  },
  {
    id: 8,
    name: "DALL·E",
    category: "AI Image Generation",
    description: "AI system that creates realistic images and art from natural language descriptions, with advanced capabilities for image editing and variation.",
    icon: "🎨",
    link: "https://openai.com/dall-e-3",
    status: "Released",
    releaseDate: "2023-10",
    company: "OpenAI",
    image: "https://ih1.redbubble.net/image.4930945508.5459/fposter,small,wall_texture,square_product,600x600.jpg",
    tags: ["AI Art", "Image Generation", "Creative"],
    subTools: [
      {
        name: "DALL·E 3",
        description: "Latest image generation model",
        link: "https://openai.com/dall-e-3"
      },
      {
        name: "DALL·E API",
        description: "API for image generation",
        link: "https://platform.openai.com/docs/guides/images"
      }
    ]
  },

  // Anthropic Tools
  {
    id: 9,
    name: "Claude",
    category: "AI Language Models",
    description: "Advanced AI assistant focused on helpful, harmless, and honest interactions, with strong capabilities in analysis and writing.",
    icon: "🧠",
    link: "https://www.anthropic.com/claude",
    status: "Released",
    releaseDate: "2023-07",
    company: "Anthropic",
    image: "https://www.paubox.com/hubfs/Is%20Claude%20AI%20HIPAA%20compliant.jpg",
    tags: ["AI", "Assistant", "Language Model"],
    subTools: [
      {
        name: "Claude 3 Opus",
        description: "Most capable Claude model",
        link: "https://www.anthropic.com/claude-3"
      },
      {
        name: "Claude 3 Sonnet",
        description: "Balanced performance model",
        link: "https://www.anthropic.com/claude-3"
      }
    ]
  },

  // Meta AI Tools
  {
    id: 10,
    name: "Llama",
    category: "Open Source AI",
    description: "Meta's open-source large language model, designed for research and commercial use with various model sizes and capabilities.",
    icon: "🦙",
    link: "https://ai.meta.com/llama",
    status: "Released",
    releaseDate: "2023-02",
    company: "Meta",
    image: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/69129b55-6798-43cd-92b5-0203f5d5a2f3/10.png?t=1730375002",
    tags: ["Open Source", "Language Model", "Research"],
    subTools: [
      {
        name: "Llama 2",
        description: "Latest open source model",
        link: "https://ai.meta.com/llama"
      },
      {
        name: "Code Llama",
        description: "Specialized coding model",
        link: "https://ai.meta.com/code-llama"
      }
    ]
  },

  // Amazon AI Tools
  {
    id: 11,
    name: "Amazon Bedrock",
    category: "Cloud AI Services",
    description: "Fully managed service that makes foundation models from leading AI companies available through an API for building generative AI applications.",
    icon: "🏗️",
    link: "https://aws.amazon.com/bedrock",
    status: "Released",
    releaseDate: "2023-09",
    company: "Amazon",
    image: "https://d1.awsstatic.com/getting-started-guides/learning/bedrock/bedrock-250-removebg-preview.86d95fc7f9a313f21091222ec7b63e1e30ea52ea.png",
    tags: ["Cloud", "AI Platform", "Enterprise"],
    subTools: [
      {
        name: "Claude on Bedrock",
        description: "Access to Anthropic's Claude",
        link: "https://aws.amazon.com/bedrock/claude"
      },
      {
        name: "Stable Diffusion on Bedrock",
        description: "Image generation capabilities",
        link: "https://aws.amazon.com/bedrock/stable-diffusion"
      }
    ]
  },

  // Upcoming Tools
  {
    id: 12,
    name: "GPT-5",
    category: "Upcoming Tools",
    description: "Next generation language model from OpenAI, expected to feature enhanced capabilities in reasoning, understanding, and generation.",
    icon: "🚀",
    link: "https://openai.com",
    status: "Upcoming",
    releaseDate: "2024-Q3",
    company: "OpenAI",
    image: "https://ainformation.jp/wp-content/uploads/2025/02/GPT-5.png",
    tags: ["AI", "Language Model", "Future"],
    subTools: [
      {
        name: "GPT-5 API",
        description: "API access to GPT-5",
        link: "https://openai.com/api"
      }
    ]
  },
  {
    id: 13,
    name: "Gemini Ultra Pro",
    category: "Upcoming Tools",
    description: "Next generation of Google's most capable AI model, featuring enhanced multimodal capabilities and advanced reasoning.",
    icon: "🌟",
    link: "https://gemini.google.com",
    status: "Upcoming",
    releaseDate: "2024-Q2",
    company: "Google",
    image: "https://aitificial.blog/wp-content/uploads/2024/02/gemini-ultra-introduction.jpg",
    tags: ["AI", "Language Model", "Future"],
    subTools: [
      {
        name: "Gemini Ultra Pro API",
        description: "API access to Gemini Ultra Pro",
        link: "https://ai.google.dev"
      }
    ]
  },

  // New AI Productivity Tools
  {
    id: 10,
    name: "Jasper",
    category: "Productivity Tools",
    description: "AI copywriter for blogs, ads, social posts.",
    icon: "✍️",
    image: "https://images.seeklogo.com/logo-png/47/1/jasper-logo-png_seeklogo-472363.png",
    link: "https://jasper.ai",
    tags: ["AI Writing", "AI Copywriting", "JasperAI"]
  },
  {
    id: 11,
    name: "Copy.ai",
    category: "Productivity Tools",
    description: "Generates marketing copy, posts, emails.",
    icon: "📝",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*UAbSlIVvFDkYBGwU_llzpw.png",
    link: "https://www.copy.ai",
    tags: ["Content Automation", "CopyAI"]
  },
  {
    id: 12,
    name: "Writer",
    category: "Productivity Tools",
    description: "Brand-aligned writing assistant for teams.",
    icon: "📚",
    image: "https://cdn-1.webcatalog.io/catalog/writer/writer-icon.png?v=1714776522604",
    link: "https://writer.com",
    tags: ["Enterprise AI", "Writing Assistant"]
  },
  {
    id: 13,
    name: "Frase",
    category: "Productivity Tools",
    description: "Helps with SEO-driven content research and outlines.",
    icon: "🔍",
    image: "https://toppng.com/uploads/preview/fraseio-logo-11609361888vheboxnecq.png",
    link: "https://frase.io",
    tags: ["SEO", "Content AI"]
  },
  {
    id: 14,
    name: "Anyword",
    category: "Productivity Tools",
    description: "Generates and optimizes copy with performance predictions.",
    icon: "📊",
    image: "https://www.appengine.ai/uploads/images/profile/logo/Anyword-AI.png",
    link: "https://anyword.com",
    tags: ["Marketing AI", "Copy Optimization"]
  },
  {
    id: 15,
    name: "Grammarly",
    category: "Productivity Tools",
    description: "Corrects grammar and enhances tone.",
    icon: "✓",
    image: "https://5.imimg.com/data5/IOS/Default/2025/4/499933307/MI/XF/KD/49456356/product-jpeg-500x500.png",
    link: "https://grammarly.com",
    tags: ["Writing Assistant", "Grammarly"]
  },
  {
    id: 16,
    name: "Wordtune",
    category: "Productivity Tools",
    description: "Paraphrases and improves clarity.",
    icon: "🔄",
    image: "https://www.pngall.com/wp-content/uploads/15/WordTune-Logo-PNG-Pic.png",
    link: "https://wordtune.com",
    tags: ["Rewriting", "Wordtune"]
  },
  {
    id: 17,
    name: "ProWritingAid",
    category: "Productivity Tools",
    description: "Detailed style and grammar checker.",
    icon: "📖",
    image: "https://www.digitalgyd.com/wp-content/uploads/2019/11/prowritingaid.png",
    link: "https://prowritingaid.com",
    tags: ["Editing AI", "ProWritingAid"]
  },
  {
    id: 18,
    name: "Notion AI",
    category: "Productivity Tools",
    description: "Smart note-taking, summaries & task planning.",
    icon: "📓",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsm_Vlpik1sY_SiDoH6dhDdRFjAShmquOPQA&s",
    link: "https://notion.so",
    tags: ["Workspace AI", "Notion"]
  },
  {
    id: 19,
    name: "Motion",
    category: "Productivity Tools",
    description: "AI schedules tasks and meetings.",
    icon: "⏰",
    image: "https://cdn.prod.website-files.com/5f1508193cd0e623f6e08a54/658cb892fa5c97efc8bc7eef_Motion%20Logo.svg",
    link: "https://usemotion.com",
    tags: ["Scheduling AI", "Motion"]
  },
  {
    id: 20,
    name: "Asana",
    category: "Productivity Tools",
    description: "Project management with AI planning.",
    icon: "📋",
    image: "https://images.seeklogo.com/logo-png/28/2/asana-logo-png_seeklogo-284347.png",
    link: "https://asana.com",
    tags: ["Project AI", "Asana"]
  },
  {
    id: 21,
    name: "Trello + Butler AI",
    category: "Productivity Tools",
    description: "Automates card actions using triggers.",
    icon: "🎯",
    image: "https://img.favpng.com/11/7/6/trello-logo-png-favpng-TJR8xEriMNu5Ma6mAcTnYKy2E.jpg",
    link: "https://trello.com",
    tags: ["Kanban AI", "Trello"]
  },
  {
    id: 22,
    name: "Any.do",
    category: "Productivity Tools",
    description: "AI task manager with calendar sync.",
    icon: "📅",
    image: "https://cubux.net/wp-content/uploads/2019/08/Any.do_logo.png",
    link: "https://any.do",
    tags: ["Task AI", "AnyDo"]
  },
  {
    id: 23,
    name: "Perplexity",
    category: "Productivity Tools",
    description: "AI-powered search engine answering complex queries.",
    icon: "🔎",
    image: "https://brandlogo.org/wp-content/uploads/2024/09/Perplexity-AI-App-Icon-2023.png.webp",
    link: "https://perplexity.ai",
    tags: ["AI search", "Perplexity"]
  },
  {
    id: 24,
    name: "Arc Search",
    category: "Productivity Tools",
    description: "Smarter AI-enhanced research browser.",
    icon: "🌐",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNkEBbkN5ZD37Q9m1y2rdtOmz-fE643miQyg&s",
    link: "https://arc.net",
    tags: ["Smart Search", "ArcSearch"]
  },
  {
    id: 25,
    name: "Google AI Overviews",
    category: "Productivity Tools",
    description: "Summaries & insights from web results.",
    icon: "📑",
    image: "https://static.vecteezy.com/system/resources/previews/060/301/920/non_2x/google-logo-on-button-free-png.png",
    link: "https://ai.google",
    tags: ["Google AI", "Search AI"]
  },
  {
    id: 26,
    name: "Humata",
    category: "Productivity Tools",
    description: "Reads documents and answers questions.",
    icon: "📄",
    image: "https://www.livetradingnews.com/wp-content/uploads/2023/10/unnamed.png",
    link: "https://humata.ai",
    tags: ["Doc AI", "Humata"]
  },
  {
    id: 27,
    name: "NotebookLM",
    category: "Productivity Tools",
    description: "AI research and notebook summarizer.",
    icon: "📔",
    image: "https://media.licdn.com/dms/image/v2/D4E12AQHYT6q2F5bj5g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1730996641255?e=2147483647&v=beta&t=Xzh-95KpKyevgT8yK9btR_38oTB2JZK74-1L2m-je-s",
    link: "https://notebooklm.google",
    tags: ["NoteTaker AI", "NotebookLM"]
  },
  {
    id: 28,
    name: "Otter.ai",
    category: "Productivity Tools",
    description: "Transcribes meetings with summary highlights.",
    icon: "🎙️",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRONPDrcDWnKmq-Jl5Vba95Q5bqv4e6Rvv5Mw&s",
    link: "https://otter.ai",
    tags: ["Meeting AI", "Otter"]
  },
  {
    id: 29,
    name: "Fireflies.ai",
    category: "Communication & Meetings",
    description: "Meeting assistant for transcription and notes.",
    image: "https://fireflies.ai/logo.png",
    link: "https://fireflies.ai",
    tags: ["Meeting AI", "Fireflies"]
  },
  {
    id: 30,
    name: "Avoma",
    category: "Communication & Meetings",
    description: "AI summarizes calls and coaching insights.",
    image: "https://play-lh.googleusercontent.com/ridcjJ4MzfXxf8bGR97ec6Wv1aoXJzjWOv9eGS8ijR7dXQyQuAnuzXWTSeiPS54pPA",
    link: "https://avoma.com",
    tags: ["Call AI", "Avoma"]
  },
  {
    id: 31,
    name: "tl;dv",
    category: "Communication & Meetings",
    description: "Records and transcribes video meetings.",
    image: "https://pipedrive-marketplace-manager-live.s3.amazonaws.com/03e503d73ee0ef33/icon/a85c2cf1-b900-4a75-acf3-079ae7e746f0/original.png",
    link: "https://tldv.io",
    tags: ["Video Meetings", "tldv"]
  },
  {
    id: 32,
    name: "Microsoft Copilot Pro (Outlook)",
    category: "Communication & Meetings",
    description: "AI drafts and organizes emails.",
    image: "https://i.pinimg.com/736x/1a/a9/ba/1aa9ba1e57508a13a22dfa75aadd5d2f.jpg",
    link: "https://microsoft.com/copilot",
    tags: ["Email AI", "CopilotPro"]
  },
  {
    id: 33,
    name: "Zapier",
    category: "Automation & Integration",
    description: "Connects apps and builds automated workflows.",
    image: "https://attentioninsight.com/wp-content/uploads/2022/08/zappier.png",
    link: "https://zapier.com",
    tags: ["Automation", "Zapier"]
  },
  {
    id: 34,
    name: "n8n",
    category: "Automation & Integration",
    description: "Open-source workflow automation platform.",
    image: "https://cdn.prod.website-files.com/5e6aa3e3f001fae105b8e1e7/63c8642c1872bf1185f3950b_45487711.png",
    link: "https://n8n.io",
    tags: ["Open Source AI", "n8n"]
  },
  {
    id: 35,
    name: "UiPath",
    category: "Automation & Integration",
    description: "Robotic Process Automation for routine tasks.",
    image: "https://img.icons8.com/color/512/uipath.png",
    link: "https://uipath.com",
    tags: ["RPA", "UiPath"]
  },
  {
    id: 36,
    name: "Reclaim",
    category: "Automation & Integration",
    description: "Smart calendar assistant that auto-schedules focus time.",
    image: "https://cdn.prod.website-files.com/5f15081919fdf673994ab5fd/64a4c06e6315a23d4ecf975c_Reclaim-Logo.svg",
    link: "https://reclaim.ai",
    tags: ["Calendar AI", "Reclaim"]
  },
  {
    id: 37,
    name: "Clockwise",
    category: "Automation & Integration",
    description: "AI scheduling optimized for team availability.",
    image: "https://media.licdn.com/dms/image/v2/C4E0BAQH7Pk2RNE6jvQ/company-logo_200_200/company-logo_200_200/0/1669057365774/clockwise_inc_logo?e=2147483647&v=beta&t=NS4XRNE61HwcrSOovU2fdoqkeLunXNCgAhZiXXgI544",
    link: "https://getclockwise.com",
    tags: ["Time Management", "Clockwise"]
  },
  {
    id: 38,
    name: "Mem AI",
    category: "Miscellaneous & Specialized",
    description: "Smart note-taking with predictive recall.",
    image: "https://storage.googleapis.com/mem-public-assets/sq-f.jpg",
    link: "https://mem.ai",
    tags: ["Memo AI", "Mem"]
  },
  {
    id: 39,
    name: "Personal AI",
    category: "Miscellaneous & Specialized",
    description: "Your personal knowledge concierge.",
    image: "https://static1.squarespace.com/static/63a17e2bca256c483b6e2453/63a17e2dca256c483b6e24af/63e3e1ffd51899514b56f6d2/1681759905680/PersonalAI.jpg?format=1500w",
    link: "https://personal.ai",
    tags: ["Personal AI", "Knowledge AI"]
  },
  {
    id: 40,
    name: "FeedHive",
    category: "Miscellaneous & Specialized",
    description: "AI-powered social media planner and publisher.",
    image: "https://www.feedhive.com/favicon.ico",
    link: "https://feedhive.io",
    tags: ["Social Media AI", "FeedHive"]
  },
  {
    id: 41,
    name: "Vista Social",
    category: "Miscellaneous & Specialized",
    description: "Social platform management with AI analytics.",
    image: "https://play-lh.googleusercontent.com/LeC3-C9662w7jJK2shMsB2UcblP4SRnIlkWq0yFohfV9RLlUjv2XFBY3uyZLpG6wAQc=w240-h480-rw",
    link: "https://vistasocial.com",
    tags: ["Social Analytics", "VistaSocial"]
  },
  {
    id: 42,
    name: "Buffer AI",
    category: "Miscellaneous & Specialized",
    description: "Social content ideation and optimization.",
    image: "https://images.icon-icons.com/2429/PNG/512/buffer_logo_icon_147308.png",
    link: "https://buffer.com",
    tags: ["Social AI", "Buffer"]
  },
  {
    id: 43,
    name: "ElevenLabs",
    category: "Miscellaneous & Specialized",
    description: "AI voice synthesis for narration and audio.",
    image: "https://diplo-media.s3.eu-central-1.amazonaws.com/2025/01/elevenlabs-funding-round-NEA-World-Innovation-Lab-AI-1024x576.png",
    link: "https://elevenlabs.io",
    tags: ["Voice AI", "ElevenLabs"]
  },
  {
    id: 44,
    name: "Suno",
    category: "Miscellaneous & Specialized",
    description: "AI music generation tool.",
    image: "https://suno.com/favicon-512x512.png",
    link: "https://suno.ai",
    tags: ["Music AI", "Suno"]
  },
  {
    id: 45,
    name: "AIVA",
    category: "Miscellaneous & Specialized",
    description: "AI composer for background scores.",
    image: "https://dashboard.snapcraft.io/site_media/appmedia/2021/04/icon-prod_smaller.png",
    link: "https://aiva.ai",
    tags: ["Composing AI", "AIVA"]
  },
  {
    id: 46,
    name: "Fathom",
    category: "Miscellaneous & Specialized",
    description: "AI that records, highlights, and summarizes calls.",
    image: "https://f.hubspotusercontent20.net/hubfs/20372723/__hs-marketplace__/fathom-app-icon-squared-1.png",
    link: "https://fathom.video",
    tags: ["Meeting AI", "Fathom"]
  },
  {
    id: 47,
    name: "Windsurf",
    category: "Miscellaneous & Specialized",
    description: "AI-assisted code editor built on VS Code.",
    image: "https://exafunction.github.io//public/brand/windsurf-black-symbol.svg",
    link: "https://windsurf.dev",
    tags: ["Code AI", "Windsurf"]
  }
];
