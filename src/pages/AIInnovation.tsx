import React from 'react';
import { ArrowRight, BookOpen, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const AIInnovation = () => {
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
      authors:" Jiaming Ji et al",
      abstract: "A deep, survey-style paper covering the core principles of AI alignment—robustness, interpretability, controllability, and ethicality—complete with a curated landscape of current research directions.",
      link: "https://arxiv.org/abs/2402.02416",
      image: "https://pbs.twimg.com/media/GQIF6-gbUAEgTe8?format=png&name=large"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Innovation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay at the forefront of artificial intelligence with the latest breakthroughs, 
          research, and technological advancements shaping the future of AI.
        </p>
      </div>

      {/* Latest Innovations */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Latest Innovations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestInnovations.map((innovation, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video relative mb-4">
                  <img
                    src={innovation.image}
                    alt={innovation.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <CardTitle className="text-2xl">{innovation.title}</CardTitle>
                <CardDescription>{innovation.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    {innovation.category}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={innovation.link} target="_blank" rel="noopener noreferrer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learn More
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Research Highlights */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Research Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchHighlights.map((research, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video relative mb-4">
                  <img
                    src={research.image}
                    alt={research.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
                <CardTitle className="text-2xl">{research.title}</CardTitle>
                <CardDescription>{research.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                    {research.category}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={research.link} target="_blank" rel="noopener noreferrer">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Read Research
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Innovation Trends */}
      <div className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Track AI Innovation Trends</h2>
          <p className="mb-6">
            Get weekly updates on the latest AI innovations, research papers, and breakthrough technologies.
          </p>
          <Button variant="secondary" size="lg" className="group">
            Subscribe to Updates
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Research Papers Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Featured Research Papers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredPapers.map((paper, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={paper.image}
                    alt={paper.title}
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <CardTitle>{paper.title}</CardTitle>
                    <CardDescription>By {paper.authors}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{paper.abstract}</p>
                <Button asChild variant="outline">
                  <a href={paper.link} target="_blank" rel="noopener noreferrer">
                    Read Paper
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInnovation; 