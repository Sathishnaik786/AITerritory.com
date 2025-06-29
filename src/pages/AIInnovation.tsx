import React from 'react';
import { ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAIInnovations, useAIResearchPapers } from '../hooks/useAIInnovations';

const AIInnovation = () => {
  // Fetch latest innovations and research highlights
  const { data: innovations, isLoading: loadingInnovations, error: errorInnovations } = useAIInnovations();
  const { data: researchPapers, isLoading: loadingPapers, error: errorPapers } = useAIResearchPapers();

  // Split innovations by type
  const latestInnovations = innovations?.filter((item: any) => item.type === 'latest') || [];
  const researchHighlights = innovations?.filter((item: any) => item.type === 'research') || [];

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
        {loadingInnovations ? (
          <div>Loading innovations...</div>
        ) : errorInnovations ? (
          <div className="text-red-500">Failed to load innovations.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestInnovations.map((innovation: any, index: number) => (
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
        )}
      </div>

      {/* Research Highlights */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Research Highlights</h2>
        {loadingInnovations ? (
          <div>Loading research highlights...</div>
        ) : errorInnovations ? (
          <div className="text-red-500">Failed to load research highlights.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchHighlights.map((research: any, index: number) => (
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
        )}
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
        {loadingPapers ? (
          <div>Loading research papers...</div>
        ) : errorPapers ? (
          <div className="text-red-500">Failed to load research papers.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchPapers?.map((paper: any, index: number) => (
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
        )}
      </div>
    </div>
  );
};

export default AIInnovation; 