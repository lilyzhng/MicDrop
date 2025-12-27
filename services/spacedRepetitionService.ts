/**
 * Spaced Repetition Service
 * 
 * Handles adaptive spaced repetition logic for Blind 75 problems.
 * - Score-based graduation (reviews needed based on performance)
 * - Difficulty adjustments (easy problems graduate faster)
 * - Goal-driven scheduling (complete all 75 in target days)
 */

import { BlindProblem } from '../types';
import { 
    UserStudySettings, 
    UserProblemProgress, 
    ProblemStatus,
    StudyStats 
} from '../types/database';
import {
    fetchUserStudySettings,
    upsertUserStudySettings,
    fetchAllUserProgress,
    fetchDueReviews,
    fetchDueTomorrow,
    upsertUserProblemProgress,
    batchUpsertUserProgress,
    fetchAllBlindProblems
} from './databaseService';

// ============================================
// Constants
// ============================================

const TOTAL_BLIND_75 = 75;

// Default settings
export const DEFAULT_SETTINGS: Omit<UserStudySettings, 'userId'> = {
    targetDays: 10,
    dailyCap: 15,
    easyBonus: 10,
    startDate: new Date()
};

// Score thresholds for determining reviews needed
const SCORE_THRESHOLDS = {
    EXCELLENT: 75,  // 1 review required (Excellent tier)
    PASSED: 70,     // 2 reviews required (Passed tier)
    // Below 70: Relearn (needs to re-attempt, not in review queue)
};

// Difficulty bonuses/penalties - REMOVED: Using flat score thresholds now
// const DIFFICULTY_ADJUSTMENTS = ...

// ============================================
// Score-Based Review Calculation
// ============================================

/**
 * Calculate how many reviews are required based on initial teaching score
 * 
 * @param score - The score from the teaching session (0-100)
 * @returns Number of reviews required to reach Mastered status
 */
export function calculateReviewsNeeded(score: number): number {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) {
        return 1; // Excellent tier: 1 review to confirm mastery
    } else if (score >= SCORE_THRESHOLDS.PASSED) {
        return 2; // Passed tier: 2 reviews to confirm mastery
    } else {
        return 0; // Relearn: needs to re-attempt (not queued for review)
    }
}

/**
 * Get the tier name based on score
 */
export function getScoreTier(score: number): 'excellent' | 'passed' | 'relearn' {
    if (score >= SCORE_THRESHOLDS.EXCELLENT) {
        return 'excellent';
    } else if (score >= SCORE_THRESHOLDS.PASSED) {
        return 'passed';
    } else {
        return 'relearn';
    }
}

/**
 * Determine the new status based on reviews completed vs needed
 */
export function determineStatus(
    reviewsCompleted: number,
    reviewsNeeded: number
): ProblemStatus {
    // Relearn state: reviewsNeeded is 0, meaning they need to re-attempt
    if (reviewsNeeded === 0) {
        return 'learning'; // Still in learning, but needs re-attempt
    }
    // Mastered: completed all required reviews
    if (reviewsCompleted >= reviewsNeeded) {
        return 'mastered';
    }
    // Review Duty: in progress
    return 'learning';
}

// ============================================
// Settings Management
// ============================================

/**
 * Get user settings with defaults
 */
export async function getSettingsWithDefaults(userId: string): Promise<UserStudySettings> {
    const settings = await fetchUserStudySettings(userId);
    if (settings) {
        return settings;
    }
    
    // Create default settings for new user
    const defaultWithUser: UserStudySettings = {
        userId,
        ...DEFAULT_SETTINGS
    };
    
    await upsertUserStudySettings(userId, DEFAULT_SETTINGS);
    return defaultWithUser;
}

/**
 * Update user settings
 */
export async function updateSettings(
    userId: string,
    updates: Partial<Omit<UserStudySettings, 'userId'>>
): Promise<UserStudySettings | null> {
    return upsertUserStudySettings(userId, updates);
}

/**
 * Reset study plan (start fresh)
 */
export async function resetStudyPlan(userId: string): Promise<UserStudySettings | null> {
    return upsertUserStudySettings(userId, {
        ...DEFAULT_SETTINGS,
        startDate: new Date()
    });
}

// ============================================
// Progress Tracking
// ============================================

/**
 * Update progress after completing a problem (teaching session or review)
 * 
 * Initial Teaching Session:
 * - Score < 70: Relearn (needs re-attempt, not in review queue)
 * - Score 70-74: Passed tier, 2 reviews required
 * - Score >= 75: Excellent tier, 1 review required
 * 
 * Review Session:
 * - Score < 70: Failed review, reschedule for tomorrow (no progress increment)
 * - Score >= 70: Successful review, increment reviews_completed
 * - If reviews_completed >= reviews_required: Mastered
 */
export async function updateProgressAfterAttempt(
    userId: string,
    problemTitle: string,
    score: number,
    difficulty: 'easy' | 'medium' | 'hard',
    existingProgress: UserProblemProgress | null
): Promise<UserProblemProgress | null> {
    // Check if this is a first teaching attempt, a scheduled review, or an extra practice attempt
    const isInRelearnState = existingProgress && 
        existingProgress.reviewsNeeded === 0 && 
        existingProgress.status !== 'mastered';
    
    // Check if the problem is actually DUE for review (nextReviewAt is today or earlier)
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const isDueForReview = existingProgress?.nextReviewAt && 
        new Date(existingProgress.nextReviewAt) <= now;
    
    // Determine attempt type:
    // 1. INITIAL: No existing progress, or in relearn state
    // 2. SCHEDULED_REVIEW: Has progress and is due for review
    // 3. EXTRA_PRACTICE: Has progress but not due yet (doesn't count as review, just updates best score)
    const isInitialAttempt = !existingProgress || isInRelearnState;
    const isScheduledReview = existingProgress && !isInRelearnState && isDueForReview;
    const isExtraPractice = existingProgress && !isInRelearnState && !isDueForReview;
    
    console.log(`[Spaced Repetition] Attempt type: initial=${isInitialAttempt}, scheduledReview=${isScheduledReview}, extraPractice=${isExtraPractice}`);
    
    if (isExtraPractice && existingProgress) {
        // ========================================
        // EXTRA PRACTICE (not due for review yet)
        // ========================================
        // Just update best score, don't change review progress
        const newBestScore = Math.max(existingProgress.bestScore || 0, score);
        console.log(`[Spaced Repetition] Extra practice: updating best score to ${newBestScore}, keeping reviewsCompleted=${existingProgress.reviewsCompleted}`);
        
        return upsertUserProblemProgress(userId, problemTitle, {
            status: existingProgress.status,
            bestScore: newBestScore,
            reviewsNeeded: existingProgress.reviewsNeeded,
            reviewsCompleted: existingProgress.reviewsCompleted, // Don't increment!
            lastReviewedAt: new Date(),
            nextReviewAt: existingProgress.nextReviewAt // Keep the scheduled review date
        });
    }
    
    if (isInitialAttempt) {
        // ========================================
        // INITIAL TEACHING SESSION
        // ========================================
        const reviewsNeeded = calculateReviewsNeeded(score);
        const tier = getScoreTier(score);
        
        console.log(`[Spaced Repetition] Initial attempt: score=${score}, tier=${tier}, reviewsNeeded=${reviewsNeeded}`);
        
        if (tier === 'relearn') {
            // Score < 70: Relearn state
            // Not queued for review, needs to re-attempt
            return upsertUserProblemProgress(userId, problemTitle, {
                status: 'learning',
                bestScore: score,
                reviewsNeeded: 0, // Marker for "relearn" state
                reviewsCompleted: 0,
                lastReviewedAt: new Date(),
                nextReviewAt: null // Not in review queue
            });
        } else {
            // Score >= 70: Review Duty
            // Queue for review tomorrow
            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + 1);
            nextReview.setHours(0, 0, 0, 0);
            
            return upsertUserProblemProgress(userId, problemTitle, {
                status: 'learning',
                bestScore: score,
                reviewsNeeded: reviewsNeeded,
                reviewsCompleted: 0, // Initial attempt doesn't count as review
                lastReviewedAt: new Date(),
                nextReviewAt: nextReview
            });
        }
    } else {
        // ========================================
        // REVIEW SESSION
        // ========================================
        const reviewTier = getScoreTier(score);
        const newBestScore = Math.max(existingProgress.bestScore || 0, score);
        
        // Check if the user PASSED this review attempt (score >= 70)
        // If they failed (score < 70), reschedule for tomorrow without incrementing reviewsCompleted
        if (reviewTier === 'relearn') {
            // Failed the review - reschedule for tomorrow, don't increment reviewsCompleted
            console.log(`[Spaced Repetition] Review FAILED: score=${score}, rescheduling for tomorrow without incrementing progress`);
            
            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + 1);
            nextReview.setHours(0, 0, 0, 0);
            
            return upsertUserProblemProgress(userId, problemTitle, {
                status: 'learning',
                bestScore: newBestScore,
                reviewsNeeded: existingProgress.reviewsNeeded,
                reviewsCompleted: existingProgress.reviewsCompleted, // Keep same, don't increment
                lastReviewedAt: new Date(),
                nextReviewAt: nextReview
            });
        }
        
        // Passed the review - increment reviews_completed
        const newReviewsCompleted = existingProgress.reviewsCompleted + 1;
        
        console.log(`[Spaced Repetition] Review PASSED: reviewsCompleted=${newReviewsCompleted}/${existingProgress.reviewsNeeded}`);
        
        // Check if mastered
        if (newReviewsCompleted >= existingProgress.reviewsNeeded) {
            // Mastered!
            console.log(`[Spaced Repetition] MASTERED: ${problemTitle}`);
            return upsertUserProblemProgress(userId, problemTitle, {
                status: 'mastered',
                bestScore: newBestScore,
                reviewsNeeded: existingProgress.reviewsNeeded,
                reviewsCompleted: newReviewsCompleted,
                lastReviewedAt: new Date(),
                nextReviewAt: null // No more reviews needed
            });
        } else {
            // Still in Review Duty, schedule next review
            const nextReview = new Date();
            nextReview.setDate(nextReview.getDate() + 1);
            nextReview.setHours(0, 0, 0, 0);
            
            return upsertUserProblemProgress(userId, problemTitle, {
                status: 'learning',
                bestScore: newBestScore,
                reviewsNeeded: existingProgress.reviewsNeeded,
                reviewsCompleted: newReviewsCompleted,
                lastReviewedAt: new Date(),
                nextReviewAt: nextReview
            });
        }
    }
}

// ============================================
// Queue Building
// ============================================

/**
 * Build daily practice queue with spaced repetition
 * 
 * Algorithm:
 * 1. Calculate pace (new problems per day based on days left)
 * 2. Get all due reviews (priority - sorted by most overdue)
 * 3. Get new problems (sorted by difficulty: easy → hard)
 * 4. Build queue: reviews first, then new, capped at daily limit
 * 
 * @param userId - The user's ID
 * @param topicFilter - Optional: filter problems to a specific topic (problem_group)
 * @param reviewsPriority - If true, ALL due reviews are included first (ignoring topic filter for reviews), then remaining slots filled with topic-filtered new problems
 * @param onlyReviews - If true, ONLY due reviews are included (no new problems)
 * @param newProblemsOnly - If true, ONLY new problems are included (no reviews) - for focused topic practice
 */
export async function buildSpacedRepetitionQueue(
    userId: string,
    topicFilter?: string,
    reviewsPriority: boolean = false,
    onlyReviews: boolean = false,
    newProblemsOnly: boolean = false
): Promise<{
    queue: BlindProblem[];
    stats: StudyStats;
}> {
    const settings = await getSettingsWithDefaults(userId);
    const allProgress = await fetchAllUserProgress(userId);
    const dueReviews = await fetchDueReviews(userId);
    const dueTomorrow = await fetchDueTomorrow(userId);
    let allProblems = await fetchAllBlindProblems();
    
    // Apply topic filter if provided
    if (topicFilter && topicFilter !== 'all_mastered') {
        // Need to match both formatted and raw group names
        const normalizedFilter = topicFilter.toLowerCase().replace(/\s+/g, '_');
        allProblems = allProblems.filter(p => {
            const problemGroup = (p.problemGroup || '').toLowerCase().replace(/\s+/g, '_');
            const formattedGroup = formatGroupName(p.problemGroup || '').toLowerCase();
            return problemGroup.includes(normalizedFilter) || 
                   formattedGroup.toLowerCase().includes(topicFilter.toLowerCase()) ||
                   topicFilter.toLowerCase().includes(problemGroup);
        });
        console.log(`[Spaced Repetition] Filtered to topic "${topicFilter}": ${allProblems.length} problems`);
    }
    
    // Create a map of problem titles to progress
    const progressMap = new Map<string, UserProblemProgress>();
    allProgress.forEach(p => progressMap.set(p.problemTitle, p));
    
    // Calculate pace
    const today = new Date();
    // Use local timezone for start date calculation to avoid "yesterday" issues
    const startDate = new Date(settings.startDate);
    
    // Normalize dates to midnight to count full calendar days
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);
    
    const startMidnight = new Date(startDate);
    startMidnight.setHours(0, 0, 0, 0);
    
    // Calculate difference in days (add 1 to include today as Day 1)
    const daysPassed = Math.floor((todayMidnight.getTime() - startMidnight.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysLeft = Math.max(1, settings.targetDays - daysPassed + 1); // +1 to include today in remaining days
    
    // Count problems by status (for filtered set if topic provided)
    const filteredProgress = allProgress.filter(p => 
        allProblems.some(prob => prob.title === p.problemTitle)
    );
    const introducedCount = filteredProgress.filter(p => p.status !== 'new').length;
    const remainingNew = allProblems.length - introducedCount;
    
    // Calculate how many new problems per day (with 2-day buffer for reviews)
    const bufferDays = 2;
    const effectiveDaysLeft = Math.max(1, daysLeft - bufferDays);
    const newPerDay = Math.ceil(remainingNew / effectiveDaysLeft);
    
    // Get problems that have progress and are due for review
    let filteredDueReviews: UserProblemProgress[];
    let allProblemsForReviews = allProblems;
    
    if (reviewsPriority) {
        // REVIEWS PRIORITY MODE: Get ALL due reviews regardless of topic
        filteredDueReviews = dueReviews;
        // Need to get all problems (not just filtered ones) to find review problems
        allProblemsForReviews = await fetchAllBlindProblems();
        console.log(`[Spaced Repetition] Reviews Priority Mode: Including ALL ${dueReviews.length} due reviews`);
    } else {
        // STANDARD MODE: Filter reviews by topic
        filteredDueReviews = dueReviews.filter(p => 
            allProblems.some(prob => prob.title === p.problemTitle)
        );
    }
    
    const dueProblems = filteredDueReviews
        .filter(p => p.reviewsCompleted < p.reviewsNeeded)
        .map(progress => {
            const problem = allProblemsForReviews.find(p => p.title === progress.problemTitle);
            return problem ? { problem, progress } : null;
        })
        .filter((item): item is { problem: BlindProblem; progress: UserProblemProgress } => item !== null);
    
    // Get new problems (not yet attempted) from filtered set
    const newProblems = allProblems
        .filter(p => !progressMap.has(p.title))
        .sort((a, b) => {
            // Sort by difficulty (easy first)
            const diffOrder = { easy: 0, medium: 1, hard: 2 };
            return diffOrder[a.difficulty] - diffOrder[b.difficulty];
        });
    
    // Build the queue
    const queue: BlindProblem[] = [];
    
    // Add due reviews first (they take priority) - unless newProblemsOnly is true
    if (!newProblemsOnly) {
        for (const { problem } of dueProblems) {
            if (queue.length >= settings.dailyCap) break;
            queue.push(problem);
        }
    }
    
    // Fill remaining slots with new problems (unless onlyReviews is true)
    let slotsForNew = 0;
    if (!onlyReviews) {
        slotsForNew = Math.min(newPerDay, settings.dailyCap - queue.length);
        queue.push(...newProblems.slice(0, slotsForNew));
    }
    
    // Calculate stats (for the full set, not filtered)
    const fullAllProgress = allProgress;
    const reviewsInQueue = newProblemsOnly ? 0 : Math.min(dueProblems.length, settings.dailyCap);
    const stats: StudyStats = {
        totalProblems: TOTAL_BLIND_75,
        newCount: TOTAL_BLIND_75 - fullAllProgress.length,
        learningCount: fullAllProgress.filter(p => p.status === 'learning').length,
        masteredCount: fullAllProgress.filter(p => p.status === 'mastered').length,
        dueToday: dueReviews.length,
        dueTomorrow: dueTomorrow.length,
        daysLeft,
        onPace: fullAllProgress.length >= (daysPassed * (TOTAL_BLIND_75 / settings.targetDays)),
        todaysQueue: {
            newProblems: Math.min(slotsForNew, newProblems.length),
            reviews: reviewsInQueue,
            total: queue.length
        }
    };
    
    const modeLabel = newProblemsOnly ? 'NEW PROBLEMS ONLY' : (reviewsPriority ? 'REVIEWS PRIORITY' : (topicFilter ? `Topic: ${topicFilter}` : 'All Topics'));
    console.log(`[Spaced Repetition] Queue built: ${queue.length} problems (${stats.todaysQueue.reviews} reviews + ${stats.todaysQueue.newProblems} new) [${modeLabel}]`);
    
    return { queue, stats };
}

// ============================================
// Progress Grid Data
// ============================================

export interface ProblemGridItem {
    problem: BlindProblem;
    progress: UserProblemProgress | null;
    isDueToday: boolean;
}

export interface GroupedProblems {
    groupName: string;
    problems: ProblemGridItem[];
    masteredCount: number;
    totalCount: number;
}

/**
 * Get all problems grouped by category with progress status
 */
export async function getProgressGrid(userId: string): Promise<GroupedProblems[]> {
    const allProgress = await fetchAllUserProgress(userId);
    const dueReviews = await fetchDueReviews(userId);
    const allProblems = await fetchAllBlindProblems();
    
    // Create maps for quick lookup
    const progressMap = new Map<string, UserProblemProgress>();
    allProgress.forEach(p => progressMap.set(p.problemTitle, p));
    
    const dueSet = new Set(dueReviews.map(p => p.problemTitle));
    
    // Group problems by problem_group
    const grouped = new Map<string, ProblemGridItem[]>();
    
    for (const problem of allProblems) {
        const groupName = problem.problemGroup || 'Other';
        if (!grouped.has(groupName)) {
            grouped.set(groupName, []);
        }
        
        const progress = progressMap.get(problem.title) || null;
        grouped.get(groupName)!.push({
            problem,
            progress,
            isDueToday: dueSet.has(problem.title)
        });
    }
    
    // Convert to array and calculate stats
    const result: GroupedProblems[] = [];
    
    // Sort groups by a predefined order
    const groupOrder = [
        'arrays_hashing',
        'two_pointers',
        'sliding_window',
        'stack',
        'binary_search',
        'linked_list',
        'trees',
        'tries',
        'heap',
        'backtracking',
        'graphs',
        'dynamic_programming_1d',
        'dynamic_programming_2d',
        'greedy',
        'intervals',
        'math_geometry',
        'bit_manipulation'
    ];
    
    const sortedGroups = Array.from(grouped.entries()).sort((a, b) => {
        const aIdx = groupOrder.indexOf(a[0]);
        const bIdx = groupOrder.indexOf(b[0]);
        if (aIdx === -1 && bIdx === -1) return a[0].localeCompare(b[0]);
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
    });
    
    for (const [groupName, problems] of sortedGroups) {
        const masteredCount = problems.filter(p => p.progress?.status === 'mastered').length;
        result.push({
            groupName: formatGroupName(groupName),
            problems,
            masteredCount,
            totalCount: problems.length
        });
    }
    
    return result;
}

/**
 * Format group name for display
 */
function formatGroupName(name: string): string {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// ============================================
// Migration from localStorage
// ============================================

/**
 * Migrate mastered IDs from localStorage to Supabase
 */
export async function migrateFromLocalStorage(
    userId: string,
    masteredIds: string[]
): Promise<boolean> {
    if (masteredIds.length === 0) {
        return true;
    }
    
    console.log(`[Migration] Migrating ${masteredIds.length} mastered problems from localStorage`);
    
    // Create progress records for mastered problems
    const progressItems = masteredIds.map(title => ({
        problemTitle: title,
        status: 'mastered' as ProblemStatus,
        bestScore: 85, // Assume good performance since they were marked mastered
        reviewsNeeded: 1,
        reviewsCompleted: 1,
        nextReviewAt: new Date() // Due for review today (first cycle in new system)
    }));
    
    const success = await batchUpsertUserProgress(userId, progressItems);
    
    if (success) {
        console.log(`[Migration] Successfully migrated ${masteredIds.length} problems`);
    } else {
        console.error('[Migration] Failed to migrate localStorage mastery');
    }
    
    return success;
}

