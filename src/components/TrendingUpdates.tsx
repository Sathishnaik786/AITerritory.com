import { TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UpdateCard {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  companyLogo: string;
  companyName: string;
}

const trendingUpdates: UpdateCard[] = [
  {
    id: 1,
    title: "GPT-5 Development",
    description: "OpenAI announces major improvements in reasoning capabilities",
    date: "2024-03-20",
    category: "Language Models",
    image: "https://picsum.photos/400/200?random=1",
    companyLogo: "https://picsum.photos/50/50?random=1",
    companyName: "OpenAI"
  },
  {
    id: 2,
    title: "Stable Diffusion 3.0",
    description: "New image generation model with enhanced quality and control",
    date: "2024-03-19",
    category: "Image Generation",
    image: "https://picsum.photos/400/200?random=2",
    companyLogo: "https://picsum.photos/50/50?random=2",
    companyName: "Stability AI"
  },
  {
    id: 3,
    title: "Claude 3 Release",
    description: "Anthropic's latest model shows significant performance gains",
    date: "2024-03-18",
    category: "Language Models",
    image: "https://picsum.photos/400/200?random=3",
    companyLogo: "https://picsum.photos/50/50?random=3",
    companyName: "Anthropic"
  },
  {
    id: 4,
    title: "AI Video Generation",
    description: "New breakthrough in real-time video synthesis",
    date: "2024-03-17",
    category: "Video Generation",
    image: "https://picsum.photos/400/200?random=4",
    companyLogo: "https://picsum.photos/50/50?random=4",
    companyName: "Runway"
  },
  {
    id: 5,
    title: "Multimodal AI Models",
    description: "New models that can process text, images, and audio simultaneously",
    date: "2024-03-16",
    category: "Multimodal AI",
    image: "https://picsum.photos/400/200?random=5",
    companyLogo: "https://picsum.photos/50/50?random=5",
    companyName: "Google AI"
  },
  {
    id: 6,
    title: "AI in Healthcare",
    description: "Breakthrough in medical diagnosis using AI",
    date: "2024-03-15",
    category: "Healthcare",
    image: "https://picsum.photos/400/200?random=6",
    companyLogo: "https://picsum.photos/50/50?random=6",
    companyName: "DeepMind"
  }
];

export function TrendingUpdates() {
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = window.innerWidth < 768 ? 1 : 3;
  const totalPages = Math.ceil(trendingUpdates.length / cardsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  const visibleCards = trendingUpdates.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  return (
    <section className="py-12 mt-8">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Trending AI Updates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleCards.map((update) => (
            <div
              key={update.id}
              className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              {update.image && (
                <div className="relative aspect-video w-full">
                  <img
                    src={update.image}
                    alt={update.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-medium bg-primary/90 text-primary-foreground rounded-full">
                      {update.category}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                {/* Company Logo and Name */}
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src={update.companyLogo}
                    alt={update.companyName}
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    {update.companyName}
                  </span>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg md:text-xl mb-2 line-clamp-2">{update.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {update.date}
                  </span>
                </div>
                <p className="text-sm md:text-base text-muted-foreground line-clamp-3 flex-1">
                  {update.description}
                </p>
                <div className="mt-4 flex justify-end">
                  <button className="text-sm md:text-base text-primary hover:underline">
                    Read more →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 