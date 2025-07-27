/**
 * HTML Sanitization Utilities
 * Provides XSS protection for user-generated content
 */

// Basic HTML sanitization without external dependencies
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'del', 'ins',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'blockquote', 'pre', 'code', 'kbd', 'samp', 'var',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'colgroup', 'col',
  'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main',
  'address', 'time', 'cite', 'q', 'abbr', 'acronym', 'dfn', 'sub', 'sup'
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'width', 'height', 'class', 'id', 'style',
  'target', 'rel', 'download', 'hreflang', 'type', 'cite', 'datetime',
  'lang', 'dir', 'accesskey', 'tabindex', 'role', 'aria-label', 'aria-labelledby'
];

const FORBID_TAGS = [
  'script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea',
  'select', 'button', 'label', 'fieldset', 'legend', 'optgroup', 'option',
  'applet', 'base', 'basefont', 'bgsound', 'link', 'meta', 'title', 'head',
  'body', 'html', 'xml', 'xmp', 'listing', 'plaintext', 'listing'
];

const FORBID_ATTR = [
  'onload', 'onunload', 'onclick', 'ondblclick', 'onmousedown', 'onmouseup',
  'onmouseover', 'onmousemove', 'onmouseout', 'onfocus', 'onblur', 'onkeypress',
  'onkeydown', 'onkeyup', 'onsubmit', 'onreset', 'onselect', 'onchange',
  'onabort', 'onerror', 'onbeforeunload', 'onbeforeprint', 'onafterprint',
  'onresize', 'onscroll', 'oncontextmenu', 'oninput', 'oninvalid', 'onsearch'
];

// Simple HTML tag and attribute validation
const isValidTag = (tag: string): boolean => {
  return ALLOWED_TAGS.includes(tag.toLowerCase());
};

const isValidAttribute = (attr: string): boolean => {
  const attrLower = attr.toLowerCase();
  return ALLOWED_ATTR.includes(attrLower) && !FORBID_ATTR.includes(attrLower);
};

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Basic HTML sanitization function
const sanitizeHtmlBasic = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags and their content
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove forbidden tags
  FORBID_TAGS.forEach(tag => {
    const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    html = html.replace(regex, '');
  });
  
  // Remove dangerous attributes
  FORBID_ATTR.forEach(attr => {
    const regex = new RegExp(`\\s+${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
    html = html.replace(regex, '');
  });
  
  // Remove javascript: protocol
  html = html.replace(/javascript:/gi, '');
  
  return html;
};

// Try to use DOMPurify if available, otherwise fall back to basic sanitization
let DOMPurify: any = null;

// Try to import DOMPurify dynamically
try {
  // This will work if DOMPurify is installed
  DOMPurify = require('dompurify');
} catch {
  // DOMPurify not available, use basic sanitization
  console.warn('DOMPurify not available, using basic HTML sanitization');
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  if (DOMPurify && typeof window !== 'undefined') {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      FORBID_TAGS,
      FORBID_ATTR,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
  }
  
  return sanitizeHtmlBasic(content);
};

/**
 * Sanitizes markdown HTML content
 */
export const sanitizeMarkdownHtml = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  if (DOMPurify && typeof window !== 'undefined') {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        ...ALLOWED_TAGS,
        'code', 'pre', 'kbd', 'samp', 'var', 'sub', 'sup', 'mark', 'del', 'ins'
      ],
      ALLOWED_ATTR,
      FORBID_TAGS,
      FORBID_ATTR,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
  }
  
  return sanitizeHtmlBasic(content);
};

/**
 * Sanitizes plain text content
 */
export const sanitizeText = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  // Basic text sanitization - remove HTML tags and dangerous characters
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Sanitizes content for dangerouslySetInnerHTML
 */
export const sanitizeForInnerHTML = (content: string) => {
  return {
    __html: sanitizeHtml(content)
  };
};

/**
 * Sanitizes markdown content for dangerouslySetInnerHTML
 */
export const sanitizeMarkdownForInnerHTML = (content: string) => {
  return {
    __html: sanitizeMarkdownHtml(content)
  };
};

// Export constants for external use
export { ALLOWED_TAGS, ALLOWED_ATTR, FORBID_TAGS, FORBID_ATTR }; 