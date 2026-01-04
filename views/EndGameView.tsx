/**
 * EndGameView - The Grand Finale Mock Onsite Simulation
 * 
 * Chains 5 interview rounds into a continuous sequence:
 * 1. Behavioral (Arena - The Skeptic)
 * 2. ML Deep Dive (Arena - Sifu)
 * 3. LeetCode Coding (WalkieTalkie - Dean)
 * 4. System Coding (WalkieTalkie - Dean)
 * 5. ML System Design (Placeholder - Dean)
 * 
 * After all rounds complete, displays a Hiring Committee verdict.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Crown, 
  ArrowRight, 
  Loader2, 
  Trophy, 
  XCircle, 
  AlertTriangle,
  Home,
  Save,
  CheckCircle2
} from 'lucide-react';
import { 
  PerformanceReport, 
  SavedItem, 
  EndGameRoundResult, 
  EndGameRoundConfig,
  HiringCommitteeVerdict,
  ArenaQuestion,
  Problem,
  BehavioralQuestion
} from '../types';
import { evaluateHiringCommittee } from '../services/analysisService';
import { fetchLeetcodeProblems, fetchBehavioralQuestions, toArenaQuestion } from '../services/databaseService';
import ArenaView from './ArenaView';
import WalkieTalkieView from './WalkieTalkieView';
import { PlaceholderRound } from '../components/steps';

// Fallback questions in case database is empty or unavailable
const FALLBACK_BEHAVIORAL: ArenaQuestion = { 
  id: 'fallback_behavioral', 
  title: 'Tell Me About a Challenge', 
  context: 'Describe a significant technical or leadership challenge you faced and how you overcame it.',
  probingPrompt: 'Evaluate the depth of problem-solving, ownership, and the clarity of the STAR framework.' 
};

const FALLBACK_ML_DEEP_DIVE: ArenaQuestion = { 
  id: 'fallback_ml', 
  title: 'ML System Design Trade-offs', 
  context: 'Walk me through a machine learning system you designed. What trade-offs did you make and why?',
  probingPrompt: 'Probe for depth on feature engineering, model selection, evaluation metrics, and production considerations.' 
};

// Round configuration - hardcoded sequence
const ROUNDS: EndGameRoundConfig[] = [
  { component: 'arena', mode: 'behavioral', persona: 'The Skeptic', title: 'Behavioral Round' },
  { component: 'arena', mode: 'ml_deep_dive', persona: 'Sifu', title: 'ML Deep Dive' },
  { component: 'walkie', mode: 'leetcode', judge: 'Dean', title: 'LeetCode Coding' },
  { component: 'walkie', mode: 'system_coding', judge: 'Dean', title: 'System Coding' },
  { component: 'placeholder', mode: 'ml_system_design', judge: 'Dean', title: 'ML System Design' }
];

interface EndGameViewProps {
  onHome: (force: boolean) => void;
  onSaveReport: (title: string, type: 'end-game', report: PerformanceReport) => void;
  isSaved: (title: string, content: string) => boolean;
  onToggleSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  masteredIds: string[];
  onMastered: (id: string) => void;
  savedReports: any[];
}

type SimulationState = 'warning' | 'running' | 'evaluating' | 'verdict';

const EndGameView: React.FC<EndGameViewProps> = ({
  onHome,
  onSaveReport,
  isSaved,
  onToggleSave,
  masteredIds,
  onMastered,
  savedReports
}) => {
  // Simulation state
  const [simulationState, setSimulationState] = useState<SimulationState>('warning');
  const [currentRound, setCurrentRound] = useState(0);
  const [accumulatedReports, setAccumulatedReports] = useState<EndGameRoundResult[]>([]);
  const [verdict, setVerdict] = useState<HiringCommitteeVerdict | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  
  // Pre-selected questions/problems for each round
  const [behavioralQuestion, setBehavioralQuestion] = useState<ArenaQuestion | null>(null);
  const [mlDeepDiveQuestion, setMlDeepDiveQuestion] = useState<ArenaQuestion | null>(null);
  const [leetcodeProblem, setLeetcodeProblem] = useState<Problem | null>(null);
  const [systemCodingProblem, setSystemCodingProblem] = useState<Problem | null>(null);
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);

  // Handle round completion - called by child components
  const handleRoundComplete = useCallback((report: PerformanceReport) => {
    const roundConfig = ROUNDS[currentRound];
    
    // Add to accumulated reports
    const newResult: EndGameRoundResult = {
      round: roundConfig.title,
      report
    };
    
    setAccumulatedReports(prev => [...prev, newResult]);
    
    // Check if all rounds complete
    if (currentRound >= ROUNDS.length - 1) {
      // All rounds done - move to evaluation
      setSimulationState('evaluating');
      evaluateAllRounds([...accumulatedReports, newResult]);
    } else {
      // Move to next round
      setCurrentRound(prev => prev + 1);
    }
  }, [currentRound, accumulatedReports]);

  // Evaluate all rounds and get verdict
  const evaluateAllRounds = async (reports: EndGameRoundResult[]) => {
    try {
      const result = await evaluateHiringCommittee(reports);
      setVerdict(result);
      setSimulationState('verdict');
    } catch (error) {
      console.error('Failed to evaluate hiring committee:', error);
      // Show a fallback verdict on error
      setVerdict({
        verdict: 'NO HIRE',
        level: 'N/A',
        debriefSummary: 'An error occurred during evaluation. Please try the simulation again.',
        primaryBlocker: 'Technical error during evaluation'
      });
      setSimulationState('verdict');
    }
  };

  // Start the simulation - pre-select all questions and problems
  const handleStartSimulation = async () => {
    console.log('[EndGame] handleStartSimulation - STARTING');
    setIsLoadingProblems(true);
    
    try {
      // Fetch all data in parallel - with individual error handling
      console.log('[EndGame] handleStartSimulation - Fetching from database...');
      
      let allProblems: Problem[] = [];
      let behavioralQuestions: BehavioralQuestion[] = [];
      let mlDeepDiveQuestions: BehavioralQuestion[] = [];
      
      // Fetch with individual try-catch to handle missing tables
      try {
        allProblems = await fetchLeetcodeProblems();
        console.log('[EndGame] Fetched leetcode problems:', allProblems.length);
      } catch (e) {
        console.warn('[EndGame] Failed to fetch leetcode problems:', e);
      }
      
      try {
        behavioralQuestions = await fetchBehavioralQuestions('behavioral');
        console.log('[EndGame] Fetched behavioral questions:', behavioralQuestions.length);
      } catch (e) {
        console.warn('[EndGame] Failed to fetch behavioral questions (table may not exist):', e);
      }
      
      try {
        mlDeepDiveQuestions = await fetchBehavioralQuestions('ml_deep_dive');
        console.log('[EndGame] Fetched ML deep dive questions:', mlDeepDiveQuestions.length);
      } catch (e) {
        console.warn('[EndGame] Failed to fetch ML deep dive questions:', e);
      }
      
      // Filter for LeetCode problems (non-system coding)
      const leetcodeProblems = allProblems.filter((p: Problem) => !p.isSystemCoding);
      // Filter for System Coding problems
      const systemCodingProblems = allProblems.filter((p: Problem) => p.isSystemCoding);
      
      // Randomly select behavioral question (from DB or fallback)
      const randomBehavioral: ArenaQuestion = behavioralQuestions.length > 0
        ? toArenaQuestion(behavioralQuestions[Math.floor(Math.random() * behavioralQuestions.length)])
        : FALLBACK_BEHAVIORAL;
      
      // Randomly select ML deep dive question (from DB or fallback)
      const randomMLDeepDive: ArenaQuestion = mlDeepDiveQuestions.length > 0
        ? toArenaQuestion(mlDeepDiveQuestions[Math.floor(Math.random() * mlDeepDiveQuestions.length)])
        : FALLBACK_ML_DEEP_DIVE;
      
      // Randomly select coding problems
      const randomLeetcode = leetcodeProblems.length > 0 
        ? leetcodeProblems[Math.floor(Math.random() * leetcodeProblems.length)]
        : null;
      const randomSystemCoding = systemCodingProblems.length > 0
        ? systemCodingProblems[Math.floor(Math.random() * systemCodingProblems.length)]
        : null;
      
      console.log('[EndGame] handleStartSimulation - Selected questions/problems:', {
        behavioral: randomBehavioral.title,
        mlDeepDive: randomMLDeepDive.title,
        leetcode: randomLeetcode?.title,
        systemCoding: randomSystemCoding?.title,
        behavioralQuestionsInDB: behavioralQuestions.length,
        mlDeepDiveQuestionsInDB: mlDeepDiveQuestions.length,
        usingFallbackBehavioral: behavioralQuestions.length === 0,
        usingFallbackML: mlDeepDiveQuestions.length === 0
      });
      
      // Set all state SYNCHRONOUSLY before changing simulation state
      console.log('[EndGame] handleStartSimulation - Setting all state...');
      setBehavioralQuestion(randomBehavioral);
      setMlDeepDiveQuestion(randomMLDeepDive);
      setLeetcodeProblem(randomLeetcode);
      setSystemCodingProblem(randomSystemCoding);
      setCurrentRound(0);
      setAccumulatedReports([]);
      setVerdict(null);
      setHasSaved(false);
      setIsLoadingProblems(false);
      setSimulationState('running');
      console.log('[EndGame] handleStartSimulation - DONE, simulationState set to running');
      
    } catch (error) {
      console.error('[EndGame] handleStartSimulation - FAILED:', error);
      alert('Failed to load problems. Please try again.');
      setIsLoadingProblems(false);
    }
  };

  // Exit to dashboard
  const handleExit = (force: boolean = false) => {
    if (!force && simulationState === 'running' && accumulatedReports.length > 0) {
      if (!window.confirm('Exit simulation? Your progress will be lost.')) {
        return;
      }
    }
    onHome(true);
  };

  // Save the end game report
  const handleSaveToHistory = async () => {
    if (!verdict || isSaving || hasSaved) return;
    
    setIsSaving(true);
    try {
      const endGameReport: PerformanceReport = {
        rating: verdict.verdict === 'STRONG HIRE' ? 90 : verdict.verdict === 'LEAN HIRE' ? 70 : 40,
        summary: verdict.debriefSummary,
        suggestions: [verdict.primaryBlocker].filter(Boolean),
        pronunciationFeedback: [],
        endGameRounds: accumulatedReports,
        endGameVerdict: verdict
      };
      
      const dateStr = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      onSaveReport(`End Game - ${dateStr}`, 'end-game', endGameReport);
      setHasSaved(true);
    } catch (error) {
      console.error('Failed to save report:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Dummy handlers for child components (reports are saved via onRoundComplete)
  const dummySaveReport = () => {};

  // ===== RENDER: WARNING MODAL =====
  if (simulationState === 'warning') {
    return (
      <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-8 font-sans">
        <div className="max-w-lg text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-8">
            <Crown className="w-12 h-12 text-gold" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
            The Grand Finale
          </h1>
          
          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-sm uppercase tracking-widest mb-3">
              <AlertTriangle className="w-4 h-4" />
              Warning
            </div>
            <p className="text-gray-300 leading-relaxed">
              This is a <span className="text-white font-semibold">full onsite simulation</span>. 
              You will complete 5 interview rounds back-to-back without seeing individual feedback.
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Progress is <span className="text-red-400 font-semibold">not saved</span> if you exit early.
            </p>
          </div>
          
          {/* Rounds Preview */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              The Gauntlet
            </div>
            <div className="space-y-2">
              {ROUNDS.map((round, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <span className="text-gray-300">{round.title}</span>
                  <span className="text-gray-500 text-xs ml-auto">
                    {round.persona || round.judge}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleExit()}
              disabled={isLoadingProblems}
              className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-full font-bold uppercase text-sm tracking-widest hover:bg-white/20 transition-all disabled:opacity-50"
            >
              Not Today
            </button>
            <button
              onClick={handleStartSimulation}
              disabled={isLoadingProblems}
              className="group px-8 py-4 bg-gold text-charcoal rounded-full font-bold uppercase text-sm tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingProblems ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Onsite Mock
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER: EVALUATING =====
  if (simulationState === 'evaluating') {
    return (
      <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-8 font-sans">
        <div className="text-center animate-in fade-in duration-500">
          <Loader2 className="w-16 h-16 text-gold animate-spin mx-auto mb-8" />
          <h2 className="text-3xl font-serif font-bold mb-4">
            Hiring Committee Deliberating
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            The committee is reviewing all {ROUNDS.length} interview signals to reach a final verdict...
          </p>
        </div>
      </div>
    );
  }

  // ===== RENDER: VERDICT =====
  if (simulationState === 'verdict' && verdict) {
    const isHire = verdict.verdict !== 'NO HIRE';
    const isStrongHire = verdict.verdict === 'STRONG HIRE';
    
    return (
      <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 bg-black/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isStrongHire ? 'bg-green-500/20 border border-green-500/30' : 
              isHire ? 'bg-amber-500/20 border border-amber-500/30' : 
              'bg-red-500/20 border border-red-500/30'
            }`}>
              {isHire ? (
                <Trophy className={`w-6 h-6 ${isStrongHire ? 'text-green-400' : 'text-amber-400'}`} />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div>
              <div className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-0.5">
                Hiring Committee Decision
              </div>
              <h2 className="text-xl font-serif font-bold tracking-tight">
                The Verdict
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToHistory}
              disabled={isSaving || hasSaved}
              className={`px-6 py-2.5 rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${
                hasSaved 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {hasSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Saved
                </>
              ) : isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save to History
                </>
              )}
            </button>
            <button
              onClick={() => onHome(true)}
              className="px-6 py-2.5 bg-gold text-charcoal rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-all flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Exit
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {/* Verdict Card */}
            <div className={`rounded-3xl p-10 mb-8 text-center ${
              isStrongHire 
                ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30' 
                : isHire 
                  ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30'
                  : 'bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30'
            }`}>
              {/* Verdict */}
              <div className={`text-5xl sm:text-6xl font-serif font-bold mb-4 ${
                isStrongHire ? 'text-green-400' : isHire ? 'text-amber-400' : 'text-red-400'
              }`}>
                {verdict.verdict}
              </div>
              
              {/* Level */}
              <div className={`inline-block px-6 py-2 rounded-full font-bold uppercase text-sm tracking-widest ${
                verdict.level === 'L6' 
                  ? 'bg-gold/20 text-gold border border-gold/30' 
                  : 'bg-white/10 text-gray-400 border border-white/10'
              }`}>
                Level: {verdict.level === 'L6' ? 'L6 (Staff)' : 'N/A'}
              </div>
            </div>

            {/* Debrief */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
              <h3 className="text-lg font-serif font-bold text-gold mb-4">
                The Debrief
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {verdict.debriefSummary}
              </p>
            </div>

            {/* Primary Blocker */}
            {verdict.primaryBlocker && verdict.primaryBlocker !== 'None' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-widest mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Primary Blocker
                </div>
                <p className="text-gray-300">
                  {verdict.primaryBlocker}
                </p>
              </div>
            )}

            {/* Rounds Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Round Scores
              </h3>
              <div className="space-y-3">
                {accumulatedReports.map((result, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gold/20 text-gold font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <span className="text-gray-300">{result.round}</span>
                    </div>
                    <div className={`font-bold ${
                      result.report.rating >= 75 ? 'text-green-400' : 
                      result.report.rating >= 50 ? 'text-amber-400' : 
                      'text-red-400'
                    }`}>
                      {result.report.rating}/100
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER: RUNNING SIMULATION =====
  const currentRoundConfig = ROUNDS[currentRound];

  // DEBUG: Log current state at render time
  console.log('[EndGame] RENDER - simulationState:', simulationState, 'currentRound:', currentRound);
  console.log('[EndGame] RENDER - behavioralQuestion:', behavioralQuestion?.title || 'NULL');
  console.log('[EndGame] RENDER - mlDeepDiveQuestion:', mlDeepDiveQuestion?.title || 'NULL');
  
  // Safety check: if we're running but questions aren't loaded yet, show loading
  if (simulationState === 'running') {
    const needsArenaQuestion = currentRoundConfig.component === 'arena';
    const needsWalkieProblem = currentRoundConfig.component === 'walkie';
    
    const arenaQuestionReady = !needsArenaQuestion || 
      (currentRoundConfig.mode === 'behavioral' && behavioralQuestion) ||
      (currentRoundConfig.mode === 'ml_deep_dive' && mlDeepDiveQuestion);
    
    const walkieProblemReady = !needsWalkieProblem ||
      (currentRoundConfig.mode === 'leetcode' && leetcodeProblem) ||
      (currentRoundConfig.mode === 'system_coding' && systemCodingProblem);
    
    console.log('[EndGame] Safety check - needsArenaQuestion:', needsArenaQuestion, 'arenaQuestionReady:', arenaQuestionReady);
    console.log('[EndGame] Safety check - needsWalkieProblem:', needsWalkieProblem, 'walkieProblemReady:', walkieProblemReady);
    
    if ((needsArenaQuestion && !arenaQuestionReady) || (needsWalkieProblem && !walkieProblemReady)) {
      console.log('[EndGame] Questions not ready yet, showing loading...');
      return (
        <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-8 font-sans">
          <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
          <p className="text-gray-400">Preparing round {currentRound + 1}...</p>
        </div>
      );
    }
  }

  // Get the auto-start question/problem for the current round
  const getAutoStartQuestion = (): ArenaQuestion | undefined => {
    const result = currentRoundConfig.mode === 'behavioral' ? behavioralQuestion || undefined
      : currentRoundConfig.mode === 'ml_deep_dive' ? mlDeepDiveQuestion || undefined
      : undefined;
    console.log('[EndGame] getAutoStartQuestion() called, mode:', currentRoundConfig.mode, 'result:', result?.title || 'UNDEFINED');
    return result;
  };

  const getAutoStartProblem = (): Problem | undefined => {
    if (currentRoundConfig.mode === 'leetcode') return leetcodeProblem || undefined;
    if (currentRoundConfig.mode === 'system_coding') return systemCodingProblem || undefined;
    return undefined;
  };

  // Render the appropriate component based on round type
  if (currentRoundConfig.component === 'arena') {
    const autoQuestion = getAutoStartQuestion();
    console.log('[EndGame] Rendering Arena round:', currentRoundConfig.mode, 'with question:', autoQuestion?.title);
    return (
      <ArenaView
        onHome={handleExit}
        onSaveReport={dummySaveReport}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        onRoundComplete={handleRoundComplete}
        autoStartQuestion={autoQuestion}
      />
    );
  }

  if (currentRoundConfig.component === 'walkie') {
    const autoProblem = getAutoStartProblem();
    return (
      <WalkieTalkieView
        onHome={handleExit}
        onSaveReport={dummySaveReport}
        masteredIds={masteredIds}
        onMastered={onMastered}
        isSaved={isSaved}
        onToggleSave={onToggleSave}
        savedReports={savedReports}
        onRoundComplete={handleRoundComplete}
        autoStartProblem={autoProblem}
        autoStartMode="teach"
      />
    );
  }

  if (currentRoundConfig.component === 'placeholder') {
    return (
      <PlaceholderRound
        roundConfig={currentRoundConfig}
        roundNumber={currentRound + 1}
        totalRounds={ROUNDS.length}
        onRoundComplete={handleRoundComplete}
        onExit={handleExit}
      />
    );
  }

  // Fallback
  return null;
};

export default EndGameView;

