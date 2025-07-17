"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useAppleCarouselCards } from "@/hooks/useAppleCarouselCards";

export default function AppleCardsCarouselDemo() {
  const { cards, loading, error } = useAppleCarouselCards();

  if (loading) return <div className="py-20 text-center">Loading...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;
  if (!cards.length) return <div className="py-20 text-center">No cards found.</div>;

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Create Stunning Images with Prompts
      </h2>
      <Carousel
        items={cards.map((card: any, index: number) => (
          <Card
            key={card.id}
            card={{
              src: card.image_url,
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
        ))}
      />
    </div>
  );
} 