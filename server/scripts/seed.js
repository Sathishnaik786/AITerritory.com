import { supabase } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample data based on your frontend
const categories = [
  { name: 'AI Language Models', slug: 'ai-language-models', description: 'Advanced language processing and generation tools' },
  { name: 'AI Development', slug: 'ai-development', description: 'Tools for building AI applications' },
  { name: 'AI Assistants', slug: 'ai-assistants', description: 'Intelligent virtual assistants' },
  { name: 'Cloud AI Services', slug: 'cloud-ai-services', description: 'Cloud-based AI platforms and services' },
  { name: 'Enterprise AI', slug: 'enterprise-ai', description: 'AI solutions for enterprise use' },
  { name: '3D & Simulation', slug: '3d-simulation', description: '3D modeling and simulation tools' },
  { name: 'AI Image Generation', slug: 'ai-image-generation', description: 'AI-powered image creation tools' },
  { name: 'Open Source AI', slug: 'open-source-ai', description: 'Open source AI tools and frameworks' },
  { name: 'Productivity Tools', slug: 'productivity-tools', description: 'AI tools to boost productivity' },
  { name: 'Upcoming Tools', slug: 'upcoming-tools', description: 'Future AI tools in development' }
];

const tags = [
  { name: 'AI', slug: 'ai' },
  { name: 'Language Model', slug: 'language-model' },
  { name: 'Multimodal', slug: 'multimodal' },
  { name: 'Development', slug: 'development' },
  { name: 'AI Platform', slug: 'ai-platform' },
  { name: 'API', slug: 'api' },
  { name: 'Coding', slug: 'coding' },
  { name: 'AI Assistant', slug: 'ai-assistant' },
  { name: 'Cloud', slug: 'cloud' },
  { name: 'AI Services', slug: 'ai-services' },
  { name: 'Enterprise', slug: 'enterprise' },
  { name: 'GPU', slug: 'gpu' },
  { name: '3D', slug: '3d' },
  { name: 'Simulation', slug: 'simulation' },
  { name: 'Collaboration', slug: 'collaboration' },
  { name: 'Chatbot', slug: 'chatbot' },
  { name: 'AI Art', slug: 'ai-art' },
  { name: 'Image Generation', slug: 'image-generation' },
  { name: 'Creative', slug: 'creative' },
  { name: 'Assistant', slug: 'assistant' },
  { name: 'Open Source', slug: 'open-source' },
  { name: 'Research', slug: 'research' },
  { name: 'Future', slug: 'future' },
  { name: 'AI Writing', slug: 'ai-writing' },
  { name: 'AI Copywriting', slug: 'ai-copywriting' },
  { name: 'JasperAI', slug: 'jasperai' },
  { name: 'Content Automation', slug: 'content-automation' },
  { name: 'CopyAI', slug: 'copyai' },
  { name: 'Enterprise AI', slug: 'enterprise-ai' },
  { name: 'Writing Assistant', slug: 'writing-assistant' },
  { name: 'SEO', slug: 'seo' },
  { name: 'Content AI', slug: 'content-ai' },
  { name: 'Marketing AI', slug: 'marketing-ai' },
  { name: 'Copy Optimization', slug: 'copy-optimization' },
  { name: 'Grammarly', slug: 'grammarly' },
  { name: 'Rewriting', slug: 'rewriting' },
  { name: 'Wordtune', slug: 'wordtune' },
  { name: 'Editing AI', slug: 'editing-ai' },
  { name: 'ProWritingAid', slug: 'prowritingaid' },
  { name: 'Workspace AI', slug: 'workspace-ai' },
  { name: 'Notion', slug: 'notion' },
  { name: 'Scheduling AI', slug: 'scheduling-ai' },
  { name: 'Motion', slug: 'motion' },
  { name: 'Project AI', slug: 'project-ai' },
  { name: 'Asana', slug: 'asana' },
  { name: 'Kanban AI', slug: 'kanban-ai' },
  { name: 'Trello', slug: 'trello' },
  { name: 'Task AI', slug: 'task-ai' },
  { name: 'AnyDo', slug: 'anydo' },
  { name: 'AI search', slug: 'ai-search' },
  { name: 'Perplexity', slug: 'perplexity' },
  { name: 'Smart Search', slug: 'smart-search' },
  { name: 'ArcSearch', slug: 'arcsearch' },
  { name: 'Google AI', slug: 'google-ai' },
  { name: 'Search AI', slug: 'search-ai' },
  { name: 'Doc AI', slug: 'doc-ai' },
  { name: 'Humata', slug: 'humata' },
  { name: 'NoteTaker AI', slug: 'notetaker-ai' },
  { name: 'NotebookLM', slug: 'notebooklm' },
  { name: 'Meeting AI', slug: 'meeting-ai' },
  { name: 'Otter', slug: 'otter' },
  { name: 'Fireflies', slug: 'fireflies' },
  { name: 'Call AI', slug: 'call-ai' },
  { name: 'Avoma', slug: 'avoma' },
  { name: 'Video Meetings', slug: 'video-meetings' },
  { name: 'tldv', slug: 'tldv' },
  { name: 'Email AI', slug: 'email-ai' },
  { name: 'CopilotPro', slug: 'copilotpro' },
  { name: 'Automation', slug: 'automation' },
  { name: 'Zapier', slug: 'zapier' },
  { name: 'Open Source AI', slug: 'open-source-ai' },
  { name: 'n8n', slug: 'n8n' },
  { name: 'RPA', slug: 'rpa' },
  { name: 'UiPath', slug: 'uipath' },
  { name: 'Calendar AI', slug: 'calendar-ai' },
  { name: 'Reclaim', slug: 'reclaim' },
  { name: 'Time Management', slug: 'time-management' },
  { name: 'Clockwise', slug: 'clockwise' },
  { name: 'Memo AI', slug: 'memo-ai' },
  { name: 'Mem', slug: 'mem' },
  { name: 'Personal AI', slug: 'personal-ai' },
  { name: 'Knowledge AI', slug: 'knowledge-ai' },
  { name: 'Social Media AI', slug: 'social-media-ai' },
  { name: 'FeedHive', slug: 'feedhive' },
  { name: 'Social Analytics', slug: 'social-analytics' },
  { name: 'VistaSocial', slug: 'vistasocial' },
  { name: 'Social AI', slug: 'social-ai' },
  { name: 'Buffer', slug: 'buffer' },
  { name: 'Voice AI', slug: 'voice-ai' },
  { name: 'ElevenLabs', slug: 'elevenlabs' },
  { name: 'Music AI', slug: 'music-ai' },
  { name: 'Suno', slug: 'suno' },
  { name: 'Composing AI', slug: 'composing-ai' },
  { name: 'AIVA', slug: 'aiva' },
  { name: 'Fathom', slug: 'fathom' },
  { name: 'Code AI', slug: 'code-ai' },
  { name: 'Windsurf', slug: 'windsurf' }
];

const sampleTools = [
  {
    name: 'Gemini',
    description: "Google's most capable AI model, capable of understanding and generating text, code, and images. Features multimodal capabilities and advanced reasoning.",
    link: 'https://gemini.google.com',
    image_url: 'https://static.vecteezy.com/system/resources/previews/055/687/055/non_2x/rectangle-gemini-google-icon-symbol-logo-free-png.png',
    company: 'Google',
    status: 'Active',
    release_date: '2024-02-01',
    rating: 4.8,
    is_featured: true,
    is_trending: true,
    pricing_type: 'Freemium'
  },
  {
    name: 'ChatGPT',
    description: 'Advanced conversational AI model capable of understanding and generating human-like text across various domains and tasks.',
    link: 'https://chat.openai.com',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    company: 'OpenAI',
    status: 'Active',
    release_date: '2023-11-01',
    rating: 4.9,
    is_featured: true,
    is_trending: true,
    pricing_type: 'Freemium'
  },
  {
    name: 'DALL·E',
    description: 'AI system that creates realistic images and art from natural language descriptions, with advanced capabilities for image editing and variation.',
    link: 'https://openai.com/dall-e-3',
    image_url: 'https://ih1.redbubble.net/image.4930945508.5459/fposter,small,wall_texture,square_product,600x600.jpg',
    company: 'OpenAI',
    status: 'Active',
    release_date: '2023-10-01',
    rating: 4.7,
    is_featured: true,
    pricing_type: 'Paid'
  },
  {
    name: 'Claude',
    description: 'Advanced AI assistant focused on helpful, harmless, and honest interactions, with strong capabilities in analysis and writing.',
    link: 'https://www.anthropic.com/claude',
    image_url: 'https://www.paubox.com/hubfs/Is%20Claude%20AI%20HIPAA%20compliant.jpg',
    company: 'Anthropic',
    status: 'Active',
    release_date: '2023-07-01',
    rating: 4.6,
    is_featured: true,
    pricing_type: 'Freemium'
  },
  {
    name: 'Copilot',
    description: "Microsoft's AI-powered coding assistant that helps developers write better code faster. Integrated with Visual Studio and GitHub.",
    link: 'https://github.com/features/copilot',
    image_url: 'https://static.vecteezy.com/system/resources/previews/046/861/635/non_2x/copilot-icon-transparent-background-free-png.png',
    company: 'Microsoft',
    status: 'Active',
    release_date: '2023-11-01',
    rating: 4.5,
    is_featured: true,
    pricing_type: 'Paid'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert categories
    console.log('📁 Inserting categories...');
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      return;
    }
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert tags
    console.log('🏷️  Inserting tags...');
    const { data: insertedTags, error: tagsError } = await supabase
      .from('tags')
      .insert(tags)
      .select();

    if (tagsError) {
      console.error('Error inserting tags:', tagsError);
      return;
    }
    console.log(`✅ Inserted ${insertedTags.length} tags`);

    // Insert tools with category references
    console.log('🔧 Inserting tools...');
    const toolsWithCategories = sampleTools.map(tool => ({
      ...tool,
      category_id: insertedCategories.find(cat => 
        cat.slug === 'ai-language-models' || cat.slug === 'ai-image-generation'
      )?.id
    }));

    const { data: insertedTools, error: toolsError } = await supabase
      .from('tools')
      .insert(toolsWithCategories)
      .select();

    if (toolsError) {
      console.error('Error inserting tools:', toolsError);
      return;
    }
    console.log(`✅ Inserted ${insertedTools.length} tools`);

    // Add some tool-tag relationships
    console.log('🔗 Creating tool-tag relationships...');
    const toolTagRelations = [];
    
    insertedTools.forEach(tool => {
      // Add relevant tags based on tool name
      const relevantTags = insertedTags.filter(tag => {
        if (tool.name === 'Gemini') return ['ai', 'language-model', 'multimodal'].includes(tag.slug);
        if (tool.name === 'ChatGPT') return ['ai', 'chatbot', 'language-model'].includes(tag.slug);
        if (tool.name === 'DALL·E') return ['ai-art', 'image-generation', 'creative'].includes(tag.slug);
        if (tool.name === 'Claude') return ['ai', 'assistant', 'language-model'].includes(tag.slug);
        if (tool.name === 'Copilot') return ['coding', 'ai-assistant', 'development'].includes(tag.slug);
        return false;
      });

      relevantTags.forEach(tag => {
        toolTagRelations.push({
          tool_id: tool.id,
          tag_id: tag.id
        });
      });
    });

    if (toolTagRelations.length > 0) {
      const { error: relationError } = await supabase
        .from('tool_tags')
        .insert(toolTagRelations);

      if (relationError) {
        console.error('Error creating tool-tag relations:', relationError);
        return;
      }
      console.log(`✅ Created ${toolTagRelations.length} tool-tag relationships`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${insertedCategories.length}`);
    console.log(`   Tags: ${insertedTags.length}`);
    console.log(`   Tools: ${insertedTools.length}`);
    console.log(`   Tool-Tag Relations: ${toolTagRelations.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run the seeding
seedDatabase();