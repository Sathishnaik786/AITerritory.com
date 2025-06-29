const supabase = require('../lib/supabase');

const dummyTestimonials = [
  {
    user_id: null,
    user_name: 'Sarah Johnson',
    user_role: 'Content Creator',
    user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content: 'AI Territory has been a game-changer for my content creation workflow. The curated tools save me hours of research and the quality is consistently excellent.',
    approved: true
  },
  {
    user_id: null,
    user_name: 'Michael Chen',
    user_role: 'Product Designer',
    user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'As a designer, I need the best AI tools to stay competitive. This platform has everything I need in one place. Highly recommended!',
    approved: true
  },
  {
    user_id: null,
    user_name: 'Emily Rodriguez',
    user_role: 'Marketing Manager',
    user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'The AI tools directory here is incredibly comprehensive. I found several tools that have revolutionized our marketing campaigns.',
    approved: true
  },
  {
    user_id: null,
    user_name: 'David Kim',
    user_role: 'Startup Founder',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'Running a startup means we need to be efficient with every tool we use. AI Territory helps us find the perfect solutions quickly.',
    approved: true
  },
  {
    user_id: null,
    user_name: 'Lisa Thompson',
    user_role: 'Digital Artist',
    user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    content: 'The image generation tools featured here are absolutely amazing. I\'ve discovered so many new techniques for my artwork.',
    approved: true
  },
  {
    user_id: null,
    user_name: 'Alex Morgan',
    user_role: 'Software Developer',
    user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    content: 'As a developer, I appreciate how well-organized and categorized the tools are. It makes finding the right AI solution so much easier.',
    approved: true
  }
];

async function insertTestimonials() {
  try {
    console.log('Inserting dummy testimonials...');
    
    const { data, error } = await supabase
      .from('testimonials')
      .insert(dummyTestimonials)
      .select();

    if (error) {
      console.error('Error inserting testimonials:', error);
      return;
    }

    console.log('Successfully inserted testimonials:', data.length);
    console.log('Testimonials data:', data);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the script
insertTestimonials(); 