/**
 * TeachingStep Component
 * 
 * The teaching conversation screen where user teaches a junior engineer.
 * Features a unified writing board that preserves formatting.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  BookOpen, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  Send,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { BlindProblem, TeachingSession } from '../../types';

type SessionMode = 'paired' | 'explain' | 'teach';
type InputMode = 'voice' | 'board';

interface TeachingStepProps {
  step: 'teaching' | 'junior_question' | 'junior_thinking';
  currentProblem: BlindProblem | null;
  teachingSession: TeachingSession | null;
  sessionMode: SessionMode;
  currentQueueIdx: number;
  isTeachingRecording: boolean;
  teachingRawTranscript: string;
  ttsEnabled: boolean;
  isJuniorThinking?: boolean;
  
  // Actions
  setStep: (step: 'locations') => void;
  setTtsEnabled: (enabled: boolean) => void;
  handleStartTeachingRecording: () => void;
  handleStopTeachingRecording: () => void;
  handleTeachingTextSubmit: (text: string, imageBase64?: string) => void;
  handleEndTeachingSession: () => void;
  speakJuniorResponse: (text: string) => void;
}

export const TeachingStep: React.FC<TeachingStepProps> = ({
  step: _step, // Used by parent to determine rendering
  currentProblem,
  teachingSession,
  sessionMode,
  currentQueueIdx,
  isTeachingRecording,
  teachingRawTranscript,
  ttsEnabled,
  isJuniorThinking = false,
  setStep,
  setTtsEnabled,
  handleStartTeachingRecording,
  handleStopTeachingRecording,
  handleTeachingTextSubmit,
  handleEndTeachingSession,
  speakJuniorResponse
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('board');
  const [boardContent, setBoardContent] = useState('');
  
  // Refs for auto-scrolling
  const boardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const studentQuestionsRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll board when content updates - smooth scroll to bottom
  useEffect(() => {
    const scrollToBottom = () => {
      if (boardRef.current) {
        boardRef.current.scrollTo({
          top: boardRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };
    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [teachingSession?.turns.length, isJuniorThinking]);

  // Auto-scroll student questions when new question arrives
  useEffect(() => {
    const scrollToBottom = () => {
      if (studentQuestionsRef.current) {
        studentQuestionsRef.current.scrollTo({
          top: studentQuestionsRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [teachingSession?.turns.filter(t => t.speaker === 'junior').length, isJuniorThinking]);

  // Focus textarea when switching to board mode
  useEffect(() => {
    if (inputMode === 'board' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [inputMode]);

  // Auto-resize textarea as user types and scroll to keep cursor visible
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight to fit all content
      textareaRef.current.style.height = `${Math.max(150, textareaRef.current.scrollHeight)}px`;
      
      // Scroll the board to keep the textarea visible
      if (boardRef.current) {
        boardRef.current.scrollTop = boardRef.current.scrollHeight;
      }
    }
  }, [boardContent]);

  const onBoardSubmit = () => {
    if (boardContent.trim()) {
      handleTeachingTextSubmit(boardContent.trim());
      setBoardContent('');
    }
  };

  // Handle keyboard shortcuts including Tab for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to submit
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onBoardSubmit();
      return;
    }
    
    // Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const indent = '    '; // 4 spaces
      
      if (start === end) {
        // No selection - just insert tab at cursor
        const newValue = value.substring(0, start) + indent + value.substring(end);
        setBoardContent(newValue);
        // Set cursor position after the inserted tab
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + indent.length;
        });
      } else {
        // Selection exists - indent/unindent selected lines
        const beforeSelection = value.substring(0, start);
        const afterSelection = value.substring(end);
        
        // Find the start of the first selected line
        const lineStart = beforeSelection.lastIndexOf('\n') + 1;
        const textBeforeLines = value.substring(0, lineStart);
        const selectedText = value.substring(lineStart, end);
        
        if (e.shiftKey) {
          // Shift+Tab: Unindent - remove leading spaces from each line
          const unindentedLines = selectedText.split('\n').map(line => {
            if (line.startsWith(indent)) {
              return line.substring(indent.length);
            } else if (line.startsWith('  ')) {
              return line.substring(2);
            } else if (line.startsWith('\t')) {
              return line.substring(1);
            }
            return line;
          }).join('\n');
          
          const newValue = textBeforeLines + unindentedLines + afterSelection;
          setBoardContent(newValue);
          requestAnimationFrame(() => {
            textarea.selectionStart = lineStart;
            textarea.selectionEnd = lineStart + unindentedLines.length;
          });
        } else {
          // Tab: Indent - add spaces to the beginning of each line
          const indentedLines = selectedText.split('\n').map(line => indent + line).join('\n');
          const newValue = textBeforeLines + indentedLines + afterSelection;
          setBoardContent(newValue);
          requestAnimationFrame(() => {
            textarea.selectionStart = lineStart;
            textarea.selectionEnd = lineStart + indentedLines.length;
          });
        }
      }
    }
  };

  return (
    <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-6 md:p-8 pr-14 sm:pr-20 md:pr-24 flex items-center justify-between shrink-0 bg-black/20 border-b border-white/5 gap-2">
        <button onClick={() => setStep('locations')} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors shrink-0">
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-purple-500/30 text-[8px] sm:text-[10px] font-bold text-purple-300 bg-purple-500/10 uppercase tracking-wider sm:tracking-widest">
            <GraduationCap size={10} className="inline mr-1" /> 
            {sessionMode === 'paired' ? 'Pass 2 • Teach' : 'Teach Mode'}
          </div>
          <div className="px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 text-[8px] sm:text-[10px] font-bold text-gray-400 bg-white/5 uppercase tracking-wider sm:tracking-widest whitespace-nowrap">
            {currentQueueIdx + 1}/5
          </div>
          {/* TTS Toggle */}
          <button 
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
              ttsEnabled 
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' 
                : 'bg-white/5 border border-white/10 text-gray-500'
            }`}
          >
            {ttsEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
            <span className="hidden sm:inline">TTS</span>
          </button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Left: Problem Reference (Desktop only) */}
        <div className="hidden lg:block lg:w-2/5 overflow-y-auto px-4 py-4 border-r border-white/5">
          <h2 className="text-2xl font-serif font-bold mb-4 leading-tight">
              {currentProblem?.leetcodeNumber && (
                <span className="text-purple-300">#{currentProblem.leetcodeNumber}. </span>
              )}
              {currentProblem?.title}
            </h2>
            
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-purple-300" />
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Problem</span>
                </div>
            <p className="text-sm text-gray-200 leading-relaxed">{currentProblem?.prompt}</p>
                {currentProblem?.example && (
              <div className="mt-4 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre className="whitespace-pre-wrap">{currentProblem.example}</pre>
              </div>
                )}
              </div>
              
              {currentProblem?.mnemonicImageUrl && (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                  <img 
                    src={currentProblem.mnemonicImageUrl} 
                    alt={`Visual mnemonic for ${currentProblem.title}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

        {/* Right: Teaching Board */}
        <div className="flex-1 flex flex-col lg:w-3/5 min-h-0 overflow-y-auto lg:overflow-hidden">
          
          {/* Mobile Problem Section - Full problem shown first on mobile */}
          <div className="lg:hidden px-4 py-4 border-b border-white/10 bg-black/20 shrink-0">
            <h2 className="text-xl font-serif font-bold mb-3 leading-tight">
              {currentProblem?.leetcodeNumber && (
                <span className="text-purple-300">#{currentProblem.leetcodeNumber}. </span>
              )}
              {currentProblem?.title}
            </h2>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={12} className="text-purple-300" />
                <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest">Problem</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">{currentProblem?.prompt}</p>
              {currentProblem?.example && (
                <div className="mt-3 bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs text-gray-300 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{currentProblem.example}</pre>
                </div>
              )}
            </div>
            
            {currentProblem?.mnemonicImageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img 
                  src={currentProblem.mnemonicImageUrl} 
                  alt={`Visual mnemonic for ${currentProblem.title}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* The Board - Constrained height with internal scrolling */}
          <div className="flex flex-col p-2 sm:p-4 lg:flex-1 lg:overflow-hidden shrink-0 lg:shrink">
            {/* Chalkboard container - constrained on mobile, flex on desktop */}
            <div className="h-[280px] sm:h-[320px] lg:h-auto lg:flex-1 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-4 sm:border-8 border-amber-900/40 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden">
              {/* Chalk dust effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none rounded-2xl" />
              
              {/* Scrollable content area */}
              <div ref={boardRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {teachingSession?.turns
                  .filter(turn => turn.speaker === 'teacher')
                  .map((turn, idx) => (
                    <div key={idx}>
                      {/* Teaching label */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-widest">Teaching (me)</span>
                      </div>
                      {/* Content with preserved formatting */}
                      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-100 pl-3 border-l border-amber-400/20">
                        {turn.content}
                    </div>
                  </div>
                ))}

                {/* Current writing area - seamlessly integrated */}
                {inputMode === 'board' && !isJuniorThinking && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-400/70 uppercase tracking-widest">Teaching (me)</span>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={boardContent}
                      onChange={(e) => setBoardContent(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Continue teaching..."
                      className="w-full bg-transparent border-l border-emerald-400/30 pl-3 outline-none resize-none font-mono text-sm text-gray-100 leading-relaxed placeholder:text-gray-600 overflow-hidden"
                      style={{ caretColor: '#34d399', minHeight: '150px' }}
                    />
                  </div>
                )}

                {/* Voice recording display */}
                {inputMode === 'voice' && isTeachingRecording && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-red-400/70 uppercase tracking-widest">Recording...</span>
                    </div>
                    <p className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap pl-3 border-l border-red-400/30">
                      {teachingRawTranscript || "Listening..."}
                    </p>
                  </div>
                )}

                {/* Empty state */}
                {!teachingSession?.turns.some(t => t.speaker === 'teacher') && inputMode === 'voice' && !isTeachingRecording && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-serif italic">Click Record to start teaching...</p>
              </div>
                )}
            </div>

              {/* Board tray with controls - like chalk/erasers on the tray */}
              <div className="bg-gradient-to-b from-amber-900/30 to-amber-950/50 border-t border-amber-800/30 rounded-b-xl mt-auto px-3 py-2 flex items-center justify-between gap-2">
                {/* Send button - bottom left for easy access */}
                <div>
                  {inputMode === 'board' ? (
                <button
                      onClick={onBoardSubmit}
                      disabled={!boardContent.trim()}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                        boardContent.trim() 
                          ? 'bg-emerald-500/60 text-emerald-50 hover:bg-emerald-500/70 shadow-md' 
                          : 'bg-white/5 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <Send size={12} /> Send
                </button>
                  ) : isTeachingRecording ? (
                    <button 
                      onClick={handleStopTeachingRecording}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/60 text-red-50 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/70 transition-all animate-pulse shadow-md"
                    >
                      <Send size={12} /> Send
                    </button>
                  ) : (
                    <button 
                      onClick={handleStartTeachingRecording}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/60 text-purple-50 text-[10px] font-bold uppercase tracking-wider hover:bg-purple-500/70 transition-all shadow-md"
                    >
                      <Mic size={12} /> Record
                    </button>
                  )}
                </div>
                
                {/* Other controls - right side */}
                <div className="flex items-center gap-2">
                      <button 
                    onClick={() => setInputMode('board')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                      inputMode === 'board'
                        ? 'bg-emerald-500/40 text-emerald-200'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    ⌨️ Write
                      </button>
                      <button 
                    onClick={() => setInputMode('voice')}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${
                      inputMode === 'voice'
                        ? 'bg-purple-500/40 text-purple-200'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    <Mic size={11} /> Voice
                  </button>
                  <div className="w-px h-5 bg-white/20 mx-1" />
                  <button 
                    onClick={handleEndTeachingSession}
                    className="px-2.5 py-1.5 rounded bg-red-500/30 text-red-200 text-[9px] font-bold uppercase tracking-wider hover:bg-red-500/40 transition-all"
                  >
                    Class Over
                      </button>
                </div>
              </div>
            </div>

            {/* Student Questions Section - Below the board, visible on mobile */}
            <div className="mt-3 bg-purple-950/20 rounded-xl border border-purple-500/20 overflow-hidden shrink-0">
              {/* Header - fixed */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/10 border-b border-purple-500/20">
                <HelpCircle size={14} className="text-purple-400" />
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Student Questions</span>
              </div>
              
              {/* Scrollable questions container - taller on mobile for visibility */}
              <div ref={studentQuestionsRef} className="h-[140px] sm:h-[160px] lg:max-h-[200px] lg:h-auto overflow-y-auto p-3 space-y-3">
                {teachingSession?.turns
                  .filter(turn => turn.speaker === 'junior')
                  .map((turn, idx) => (
                    <div key={idx} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                          <GraduationCap size={12} className="text-purple-300" />
            </div>
                        <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest">Junior Engineer</span>
                          <button 
                            onClick={() => speakJuniorResponse(turn.content)}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                          >
                              <Volume2 size={11} className="text-purple-300" />
                          </button>
                          </div>
                          <p className="text-sm text-purple-100 italic leading-relaxed">"{turn.content}"</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Junior thinking indicator */}
                {isJuniorThinking && (
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <GraduationCap size={12} className="text-purple-300" />
                      </div>
                      <div className="flex items-center gap-2 text-purple-200">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="italic text-sm">Student is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Empty state - no questions yet */}
                {!teachingSession?.turns.some(t => t.speaker === 'junior') && !isJuniorThinking && (
                  <div className="text-center py-4 text-gray-500 text-sm italic">
                    Student questions will appear here
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeachingStep;
