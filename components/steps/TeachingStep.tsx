/**
 * TeachingStep Component
 * 
 * The teaching conversation screen where user teaches a junior engineer.
 */

import React from 'react';
import { 
  ArrowLeft, 
  Mic, 
  BookOpen, 
  GraduationCap, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  Send 
} from 'lucide-react';
import { BlindProblem, TeachingSession } from '../../types';

type SessionMode = 'paired' | 'explain' | 'teach';

interface TeachingStepProps {
  step: 'teaching' | 'junior_question';
  currentProblem: BlindProblem | null;
  teachingSession: TeachingSession | null;
  sessionMode: SessionMode;
  currentQueueIdx: number;
  isTeachingRecording: boolean;
  teachingRawTranscript: string;
  ttsEnabled: boolean;
  
  // Actions
  setStep: (step: 'locations') => void;
  setTtsEnabled: (enabled: boolean) => void;
  handleStartTeachingRecording: () => void;
  handleStopTeachingRecording: () => void;
  handleEndTeachingSession: () => void;
  speakJuniorResponse: (text: string) => void;
}

export const TeachingStep: React.FC<TeachingStepProps> = ({
  step,
  currentProblem,
  teachingSession,
  sessionMode,
  currentQueueIdx,
  isTeachingRecording,
  teachingRawTranscript,
  ttsEnabled,
  setStep,
  setTtsEnabled,
  handleStartTeachingRecording,
  handleStopTeachingRecording,
  handleEndTeachingSession,
  speakJuniorResponse
}) => {
  return (
    <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-6 md:p-8 pr-14 sm:pr-20 md:pr-24 flex items-center justify-between shrink-0 bg-black/20 border-b border-white/5 gap-2">
        <button onClick={() => setStep('locations')} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors shrink-0">
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {/* Show Pass 2 indicator for paired mode, otherwise just Teach Mode */}
          <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-purple-500/30 text-[8px] sm:text-[10px] font-bold text-purple-300 bg-purple-500/10 uppercase tracking-wider sm:tracking-widest">
            <GraduationCap size={10} className="inline mr-1" /> 
            {sessionMode === 'paired' ? 'Pass 2 • Teach' : 'Teach Mode'}
          </div>
          <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 text-[8px] sm:text-[10px] font-bold text-gray-400 bg-white/5 uppercase tracking-wider sm:tracking-widest whitespace-nowrap">
            {currentQueueIdx + 1}/5
          </div>
        </div>
      </div>

      {/* Problem Title & Conversation */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-6xl mx-auto pb-48 sm:pb-56">
          {/* Problem Title with LeetCode Number - Always on top */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
            {currentProblem?.leetcodeNumber && (
              <span className="text-purple-300">#{currentProblem.leetcodeNumber}. </span>
            )}
            {currentProblem?.title}
          </h2>
          
          {/* Desktop: Side-by-side layout with equal heights | Mobile: Vertical layout */}
          <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-stretch mb-6">
            {/* Left Column: Problem Statement */}
            <div className="flex-1 lg:max-w-[55%] order-first lg:order-first mb-6 lg:mb-0">
              <div className="bg-white/5 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/10 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <BookOpen size={16} className="sm:w-5 sm:h-5 text-purple-300" />
                  <span className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-widest">Problem Statement</span>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed font-light mb-6 sm:mb-8 flex-grow">{currentProblem?.prompt}</p>
                {currentProblem?.example && (
                  <div className="bg-black/40 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl border border-white/5 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed overflow-x-auto"><pre className="whitespace-pre-wrap">{currentProblem.example}</pre></div>
                )}
              </div>
            </div>
            
            {/* Right Column: Visual Mnemonic Image - Matches problem height on desktop */}
            {currentProblem?.mnemonicImageUrl && (
              <div className="lg:flex-1 lg:max-w-[45%] order-2 lg:order-last mb-6 lg:mb-0">
                <div className="rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 h-full">
                  <img 
                    src={currentProblem.mnemonicImageUrl} 
                    alt={`Visual mnemonic for ${currentProblem.title}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Conversation History */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {teachingSession?.turns.map((turn, idx) => (
              <div 
                key={idx} 
                className={`flex ${turn.speaker === 'teacher' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    turn.speaker === 'teacher' 
                      ? 'bg-gold/20 border border-gold/30 text-white' 
                      : 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                      {turn.speaker === 'teacher' ? 'You (Teaching)' : 'Junior Engineer'}
                    </span>
                    {turn.speaker === 'junior' && (
                      <button 
                        onClick={() => speakJuniorResponse(turn.content)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 size={14} className="text-purple-300" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed">{turn.content}</p>
                </div>
              </div>
            ))}

            {/* Initial prompt if no conversation yet */}
            {(!teachingSession?.turns.length || teachingSession.turns.length === 0) && (
              <div className="text-center py-8">
                <MessageCircle size={32} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm italic">Start teaching the junior engineer...</p>
                <p className="text-gray-600 text-xs mt-1">Explain the problem and your approach</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="p-4 sm:p-8 bg-gradient-to-t from-black via-black/95 to-transparent shrink-0">
        <div className="max-w-2xl mx-auto">
          {/* TTS Toggle */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button 
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                ttsEnabled 
                  ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' 
                  : 'bg-white/5 border border-white/10 text-gray-500'
              }`}
            >
              {ttsEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
              <span>Read Aloud</span>
            </button>
          </div>

          {/* Recording UI */}
          {isTeachingRecording ? (
            <div className="flex flex-col items-center">
              <div className="w-full bg-white/5 backdrop-blur-2xl rounded-2xl p-4 mb-4 border border-white/10 min-h-[60px] max-h-[20vh] overflow-y-auto text-gray-400 font-serif italic text-sm text-center">
                {teachingRawTranscript || "Speaking..."}
              </div>
              <button 
                onClick={handleStopTeachingRecording} 
                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl animate-pulse border-4 border-white/10 active:scale-95"
              >
                <Send size={24} className="sm:w-8 sm:h-8" />
              </button>
              <span className="mt-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Tap to Send</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleStartTeachingRecording} 
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-charcoal border-4 border-purple-500/30 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group"
                >
                  <Mic size={24} className="sm:w-8 sm:h-8 group-hover:text-purple-300 transition-colors" />
                </button>
                <button 
                  onClick={handleEndTeachingSession}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-gray-400 hover:bg-white/20 hover:text-white transition-all"
                >
                  End Session
                </button>
              </div>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                {step === 'junior_question' ? 'Continue Teaching' : 'Start Teaching'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachingStep;

