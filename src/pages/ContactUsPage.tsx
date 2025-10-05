import React, { useState } from 'react';
import { submitContactForm } from '../services/submissionService';
import SEO from '../components/SEO';
import { ContactPageSkeleton } from '../components/SkeletonLoader';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';
import InternalLinking from '../components/InternalLinking';

const ContactUsPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    
    if (!form.name || !form.email || !form.message) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await submitContactForm(form);
      setSuccess(response.message);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form submission error:', err);
      const errorMessage = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Submission failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | AI Territory"
        description="Get in touch with the AI Territory team. We'd love to hear from you! Contact us for partnerships, tool submissions, advertising opportunities, or general inquiries."
        canonical="https://aiterritory.org/company/contact-us"
        keywords="contact AI Territory, get in touch, partnerships, tool submissions, advertising, support"
      />
      {loading ? (
        <ContactPageSkeleton />
      ) : (
        <div className="max-w-4xl mx-auto py-12 px-4">
          {/* Breadcrumbs */}
          <PageBreadcrumbs />
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get in touch with the AI Territory team. We'd love to hear from you! Whether you have questions about our platform, want to submit a tool, or are interested in partnerships, we're here to help.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Why Contact Us?</h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Submit your AI tool for review</li>
                <li>• Partnership opportunities</li>
                <li>• Advertising inquiries</li>
                <li>• Technical support</li>
                <li>• Feature requests</li>
                <li>• General questions</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Response Time</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                For urgent matters, please mention "URGENT" in your subject line.
              </p>
            </div>
          </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="border rounded px-4 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {success && <div className="text-green-600 text-center mt-2">{success}</div>}
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
        
        {/* Internal Linking for Better Crawling */}
        <InternalLinking 
          currentPage="/company/contact-us"
          showRelatedPages={true}
          showCategoryPages={true}
          showResourcePages={false}
        />
      </div>
      )}
    </>
  );
};

export default ContactUsPage;