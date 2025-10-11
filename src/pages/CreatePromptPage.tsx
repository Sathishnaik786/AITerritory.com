import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaArrowLeft } from 'react-icons/fa';
import CreatePromptForm from '@/components/CreatePromptForm';
import SEO from '@/components/SEO';

export default function CreatePromptPage() {
  return (
    <>
      <SEO
        title="Create New AI Prompt | AI Territory"
        description="Share your AI prompts with the community. Create and submit new prompts with images."
      />
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/prompts">
              <Button variant="ghost" className="flex items-center gap-2">
                <FaArrowLeft /> Back to Prompts
              </Button>
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <CreatePromptForm />
          </div>
        </div>
      </div>
    </>
  );
}