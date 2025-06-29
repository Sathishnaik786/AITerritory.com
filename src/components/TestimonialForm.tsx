import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Star } from 'lucide-react';
import { testimonialsService, TestimonialSubmission } from '../services/testimonialsService';

interface TestimonialFormProps {
  open: boolean;
  onClose: () => void;
  user: { id: string; name: string; avatar?: string } | null;
  onSuccess?: () => void;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ open, onClose, user, onSuccess }) => {
  const [content, setContent] = useState('');
  const [userRole, setUserRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  if (!open) return null;
  if (!user) return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-8 w-full max-w-md text-center ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}>
        <div className={`text-lg mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          You must be logged in to submit a testimonial.
        </div>
        <button 
          className={`mt-2 px-4 py-2 rounded ${
            theme === 'dark' 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`} 
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    const requestData: TestimonialSubmission = {
      user_id: user?.id,
      user_name: user?.name,
      user_avatar: user?.avatar,
      user_role: userRole,
      content,
      rating,
      company_name: companyName,
    };
    
    console.log('Submitting testimonial with data:', requestData);
    
    try {
      const data = await testimonialsService.submitTestimonial(requestData);
      
      console.log('Testimonial submitted successfully:', data);
      
      setSuccess(true);
      setContent('');
      setUserRole('');
      setCompanyName('');
      setRating(5);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Testimonial submission error:', err);
      setError(`Failed to submit testimonial: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className={`rounded-2xl p-8 w-full max-w-md ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}>
        <h3 className={`text-xl font-bold mb-4 text-center ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Submit Your Testimonial
        </h3>
        {success ? (
          <div className="text-green-400 mb-4">Thank you! Your testimonial will appear after admin approval.</div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4 justify-center">
              {[1,2,3,4,5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star className={`w-6 h-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            <textarea
              className={`w-full rounded-lg p-3 mb-4 min-h-[100px] border focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-black text-white border-gray-700 focus:border-blue-500' 
                  : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Share your experience..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <input
              className={`w-full rounded-lg p-3 mb-4 border focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-black text-white border-gray-700 focus:border-blue-500' 
                  : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Your role (e.g. Designer, Content Creator)"
              value={userRole}
              onChange={e => setUserRole(e.target.value)}
              required
            />
            <input
              className={`w-full rounded-lg p-3 mb-4 border focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-black text-white border-gray-700 focus:border-blue-500' 
                  : 'bg-gray-50 text-gray-900 border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Your company (optional)"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <button
              type="submit"
              className={`w-full py-2 rounded-lg font-semibold transition ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Testimonial'}
            </button>
          </>
        )}
        <button 
          type="button" 
          className={`w-full mt-4 py-2 rounded-lg transition ${
            theme === 'dark'
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`} 
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TestimonialForm; 