require('dotenv').config();
const supabase = require('../config/database');

async function checkAndUpdateFeaturedTrending() {
  try {
    console.log('Starting checkAndUpdateFeaturedTrending...');
    console.log('Database URL:', process.env.SUPABASE_URL ? 'Set' : 'Not set');
    
    // First, let's check if we can connect to the database
    const { data: testData, error: testError } = await supabase
      .from('tools')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Database connection test failed:', testError);
      return;
    }
    
    console.log('Database connection successful');
    
    // Get total count of tools
    const { count: totalTools, error: countError } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting tools:', countError);
      return;
    }
    
    console.log('Total tools in database:', totalTools);
    
    // Check current featured tools
    const { data: featuredTools, error: featuredError } = await supabase
      .from('tools')
      .select('id, name, is_featured, is_trending')
      .eq('is_featured', true);
    
    if (featuredError) {
      console.error('Error fetching featured tools:', featuredError);
      return;
    }
    
    console.log('Current featured tools:', featuredTools?.length || 0);
    if (featuredTools && featuredTools.length > 0) {
      featuredTools.forEach(tool => {
        console.log(`- ${tool.name} (ID: ${tool.id})`);
      });
    }
    
    // Check current trending tools
    const { data: trendingTools, error: trendingError } = await supabase
      .from('tools')
      .select('id, name, is_featured, is_trending')
      .eq('is_trending', true);
    
    if (trendingError) {
      console.error('Error fetching trending tools:', trendingError);
      return;
    }
    
    console.log('Current trending tools:', trendingTools?.length || 0);
    if (trendingTools && trendingTools.length > 0) {
      trendingTools.forEach(tool => {
        console.log(`- ${tool.name} (ID: ${tool.id})`);
      });
    }
    
    // If no featured or trending tools, let's set some
    if ((!featuredTools || featuredTools.length === 0) && (!trendingTools || trendingTools.length === 0)) {
      console.log('No featured or trending tools found. Setting some popular tools...');
      
      // Get all tools to select from
      const { data: allTools, error: allToolsError } = await supabase
        .from('tools')
        .select('id, name, rating')
        .order('rating', { ascending: false })
        .limit(10);
      
      if (allToolsError) {
        console.error('Error fetching all tools:', allToolsError);
        return;
      }
      
      console.log('Found tools to potentially mark as featured/trending:', allTools?.length || 0);
      
      if (allTools && allTools.length > 0) {
        // Set first 3 tools as featured
        const featuredUpdates = allTools.slice(0, 3).map(tool => ({
          id: tool.id,
          is_featured: true
        }));
        
        // Set next 3 tools as trending
        const trendingUpdates = allTools.slice(3, 6).map(tool => ({
          id: tool.id,
          is_trending: true
        }));
        
        console.log('Setting featured tools:', featuredUpdates.map(t => t.id));
        console.log('Setting trending tools:', trendingUpdates.map(t => t.id));
        
        // Update featured tools
        for (const update of featuredUpdates) {
          const { error } = await supabase
            .from('tools')
            .update({ is_featured: true })
            .eq('id', update.id);
          
          if (error) {
            console.error(`Error updating featured tool ${update.id}:`, error);
          } else {
            console.log(`Updated tool ${update.id} as featured`);
          }
        }
        
        // Update trending tools
        for (const update of trendingUpdates) {
          const { error } = await supabase
            .from('tools')
            .update({ is_trending: true })
            .eq('id', update.id);
          
          if (error) {
            console.error(`Error updating trending tool ${update.id}:`, error);
          } else {
            console.log(`Updated tool ${update.id} as trending`);
          }
        }
        
        console.log('Successfully updated featured and trending tools!');
      }
    } else {
      console.log('Featured and trending tools already exist in the database.');
    }
    
  } catch (error) {
    console.error('Error in checkAndUpdateFeaturedTrending:', error);
  }
}

// Run the function
checkAndUpdateFeaturedTrending()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 