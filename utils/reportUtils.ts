/**
 * Report Utilities
 * 
 * Utility functions for processing saved reports and calculating daily stats.
 */

import { SavedReport } from '../types';

// Helper to get date string (YYYY-MM-DD format) in LOCAL timezone
// Accepts both Date objects and date strings for flexibility
export const getDateString = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Daily stats interface for tracking study history
export interface DailyStats {
  date: string;
  displayDate: string;
  count: number;
  isToday: boolean;
}

/**
 * Count unique questions completed per day from saved reports.
 * Counts "passed" completions (score >= 70) which includes both:
 * - Passed tier (score 70-74): queued for review
 * - Mastered tier (score >= 75): excellent performance
 * 
 * This matches the criteria used in My Performance daily progress.
 */
export const countQuestionsByDate = (reports: SavedReport[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  const uniquePerDay: Record<string, Set<string>> = {};
  
  // Count walkie and teach reports with score >= 70 (passed or mastered)
  const relevantReports = reports.filter(r => {
    if (r.type === 'walkie') {
      // Score >= 70 means passed (70-74) or mastered (>= 75)
      // detectedAutoScore 'good' = 75+, 'partial' = 70-74
      const score = r.rating ?? 0;
      return score >= 70;
    }
    if (r.type === 'teach') {
      const teachingData = r.reportData?.teachingReportData;
      const teachingScore = teachingData?.teachingScore ?? r.rating ?? 0;
      return teachingScore >= 70;
    }
    return false;
  });
  
  for (const report of relevantReports) {
    const dateStr = getDateString(report.date);
    
    if (!uniquePerDay[dateStr]) {
      uniquePerDay[dateStr] = new Set();
    }
    
    // Only count unique problems per day
    if (!uniquePerDay[dateStr].has(report.title)) {
      uniquePerDay[dateStr].add(report.title);
      counts[dateStr] = (counts[dateStr] || 0) + 1;
    }
  }
  
  return counts;
};

/**
 * Get daily stats for the last N days.
 * Returns an array of DailyStats objects with solved counts.
 */
export const getDailyStats = (reports: SavedReport[], days: number = 7): DailyStats[] => {
  const counts = countQuestionsByDate(reports);
  const today = new Date();
  const stats: DailyStats[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    const isToday = i === 0;
    
    stats.push({
      date: dateStr,
      displayDate: isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      count: counts[dateStr] || 0,
      isToday
    });
  }
  
  return stats;
};

