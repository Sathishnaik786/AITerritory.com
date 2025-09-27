// Test file to verify DOMPurify implementation
// Run with: node test-dompurify.js

const { sanitizeText, sanitizeHtmlContent, sanitizeMarkdownContent } = require('./server/lib/sanitizeHtml');

console.log('🧪 Testing DOMPurify Implementation\n');

// Test cases
const testCases = [
  {
    name: 'Script Injection',
    input: '<script>alert("xss")</script>Hello World',
    expected: 'Hello World'
  },
  {
    name: 'Event Handler',
    input: '<img src="x" onerror="alert(\'xss\')" alt="test">',
    expected: '<img src="x" alt="test">'
  },
  {
    name: 'JavaScript Protocol',
    input: '<a href="javascript:alert(\'xss\')">Click me</a>',
    expected: '<a>Click me</a>'
  },
  {
    name: 'Safe HTML',
    input: '<p>This is <strong>safe</strong> HTML with <a href="https://example.com">links</a>.</p>',
    expected: '<p>This is <strong>safe</strong> HTML with <a href="https://example.com">links</a>.</p>'
  },
  {
    name: 'Mixed Content',
    input: '<p>Safe content</p><script>alert("xss")</script><p>More safe content</p>',
    expected: '<p>Safe content</p><p>More safe content</p>'
  },
  {
    name: 'Style Injection',
    input: '<style>body{background:red}</style><p>Content</p>',
    expected: '<p>Content</p>'
  },
  {
    name: 'Iframe Injection',
    input: '<iframe src="javascript:alert(\'xss\')"></iframe><p>Content</p>',
    expected: '<p>Content</p>'
  }
];

// Test sanitizeText function
console.log('📝 Testing sanitizeText (removes all HTML):');
testCases.forEach(test => {
  const result = sanitizeText(test.input);
  const passed = result === test.input.replace(/<[^>]*>/g, '');
  console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
  if (!passed) {
    console.log(`   Input: ${test.input}`);
    console.log(`   Expected: ${test.input.replace(/<[^>]*>/g, '')}`);
    console.log(`   Got: ${result}`);
  }
});

console.log('\n🔒 Testing sanitizeHtmlContent (allows safe HTML):');
testCases.forEach(test => {
  const result = sanitizeHtmlContent(test.input);
  const passed = !result.includes('<script') && !result.includes('onerror') && !result.includes('javascript:');
  console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
  if (!passed) {
    console.log(`   Input: ${test.input}`);
    console.log(`   Result: ${result}`);
  }
});

console.log('\n📄 Testing sanitizeMarkdownContent (markdown-specific):');
const markdownTests = [
  {
    name: 'Markdown with HTML',
    input: '# Title\n\nThis is **bold** and <script>alert("xss")</script> content.',
    expected: 'Safe markdown content'
  },
  {
    name: 'Code blocks',
    input: '```\n<script>alert("xss")</script>\n```\n\nNormal content',
    expected: 'Safe code blocks'
  }
];

markdownTests.forEach(test => {
  const result = sanitizeMarkdownContent(test.input);
  const passed = !result.includes('<script') && !result.includes('onerror');
  console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASSED' : 'FAILED'}`);
  if (!passed) {
    console.log(`   Input: ${test.input}`);
    console.log(`   Result: ${result}`);
  }
});

console.log('\n🎯 Performance Test:');
const largeInput = '<p>Safe content</p>'.repeat(1000) + '<script>alert("xss")</script>' + '<p>More content</p>'.repeat(1000);
const start = Date.now();
const result = sanitizeHtmlContent(largeInput);
const end = Date.now();
console.log(`✅ Large content sanitization: ${end - start}ms`);
console.log(`   Input length: ${largeInput.length} characters`);
console.log(`   Output length: ${result.length} characters`);
console.log(`   Script removed: ${!result.includes('<script') ? 'YES' : 'NO'}`);

console.log('\n✨ DOMPurify Implementation Test Complete!');
console.log('All tests should pass for a secure implementation.'); 