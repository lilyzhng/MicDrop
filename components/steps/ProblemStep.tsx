/**
 * ProblemStep Component
 * 
 * The problem display and recording screen for explaining solutions.
 * Supports both voice recording and text input modes.
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  StopCircle,
  Keyboard,
  Send
} from 'lucide-react';
import { BlindProblem } from '../../types';
import { getNeetCodeUrl } from '../../config/neetcodeUrls';

type SessionMode = 'paired' | 'explain' | 'teach';
type InputMode = 'voice' | 'text';

interface ProblemStepProps {
  step: 'problem' | 'recording';
  currentProblem: BlindProblem | null;
  selectedSpot: { name: string } | null;
  sessionMode: SessionMode;
  dailyCleared: number;
  dailyCap: number;
  rawTranscript: string;
  revealHintIdx: number;
  showDefinitionExpanded: boolean;
  
  // Actions
  setStep: (step: 'locations' | 'recording') => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  handleTextSubmit: (text: string) => void;
  setRevealHintIdx: (fn: (prev: number) => number) => void;
  setUsedHints: (used: boolean) => void;
  setShowDefinitionExpanded: (show: boolean) => void;
}

export const ProblemStep: React.FC<ProblemStepProps> = ({
  step,
  currentProblem,
  selectedSpot,
  sessionMode,
  dailyCleared,
  dailyCap,
  rawTranscript,
  revealHintIdx,
  showDefinitionExpanded,
  setStep,
  handleStartRecording,
  handleStopRecording,
  handleTextSubmit,
  setRevealHintIdx,
  setUsedHints,
  setShowDefinitionExpanded
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');

  const onTextSubmit = () => {
    if (textInput.trim()) {
      handleTextSubmit(textInput.trim());
      setTextInput('');
    }
  };

  return (
    <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
      {/* Header - Mobile responsive */}
      <div className="p-3 sm:p-6 md:p-8 pr-14 sm:pr-20 md:pr-24 flex items-center justify-between shrink-0 bg-black/20 border-b border-white/5 gap-2">
        <button onClick={() => setStep('locations')} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors shrink-0"><ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" /></button>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
           {/* Show Pass 1 indicator for paired mode */}
           {sessionMode === 'paired' && (
             <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-blue-500/30 text-[8px] sm:text-[10px] font-bold text-blue-300 bg-blue-500/10 uppercase tracking-wider">
               <Layers size={10} className="inline mr-1" /> Pass 1 • Explain
             </div>
           )}
           <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-gold/30 text-[8px] sm:text-[10px] font-bold text-gold bg-gold/5 uppercase tracking-wider sm:tracking-widest truncate max-w-[120px] sm:max-w-none">
              {selectedSpot?.name}
           </div>
           <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 text-[8px] sm:text-[10px] font-bold text-gray-400 bg-white/5 uppercase tracking-wider sm:tracking-widest whitespace-nowrap">
              {dailyCleared}/{dailyCap} today
           </div>
        </div>
      </div>

      {/* Problem Content - Mobile vertical, Desktop side-by-side */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-6xl mx-auto pb-32 sm:pb-40">
          {/* Problem Title with LeetCode Number - Always on top */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
            {currentProblem?.leetcodeNumber && (
              <span className="text-gold">#{currentProblem.leetcodeNumber}. </span>
            )}
            {currentProblem?.title}
          </h2>
          
          {/* Desktop: Side-by-side layout with equal heights | Mobile: Vertical layout */}
          <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-stretch">
            {/* Left Column: Problem Statement */}
            <div className="flex-1 lg:max-w-[55%] order-first lg:order-first mb-6 lg:mb-0">
              <div className="bg-white/5 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                   <div className="flex items-center gap-2">
                     <BookOpen size={16} className="sm:w-5 sm:h-5 text-gold" />
                     <span className="text-[10px] sm:text-xs font-bold text-gold uppercase tracking-widest">Problem Statement</span>
                   </div>
                   {currentProblem?.title && (
                     <a 
                       href={getNeetCodeUrl(currentProblem.title)} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-colors"
                       title="Watch NeetCode video solution"
                     >
                       <ExternalLink size={10} className="sm:w-3 sm:h-3" />
                       <span>NeetCode Video</span>
                     </a>
                   )}
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
          
          {/* Need a Hint Button - Centered below the two columns */}
          {revealHintIdx < 4 && (
            <div className="flex justify-center mt-8 sm:mt-10">
              <button 
                onClick={() => {
                  setRevealHintIdx(p => Math.min(p + 1, 4));
                  setUsedHints(true); // Mark that hints were used - prevents 'Mastered' status
                }} 
                className="text-[9px] sm:text-[10px] font-bold text-gold uppercase tracking-[0.2em] sm:tracking-[0.3em] border border-gold/40 px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gold/10 transition-all flex items-center gap-2 sm:gap-3"
              >
                {revealHintIdx === 0 ? 'Need a Hint?' : 'Need More Hints?'} <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          )}
          
          {/* Hints Section - Full width below */}
          {/* Order: 1. Pattern (with expandable Definition) → 2. Key Idea → 3. Detailed Hint → 4. Skeleton */}
          <div className="grid gap-4 sm:gap-6 mt-6 sm:mt-8">
            {revealHintIdx >= 1 && (
              <div className="p-5 sm:p-8 bg-gold/5 border border-gold/10 rounded-xl sm:rounded-[2rem] animate-in slide-in-from-bottom-4">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-gold tracking-widest mb-2 sm:mb-3 block opacity-60">Pattern</span>
                <p className="text-lg sm:text-2xl font-serif font-semibold">{currentProblem?.pattern}</p>
                
                {/* Expandable Definition Section */}
                {currentProblem?.definition && (
                  <div className="mt-4">
                    <button 
                      onClick={() => setShowDefinitionExpanded(!showDefinitionExpanded)}
                      className="text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 hover:text-emerald-300 transition-colors"
                    >
                      📚 {showDefinitionExpanded ? 'Hide' : 'Expand'} Definitions & Concepts
                      <span className={`transition-transform ${showDefinitionExpanded ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {showDefinitionExpanded && (
                      <div className="mt-3 pt-4 border-t border-emerald-500/20">
                        <div className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-wrap prose prose-invert prose-sm max-w-none [&_strong]:text-emerald-300">
                          {currentProblem?.definition?.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {revealHintIdx >= 2 && <div className="p-5 sm:p-8 bg-white/5 border border-white/10 rounded-xl sm:rounded-[2rem] animate-in slide-in-from-bottom-4"><span className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-2 sm:mb-3 block">Key Idea</span><p className="text-base sm:text-xl italic font-light">"{currentProblem?.keyIdea}"</p></div>}
            {revealHintIdx >= 3 && currentProblem?.detailedHint && <div className="p-5 sm:p-8 bg-blue-950/30 border border-blue-500/20 rounded-xl sm:rounded-[2rem] animate-in slide-in-from-bottom-4"><span className="text-[9px] sm:text-[10px] font-bold uppercase text-blue-400 tracking-widest mb-2 sm:mb-3 block">Approach Walkthrough</span><p className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-wrap">{currentProblem?.detailedHint}</p></div>}
            {revealHintIdx >= 4 && <div className="p-5 sm:p-8 bg-black border border-white/10 rounded-xl sm:rounded-[2rem] animate-in slide-in-from-bottom-4"><span className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-600 tracking-widest mb-2 sm:mb-3 block">Python Solution</span><pre className="text-xs sm:text-sm font-mono text-gold/80 whitespace-pre-wrap overflow-x-auto">{currentProblem?.solution?.replace(/\\n/g, '\n')}</pre></div>}
          </div>
        </div>
      </div>

      {/* Recording/Text Controls - Mobile responsive */}
      <div className="p-6 sm:p-10 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0 flex flex-col items-center">
        {/* Input Mode Toggle */}
        {step === 'problem' && (
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setInputMode('voice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                inputMode === 'voice'
                  ? 'bg-gold/20 border border-gold/40 text-gold'
                  : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
              }`}
            >
              <Mic size={12} />
              <span>Voice</span>
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                inputMode === 'text'
                  ? 'bg-gold/20 border border-gold/40 text-gold'
                  : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
              }`}
            >
              <Keyboard size={12} />
              <span>Type</span>
            </button>
          </div>
        )}

        {step === 'problem' ? (
          inputMode === 'voice' ? (
            // Voice mode - show mic button
            <button onClick={() => { setStep('recording'); handleStartRecording(); }} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-charcoal border-4 border-white/10 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group">
              <Mic size={28} className="sm:w-10 sm:h-10 group-hover:text-gold transition-colors" />
            </button>
          ) : (
            // Text mode - show text area and submit button
            <div className="w-full max-w-2xl flex flex-col items-center">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={sessionMode === 'paired' 
                  ? "Type your explanation here: core insight, state definition, example walkthrough, edge cases, and complexity..." 
                  : "Type your explanation of the solution..."}
                className="w-full bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 mb-4 border border-white/10 min-h-[150px] sm:min-h-[200px] max-h-[40vh] text-gray-200 font-serif text-base sm:text-lg resize-none focus:outline-none focus:border-gold/40 placeholder:text-gray-500 placeholder:italic"
              />
              <button 
                onClick={onTextSubmit}
                disabled={!textInput.trim()}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white shadow-2xl border-4 transition-all ${
                  textInput.trim() 
                    ? 'bg-gold hover:scale-110 active:scale-95 border-gold/40' 
                    : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <Send size={24} className="sm:w-8 sm:h-8" />
              </button>
            </div>
          )
        ) : (
          // Recording mode - show transcript and stop button
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className={`w-full bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 mb-6 sm:mb-10 border border-white/10 min-h-[80px] sm:min-h-[120px] max-h-[30vh] sm:max-h-[40vh] overflow-y-auto text-gray-400 font-serif italic text-base sm:text-xl text-center ${!rawTranscript ? 'flex items-center justify-center' : 'block'}`}>
                {rawTranscript || (sessionMode === 'paired' 
                  ? "Form your mental model: insight, state, example, edges, complexity..." 
                  : "Verbalize your mental model...")}
            </div>
            <button onClick={handleStopRecording} className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl animate-pulse border-4 border-white/10 active:scale-95">
              <StopCircle size={28} className="sm:w-10 sm:h-10" />
            </button>
          </div>
        )}
        <span className="mt-5 sm:mt-8 text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] sm:tracking-[0.4em]">
          {step === 'problem' 
            ? (inputMode === 'text' ? 'Submit Explanation' : (sessionMode === 'paired' ? 'Start Explaining' : 'Push to Explain'))
            : 'Stop Recording'}
        </span>
        {sessionMode === 'paired' && step === 'problem' && inputMode === 'voice' && (
          <p className="mt-3 text-[9px] text-gray-600 text-center max-w-sm">
            Cover: core insight, state definition, example walkthrough, edge cases, and complexity
          </p>
        )}
      </div>
    </div>
  );
};

export default ProblemStep;

