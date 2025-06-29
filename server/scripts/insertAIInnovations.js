require('dotenv').config();
const supabase = require('../config/database');

const latestInnovations = [
  {
    title: "GPT-4 Vision",
    description: "OpenAI's multimodal model that can understand both images and text.",
    image: "https://blog-assets.writesonic.com/2023/11/GPT-4-Vision---Thumbnail.jpg",
    link: "https://openai.com/research/gpt-4v-system-card",
    category: "Multimodal AI"
  },
  {
    title: "Claude 3 Opus",
    description: "Anthropic's most powerful AI model with advanced reasoning capabilities.",
    image: "https://static.wixstatic.com/media/80ec8f_48a91958652e496c9b98bedcbe76b0e9~mv2.jpg/v1/fill/w_568,h_320,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/80ec8f_48a91958652e496c9b98bedcbe76b0e9~mv2.jpg",
    link: "https://www.anthropic.com/claude-3",
    category: "Language Model"
  },
  {
    title: "Gemini Pro",
    description: "Google's multimodal AI model that can understand and generate text, images, and code.",
    image: "https://www.geeky-gadgets.com/wp-content/uploads/2024/01/Google-Gemini-Pro-benchmarks.webp",
    link: "https://deepmind.google/technologies/gemini/",
    category: "Multimodal AI"
  }
];

const researchHighlights = [
  {
    title: "Self-Improving AI Systems",
    description: "Research on AI systems that can learn and improve themselves.",
    image: "https://miro.medium.com/v2/resize:fit:1400/0*vp2E-f3vughzmwGv.jpg",
    link: "https://www.emergence.ai/blog/self-improving-agents?utm_source=chatgpt.com",
    category: "AI Safety"
  },
  {
    title: "AI Safety & Alignment",
    description: "Latest developments in ensuring AI systems are safe and aligned with human values.",
    image: "https://community.intel.com/t5/image/serverpage/image-id/63685iCED55C57AF3AADD5/image-size/large?v=v2&px=999&whitelist-exif-data=Orientation%2CResolution%2COriginalDefaultFinalSize%2CCopyright",
    link: "https://safe.ai/?utm_source=chatgpt.com",
    category: "AI Safety"
  },
  {
    title: "Quantum AI",
    description: "Exploring the intersection of quantum computing and artificial intelligence.",
    image: "https://i.ytimg.com/vi/aGdunlA-Cis/maxresdefault.jpg",
    link: "https://www.dwavequantum.com/?utm_source=chatgpt.com",
    category: "Quantum Computing"
  }
];

const featuredPapers = [
  {
    title: "Large Language Models in Medicine",
    authors: "A.J. Thirunavukarasu et al.",
    abstract: "A comprehensive review of how LLMs like ChatGPT are developed and applied in clinical settings, exploring both their potential and limitations",
    link: "https://www.nature.com/articles/s41591-023-02448-8",
    image: "https://www.cell.com/cms/10.1016/j.isci.2024.109713/asset/8499c76a-9b71-40ed-acd3-d51efd448775/main.assets/gr3_lrg.jpg"
  },
  {
    title: "AI Safety and Alignment",
    authors: " Jiaming Ji et al",
    abstract: "A deep, survey-style paper covering the core principles of AI alignment—robustness, interpretability, controllability, and ethicality—complete with a curated landscape of current research directions.",
    link: "https://arxiv.org/abs/2402.02416",
    image: "https://pbs.twimg.com/media/GQIF6-gbUAEgTe8?format=png&name=large"
  }
];

async function insertAIInnovations() {
  // Insert latest innovations
  for (const innovation of latestInnovations) {
    const { error } = await supabase.from('ai_innovations').insert({
      type: 'latest',
      title: innovation.title,
      description: innovation.description,
      image: innovation.image,
      link: innovation.link,
      category: innovation.category,
    });
    if (error) {
      console.error(`Error inserting latest innovation ${innovation.title}:`, JSON.stringify(error, null, 2));
    }
  }
  // Insert research highlights
  for (const research of researchHighlights) {
    const { error } = await supabase.from('ai_innovations').insert({
      type: 'research',
      title: research.title,
      description: research.description,
      image: research.image,
      link: research.link,
      category: research.category,
    });
    if (error) {
      console.error(`Error inserting research highlight ${research.title}:`, JSON.stringify(error, null, 2));
    }
  }
  // Insert featured papers
  for (const paper of featuredPapers) {
    const { error } = await supabase.from('ai_research_papers').insert({
      title: paper.title,
      authors: paper.authors,
      abstract: paper.abstract,
      link: paper.link,
      image: paper.image,
    });
    if (error) {
      console.error(`Error inserting research paper ${paper.title}:`, JSON.stringify(error, null, 2));
    }
  }
  console.log('All AI innovations and research papers inserted!');
}

insertAIInnovations(); 