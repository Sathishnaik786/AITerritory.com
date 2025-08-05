import React, { useState } from 'react';
import { submitToolForm } from '../services/submissionService';
import SEO from '../components/SEO';
import { SubmitToolPageSkeleton } from '../components/SkeletonLoader';

const SubmitToolPage: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    tool_name: '',
    tool_url: '',
    youtube_url: '',
    plan: 'basic',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Validation helpers
  const validateEmail = (email: string) => /.+@.+\..+/.test(email);
  const validateUrl = (url: string) => /^https?:\/\/.+\..+/.test(url);
  const validateYouTube = (url: string) =>
    url === '' ||
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/.test(url);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.email) errors.email = 'Email is required.';
    else if (!validateEmail(form.email)) errors.email = 'Invalid email address.';
    if (!form.tool_name) errors.tool_name = 'Tool name is required.';
    if (!form.tool_url) errors.tool_url = 'Tool website URL is required.';
    else if (!validateUrl(form.tool_url)) errors.tool_url = 'Invalid website URL.';
    if (form.youtube_url && !validateYouTube(form.youtube_url)) errors.youtube_url = 'Invalid YouTube URL.';
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const errors = validateForm();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el) (el as HTMLElement).focus();
      return;
    }
    setLoading(true);
    try {
      await submitToolForm({
        email: form.email,
        tool_name: form.tool_name,
        tool_url: form.tool_url,
        youtube_url: form.youtube_url,
        plan: form.plan,
      });
      setSuccess('Your tool has been submitted successfully!');
      setForm({ email: '', tool_name: '', tool_url: '', youtube_url: '', plan: 'basic' });
      setFieldErrors({});
    } catch (err) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Submit Your AI Tool | AI Territory"
        description="Get your AI tool featured on AI Territory and reach thousands of potential users. Fast-track your listing with instant approval and homepage featuring."
      />
      {loading ? (
        <SubmitToolPageSkeleton />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-[#181c2a] to-[#232946] flex items-center justify-center py-8 px-2">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 bg-[#181c2a] rounded-2xl shadow-2xl p-6 md:p-12">
          {/* Main Form */}
          <div className="flex-1">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-gradient-to-br from-[#6c63ff] to-[#7f53ff] rounded-full p-4 mb-4 shadow-lg">
                {/* Lightning bolt icon */}
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M13 2L3 14h7v8l10-12h-7V2z"/></svg>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2 text-center tracking-tight">Submit Your AI Tool</h1>
              <p className="text-[#bfc9ff] text-center max-w-md text-lg">Get your AI tool featured on AIToolHunt and reach thousands of potential users.<br/>Fast-track your listing with instant approval and homepage featuring.</p>
              <div className="w-16 h-1 bg-gradient-to-r from-[#6c63ff] to-[#7f53ff] rounded-full mt-4 mb-2" />
            </div>
            <form onSubmit={handleSubmit} className="bg-[#232946] rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-[#232946]/80">
              <div>
                <label className="block text-[#bfc9ff] font-semibold mb-1 text-sm">Email Address</label>
          <input
            type="email"
            name="email"
                  placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
                  className={`w-full bg-[#181c2a] border ${fieldErrors.email ? 'border-red-500' : 'border-[#353b5c]'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6c63ff] text-base`}
            required
                  disabled={loading}
          />
                {fieldErrors.email && <span className="text-xs text-red-400">{fieldErrors.email}</span>}
              </div>
              <div>
                <label className="block text-[#bfc9ff] font-semibold mb-1 text-sm">Tool Name</label>
          <input
            type="text"
            name="tool_name"
                  placeholder="Enter your AI tool name"
            value={form.tool_name}
            onChange={handleChange}
                  className={`w-full bg-[#181c2a] border ${fieldErrors.tool_name ? 'border-red-500' : 'border-[#353b5c]'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6c63ff] text-base`}
            required
                  disabled={loading}
          />
                {fieldErrors.tool_name && <span className="text-xs text-red-400">{fieldErrors.tool_name}</span>}
              </div>
              <div>
                <label className="block text-[#bfc9ff] font-semibold mb-1 text-sm">Tool Website URL</label>
          <input
            type="url"
            name="tool_url"
                  placeholder="https://your-tool-website.com"
            value={form.tool_url}
            onChange={handleChange}
                  className={`w-full bg-[#181c2a] border ${fieldErrors.tool_url ? 'border-red-500' : 'border-[#353b5c]'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6c63ff] text-base`}
            required
                  disabled={loading}
                />
                {fieldErrors.tool_url && <span className="text-xs text-red-400">{fieldErrors.tool_url}</span>}
              </div>
              <div>
                <label className="block text-[#bfc9ff] font-semibold mb-1 text-sm">YouTube Video (Optional)</label>
                <input
                  type="url"
                  name="youtube_url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.youtube_url}
            onChange={handleChange}
                  className={`w-full bg-[#181c2a] border ${fieldErrors.youtube_url ? 'border-red-500' : 'border-[#353b5c]'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6c63ff] text-base`}
                  disabled={loading}
          />
                <span className="text-xs text-[#bfc9ff]">Add a demo video to increase your tool's visibility</span>
                {fieldErrors.youtube_url && <span className="text-xs text-red-400 block">{fieldErrors.youtube_url}</span>}
              </div>
          <button
            type="submit"
                className="bg-gradient-to-r from-[#6c63ff] to-[#7f53ff] text-white font-semibold py-2 px-6 rounded-lg shadow hover:from-[#7f53ff] hover:to-[#6c63ff] transition disabled:opacity-60 mt-2 text-lg tracking-wide"
                disabled={loading || Object.keys(validateForm()).length > 0}
          >
            {loading ? 'Submitting...' : 'Submit Tool'}
          </button>
              {success && <div className="text-green-400 text-center mt-2">{success}</div>}
              {error && <div className="text-red-400 text-center mt-2">{error}</div>}
        </form>
          </div>
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0 bg-[#232946] rounded-2xl shadow-xl p-6 flex flex-col gap-6 h-fit border border-[#232946]/80">
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Why Submit Here?</h2>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3 items-start">
                <span className="bg-gradient-to-br from-[#6c63ff] to-[#7f53ff] rounded-full p-2 mt-1 flex items-center justify-center"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M8 12l2 2 4-4" stroke="#6c63ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <div>
                  <span className="font-semibold text-[#bfc9ff]">Fast Track</span>
                  <p className="text-[#bfc9ff] text-sm">Get your tool listed instantly<br/>Featured on homepage for 24 hours</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-[#1e90ff] rounded-full p-2 mt-1 flex items-center justify-center"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 8v4l3 3" stroke="#1e90ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <div>
                  <span className="font-semibold text-[#bfc9ff]">Traffic Forever</span>
                  <p className="text-[#bfc9ff] text-sm">Continuous traffic and exposure for life. No recurring fees.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-[#22c55e] rounded-full p-2 mt-1 flex items-center justify-center"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 8v4l3 3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <div>
                  <span className="font-semibold text-[#bfc9ff]">Edit Rights</span>
                  <p className="text-[#bfc9ff] text-sm">Edit your listing anytime. Full control over your tool.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-[#ff6b6b] rounded-full p-2 mt-1 flex items-center justify-center"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 8v4l3 3" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <div>
                  <span className="font-semibold text-[#bfc9ff]">SEO Boost</span>
                  <p className="text-[#bfc9ff] text-sm">Boost your Google search rankings with high-quality backlinks and improved visibility.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <span className="bg-[#f472b6] rounded-full p-2 mt-1 flex items-center justify-center"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 8v4l3 3" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <div>
                  <span className="font-semibold text-[#bfc9ff]">Join 10,000+ AI Tools</span>
                  <p className="text-[#bfc9ff] text-sm">Trusted by leading AI companies worldwide.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default SubmitToolPage;