import React from 'react';

const CreateAccountPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Create Your Futurepedia Account</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Join our community to access exclusive features, personalize your experience,
        and stay updated with the latest AI tools.
      </p>
      <div className="space-y-4">
        <p className="text-md">
          Signing up is quick and easy. Get started today!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default CreateAccountPage; 