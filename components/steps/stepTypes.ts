/**
 * Step Types and Shared Props
 * 
 * Type definitions for the Walkie-Talkie step components.
 */

import { BlindProblem, PerformanceReport, TeachingSession, TeachingReport, ReadinessReport } from '../../types';
import { UserStudySettings, StudyStats } from '../../types/database';
import { SpotWithTopic } from '../spots';

// All possible step types in the flow
export type StepType = 
  | 'locations' 
  | 'curating' 
  | 'problem' 
  | 'recording' 
  | 'analyzing' 
  | 'reveal'
  | 'readiness_evaluating' 
  | 'readiness_reveal'
  | 'teaching' 
  | 'junior_thinking' 
  | 'junior_question' 
  | 'junior_summarizing' 
  | 'dean_evaluating' 
  | 'teaching_reveal';

// Difficulty modes
export type DifficultyMode = 'warmup' | 'standard' | 'challenge';

// Session modes
export type SessionMode = 'paired' | 'explain' | 'teach';

// Difficulty to problem filter mapping
export const DIFFICULTY_MAP: Record<DifficultyMode, ('easy' | 'medium' | 'hard')[]> = {
  warmup: ['easy'],
  standard: ['easy', 'medium'],
  challenge: ['easy', 'medium', 'hard']
};

// Daily stats for the 7-day history
export interface DailyStats {
  date: string;
  displayDate: string;
  count: number;
  isToday: boolean;
}

// Common props shared across step components
export interface CommonStepProps {
  onHome: (force: boolean) => void;
  setStep: (step: StepType) => void;
}

// Props for LocationsStep
export interface LocationsStepProps extends CommonStepProps {
  // Settings & Stats
  studySettings: UserStudySettings | null;
  studyStats: StudyStats | null;
  dailyCleared: number;
  globalProgress: number;
  totalConquered: number;
  masteryCycle: number;
  dailyStats: DailyStats[];
  masteredIds: string[];
  
  // Mode controls
  sessionMode: SessionMode;
  setSessionMode: (mode: SessionMode) => void;
  difficultyMode: DifficultyMode;
  setDifficultyMode: (mode: DifficultyMode) => void;
  
  // Spots
  spotsWithTopics: SpotWithTopic[];
  isLoadingSpots: boolean;
  startSpotSession: (spot: SpotWithTopic) => void;
  handleRefreshSingleSpot: (spotId: string, e: React.MouseEvent) => void;
  
  // Modals
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  settingsForm: { targetDays: number; dailyCap: number; dailyNewGoal: number; startDate: string };
  setSettingsForm: (form: { targetDays: number; dailyCap: number; dailyNewGoal: number; startDate: string }) => void;
  handleSaveSettings: () => Promise<void>;
  useSpacedRepetition: boolean;
  setUseSpacedRepetition: (use: boolean) => void;
}

// Props for ProblemStep (problem/recording)
export interface ProblemStepProps extends CommonStepProps {
  currentProblem: BlindProblem | null;
  currentQueueIdx: number;
  problemQueue: BlindProblem[];
  sessionMode: SessionMode;
  
  // Recording state
  rawTranscript: string;
  isRecordingRef: React.MutableRefObject<boolean>;
  
  // Hint/definition state
  revealHintIdx: number;
  setRevealHintIdx: (idx: number) => void;
  showDefinitionExpanded: boolean;
  setShowDefinitionExpanded: (show: boolean) => void;
  usedHints: boolean;
  setUsedHints: (used: boolean) => void;
  
  // Actions
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  
  // Timer
  problemStartTime: Date | null;
}

// Props for TeachingStep
export interface TeachingStepProps extends CommonStepProps {
  currentProblem: BlindProblem | null;
  teachingSession: TeachingSession | null;
  teachingRawTranscript: string;
  isTeachingRecording: boolean;
  isSpeaking: boolean;
  sessionMode: SessionMode;
  
  // Actions
  handleStartTeachingRecording: () => void;
  handleStopTeachingRecording: () => void;
  handleSendTeachingMessage: () => void;
  stopSpeaking: () => void;
  
  // Timers
  problemStartTime: Date | null;
}

// Props for reveal/report steps
export interface RevealStepProps extends CommonStepProps {
  currentProblem: BlindProblem | null;
  aiReport: PerformanceReport | null;
  problemQueue: BlindProblem[];
  currentQueueIdx: number;
  usedHints: boolean;
  
  // Time tracking
  problemStartTime: Date | null;
  elapsedTime: number;
  
  // Actions
  handleNextProblem: () => void;
  handleMastered: () => void;
  
  // Save/bookmark
  isSaved: (title: string, content: string) => boolean;
  onToggleSave: (item: any) => void;
}

// Props for TeachingRevealStep
export interface TeachingRevealStepProps extends CommonStepProps {
  currentProblem: BlindProblem | null;
  teachingSession: TeachingSession | null;
  teachingReport: TeachingReport | null;
  sessionMode: SessionMode;
  
  // Time tracking
  elapsedTime: number;
  
  // Actions  
  handleNextProblem: () => void;
  handleMastered: () => void;
  handleReEvaluate: () => void;
  
  // Save/bookmark
  isSaved: (title: string, content: string) => boolean;
  onToggleSave: (item: any) => void;
}

// Props for ReadinessRevealStep
export interface ReadinessRevealStepProps extends CommonStepProps {
  currentProblem: BlindProblem | null;
  readinessReport: ReadinessReport | null;
  
  // Time tracking
  elapsedTime: number;
  
  // Actions
  handleContinueToTeach: () => void;
  handleTryExplainAgain: () => void;
  handleNextProblem: () => void;
  
  // Save/bookmark
  isSaved: (title: string, content: string) => boolean;
  onToggleSave: (item: any) => void;
}

// Loading step props (for curating, analyzing, etc.)
export interface LoadingStepProps {
  message: string;
  subMessage?: string;
}

