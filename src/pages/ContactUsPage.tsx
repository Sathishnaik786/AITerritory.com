import React from 'react';

const ContactUsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-muted-foreground mb-8">
        We're here to help! Reach out to us with any questions, feedback, or inquiries.
      </p>
      <div className="space-y-4">
        <p className="text-md">
          <strong>Email:</strong> <a href="mailto:info@viralai.com" className="text-blue-600 hover:underline">info@viralai.com</a>
        </p>
        <p className="text-md">
          <strong>Phone:</strong> +1 (123) 456-7890
        </p>
        <p className="text-md">
          <strong>Address:</strong> 123 AI Avenue, Innovation City, AI 90210
        </p>
      </div>
    </div>
  );
};

export default ContactUsPage; 