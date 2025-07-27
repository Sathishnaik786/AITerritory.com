const sanitizeHtml = require('sanitize-html');

/**
 * Sanitizes HTML content on the backend to prevent XSS attacks
 * @param {string} content - The HTML content to sanitize
 * @param {Object} options - Optional sanitization configuration
 * @returns {string} Sanitized HTML string
 */
function sanitizeHtmlContent(content, options = {}) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // Default configuration that allows common safe HTML elements
  const defaultOptions = {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'pre', 'code', 'kbd', 'samp', 'var',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
      'div', 'span', 'section', 'article', 'aside', 'header', 'footer',
      'mark', 'small', 'sub', 'sup', 'time', 'cite', 'q', 'abbr', 'acronym',
      'dfn', 'address', 'hr'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel', 'download', 'type'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'code': ['class'],
      'pre': ['class'],
      'div': ['class', 'id', 'style'],
      'span': ['class', 'id', 'style'],
      'p': ['class', 'id', 'style'],
      'h1': ['class', 'id'],
      'h2': ['class', 'id'],
      'h3': ['class', 'id'],
      'h4': ['class', 'id'],
      'h5': ['class', 'id'],
      'h6': ['class', 'id'],
      'ul': ['class', 'id'],
      'ol': ['class', 'id'],
      'li': ['class', 'id'],
      'blockquote': ['class', 'id', 'cite'],
      'table': ['class', 'id'],
      'tr': ['class', 'id'],
      'td': ['class', 'id', 'colspan', 'rowspan'],
      'th': ['class', 'id', 'colspan', 'rowspan'],
      'time': ['datetime'],
      'abbr': ['title'],
      'acronym': ['title'],
      '*': ['data-*'] // Allow data attributes on any element
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'ftp'],
    allowedSchemesByTag: {
      'img': ['http', 'https', 'data'],
      'a': ['http', 'https', 'mailto', 'tel', 'ftp']
    },
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    transformTags: {
      'script': 'div', // Transform script tags to divs (effectively removing them)
      'style': 'div',  // Transform style tags to divs
      'iframe': 'div', // Transform iframe tags to divs
      'object': 'div', // Transform object tags to divs
      'embed': 'div',  // Transform embed tags to divs
      'form': 'div',   // Transform form tags to divs
      'input': 'div',  // Transform input tags to divs
      'textarea': 'div', // Transform textarea tags to divs
      'select': 'div', // Transform select tags to divs
      'button': 'div'  // Transform button tags to divs
    },
    exclusiveFilter: function(frame) {
      // Remove any elements with event handler attributes
      const eventAttributes = [
        'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
        'onchange', 'onsubmit', 'onreset', 'onselect', 'onunload', 'onresize',
        'onabort', 'onbeforeunload', 'onhashchange', 'onmessage', 'onoffline',
        'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onstorage',
        'oncontextmenu', 'oninput', 'oninvalid', 'onsearch'
      ];
      
      if (frame.attribs) {
        for (const attr of eventAttributes) {
          if (frame.attribs[attr]) {
            return true; // Remove this element
          }
        }
      }
      return false;
    },
    ...options
  };

  try {
    return sanitizeHtml(content, defaultOptions);
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    // Return empty string if sanitization fails
    return '';
  }
}

/**
 * Sanitizes plain text content (removes all HTML)
 * @param {string} content - The content to sanitize
 * @returns {string} Plain text without any HTML
 */
function sanitizeText(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  try {
    return sanitizeHtml(content, {
      allowedTags: [],
      allowedAttributes: {},
      textFilter: function(text) {
        return text;
      }
    });
  } catch (error) {
    console.error('Error sanitizing text:', error);
    return '';
  }
}

/**
 * Sanitizes content for markdown (more permissive)
 * @param {string} content - The content to sanitize
 * @returns {string} Sanitized content safe for markdown
 */
function sanitizeMarkdownContent(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const markdownOptions = {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'pre', 'code', 'kbd', 'samp', 'var',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
      'div', 'span', 'section', 'article', 'aside', 'header', 'footer',
      'mark', 'small', 'sub', 'sup', 'time', 'cite', 'q', 'abbr', 'acronym',
      'dfn', 'address', 'hr', 'details', 'summary'
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel', 'download', 'type'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'code': ['class'],
      'pre': ['class'],
      'div': ['class', 'id', 'style'],
      'span': ['class', 'id', 'style'],
      'p': ['class', 'id', 'style'],
      'h1': ['class', 'id'],
      'h2': ['class', 'id'],
      'h3': ['class', 'id'],
      'h4': ['class', 'id'],
      'h5': ['class', 'id'],
      'h6': ['class', 'id'],
      'ul': ['class', 'id'],
      'ol': ['class', 'id'],
      'li': ['class', 'id'],
      'blockquote': ['class', 'id', 'cite'],
      'table': ['class', 'id'],
      'tr': ['class', 'id'],
      'td': ['class', 'id', 'colspan', 'rowspan'],
      'th': ['class', 'id', 'colspan', 'rowspan'],
      'time': ['datetime'],
      'abbr': ['title'],
      'acronym': ['title'],
      'details': ['open'],
      'summary': [],
      '*': ['data-*']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'ftp'],
    allowedSchemesByTag: {
      'img': ['http', 'https', 'data'],
      'a': ['http', 'https', 'mailto', 'tel', 'ftp']
    },
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    transformTags: {
      'script': 'div',
      'style': 'div',
      'iframe': 'div',
      'object': 'div',
      'embed': 'div',
      'form': 'div',
      'input': 'div',
      'textarea': 'div',
      'select': 'div',
      'button': 'div'
    },
    exclusiveFilter: function(frame) {
      const eventAttributes = [
        'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur',
        'onchange', 'onsubmit', 'onreset', 'onselect', 'onunload', 'onresize',
        'onabort', 'onbeforeunload', 'onhashchange', 'onmessage', 'onoffline',
        'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onstorage',
        'oncontextmenu', 'oninput', 'oninvalid', 'onsearch'
      ];
      
      if (frame.attribs) {
        for (const attr of eventAttributes) {
          if (frame.attribs[attr]) {
            return true;
          }
        }
      }
      return false;
    }
  };

  try {
    return sanitizeHtml(content, markdownOptions);
  } catch (error) {
    console.error('Error sanitizing markdown content:', error);
    return '';
  }
}

module.exports = {
  sanitizeHtmlContent,
  sanitizeText,
  sanitizeMarkdownContent
}; 