import React, { useState } from 'react';
import { submitFeatureRequestForm } from '../services/submissionService';
import SEO from '../components/SEO';

const RequestFeaturePage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', feature: '', details: '' });
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
    
    if (!form.name || !form.email || !form.feature) {
      setError('Name, email, and feature are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await submitFeatureRequestForm(form);
      setSuccess(response.message);
      setForm({ name: '', email: '', feature: '', details: '' });
    } catch (err) {
      console.error('Feature request submission error:', err);
      const errorMessage = (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Submission failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Request a Feature | AI Territory"
        description="Have an idea for a new feature? Let us know! We are always looking for ways to improve AI Territory."
      />
      <div className="max-w-lg mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Request a Feature</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#171717] rounded-xl shadow-lg p-8 flex flex-col gap-4">
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
          <input
            type="text"
            name="feature"
            placeholder="Feature Title"
            value={form.feature}
            onChange={handleChange}
            className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="details"
            placeholder="Feature Details (optional)"
            value={form.details}
            onChange={handleChange}
            className="border rounded px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feature'}
          </button>
          {success && <div className="text-green-600 text-center mt-2">{success}</div>}
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
      </div>
    </>
  );
};

export default RequestFeaturePage;