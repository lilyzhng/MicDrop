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

// Daily new problems goal - pass at least 5 new questions per day
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
  dailyNewRemaining?: number;  // How many more needed to hit DAILY_NEW_GOAL
  // Company-specific data (for Himmel Park)
  selectedCompanyId?: string;  // Selected company UUID
  selectedCompanyName?: string;  // Selected company name for display
}

// Saved spot topic assignments (persisted per day)
export interface SavedSpotAssignment {
  spotId: string;
  topic: string;
  topicDisplay: string;
  locked: boolean;  // true = user has entered this spot, topic is frozen for the day
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
  onCompanySelect?: (spotId: string, companyId: string, companyName: string) => void;
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

