const API_BASE_URL = 'http://localhost:3003/api';

async function updateExistingBlog() {
  console.log('🧪 Updating existing blog with content...\n');

  try {
    const blogSlug = 'ai-agents-reshaping-2025-workflows';
    
    // First, let's check the current state of the blog
    console.log('1. Checking current blog state...');
    const fetchResponse = await fetch(`${API_BASE_URL}/blogs/${blogSlug}`);
    
    if (fetchResponse.ok) {
      const currentBlog = await fetchResponse.json();
      console.log('Current blog state:');
      console.log('Title:', currentBlog.title);
      console.log('Description length:', currentBlog.description?.length || 0);
      console.log('Content length:', currentBlog.content?.length || 0);
      
      // Update the blog with rich content
      console.log('\n2. Updating blog with rich content...');
      const updatedBlog = {
        ...currentBlog,
        description: '<h3>AI Agents Revolution</h3><p>Discover how <strong>autonomous AI agents</strong> are <em>reshaping</em> the future of work in 2025. This comprehensive guide explores the latest developments in <a href="https://example.com/ai-trends">AI technology</a> and their impact on business workflows.</p><ul><li>Automated decision-making</li><li>Intelligent process optimization</li><li>Seamless human-AI collaboration</li></ul>',
        content: '<h1>AI Agents Are Taking Over: How Autonomous AI Is Reshaping 2025 Workflows</h1><p>The landscape of work is undergoing a <strong>revolutionary transformation</strong> as autonomous AI agents become increasingly sophisticated and integrated into our daily operations.</p><h2>The Rise of Autonomous AI</h2><p>In 2025, we\'re witnessing an unprecedented shift in how businesses operate. AI agents are no longer just tools—they\'re becoming <em>intelligent collaborators</em> that can understand context, make decisions, and execute complex tasks autonomously.</p><h3>Key Benefits of AI Agents</h3><ul><li><strong>24/7 Availability:</strong> AI agents work around the clock without fatigue</li><li><strong>Scalability:</strong> Handle multiple tasks simultaneously</li><li><strong>Consistency:</strong> Maintain quality standards across all operations</li><li><strong>Cost Efficiency:</strong> Reduce operational costs significantly</li></ul><h2>Real-World Applications</h2><p>From customer service to data analysis, AI agents are transforming every aspect of business operations. Companies that embrace this technology are seeing <strong>dramatic improvements</strong> in efficiency and productivity.</p><blockquote><p>"The future belongs to those who can effectively collaborate with AI agents to achieve their goals."</p></blockquote><h2>Looking Ahead</h2><p>As we move further into 2025, the integration of AI agents will become even more seamless. The key to success lies in understanding how to <em>leverage these powerful tools</em> while maintaining human oversight and creativity.</p>'
      };

      const updateResponse = await fetch(`${API_BASE_URL}/blogs/${currentBlog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
      });

      if (updateResponse.ok) {
        const updatedResult = await updateResponse.json();
        console.log('✅ Blog updated successfully!');
        console.log('Updated description length:', updatedResult.description?.length || 0);
        console.log('Updated content length:', updatedResult.content?.length || 0);
        
        // Verify the update
        console.log('\n3. Verifying the update...');
        const verifyResponse = await fetch(`${API_BASE_URL}/blogs/${blogSlug}`);
        
        if (verifyResponse.ok) {
          const verifiedBlog = await verifyResponse.json();
          console.log('✅ Verification successful!');
          console.log('Final description length:', verifiedBlog.description?.length || 0);
          console.log('Final content length:', verifiedBlog.content?.length || 0);
          
          if (verifiedBlog.description && verifiedBlog.content) {
            console.log('✅ Blog now has content - should display properly!');
            console.log('\n🌐 Test URL: http://localhost:8080/blog/ai-agents-reshaping-2025-workflows');
          } else {
            console.log('❌ Blog still missing content');
          }
        } else {
          console.log('❌ Failed to verify update');
        }
      } else {
        const errorText = await updateResponse.text();
        console.log('❌ Failed to update blog');
        console.log('Error response:', errorText);
      }
    } else {
      console.log('❌ Failed to fetch current blog');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

updateExistingBlog(); 