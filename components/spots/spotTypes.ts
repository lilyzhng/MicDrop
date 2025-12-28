/**
 * Spot Types and Interfaces
 * 
 * Type definitions for the three practice locations:
 * - The Daily Commute (reviews only)
 * - The Coffee Sanctuary (new problems only)
 * - The Mysterious Forest (mixed/random)
 */

import { StudyStats } from '../../types/database';

// Base spot definition (static data)
export interface PowerSpot {
  id: string;
  name: string;
  ritual: string;
  icon: 'train' | 'coffee' | 'forest';
  description: string;
  isRandom: boolean;
  reviewsPriority: boolean;
  onlyReviews: boolean;
  newProblemsOnly: boolean;
}

// Spot with assigned topic (runtime data)
export interface SpotWithTopic extends PowerSpot {
  topic: string;  // The problem_group name (or 'random' for mystery spot)
  topicDisplay: string;  // Formatted display name
  remaining: number;  // For newProblemsOnly: problems with no progress. Otherwise: problems not mastered.
  locked: boolean;  // Whether the topic is locked (user has entered this spot today)
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
}

// Spot variant for styling
export type SpotVariant = 'reviews' | 'coffee' | 'forest' | 'default';

export function getSpotVariant(spot: SpotWithTopic): SpotVariant {
  if (spot.onlyReviews) return 'reviews';
  if (spot.isRandom) return 'forest';
  if (spot.newProblemsOnly) return 'coffee';
  return 'default';
}

