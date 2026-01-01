
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  SpotWithTopic,
  PowerSpot,
  POWER_SPOTS,
  getLockedSpotAssignments,
  lockSpotAssignment,
  getDateString,
  assignTopicsToSpots,
  incrementQuestionsAnswered
} from '../components/spots';
import { BlindProblem, PerformanceReport, SavedItem, SavedReport, TeachingSession, TeachingReport, ReadinessReport } from '../types';
import { UserStudySettings, StudyStats, Company } from '../types/database';
import { supabase } from '../config/supabase';
import { analyzeWalkieSession } from '../services/analysisService';
import { buildProblemQueue, fetchBlindProblemByTitle, fetchSystemCodingQuestionByTitle, fetchUserProgressByTitle, fetchDueReviews, fetchTodayActivity, fetchCompanies, buildCompanyProblemQueue, getCompanyProblemsCount, fetchCustomQuestionsForCompany } from '../services/databaseService';
import { 
  getJuniorResponse, 
  getJuniorSummary, 
  evaluateTeaching,
  speakJuniorResponse,
  stopSpeaking,
  createTeachingSession,
  addTurn,
  updateJuniorState,
  setJuniorSummary,
  evaluateReadinessToTeach
} from '../services/teachBackService';
import {
  getSettingsWithDefaults,
  updateSettings,
  buildSpacedRepetitionQueue,
  updateProgressAfterAttempt,
  getProgressGrid,
  DEFAULT_SETTINGS
} from '../services/spacedRepetitionService';
import { useAuth } from '../contexts/AuthContext';
import {
  CuratingStep,
  AnalyzingStep,
  ReadinessEvaluatingStep,
  JuniorSummarizingStep,
  DeanEvaluatingStep,
  LocationsStep,
  ProblemStep,
  TeachingStep,
  RevealStep,
  ReadinessRevealStep,
  TeachingRevealStep,
  DifficultyMode,
  SessionMode,
  DIFFICULTY_MAP
} from '../components/steps';
import { countQuestionsByDate, getDailyStats } from '../utils/reportUtils';
import { useIdleSessionTimeout } from '../hooks';
import { IdleTimeoutWarning } from '../components/IdleTimeoutWarning';

interface WalkieTalkieViewProps {
  onHome: (force: boolean) => void;
  onSaveReport: (title: string, type: 'walkie' | 'teach' | 'readiness', report: PerformanceReport) => void;
  masteredIds: string[];
  onMastered: (id: string) => void;
  isSaved: (title: string, content: string) => boolean;
  onToggleSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  savedReports: SavedReport[];
}

const WalkieTalkieView: React.FC<WalkieTalkieViewProps> = ({ onHome, onSaveReport, masteredIds, onMastered, isSaved, onToggleSave, savedReports }) => {
  // Get auth context for user ID
  const { user } = useAuth();
  
  // Get navigation state for "Teach Again" functionality
  const location = useLocation();
  const navigationState = location.state as { teachAgainProblem?: string; isSystemCoding?: boolean } | null;
  const teachAgainProblem = navigationState?.teachAgainProblem;
  const isSystemCodingNavigation = navigationState?.isSystemCoding;

  // Step types now include paired repetition flow steps
  type StepType = 'locations' | 'curating' | 'problem' | 'recording' | 'analyzing' | 'reveal'
    // Paired flow: Explain → Readiness → Teach
    | 'readiness_evaluating' | 'readiness_reveal'
    // Teaching mode steps
    | 'teaching' | 'junior_thinking' | 'junior_question' | 'junior_summarizing' | 'dean_evaluating' | 'teaching_reveal';
  
  const [step, setStep] = useState<StepType>('locations');
  const [analysisPhase, setAnalysisPhase] = useState<'refining' | 'evaluating'>('refining');
  const [selectedSpot, setSelectedSpot] = useState<PowerSpot | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Spaced Repetition Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [studySettings, setStudySettings] = useState<UserStudySettings | null>(null);
  const [studyStats, setStudyStats] = useState<StudyStats | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    targetDays: DEFAULT_SETTINGS.targetDays,
    dailyCap: DEFAULT_SETTINGS.dailyCap,
    startDate: new Date().toISOString().split('T')[0]  // YYYY-MM-DD format
  });
  const [useSpacedRepetition, setUseSpacedRepetition] = useState(true);
  
  // Spot topic assignments - each spot gets a random topic
  const [spotsWithTopics, setSpotsWithTopics] = useState<SpotWithTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);
  
  // Company-specific state (for Himmel Park)
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  
  // Store progress grid for refresh functionality
  const [progressGridData, setProgressGridData] = useState<Awaited<ReturnType<typeof getProgressGrid>>>([]);
  
  // Refresh a single unlocked spot with a new random topic
  const handleRefreshSingleSpot = (spotId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the spot click
    if (!user?.id || progressGridData.length === 0) return;
    
    // Find the current spot to check if it's newProblemsOnly
    const currentSpot = spotsWithTopics.find(s => s.id === spotId);
    const isNewProblemsOnly = currentSpot?.newProblemsOnly === true;
    
    // Helper to count new problems (no progress)
    const countNewProblems = (group: typeof progressGridData[number]) => 
      group.problems.filter(p => p.progress === null).length;
    
    // Use appropriate filter based on spot type
    const topicsWithAvailable = isNewProblemsOnly
      ? progressGridData.filter(g => countNewProblems(g) > 0)
      : progressGridData.filter(g => g.masteredCount < g.totalCount);
    
    // Get topics that are already used by other spots (to avoid duplicates)
    const usedTopics = spotsWithTopics
      .filter(s => s.id !== spotId && !s.isRandom)
      .map(s => s.topic);
    
    // Filter out used topics
    const availableTopics = topicsWithAvailable.filter(t => !usedTopics.includes(t.groupName));
    
    if (availableTopics.length === 0) return;
    
    // Pick a random topic from available ones
    const randomTopic = availableTopics[Math.floor(Math.random() * availableTopics.length)];
    
    // Calculate remaining based on spot type
    const remaining = isNewProblemsOnly 
      ? countNewProblems(randomTopic) 
      : randomTopic.totalCount - randomTopic.masteredCount;
    
    // Update just this spot
    setSpotsWithTopics(prev => prev.map(spot => {
      if (spot.id === spotId) {
        return {
          ...spot,
          topic: randomTopic.groupName,
          topicDisplay: randomTopic.groupName,
          remaining
        };
      }
      return spot;
    }));
  };
  
  // Handle company selection for Himmel Park
  const handleCompanySelect = async (spotId: string, companyId: string, companyName: string) => {
    try {
      // Fetch problem count for this company (includes curated + custom questions)
      const count = await getCompanyProblemsCount(companyId, companyName, user?.id);
      
      // Update the spot with selected company
      setSpotsWithTopics(prev => prev.map(spot => {
        if (spot.id === spotId) {
          return {
            ...spot,
            selectedCompanyId: companyId,
            selectedCompanyName: companyName,
            topicDisplay: companyName,
            remaining: count
          };
        }
        return spot;
      }));
    } catch (error) {
      console.error('Error updating company selection:', error);
    }
  };
  
  // Load settings and assign topics to spots
  const loadSettingsAndTopics = React.useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoadingSpots(true);
    try {
      // Load settings
      const settings = await getSettingsWithDefaults(user.id);
      setStudySettings(settings);
      setSettingsForm({
        targetDays: settings.targetDays,
        dailyCap: settings.dailyCap,
        startDate: settings.startDate.toISOString().split('T')[0]  // YYYY-MM-DD format
      });
      
      // Load progress grid to get topics with remaining problems
      const progressGrid = await getProgressGrid(user.id);
      setProgressGridData(progressGrid);
      
      // Fetch due reviews count for Daily Commute spot
      const dueReviews = await fetchDueReviews(user.id);
      const dueReviewCount = dueReviews.length;
      
      // Fetch today's activity for daily new goal tracking (Coffee Sanctuary)
      const todayActivity = await fetchTodayActivity(user.id);
      const dailyNewCompleted = todayActivity?.problemsCount || 0;
      console.log('[LoadSpots] Today activity:', { 
        todayActivity, 
        dailyNewCompleted,
        problemsCompleted: todayActivity?.problemsCompleted,
        activityDate: todayActivity?.activityDate
      });
      
    // Get locked assignments from today
    const lockedAssignments = getLockedSpotAssignments(user.id);
    console.log('[LoadSpots] Raw locked assignments:', lockedAssignments);
    
    // Consider spots locked if they are non-random (Daily Commute and Coffee Sanctuary)
    // Random/mystery spots should never be locked
    const lockedOnly = lockedAssignments?.assignments.filter(a => {
      // Check if the spot is configured as non-random in POWER_SPOTS
      const spotConfig = POWER_SPOTS.find(s => s.id === a.spotId);
      return a.locked && spotConfig && !spotConfig.isRandom;
    }) || [];
    
    console.log('[LoadSpots] Filtered locked assignments:', lockedOnly);
      
      // Assign topics: locked spots keep their topics, unlocked spots get random topics
      const assignedSpots = assignTopicsToSpots(progressGrid, lockedOnly, dueReviewCount, dailyNewCompleted);
      console.log('[LoadSpots] Assigned spots:', assignedSpots.map(s => ({ id: s.id, name: s.name, topic: s.topic, locked: s.locked, dailyNewCompleted: s.dailyNewCompleted, dailyNewRemaining: s.dailyNewRemaining })));
      
      setSpotsWithTopics(assignedSpots);
    } catch (error) {
      console.error('Error loading spots with topics:', error);
    } finally {
      setIsLoadingSpots(false);
    }
  }, [user?.id]);

  // Initial load
  useEffect(() => {
    loadSettingsAndTopics();
  }, [loadSettingsAndTopics]);
  
  // Load companies for Himmel Park
  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const companiesData = await fetchCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };
    loadCompanies();
  }, []);
  
  // Auto-select first company for Himmel Park when companies load
  useEffect(() => {
    if (companies.length > 0 && spotsWithTopics.length > 0) {
      const himmelPark = spotsWithTopics.find(s => s.isCompanySpecific);
      if (himmelPark && !himmelPark.selectedCompanyId) {
        // Auto-select first company
        const firstCompany = companies[0];
        handleCompanySelect(himmelPark.id, firstCompany.id, firstCompany.name);
      }
    }
  }, [companies, spotsWithTopics]);

  // Reload when returning to locations
  useEffect(() => {
    if (step === 'locations') {
      loadSettingsAndTopics();
    }
  }, [step, loadSettingsAndTopics]);
  
  // Save settings handler
  const handleSaveSettings = async () => {
    if (!user?.id) return;
    
    const updated = await updateSettings(user.id, {
      targetDays: settingsForm.targetDays,
      dailyCap: settingsForm.dailyCap,
      startDate: new Date(settingsForm.startDate)  // Parse YYYY-MM-DD string to Date
    });
    
    if (updated) {
      setStudySettings(updated);
    }
    setShowSettings(false);
  };
  
  // Session Mode State - Paired (Explain → Teach) is the default for best learning
  const [sessionMode, setSessionMode] = useState<SessionMode>('paired');
  
  // Difficulty Mode State
  const [difficultyMode, setDifficultyMode] = useState<DifficultyMode>('standard');
  
  // Session State
  const [problemQueue, setProblemQueue] = useState<BlindProblem[]>([]);
  const [currentQueueIdx, setCurrentQueueIdx] = useState(0);
  const [sessionScore, setSessionScore] = useState(0); // How many cleared in THIS visit

  // Daily & Lifetime Stats - computed from saved reports
  const dailyStats = useMemo(() => getDailyStats(savedReports, 7), [savedReports]);
  const dailyCleared = useMemo(() => {
    const todayStr = getDateString(new Date());
    const counts = countQuestionsByDate(savedReports);
    return counts[todayStr] || 0;
  }, [savedReports]);
  
  const totalConquered = useMemo(() => {
    // Count all mastered questions from saved reports (uses same logic as countQuestionsByDate)
    const counts = countQuestionsByDate(savedReports);
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }, [savedReports]);

  // Analysis State (Explain mode)
  const [transcript, setTranscript] = useState("");
  const [rawTranscript, setRawTranscript] = useState("");
  const [aiReport, setAiReport] = useState<PerformanceReport | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [revealHintIdx, setRevealHintIdx] = useState(0);
  const [usedHints, setUsedHints] = useState(false); // Track if user requested any hints
  const [showDefinitionExpanded, setShowDefinitionExpanded] = useState(false); // Track if definition is expanded within pattern

  // Teaching Mode State
  const [teachingSession, setTeachingSession] = useState<TeachingSession | null>(null);
  const [juniorQuestion, setJuniorQuestion] = useState<string>("");
  const [teachingReport, setTeachingReport] = useState<TeachingReport | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isTeachingRecording, setIsTeachingRecording] = useState(false);
  const [teachingRawTranscript, setTeachingRawTranscript] = useState("");

  // Paired Flow State - Readiness to Teach (Pass 1)
  const [readinessReport, setReadinessReport] = useState<ReadinessReport | null>(null);
  const [explainTranscript, setExplainTranscript] = useState<string>("");

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef<boolean>(false); // Track recording state for speech recognition restart
  const isTeachingRecordingRef = useRef<boolean>(false); // Track teaching recording state
  
  // Time tracking - track when the current attempt started
  const problemStartTimeRef = useRef<number>(Date.now());
  
  // Helper to get elapsed time in seconds for current attempt
  const getElapsedSeconds = (): number => {
    return Math.round((Date.now() - problemStartTimeRef.current) / 1000);
  };
  
  // Helper to reset the timer (call when starting any new attempt)
  const resetProblemStartTime = () => {
    problemStartTimeRef.current = Date.now();
  };

  const currentProblem = problemQueue[currentQueueIdx];
  
  // Idle Session Timeout - auto-close after 20 minutes of inactivity
  const handleIdleTimeout = useCallback(() => {
    console.log('[IdleTimeout] Session closed due to inactivity');
    // Clean up any active recording
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    stopSpeaking();
    // Return to locations
    setStep('locations');
  }, []);
  
  // Only track idle time on steps where user input is expected (not loading/reveal screens)
  const isAwaitingUserInput = step === 'problem' || step === 'recording' || step === 'teaching' || step === 'junior_question';
  
  const {
    timeRemainingMs,
    isWarning: isIdleWarning,
    dismissWarning: dismissIdleWarning,
  } = useIdleSessionTimeout({
    timeoutMs: 20 * 60 * 1000, // 20 minutes
    onTimeout: handleIdleTimeout,
    enabled: isAwaitingUserInput,
    warningBeforeMs: 2 * 60 * 1000, // Warn 2 minutes before timeout
  });

  // Global progress (Hidden)
  const globalProgress = useMemo(() => {
    return Math.round((masteredIds.length / 75) * 100);
  }, [masteredIds]);

  // Current Pass Calculation (e.g., if you've done 80 problems, you're on your 2nd pass)
  const masteryCycle = useMemo(() => {
    return Math.floor(totalConquered / 75) + 1;
  }, [totalConquered]);

  useEffect(() => {
    return () => { 
      if (recognitionRef.current) recognitionRef.current.stop();
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    };
  }, []);

  // Handle "Teach Again" navigation from saved reports
  useEffect(() => {
    if (!teachAgainProblem) return;

    const loadProblemAndStartTeaching = async () => {
      setStep('curating');
      
      // Try to load the problem - for system coding questions, check custom_interview_questions first
      let problem: BlindProblem | null = null;
      
      if (isSystemCodingNavigation && user?.id) {
        // This is a system coding question - load from custom_interview_questions
        console.log('[TeachAgain] Loading system coding question:', teachAgainProblem);
        problem = await fetchSystemCodingQuestionByTitle(user.id, teachAgainProblem);
      }
      
      // Fall back to blind_problems if not found or not a system coding question
      if (!problem) {
        console.log('[TeachAgain] Loading from blind_problems:', teachAgainProblem);
        problem = await fetchBlindProblemByTitle(teachAgainProblem);
      }
      
      if (problem) {
        console.log('[TeachAgain] Problem loaded:', problem.title, 'formattedPrompt:', !!problem.formattedPrompt);
        // Set up the problem queue with just this one problem
        setProblemQueue([problem]);
        setCurrentQueueIdx(0);
        setSessionMode('teach'); // Go directly to teach mode
        
        // Initialize teaching session
        const session = createTeachingSession(problem.id);
        setTeachingSession(session);
        
        // Reset other state
        setReadinessReport(null);
        setExplainTranscript("");
        setTeachingReport(null);
        setTeachingRawTranscript("");
        setJuniorQuestion("");
        setRevealHintIdx(0);
        setShowDefinitionExpanded(false);
        setUsedHints(false);
        
        // Reset timer for this problem
        resetProblemStartTime();
        
        // Start teaching
        setStep('teaching');
      } else {
        // Problem not found, go back to locations
        console.error('Could not find problem:', teachAgainProblem);
        setStep('locations');
      }
      
      // Clear the navigation state to prevent re-triggering
      window.history.replaceState({}, document.title);
    };

    loadProblemAndStartTeaching();
  }, [teachAgainProblem, isSystemCodingNavigation, user?.id]);

  const handleStartRecording = async () => {
    setTranscript("");
    setRawTranscript("");
    setAiReport(null);
    setIsRecording(true);
    isRecordingRef.current = true; // Track in ref for onend handler
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.start();
    } catch (e) { console.error("Mic access failed", e); }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let current = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) current += event.results[i][0].transcript;
        }
        if (current) setRawTranscript(prev => prev + " " + current);
      };
      
      // Handle when recognition stops (browser timeout/silence detection)
      recognitionRef.current.onend = () => {
        // Auto-restart if still in recording mode (check ref, not state)
        if (isRecordingRef.current) {
          console.log('[Speech Recognition] Restarting after timeout...');
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('[Speech Recognition] Failed to restart:', e);
          }
        }
      };
      
      // Handle errors
      recognitionRef.current.onerror = (event: any) => {
        console.error('[Speech Recognition] Error:', event.error);
        // Don't restart on 'no-speech' or 'aborted' - user might have stopped intentionally
        if (event.error === 'network' || event.error === 'not-allowed') {
          console.error('[Speech Recognition] Critical error, cannot continue');
        }
      };
      
      recognitionRef.current.start();
    }
  };

  // Shared logic for processing explanation (used by both voice and text input)
  const processExplanation = async (text: string) => {
    if (!text.trim() || !currentProblem) return;
    
    // Set the transcript
    setRawTranscript(text);
    setTranscript(text);
    setExplainTranscript(text);
    
    // For paired mode, evaluate readiness to teach
    if (sessionMode === 'paired') {
      setStep('readiness_evaluating');
      
      try {
        // HINT PENALTY: If user used hints, they are automatically "not ready"
        if (usedHints) {
          const hintPenaltyReport: ReadinessReport = {
            readinessScore: 40,
            isReadyToTeach: false,
            checklist: {
              coreInsight: {
                present: false,
                quality: 'vague',
                feedback: 'You used hints during this section. Try to internalize the core insight before teaching.'
              },
              stateDefinition: {
                present: false,
                quality: 'hand-wavy',
                feedback: 'Hints were referenced. Practice explaining the state definition from memory.'
              },
              exampleWalkthrough: {
                present: false,
                quality: 'abstract',
                feedback: 'Work through examples without hints to build confidence.'
              },
              edgeCases: {
                mentioned: [],
                missing: ['All edge cases - hints were used'],
                feedback: 'Review edge cases without hints to solidify understanding.'
              },
              complexity: {
                timeMentioned: false,
                timeCorrect: false,
                spaceMentioned: false,
                spaceCorrect: false,
                feedback: 'Practice complexity analysis without referring to hints.'
              }
            },
            missingElements: [
              { element: 'No Hints', correctAnswer: 'Explain without using hints' },
              { element: 'Memory Recall', correctAnswer: 'Teachers explain from memory' },
              { element: 'Independence', correctAnswer: 'Try again without revealing hints' }
            ],
            strengthElements: [],
            suggestion: 'Go back and explain the solution without using any hints. A strong teacher can explain the concept from memory.'
          };
          setReadinessReport(hintPenaltyReport);
          
          // Save hint penalty readiness report
          const hintPenaltyPerformanceReport: PerformanceReport = {
            rating: hintPenaltyReport.readinessScore,
            summary: hintPenaltyReport.suggestion,
            suggestions: [],
            pronunciationFeedback: [],
            readinessReportData: hintPenaltyReport,
            readinessProblem: currentProblem,
            rawTranscript: text,
            refinedTranscript: text,
            timeSpentSeconds: getElapsedSeconds()
          };
          onSaveReport(currentProblem.title, 'readiness', hintPenaltyPerformanceReport);
          
          setStep('readiness_reveal');
          return;
        }
        
        // No hints used - proceed with AI evaluation
        const readiness = await evaluateReadinessToTeach(currentProblem, text);
        setReadinessReport(readiness);
        
        // Save readiness report
        const readinessPerformanceReport: PerformanceReport = {
          rating: readiness.readinessScore,
          summary: readiness.suggestion,
          suggestions: [],
          pronunciationFeedback: [],
          readinessReportData: readiness,
          readinessProblem: currentProblem,
          rawTranscript: text,
          refinedTranscript: text,
          timeSpentSeconds: getElapsedSeconds()
        };
        onSaveReport(currentProblem.title, 'readiness', readinessPerformanceReport);
        
        setStep('readiness_reveal');
      } catch (e) {
        console.error("Readiness evaluation failed", e);
        setStep('problem');
      }
      return;
    }
    
    // Standard explain mode - full analysis
    setStep('analyzing');
    setAnalysisPhase('evaluating');
    
    try {
      const report = await analyzeWalkieSession('', text, currentProblem);
      
      // Determine tier based on rating
      let score: 'good' | 'partial' | 'missed' = 
        report.rating >= 75 ? 'good' : 
        report.rating >= 70 ? 'partial' : 
        'missed';
      
      // Apply hint penalty
      if (usedHints && score === 'good') {
        score = 'partial';
      }
      report.detectedAutoScore = score;
      report.timeSpentSeconds = getElapsedSeconds();
      
      setAiReport(report);
      onSaveReport(currentProblem.title, 'walkie', report);
      
      // Increment questions answered for topic unlock tracking (Coffee Sanctuary)
      if (selectedSpot && user?.id) {
        incrementQuestionsAnswered(user.id, selectedSpot.id);
      }
      
      // Update spaced repetition progress with time tracking
      if (useSpacedRepetition && user?.id) {
        const existingProgress = await fetchUserProgressByTitle(user.id, currentProblem.title);
        const timeMinutes = Math.round(getElapsedSeconds() / 60);
        await updateProgressAfterAttempt(
          user.id,
          currentProblem.title,
          report.rating,
          currentProblem.difficulty,
          existingProgress,
          timeMinutes
        );
      }
      
      if (score === 'good') {
        onMastered(currentProblem.title);
        setSessionScore(prev => prev + 1);
      }
      
      setStep('reveal');
    } catch (e) {
      console.error("AI Analysis failed", e);
      setStep('reveal');
    }
  };

  // Handle text submission for explain/problem step
  const handleTextSubmit = (text: string) => {
    processExplanation(text);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    isRecordingRef.current = false;
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        // Use the shared processing logic with the recorded transcript
        await processExplanation(rawTranscript);
      };
      mediaRecorderRef.current.stop();
    }
  };

  const handleContinue = () => {
    if (!aiReport) return;
    const score = aiReport.detectedAutoScore || 'partial';

    if (score !== 'good') {
      const remainingQueue = [...problemQueue];
      remainingQueue.push(currentProblem);
      setProblemQueue(remainingQueue);
    }

    if (currentQueueIdx < problemQueue.length - 1) {
      setCurrentQueueIdx(prev => prev + 1);
      setStep('problem');
      setRevealHintIdx(0);
      setShowDefinitionExpanded(false);
      setUsedHints(false); // Reset hint usage for next problem
      setTranscript("");
      setRawTranscript("");
    } else {
      setStep('locations');
    }
  };

  const startSpotSession = async (spot: SpotWithTopic) => {
    // For company-specific spots (Himmel Park), ensure a company is selected
    if (spot.isCompanySpecific) {
      if (!spot.selectedCompanyId) {
        console.warn('[StartSession] No company selected for Himmel Park');
        return; // Company selection should happen in LocationsStep
      }
      setSelectedCompany(companies.find(c => c.id === spot.selectedCompanyId) || null);
    }
    
    // For Daily Commute (reviews only), default to teach mode
    // Since these are problems the user has already learned, teaching is the best way to solidify knowledge
    if (spot.onlyReviews) {
      setSessionMode('teach');
    }
    
    // Set the selected topic for this session
    setSelectedTopic(spot.topic);
    setSelectedSpot(spot);
    setStep('curating');
    
    // Lock this spot's topic for non-random spots (Daily Commute and Coffee Sanctuary)
    // This ensures the topic persists when the page is refreshed
    // Users can still manually refresh a spot's topic before entering using the refresh button
    console.log('[StartSession] Spot:', { id: spot.id, name: spot.name, topic: spot.topic, isRandom: spot.isRandom, isCompanySpecific: spot.isCompanySpecific });
    if (!spot.isRandom && !spot.isCompanySpecific && user?.id) {
      console.log('[StartSession] Locking spot', spot.id, 'with topic', spot.topic);
      lockSpotAssignment(user.id, spot.id, spot.topic, spot.topicDisplay);
      
      // Update local state to reflect the lock
      setSpotsWithTopics(prev => prev.map(s => 
        s.id === spot.id ? { ...s, locked: true } : s
      ));
    }
    
    try {
        let problems: BlindProblem[] = [];
        
        // For company-specific spots, use company problem queue + custom questions
        if (spot.isCompanySpecific && spot.selectedCompanyId) {
          const batchSize = 10; // All problems for the company
          const curatedProblems = await buildCompanyProblemQueue(spot.selectedCompanyId, batchSize);
          console.log(`[Company Session] Loaded ${curatedProblems.length} curated problems for company ${spot.selectedCompanyName}`);
          
          // Also fetch custom questions for this company (if user is logged in)
          let customQuestions: BlindProblem[] = [];
          if (user?.id && spot.selectedCompanyName) {
            customQuestions = await fetchCustomQuestionsForCompany(user.id, spot.selectedCompanyName);
            console.log(`[Company Session] Loaded ${customQuestions.length} custom questions for company ${spot.selectedCompanyName}`);
          }
          
          // Merge: custom questions first (for practice priority), then curated
          problems = [...customQuestions, ...curatedProblems];
        } else {
          // Normal flow for other spots
          // Calculate remaining problems for today's goal
          const dailyGoal = studySettings?.dailyCap || DEFAULT_SETTINGS.dailyCap;
          const completedToday = dailyCleared;
          const remainingToday = Math.max(0, dailyGoal - completedToday);
          
          // Cap batch size at remaining daily goal or a reasonable max
          const batchSize = Math.min(remainingToday, 10);
        
        if (batchSize === 0) {
            console.log('[Session] Daily goal already reached!');
            setStep('locations');
            return;
        }
        
        // Use spaced repetition queue if enabled and user is logged in
        if (useSpacedRepetition && user?.id) {
            // For random/mystery spot, don't pass a topic filter - get mixed problems
            // For reviews priority spot, pass the flag to include ALL reviews first
            // For new problems only spot (Coffee Sanctuary), exclude reviews
            const topicFilter = spot.isRandom ? undefined : spot.topic;
            const { queue, stats } = await buildSpacedRepetitionQueue(
                user.id, 
                topicFilter, 
                spot.reviewsPriority,
                spot.onlyReviews,
                spot.newProblemsOnly
            );
            problems = queue.slice(0, batchSize);
            setStudyStats(stats);
            const mode = spot.newProblemsOnly ? 'NEW PROBLEMS ONLY' : (spot.onlyReviews ? 'ONLY REVIEWS' : (spot.reviewsPriority ? 'REVIEWS PRIORITY' : (spot.isRandom ? 'RANDOM/MIXED' : spot.topic)));
            console.log(`[Spaced Repetition] Mode: ${mode}, Queue:`, problems.map(p => p.title));
        } else {
            // Fallback to original queue building (no topic filter)
            const allowedDifficulties = DIFFICULTY_MAP[difficultyMode];
            problems = await buildProblemQueue(masteredIds, allowedDifficulties, batchSize);
        }
        } // End of non-company-specific flow
        
        if (problems.length === 0) {
            console.warn("No problems found for queue in topic:", spot.topic);
            
            // If this is an "only reviews" spot (like Daily Commute), don't fallback to new problems
            // This prevents showing new problems in Daily Commute when there are no reviews due
            if (spot.onlyReviews) {
                console.log('[Session] No reviews due - Daily Commute is clear!');
                // Show a message that there are no reviews due
                alert('🎉 No reviews due today! Check back tomorrow or practice new problems in Coffee Sanctuary.');
                setStep('locations');
                return;
            }
            
            // Fallback: try fetching without topic filter (only for non-onlyReviews spots)
            const allowedDifficulties = DIFFICULTY_MAP[difficultyMode];
            const fallbackProblems = await buildProblemQueue(masteredIds, allowedDifficulties, batchSize);
            if (fallbackProblems.length === 0) {
                console.error("No problems available in database");
                setStep('locations');
                return;
            }
            problems = fallbackProblems;
        }
        
        setProblemQueue(problems);
        setCurrentQueueIdx(0);
        setSessionScore(0);
        
        // Reset state for new session
        setReadinessReport(null);
        setExplainTranscript("");
        setTeachingSession(null);
        setTeachingReport(null);
        setRevealHintIdx(0);
        setShowDefinitionExpanded(false);
        setUsedHints(false);
        setTranscript("");
        setRawTranscript("");
        
        // Reset timer when starting a new problem
        resetProblemStartTime();
        
        // Initialize based on session mode
        if (sessionMode === 'teach') {
            // Direct teach mode - skip explain step
            const firstProblem = problems.length > 0 ? problems[0] : null;
            if (firstProblem) {
                setTeachingSession(createTeachingSession(firstProblem.id));
                setJuniorQuestion("");
                setTeachingRawTranscript("");
            }
            setStep('teaching');
        } else {
            // Paired mode or Explain mode - start with problem/explain step
            setStep('problem');
        }
    } catch (e) {
        console.error("Curating failed", e);
        setStep('locations');
    }
  };

  // Handler for continuing from readiness reveal to teaching (paired mode)
  const handleContinueToTeach = () => {
    if (!currentProblem) return;
    
    // Initialize teaching session for the SAME problem
    setTeachingSession(createTeachingSession(currentProblem.id));
    setJuniorQuestion("");
    setTeachingReport(null);
    setTeachingRawTranscript("");
    setStep('teaching');
  };

  // Handler for trying again (re-explain before teaching)
  const handleTryExplainAgain = () => {
    setReadinessReport(null);
    setExplainTranscript("");
    setRawTranscript("");
    setTranscript("");
    // Reset hints - user should try without hints this time
    setRevealHintIdx(0);
    setShowDefinitionExpanded(false);
    setUsedHints(false);
    // Reset timer for fresh attempt
    resetProblemStartTime();
    setStep('problem');
  };

  // Teaching Mode Handlers
  const handleStartTeachingRecording = async () => {
    setTeachingRawTranscript("");
    setIsTeachingRecording(true);
    isTeachingRecordingRef.current = true; // Track in ref for onend handler
    stopSpeaking(); // Stop any TTS in progress

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let current = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) current += event.results[i][0].transcript;
        }
        if (current) setTeachingRawTranscript(prev => prev + " " + current);
      };
      
      // Handle when recognition stops (browser timeout/silence detection)
      recognitionRef.current.onend = () => {
        // Auto-restart if still in recording mode (check ref, not state)
        if (isTeachingRecordingRef.current) {
          console.log('[Teaching Speech Recognition] Restarting after timeout...');
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('[Teaching Speech Recognition] Failed to restart:', e);
          }
        }
      };
      
      // Handle errors
      recognitionRef.current.onerror = (event: any) => {
        console.error('[Teaching Speech Recognition] Error:', event.error);
        // Don't restart on 'no-speech' or 'aborted' - user might have stopped intentionally
        if (event.error === 'network' || event.error === 'not-allowed') {
          console.error('[Teaching Speech Recognition] Critical error, cannot continue');
        }
      };
      
      recognitionRef.current.start();
    }
  };

  // Shared logic for processing a teaching turn (used by both voice and text input)
  const processTeachingTurn = async (text: string) => {
    if (!text.trim() || !currentProblem || !teachingSession) return;
    
    setStep('junior_thinking');
    
    try {
      // Add the text as a turn
      const updatedSession = addTurn(teachingSession, 'teacher', text, text);
      setTeachingSession(updatedSession);
      
      // Get junior's response
      const { response, newState, isComplete } = await getJuniorResponse(
        currentProblem,
        updatedSession.turns,
        updatedSession.juniorState
      );
      
      // Add junior's response to session
      const sessionWithJunior = addTurn(
        updateJuniorState(updatedSession, newState),
        'junior',
        response
      );
      setTeachingSession(sessionWithJunior);
      setJuniorQuestion(response);
      
      if (isComplete || newState.readyToSummarize) {
        // Junior is ready to summarize
        setStep('junior_summarizing');
        const summary = await getJuniorSummary(currentProblem, sessionWithJunior.turns);
        const finalSession = setJuniorSummary(sessionWithJunior, summary);
        setTeachingSession(finalSession);
        
        // Now have Dean evaluate
        setStep('dean_evaluating');
        const report = await evaluateTeaching(currentProblem, finalSession);
        setTeachingReport(report);
        
        // Save the teaching report
        const performanceReport: PerformanceReport = {
          rating: report.teachingScore,
          summary: `Teaching evaluation: ${report.studentOutcome === 'can_implement' ? 'Student can implement' : report.studentOutcome === 'conceptual_only' ? 'Conceptual understanding only' : 'Student still confused'}`,
          suggestions: report.topGaps,
          pronunciationFeedback: [],
          detailedFeedback: report.evidenceNotes.map((note, idx) => ({
            category: 'Teaching',
            issue: note,
            instance: '',
            rewrite: idx === 0 ? report.concreteImprovement : '',
            explanation: ''
          })),
          teachingReportData: report,
          teachingSession: updatedSession,
          juniorSummary: finalSession.juniorSummary,
          teachingProblem: currentProblem,
          timeSpentSeconds: getElapsedSeconds()
        };
        onSaveReport(currentProblem.title, 'teach', performanceReport);
        
        // Increment questions answered for topic unlock tracking (Coffee Sanctuary)
        if (selectedSpot && user?.id) {
          incrementQuestionsAnswered(user.id, selectedSpot.id);
        }
        
        // Update spaced repetition progress with time tracking
        if (useSpacedRepetition && user?.id) {
          const existingProgress = await fetchUserProgressByTitle(user.id, currentProblem.title);
          const timeMinutes = Math.round(getElapsedSeconds() / 60);
          await updateProgressAfterAttempt(
            user.id,
            currentProblem.title,
            report.teachingScore,
            currentProblem.difficulty,
            existingProgress,
            timeMinutes
          );
        }
        
        // Mark as mastered if student can implement AND teaching score >= 75
        if (report.studentOutcome === 'can_implement' && report.teachingScore >= 75) {
          onMastered(currentProblem.title);
          setSessionScore(prev => prev + 1);
        }
        
        setStep('teaching_reveal');
      } else {
        // Continue teaching
        setStep('junior_question');
        
        // Optionally speak the question
        if (ttsEnabled) {
          speakJuniorResponse(response);
        }
      }
    } catch (e) {
      console.error("Teaching response failed", e);
      setStep('teaching');
    }
  };

  // Handle text submission for teaching step
  const handleTeachingTextSubmit = (text: string) => {
    processTeachingTurn(text);
  };

  const handleStopTeachingRecording = async () => {
    setIsTeachingRecording(false);
    isTeachingRecordingRef.current = false;
    if (recognitionRef.current) recognitionRef.current.stop();
    
    if (!teachingRawTranscript.trim()) return;
    
    // Use the shared processing logic with the recorded transcript
    await processTeachingTurn(teachingRawTranscript);
    setTeachingRawTranscript("");
  };

  const handleEndTeachingSession = async () => {
    if (!currentProblem || !teachingSession) return;
    
    setStep('junior_summarizing');
    
    try {
      // Generate junior's summary even if not "ready"
      const summary = await getJuniorSummary(currentProblem, teachingSession.turns);
      const finalSession = setJuniorSummary(teachingSession, summary);
      setTeachingSession(finalSession);
      
      // Have Dean evaluate
      setStep('dean_evaluating');
      const report = await evaluateTeaching(currentProblem, finalSession);
      setTeachingReport(report);
      
      // Save the teaching report as a PerformanceReport-compatible format
      // Include full teaching report data for proper viewing later
      const performanceReport: PerformanceReport = {
        rating: report.teachingScore,
        summary: `Teaching evaluation: ${report.studentOutcome === 'can_implement' ? 'Student can implement' : report.studentOutcome === 'conceptual_only' ? 'Conceptual understanding only' : 'Student still confused'}`,
        suggestions: report.topGaps,
        pronunciationFeedback: [],
        detailedFeedback: report.evidenceNotes.map((note, idx) => ({
          category: 'Teaching',
          issue: note,
          instance: '',
          rewrite: idx === 0 ? report.concreteImprovement : '',
          explanation: ''
        })),
        teachingReportData: report,
        teachingSession: finalSession,  // Include the full dialog
        juniorSummary: finalSession.juniorSummary,
        teachingProblem: currentProblem,  // Include problem for model answer display
        timeSpentSeconds: getElapsedSeconds()
      };
      onSaveReport(currentProblem.title, 'teach', performanceReport);
      
      // Increment questions answered for topic unlock tracking (Coffee Sanctuary)
      if (selectedSpot && user?.id) {
        incrementQuestionsAnswered(user.id, selectedSpot.id);
      }
      
      // Update spaced repetition progress (use teaching score as rating) with time tracking
      if (useSpacedRepetition && user?.id) {
        const existingProgress = await fetchUserProgressByTitle(user.id, currentProblem.title);
        const timeMinutes = Math.round(getElapsedSeconds() / 60);
        await updateProgressAfterAttempt(
          user.id,
          currentProblem.title,
          report.teachingScore,
          currentProblem.difficulty,
          existingProgress,
          timeMinutes
        );
      }
      
      // Mark as mastered if student can implement AND teaching score >= 75
      // This ensures both good outcome AND quality teaching
      if (report.studentOutcome === 'can_implement' && report.teachingScore >= 75) {
        onMastered(currentProblem.title);
        setSessionScore(prev => prev + 1);
      }
      
      setStep('teaching_reveal');
    } catch (e) {
      console.error("End teaching session failed", e);
      setStep('locations');
    }
  };

  const handleTeachingContinue = () => {
    // Move to next problem or back to locations
    if (currentQueueIdx < problemQueue.length - 1) {
      const nextIdx = currentQueueIdx + 1;
      setCurrentQueueIdx(nextIdx);
      
      // Reset state for next problem
      setReadinessReport(null);
      setExplainTranscript("");
      setTeachingSession(null);
      setTeachingReport(null);
      setTeachingRawTranscript("");
      setJuniorQuestion("");
      setRevealHintIdx(0);
      setShowDefinitionExpanded(false);
      setUsedHints(false);
      setTranscript("");
      setRawTranscript("");
      
      // Reset timer for the new problem
      resetProblemStartTime();
      
      if (sessionMode === 'paired') {
        // Paired mode: go back to explain step for next problem
        setStep('problem');
      } else {
        // Direct teach mode: go straight to teaching
        const nextProblem = problemQueue[nextIdx];
        setTeachingSession(createTeachingSession(nextProblem.id));
        setStep('teaching');
      }
    } else {
      setStep('locations');
    }
  };

  // Handler for trying teaching again (re-teach the same problem)
  const handleTryTeachAgain = () => {
    if (!currentProblem) return;
    
    // Reset teaching session state for a fresh attempt
    setTeachingSession(createTeachingSession(currentProblem.id));
    setTeachingReport(null);
    setTeachingRawTranscript("");
    setJuniorQuestion("");
    // Reset timer for fresh teaching attempt
    resetProblemStartTime();
    setStep('teaching');
  };

  // Handler for re-evaluating the teaching session with updated prompts/data
  const handleReEvaluate = async () => {
    if (!currentProblem || !teachingSession) return;
    
    setIsProcessing(true);
    setStatusMessage("Re-evaluating with updated prompts and data...");
    
    try {
      // Fetch fresh problem data from database (includes updated key_idea, steps, etc.)
      const { data: freshProblem, error } = await supabase
        .from('blind_problems')
        .select('*')
        .eq('id', currentProblem.id)
        .single();
      
      if (error) throw error;
      
      // Convert database format to BlindProblem type (casting through any to resolve type issues with never)
      const freshProblemAny = freshProblem as any;
      const updatedProblem: BlindProblem = {
        id: freshProblemAny.id,
        title: freshProblemAny.title,
        prompt: freshProblemAny.prompt,
        example: freshProblemAny.example,
        constraints: freshProblemAny.constraints,
        pattern: freshProblemAny.pattern,
        keyIdea: freshProblemAny.key_idea,
        detailedHint: freshProblemAny.detailed_hint,
        definition: freshProblemAny.definition,
        skeleton: freshProblemAny.skeleton,
        timeComplexity: freshProblemAny.time_complexity,
        spaceComplexity: freshProblemAny.space_complexity,
        steps: freshProblemAny.steps,
        expectedEdgeCases: freshProblemAny.expected_edge_cases,
        topics: freshProblemAny.topics,
        difficulty: freshProblemAny.difficulty,
        problemGroup: freshProblemAny.problem_group,
        leetcodeNumber: freshProblemAny.leetcode_number,
        mnemonicImageUrl: freshProblemAny.mnemonic_image_url
      };
      
      // Re-run the Dean evaluation with fresh data
      const newReport = await evaluateTeaching(updatedProblem, teachingSession);
      
      setTeachingReport(newReport);
      setStatusMessage("Re-evaluation complete!");
      
      setTimeout(() => {
        setStatusMessage("");
      }, 2000);
    } catch (error) {
      console.error('Re-evaluation error:', error);
      setStatusMessage("Re-evaluation failed. Check console for details.");
      setTimeout(() => {
        setStatusMessage("");
      }, 3000);
    } finally {
      setIsProcessing(false);
    }
  };


  if (step === 'locations') {
    return (
      <LocationsStep
        onHome={onHome}
        studySettings={studySettings}
        studyStats={studyStats}
        dailyCleared={dailyCleared}
        globalProgress={globalProgress}
        totalConquered={totalConquered}
        masteryCycle={masteryCycle}
        dailyStats={dailyStats}
        masteredIds={masteredIds}
        sessionMode={sessionMode}
        setSessionMode={setSessionMode}
        difficultyMode={difficultyMode}
        setDifficultyMode={setDifficultyMode}
        spotsWithTopics={spotsWithTopics}
        isLoadingSpots={isLoadingSpots}
        startSpotSession={startSpotSession}
        handleRefreshSingleSpot={handleRefreshSingleSpot}
        companies={companies}
        isLoadingCompanies={isLoadingCompanies}
        onCompanySelect={handleCompanySelect}
        showStats={showStats}
        setShowStats={setShowStats}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settingsForm={settingsForm}
        setSettingsForm={setSettingsForm}
        handleSaveSettings={handleSaveSettings}
        useSpacedRepetition={useSpacedRepetition}
        setUseSpacedRepetition={setUseSpacedRepetition}
      />
    );
  }

  if (step === 'curating') {
    const modeLabel = difficultyMode === 'warmup' ? 'easy' : difficultyMode === 'standard' ? 'easy + medium' : 'all';
    return <CuratingStep spotName={selectedSpot?.name} modeLabel={modeLabel} />;
  }

  if (step === 'analyzing') {
    return <AnalyzingStep phase={analysisPhase} />;
  }

  // Readiness evaluation loading screen (paired mode)
  if (step === 'readiness_evaluating') {
    return <ReadinessEvaluatingStep />;
  }

  // Readiness reveal screen (paired mode - Pass 1 complete)
  if (step === 'readiness_reveal' && readinessReport && currentProblem) {
    return (
      <ReadinessRevealStep
        readinessReport={readinessReport}
        currentProblem={currentProblem}
              rawTranscript={rawTranscript}
        explainTranscript={explainTranscript}
        dailyCleared={dailyCleared}
        dailyCap={studySettings?.dailyCap || DEFAULT_SETTINGS.dailyCap}
        onHome={onHome}
        handleContinueToTeach={handleContinueToTeach}
        handleTryAgain={handleTryExplainAgain}
      />
    );
  }

  if (step === 'problem' || step === 'recording') {
    return (
      <>
        <ProblemStep
          step={step}
          currentProblem={currentProblem}
          selectedSpot={selectedSpot}
          sessionMode={sessionMode}
          dailyCleared={dailyCleared}
          dailyCap={studySettings?.dailyCap || DEFAULT_SETTINGS.dailyCap}
          rawTranscript={rawTranscript}
          revealHintIdx={revealHintIdx}
          showDefinitionExpanded={showDefinitionExpanded}
          setStep={setStep}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          handleTextSubmit={handleTextSubmit}
          setRevealHintIdx={setRevealHintIdx}
          setUsedHints={setUsedHints}
          setShowDefinitionExpanded={setShowDefinitionExpanded}
        />
        {isIdleWarning && (
          <IdleTimeoutWarning
            timeRemainingMs={timeRemainingMs}
            onDismiss={dismissIdleWarning}
            onEndSession={handleIdleTimeout}
          />
        )}
      </>
    );
  }

  if (step === 'reveal' && aiReport) {
    return (
      <RevealStep
        currentProblem={currentProblem}
        aiReport={aiReport}
                   transcript={transcript}
        usedHints={usedHints}
                   isSaved={isSaved}
        currentQueueIdx={currentQueueIdx}
        problemQueueLength={problemQueue.length}
        onHome={onHome}
                   onToggleSave={onToggleSave}
        handleContinue={handleContinue}
                />
    );
  }

  // ============================================================
  // TEACHING MODE UI
  // ============================================================

  // Teaching conversation screen (including junior thinking state shown inline)
  if (step === 'teaching' || step === 'junior_question' || step === 'junior_thinking') {
    return (
      <>
        <TeachingStep
          step={step}
          currentProblem={currentProblem}
          teachingSession={teachingSession}
          sessionMode={sessionMode}
          currentQueueIdx={currentQueueIdx}
          isTeachingRecording={isTeachingRecording}
          teachingRawTranscript={teachingRawTranscript}
          ttsEnabled={ttsEnabled}
          isJuniorThinking={step === 'junior_thinking'}
          setStep={setStep}
          setTtsEnabled={setTtsEnabled}
          handleStartTeachingRecording={handleStartTeachingRecording}
          handleStopTeachingRecording={handleStopTeachingRecording}
          handleTeachingTextSubmit={handleTeachingTextSubmit}
          handleEndTeachingSession={handleEndTeachingSession}
          speakJuniorResponse={speakJuniorResponse}
        />
        {isIdleWarning && (
          <IdleTimeoutWarning
            timeRemainingMs={timeRemainingMs}
            onDismiss={dismissIdleWarning}
            onEndSession={handleIdleTimeout}
          />
        )}
      </>
    );
  }

  // Junior summarizing screen
  if (step === 'junior_summarizing') {
    return <JuniorSummarizingStep />;
  }

  // Dean evaluating screen
  if (step === 'dean_evaluating') {
    return <DeanEvaluatingStep />;
  }

  // Teaching reveal/report screen
  if (step === 'teaching_reveal' && teachingReport && teachingSession) {
    return (
      <TeachingRevealStep
        currentProblem={currentProblem}
        teachingReport={teachingReport}
              teachingSession={teachingSession}
        currentQueueIdx={currentQueueIdx}
        problemQueueLength={problemQueue.length}
        onHome={onHome}
        handleTeachingContinue={handleTeachingContinue}
        handleTryAgain={handleTryTeachAgain}
        handleReEvaluate={handleReEvaluate}
      />
    );
  }

  return null;
};

export default WalkieTalkieView;
