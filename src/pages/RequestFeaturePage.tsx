import React from 'react';

const RequestFeaturePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Request a Feature</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Have an idea for a new feature or improvement on Viralai?
        We value your input!
      </p>
      <div className="space-y-4">
        <p className="text-md">
          Submit your feature request through our dedicated form:
          <a href="#" className="text-blue-600 hover:underline ml-2">Feature Request Form</a>
        </p>
        <p className="text-md">
          We appreciate your contribution to making Viralai even better!
        </p>
      </div>
    </div>
  );
};

export default RequestFeaturePage; 