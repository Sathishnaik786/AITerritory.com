// GA4 Analytics Utility
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    plausible?: (eventName: string, options: { props: Record<string, unknown> }) => void;
  }
}

// GA4 Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-1NJDY2B92X';

// Google Ads Conversion Tracking
const GADS_CONV_ID = import.meta.env.VITE_GADS_CONV_ID;
const GADS_LABEL_SIGNUP = import.meta.env.VITE_GADS_LABEL_SIGNUP;
const GADS_LABEL_BOOKMARK = import.meta.env.VITE_GADS_LABEL_BOOKMARK;
const GADS_LABEL_SHARE = import.meta.env.VITE_GADS_LABEL_SHARE;
const GADS_LABEL_PURCHASE = import.meta.env.VITE_GADS_LABEL_PURCHASE;

// Helper function to check if gtag is available
const isGtagAvailable = (): boolean => {
  const available = typeof window !== 'undefined' && !!window.gtag;
  if (!available && import.meta.env.DEV) {
    console.warn('gtag not available yet - this is normal during initialization');
  }
  return available;
};

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
  | 'bookmark_prompt'
  | 'affiliate_click';

// Base event parameters
interface BaseEventParams {
  page_url: string;
  user_id?: string;
  event_type: EventType;
  // Add platform, timestamp, and referrer for all events
  platform?: "web";
  timestamp?: string;
  referrer?: string | null;
  // Google Ads conversion tracking parameter
  gads_conversion?: {
    id: string;
    label: string;
  };
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
  share_platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'copy';
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

// Affiliate event parameters
interface AffiliateEventParams extends BaseEventParams {
  affiliate_id: string;
  link_url: string;
  link_text?: string;
}

// Union type for all event parameters
export type EventParams = 
  | ToolEventParams 
  | BlogEventParams 
  | PromptEventParams 
  | ShareEventParams 
  | CommentEventParams 
  | AuthEventParams
  | AffiliateEventParams;

/**
 * Track a custom GA4 event
 * @param eventName - The name of the event
 * @param params - Event parameters
 */
export const trackEvent = (eventName: EventType, params: EventParams): void => {
  try {
    // Ensure gtag is available
    if (isGtagAvailable()) {
      // Add common parameters
      const enrichedParams = {
        ...params,
        platform: "web" as const,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
      };

      // Send the event to GA4
      window.gtag('event', eventName, enrichedParams);
      
      // Add Google Ads conversion hint if applicable
      if (import.meta.env.VITE_GADS_CONV_ID && 
          (eventName === 'auth_action' || eventName === 'bookmark_tool' || eventName === 'bookmark_blog' || eventName === 'bookmark_prompt' || eventName === 'share_item' || eventName === 'affiliate_click')) {
        // Determine the correct label based on event type
        let label = '';
        if (eventName === 'auth_action' && 'auth_action' in enrichedParams && enrichedParams.auth_action === 'sign_up') {
          label = import.meta.env.VITE_GADS_LABEL_SIGNUP || '';
        } else if (eventName.startsWith('bookmark_')) {
          label = import.meta.env.VITE_GADS_LABEL_BOOKMARK || '';
        } else if (eventName === 'share_item') {
          label = import.meta.env.VITE_GADS_LABEL_SHARE || '';
        } else if (eventName === 'affiliate_click') {
          label = 'affiliate_click'; // This would need to be configured in env vars
        }
        
        if (label) {
          console.log(`[AITerritory] Google Ads Conversion Tracking: ${eventName}`, {
            id: import.meta.env.VITE_GADS_CONV_ID,
            label
          });
        }
      }
      
      // Add Meta Pixel forwarding if applicable
      if (import.meta.env.VITE_META_PIXEL_ID && window.dataLayer) {
        window.dataLayer.push({
          event: "fb_forward",
          meta_event: eventName,
          meta_payload: enrichedParams
        });
        console.log(`[AITerritory] Meta Pixel Forwarding: ${eventName}`, enrichedParams);
      }
      
      // Add Plausible forwarding if applicable
      if (window.plausible) {
        window.plausible(eventName, { props: enrichedParams });
        console.log(`[AITerritory] Plausible Forwarding: ${eventName}`, enrichedParams);
      }
      
      console.log(`📊 GA4 Event tracked: ${eventName}`, enrichedParams);
    } else {
      console.warn('GA4 gtag not available - event not tracked:', eventName);
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
  // Add Google Ads conversion tracking for bookmark events
  const params: ToolEventParams = {
    tool_id: toolId,
    tool_name: toolName,
    tool_category: toolCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'bookmark_tool'
  };

  // Add Google Ads conversion tracking if configured
  if (GADS_CONV_ID && GADS_LABEL_BOOKMARK) {
    params.gads_conversion = {
      id: GADS_CONV_ID,
      label: GADS_LABEL_BOOKMARK
    };
  }

  trackEvent('bookmark_tool', params);
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
  // Add Google Ads conversion tracking for bookmark events
  const params: BlogEventParams = {
    blog_id: blogId,
    blog_title: blogTitle,
    blog_category: blogCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'bookmark_blog'
  };

  // Add Google Ads conversion tracking if configured
  if (GADS_CONV_ID && GADS_LABEL_BOOKMARK) {
    params.gads_conversion = {
      id: GADS_CONV_ID,
      label: GADS_LABEL_BOOKMARK
    };
  }

  trackEvent('bookmark_blog', params);
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
  // Add Google Ads conversion tracking for bookmark events
  const params: PromptEventParams = {
    prompt_id: promptId,
    prompt_title: promptTitle,
    prompt_category: promptCategory,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'bookmark_prompt'
  };

  // Add Google Ads conversion tracking if configured
  if (GADS_CONV_ID && GADS_LABEL_BOOKMARK) {
    params.gads_conversion = {
      id: GADS_CONV_ID,
      label: GADS_LABEL_BOOKMARK
    };
  }

  trackEvent('bookmark_prompt', params);
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
  // Add Google Ads conversion tracking for share events
  const params: ShareEventParams = {
    share_platform: platform,
    content_type: contentType,
    content_id: contentId,
    content_title: contentTitle,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'share_item'
  };

  // Add Google Ads conversion tracking if configured
  if (GADS_CONV_ID && GADS_LABEL_SHARE) {
    params.gads_conversion = {
      id: GADS_CONV_ID,
      label: GADS_LABEL_SHARE
    };
  }

  trackEvent('share_item', params);
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
  // Add Google Ads conversion tracking for sign up events
  const params: AuthEventParams = {
    auth_action: authAction,
    auth_method: authMethod,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'auth_action'
  };

  // Add Google Ads conversion tracking for sign up events
  if (authAction === 'sign_up' && GADS_CONV_ID && GADS_LABEL_SIGNUP) {
    params.gads_conversion = {
      id: GADS_CONV_ID,
      label: GADS_LABEL_SIGNUP
    };
  }

  trackEvent('auth_action', params);
};

/**
 * Track affiliate click event
 */
export const trackAffiliateClick = (
  affiliateId: string,
  linkUrl: string,
  linkText?: string,
  userId?: string
): void => {
  // Add Google Ads conversion tracking for affiliate events
  const params: AffiliateEventParams = {
    affiliate_id: affiliateId,
    link_url: linkUrl,
    link_text: linkText,
    page_url: window.location.href,
    user_id: userId,
    event_type: 'affiliate_click'
  };

  // Add Google Ads conversion tracking if configured
  if (GADS_CONV_ID) {
    params.gads_conversion = {
      id: GADS_CONV_ID,
      label: 'affiliate_click' // This would need to be configured in env vars
    };
  }

  trackEvent('affiliate_click', params);
};

/**
 * Initialize GA4 tracking
 */
export const initGA4 = (): void => {
  if (typeof window !== 'undefined' && !window.gtag) {
    // Only show warning in development mode
    if (import.meta.env.DEV) {
      console.warn('GA4 not initialized. Make sure the gtag script is loaded.');
    }
  } else if (import.meta.env.DEV) {
    console.log('GA4 is available and ready to track events');
  }
};

// Auto-initialize when the module is imported
if (typeof window !== 'undefined') {
  initGA4();
}

// Pageview tracking
export const pageview = (url: string) => {
  if (isGtagAvailable()) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  } else {
    console.warn('GA4 gtag not available - pageview not tracked:', url);
  }
};

// Event tracking
export const event = ({ action, category, label, value }: { 
  action: string; 
  category?: string; 
  label?: string; 
  value?: number; 
}) => {
  if (isGtagAvailable()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  } else {
    console.warn('GA4 gtag not available - event not tracked:', action);
  }
};