/**
 * ProblemStep Component
 * 
 * The problem display and recording screen for explaining solutions.
 * Supports both voice recording and text input modes.
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  StopCircle,
  Keyboard,
  Send,
  Wand2,
  Loader2
} from 'lucide-react';
import { BlindProblem, FormattedProblemSection } from '../../types';
import { getNeetCodeUrl, getSourceUrl } from '../../config/neetcodeUrls';
import { formatProblemStatement } from '../../services/analysisService';

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

// Check if problem statement needs AI formatting
// Returns true if: no formatted prompt exists, and raw prompt is long (>300 chars)
const needsFormatting = (problem: BlindProblem | null): boolean => {
  if (!problem?.prompt) return false;
  const hasFormattedPrompt = problem.formattedPrompt && problem.formattedPrompt.sections.length > 0;
  if (hasFormattedPrompt) return false;
  // Show format button for any long text without proper formatting
  return problem.prompt.length > 300;
};

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
  const [isFormatting, setIsFormatting] = useState(false);
  const [dynamicFormattedPrompt, setDynamicFormattedPrompt] = useState<{ sections: FormattedProblemSection[] } | null>(null);

  // Reset dynamic formatting when problem changes
  useEffect(() => {
    setDynamicFormattedPrompt(null);
  }, [currentProblem?.id]);

  // Debug: log why format button might not show
  useEffect(() => {
    if (currentProblem) {
      console.log('[ProblemStep Debug]', {
        title: currentProblem.title,
        promptLength: currentProblem.prompt?.length,
        hasFormattedPrompt: !!currentProblem.formattedPrompt,
        sectionsCount: currentProblem.formattedPrompt?.sections?.length,
        needsFormat: needsFormatting(currentProblem),
        dynamicFormattedPrompt: !!dynamicFormattedPrompt,
        showFormatButton: needsFormatting(currentProblem) && !dynamicFormattedPrompt
      });
    }
  }, [currentProblem, dynamicFormattedPrompt]);

  // Handle AI formatting of unformatted problem statement
  const handleFormatProblem = async () => {
    if (!currentProblem?.prompt || isFormatting) return;
    
    setIsFormatting(true);
    try {
      const formatted = await formatProblemStatement(currentProblem.prompt);
      setDynamicFormattedPrompt(formatted);
    } catch (error) {
      console.error('Failed to format problem statement:', error);
    } finally {
      setIsFormatting(false);
    }
  };

  // Use dynamic formatted prompt if available, otherwise fall back to problem's formattedPrompt
  const activeFormattedPrompt = dynamicFormattedPrompt || currentProblem?.formattedPrompt;
  const showFormatButton = needsFormatting(currentProblem) && !dynamicFormattedPrompt;

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

      {/* Main Content Area - Desktop: 50/50 split with input on right | Mobile: Vertical with input at bottom */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Problem Content (scrollable) - 50% on desktop */}
        <div className="lg:w-1/2 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 lg:pr-4">
          <div className="max-w-4xl mx-auto pb-32 sm:pb-40 lg:pb-8">
          {/* Problem Title with LeetCode Number - Always on top */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
            {currentProblem?.leetcodeNumber && (
              <span className="text-gold">#{currentProblem.leetcodeNumber}. </span>
            )}
            {currentProblem?.title}
          </h2>
          
            {/* Problem Statement and Image - Stacked on all screens in left column */}
            <div className="flex flex-col gap-6">
              {/* Problem Statement */}
              <div className="bg-white/5 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/10">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                   <div className="flex items-center gap-2">
                     <BookOpen size={16} className="sm:w-5 sm:h-5 text-gold" />
                     <span className="text-[10px] sm:text-xs font-bold text-gold uppercase tracking-widest">Problem Statement</span>
                     {/* AI Format button - appears when text is long and unformatted */}
                     {showFormatButton && (
                       <button
                         onClick={handleFormatProblem}
                         disabled={isFormatting}
                         className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                         title="Use AI to format this problem statement for easier reading"
                       >
                         {isFormatting ? (
                           <Loader2 size={10} className="animate-spin" />
                         ) : (
                           <Wand2 size={10} />
                         )}
                         <span>{isFormatting ? 'Formatting...' : 'Format'}</span>
                       </button>
                     )}
                   </div>
                   {currentProblem?.title && (
                     <div className="flex items-center gap-2">
                       {/* Source link (if available) */}
                       {getSourceUrl(currentProblem.title) && (
                         <a 
                           href={getSourceUrl(currentProblem.title)!} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500/20 transition-colors"
                           title="View original problem source"
                         >
                           <ExternalLink size={10} className="sm:w-3 sm:h-3" />
                           <span>Source</span>
                         </a>
                       )}
                       {/* Video solution link */}
                       <a 
                         href={getNeetCodeUrl(currentProblem.title)} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-orange-500/20 transition-colors"
                         title={getNeetCodeUrl(currentProblem.title).includes('youtube') || getNeetCodeUrl(currentProblem.title).includes('youtu.be') ? "Watch video solution" : "View problem discussion & solution"}
                       >
                         <ExternalLink size={10} className="sm:w-3 sm:h-3" />
                         <span>{getNeetCodeUrl(currentProblem.title).includes('youtube') || getNeetCodeUrl(currentProblem.title).includes('youtu.be') ? 'Video Solution' : 'Solution'}</span>
                       </a>
                     </div>
                   )}
                </div>
                {/* Render formatted problem if available, otherwise fall back to raw prompt */}
                {activeFormattedPrompt && activeFormattedPrompt.sections.length > 0 ? (
                  <div className="space-y-4 mb-6 sm:mb-8">
                    {activeFormattedPrompt.sections.map((section, idx) => {
                      switch (section.type) {
                        case 'heading':
                          return <h3 key={idx} className="text-lg sm:text-xl font-bold text-gray-200 mt-6 mb-3 first:mt-0">{section.content}</h3>;
                        case 'paragraph':
                          return <p key={idx} className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">{section.content}</p>;
                        case 'code':
                          return (
                            <pre key={idx} className="bg-black/50 p-4 sm:p-6 rounded-xl border border-white/5 overflow-x-auto">
                              <code className="text-xs sm:text-sm font-mono text-gold/80">{section.content}</code>
                            </pre>
                          );
                        case 'example':
                          return (
                            <div key={idx} className="bg-black/30 border-l-2 border-gold/40 p-4 rounded-r-lg">
                              {section.label && <p className="text-[10px] font-bold text-gold/60 uppercase tracking-widest mb-2">{section.label}</p>}
                              <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{section.content}</pre>
                            </div>
                          );
                        case 'list':
                        case 'constraint':
                          return (
                            <div key={idx} className="space-y-2 ml-2">
                              {section.items && section.items.length > 0 ? (
                                section.items.map((item, itemIdx) => (
                                  <div key={itemIdx} className="flex items-start gap-2">
                                    <span className="text-gold mt-1">•</span>
                                    <p className="text-base text-gray-300">{item}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-base text-gray-300">{section.content}</p>
                              )}
                            </div>
                          );
                        default:
                          return <p key={idx} className="text-base text-gray-300 leading-relaxed">{section.content}</p>;
                      }
                    })}
                  </div>
                ) : (
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed font-light mb-6 sm:mb-8">{currentProblem?.prompt}</p>
                )}
                {currentProblem?.example && (
                  <div className="bg-black/40 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-3xl border border-white/5 font-mono text-xs sm:text-sm text-gray-300 leading-relaxed overflow-x-auto"><pre className="whitespace-pre-wrap">{currentProblem.example}</pre></div>
                )}
            </div>
            
              {/* Visual Mnemonic Image */}
            {currentProblem?.mnemonicImageUrl && (
                <div className="rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5">
                  <img 
                    src={currentProblem.mnemonicImageUrl} 
                    alt={`Visual mnemonic for ${currentProblem.title}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
              </div>
            )}
          </div>
          
            {/* Need a Hint Button */}
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
          
            {/* Hints Section */}
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

        {/* Right Column: Input Area - 50% on desktop, sticky bottom on mobile */}
        <div className="lg:w-1/2 lg:border-l lg:border-white/10 lg:bg-black/30 flex flex-col">
          {/* Desktop: Full height input area */}
          <div className="hidden lg:flex flex-col h-full p-6">
            {/* Input Mode Toggle */}
            {step === 'problem' && (
              <div className="flex items-center justify-center gap-2 mb-4">
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
                // Voice mode - centered mic button
                <div className="flex-1 flex flex-col items-center justify-center">
                  <button onClick={() => { setStep('recording'); handleStartRecording(); }} className="w-20 h-20 rounded-full bg-charcoal border-4 border-white/10 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group">
                    <Mic size={32} className="group-hover:text-gold transition-colors" />
                  </button>
                  <span className="mt-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    {sessionMode === 'paired' ? 'Start Explaining' : 'Push to Explain'}
                  </span>
                  {sessionMode === 'paired' && (
                    <p className="mt-3 text-[9px] text-gray-600 text-center max-w-sm">
                      Cover: core insight, state definition, example walkthrough, edge cases, and complexity
                    </p>
                  )}
                </div>
              ) : (
                // Text mode - expandable textarea
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Send size={14} className="text-gold" />
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest">Your Explanation</span>
                  </div>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={sessionMode === 'paired' 
                      ? "Type your explanation here: core insight, state definition, example walkthrough, edge cases, and complexity..." 
                      : "Type your explanation of the solution..."}
                    className="flex-1 w-full bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 text-gray-200 font-serif text-base resize-none focus:outline-none focus:border-gold/40 placeholder:text-gray-500 placeholder:italic"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        onTextSubmit();
                      }
                    }}
                  />
                  <div className="flex flex-col items-center mt-4 gap-2">
                    <button 
                      onClick={onTextSubmit}
                      disabled={!textInput.trim()}
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl border-4 transition-all ${
                        textInput.trim() 
                          ? 'bg-gold hover:scale-110 active:scale-95 border-gold/40' 
                          : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Send size={20} />
                    </button>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      ⌘/Ctrl + Enter
                    </span>
                  </div>
                </div>
              )
            ) : (
              // Recording mode - transcript display
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Recording</span>
                </div>
                <div className={`flex-1 w-full bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-red-500/30 overflow-y-auto text-gray-400 font-serif italic text-base ${!rawTranscript ? 'flex items-center justify-center' : 'block'}`}>
                  {rawTranscript || (sessionMode === 'paired' 
                    ? "Form your mental model: insight, state, example, edges, complexity..." 
                    : "Verbalize your mental model...")}
                </div>
                <div className="flex justify-center mt-4">
                  <button onClick={handleStopRecording} className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl animate-pulse border-4 border-white/10 active:scale-95">
                    <StopCircle size={24} />
                  </button>
                </div>
                <span className="mt-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center">
                  Stop Recording
                </span>
              </div>
            )}
          </div>

          {/* Mobile: Bottom fixed controls */}
          <div className="lg:hidden p-6 sm:p-10 bg-gradient-to-t from-black via-black/90 to-transparent shrink-0 flex flex-col items-center">
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
            <div className="w-full max-w-2xl flex items-end gap-3">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={sessionMode === 'paired' 
                  ? "Type your explanation here: core insight, state definition, example walkthrough, edge cases, and complexity..." 
                  : "Type your explanation of the solution..."}
                className="flex-1 bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 border border-white/10 min-h-[80px] sm:min-h-[100px] max-h-[25vh] text-gray-200 font-serif text-sm sm:text-base resize-none focus:outline-none focus:border-gold/40 placeholder:text-gray-500 placeholder:italic"
              />
              <button 
                onClick={onTextSubmit}
                disabled={!textInput.trim()}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-2xl border-2 transition-all shrink-0 ${
                  textInput.trim() 
                    ? 'bg-gold hover:scale-110 active:scale-95 border-gold/40' 
                    : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <Send size={20} className="sm:w-6 sm:h-6" />
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
      </div>
    </div>
  );
};

export default ProblemStep;

