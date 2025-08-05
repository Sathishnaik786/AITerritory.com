import { useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { logBlogEvent } from '../services/blogAnalyticsService';

interface EngagementTrackerOptions {
  blogId: string;
  blogTitle: string;
  enableScrollTracking?: boolean;
  enableInteractionTracking?: boolean;
  scrollThresholds?: number[];
  sessionTimeout?: number; // in minutes
}

interface EngagementEvent {
  type: 'scroll_depth' | 'comment' | 'reaction' | 'share' | 'bookmark' | 'newsletter_signup';
  value?: string | number;
  metadata?: Record<string, any>;
  timestamp: number;
}

export const useEngagementTracker = (options: EngagementTrackerOptions) => {
  const { user, isSignedIn } = useUser();
  const {
    blogId,
    blogTitle,
    enableScrollTracking = true,
    enableInteractionTracking = true,
    scrollThresholds = [25, 50, 75, 100],
    sessionTimeout = 30
  } = options;

  const trackedThresholds = useRef<Set<number>>(new Set());
  const lastActivity = useRef<number>(Date.now());
  const sessionId = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const events = useRef<EngagementEvent[]>([]);

  // Check if session is still active
  const isSessionActive = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity.current;
    const sessionTimeoutMs = sessionTimeout * 60 * 1000;
    
    if (timeSinceLastActivity > sessionTimeoutMs) {
      // Session expired, start new session
      sessionId.current = `session_${now}_${Math.random().toString(36).substr(2, 9)}`;
      trackedThresholds.current.clear();
      events.current = [];
    }
    
    lastActivity.current = now;
    return true;
  }, [sessionTimeout]);

  // Track scroll depth
  const trackScrollDepth = useCallback(() => {
    if (!enableScrollTracking || !isSessionActive()) return;

    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    // Check if we've reached any new thresholds
    scrollThresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !trackedThresholds.current.has(threshold)) {
        trackedThresholds.current.add(threshold);
        
        const event: EngagementEvent = {
          type: 'scroll_depth',
          value: threshold,
          metadata: {
            scroll_percent: scrollPercent,
            session_id: sessionId.current
          },
          timestamp: Date.now()
        };

        events.current.push(event);
        
        // Log to analytics service
        logBlogEvent({
          event_type: 'scroll_depth',
          blog_id: blogId,
          user_id: isSignedIn ? user?.id : undefined,
          metadata: {
            depth: threshold,
            scroll_percent: scrollPercent,
            session_id: sessionId.current
          }
        });

        console.log(`📊 Scroll depth tracked: ${threshold}%`);
      }
    });
  }, [enableScrollTracking, scrollThresholds, blogId, isSignedIn, user?.id, isSessionActive]);

  // Track user interactions
  const trackInteraction = useCallback((type: EngagementEvent['type'], value?: string | number, metadata?: Record<string, any>) => {
    if (!enableInteractionTracking || !isSessionActive()) return;

    const event: EngagementEvent = {
      type,
      value,
      metadata: {
        ...metadata,
        session_id: sessionId.current
      },
      timestamp: Date.now()
    };

    events.current.push(event);

    // Log to analytics service
    logBlogEvent({
      event_type: type,
      blog_id: blogId,
      user_id: isSignedIn ? user?.id : undefined,
      metadata: {
        value,
        ...metadata,
        session_id: sessionId.current
      }
    });

    console.log(`🎯 Interaction tracked: ${type}`, { value, metadata });
  }, [enableInteractionTracking, blogId, isSignedIn, user?.id, isSessionActive]);

  // Track comment activity
  const trackComment = useCallback((action: 'post' | 'reply' | 'reaction' | 'report', metadata?: Record<string, any>) => {
    trackInteraction('comment', action, {
      action,
      blog_title: blogTitle,
      ...metadata
    });
  }, [trackInteraction, blogTitle]);

  // Track share activity
  const trackShare = useCallback((platform: string, metadata?: Record<string, any>) => {
    trackInteraction('share', platform, {
      platform,
      blog_title: blogTitle,
      ...metadata
    });
  }, [trackInteraction, blogTitle]);

  // Track bookmark activity
  const trackBookmark = useCallback((action: 'add' | 'remove', metadata?: Record<string, any>) => {
    trackInteraction('bookmark', action, {
      action,
      blog_title: blogTitle,
      ...metadata
    });
  }, [trackInteraction, blogTitle]);

  // Track newsletter signup
  const trackNewsletterSignup = useCallback((metadata?: Record<string, any>) => {
    trackInteraction('newsletter_signup', 'signup', {
      blog_title: blogTitle,
      ...metadata
    });
  }, [trackInteraction, blogTitle]);

  // Get engagement summary
  const getEngagementSummary = useCallback(() => {
    const summary = {
      session_id: sessionId.current,
      total_events: events.current.length,
      scroll_depth_reached: Math.max(...trackedThresholds.current, 0),
      events_by_type: {} as Record<string, number>,
      session_duration: Date.now() - lastActivity.current,
      last_activity: new Date(lastActivity.current).toISOString()
    };

    // Count events by type
    events.current.forEach(event => {
      summary.events_by_type[event.type] = (summary.events_by_type[event.type] || 0) + 1;
    });

    return summary;
  }, []);

  // Reset tracking (useful for testing or new sessions)
  const resetTracking = useCallback(() => {
    trackedThresholds.current.clear();
    events.current = [];
    sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    lastActivity.current = Date.now();
  }, []);

  // Set up scroll tracking
  useEffect(() => {
    if (!enableScrollTracking) return;

    const handleScroll = () => {
      trackScrollDepth();
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial scroll check
    trackScrollDepth();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [enableScrollTracking, trackScrollDepth]);

  // Set up activity tracking
  useEffect(() => {
    if (!enableInteractionTracking) return;

    const updateActivity = () => {
      lastActivity.current = Date.now();
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [enableInteractionTracking]);

  // Log session start
  useEffect(() => {
    if (enableInteractionTracking) {
      console.log(`🚀 Engagement tracking started for blog: ${blogTitle}`, {
        session_id: sessionId.current,
        user_id: isSignedIn ? user?.id : 'anonymous'
      });
    }
  }, [blogTitle, enableInteractionTracking, isSignedIn, user?.id]);

  return {
    trackInteraction,
    trackComment,
    trackShare,
    trackBookmark,
    trackNewsletterSignup,
    getEngagementSummary,
    resetTracking,
    sessionId: sessionId.current,
    isSessionActive: isSessionActive()
  };
}; 