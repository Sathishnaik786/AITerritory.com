import React, { useState } from 'react';
import { Newsletter } from '../components/Newsletter';
import { Button } from '../components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { SiDiscord } from 'react-icons/si';
import { Instagram } from 'lucide-react';
import Prompts from '../components/Prompts';
import SEO from '../components/SEO';

const PromptsPage = () => {
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const socialLinks = [
    { name: 'WhatsApp Channel', icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029VbBBKQJ2f3EF2b4nIU0j', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'WhatsApp Community', icon: FaWhatsapp, url: 'https://chat.whatsapp.com/HggDqZGp3fSIQLL4Nqyzs9', color: 'bg-[#25D366] hover:bg-[#128C7E]' },
    { name: 'Discord', icon: SiDiscord, url: 'https://discord.com/invite/sathish_0086', color: 'bg-[#5865F2] hover:bg-[#4752C4]' },
    { name: 'Instagram', icon: Instagram, url: 'https://taap.it/e51U32', color: 'bg-gradient-to-r from-[#E4405F] to-[#833AB4] hover:from-[#C13584] hover:to-[#833AB4]' },
    { name: 'Twitter', icon: FaXTwitter, url: 'https://taap.it/UYrKPV', color: 'bg-black hover:bg-gray-800' },
  ];

  return (
    <>
      <SEO
        title="AI Prompts Library | AI Territory"
        description="Unlock the power of AI with our extensive library of prompts for various tasks. Get expert tips and creative inspiration."
      />
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Unlock the Power of AI Prompts</h2>
          <p className="mb-6">
            Get the best AI prompts, expert tips, and creative inspiration delivered to your inbox.
          </p>
          <Button variant="secondary" size="lg" className="group" onClick={() => setNewsletterOpen(true)}>
            Subscribe for Prompt Updates
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <Newsletter
          isOpen={newsletterOpen}
          onClose={() => setNewsletterOpen(false)}
          title="Subscribe for Prompt Updates"
          subtitle="Get the best AI prompts, expert tips, and creative inspiration delivered to your inbox."
          socialLinks={socialLinks}
        />
      </div>
      {/* Prompts List Section */}
      <Prompts />
    </div>
    </>
  );
};

export default PromptsPage; 