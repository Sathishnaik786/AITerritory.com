let DOMPurify: any = null;
if (typeof window !== 'undefined') {
  try {
    DOMPurify = require('dompurify');
    if (DOMPurify && DOMPurify.default) DOMPurify = DOMPurify.default;
  } catch (e) {
    // ignore
  }
}

export function sanitizeHtml(dirty: string) {
  if (typeof window !== 'undefined' && DOMPurify) {
    return DOMPurify.sanitize(dirty);
  }
  // fallback basic sanitizer
  return dirty.replace(/<script.*?>.*?<\/script>/gi, '').replace(/on\w+=['"].*?['"]/gi, '');
} 