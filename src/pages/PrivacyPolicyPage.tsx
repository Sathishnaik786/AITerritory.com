import React from 'react';
import SEO from '../components/SEO';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy | AI Territory - Protecting Your Personal Information"
        description="Learn how AI Territory collects, uses, and protects your personal information. Our comprehensive privacy policy ensures transparency and security for all users."
        canonical="https://aiterritory.org/legal/privacy-policy"
        image="https://aiterritory.org/og-default.png"
      />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground mb-8 text-center">
          At AI Territory, we are committed to protecting your privacy and ensuring the security of your personal information. This comprehensive Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 dark:text-blue-200">Effective Date</h2>
          <p className="text-md text-muted-foreground mb-2">This Privacy Policy is effective as of {new Date().toLocaleDateString()} and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>
        </div>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
          <p className="text-md text-muted-foreground mb-4">
            We may collect personal information such as your name, email address, and usage data when you register, subscribe to our newsletter, or interact with our services. Additionally, we may collect information about your device, browser type, IP address, and browsing behavior to improve our services.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
          <p className="text-md text-muted-foreground mb-4">
            The information we collect is used to provide, maintain, and improve our services, communicate with you, personalize your experience on AI Territory, and analyze usage patterns to enhance our platform.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
          <p className="text-md text-muted-foreground mb-4">
            We implement a variety of security measures to maintain the safety of your personal information. These measures include encryption, secure server protocols, and regular security audits. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
          <p className="text-md text-muted-foreground mb-4">
            Our website may contain links to third-party websites and services. We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Cookies and Tracking Technologies</h2>
          <p className="text-md text-muted-foreground mb-4">
            We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
          <p className="text-md text-muted-foreground mb-4">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy unless a longer retention period is required or permitted by law.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
          <p className="text-md text-muted-foreground mb-4">
            You have the right to access, update, or delete your personal information. You may also have the right to data portability and the right to object to certain processing activities. To exercise these rights, please contact us using the information provided below.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Children's Privacy</h2>
          <p className="text-md text-muted-foreground mb-4">
            Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Changes to This Privacy Policy</h2>
          <p className="text-md text-muted-foreground mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-md text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@aiterritory.org" className="text-blue-600 hover:underline">privacy@aiterritory.org</a>
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-md text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This document is maintained by the AI Territory team to ensure transparency and compliance with data protection regulations.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage; 