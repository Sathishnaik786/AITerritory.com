const supabase = require('../config/database');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed categories
    const categories = [
      {
        name: 'AI Chatbots',
        description: 'Conversational AI tools and chatbot platforms',
        slug: 'ai-chatbots'
      },
      {
        name: 'Image Generators',
        description: 'AI-powered image creation and editing tools',
        slug: 'image-generators'
      },
      {
        name: 'Text Generators',
        description: 'AI writing and content generation tools',
        slug: 'text-generators'
      },
      {
        name: 'Video Tools',
        description: 'AI video creation and editing platforms',
        slug: 'video-tools'
      },
      {
        name: 'Audio Generators',
        description: 'AI audio and music generation tools',
        slug: 'audio-generators'
      },
      // Business-related categories
      {
        name: 'Business',
        description: 'AI tools for business, sales, marketing, and operations',
        slug: 'business'
      },
      {
        name: 'Productivity Tools',
        description: 'AI tools for productivity, writing, and organization',
        slug: 'productivity-tools'
      },
      {
        name: 'Automation & Integration',
        description: 'AI tools for workflow automation and integration',
        slug: 'automation-integration'
      },
      {
        name: 'Enterprise AI',
        description: 'AI platforms and tools for enterprise use',
        slug: 'enterprise-ai'
      },
      {
        name: 'Cloud AI Services',
        description: 'Cloud-based AI services and APIs',
        slug: 'cloud-ai-services'
      },
      {
        name: 'Communication & Meetings',
        description: 'AI tools for communication, meetings, and collaboration',
        slug: 'communication-meetings'
      }
    ];

    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'slug' })
      .select();

    if (categoryError) throw categoryError;
    console.log('Categories seeded successfully');

    // Seed tags
    const tags = [
      { name: 'Free', slug: 'free' },
      { name: 'Premium', slug: 'premium' },
      { name: 'Open Source', slug: 'open-source' },
      { name: 'API Available', slug: 'api-available' },
      { name: 'No Code', slug: 'no-code' },
      { name: 'Enterprise', slug: 'enterprise' }
    ];

    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .upsert(tags, { onConflict: 'slug' })
      .select();

    if (tagError) throw tagError;
    console.log('Tags seeded successfully');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;