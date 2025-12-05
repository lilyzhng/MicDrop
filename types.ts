
export interface ScriptWord {
  id: string;
  word: string;
  cleanWord: string;
  isSpoken: boolean;
  isParagraphStart?: boolean;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export interface TeleprompterConfig {
  fontSize: number;
  opacity: number;
  scrollSpeed: number; // Manual offset if needed, though we use auto
}

export interface DetailedFeedback {
  category: string; // e.g. "Pace (Speed & Rhythm)"
  issue: string;    // "The Issue: ..."
  instance: string; // "Specific Instance: ..."
  rewrite: string;  // "The Human Rewrite" - Conversational, high-EQ revision
  explanation: string; // "Why this works" - Breakdown of techniques used
}

export interface Highlight {
  category: string;
  strength: string;
  quote: string;
}

export interface CoachingRewrite {
  diagnosis: string; // "The Diagnosis (Brutal Honesty)"
  fix: string;       // "The Fix (Tactical Strategy)"
  rewrite: string;   // "The Human Rewrite"
}

export interface PerformanceReport {
  rating: number;
  summary: string;
  suggestions: string[];
  pronunciationFeedback: string[];
  detailedFeedback?: DetailedFeedback[]; // Negative/Constructive feedback
  highlights?: Highlight[]; // Positive feedback
  coachingRewrite?: CoachingRewrite; // Global rewrite (optional/legacy)
}
