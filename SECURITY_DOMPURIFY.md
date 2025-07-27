# DOMPurify Security Implementation

## Overview

This document describes the implementation of DOMPurify (DOM sanitizer) in the AITerritory.org project to prevent XSS (Cross-Site Scripting) attacks. The implementation provides both frontend and backend sanitization layers for comprehensive security.

## What DOMPurify Does

DOMPurify is a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG. It's written in JavaScript and works in all modern browsers (Safari, Opera (15+), Internet Explorer (10+), Edge, Firefox and Chrome - as well as almost anything else using Blink or WebKit). It doesn't break on IE6 or other legacy browsers. It simply does nothing there.

### Key Features:
- **XSS Protection**: Removes malicious scripts and event handlers
- **HTML Sanitization**: Allows safe HTML while removing dangerous elements
- **Configurable**: Customizable allowed tags, attributes, and schemes
- **Performance**: Fast and efficient sanitization
- **Comprehensive**: Handles various attack vectors

## Implementation Details

### Frontend Implementation

#### 1. Utility Functions (`src/lib/sanitizeHtml.ts`)

The frontend provides several sanitization utilities:

- **`sanitizeHtml(content, options?)`**: General HTML sanitization
- **`sanitizeMarkdownHtml(content)`**: Markdown-specific sanitization (more permissive)
- **`sanitizeText(content)`**: Plain text sanitization (removes all HTML)
- **`sanitizeForInnerHTML(content)`**: Returns object for `dangerouslySetInnerHTML`
- **`sanitizeMarkdownForInnerHTML(content)`**: Markdown version for `dangerouslySetInnerHTML`

#### 2. Components Updated

The following components now use DOMPurify sanitization:

- **`BlogDetail.tsx`**: Blog content rendering
- **`ToolDescriptionSection.tsx`**: Tool descriptions
- **`BlogEditor.tsx`**: Blog editor preview
- **`BlogComments.tsx`**: User comments
- **`Testimonials.tsx`**: User testimonials
- **`Prompts.tsx`**: Prompt descriptions and comments
- **`chart.tsx`**: Chart styling (dangerouslySetInnerHTML)

#### 3. Configuration

**Allowed Tags**: Common safe HTML elements including:
- Text formatting: `p`, `br`, `strong`, `em`, `u`, `s`, `del`, `ins`
- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Lists: `ul`, `ol`, `li`, `dl`, `dt`, `dd`
- Code: `pre`, `code`, `kbd`, `samp`, `var`
- Links and media: `a`, `img`, `figure`, `figcaption`
- Tables: `table`, `thead`, `tbody`, `tfoot`, `tr`, `td`, `th`
- Layout: `div`, `span`, `section`, `article`, `aside`, `header`, `footer`
- Semantic: `mark`, `small`, `sub`, `sup`, `time`, `cite`, `q`, `abbr`, `acronym`, `dfn`, `address`, `hr`

**Forbidden Tags**: Dangerous elements that are always removed:
- `script`, `style`, `iframe`, `object`, `embed`
- `form`, `input`, `textarea`, `select`, `button`

**Forbidden Attributes**: Event handlers and dangerous attributes:
- All `on*` event handlers (onclick, onload, onerror, etc.)
- JavaScript protocol handlers

### Backend Implementation

#### 1. Utility Functions (`server/lib/sanitizeHtml.js`)

The backend provides similar sanitization utilities:

- **`sanitizeHtmlContent(content, options?)`**: General HTML sanitization
- **`sanitizeText(content)`**: Plain text sanitization
- **`sanitizeMarkdownContent(content)`**: Markdown-specific sanitization

#### 2. Controllers Updated

The following backend controllers now sanitize user input:

- **`blogCommentsController.js`**: Blog comments
- **`reviewsController.js`**: Tool reviews
- **`testimonialsController.js`**: User testimonials
- **`submissionsController.js`**: Contact forms, tool submissions, feature requests
- **`feedback.js`**: Feedback submissions

#### 3. Sanitization Strategy

**Input Sanitization**: All user-generated content is sanitized before database storage
**Output Sanitization**: Content is also sanitized on the frontend before rendering
**Double Protection**: Both layers provide defense-in-depth security

## Security Benefits

### 1. XSS Prevention
- Removes `<script>` tags and event handlers
- Sanitizes JavaScript protocol handlers
- Prevents code injection attacks

### 2. Content Security
- Allows safe HTML formatting
- Preserves legitimate user content
- Maintains functionality while ensuring security

### 3. Defense in Depth
- Frontend sanitization for immediate protection
- Backend sanitization for data integrity
- Multiple layers of security

## Usage Examples

### Frontend Usage

```typescript
import { sanitizeHtml, sanitizeText, sanitizeForInnerHTML } from '@/lib/sanitizeHtml';

// Sanitize HTML content
const safeHtml = sanitizeHtml(userContent);

// Sanitize plain text
const safeText = sanitizeText(userContent);

// For dangerouslySetInnerHTML
const safeInnerHtml = sanitizeForInnerHTML(userContent);
```

### Backend Usage

```javascript
const { sanitizeText, sanitizeHtmlContent } = require('../lib/sanitizeHtml');

// Sanitize user input before saving
const sanitizedContent = sanitizeText(req.body.content);
```

## Configuration Options

### Frontend Configuration

The sanitization can be customized by passing options:

```typescript
const customOptions = {
  ALLOWED_TAGS: ['p', 'strong', 'em'],
  ALLOWED_ATTR: ['class', 'id'],
  FORBID_TAGS: ['script', 'style']
};

const sanitized = sanitizeHtml(content, customOptions);
```

### Backend Configuration

Similar customization is available on the backend:

```javascript
const customOptions = {
  allowedTags: ['p', 'strong', 'em'],
  allowedAttributes: { 'p': ['class'] },
  transformTags: { 'script': 'div' }
};

const sanitized = sanitizeHtmlContent(content, customOptions);
```

## Testing

### Manual Testing

To test the sanitization, try injecting malicious content:

1. **Script Injection**: `<script>alert('xss')</script>`
2. **Event Handlers**: `<img src="x" onerror="alert('xss')">`
3. **JavaScript Protocol**: `<a href="javascript:alert('xss')">Click</a>`

All of these should be stripped or neutralized.

### Automated Testing

The implementation includes error handling and logging:

```javascript
try {
  const sanitized = sanitizeHtml(maliciousContent);
  console.log('Sanitization successful:', sanitized);
} catch (error) {
  console.error('Sanitization failed:', error);
  // Fallback to empty string
}
```

## Performance Considerations

- **Frontend**: DOMPurify is optimized for browser performance
- **Backend**: sanitize-html is efficient for server-side processing
- **Caching**: Sanitized content can be cached safely
- **Memory**: Minimal memory overhead for sanitization operations

## Maintenance

### Updating Dependencies

Keep DOMPurify and sanitize-html updated:

```bash
# Frontend
npm update dompurify @types/dompurify

# Backend
npm update sanitize-html
```

### Monitoring

Monitor for:
- Sanitization errors in logs
- Performance impact
- False positives (legitimate content being stripped)

## Disabling Backend Sanitization

If needed, backend sanitization can be disabled by commenting out the sanitization calls in controllers. However, this is **not recommended** for security reasons.

## Conclusion

The DOMPurify implementation provides comprehensive XSS protection while maintaining functionality and performance. The dual-layer approach (frontend + backend) ensures robust security against various attack vectors.

## References

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [sanitize-html Documentation](https://github.com/apostrophecms/sanitize-html)
- [OWASP XSS Prevention](https://owasp.org/www-project-cheat-sheets/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) 