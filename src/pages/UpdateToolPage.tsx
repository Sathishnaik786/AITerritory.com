import React from 'react';

const UpdateToolPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Update a Tool Listing</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Is your AI tool listing on Viralai outdated?
        Keep your information current to ensure users have the best experience.
      </p>
      <div className="space-y-4">
        <p className="text-md">
          To update your tool's details, please use our update request form:
          <a href="#" className="text-blue-600 hover:underline ml-2">Tool Update Form</a>
        </p>
        <p className="text-md">
          We strive to keep our directory accurate and up-to-date!
        </p>
      </div>
    </div>
  );
};

export default UpdateToolPage; 