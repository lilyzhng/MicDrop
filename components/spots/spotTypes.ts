/**
 * Spot Types and Interfaces
 * 
 * Type definitions for the four practice locations:
 * - The Daily Commute (reviews only)
 * - The Coffee Sanctuary (new problems only)
 * - The Mysterious Forest (mixed/random)
 * - Himmel Park (company-specific interview prep)
 * 
 * Priority System:
 * - p=0: Daily new questions goal (Coffee Sanctuary) - highest priority
 * - p=1: Daily reviews (Daily Commute) - lower priority
 */

import { StudyStats } from '../../types/database';
import { MLSystemDesignTopic } from '../../types';

// Daily new problems goal - default value, can be overridden by user settings
// DEPRECATED: Use user's studySettings.dailyNewGoal instead
export const DAILY_NEW_GOAL = 5;

// Base spot definition (static data)
export interface PowerSpot {
  id: string;
  name: string;
  ritual: string;
  icon: 'train' | 'coffee' | 'forest' | 'building' | 'playground';
  description: string;
  isRandom: boolean;
  reviewsPriority: boolean;
  onlyReviews: boolean;
  newProblemsOnly: boolean;
  isCompanySpecific?: boolean;  // New flag for company-specific spots (Himmel Park)
}

// Spot with assigned topic (runtime data)
export interface SpotWithTopic extends PowerSpot {
  topic: string;  // The problem_group name (or 'random' for mystery spot, or 'company_specific' for Himmel Park)
  topicDisplay: string;  // Formatted display name
  remaining: number;  // For newProblemsOnly: problems with no progress. Otherwise: problems not mastered.
  locked: boolean;  // Whether the topic is locked (user has entered this spot today)
  // Daily new goal tracking (for newProblemsOnly spots like Coffee Sanctuary)
  dailyNewCompleted?: number;  // How many new problems completed today
  dailyNewRemaining?: number;  // How many more needed to hit dailyNewGoal
  dailyNewGoal?: number;  // User's configured daily new problems goal
  // Questions answered tracking (for topic unlock after QUESTIONS_TO_UNLOCK)
  questionsAnswered?: number;  // How many questions answered in this locked topic
  // Company-specific data (for Himmel Park)
  selectedinterviewTypeId?: string;  // Selected company UUID (actually the interview question type like 'ml_system_design')
  selectedCompanyName?: string;  // Selected company name for display
  // ML Topic filter (for ml_system_design type in Himmel Park)
  selectedMlTopic?: MLSystemDesignTopic;  // Selected ML topic filter (e.g., 'data', 'training')
  selectedMlTopicDisplay?: string;  // Display name for the selected ML topic
  availableMlTopics?: MLSystemDesignTopic[];  // Available ML topics for the current question type (unique set)
}

// Number of questions to answer before a topic can be unlocked (to allow switching)
export const QUESTIONS_TO_UNLOCK = 3;

// Saved spot topic assignments (persisted per day)
export interface SavedSpotAssignment {
  spotId: string;
  topic: string;
  topicDisplay: string;
  locked: boolean;  // true = user has entered this spot, topic is frozen for the day
  questionsAnswered?: number;  // number of questions answered in this locked topic session
}

export interface SavedDayAssignments {
  date: string;  // YYYY-MM-DD format
  assignments: SavedSpotAssignment[];
}

// Props for SpotCard component
export interface SpotCardProps {
  spot: SpotWithTopic;
  studyStats: StudyStats | null;
  onStartSession: (spot: SpotWithTopic) => void;
  onRefresh?: (spotId: string, e: React.MouseEvent) => void;
  // Company-specific props (for Himmel Park)
  companies?: Array<{id: string; name: string; description: string | null; icon: string | null}>;
  isLoadingCompanies?: boolean;
  onCompanySelect?: (spotId: string, interviewTypeId: string, companyName: string) => void;
  // ML Topic filter props (for ml_system_design in Himmel Park)
  onMlTopicSelect?: (spotId: string, topic: MLSystemDesignTopic | undefined, topicDisplay: string) => void;
}

// Spot variant for styling
export type SpotVariant = 'reviews' | 'coffee' | 'forest' | 'company' | 'default';

export function getSpotVariant(spot: SpotWithTopic): SpotVariant {
  if (spot.onlyReviews) return 'reviews';
  if (spot.isRandom) return 'forest';
  if (spot.newProblemsOnly) return 'coffee';
  if (spot.isCompanySpecific) return 'company';
  return 'default';
}

