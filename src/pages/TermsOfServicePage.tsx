import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-md text-muted-foreground mb-4">
        Welcome to Viralai. By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Use of Our Website</h2>
      <p className="text-md text-muted-foreground mb-4">
        You agree to use Viralai only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
      <p className="text-md text-muted-foreground mb-4">
        All content on Viralai, including text, graphics, logos, images, and software, is the property of Viralai or its content suppliers and protected by international copyright laws.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Disclaimer of Warranties</h2>
      <p className="text-md text-muted-foreground mb-4">
        Our website is provided on an "as is" and "as available" basis. Viralai makes no representations or warranties of any kind, express or implied, as to the operation of our website or the information, content, materials, or products included on our website.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
      <p className="text-md text-muted-foreground mb-4">
        Viralai will not be liable for any damages of any kind arising from the use of this website, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Changes to Terms of Service</h2>
      <p className="text-md text-muted-foreground mb-4">
        We reserve the right to make changes to these Terms of Service at any time. Your continued use of the website following the posting of changes will mean you accept those changes.
      </p>
      <p className="text-md text-muted-foreground mt-8 text-center">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default TermsOfServicePage; 