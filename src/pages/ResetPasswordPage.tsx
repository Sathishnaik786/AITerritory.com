import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { supabase } from '@/services/supabaseClient';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the required parameters for password reset
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    
    // If we don't have the required parameters, redirect to login
    if (!token_hash || !type || type !== 'recovery') {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        setError(error.message || 'Failed to reset password');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('ResetPasswordPage: Unexpected error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        {/* Back Button */}
        <div className="mb-3 sm:mb-4 md:mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/login')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Back to Login
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2"
          >
            Reset Password
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 px-1 sm:px-2"
          >
            Enter your new password below
          </motion.p>
        </div>

        {/* Reset Password Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6"
        >
          {success ? (
            <div className="text-center">
              <div className="text-green-600 dark:text-green-400 text-xs sm:text-sm md:text-base p-2 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                Your password has been successfully reset!
              </div>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm md:text-base"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs sm:text-sm md:text-base">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs sm:text-sm md:text-base">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-xs sm:text-sm md:text-base p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm md:text-base"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;