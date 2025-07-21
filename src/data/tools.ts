import { Tool } from '../types/tool';

export const toolsData: any[] = [
  // Google AI Tools
  {
    id: "1",
    name: "Gemini",
    description: "Google's most capable AI model, capable of understanding and generating text, code, and images. Features multimodal capabilities and advanced reasoning.",
    icon: "🤖",
    link: "https://gemini.google.com",
    status: "Released",
    release_date: "2024-02",
    company: "Google",
    image_url: "https://static.vecteezy.com/system/resources/previews/055/687/055/non_2x/rectangle-gemini-google-icon-symbol-logo-free-png.png",
    tool_tags: [{ tags: { name: "AI" } }, { tags: { name: "Language Model" } }, { tags: { name: "Multimodal" } }],
    rating: 4.7,
    sub_tools: [
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
    id: "2",
    name: "Google AI Studio",
    description: "Comprehensive platform for building and deploying AI applications with Google's latest models and tools.",
    icon: "⚡",
    link: "https://ai.google.dev",
    status: "Released",
    release_date: "2023-12",
    company: "Google",
    image_url: "https://ai.google.dev/static/site-assets/images/share.png",
    tool_tags: [{ tags: { name: "Development" } }, { tags: { name: "AI Platform" } }, { tags: { name: "API" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "3",
    name: "Copilot",
    description: "Microsoft's AI-powered coding assistant that helps developers write better code faster. Integrated with Visual Studio and GitHub.",
    icon: "👨‍💻",
    link: "https://github.com/features/copilot",
    status: "Released",
    release_date: "2023-11",
    company: "Microsoft",
    image_url: "https://static.vecteezy.com/system/resources/previews/046/861/635/non_2x/copilot-icon-transparent-background-free-png.png",
    tool_tags: [{ tags: { name: "Coding" } }, { tags: { name: "AI Assistant" } }, { tags: { name: "Development" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "4",
    name: "Azure AI",
    description: "Microsoft's comprehensive suite of AI services on Azure, including machine learning, cognitive services, and AI infrastructure.",
    icon: "☁️",
    link: "https://azure.microsoft.com/services/cognitive-services",
    status: "Released",
    release_date: "2023-10",
    company: "Microsoft",
    image_url: "https://azure.microsoft.com/svghandler/cognitive-services",
    tool_tags: [{ tags: { name: "Cloud" } }, { tags: { name: "AI Services" } }, { tags: { name: "Enterprise" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "5",
    name: "NVIDIA AI Enterprise",
    description: "End-to-end AI platform for enterprises, featuring optimized frameworks, tools, and support for AI development and deployment.",
    icon: "🚀",
    link: "https://www.nvidia.com/en-us/ai-data-science/ai-enterprise",
    status: "Released",
    release_date: "2023-09",
    company: "NVIDIA",
    image_url: "https://i.pinimg.com/736x/93/7e/c3/937ec3640a2c82348a1cdb28211c3a56.jpg",
    tool_tags: [{ tags: { name: "Enterprise" } }, { tags: { name: "AI Platform" } }, { tags: { name: "GPU" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "6",
    name: "NVIDIA Omniverse",
    description: "Real-time 3D design collaboration and simulation platform powered by NVIDIA's AI and graphics technologies.",
    icon: "🎮",
    link: "https://www.nvidia.com/en-us/omniverse",
    status: "Released",
    release_date: "2023-08",
    company: "NVIDIA",
    image_url: "https://lh5.googleusercontent.com/gjpebnnq0HqmZB25NleLdKvmv2wO3HIOL4z_GrZdoGtIp-ZUx9iTLX3I22sMKlTUEqlZvm6BNrNBFnW4vD0y7ymktuvcwvb7BuNVyUjyrDcgeY9m8T9keNk6zR1YGu4-mtda2bJa",
    tool_tags: [{ tags: { name: "3D" } }, { tags: { name: "Simulation" } }, { tags: { name: "Collaboration" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "7",
    name: "ChatGPT",
    description: "Advanced conversational AI model capable of understanding and generating human-like text across various domains and tasks.",
    icon: "💬",
    link: "https://chat.openai.com",
    status: "Released",
    release_date: "2023-11",
    company: "OpenAI",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    tool_tags: [{ tags: { name: "AI" } }, { tags: { name: "Chatbot" } }, { tags: { name: "Language Model" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "8",
    name: "DALL·E",
    description: "AI system that creates realistic images and art from natural language descriptions, with advanced capabilities for image editing and variation.",
    icon: "🎨",
    link: "https://openai.com/dall-e-3",
    status: "Released",
    release_date: "2023-10",
    company: "OpenAI",
    image_url: "https://ih1.redbubble.net/image.4930945508.5459/fposter,small,wall_texture,square_product,600x600.jpg",
    tool_tags: [{ tags: { name: "AI Art" } }, { tags: { name: "Image Generation" } }, { tags: { name: "Creative" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "9",
    name: "Claude",
    description: "Advanced AI assistant focused on helpful, harmless, and honest interactions, with strong capabilities in analysis and writing.",
    icon: "🧠",
    link: "https://www.anthropic.com/claude",
    status: "Released",
    release_date: "2023-07",
    company: "Anthropic",
    image_url: "https://www.paubox.com/hubfs/Is%20Claude%20AI%20HIPAA%20compliant.jpg",
    tool_tags: [{ tags: { name: "AI" } }, { tags: { name: "Assistant" } }, { tags: { name: "Language Model" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "10",
    name: "Llama",
    description: "Meta's open-source large language model, designed for research and commercial use with various model sizes and capabilities.",
    icon: "🦙",
    link: "https://ai.meta.com/llama",
    status: "Released",
    release_date: "2023-02",
    company: "Meta",
    image_url: "https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/69129b55-6798-43cd-92b5-0203f5d5a2f3/10.png?t=1730375002",
    tool_tags: [{ tags: { name: "Open Source" } }, { tags: { name: "Language Model" } }, { tags: { name: "Research" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "11",
    name: "Amazon Bedrock",
    description: "Fully managed service that makes foundation models from leading AI companies available through an API for building generative AI applications.",
    icon: "🏗️",
    link: "https://aws.amazon.com/bedrock",
    status: "Released",
    release_date: "2023-09",
    company: "Amazon",
    image_url: "https://d1.awsstatic.com/getting-started-guides/learning/bedrock/bedrock-250-removebg-preview.86d95fc7f9a313f21091222ec7b63e1e30ea52ea.png",
    tool_tags: [{ tags: { name: "Cloud" } }, { tags: { name: "AI Platform" } }, { tags: { name: "Enterprise" } }],
    rating: 4.5,
    sub_tools: [
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
    id: "12",
    name: "GPT-5",
    description: "Next generation language model from OpenAI, expected to feature enhanced capabilities in reasoning, understanding, and generation.",
    icon: "🚀",
    link: "https://openai.com",
    status: "Upcoming",
    release_date: "2024-Q3",
    company: "OpenAI",
    image_url: "https://ainformation.jp/wp-content/uploads/2025/02/GPT-5.png",
    tool_tags: [{ tags: { name: "AI" } }, { tags: { name: "Language Model" } }, { tags: { name: "Future" } }],
    rating: 4.5,
    sub_tools: [
      {
        name: "GPT-5 API",
        description: "API access to GPT-5",
        link: "https://openai.com/api"
      }
    ]
  },
  {
    id: "13",
    name: "Gemini Ultra Pro",
    description: "Next generation of Google's most capable AI model, featuring enhanced multimodal capabilities and advanced reasoning.",
    icon: "🌟",
    link: "https://gemini.google.com",
    status: "Upcoming",
    release_date: "2024-Q2",
    company: "Google",
    image_url: "https://aitificial.blog/wp-content/uploads/2024/02/gemini-ultra-introduction.jpg",
    tool_tags: [{ tags: { name: "AI" } }, { tags: { name: "Language Model" } }, { tags: { name: "Future" } }],
    rating: 4.5,
    sub_tools: [
      {
        name: "Gemini Ultra Pro API",
        description: "API access to Gemini Ultra Pro",
        link: "https://ai.google.dev"
      }
    ]
  },

  // New AI Productivity Tools
  {
    id: "10",
    name: "Jasper",
    description: "AI copywriter for blogs, ads, social posts.",
    icon: "✍️",
    image_url: "https://images.seeklogo.com/logo-png/47/1/jasper-logo-png_seeklogo-472363.png",
    link: "https://jasper.ai",
    tool_tags: [{ tags: { name: "AI Writing" } }, { tags: { name: "AI Copywriting" } }, { tags: { name: "JasperAI" } }],
    rating: 4.5
  },
  {
    id: "11",
    name: "Copy.ai",
    description: "Generates marketing copy, posts, emails.",
    icon: "📝",
    image_url: "https://miro.medium.com/v2/resize:fit:1400/1*UAbSlIVvFDkYBGwU_llzpw.png",
    link: "https://www.copy.ai",
    tool_tags: [{ tags: { name: "Content Automation" } }, { tags: { name: "CopyAI" } }],
    rating: 4.5
  },
  {
    id: "12",
    name: "Writer",
    description: "Brand-aligned writing assistant for teams.",
    icon: "📚",
    image_url: "https://cdn-1.webcatalog.io/catalog/writer/writer-icon.png?v=1714776522604",
    link: "https://writer.com",
    tool_tags: [{ tags: { name: "Enterprise AI" } }, { tags: { name: "Writing Assistant" } }],
    rating: 4.5
  },
  {
    id: "13",
    name: "Frase",
    description: "Helps with SEO-driven content research and outlines.",
    icon: "🔍",
    image_url: "https://toppng.com/uploads/preview/fraseio-logo-11609361888vheboxnecq.png",
    link: "https://frase.io",
    tool_tags: [{ tags: { name: "SEO" } }, { tags: { name: "Content AI" } }],
    rating: 4.5
  },
  {
    id: "14",
    name: "Anyword",
    description: "Generates and optimizes copy with performance predictions.",
    icon: "📊",
    image_url: "https://www.appengine.ai/uploads/images/profile/logo/Anyword-AI.png",
    link: "https://anyword.com",
    tool_tags: [{ tags: { name: "Marketing AI" } }, { tags: { name: "Copy Optimization" } }],
    rating: 4.5
  },
  {
    id: "15",
    name: "Grammarly",
    description: "Corrects grammar and enhances tone.",
    icon: "✓",
    image_url: "https://5.imimg.com/data5/IOS/Default/2025/4/499933307/MI/XF/KD/49456356/product-jpeg-500x500.png",
    link: "https://grammarly.com",
    tool_tags: [{ tags: { name: "Writing Assistant" } }, { tags: { name: "Grammarly" } }],
    rating: 4.5
  },
  {
    id: "16",
    name: "Wordtune",
    description: "Paraphrases and improves clarity.",
    icon: "🔄",
    image_url: "https://www.pngall.com/wp-content/uploads/15/WordTune-Logo-PNG-Pic.png",
    link: "https://wordtune.com",
    tool_tags: [{ tags: { name: "Rewriting" } }, { tags: { name: "Wordtune" } }],
    rating: 4.5
  },
  {
    id: "17",
    name: "ProWritingAid",
    description: "Detailed style and grammar checker.",
    icon: "📖",
    image_url: "https://www.digitalgyd.com/wp-content/uploads/2019/11/prowritingaid.png",
    link: "https://prowritingaid.com",
    tool_tags: [{ tags: { name: "Editing AI" } }, { tags: { name: "ProWritingAid" } }],
    rating: 4.5
  },
  {
    id: "18",
    name: "Notion AI",
    description: "Smart note-taking, summaries & task planning.",
    icon: "📓",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsm_Vlpik1sY_SiDoH6dhDdRFjAShmquOPQA&s",
    link: "https://notion.so",
    tool_tags: [{ tags: { name: "Workspace AI" } }, { tags: { name: "Notion" } }],
    rating: 4.5
  },
  {
    id: "19",
    name: "Motion",
    description: "AI schedules tasks and meetings.",
    icon: "⏰",
    image_url: "https://cdn.prod.website-files.com/5f1508193cd0e623f6e08a54/658cb892fa5c97efc8bc7eef_Motion%20Logo.svg",
    link: "https://usemotion.com",
    tool_tags: [{ tags: { name: "Scheduling AI" } }, { tags: { name: "Motion" } }],
    rating: 4.5
  },
  {
    id: "20",
    name: "Asana",
    description: "Project management with AI planning.",
    icon: "📋",
    image_url: "https://images.seeklogo.com/logo-png/28/2/asana-logo-png_seeklogo-284347.png",
    link: "https://asana.com",
    tool_tags: [{ tags: { name: "Project AI" } }, { tags: { name: "Asana" } }],
    rating: 4.5
  },
  {
    id: "21",
    name: "Trello + Butler AI",
    description: "Automates card actions using triggers.",
    icon: "🎯",
    image_url: "https://img.favpng.com/11/7/6/trello-logo-png-favpng-TJR8xEriMNu5Ma6mAcTnYKy2E.jpg",
    link: "https://trello.com",
    tool_tags: [{ tags: { name: "Kanban AI" } }, { tags: { name: "Trello" } }],
    rating: 4.5
  },
  {
    id: "22",
    name: "Any.do",
    description: "AI task manager with calendar sync.",
    icon: "📅",
    image_url: "https://cubux.net/wp-content/uploads/2019/08/Any.do_logo.png",
    link: "https://any.do",
    tool_tags: [{ tags: { name: "Task AI" } }, { tags: { name: "AnyDo" } }],
    rating: 4.5
  },
  {
    id: "23",
    name: "Perplexity",
    description: "AI-powered search engine answering complex queries.",
    icon: "🔎",
    image_url: "https://brandlogo.org/wp-content/uploads/2024/09/Perplexity-AI-App-Icon-2023.png.webp",
    link: "https://perplexity.ai",
    tool_tags: [{ tags: { name: "AI search" } }, { tags: { name: "Perplexity" } }],
    rating: 4.5
  },
  {
    id: "24",
    name: "Arc Search",
    description: "Smarter AI-enhanced research browser.",
    icon: "🌐",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNkEBbkN5ZD37Q9m1y2rdtOmz-fE643miQyg&s",
    link: "https://arc.net",
    tool_tags: [{ tags: { name: "Smart Search" } }, { tags: { name: "ArcSearch" } }],
    rating: 4.5
  },
  {
    id: "25",
    name: "Google AI Overviews",
    description: "Summaries & insights from web results.",
    icon: "📑",
    image_url: "https://static.vecteezy.com/system/resources/previews/060/301/920/non_2x/google-logo-on-button-free-png.png",
    link: "https://ai.google",
    tool_tags: [{ tags: { name: "Google AI" } }, { tags: { name: "Search AI" } }],
    rating: 4.5
  },
  {
    id: "26",
    name: "Humata",
    description: "Reads documents and answers questions.",
    icon: "📄",
    image_url: "https://www.livetradingnews.com/wp-content/uploads/2023/10/unnamed.png",
    link: "https://humata.ai",
    tool_tags: [{ tags: { name: "Doc AI" } }, { tags: { name: "Humata" } }],
    rating: 4.5
  },
  {
    id: "27",
    name: "NotebookLM",
    description: "AI research and notebook summarizer.",
    icon: "📔",
    image_url: "https://media.licdn.com/dms/image/v2/D4E12AQHYT6q2F5bj5g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1730996641255?e=2147483647&v=beta&t=Xzh-95KpKyevgT8yK9btR_38oTB2JZK74-1L2m-je-s",
    link: "https://notebooklm.google",
    tool_tags: [{ tags: { name: "NoteTaker AI" } }, { tags: { name: "NotebookLM" } }],
    rating: 4.5
  },
  {
    id: "28",
    name: "Otter.ai",
    description: "Transcribes meetings with summary highlights.",
    icon: "🎙️",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRONPDrcDWnKmq-Jl5Vba95Q5bqv4e6Rvv5Mw&s",
    link: "https://otter.ai",
    tool_tags: [{ tags: { name: "Meeting AI" } }, { tags: { name: "Otter" } }],
    rating: 4.5
  },
  {
    id: "29",
    name: "Fireflies.ai",
    description: "Meeting assistant for transcription and notes.",
    image_url: "https://fireflies.ai/logo.png",
    link: "https://fireflies.ai",
    tool_tags: [{ tags: { name: "Meeting AI" } }, { tags: { name: "Fireflies" } }],
    rating: 4.5
  },
  {
    id: "30",
    name: "Avoma",
    description: "AI summarizes calls and coaching insights.",
    image_url: "https://play-lh.googleusercontent.com/ridcjJ4MzfXxf8bGR97ec6Wv1aoXJzjWOv9eGS8ijR7dXQyQuAnuzXWTSeiPS54pPA",
    link: "https://avoma.com",
    tool_tags: [{ tags: { name: "Call AI" } }, { tags: { name: "Avoma" } }],
    rating: 4.5
  },
  {
    id: "31",
    name: "tl;dv",
    description: "Records and transcribes video meetings.",
    image_url: "https://pipedrive-marketplace-manager-live.s3.amazonaws.com/03e503d73ee0ef33/icon/a85c2cf1-b900-4a75-acf3-079ae7e746f0/original.png",
    link: "https://tldv.io",
    tool_tags: [{ tags: { name: "Video Meetings" } }, { tags: { name: "tldv" } }],
    rating: 4.5
  },
  {
    id: "32",
    name: "Microsoft Copilot Pro (Outlook)",
    description: "AI drafts and organizes emails.",
    image_url: "https://i.pinimg.com/736x/1a/a9/ba/1aa9ba1e57508a13a22dfa75aadd5d2f.jpg",
    link: "https://microsoft.com/copilot",
    tool_tags: [{ tags: { name: "Email AI" } }, { tags: { name: "CopilotPro" } }],
    rating: 4.5
  },
  {
    id: "33",
    name: "Zapier",
    description: "Connects apps and builds automated workflows.",
    image_url: "https://attentioninsight.com/wp-content/uploads/2022/08/zappier.png",
    link: "https://zapier.com",
    tool_tags: [{ tags: { name: "Automation" } }, { tags: { name: "Zapier" } }],
    rating: 4.5
  },
  {
    id: "34",
    name: "n8n",
    description: "Open-source workflow automation platform.",
    image_url: "https://cdn.prod.website-files.com/5e6aa3e3f001fae105b8e1e7/63c8642c1872bf1185f3950b_45487711.png",
    link: "https://n8n.io",
    tool_tags: [{ tags: { name: "Open Source AI" } }, { tags: { name: "n8n" } }],
    rating: 4.5
  },
  {
    id: "35",
    name: "UiPath",
    description: "Robotic Process Automation for routine tasks.",
    image_url: "https://img.icons8.com/color/512/uipath.png",
    link: "https://uipath.com",
    tool_tags: [{ tags: { name: "RPA" } }, { tags: { name: "UiPath" } }],
    rating: 4.5
  },
  {
    id: "36",
    name: "Reclaim",
    description: "Smart calendar assistant that auto-schedules focus time.",
    image_url: "https://cdn.prod.website-files.com/5f15081919fdf673994ab5fd/64a4c06e6315a23d4ecf975c_Reclaim-Logo.svg",
    link: "https://reclaim.ai",
    tool_tags: [{ tags: { name: "Calendar AI" } }, { tags: { name: "Reclaim" } }],
    rating: 4.5
  },
  {
    id: "37",
    name: "Clockwise",
    description: "AI scheduling optimized for team availability.",
    image_url: "https://media.licdn.com/dms/image/v2/C4E0BAQH7Pk2RNE6jvQ/company-logo_200_200/company-logo_200_200/0/1669057365774/clockwise_inc_logo?e=2147483647&v=beta&t=NS4XRNE61HwcrSOovU2fdoqkeLunXNCgAhZiXXgI544",
    link: "https://getclockwise.com",
    tool_tags: [{ tags: { name: "Time Management" } }, { tags: { name: "Clockwise" } }],
    rating: 4.5
  },
  {
    id: "38",
    name: "Mem AI",
    description: "Smart note-taking with predictive recall.",
    image_url: "https://storage.googleapis.com/mem-public-assets/sq-f.jpg",
    link: "https://mem.ai",
    tool_tags: [{ tags: { name: "Memo AI" } }, { tags: { name: "Mem" } }],
    rating: 4.5
  },
  {
    id: "39",
    name: "Personal AI",
    description: "Your personal knowledge concierge.",
    image_url: "https://static1.squarespace.com/static/63a17e2bca256c483b6e2453/63a17e2dca256c483b6e24af/63e3e1ffd51899514b56f6d2/1681759905680/PersonalAI.jpg?format=1500w",
    link: "https://personal.ai",
    tool_tags: [{ tags: { name: "Personal AI" } }, { tags: { name: "Knowledge AI" } }],
    rating: 4.5
  },
  {
    id: "40",
    name: "FeedHive",
    description: "AI-powered social media planner and publisher.",
    image_url: "https://www.feedhive.com/favicon.ico",
    link: "https://feedhive.io",
    tool_tags: [{ tags: { name: "Social Media AI" } }, { tags: { name: "FeedHive" } }],
    rating: 4.5
  },
  {
    id: "41",
    name: "Vista Social",
    description: "Social platform management with AI analytics.",
    image_url: "https://play-lh.googleusercontent.com/LeC3-C9662w7jJK2shMsB2UcblP4SRnIlkWq0yFohfV9RLlUjv2XFBY3uyZLpG6wAQc=w240-h480-rw",
    link: "https://vistasocial.com",
    tool_tags: [{ tags: { name: "Social Analytics" } }, { tags: { name: "VistaSocial" } }],
    rating: 4.5
  },
  {
    id: "42",
    name: "Buffer AI",
    description: "Social content ideation and optimization.",
    image_url: "https://images.icon-icons.com/2429/PNG/512/buffer_logo_icon_147308.png",
    link: "https://buffer.com",
    tool_tags: [{ tags: { name: "Social AI" } }, { tags: { name: "Buffer" } }],
    rating: 4.5
  },
  {
    id: "43",
    name: "ElevenLabs",
    description: "AI voice synthesis for narration and audio.",
    image_url: "https://diplo-media.s3.eu-central-1.amazonaws.com/2025/01/elevenlabs-funding-round-NEA-World-Innovation-Lab-AI-1024x576.png",
    link: "https://elevenlabs.io",
    tool_tags: [{ tags: { name: "Voice AI" } }, { tags: { name: "ElevenLabs" } }],
    rating: 4.5
  },
  {
    id: "44",
    name: "Suno",
    description: "AI music generation tool.",
    image_url: "https://suno.com/favicon-512x512.png",
    link: "https://suno.ai",
    tool_tags: [{ tags: { name: "Music AI" } }, { tags: { name: "Suno" } }],
    rating: 4.5
  },
  {
    id: "45",
    name: "AIVA",
    description: "AI composer for background scores.",
    image_url: "https://dashboard.snapcraft.io/site_media/appmedia/2021/04/icon-prod_smaller.png",
    link: "https://aiva.ai",
    tool_tags: [{ tags: { name: "Composing AI" } }, { tags: { name: "AIVA" } }],
    rating: 4.5
  },
  {
    id: "46",
    name: "Fathom",
    description: "AI that records, highlights, and summarizes calls.",
    image_url: "https://f.hubspotusercontent20.net/hubfs/20372723/__hs-marketplace__/fathom-app-icon-squared-1.png",
    link: "https://fathom.video",
    tool_tags: [{ tags: { name: "Meeting AI" } }, { tags: { name: "Fathom" } }],
    rating: 4.5
  },
  {
    id: "47",
    name: "Windsurf",
    description: "AI-assisted code editor built on VS Code.",
    image_url: "https://exafunction.github.io//public/brand/windsurf-black-symbol.svg",
    link: "https://windsurf.dev",
    tool_tags: [{ tags: { name: "Code AI" } }, { tags: { name: "Windsurf" } }],
    rating: 4.5
  }
].map(tool => ({
  ...tool,
  rating: tool.rating ?? (Math.round((Math.random() * 1.5 + 3.5) * 10) / 10)
})).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
