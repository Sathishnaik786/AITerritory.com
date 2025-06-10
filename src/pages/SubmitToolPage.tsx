import React from 'react';

const SubmitToolPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Submit a Tool</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Have an AI tool you'd like to feature on Viralai?
        We welcome submissions that enhance our collection of cutting-edge AI resources.
      </p>
      <div className="space-y-4">
        <p className="text-md">
          Please review our <a href="#" className="text-blue-600 hover:underline">submission guidelines</a> before proceeding.
        </p>
        <p className="text-md">
          Ready to submit? Fill out our <a href="#" className="text-blue-600 hover:underline">tool submission form</a>.
        </p>
      </div>
    </div>
  );
};

export default SubmitToolPage; 