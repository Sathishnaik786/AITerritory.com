"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export default function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Create Stunning Images With Prompts
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <img
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height="500"
              width="500"
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

const data = [
  {
    category: "Artificial Intelligence",
    title: "You can do more with AI.",
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Productivity",
    title: "Enhance your productivity.",
    src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Product",
    title: "Launching the new Apple Vision Pro.",
    src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },

  {
    category: "Product",
    title: "Maps for your iPhone 15 Pro Max.",
    src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "iOS",
    title: "Photography just got better.",
    src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://videos.openai.com/vg-assets/assets%2Ftask_01k08vc277e14atj1r0804e71x%2F1752643834_img_1.webp?st=2025-07-17T04%3A36%3A34Z&se=2025-07-23T05%3A36%3A34Z&sks=b&skt=2025-07-17T04%3A36%3A34Z&ske=2025-07-23T05%3A36%3A34Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=XZMF1pY2zV5M7JdjMP5stxj2%2B62UdAwtrCQSMrJv4go%3D&az=oaivgprodscus",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://videos.openai.com/vg-assets/assets%2Ftask_01k06ygg4zffqb8ytv8mw0p3w9%2F1752580013_img_0.webp?st=2025-07-17T04%3A37%3A19Z&se=2025-07-23T05%3A37%3A19Z&sks=b&skt=2025-07-17T04%3A37%3A19Z&ske=2025-07-23T05%3A37%3A19Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=fksQoiL4oO9LUkAjkt%2FeyhpgJo%2FfAG9DW7tb2PXMgSs%3D&az=oaivgprodscus",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://videos.openai.com/vg-assets/assets%2Ftask_01k079rkgqfw58tng7vq669pa3%2F1752591888_img_0.webp?st=2025-07-17T03%3A41%3A30Z&se=2025-07-23T04%3A41%3A30Z&sks=b&skt=2025-07-17T03%3A41%3A30Z&ske=2025-07-23T04%3A41%3A30Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=gFm5h6b8BzhaOc0fut8e06yvIoku%2FhZzQnnQGuHF8Qw%3D&az=oaivgprodscus",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://videos.openai.com/vg-assets/assets%2Ftask_01k0bbyv9he23b7hgqwrwfk23b%2F1752728413_img_1.webp?st=2025-07-17T03%3A41%3A30Z&se=2025-07-23T04%3A41%3A30Z&sks=b&skt=2025-07-17T03%3A41%3A30Z&ske=2025-07-23T04%3A41%3A30Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=LC6l1WRlIymFZgY4tQjODOn9GEKBSmD1ZMf1uCjYNs8%3D&az=oaivgprodscus",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://videos.openai.com/vg-assets/assets%2Ftask_01k0936yyfe3earjmszhr08twa%2F1752652109_img_0.webp?st=2025-07-17T05%3A32%3A45Z&se=2025-07-23T06%3A32%3A45Z&sks=b&skt=2025-07-17T05%3A32%3A45Z&ske=2025-07-23T06%3A32%3A45Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=O5nkF0F94x%2BTsoFehpS1rVvm%2FV%2FPDLsDmqUqDX0Sb4g%3D&az=oaivgprodscus",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://videos.openai.com/vg-assets/assets%2Ftask_01k037ac55fzkv6n5vcg4gwkj5%2F1752455064_img_0.webp?st=2025-07-17T05%3A32%3A45Z&se=2025-07-23T06%3A32%3A45Z&sks=b&skt=2025-07-17T05%3A32%3A45Z&ske=2025-07-23T06%3A32%3A45Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=aCcV28QCAFKyHr1DZGh7GXxul0YJRDNohRGT8FT5sWM%3D&az=oaivgprodscus",
    content: <DummyContent />,
  },
  {
    category: "Hiring",
    title: "",
    src: "https://videos.openai.com/vg-assets/assets%2Ftask_01k092474eegk8na3mpmkgsm9e%2F1752650921_img_0.webp?st=2025-07-17T03%3A41%3A52Z&se=2025-07-23T04%3A41%3A52Z&sks=b&skt=2025-07-17T03%3A41%3A52Z&ske=2025-07-23T04%3A41%3A52Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=0xHLSfCENfSf7TY9BHvCe5oBEhh%2B6qhaFhH3PcsrbC4%3D&az=oaivgprodscus",
    content: <DummyContent />,
  },
]; 