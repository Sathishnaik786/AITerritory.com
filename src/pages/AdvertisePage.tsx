import React from 'react';

const AdvertisePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Advertise with Us</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Interested in reaching a wide audience of AI enthusiasts and professionals?
        Advertise your AI tools, services, or products on Viralai.
      </p>
      <p className="text-md">
        For more information on advertising opportunities and rates, please contact us at:
      </p>
      <p className="text-md mt-2">
        <strong>Email:</strong> <a href="mailto:advertise@viralai.com" className="text-blue-600 hover:underline">advertise@viralai.com</a>
      </p>
    </div>
  );
};

export default AdvertisePage; 