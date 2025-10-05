# ShareButton Component

## Overview
The ShareButton component is a reusable React component that provides social sharing functionality for content across the AITerritory website.

## Features
- Supports multiple social media platforms (Twitter, Facebook, LinkedIn, WhatsApp, Telegram, Email)
- Multiple display variants (inline, dropdown, mobile, floating)
- Dynamic metadata (title, description, image, URL)
- Analytics integration
- Responsive design
- Clipboard copy functionality

## Usage

### Installation
The component is already included in the project. No additional installation is required.

### Basic Usage
```tsx
import { ShareButton } from '@/components/ShareButton';

// Inline variant (default)
<ShareButton
  url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
  title="How OpenAI GPT-4o is Changing the Future of AI"
  description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
  image="https://aiterritory.org/images/gpt-4o-preview.jpg"
/>
```

### Variants
```tsx
// Dropdown variant
<ShareButton
  url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
  title="How OpenAI GPT-4o is Changing the Future of AI"
  description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
  image="https://aiterritory.org/images/gpt-4o-preview.jpg"
  variant="dropdown"
/>

// Mobile variant
<ShareButton
  url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
  title="How OpenAI GPT-4o is Changing the Future of AI"
  description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
  image="https://aiterritory.org/images/gpt-4o-preview.jpg"
  variant="mobile"
/>

// Floating variant
<ShareButton
  url="https://aiterritory.org/blog/how-openai-gpt-4o-is-changing-the-future-of-ai"
  title="How OpenAI GPT-4o is Changing the Future of AI"
  description="Explore the latest advancements in AI with GPT-4o and how it's revolutionizing the industry."
  image="https://aiterritory.org/images/gpt-4o-preview.jpg"
  variant="floating"
/>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| url | string | Yes | The URL to be shared |
| title | string | Yes | The title of the content |
| description | string | No | The description of the content |
| image | string | No | The image URL for the content |
| className | string | No | Additional CSS classes |
| variant | 'floating' \| 'inline' \| 'mobile' \| 'dropdown' | No | Display variant (default: 'inline') |
| onShare | (platform: string) => void | No | Callback function when a platform is selected |

## Testing
To test the component:

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the test page:
   ```
   http://localhost:5173/test-share-button
   ```

3. Verify that all variants render correctly and function as expected.

## Integration
The ShareButton component has been integrated into the following pages:
- Blog posts (BlogLayout component)
- Tool details pages
- Prompt details pages

## Customization
To add new social media platforms:
1. Add the platform to the `SHARE_PLATFORMS` array in `ShareButton.tsx`
2. Include the appropriate icon from `react-icons`
3. Implement the sharing URL generation logic

## Analytics
The component automatically tracks share events using the existing analytics system. Each share action is logged with:
- Platform name
- Content type
- Content ID
- Content title
- User ID (if available)