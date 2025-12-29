import { useEffect, useRef, useCallback, useState } from 'react';

export interface IdleSessionTimeoutOptions {
  /** Time in milliseconds before the session times out (default: 20 minutes) */
  timeoutMs?: number;
  /** Callback when the session times out due to inactivity */
  onTimeout: () => void;
  /** Whether the timeout tracking is currently enabled */
  enabled: boolean;
  /** Optional: show a warning before timeout (ms before timeout) */
  warningBeforeMs?: number;
  /** Callback when warning threshold is reached */
  onWarning?: () => void;
}

export interface IdleSessionTimeoutResult {
  /** Reset the idle timer (call on significant user actions) */
  resetIdleTimer: () => void;
  /** Time remaining in milliseconds (updates every second when < 5 min) */
  timeRemainingMs: number;
  /** Whether the warning has been triggered */
  isWarning: boolean;
  /** Manually dismiss the warning */
  dismissWarning: () => void;
}

const DEFAULT_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes
const DEFAULT_WARNING_BEFORE_MS = 2 * 60 * 1000; // 2 minutes before timeout

/**
 * Hook to track user idle time and auto-close sessions after inactivity.
 * 
 * Tracks mouse movements, key presses, clicks, scrolls, and touch events.
 * When no activity is detected for the specified timeout period, calls onTimeout.
 * 
 * @example
 * ```tsx
 * const { resetIdleTimer, timeRemainingMs, isWarning, dismissWarning } = useIdleSessionTimeout({
 *   timeoutMs: 20 * 60 * 1000, // 20 minutes
 *   onTimeout: () => setStep('locations'),
 *   enabled: step !== 'locations', // Only track when in an active session
 *   warningBeforeMs: 2 * 60 * 1000, // Warn 2 minutes before
 *   onWarning: () => console.log('Session will timeout soon!')
 * });
 * ```
 */
export function useIdleSessionTimeout({
  timeoutMs = DEFAULT_TIMEOUT_MS,
  onTimeout,
  enabled,
  warningBeforeMs = DEFAULT_WARNING_BEFORE_MS,
  onWarning,
}: IdleSessionTimeoutOptions): IdleSessionTimeoutResult {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(timeoutMs);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  
  // Store callbacks in refs to avoid re-creating event listeners
  const onTimeoutRef = useRef(onTimeout);
  const onWarningRef = useRef(onWarning);
  
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
    onWarningRef.current = onWarning;
  }, [onTimeout, onWarning]);
  
  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);
  
  // Start the timeout countdown
  const startTimeoutCountdown = useCallback(() => {
    clearTimers();
    lastActivityRef.current = Date.now();
    setTimeRemainingMs(timeoutMs);
    setIsWarning(false);
    
    // Set warning timeout (if warning is configured and before main timeout)
    if (warningBeforeMs > 0 && warningBeforeMs < timeoutMs) {
      const warningDelay = timeoutMs - warningBeforeMs;
      warningTimeoutRef.current = setTimeout(() => {
        setIsWarning(true);
        onWarningRef.current?.();
      }, warningDelay);
    }
    
    // Set main timeout
    timeoutRef.current = setTimeout(() => {
      console.log('[IdleTimeout] Session timed out due to inactivity');
      onTimeoutRef.current();
    }, timeoutMs);
  }, [timeoutMs, warningBeforeMs, clearTimers]);
  
  // Reset the idle timer
  const resetIdleTimer = useCallback(() => {
    if (enabled) {
      startTimeoutCountdown();
    }
  }, [enabled, startTimeoutCountdown]);
  
  // Dismiss warning (user acknowledged they're still active)
  const dismissWarning = useCallback(() => {
    setIsWarning(false);
    resetIdleTimer();
  }, [resetIdleTimer]);
  
  // Update time remaining display (only when close to timeout)
  useEffect(() => {
    if (!enabled) {
      setTimeRemainingMs(timeoutMs);
      return;
    }
    
    const updateInterval = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, timeoutMs - elapsed);
      setTimeRemainingMs(remaining);
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, [enabled, timeoutMs]);
  
  // Set up activity listeners
  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setIsWarning(false);
      return;
    }
    
    // Activity events to track
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'wheel',
    ] as const;
    
    // Throttle to avoid excessive resets (max once per 5 seconds)
    let lastReset = 0;
    const throttleMs = 5000;
    
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastReset > throttleMs) {
        lastReset = now;
        resetIdleTimer();
      }
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    
    // Also track visibility changes (user switching tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User came back to the tab - reset timer
        resetIdleTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start the initial countdown
    startTimeoutCountdown();
    
    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimers();
    };
  }, [enabled, resetIdleTimer, startTimeoutCountdown, clearTimers]);
  
  return {
    resetIdleTimer,
    timeRemainingMs,
    isWarning,
    dismissWarning,
  };
}

// Utility to format remaining time for display
export function formatTimeRemaining(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

