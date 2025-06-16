const mongoose = require('mongoose');
const Tool = require('../models/Tool');
const Category = require('../models/Category');
const User = require('../models/User');
require('dotenv').config();

// Sample data based on your frontend
const categories = [
  {
    name: 'AI Language Models',
    slug: 'ai-language-models',
    description: 'Advanced language models for text generation and understanding',
    icon: '🤖',
    color: '#3B82F6',
    featured: true,
    order: 1
  },
  {
    name: 'Image Generators',
    slug: 'image-generators',
    description: 'AI tools for creating and editing images',
    icon: '🎨',
    color: '#8B5CF6',
    featured: true,
    order: 2
  },
  {
    name: 'Productivity Tools',
    slug: 'productivity-tools',
    description: 'AI-powered tools to boost productivity and efficiency',
    icon: '⚡',
    color: '#10B981',
    featured: true,
    order: 3
  },
  {
    name: 'Development Tools',
    slug: 'development-tools',
    description: 'AI tools for developers and programmers',
    icon: '💻',
    color: '#F59E0B',
    featured: true,
    order: 4
  }
];

const tools = [
  {
    name: 'ChatGPT',
    category: 'AI Language Models',
    description: 'Advanced conversational AI model capable of understanding and generating human-like text across various domains and tasks.',
    link: 'https://chat.openai.com',
    status: 'Released',
    tags: ['AI', 'Chatbot', 'Language Model'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    company: 'OpenAI',
    rating: 4.8,
    reviewCount: 1250,
    viewCount: 15000,
    bookmarkCount: 3200,
    featured: true,
    verified: true,
    pricing: 'Freemium'
  },
  {
    name: 'DALL·E',
    category: 'Image Generators',
    description: 'AI system that creates realistic images and art from natural language descriptions, with advanced capabilities for image editing and variation.',
    link: 'https://openai.com/dall-e-3',
    status: 'Released',
    tags: ['AI Art', 'Image Generation', 'Creative'],
    image: 'https://ih1.redbubble.net/image.4930945508.5459/fposter,small,wall_texture,square_product,600x600.jpg',
    company: 'OpenAI',
    rating: 4.6,
    reviewCount: 890,
    viewCount: 12000,
    bookmarkCount: 2800,
    featured: true,
    verified: true,
    pricing: 'Paid'
  },
  {
    name: 'Notion AI',
    category: 'Productivity Tools',
    description: 'Smart note-taking, summaries & task planning integrated into the popular Notion workspace.',
    link: 'https://notion.so',
    status: 'Released',
    tags: ['Workspace AI', 'Notion', 'Productivity'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsm_Vlpik1sY_SiDoH6dhDdRFjAShmquOPQA&s',
    company: 'Notion',
    rating: 4.5,
    reviewCount: 650,
    viewCount: 8500,
    bookmarkCount: 1900,
    featured: true,
    verified: true,
    pricing: 'Freemium'
  },
  {
    name: 'GitHub Copilot',
    category: 'Development Tools',
    description: 'AI-powered coding assistant that helps developers write better code faster. Integrated with Visual Studio and GitHub.',
    link: 'https://github.com/features/copilot',
    status: 'Released',
    tags: ['Coding', 'AI Assistant', 'Development'],
    image: 'https://static.vecteezy.com/system/resources/previews/046/861/635/non_2x/copilot-icon-transparent-background-free-png.png',
    company: 'Microsoft',
    rating: 4.7,
    reviewCount: 980,
    viewCount: 11000,
    bookmarkCount: 2400,
    featured: true,
    verified: true,
    pricing: 'Paid'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-tools-db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Tool.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create tools
    const toolsWithApproval = tools.map(tool => ({
      ...tool,
      approved: true,
      approvedAt: new Date()
    }));
    
    const createdTools = await Tool.insertMany(toolsWithApproval);
    console.log(`Created ${createdTools.length} tools`);

    // Create admin user
    const adminUser = new User({
      email: 'admin@aiterritory.com',
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });
    
    await adminUser.save();
    console.log('Created admin user');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();