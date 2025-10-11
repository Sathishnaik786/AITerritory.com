import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('LoginPage: Attempting to sign in', { email });
      const { error } = await signIn(email, password);
      console.log('LoginPage: Sign in result', { error });
      
      if (error) {
        setError(error.message || 'Failed to sign in');
        console.error('LoginPage: Sign in error', error);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('LoginPage: Unexpected error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('LoginPage: Attempting to reset password', { resetEmail });
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        setError(error.message || 'Failed to send reset email');
        console.error('LoginPage: Reset password error', error);
      } else {
        setResetSuccess(true);
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for instructions to reset your password.",
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('LoginPage: Unexpected error', err);
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
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-xs sm:text-sm">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2"
          >
            {showForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 px-1 sm:px-2"
          >
            {showForgotPassword 
              ? 'Enter your email to receive password reset instructions' 
              : 'Sign in to your account to continue'}
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6"
        >
          {showForgotPassword ? (
            <form onSubmit={handleResetPassword}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-xs sm:text-sm md:text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base"
                      required
                      disabled={resetSuccess}
                    />
                  </div>
                </div>

                {resetSuccess ? (
                  <div className="text-green-600 dark:text-green-400 text-xs sm:text-sm md:text-base p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    Password reset instructions have been sent to your email. Please check your inbox.
                  </div>
                ) : (
                  <>
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
                          Sending Reset Email...
                        </>
                      ) : (
                        'Send Reset Email'
                      )}
                    </Button>
                  </>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError('');
                      setResetSuccess(false);
                      setResetEmail('');
                    }}
                    className="text-purple-600 text-xs sm:text-sm md:text-base hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm md:text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs sm:text-sm md:text-base">Password</Label>
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

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-purple-600 text-xs sm:text-sm md:text-base hover:underline"
                  >
                    Forgot Password?
                  </button>
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
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-3 sm:mt-4 md:mt-6"
        >
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 font-medium hover:underline">
              Sign up here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;