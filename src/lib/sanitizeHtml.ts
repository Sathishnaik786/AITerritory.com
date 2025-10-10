/**
 * HTML Sanitization Utilities
 * Provides XSS protection for user-generated content
 */

import DOMPurify from 'dompurify';

// Configuration constants
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

const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url, window.location.origin);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Sanitizes HTML content to prevent XSS attacks using DOMPurify
 */
export const sanitizeHtml = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  if (typeof window !== 'undefined' && DOMPurify) {
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
  
  return '';
};

/**
 * Sanitizes markdown HTML content using DOMPurify
 */
export const sanitizeMarkdownHtml = (content: string): string => {
  if (!content || typeof content !== 'string') return '';
  
  if (typeof window !== 'undefined' && DOMPurify) {
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
  
  return '';
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