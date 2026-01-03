import { supabase } from '../config/supabase';
import { SavedItem, SavedReport, PerformanceReport, BlindProblem, CustomInterviewQuestion, BehavioralQuestion, BehavioralQuestionType } from '../types';

// ========== SAVED ITEMS (Snippets) ==========

export const fetchSavedItems = async (userId: string): Promise<SavedItem[]> => {
    const { data, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching saved items:', error);
        return [];
    }

    return data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type,
        date: item.created_at,
        question: item.question,
        humanRewrite: item.human_rewrite,
        category: item.category || '',
        rewrite: item.rewrite,
        explanation: item.explanation,
        reportData: item.report_data as any
    }));
};

export const createSavedItem = async (userId: string, item: Omit<SavedItem, 'id' | 'date'>): Promise<SavedItem | null> => {
    const { data, error } = await supabase
        .from('saved_items')
        .insert({
            user_id: userId,
            title: item.title,
            content: item.content,
            type: item.type,
            category: item.category,
            rewrite: item.rewrite,
            explanation: item.explanation,
            question: item.question,
            human_rewrite: item.humanRewrite,
            report_data: item.reportData as any
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating saved item:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        content: data.content,
        type: data.type,
        date: data.created_at,
        category: data.category || '',
        rewrite: data.rewrite,
        explanation: data.explanation,
        question: data.question,
        humanRewrite: data.human_rewrite,
        reportData: data.report_data as any
    };
};

export const deleteSavedItem = async (itemId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('id', itemId);

    if (error) {
        console.error('Error deleting saved item:', error);
        return false;
    }

    return true;
};

// ========== SAVED REPORTS ==========

export const fetchSavedReports = async (userId: string): Promise<SavedReport[]> => {
    const { data, error } = await supabase
        .from('saved_reports')
        .select('*')
        .eq('user_id', userId)
        .order('report_date', { ascending: false });

    if (error) {
        console.error('Error fetching saved reports:', error);
        return [];
    }

    return data.map(report => ({
        id: report.id,
        title: report.title,
        type: report.type,
        rating: report.rating,
        reportData: report.report_data as PerformanceReport,
        date: report.report_date || report.created_at
    }));
};

export const createSavedReport = async (
    userId: string,
    title: string,
    type: 'coach' | 'walkie' | 'hot-take' | 'teach' | 'readiness',
    report: PerformanceReport
): Promise<SavedReport | null> => {
    console.log('[DEBUG] createSavedReport called:', { userId, title, type, rating: report.rating });
    
    const { data, error } = await supabase
        .from('saved_reports')
        .insert({
            user_id: userId,
            title: title || 'Untitled Session',
            type,
            rating: report.rating,
            report_data: report as any,
            report_date: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error('[DEBUG] Error creating saved report:', error);
        return null;
    }
    
    console.log('[DEBUG] Report saved successfully:', data.id);

    return {
        id: data.id,
        title: data.title,
        type: data.type,
        rating: data.rating,
        reportData: data.report_data as PerformanceReport,
        date: data.report_date || data.created_at
    };
};

export const updateSavedReport = async (reportId: string, updates: Partial<SavedReport>): Promise<boolean> => {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.reportData !== undefined) updateData.report_data = updates.reportData;
    if (updates.date !== undefined) updateData.report_date = updates.date;

    const { error } = await supabase
        .from('saved_reports')
        .update(updateData)
        .eq('id', reportId);

    if (error) {
        console.error('Error updating saved report:', error);
        return false;
    }

    return true;
};

export const deleteSavedReport = async (reportId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('saved_reports')
        .delete()
        .eq('id', reportId);

    if (error) {
        console.error('Error deleting saved report:', error);
        return false;
    }

    return true;
};

// ========== BLIND PROBLEMS ==========

/**
 * Fetch blind problems by topics
 * Selects random problems that match any of the given topics
 */
export const fetchBlindProblemsByTopics = async (
    topics: string[],
    limit: number = 5,
    excludeIds: string[] = []
): Promise<BlindProblem[]> => {
    // Supabase doesn't have native array overlap, so we'll fetch all and filter
    // For a small dataset of 75 problems, this is efficient enough
    let query = supabase
        .from('blind_problems')
        .select('*');

    if (excludeIds.length > 0) {
        query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching blind problems:', error);
        return [];
    }

    // Filter problems that match any of the requested topics
    const matchingProblems = data.filter(problem => {
        const problemTopics = problem.topics as string[];
        return problemTopics.some(topic => topics.includes(topic));
    });

    // Shuffle and take the requested number
    const shuffled = matchingProblems.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);

    return selected.map(mapDbProblemToBlindProblem);
};

/**
 * Fetch a single blind problem by title
 */
export const fetchBlindProblemByTitle = async (title: string): Promise<BlindProblem | null> => {
    const { data, error } = await supabase
        .from('blind_problems')
        .select('*')
        .eq('title', title)
        .single();

    if (error) {
        console.error('Error fetching blind problem by title:', error);
        return null;
    }

    return data ? mapDbProblemToBlindProblem(data) : null;
};

/**
 * Fetch a system coding question by title (from custom_interview_questions)
 * Returns as BlindProblem format for compatibility with teaching/practice modes
 */
export const fetchSystemCodingQuestionByTitle = async (userId: string, title: string): Promise<BlindProblem | null> => {
    const { data, error } = await supabase
        .from('custom_interview_questions')
        .select('*')
        .eq('user_id', userId)
        .eq('title', title)
        .limit(1);

    if (error) {
        console.error('Error fetching system coding question by title:', error);
        return null;
    }

    if (!data || data.length === 0) {
        return null;
    }

    const q = data[0];
    
    // Verify it's a system coding question and parse metadata
    try {
        const metadata = JSON.parse(q.notes || '{}');
        if (!metadata.isSystemCoding) {
            return null;
        }

        return {
            id: q.id,
            title: q.title,
            prompt: q.description,
            formattedPrompt: metadata.formattedPrompt || undefined,
            example: '',
            constraints: [],
            pattern: metadata.pattern || 'System Coding',
            keyIdea: metadata.keyIdea || '',
            detailedHint: metadata.detailedHint,
            definition: undefined,
            solution: metadata.correctSolution || q.solution_code,
            timeComplexity: metadata.timeComplexity || '',
            spaceComplexity: metadata.spaceComplexity || '',
            steps: metadata.steps || [],
            expectedEdgeCases: metadata.expectedEdgeCases || [],
            topics: q.topics || [],
            difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
            problemGroup: 'system_coding',
            isSystemCoding: true
        };
    } catch {
        console.error('Failed to parse system coding question metadata');
        return null;
    }
};

/**
 * Fetch all blind problems (for stats/admin purposes)
 */
export const fetchLeetcodeProblems = async (): Promise<BlindProblem[]> => {
    const { data, error } = await supabase
        .from('blind_problems')
        .select('*')
        .order('title', { ascending: true });

    if (error) {
        console.error('Error fetching all blind problems:', error);
        return [];
    }

    return data.map(mapDbProblemToBlindProblem);
};

/**
 * Get total count of blind problems
 */
export const getBlindProblemsCount = async (): Promise<number> => {
    const { count, error } = await supabase
        .from('blind_problems')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error counting blind problems:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Helper to map database row to BlindProblem type
 */
const mapDbProblemToBlindProblem = (row: any): BlindProblem => ({
    id: row.id,
    title: row.title,
    prompt: row.prompt,
    example: row.example || undefined,
    constraints: row.constraints as string[],
    pattern: row.pattern,
    keyIdea: row.key_idea,
    detailedHint: row.detailed_hint || undefined,
    definition: row.definition || undefined,
    skeleton: row.skeleton,
    solution: row.solution || undefined,
    timeComplexity: row.time_complexity,
    spaceComplexity: row.space_complexity,
    steps: row.steps as string[],
    expectedEdgeCases: row.expected_edge_cases as string[],
    topics: row.topics as string[],
    difficulty: row.difficulty as 'easy' | 'medium' | 'hard',
    problemGroup: row.problem_group || undefined,
    leetcodeNumber: row.leetcode_number || undefined,
    mnemonicImageUrl: row.mnemonic_image_url || undefined
});

// ========== PROGRESSIVE QUEUE BUILDING ==========

type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * Sort problems by difficulty (easy → medium → hard)
 */
const sortByDifficulty = (problems: BlindProblem[]): BlindProblem[] => {
    const order: Record<DifficultyLevel, number> = { easy: 0, medium: 1, hard: 2 };
    return [...problems].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
};

/**
 * Pick a random element from an array
 */
const pickRandom = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
};

/**
 * Group problems by their problem_group field
 */
const groupByProblemGroup = (problems: BlindProblem[]): Record<string, BlindProblem[]> => {
    return problems.reduce((acc, problem) => {
        const group = problem.problemGroup || 'ungrouped';
        if (!acc[group]) acc[group] = [];
        acc[group].push(problem);
        return acc;
    }, {} as Record<string, BlindProblem[]>);
};

/**
 * Build a progressive problem queue using focus groups
 * 
 * Algorithm:
 * 1. Fetch all problems, exclude mastered, filter by difficulty
 * 2. Group by problem_group
 * 3. Pick a random focus group
 * 4. Fill from focus group first
 * 5. Backfill from other groups if needed
 * 6. Sort by difficulty (easy → medium → hard)
 */
export const buildProblemQueue = async (
    masteredIds: string[],
    allowedDifficulties: DifficultyLevel[],
    limit: number = 5
): Promise<BlindProblem[]> => {
    // 1. Fetch all problems
    let query = supabase
        .from('blind_problems')
        .select('*');

    // Exclude mastered problems
    if (masteredIds.length > 0) {
        // Supabase uses title for mastered IDs in this app
        query = query.not('title', 'in', `(${masteredIds.map(id => `"${id}"`).join(',')})`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching problems for queue:', error);
        return [];
    }

    if (!data || data.length === 0) {
        console.warn('No problems found in database');
        return [];
    }

    // Map to BlindProblem type
    const allProblems = data.map(mapDbProblemToBlindProblem);

    // 2. Filter by allowed difficulties
    const filteredProblems = allProblems.filter(p => 
        allowedDifficulties.includes(p.difficulty)
    );

    if (filteredProblems.length === 0) {
        console.warn('No problems match the difficulty filter, falling back to all difficulties');
        // Fallback: use all problems if no match
        const fallback = allProblems.slice(0, limit);
        return sortByDifficulty(shuffleArray(fallback));
    }

    // 3. Group by problem_group
    const byGroup = groupByProblemGroup(filteredProblems);
    const groupNames = Object.keys(byGroup);

    if (groupNames.length === 0) {
        // No groups, just shuffle and return
        return sortByDifficulty(shuffleArray(filteredProblems).slice(0, limit));
    }

    // 4. Pick a random focus group
    const focusGroup = pickRandom(groupNames);
    console.log(`[Queue Builder] Focus group: ${focusGroup}`);

    // 5. Start with focus group problems (shuffled)
    const queue: BlindProblem[] = shuffleArray([...byGroup[focusGroup]]);
    delete byGroup[focusGroup];

    // 6. Backfill from other groups if needed
    const remainingGroups = Object.keys(byGroup);
    while (queue.length < limit && remainingGroups.length > 0) {
        const nextGroupIdx = Math.floor(Math.random() * remainingGroups.length);
        const nextGroup = remainingGroups[nextGroupIdx];
        
        // Add shuffled problems from next group
        queue.push(...shuffleArray(byGroup[nextGroup]));
        
        // Remove from remaining groups
        remainingGroups.splice(nextGroupIdx, 1);
    }

    // 7. Sort by difficulty and take first `limit`
    const finalQueue = sortByDifficulty(queue).slice(0, limit);
    
    console.log(`[Queue Builder] Final queue: ${finalQueue.map(p => `${p.title} (${p.difficulty})`).join(', ')}`);
    
    return finalQueue;
};

// ========== SPACED REPETITION: USER STUDY SETTINGS ==========

import { UserStudySettings, UserProblemProgress, ProblemStatus } from '../types/database';

/**
 * Fetch user study settings
 */
export const fetchUserStudySettings = async (userId: string): Promise<UserStudySettings | null> => {
    const { data, error } = await supabase
        .from('user_study_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No settings found - return null
            return null;
        }
        console.error('Error fetching user study settings:', error);
        return null;
    }

    return {
        userId: data.user_id,
        targetDays: data.target_days,
        dailyCap: data.daily_cap,
        dailyNewGoal: data.daily_new_goal ?? 5,  // Default to 5 if not set
        easyBonus: data.easy_bonus,
        startDate: new Date(data.start_date)
    };
};

/**
 * Create or update user study settings
 */
export const upsertUserStudySettings = async (
    userId: string,
    settings: Partial<Omit<UserStudySettings, 'userId'>>
): Promise<UserStudySettings | null> => {
    const { data, error } = await supabase
        .from('user_study_settings')
        .upsert({
            user_id: userId,
            target_days: settings.targetDays,
            daily_cap: settings.dailyCap,
            daily_new_goal: settings.dailyNewGoal,
            easy_bonus: settings.easyBonus,
            start_date: settings.startDate?.toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();

    if (error) {
        console.error('Error upserting user study settings:', error);
        return null;
    }

    return {
        userId: data.user_id,
        targetDays: data.target_days,
        dailyCap: data.daily_cap,
        dailyNewGoal: data.daily_new_goal ?? 5,  // Default to 5 if not set
        easyBonus: data.easy_bonus,
        startDate: new Date(data.start_date)
    };
};

// ========== SPACED REPETITION: USER PROBLEM PROGRESS ==========

/**
 * Helper to map database row to UserProblemProgress type
 */
const mapDbProgressToProgress = (row: any): UserProblemProgress => ({
    id: row.id,
    userId: row.user_id,
    problemTitle: row.problem_title,
    status: row.status as ProblemStatus,
    bestScore: row.best_score,
    reviewsNeeded: row.reviews_needed,
    reviewsCompleted: row.reviews_completed,
    lastReviewedAt: row.last_reviewed_at ? new Date(row.last_reviewed_at) : null,
    nextReviewAt: row.next_review_at ? new Date(row.next_review_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
});

/**
 * Fetch all problem progress for a user
 */
export const fetchAllUserProgress = async (userId: string): Promise<UserProblemProgress[]> => {
    const { data, error } = await supabase
        .from('user_problem_progress')
        .select('*')
        .eq('user_id', userId)
        .order('problem_title', { ascending: true });

    if (error) {
        console.error('Error fetching user problem progress:', error);
        return [];
    }

    return data.map(mapDbProgressToProgress);
};

/**
 * Fetch progress for a single problem
 */
export const fetchUserProgressByTitle = async (
    userId: string,
    problemTitle: string
): Promise<UserProblemProgress | null> => {
    const { data, error } = await supabase
        .from('user_problem_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('problem_title', problemTitle)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Not found
        }
        console.error('Error fetching user progress by title:', error);
        return null;
    }

    return mapDbProgressToProgress(data);
};

/**
 * Fetch problems due for review (next_review_at <= today)
 * 
 * Filters:
 * - next_review_at <= now (due today or overdue)
 * - status is not 'mastered' or 'graduated' (already done)
 * - reviews_completed < reviews_needed (still needs more reviews)
 */
export const fetchDueReviews = async (userId: string): Promise<UserProblemProgress[]> => {
    const today = new Date().toISOString();
    
    const { data, error } = await supabase
        .from('user_problem_progress')
        .select('*')
        .eq('user_id', userId)
        .not('status', 'in', '("mastered","graduated")') // Exclude completed items
        .lte('next_review_at', today)
        .order('next_review_at', { ascending: true });

    if (error) {
        console.error('Error fetching due reviews:', error);
        return [];
    }

    // Additional filter: only include problems where reviews are still needed
    // This handles edge cases where status wasn't updated correctly
    const filtered = data
        .map(mapDbProgressToProgress)
        .filter(p => p.reviewsCompleted < p.reviewsNeeded);
    
    return filtered;
};

/**
 * Fetch problems due tomorrow
 */
export const fetchDueTomorrow = async (userId: string): Promise<UserProblemProgress[]> => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    
    const { data, error } = await supabase
        .from('user_problem_progress')
        .select('*')
        .eq('user_id', userId)
        .neq('status', 'graduated') // Only exclude fully graduated items
        .gt('next_review_at', today.toISOString())
        .lte('next_review_at', tomorrow.toISOString())
        .order('next_review_at', { ascending: true });

    if (error) {
        console.error('Error fetching due tomorrow:', error);
        return [];
    }

    return data.map(mapDbProgressToProgress);
};

/**
 * Create or update problem progress
 */
export const upsertUserProblemProgress = async (
    userId: string,
    problemTitle: string,
    updates: Partial<Omit<UserProblemProgress, 'id' | 'userId' | 'problemTitle' | 'createdAt' | 'updatedAt'>>
): Promise<UserProblemProgress | null> => {
    const { data, error } = await supabase
        .from('user_problem_progress')
        .upsert({
            user_id: userId,
            problem_title: problemTitle,
            status: updates.status,
            best_score: updates.bestScore,
            reviews_needed: updates.reviewsNeeded,
            reviews_completed: updates.reviewsCompleted,
            last_reviewed_at: updates.lastReviewedAt?.toISOString(),
            next_review_at: updates.nextReviewAt?.toISOString()
        }, { onConflict: 'user_id,problem_title' })
        .select()
        .single();

    if (error) {
        console.error('Error upserting user problem progress:', error);
        return null;
    }

    return mapDbProgressToProgress(data);
};

/**
 * Batch upsert problem progress (for migration)
 */
export const batchUpsertUserProgress = async (
    userId: string,
    progressItems: Array<{
        problemTitle: string;
        status: ProblemStatus;
        bestScore?: number;
        reviewsNeeded?: number;
        reviewsCompleted?: number;
        nextReviewAt?: Date;
    }>
): Promise<boolean> => {
    const records = progressItems.map(item => ({
        user_id: userId,
        problem_title: item.problemTitle,
        status: item.status,
        best_score: item.bestScore || null,
        reviews_needed: item.reviewsNeeded || 2,
        reviews_completed: item.reviewsCompleted || 0,
        next_review_at: item.nextReviewAt?.toISOString() || null,
        last_reviewed_at: item.status !== 'new' ? new Date().toISOString() : null
    }));

    const { error } = await supabase
        .from('user_problem_progress')
        .upsert(records, { onConflict: 'user_id,problem_title' });

    if (error) {
        console.error('Error batch upserting user progress:', error);
        return false;
    }

    return true;
};

/**
 * Get progress statistics for a user
 */
export const getProgressStats = async (userId: string): Promise<{
    newCount: number;
    learningCount: number;
    masteredCount: number;
    dueToday: number;
}> => {
    const allProgress = await fetchAllUserProgress(userId);
    const dueReviews = await fetchDueReviews(userId);

    return {
        newCount: allProgress.filter(p => p.status === 'new').length,
        learningCount: allProgress.filter(p => p.status === 'learning').length,
        masteredCount: allProgress.filter(p => p.status === 'mastered').length,
        dueToday: dueReviews.length
    };
};

// ========== DAILY ACTIVITY TRACKING ==========

import { UserDailyActivity, DailyActivitySummary } from '../types/database';

/**
 * Helper to get today's date in YYYY-MM-DD format (local timezone)
 */
const getTodayDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Helper to map database row to UserDailyActivity type
 */
const mapDbActivityToActivity = (row: any): UserDailyActivity => ({
    id: row.id,
    userId: row.user_id,
    activityDate: row.activity_date,
    problemsCompleted: row.problems_completed || [],
    problemsCount: row.problems_count || 0,
    reviewsCompleted: row.reviews_completed || [],
    reviewsCount: row.reviews_count || 0,
    timeSpentMinutes: row.time_spent_minutes || 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
});

/**
 * Fetch today's activity for a user
 */
export const fetchTodayActivity = async (userId: string): Promise<UserDailyActivity | null> => {
    const today = getTodayDateString();
    console.log('[fetchTodayActivity] Querying for date:', today);
    
    const { data, error } = await supabase
        .from('user_daily_activity')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_date', today)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            console.log('[fetchTodayActivity] No activity found for today');
            return null; // No activity today yet
        }
        console.error('Error fetching today activity:', error);
        return null;
    }

    console.log('[fetchTodayActivity] Found activity:', {
        activity_date: data.activity_date,
        problems_count: data.problems_count,
        problems_completed: data.problems_completed
    });
    return mapDbActivityToActivity(data);
};

/**
 * Fetch all daily activity for a user (for history/stats)
 */
export const fetchAllDailyActivity = async (userId: string): Promise<UserDailyActivity[]> => {
    const { data, error } = await supabase
        .from('user_daily_activity')
        .select('*')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false });

    if (error) {
        console.error('Error fetching all daily activity:', error);
        return [];
    }

    return data.map(mapDbActivityToActivity);
};

/**
 * Get the count of study days (days with any activity)
 * 
 * @param userId - User ID
 * @param sinceDate - Optional: only count days on or after this date (for respecting start_date setting)
 */
export const getStudyDaysCount = async (userId: string, sinceDate?: Date): Promise<number> => {
    let query = supabase
        .from('user_daily_activity')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gt('problems_count', 0);  // Only count days with actual problem completions
    
    // If sinceDate is provided, only count activity from that date onwards
    if (sinceDate) {
        const sinceDateStr = sinceDate.toISOString().split('T')[0];  // YYYY-MM-DD
        query = query.gte('activity_date', sinceDateStr);
    }

    const { count, error } = await query;

    if (error) {
        console.error('Error counting study days:', error);
        return 0;
    }

    return count || 0;
};

/**
 * Record a problem completion in today's activity
 * 
 * @param userId - User ID
 * @param problemTitle - Title of the problem completed
 * @param isReview - Whether this was a review (vs new problem)
 * @param timeMinutes - Time spent on this problem in minutes
 */
export const recordProblemCompletion = async (
    userId: string,
    problemTitle: string,
    isReview: boolean = false,
    timeMinutes: number = 0
): Promise<boolean> => {
    const today = getTodayDateString();
    
    // First, try to get existing activity for today
    const existing = await fetchTodayActivity(userId);
    
    if (existing) {
        // Update existing record
        const problemsCompleted = isReview 
            ? existing.problemsCompleted 
            : existing.problemsCompleted.includes(problemTitle) 
                ? existing.problemsCompleted 
                : [...existing.problemsCompleted, problemTitle];
        
        const reviewsCompleted = !isReview 
            ? existing.reviewsCompleted 
            : existing.reviewsCompleted.includes(problemTitle) 
                ? existing.reviewsCompleted 
                : [...existing.reviewsCompleted, problemTitle];
        
        const { error } = await supabase
            .from('user_daily_activity')
            .update({
                problems_completed: problemsCompleted,
                problems_count: problemsCompleted.length,
                reviews_completed: reviewsCompleted,
                reviews_count: reviewsCompleted.length,
                time_spent_minutes: existing.timeSpentMinutes + timeMinutes,
                updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

        if (error) {
            console.error('Error updating daily activity:', error);
            return false;
        }
    } else {
        // Create new record for today
        const { error } = await supabase
            .from('user_daily_activity')
            .insert({
                user_id: userId,
                activity_date: today,
                problems_completed: isReview ? [] : [problemTitle],
                problems_count: isReview ? 0 : 1,
                reviews_completed: isReview ? [problemTitle] : [],
                reviews_count: isReview ? 1 : 0,
                time_spent_minutes: timeMinutes
            });

        if (error) {
            console.error('Error creating daily activity:', error);
            return false;
        }
    }
    
    console.log(`[Daily Activity] Recorded: ${problemTitle} (${isReview ? 'review' : 'new'}, ${timeMinutes}min)`);
    return true;
};

/**
 * Get daily activity summary for the last N days
 */
export const getDailyActivitySummary = async (
    userId: string,
    days: number = 30
): Promise<DailyActivitySummary[]> => {
    const { data, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date, problems_count, reviews_count, time_spent_minutes')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false })
        .limit(days);

    if (error) {
        console.error('Error fetching activity summary:', error);
        return [];
    }

    return data.map(row => ({
        date: row.activity_date,
        problemsCount: row.problems_count || 0,
        reviewsCount: row.reviews_count || 0,
        totalCount: (row.problems_count || 0) + (row.reviews_count || 0),
        timeSpentMinutes: row.time_spent_minutes || 0
    }));
};

// ========== SKILL MODULES (System Coding, ML Coding, etc.) ==========

/**
 * Fetch all skill modules (formerly "companies")
 * These are specialized interview prep categories like System Coding, ML Coding
 */
export const fetchCompanies = async (): Promise<Array<{
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    createdAt: Date;
}>> => {
    const { data, error } = await supabase
        .from('skill_modules')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching skill modules:', error);
        return [];
    }

    return data.map(module => ({
        id: module.id,
        name: module.name,
        description: module.description,
        icon: module.icon,
        createdAt: new Date(module.created_at)
    }));
};

/**
 * Fetch problems for a specific skill module
 * Returns the linked problems from blind_problems table ordered by display_order
 */
export const fetchCompanyProblems = async (moduleId: string): Promise<BlindProblem[]> => {
    const { data, error } = await supabase
        .from('module_problems')
        .select(`
            problem_title,
            display_order,
            notes,
            problem_source
        `)
        .eq('module_id', moduleId)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching module problems:', error);
        return [];
    }

    if (!data || data.length === 0) {
        return [];
    }

    // Fetch the actual problem details from blind_problems
    const problemTitles = data.map(cp => cp.problem_title);
    const { data: problems, error: problemsError } = await supabase
        .from('blind_problems')
        .select('*')
        .in('title', problemTitles);

    if (problemsError) {
        console.error('Error fetching blind problems:', problemsError);
        return [];
    }

    if (!problems) {
        return [];
    }

    // Map to BlindProblem format and maintain display_order
    const problemMap = new Map(problems.map(p => [p.title, p]));
    const orderedProblems: BlindProblem[] = [];

    for (const cp of data) {
        const problem = problemMap.get(cp.problem_title);
        if (problem) {
            orderedProblems.push({
                id: problem.id,
                title: problem.title,
                prompt: problem.prompt,
                example: problem.example,
                constraints: problem.constraints,
                pattern: problem.pattern,
                keyIdea: problem.key_idea,
                detailedHint: problem.detailed_hint,
                definition: problem.definition,
                solution: problem.solution,
                timeComplexity: problem.time_complexity,
                spaceComplexity: problem.space_complexity,
                steps: problem.steps,
                expectedEdgeCases: problem.expected_edge_cases,
                topics: problem.topics,
                difficulty: problem.difficulty,
                problemGroup: problem.problem_group,
                leetcodeNumber: problem.leetcode_number,
                mnemonicImageUrl: problem.mnemonic_image_url
            });
        }
    }

    return orderedProblems;
};

/**
 * Build a problem queue for a specific company
 * Similar to buildProblemQueue but for company-specific problems
 */
export const buildCompanyProblemQueue = async (
    companyId: string,
    limit: number = 10
): Promise<BlindProblem[]> => {
    const companyProblems = await fetchCompanyProblems(companyId);
    
    // Return up to 'limit' problems
    return companyProblems.slice(0, limit);
};

/**
 * Get count of problems for a specific skill module.
 * Includes both curated problems from module_problems AND custom questions.
 */
export const getCompanyProblemsCount = async (
    moduleId: string, 
    moduleName?: string, 
    userId?: string
): Promise<number> => {
    // Count curated problems from module_problems table
    const { count: curatedCount, error } = await supabase
        .from('module_problems')
        .select('*', { count: 'exact', head: true })
        .eq('module_id', moduleId);

    if (error) {
        console.error('Error counting module problems:', error);
    }

    let customCount = 0;
    
    // Count custom questions if we have both module name and user ID
    if (moduleName && userId) {
        const { count: customQuestionsCount, error: customError } = await supabase
            .from('custom_interview_questions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('company', moduleName);  // Note: custom_interview_questions still uses 'company' field
        
        if (customError) {
            console.error('Error counting custom questions:', customError);
        } else {
            customCount = customQuestionsCount || 0;
        }
    }

    const total = (curatedCount || 0) + customCount;
    console.log(`[getCompanyProblemsCount] Module ${moduleName || moduleId}: ${curatedCount || 0} curated + ${customCount} custom = ${total} total`);
    
    return total;
};


// ========== CUSTOM INTERVIEW QUESTIONS ==========

/**
 * Fetch all custom interview questions for a user
 */
export const fetchCustomInterviewQuestions = async (userId: string): Promise<CustomInterviewQuestion[]> => {
    const { data, error } = await supabase
        .from('custom_interview_questions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching custom interview questions:', error);
        return [];
    }

    return data.map(q => ({
        id: q.id,
        userId: q.user_id,
        title: q.title,
        description: q.description,
        solutionCode: q.solution_code || '',
        language: q.language || 'python',
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard' | undefined,
        topics: q.topics || [],
        company: q.company || undefined,
        interviewRound: q.interview_round || undefined,
        notes: q.notes || undefined,
        reportId: q.report_id || undefined,
        createdAt: new Date(q.created_at),
        updatedAt: new Date(q.updated_at)
    }));
};

/**
 * Create a new custom interview question
 */
export const createCustomInterviewQuestion = async (
    userId: string,
    questionData: Omit<CustomInterviewQuestion, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<CustomInterviewQuestion | null> => {
    const { data, error } = await supabase
        .from('custom_interview_questions')
        .insert({
            user_id: userId,
            title: questionData.title,
            description: questionData.description,
            solution_code: questionData.solutionCode,
            language: questionData.language,
            difficulty: questionData.difficulty,
            topics: questionData.topics,
            company: questionData.company,
            interview_round: questionData.interviewRound,
            notes: questionData.notes,
            report_id: questionData.reportId
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating custom interview question:', error);
        return null;
    }

    return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        solutionCode: data.solution_code || '',
        language: data.language || 'python',
        difficulty: data.difficulty as 'easy' | 'medium' | 'hard' | undefined,
        topics: data.topics || [],
        company: data.company || undefined,
        interviewRound: data.interview_round || undefined,
        notes: data.notes || undefined,
        reportId: data.report_id || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
    };
};

/**
 * Update an existing custom interview question
 */
export const updateCustomInterviewQuestion = async (
    questionId: string,
    updates: Partial<Omit<CustomInterviewQuestion, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<CustomInterviewQuestion | null> => {
    const updateData: any = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.solutionCode !== undefined) updateData.solution_code = updates.solutionCode;
    if (updates.language !== undefined) updateData.language = updates.language;
    if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
    if (updates.topics !== undefined) updateData.topics = updates.topics;
    if (updates.company !== undefined) updateData.company = updates.company;
    if (updates.interviewRound !== undefined) updateData.interview_round = updates.interviewRound;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    if (updates.reportId !== undefined) updateData.report_id = updates.reportId;

    const { data, error } = await supabase
        .from('custom_interview_questions')
        .update(updateData)
        .eq('id', questionId)
        .select()
        .single();

    if (error) {
        console.error('Error updating custom interview question:', error);
        return null;
    }

    return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        solutionCode: data.solution_code || '',
        language: data.language || 'python',
        difficulty: data.difficulty as 'easy' | 'medium' | 'hard' | undefined,
        topics: data.topics || [],
        company: data.company || undefined,
        interviewRound: data.interview_round || undefined,
        notes: data.notes || undefined,
        reportId: data.report_id || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
    };
};

/**
 * Delete a custom interview question
 */
export const deleteCustomInterviewQuestion = async (questionId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('custom_interview_questions')
        .delete()
        .eq('id', questionId);

    if (error) {
        console.error('Error deleting custom interview question:', error);
        return false;
    }

    return true;
};

/**
 * Get a single custom interview question by ID
 */
export const getCustomInterviewQuestion = async (questionId: string): Promise<CustomInterviewQuestion | null> => {
    const { data, error } = await supabase
        .from('custom_interview_questions')
        .select('*')
        .eq('id', questionId)
        .single();

    if (error) {
        console.error('Error fetching custom interview question:', error);
        return null;
    }

    return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description,
        solutionCode: data.solution_code || '',
        language: data.language || 'python',
        difficulty: data.difficulty as 'easy' | 'medium' | 'hard' | undefined,
        topics: data.topics || [],
        company: data.company || undefined,
        interviewRound: data.interview_round || undefined,
        notes: data.notes || undefined,
        reportId: data.report_id || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
    };
};

// ============================================================
// SYSTEM CODING QUESTIONS (with teaching metadata)
// ============================================================

export interface SystemCodingQuestionData {
    title: string;
    prompt: string;
    formattedPrompt?: {
        title?: string;
        sections: Array<{
            type: 'heading' | 'paragraph' | 'code' | 'example' | 'list' | 'constraint';
            content: string;
            items?: string[];
            language?: string;
            label?: string;
        }>;
    }; // Structured problem statement for rich display
    solutionCode: string;
    correctSolution: string;
    codeLanguage: string;
    company: string | null;
    // Teaching metadata (generated by AI)
    keyIdea: string;
    pattern: string;
    steps: string[];
    timeComplexity: string;
    spaceComplexity: string;
    detailedHint: string;
    expectedEdgeCases: string[];
    // Additional context from report
    knownBugs?: Array<{
        title: string;
        type: string;
        severity: string;
        fix: string;
    }>;
}

/**
 * Save a system coding question with teaching metadata.
 * The module field is stored directly on the question for filtering.
 * Note: We don't insert into module_problems (RLS protected for admin use).
 * Custom questions are fetched via fetchCustomQuestionsForCompany instead.
 */
export const saveSystemCodingQuestion = async (
    userId: string,
    data: SystemCodingQuestionData
): Promise<{ questionId: string; company: string | null } | null> => {
    try {
        // Store teaching metadata as JSON in notes field
        const teachingMetadata = {
            keyIdea: data.keyIdea,
            pattern: data.pattern,
            steps: data.steps,
            timeComplexity: data.timeComplexity,
            spaceComplexity: data.spaceComplexity,
            detailedHint: data.detailedHint,
            expectedEdgeCases: data.expectedEdgeCases,
            correctSolution: data.correctSolution,
            knownBugs: data.knownBugs || [],
            formattedPrompt: data.formattedPrompt || undefined,
            isSystemCoding: true
        };

        // Create the custom interview question with company field
        const { data: questionData, error: questionError } = await supabase
            .from('custom_interview_questions')
            .insert({
                user_id: userId,
                title: data.title,
                description: data.prompt,
                solution_code: data.solutionCode,
                language: data.codeLanguage,
                company: data.company,
                notes: JSON.stringify(teachingMetadata)
            })
            .select()
            .single();

        if (questionError) {
            console.error('Error creating system coding question:', questionError);
            return null;
        }

        console.log(`[SaveSystemCoding] Saved question "${data.title}" (ID: ${questionData.id})${data.company ? ` for company "${data.company}"` : ''}`);
        return { questionId: questionData.id, company: data.company };
    } catch (error) {
        console.error('Error in saveSystemCodingQuestion:', error);
        return null;
    }
};

/**
 * Check if a system coding question already exists for a user + title
 * Returns the question ID if found, null otherwise
 */
export const findExistingSystemCodingQuestion = async (
    userId: string,
    title: string
): Promise<{ questionId: string; company: string | null } | null> => {
    const { data, error } = await supabase
        .from('custom_interview_questions')
        .select('id, company, notes')
        .eq('user_id', userId)
        .eq('title', title)
        .limit(1);

    if (error) {
        console.error('Error finding existing question:', error);
        return null;
    }

    if (data && data.length > 0) {
        // Verify it's a system coding question
        try {
            const notes = JSON.parse(data[0].notes || '{}');
            if (notes.isSystemCoding) {
                console.log(`[FindExisting] Found existing question "${title}" (ID: ${data[0].id})`);
                return { questionId: data[0].id, company: data[0].company };
            }
        } catch {
            // Not a valid system coding question
        }
    }

    return null;
};

/**
 * Fetch custom questions for a specific company
 * Returns questions that have teaching metadata (isSystemCoding: true)
 */
export const fetchCustomQuestionsForCompany = async (
    userId: string,
    companyName: string
): Promise<Array<BlindProblem & { isSystemCoding: true }>> => {
    const { data, error } = await supabase
        .from('custom_interview_questions')
        .select('*')
        .eq('user_id', userId)
        .eq('company', companyName)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching custom questions for company:', error);
        return [];
    }

    // Transform to BlindProblem format for teaching mode compatibility
    return data
        .filter(q => {
            try {
                const notes = JSON.parse(q.notes || '{}');
                return notes.isSystemCoding === true;
            } catch {
                return false;
            }
        })
        .map(q => {
            const metadata = JSON.parse(q.notes || '{}');
            return {
                id: q.id,
                title: q.title,
                prompt: q.description,
                formattedPrompt: metadata.formattedPrompt || undefined,
                example: '',
                constraints: [],
                pattern: metadata.pattern || 'System Coding',
                keyIdea: metadata.keyIdea || '',
                detailedHint: metadata.detailedHint,
                definition: undefined,
                solution: metadata.correctSolution || q.solution_code,
                timeComplexity: metadata.timeComplexity || '',
                spaceComplexity: metadata.spaceComplexity || '',
                steps: metadata.steps || [],
                expectedEdgeCases: metadata.expectedEdgeCases || [],
                topics: q.topics || [],
                difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
                problemGroup: 'system_coding',
                isSystemCoding: true as const
            };
        });
};

// ========== INTERVIEW QUESTIONS (for End Game) ==========

/**
 * Fetch interview questions by type.
 * Returns both default questions (user_id IS NULL) and user's custom questions.
 */
export const fetchBehavioralQuestions = async (type: BehavioralQuestionType): Promise<BehavioralQuestion[]> => {
    console.log('[DB] fetchBehavioralQuestions called with type:', type);
    
    const { data, error } = await supabase
        .from('behavioral_questions')
        .select('*')
        .eq('type', type)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    console.log('[DB] fetchBehavioralQuestions result:', { data: data?.length || 0, error: error?.message || null });

    if (error) {
        console.error('[DB] Error fetching behavioral questions:', error);
        return [];
    }

    if (!data || data.length === 0) {
        console.warn('[DB] No behavioral questions found for type:', type);
        return [];
    }

    const mapped = data.map(q => ({
        id: q.id,
        userId: q.user_id,
        type: q.type as BehavioralQuestionType,
        title: q.title,
        context: q.context,
        probingPrompt: q.probing_prompt,
        source: q.source,
        isDefault: q.is_default,
        createdAt: new Date(q.created_at),
        updatedAt: new Date(q.updated_at)
    }));
    
    console.log('[DB] fetchBehavioralQuestions returning', mapped.length, 'questions');
    return mapped;
};

/**
 * Fetch all interview questions (all types).
 */
export const fetchAllBehavioralQuestions = async (): Promise<BehavioralQuestion[]> => {
    const { data, error } = await supabase
        .from('behavioral_questions')
        .select('*')
        .order('type', { ascending: true })
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all interview questions:', error);
        return [];
    }

    return data.map(q => ({
        id: q.id,
        userId: q.user_id,
        type: q.type as BehavioralQuestionType,
        title: q.title,
        context: q.context,
        probingPrompt: q.probing_prompt,
        source: q.source,
        isDefault: q.is_default,
        createdAt: new Date(q.created_at),
        updatedAt: new Date(q.updated_at)
    }));
};

/**
 * Create a new interview question for a user.
 */
export const createBehavioralQuestion = async (
    userId: string,
    question: Omit<BehavioralQuestion, 'id' | 'userId' | 'isDefault' | 'createdAt' | 'updatedAt'>
): Promise<BehavioralQuestion | null> => {
    const { data, error } = await supabase
        .from('behavioral_questions')
        .insert({
            user_id: userId,
            type: question.type,
            title: question.title,
            context: question.context,
            probing_prompt: question.probingPrompt,
            source: question.source,
            is_default: false
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating interview question:', error);
        return null;
    }

    return {
        id: data.id,
        userId: data.user_id,
        type: data.type as InterviewQuestionType,
        title: data.title,
        context: data.context,
        probingPrompt: data.probing_prompt,
        source: data.source,
        isDefault: data.is_default,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
    };
};

/**
 * Delete an interview question (user can only delete their own).
 */
export const deleteBehavioralQuestion = async (questionId: string): Promise<boolean> => {
    const { error } = await supabase
        .from('behavioral_questions')
        .delete()
        .eq('id', questionId);

    if (error) {
        console.error('Error deleting interview question:', error);
        return false;
    }

    return true;
};

/**
 * Convert BehavioralQuestion to ArenaQuestion format for use with ArenaView.
 */
export const toArenaQuestion = (q: BehavioralQuestion): { id: string; title: string; context: string; probingPrompt: string; source?: string } => ({
    id: q.id,
    title: q.title,
    context: q.context,
    probingPrompt: q.probingPrompt,
    source: q.source
});

// Backwards compatibility alias
export const toHotTakeQuestion = toArenaQuestion;
