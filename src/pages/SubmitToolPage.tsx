import React, { useState } from 'react';
import { submitToolForm } from '../services/submissionService';

const SubmitToolPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', tool_name: '', tool_url: '', description: '' });
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
    
    if (!form.name || !form.email || !form.tool_name || !form.tool_url) {
      setError('Name, email, tool name, and tool URL are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await submitToolForm(form);
      setSuccess(response.message);
      setForm({ name: '', email: '', tool_name: '', tool_url: '', description: '' });
    } catch (err: any) {
      console.error('Tool submission error:', err);
      setError(err.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Submit a Tool</h1>
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
          name="tool_name"
          placeholder="Tool Name"
          value={form.tool_name}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="url"
          name="tool_url"
          placeholder="Tool URL (https://...)"
          value={form.tool_url}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          name="description"
          placeholder="Tool Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="border rounded px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Tool'}
        </button>
        {success && <div className="text-green-600 text-center mt-2">{success}</div>}
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default SubmitToolPage; 