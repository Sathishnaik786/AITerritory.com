require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const supabase = require('../config/database');
const { toolsData } = require('./toolsData');

async function getCategoryMap() {
  const { data, error } = await supabase.from('categories').select('id, name');
  if (error) throw error;
  const map = {};
  for (const cat of data) {
    map[cat.name.trim().toLowerCase()] = cat.id;
  }
  return map;
}

async function getTagMap() {
  const { data, error } = await supabase.from('tags').select('id, name');
  if (error) throw error;
  const map = {};
  for (const tag of data) {
    map[tag.name.trim().toLowerCase()] = tag.id;
  }
  return map;
}

async function upsertTag(tagName) {
  const slug = tagName.trim().toLowerCase().replace(/\s+/g, '-');
  const { data, error } = await supabase
    .from('tags')
    .upsert([{ name: tagName, slug }], { onConflict: 'slug' })
    .select();
  if (error) throw error;
  return data[0].id;
}

async function insertTools() {
  const categoryMap = await getCategoryMap();
  let tagMap = await getTagMap();

  for (const tool of toolsData) {
    // Map category name to category_id
    const category_id = categoryMap[tool.category.trim().toLowerCase()] || null;
    const toolRecord = {
      name: tool.name,
      description: tool.description,
      link: tool.link,
      company: tool.company,
      image_url: tool.image,
      status: tool.status || 'Active',
      release_date: tool.releaseDate,
      icon: tool.icon,
      category_id,
    };

    // Insert tool
    const { data: toolData, error: toolError } = await supabase.from('tools').insert([toolRecord]).select().single();
    if (toolError) {
      console.error(`Error inserting tool ${tool.name}:`, toolError);
      continue;
    }
    const tool_id = toolData.id;
    console.log(`Inserted tool: ${tool.name}`);

    // Handle tags
    if (tool.tags && tool.tags.length > 0) {
      for (const tagName of tool.tags) {
        let tag_id = tagMap[tagName.trim().toLowerCase()];
        if (!tag_id) {
          tag_id = await upsertTag(tagName);
          tagMap = await getTagMap(); // Refresh tag map
        }
        // Insert into tool_tags
        const { error: toolTagError } = await supabase.from('tool_tags').upsert([
          { tool_id, tag_id }
        ], { onConflict: ['tool_id', 'tag_id'] });
        if (toolTagError) {
          console.error(`Error linking tag '${tagName}' to tool '${tool.name}':`, toolTagError);
        }
      }
    }

    // Handle subTools
    if (tool.subTools && tool.subTools.length > 0) {
      for (const sub of tool.subTools) {
        const subToolRecord = {
          parent_tool_id: tool_id,
          name: sub.name,
          description: sub.description,
          link: sub.link,
        };
        const { error: subToolError } = await supabase.from('sub_tools').insert([subToolRecord]);
        if (subToolError) {
          console.error(`Error inserting subTool '${sub.name}' for tool '${tool.name}':`, subToolError);
        }
      }
    }
  }
}

insertTools().then(() => {
  console.log('All tools, tags, and subTools inserted!');
  process.exit(0);
}); 