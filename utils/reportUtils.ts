/**
 * Report Utilities
 * 
 * Utility functions for processing saved reports and calculating daily stats.
 */

import { SavedReport } from '../types';

// Helper to get date string (YYYY-MM-DD format) in LOCAL timezone
export const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get date string from Date or string (for report counting)
export const getDateStringFromReport = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return getDateString(d);
};

// Daily stats interface for tracking study history
export interface DailyStats {
  date: string;
  displayDate: string;
  count: number;
  isToday: boolean;
}

/**
 * Count unique questions solved per day from saved reports.
 * Only counts "mastered" completions:
 * - Walkie: detectedAutoScore === 'good'
 * - Teach: studentOutcome === 'can_implement' AND teachingScore >= 75
 */
export const countQuestionsByDate = (reports: SavedReport[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  const uniquePerDay: Record<string, Set<string>> = {};
  
  // Only count walkie and teach reports that were "mastered"
  const relevantReports = reports.filter(r => {
    if (r.type === 'walkie') {
      return r.reportData?.detectedAutoScore === 'good';
    }
    if (r.type === 'teach') {
      const teachingData = r.reportData?.teachingReportData;
      return teachingData?.studentOutcome === 'can_implement' && (teachingData?.teachingScore ?? 0) >= 75;
    }
    return false;
  });
  
  for (const report of relevantReports) {
    const dateStr = getDateStringFromReport(report.date);
    
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

