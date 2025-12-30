/**
 * Spot Data and Constants
 * 
 * Static definitions for the three practice locations.
 */

import { PowerSpot, SavedDayAssignments, SavedSpotAssignment, DAILY_NEW_GOAL } from './spotTypes';

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

// Type for progress grid items (from spacedRepetitionService)
export interface ProgressGridGroup {
  groupName: string;
  problems: Array<{ progress: { status: string } | null }>;
  masteredCount: number;
  totalCount: number;
}

/**
 * Assign random topics to power spots.
 * Locked spots keep their topics, unlocked spots get random topics.
 * 
 * @param progressGrid - Array of topic groups with problem progress
 * @param lockedAssignments - Array of spots that are locked to specific topics
 * @param dueReviewCount - Number of due reviews (for Daily Commute spot)
 * @param dailyNewCompleted - Number of new problems completed today (for Coffee Sanctuary daily goal)
 */
export const assignTopicsToSpots = (
  progressGrid: ProgressGridGroup[],
  lockedAssignments: SavedSpotAssignment[],
  dueReviewCount: number = 0,
  dailyNewCompleted: number = 0
): import('./spotTypes').SpotWithTopic[] => {
  // Helper to count NEW problems (no progress at all) in a topic group
  const countNewProblems = (group: ProgressGridGroup) => 
    group.problems.filter(p => p.progress === null).length;
  
  // For newProblemsOnly spots, use count of problems with no progress
  // For other spots, use count of unmastered problems
  const topicsWithRemaining = progressGrid.filter(g => g.masteredCount < g.totalCount);
  const topicsWithNewProblems = progressGrid.filter(g => countNewProblems(g) > 0);
  const totalRemaining = topicsWithRemaining.reduce(
    (sum, g) => sum + (g.totalCount - g.masteredCount), 0
  );
  
  // Get topics that are already locked (to avoid assigning same topic to unlocked spots)
  const lockedTopics = lockedAssignments.map(a => a.topic);
  
  // Filter out locked topics from available topics for unlocked spots
  const availableTopics = topicsWithRemaining.filter(t => !lockedTopics.includes(t.groupName));
  const availableTopicsForNewOnly = topicsWithNewProblems.filter(t => !lockedTopics.includes(t.groupName));
  const shuffledTopics = [...availableTopics].sort(() => Math.random() - 0.5);
  const shuffledTopicsForNewOnly = [...availableTopicsForNewOnly].sort(() => Math.random() - 0.5);
  
  let topicIdx = 0;
  let topicIdxNewOnly = 0;
  
  // Calculate daily new goal progress
  const dailyNewRemaining = Math.max(0, DAILY_NEW_GOAL - dailyNewCompleted);
  
  return POWER_SPOTS.map((spot) => {
    const isNewProblemsOnly = spot.newProblemsOnly === true;
    
    // Handle "Only Reviews" spots (e.g. Daily Commute)
    if (spot.onlyReviews) {
      const isCompleted = dueReviewCount === 0;
      return {
        ...spot,
        topic: 'reviews',
        topicDisplay: 'Daily Reviews',
        remaining: dueReviewCount,
        isRandom: false,
        locked: isCompleted, // Lock if no reviews due
        reviewsPriority: spot.reviewsPriority,
        onlyReviews: true,
        newProblemsOnly: false
      };
    }

    // Handle random/mystery spot
    if (spot.isRandom) {
      return {
        ...spot,
        topic: 'random',
        topicDisplay: 'Mixed Topics',
        remaining: totalRemaining,
        isRandom: true,
        locked: false,
        reviewsPriority: spot.reviewsPriority,
        onlyReviews: spot.onlyReviews || false,
        newProblemsOnly: isNewProblemsOnly,
        ...(isNewProblemsOnly && { dailyNewCompleted, dailyNewRemaining })
      };
    }
    
    // Check if this spot is locked
    const lockedAssignment = lockedAssignments.find(a => a.spotId === spot.id && a.locked);
    console.log(`[AssignTopics] Checking spot ${spot.id} (${spot.name}) against lockedAssignments:`, lockedAssignments);
    console.log(`[AssignTopics] Found match for ${spot.id}:`, lockedAssignment);
    
    if (lockedAssignment) {
      // Use the locked topic
      const topicGroup = progressGrid.find(g => g.groupName === lockedAssignment.topic);
      
      // For newProblemsOnly spots, count problems with no progress
      // For other spots, count unmastered problems
      let remaining = 0;
      if (topicGroup) {
        if (isNewProblemsOnly) {
          remaining = countNewProblems(topicGroup);
        } else {
          remaining = topicGroup.totalCount - topicGroup.masteredCount;
        }
      }
      
      // If this is a newProblemsOnly spot and remaining is 0, unlock it (topic is done for today)
      const shouldUnlock = isNewProblemsOnly && remaining === 0;
      
      console.log(`[AssignTopics] Using locked topic "${lockedAssignment.topic}" for spot ${spot.id}, remaining=${remaining}, newProblemsOnly=${isNewProblemsOnly}, shouldUnlock=${shouldUnlock}`);
      
      if (shouldUnlock) {
        // Topic exhausted for newProblemsOnly - unlock and assign new topic
        console.log(`[AssignTopics] Topic "${lockedAssignment.topic}" exhausted for newProblemsOnly spot, assigning new topic`);
        const newTopicGroup = shuffledTopicsForNewOnly[topicIdxNewOnly % Math.max(shuffledTopicsForNewOnly.length, 1)] 
          || topicsWithNewProblems[topicIdxNewOnly % Math.max(topicsWithNewProblems.length, 1)];
        topicIdxNewOnly++;
        
        if (newTopicGroup) {
          return {
            ...spot,
            topic: newTopicGroup.groupName,
            topicDisplay: newTopicGroup.groupName,
            remaining: countNewProblems(newTopicGroup),
            isRandom: false,
            locked: false, // Unlocked now
            reviewsPriority: spot.reviewsPriority,
            onlyReviews: spot.onlyReviews || false,
            newProblemsOnly: isNewProblemsOnly,
            dailyNewCompleted,
            dailyNewRemaining
          };
        } else {
          // All topics exhausted
          return {
            ...spot,
            topic: 'all_done_today',
            topicDisplay: 'All Done Today!',
            remaining: 0,
            isRandom: false,
            locked: false,
            reviewsPriority: spot.reviewsPriority,
            onlyReviews: spot.onlyReviews || false,
            newProblemsOnly: isNewProblemsOnly,
            dailyNewCompleted,
            dailyNewRemaining
          };
        }
      }
      
      return {
        ...spot,
        topic: lockedAssignment.topic,
        topicDisplay: lockedAssignment.topicDisplay,
        remaining,
        isRandom: false,
        locked: true,
        reviewsPriority: spot.reviewsPriority,
        onlyReviews: spot.onlyReviews || false,
        newProblemsOnly: isNewProblemsOnly,
        ...(isNewProblemsOnly && { dailyNewCompleted, dailyNewRemaining })
      };
    }
    
    // Unlocked spot - assign a random topic
    console.log(`[AssignTopics] No locked assignment for spot ${spot.id}, assigning random topic`);
    
    // Use appropriate topic pool based on spot type
    let topicGroup;
    if (isNewProblemsOnly) {
      topicGroup = shuffledTopicsForNewOnly[topicIdxNewOnly % Math.max(shuffledTopicsForNewOnly.length, 1)] 
        || topicsWithNewProblems[topicIdxNewOnly % Math.max(topicsWithNewProblems.length, 1)];
      topicIdxNewOnly++;
    } else {
      topicGroup = shuffledTopics[topicIdx % Math.max(shuffledTopics.length, 1)] 
      || topicsWithRemaining[topicIdx % Math.max(topicsWithRemaining.length, 1)];
    topicIdx++;
    }
    
    if (topicGroup) {
      const remaining = isNewProblemsOnly 
        ? countNewProblems(topicGroup) 
        : topicGroup.totalCount - topicGroup.masteredCount;
      return {
        ...spot,
        topic: topicGroup.groupName,
        topicDisplay: topicGroup.groupName,
        remaining,
        isRandom: false,
        locked: false,
        reviewsPriority: spot.reviewsPriority,
        onlyReviews: spot.onlyReviews || false,
        newProblemsOnly: isNewProblemsOnly,
        ...(isNewProblemsOnly && { dailyNewCompleted, dailyNewRemaining })
      };
    } else {
      return {
        ...spot,
        topic: isNewProblemsOnly ? 'all_done_today' : 'all_mastered',
        topicDisplay: isNewProblemsOnly ? 'All Done Today!' : 'All Mastered!',
        remaining: 0,
        isRandom: false,
        locked: false,
        reviewsPriority: spot.reviewsPriority,
        onlyReviews: spot.onlyReviews || false,
        newProblemsOnly: isNewProblemsOnly,
        ...(isNewProblemsOnly && { dailyNewCompleted, dailyNewRemaining })
      };
    }
  });
};

