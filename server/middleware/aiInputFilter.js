/**
 * AI Input Filter Middleware
 * Validates and filters user input for AI assistant queries
 */

// Harmful/abusive keywords patterns (case insensitive)
const ABUSIVE_PATTERNS = [
  /\b(kill|murder|harm|torture|rape|pedo)\w*\b/i,
  /\b(terrorist|bomb|weapon|drugs|hack)\w*\b/i,
  /\b(stupid|idiot|retard|moron)\w*\b/i,
  /\b(fuck|shit|cunt|nigger|slut|whore)\w*\b/i,
];

// Excessive repetition pattern (more than 5 consecutive identical characters)
const REPETITION_PATTERN = /(.)\1{5,}/;

/**
 * Validate AI input message
 * @param {string} message - The user input message
 * @returns {Object} - Validation result with isValid flag and error message if invalid
 */
function validateAIInput(message) {
  // Check if message is empty or only whitespace
  if (!message || !message.trim()) {
    return {
      isValid: false,
      error: 'Message cannot be empty'
    };
  }

  // Trim the message
  const trimmedMessage = message.trim();

  // Check if message is too long (more than 1000 characters)
  if (trimmedMessage.length > 1000) {
    return {
      isValid: false,
      error: 'Message is too long. Please shorten your input.'
    };
  }

  // Check for excessive repetition
  if (REPETITION_PATTERN.test(trimmedMessage)) {
    return {
      isValid: false,
      error: 'Message contains excessive repetition. Please rephrase.'
    };
  }

  // Check for abusive/harmful content
  for (const pattern of ABUSIVE_PATTERNS) {
    if (pattern.test(trimmedMessage)) {
      return {
        isValid: false,
        error: 'Message contains inappropriate content.'
      };
    }
  }

  // If all checks pass, the input is valid
  return {
    isValid: true
  };
}

/**
 * AI Input Filter Middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function aiInputFilter(req, res, next) {
  const { message } = req.body;

  const validation = validateAIInput(message);
  
  if (!validation.isValid) {
    return res.status(400).json({
      error: validation.error,
      code: 'INVALID_INPUT'
    });
  }

  next();
}

module.exports = {
  validateAIInput,
  aiInputFilter
};