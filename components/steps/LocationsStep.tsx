/**
 * LocationsStep Component
 * 
 * The main power spots selection screen with difficulty selector,
 * Hall of Fame modal, and Settings modal.
 */

import React from 'react';
import { 
  Home, 
  Mic, 
  Loader2, 
  X, 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  Repeat, 
  Zap, 
  Leaf, 
  GraduationCap, 
  Layers, 
  Settings, 
  Calendar,
  Award
} from 'lucide-react';
import { UserStudySettings, StudyStats } from '../../types/database';
import { SpotWithTopic, SpotCard } from '../spots';
import { DEFAULT_SETTINGS } from '../../services/spacedRepetitionService';

// Types
type DifficultyMode = 'warmup' | 'standard' | 'challenge';
type SessionMode = 'paired' | 'explain' | 'teach';

interface DailyStats {
  date: string;
  displayDate: string;
  count: number;
  isToday: boolean;
}

interface LocationsStepProps {
  onHome: (force: boolean) => void;
  
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
  
  // Company selection (for Himmel Park)
  companies?: Array<{id: string; name: string; description: string | null; icon: string | null}>;
  isLoadingCompanies?: boolean;
  onCompanySelect?: (spotId: string, companyId: string, companyName: string) => void;
  
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

export const LocationsStep: React.FC<LocationsStepProps> = ({
  onHome,
  studySettings,
  studyStats,
  dailyCleared,
  globalProgress,
  totalConquered,
  masteryCycle,
  dailyStats,
  masteredIds,
  sessionMode,
  setSessionMode,
  difficultyMode,
  setDifficultyMode,
  spotsWithTopics,
  isLoadingSpots,
  startSpotSession,
  handleRefreshSingleSpot,
  companies = [],
  isLoadingCompanies = false,
  onCompanySelect,
  showStats,
  setShowStats,
  showSettings,
  setShowSettings,
  settingsForm,
  setSettingsForm,
  handleSaveSettings,
  useSpacedRepetition,
  setUseSpacedRepetition
}) => {
  return (
    <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
      {/* Daily Quest Header */}
      <div className="border-b border-white/5 shrink-0 bg-black px-4 sm:px-6 py-2.5 sm:py-4 pr-14 sm:pr-16">
        {/* Top row: Home, Daily Quest centered, Mode + Settings */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Home button */}
          <button onClick={() => onHome(true)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors shrink-0">
            <Home size={16} className="sm:w-5 sm:h-5" />
          </button>
          
          {/* Center: Daily Quest progress - centered with offset for visual balance */}
          <div className="flex-1 flex flex-col items-center min-w-0 ml-20 sm:ml-22">
            <div className="text-[8px] sm:text-[10px] text-gold font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-0.5 sm:mb-1">Daily Quest</div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-1 sm:h-1.5 w-20 sm:w-40 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gold transition-all duration-700" style={{ width: `${((dailyCleared) / (studySettings?.dailyCap || DEFAULT_SETTINGS.dailyCap)) * 100}%` }}></div>
              </div>
              <span className="text-[10px] sm:text-sm font-bold font-mono text-gold whitespace-nowrap">{dailyCleared}/{studySettings?.dailyCap || DEFAULT_SETTINGS.dailyCap}</span>
            </div>
          </div>
          
          {/* Right: Mode toggle + Settings button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Mode Toggle - small icon button */}
            <button 
              onClick={() => {
                const modes: SessionMode[] = ['paired', 'explain', 'teach'];
                const currentIdx = modes.indexOf(sessionMode);
                const nextIdx = (currentIdx + 1) % modes.length;
                setSessionMode(modes[nextIdx]);
              }}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all ${
                sessionMode === 'paired'
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : sessionMode === 'teach'
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'bg-gold/20 border-gold/40 text-gold'
              }`}
              title={sessionMode === 'paired' ? 'Paired: Explain → Teach same problem' : sessionMode === 'teach' ? 'Teach only mode' : 'Explain only mode'}
            >
              {sessionMode === 'paired' ? (
                <Layers size={14} className="sm:w-4 sm:h-4" />
              ) : sessionMode === 'teach' ? (
                <GraduationCap size={14} className="sm:w-4 sm:h-4" />
              ) : (
                <Mic size={14} className="sm:w-4 sm:h-4" />
              )}
            </button>
            {/* Settings button */}
            <button 
              onClick={() => setShowSettings(true)}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
              title="Study Settings"
            >
              <Settings size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:px-8 space-y-4 sm:space-y-6 pb-32 sm:pb-40 max-w-2xl mx-auto w-full">
        <div className="text-center mb-2 sm:mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-1 sm:mb-2">Power Spots</h2>
          <p className="text-gray-500 text-xs sm:text-sm italic px-4">
            {sessionMode === 'paired' 
              ? 'Best for learning: Explain first → then teach the same problem.' 
              : sessionMode === 'teach' 
              ? 'Teach a junior engineer who asks questions until they understand.' 
              : 'Explain your solution and AI evaluates correctness.'}
          </p>
        </div>

        {/* Difficulty Mode Selector */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => setDifficultyMode('warmup')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              difficultyMode === 'warmup'
                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            <Leaf size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Warm-Up</span>
            <span className="sm:hidden">Easy</span>
          </button>
          <button
            onClick={() => setDifficultyMode('standard')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              difficultyMode === 'standard'
                ? 'bg-gold/20 border-gold/50 text-gold'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            <Zap size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>Standard</span>
          </button>
          <button
            onClick={() => setDifficultyMode('challenge')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
              difficultyMode === 'challenge'
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
            }`}
          >
            <Flame size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>Challenge</span>
          </button>
        </div>
        
        {/* Difficulty Description */}
        <p className="text-center text-[10px] sm:text-xs text-gray-500 italic mb-4 sm:mb-6">
          {difficultyMode === 'warmup' && 'Easy problems only — build momentum'}
          {difficultyMode === 'standard' && 'Easy + Medium — balanced practice'}
          {difficultyMode === 'challenge' && 'All difficulties — test your limits'}
        </p>

        {isLoadingSpots ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 size={32} className="animate-spin mb-4" />
            <p className="text-sm">Loading topics...</p>
          </div>
        ) : spotsWithTopics.length === 0 ? (
          <div className="bg-gold/10 border border-gold/40 rounded-2xl p-8 text-center">
            <Trophy size={40} className="mx-auto mb-4 text-gold" />
            <h3 className="text-xl font-serif font-bold text-gold mb-2">All Topics Mastered!</h3>
            <p className="text-gold/60 text-sm">You've conquered all 75 problems. Legendary.</p>
          </div>
        ) : (
          spotsWithTopics.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              studyStats={studyStats}
              onStartSession={startSpotSession}
              onRefresh={handleRefreshSingleSpot}
              companies={companies}
              isLoadingCompanies={isLoadingCompanies}
              onCompanySelect={onCompanySelect}
            />
          ))
        )}

        {(dailyCleared) >= (studySettings?.dailyCap || DEFAULT_SETTINGS.dailyCap) && (
          <div className="bg-gold/10 border border-gold/40 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 text-center animate-in zoom-in duration-500">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gold rounded-full flex items-center justify-center text-charcoal mx-auto mb-3 sm:mb-4 shadow-[0_0_30px_rgba(199,169,101,0.4)]">
              <Star size={24} className="sm:w-8 sm:h-8" fill="currentColor" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-gold mb-1 sm:mb-2">Daily Goal Achieved!</h3>
            <p className="text-gold/60 text-xs sm:text-sm">You have mastered {studySettings?.dailyCap || DEFAULT_SETTINGS.dailyCap} coding patterns today. Ritual complete.</p>
          </div>
        )}
      </div>

      {/* HALL OF FAME MODAL */}
      {showStats && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-charcoal border border-white/10 rounded-2xl sm:rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-10 text-center border-b border-white/5">
              <button onClick={() => setShowStats(false)} className="absolute top-4 right-4 sm:top-8 sm:right-8 text-gray-500 hover:text-white transition-colors">
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gold/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-gold mx-auto mb-4 sm:mb-6 border border-gold/20">
                <Award size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-1 sm:mb-2 uppercase tracking-tight">The Hall of Fame</h2>
              <p className="text-gray-500 text-xs sm:text-sm italic tracking-widest uppercase">Blind 75 Progress</p>
            </div>

            <div className="p-4 sm:p-10 space-y-6 sm:space-y-10">
              {/* Coverage Progress */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between px-1 sm:px-2">
                  <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider sm:tracking-widest">Global Coverage</span>
                  <span className="text-base sm:text-lg font-mono font-bold text-white">{masteredIds.length} <span className="text-gray-600 text-[10px] sm:text-xs">/ 75</span></span>
                </div>
                <div className="relative h-2 sm:h-2.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-gold/60 to-gold shadow-[0_0_15px_rgba(199,169,101,0.3)] transition-all duration-1000 ease-out" 
                    style={{ width: `${globalProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Cards Section */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 group hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <Target size={12} className="sm:w-3.5 sm:h-3.5 text-gray-500" />
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">Breadth</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{globalProgress}%</div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1 uppercase tracking-tighter">Unique Patterns</div>
                </div>
                
                <div className="bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 group hover:border-gold/30 transition-colors">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <Flame size={12} className="sm:w-3.5 sm:h-3.5 text-gold" />
                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">Depth</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gold">{totalConquered}</div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1 uppercase tracking-tighter">Total Clears</div>
                </div>
              </div>

              {/* Mastery Cycle */}
              <div className="bg-gold/5 border border-gold/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <Repeat size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="text-[8px] sm:text-[10px] font-bold text-gold uppercase tracking-wider sm:tracking-widest">Mastery Cycle</div>
                    <div className="text-xs sm:text-sm font-bold text-white">Full Passes: {masteryCycle - 1}.{Math.floor((totalConquered % 75) / 7.5)}</div>
                  </div>
                </div>
                <div className="text-[8px] sm:text-[10px] text-gold/60 font-medium max-w-[80px] sm:max-w-[100px] text-right italic leading-tight hidden sm:block">
                  "The master does it until he cannot fail."
                </div>
              </div>

              {/* Daily History - 7 Day Tracker */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 px-1 sm:px-2">
                  <Flame size={14} className="text-gold" />
                  <span className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider sm:tracking-widest">7-Day History</span>
                </div>
                <div className="space-y-2">
                  {dailyStats.map((day) => (
                    <div 
                      key={day.date}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                        day.isToday 
                          ? 'bg-gold/10 border border-gold/30' 
                          : 'bg-white/5 border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          day.count >= 15 
                            ? 'bg-gold text-charcoal' 
                            : day.count > 0 
                            ? 'bg-gold/20 text-gold' 
                            : 'bg-white/10 text-gray-600'
                        }`}>
                          {day.count >= 15 ? <Star size={14} fill="currentColor" /> : day.count}
                        </div>
                        <span className={`text-xs sm:text-sm font-medium ${
                          day.isToday ? 'text-gold' : 'text-gray-400'
                        }`}>
                          {day.displayDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {day.count > 0 && (
                          <div className="flex">
                            {Array.from({ length: Math.min(day.count, 5) }).map((_, i) => (
                              <div 
                                key={i} 
                                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gold -ml-0.5 first:ml-0"
                              />
                            ))}
                            {day.count > 5 && (
                              <span className="text-[8px] sm:text-[9px] text-gold ml-1">+{day.count - 5}</span>
                            )}
                          </div>
                        )}
                        <span className={`text-[10px] sm:text-xs font-mono ${
                          day.isToday ? 'text-gold' : 'text-gray-500'
                        }`}>
                          {day.count} solved
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowStats(false)} 
              className="w-full py-5 sm:py-8 bg-black text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gold hover:bg-gold hover:text-charcoal transition-all"
            >
              Return to Quest
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-charcoal border border-white/10 rounded-2xl sm:rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="p-6 sm:p-8 border-b border-white/5">
              <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <Settings size={20} className="text-gold" />
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">Study Settings</h2>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm">Configure your spaced repetition study plan</p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Spaced Repetition Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <div className="text-sm font-medium text-white mb-1">Spaced Repetition</div>
                  <div className="text-xs text-gray-500">Use adaptive scheduling for reviews</div>
                </div>
                <button
                  onClick={() => setUseSpacedRepetition(!useSpacedRepetition)}
                  className={`w-12 h-6 rounded-full transition-all ${
                    useSpacedRepetition ? 'bg-gold' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    useSpacedRepetition ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Target Days */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  <Calendar size={12} className="inline mr-2" />
                  Target Days to Complete
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={settingsForm.targetDays}
                    onChange={(e) => setSettingsForm({ ...settingsForm, targetDays: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <span className="text-xl font-bold text-gold w-12 text-center">{settingsForm.targetDays}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ~{Math.ceil(75 / settingsForm.targetDays)} new problems per day
                </p>
              </div>

              {/* Daily Cap */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  <Target size={12} className="inline mr-2" />
                  Daily Problem Cap
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={settingsForm.dailyCap}
                    onChange={(e) => {
                      const newCap = parseInt(e.target.value);
                      // Ensure dailyNewGoal doesn't exceed the new cap
                      const newGoal = Math.min(settingsForm.dailyNewGoal, newCap);
                      setSettingsForm({ ...settingsForm, dailyCap: newCap, dailyNewGoal: newGoal });
                    }}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <span className="text-xl font-bold text-gold w-12 text-center">{settingsForm.dailyCap}</span>
                </div>
                {/* Compact new/reviews breakdown */}
                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap size={12} className="text-gold" />
                    <span className="text-gray-400">New:</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={settingsForm.dailyNewGoal}
                      onChange={(e) => {
                        const raw = e.target.value;
                        // Allow empty or numeric input while typing
                        if (raw === '' || /^\d+$/.test(raw)) {
                          const parsed = parseInt(raw) || 0;
                          setSettingsForm({ ...settingsForm, dailyNewGoal: parsed });
                        }
                      }}
                      onBlur={(e) => {
                        // Validate on blur: clamp to valid range
                        const val = Math.max(1, Math.min(settingsForm.dailyCap, settingsForm.dailyNewGoal || 1));
                        setSettingsForm({ ...settingsForm, dailyNewGoal: val });
                      }}
                      className="w-12 px-2 py-1 bg-charcoal border border-white/10 rounded text-gold text-center font-bold focus:outline-none focus:border-gold/50"
                    />
                    <span className="text-gray-500">+ {settingsForm.dailyCap - settingsForm.dailyNewGoal} reviews</span>
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  <Calendar size={12} className="inline mr-2" />
                  Study Start Date
                </label>
                <input
                  type="date"
                  value={settingsForm.startDate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold/50 transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Day 1 of your study plan
                </p>
              </div>

              {/* Plan Summary - shows what will be saved */}
              <div className="p-4 bg-gold/5 rounded-xl border border-gold/20">
                <div className="text-xs font-bold text-gold uppercase tracking-widest mb-2">Plan Summary</div>
                <div className="text-sm text-gray-300">
                  Started: {new Date(settingsForm.startDate + 'T00:00:00').toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-300">
                  Target: {settingsForm.targetDays} days • Cap: {settingsForm.dailyNewGoal} new + {settingsForm.dailyCap - settingsForm.dailyNewGoal} reviews
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 border-t border-white/5 flex gap-3">
              <button 
                onClick={() => setShowSettings(false)} 
                className="flex-1 py-3 bg-white/5 text-gray-400 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSettings} 
                className="flex-1 py-3 bg-gold text-charcoal text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsStep;

