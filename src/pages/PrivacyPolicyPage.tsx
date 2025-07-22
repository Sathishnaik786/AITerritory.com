import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | AI Territory"
        description="Read the AI Territory privacy policy to understand how we collect, use, and protect your personal information."
      />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-md text-muted-foreground mb-4">
        At Viralai, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
      <p className="text-md text-muted-foreground mb-4">
        We may collect personal information such as your name, email address, and usage data when you register, subscribe to our newsletter, or interact with our services.
      </p>
      <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
      <p className="text-md text-muted-foreground mb-4">
        The information we collect is used to provide, maintain, and improve our services, communicate with you, and personalize your experience on Viralai.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
      <p className="text-md text-muted-foreground mb-4">
        We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Third-Party Websites</h2>
      <p className="text-md text-muted-foreground mb-4">
        Our website may contain links to third-party websites. We are not responsible for the privacy practices or the content of these third-party sites.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Changes to This Privacy Policy</h2>
      <p className="text-md text-muted-foreground mb-4">
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>
      <p className="text-md text-muted-foreground mt-8 text-center">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
    </>
  );
};

export default PrivacyPolicyPage; 