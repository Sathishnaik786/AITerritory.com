import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const CreateAccountPage: React.FC = () => {
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
            Join AI Territory
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 px-1 sm:px-2"
          >
            Create your account to access exclusive features, save tools, and stay updated with the latest AI innovations
          </motion.p>
        </div>

        {/* Clerk SignUp Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6"
        >
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 p-0",
                headerTitle: "text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white",
                headerSubtitle: "text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400",
                formButtonPrimary: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm md:text-base",
                formFieldInput: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg sm:rounded-xl px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm md:text-base",
                formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium text-xs sm:text-sm md:text-base",
                footerActionLink: "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-xs sm:text-sm md:text-base",
                dividerLine: "bg-gray-300 dark:bg-gray-600",
                dividerText: "text-gray-500 dark:text-gray-400 text-xs sm:text-sm",
                socialButtonsBlockButton: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg sm:rounded-xl px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 transition-all duration-200 text-xs sm:text-sm md:text-base",
                formFieldLabelRow: "mb-1 sm:mb-1.5 md:mb-2",
                formFieldRow: "mb-2 sm:mb-3 md:mb-4",
                formFieldInputRow: "mb-2 sm:mb-3 md:mb-4",
                formField: "mb-2 sm:mb-3 md:mb-4",
                formButton: "w-full mt-3 sm:mt-4 md:mt-6",
                footer: "mt-3 sm:mt-4 md:mt-6 text-center",
                footerAction: "text-xs sm:text-sm md:text-base",
                identityPreviewText: "text-xs sm:text-sm md:text-base",
                identityPreviewEditButton: "text-xs sm:text-sm md:text-base",
                formResendCodeLink: "text-xs sm:text-sm md:text-base",
                otpCodeFieldInput: "text-xs sm:text-sm md:text-base",
                formHeaderTitle: "text-base sm:text-lg md:text-xl",
                formHeaderSubtitle: "text-xs sm:text-sm md:text-base",
                dividerText: "text-xs sm:text-sm",
                socialButtonsBlockButtonText: "text-xs sm:text-sm md:text-base",
                formFieldAction: "text-xs sm:text-sm md:text-base",
                formFieldHintText: "text-xs sm:text-sm",
                formFieldErrorText: "text-xs sm:text-sm",
                alertText: "text-xs sm:text-sm md:text-base",
                alert: "rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 md:mb-4",
                avatarBox: "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10",
                userPreviewMainIdentifier: "text-xs sm:text-sm md:text-base",
                userPreviewSecondaryIdentifier: "text-xs sm:text-sm",
                userPreviewTextContainer: "text-xs sm:text-sm md:text-base",
                userButtonPopoverCard: "rounded-lg sm:rounded-xl shadow-lg",
                userButtonPopoverActionButton: "text-xs sm:text-sm md:text-base",
                userButtonPopoverActionButtonText: "text-xs sm:text-sm md:text-base",
                userButtonPopoverFooter: "p-2 sm:p-3 md:p-4",
                userButtonPopoverFooterAction: "text-xs sm:text-sm md:text-base",
                userButtonPopoverRootBox: "rounded-lg sm:rounded-xl",
                userButtonPopoverCard: "rounded-lg sm:rounded-xl",
                userButtonPopoverActions: "p-1.5 sm:p-2 md:p-3",
                userButtonPopoverActionButton: "rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base",
                userButtonPopoverActionButtonText: "text-xs sm:text-sm md:text-base",
                userButtonPopoverFooter: "p-1.5 sm:p-2 md:p-3 border-t border-gray-200 dark:border-gray-700",
                userButtonPopoverFooterAction: "text-xs sm:text-sm md:text-base",
                userButtonPopoverFooterActionText: "text-xs sm:text-sm md:text-base",
                userButtonPopoverFooterActionIcon: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconBox: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconSvg: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconPath: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconRect: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconCircle: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconEllipse: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconLine: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconPolyline: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconPolygon: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconDefs: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconLinearGradient: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconRadialGradient: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconStop: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconClipPath: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconMask: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFilter: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeGaussianBlur: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeOffset: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeMerge: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeMergeNode: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeComposite: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFlood: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeBlend: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeColorMatrix: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeConvolveMatrix: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeDisplacementMap: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeDropShadow: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeMorphology: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeSpecularLighting: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeDiffuseLighting: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFePointLight: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeSpotLight: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeDistantLight: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeImage: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeTile: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeTurbulence: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncR: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncG: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncB: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncA: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeComponentTransfer: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeTableValues: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeDisplacementMap: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeMorphology: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeSpecularLighting: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeDiffuseLighting: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFePointLight: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeSpotLight: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeDistantLight: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeImage: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeTile: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeTurbulence: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncR: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncG: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncB: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeFuncA: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeComponentTransfer: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                userButtonPopoverFooterActionIconFeTableValues: "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                showOptionalFields: false,
              }
            }}
            redirectUrl="/dashboard"
            signInUrl="/login"
          />
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-3 sm:mt-4 md:mt-6"
        >
          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <span className="text-purple-600 font-medium cursor-pointer" onClick={() => window.Clerk?.openSignIn?.() || window.location.reload()}>Sign in here</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CreateAccountPage; 