/**
 * Spot Data and Constants
 * 
 * Static definitions for the three practice locations.
 */

import { PowerSpot, SavedDayAssignments, SavedSpotAssignment } from './spotTypes';

// LocalStorage key for spot assignments
export const SPOT_ASSIGNMENTS_KEY = 'walkie_talkie_spot_assignments';

/**
 * The three power spots - practice locations
 * 
 * 1. The Daily Commute - Review-only, handles all due reviews
 * 2. The Coffee Sanctuary - New problems only, focused topic practice
 * 3. The Mysterious Forest - Mixed random challenges
 */
export const POWER_SPOTS: PowerSpot[] = [
  { 
    id: 'spot3', 
    name: 'The Daily Commute', 
    ritual: 'Transit', 
    icon: 'train', 
    description: 'Never miss your daily reviews!',
    isRandom: false,
    reviewsPriority: true,
    onlyReviews: true,
    newProblemsOnly: false
  },
  { 
    id: 'spot2', 
    name: 'The Coffee Sanctuary', 
    ritual: 'Deep Focus', 
    icon: 'coffee', 
    description: 'A warm brew and focused topic practice.',
    isRandom: false,
    reviewsPriority: false,
    onlyReviews: false,
    newProblemsOnly: true
  },
  { 
    id: 'spot1', 
    name: 'The Mysterious Forest', 
    ritual: 'Adventure', 
    icon: 'forest', 
    description: 'Venture into the unknown with mixed challenges.',
    isRandom: true,
    reviewsPriority: false,
    onlyReviews: false,
    newProblemsOnly: false
  }
];

/**
 * Get today's date string in YYYY-MM-DD format
 */
export const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get locked spot assignments from localStorage for today
 */
export const getLockedSpotAssignments = (userId: string): SavedDayAssignments | null => {
  try {
    const key = `${SPOT_ASSIGNMENTS_KEY}_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const data: SavedDayAssignments = JSON.parse(stored);
    const todayStr = getDateString(new Date());
    
    // Check if data is from today
    if (data.date !== todayStr) {
      console.log(`[SpotAssignments] Stored date ${data.date} doesn't match today ${todayStr}, clearing`);
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading locked spot assignments:', error);
    return null;
  }
};

/**
 * Lock a spot assignment for today (called when user enters a spot)
 */
export const lockSpotAssignment = (
  userId: string, 
  spotId: string, 
  topic: string, 
  topicDisplay: string
): void => {
  try {
    const key = `${SPOT_ASSIGNMENTS_KEY}_${userId}`;
    const todayStr = getDateString(new Date());
    
    console.log(`[LockSpot] Locking spot ${spotId} with topic "${topic}" for date ${todayStr}`);
    
    // Get existing locked assignments
    const existing = getLockedSpotAssignments(userId);
    const existingAssignments = existing?.assignments || [];
    
    // Check if this spot is already locked
    const alreadyLocked = existingAssignments.find(a => a.spotId === spotId && a.locked);
    if (alreadyLocked) {
      console.log(`[LockSpot] Spot ${spotId} already locked with topic "${alreadyLocked.topic}"`);
      return; // Already locked, don't update
    }
    
    // Add/update this spot as locked
    const updatedAssignments = existingAssignments.filter(a => a.spotId !== spotId);
    updatedAssignments.push({
      spotId,
      topic,
      topicDisplay,
      locked: true
    });
    
    const data: SavedDayAssignments = {
      date: todayStr,
      assignments: updatedAssignments
    };
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`[LockSpot] Saved:`, data);
  } catch (error) {
    console.error('Error locking spot assignment:', error);
  }
};

/**
 * Clear spot assignments (for testing/reset)
 */
export const clearSpotAssignments = (userId: string): void => {
  try {
    const key = `${SPOT_ASSIGNMENTS_KEY}_${userId}`;
    localStorage.removeItem(key);
    console.log(`[SpotAssignments] Cleared assignments for user ${userId}`);
  } catch (error) {
    console.error('Error clearing spot assignments:', error);
  }
};

