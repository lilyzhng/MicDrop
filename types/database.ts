export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blind_problems: {
        Row: {
          id: string
          title: string
          prompt: string
          example: string | null
          constraints: string[]
          pattern: string
          key_idea: string
          detailed_hint: string | null
          definition: string | null
          solution: string
          time_complexity: string
          space_complexity: string
          steps: string[]
          expected_edge_cases: string[]
          topics: string[]
          difficulty: 'easy' | 'medium' | 'hard'
          problem_group: string | null
          leetcode_number: number | null
          mnemonic_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          prompt: string
          example?: string | null
          constraints?: string[]
          pattern: string
          key_idea: string
          detailed_hint?: string | null
          definition?: string | null
          solution: string
          time_complexity: string
          space_complexity: string
          steps?: string[]
          expected_edge_cases?: string[]
          topics?: string[]
          difficulty: 'easy' | 'medium' | 'hard'
          problem_group?: string | null
          leetcode_number?: number | null
          mnemonic_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          prompt?: string
          example?: string | null
          constraints?: string[]
          pattern?: string
          key_idea?: string
          detailed_hint?: string | null
          definition?: string | null
          solution?: string
          time_complexity?: string
          space_complexity?: string
          steps?: string[]
          expected_edge_cases?: string[]
          topics?: string[]
          difficulty?: 'easy' | 'medium' | 'hard'
          problem_group?: string | null
          leetcode_number?: number | null
          mnemonic_image_url?: string | null
          created_at?: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          type: 'script' | 'response' | 'tip' | 'improvement' | 'highlight' | 'drill'
          created_at: string
          category?: string
          rewrite?: string
          explanation?: string
          question?: string
          human_rewrite?: string
          report_data?: Json
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          type: 'script' | 'response' | 'tip' | 'improvement' | 'highlight' | 'drill'
          created_at?: string
          category?: string
          rewrite?: string
          explanation?: string
          question?: string
          human_rewrite?: string
          report_data?: Json
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          type?: 'script' | 'response' | 'tip' | 'improvement' | 'highlight' | 'drill'
          created_at?: string
          category?: string
          rewrite?: string
          explanation?: string
          question?: string
          human_rewrite?: string
          report_data?: Json
        }
      }
      saved_reports: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'walkie' | 'hot-take' | 'teach' | 'readiness' | 'system-coding' | 'role-fit'
          rating: number
          report_data: Json
          created_at: string
          report_date: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: 'walkie' | 'hot-take' | 'teach' | 'readiness' | 'system-coding' | 'role-fit'
          rating: number
          report_data: Json
          created_at?: string
          report_date?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'walkie' | 'hot-take' | 'teach' | 'readiness' | 'system-coding' | 'role-fit'
          rating?: number
          report_data?: Json
          created_at?: string
          report_date?: string
        }
      }
      user_study_settings: {
        Row: {
          user_id: string
          target_days: number
          daily_cap: number
          easy_bonus: number
          start_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          target_days?: number
          daily_cap?: number
          easy_bonus?: number
          start_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          target_days?: number
          daily_cap?: number
          easy_bonus?: number
          start_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_problem_progress: {
        Row: {
          id: string
          user_id: string
          problem_title: string
          status: 'new' | 'learning' | 'mastered'
          best_score: number | null
          reviews_needed: number
          reviews_completed: number
          last_reviewed_at: string | null
          next_review_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          problem_title: string
          status?: 'new' | 'learning' | 'mastered'
          best_score?: number | null
          reviews_needed?: number
          reviews_completed?: number
          last_reviewed_at?: string | null
          next_review_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          problem_title?: string
          status?: 'new' | 'learning' | 'mastered'
          best_score?: number | null
          reviews_needed?: number
          reviews_completed?: number
          last_reviewed_at?: string | null
          next_review_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      company_problems: {
        Row: {
          id: string
          company_id: string
          problem_title: string
          problem_source: 'blind_problems' | 'custom'
          display_order: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          problem_title: string
          problem_source: 'blind_problems' | 'custom'
          display_order?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          problem_title?: string
          problem_source?: 'blind_problems' | 'custom'
          display_order?: number
          notes?: string | null
          created_at?: string
        }
      }
      custom_interview_questions: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          solution_code: string | null
          language: string
          difficulty: 'easy' | 'medium' | 'hard' | null
          topics: string[] | null
          company: string | null
          interview_round: string | null
          notes: string | null
          report_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          solution_code?: string | null
          language?: string
          difficulty?: 'easy' | 'medium' | 'hard' | null
          topics?: string[] | null
          company?: string | null
          interview_round?: string | null
          notes?: string | null
          report_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          solution_code?: string | null
          language?: string
          difficulty?: 'easy' | 'medium' | 'hard' | null
          topics?: string[] | null
          company?: string | null
          interview_round?: string | null
          notes?: string | null
          report_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// ============================================
// Spaced Repetition Types (Application Layer)
// ============================================

export type ProblemStatus = 'new' | 'learning' | 'reviewing' | 'mastered' | 'graduated';

export interface UserStudySettings {
  userId: string;
  targetDays: number;
  dailyCap: number;
  easyBonus: number;
  startDate: Date;
}

export interface UserProblemProgress {
  id: string;
  userId: string;
  problemTitle: string;
  status: ProblemStatus;
  bestScore: number | null;
  reviewsNeeded: number;
  reviewsCompleted: number;
  lastReviewedAt: Date | null;
  nextReviewAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyStats {
  totalProblems: number;
  newCount: number;
  learningCount: number;
  masteredCount: number;
  dueToday: number;
  dueTomorrow: number;
  daysLeft: number;
  dayNumber: number;  // Current day number (based on actual study days)
  onPace: boolean;
  todaysQueue: {
    newProblems: number;
    reviews: number;
    total: number;
  };
}

// ============================================
// Daily Activity Tracking Types
// ============================================

export interface UserDailyActivity {
  id: string;
  userId: string;
  activityDate: string;  // YYYY-MM-DD format
  problemsCompleted: string[];  // Problem titles completed today
  problemsCount: number;
  reviewsCompleted: string[];  // Problem titles reviewed today
  reviewsCount: number;
  timeSpentMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyActivitySummary {
  date: string;
  problemsCount: number;
  reviewsCount: number;
  totalCount: number;
  timeSpentMinutes: number;
}

// ============================================
// Company-Specific Interview Questions Types
// ============================================

export interface Company {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: Date;
}

export interface CompanyProblem {
  id: string;
  companyId: string;
  problemTitle: string;
  problemSource: 'blind_problems' | 'custom';
  displayOrder: number;
  notes: string | null;
  createdAt: Date;
}

