const supabase = require('../lib/supabase');

const categories = [
  'Ethereum Developer',
  'Linux Terminal',
  'JavaScript Console',
  'Excel Sheet',
  'UX/UI Developer',
  'Cyber Security Specialist',
  'Web Design Consultant',
  'Smart Domain Name Generator',
  'Tech Reviewer',
  'Developer Relations Consultant',
  'IT Architect',
  'Scientific Data Visualizer',
  'Tech Writer',
];

async function seedPrompts() {
  const prompts = [];

  categories.forEach(category => {
    for (let i = 1; i <= 10; i++) {
      prompts.push({
        title: `Sample Prompt ${i} for ${category}`,
        description: `This is a sample description for prompt ${i} in the ${category} category.`,
        category,
        author: `author_${category.replace(/\s/g, '').toLowerCase()}`,
      });
    }
  });

  const { data, error } = await supabase
    .from('prompts')
    .insert(prompts);

  if (error) {
    console.error('Error inserting prompts:', error);
  } else {
    console.log('Inserted prompts:', data ? data.length : 0);
  }
}

seedPrompts(); 