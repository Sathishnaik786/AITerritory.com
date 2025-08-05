import React, { useState } from 'react';
import { submitContactForm } from '../services/submissionService';
import SEO from '../components/SEO';
import { ContactPageSkeleton } from '../components/SkeletonLoader';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';

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
        description="Get in touch with the AI Territory team. We'd love to hear from you!"
      />
      {loading ? (
        <ContactPageSkeleton />
      ) : (
        <div className="max-w-lg mx-auto py-12 px-4">
          {/* Breadcrumbs */}
          <PageBreadcrumbs />
          
          <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
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
      </div>
      )}
    </>
  );
};

export default ContactUsPage;