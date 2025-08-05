// GA4 Analytics Utility
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-1NJDY2B92X';

// Event types for tracking
export type EventType = 
  | 'like_tool' 
  | 'bookmark_tool' 
  | 'share_item' 
  | 'comment_posted' 
  | 'auth_action'
  | 'like_blog'
  | 'bookmark_blog'
  | 'like_prompt'
  | 'bookmark_prompt';

// Base event parameters
interface BaseEventParams {
  page_url: string;
  user_id?: string;
  event_type: EventType;
}

// Tool-specific event parameters
interface ToolEventParams extends BaseEventParams {
  tool_id: string;
  tool_name?: string;
  tool_category?: string;
}

// Blog-specific event parameters
interface BlogEventParams extends BaseEventParams {
  blog_id: string;
  blog_title?: string;
  blog_category?: string;
}

// Prompt-specific event parameters
interface PromptEventParams extends BaseEventParams {
  prompt_id: string;
  prompt_title?: string;
  prompt_category?: string;
}

// Share event parameters
interface ShareEventParams extends BaseEventParams {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'copy';
  content_type: 'tool' | 'blog' | 'prompt';
  content_id: string;
  content_title?: string;
}

// Comment event parameters
interface CommentEventParams extends BaseEventParams {
  content_type: 'tool' | 'blog' | 'prompt';
  content_id: string;
  content_title?: string;
  comment_length?: number;
}

// Auth event parameters
interface AuthEventParams extends BaseEventParams {
  auth_action: 'sign_in' | 'sign_up' | 'sign_out';
  auth_method?: string;
}

// Union type for all event parameters
export type EventParams = 
  | ToolEventParams 
  | BlogEventParams 
  | PromptEventParams 
  | ShareEventParams 
  | CommentEventParams 
  | AuthEventParams;

/**
 * Track a custom GA4 event
 * @param eventName - The name of the event
 * @param params - Event parameters
 */
export const trackEvent = (eventName: EventType, params: EventParams): void => {
  try {
    // Ensure gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      // Add common parameters
      const eventParams = {
        ...params,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
      };

      // Send the event to GA4
      window.gtag('event', eventName, eventParams);
      
      console.log(`📊 GA4 Event tracked: ${eventName}`, eventParams);
    } else {
      console.warn('GA4 gtag not available');
    }
  } catch (error) {
    console.error('Error tracking GA4 event:', error);
  }
};

/**
 * Track tool like/unlike event
 */
export const trackToolLike = (
  toolId: string, 
  toolName?: string, 
  toolCategory?: string,
  userId?: string
): void => {
  trackEvent('like_tool', {
    tool_id: toolId,
    tool_name: toolName,
    tool_category: toolCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'like_tool'
  });
};

/**
 * Track tool bookmark/unbookmark event
 */
export const trackToolBookmark = (
  toolId: string, 
  toolName?: string, 
  toolCategory?: string,
  userId?: string
): void => {
  trackEvent('bookmark_tool', {
    tool_id: toolId,
    tool_name: toolName,
    tool_category: toolCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'bookmark_tool'
  });
};

/**
 * Track blog like/unlike event
 */
export const trackBlogLike = (
  blogId: string, 
  blogTitle?: string, 
  blogCategory?: string,
  userId?: string
): void => {
  trackEvent('like_blog', {
    blog_id: blogId,
    blog_title: blogTitle,
    blog_category: blogCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'like_blog'
  });
};

/**
 * Track blog bookmark/unbookmark event
 */
export const trackBlogBookmark = (
  blogId: string, 
  blogTitle?: string, 
  blogCategory?: string,
  userId?: string
): void => {
  trackEvent('bookmark_blog', {
    blog_id: blogId,
    blog_title: blogTitle,
    blog_category: blogCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'bookmark_blog'
  });
};

/**
 * Track prompt like/unlike event
 */
export const trackPromptLike = (
  promptId: string, 
  promptTitle?: string, 
  promptCategory?: string,
  userId?: string
): void => {
  trackEvent('like_prompt', {
    prompt_id: promptId,
    prompt_title: promptTitle,
    prompt_category: promptCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'like_prompt'
  });
};

/**
 * Track prompt bookmark/unbookmark event
 */
export const trackPromptBookmark = (
  promptId: string, 
  promptTitle?: string, 
  promptCategory?: string,
  userId?: string
): void => {
  trackEvent('bookmark_prompt', {
    prompt_id: promptId,
    prompt_title: promptTitle,
    prompt_category: promptCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'bookmark_prompt'
  });
};

/**
 * Track share event
 */
export const trackShare = (
  platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'copy',
  contentType: 'tool' | 'blog' | 'prompt',
  contentId: string,
  contentTitle?: string,
  userId?: string
): void => {
  trackEvent('share_item', {
    platform,
    content_type: contentType,
    content_id: contentId,
    content_title: contentTitle,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'share_item'
  });
};

/**
 * Track comment posted event
 */
export const trackCommentPosted = (
  contentType: 'tool' | 'blog' | 'prompt',
  contentId: string,
  contentTitle?: string,
  commentLength?: number,
  userId?: string
): void => {
  trackEvent('comment_posted', {
    content_type: contentType,
    content_id: contentId,
    content_title: contentTitle,
    comment_length: commentLength,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'comment_posted'
  });
};

/**
 * Track authentication event
 */
export const trackAuthAction = (
  authAction: 'sign_in' | 'sign_up' | 'sign_out',
  authMethod?: string,
  userId?: string
): void => {
  trackEvent('auth_action', {
    auth_action: authAction,
    auth_method: authMethod,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'auth_action'
  });
};

/**
 * Initialize GA4 tracking
 */
export const initGA4 = (): void => {
  if (typeof window !== 'undefined' && !window.gtag) {
    console.warn('GA4 not initialized. Make sure the gtag script is loaded.');
  }
};

// Auto-initialize when the module is imported
if (typeof window !== 'undefined') {
  initGA4();
} 