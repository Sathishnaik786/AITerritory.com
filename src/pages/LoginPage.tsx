import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Log In to Your Account</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welcome back! Log in to access your personalized dashboard,
        saved tools, and exclusive content.
      </p>
      <div className="space-y-4">
        <p className="text-md">
          New to Futurepedia? <a href="/company/create-account" className="text-blue-600 hover:underline">Create an account</a>
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
          Log In
        </button>
      </div>
    </div>
  );
};

export default LoginPage; 