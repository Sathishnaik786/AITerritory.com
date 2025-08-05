"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useAppleCarouselCards } from "@/hooks/useAppleCarouselCards";

// Error Boundary for debugging
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error('AppleCardsCarouselDemo ErrorBoundary caught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{color: 'red'}}>AppleCardsCarouselDemo Error: {String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

export default function AppleCardsCarouselDemo() {
  const { cards, loading, error } = useAppleCarouselCards();

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;
  if (!cards.length) return <div className="py-20 text-center">No cards found.</div>;

  // Debug: log raw cards
  console.log('Raw cards from API:', cards);

  // Helper to safely stringify any value
  function safeString(val: any) {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  }

  // Defensive mapping: ensure all fields are strings, even if object/array
  const safeCards = cards.map((card: any) => ({
    ...card,
    src: safeString(card.image_url ?? card.src ?? ''),
    title: safeString(card.title ?? ''),
    category: safeString(card.category ?? ''),
    content: safeString(card.content ?? ''),
  }));

  return (
    <ErrorBoundary>
      <div className="w-full h-full py-20">
        <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
          Create Stunning Images with Prompts
        </h2>
        <Carousel
          items={safeCards.map((card: any, index: number) => {
            console.log('Mapping card:', card);
            return (
              <Card
                key={card.id}
                card={{
                  src: card.src,
                  title: card.title,
                  category: card.category,
                  content: card.content, // pass the raw string
                  contentNode: (
                    <div className="p-6 text-base md:text-lg text-neutral-700 dark:text-neutral-200 whitespace-pre-line">
                      {card.content}
                    </div>
                  ),
                }}
                index={index}
              />
            );
          })}
        />
      </div>
    </ErrorBoundary>
  );
} 