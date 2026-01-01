/**
 * TeachingStep Component
 * 
 * The teaching conversation screen where user teaches a junior engineer.
 * Supports both voice recording and text input modes.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  BookOpen, 
  GraduationCap, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  Send,
  Keyboard,
  Loader2
} from 'lucide-react';
import { BlindProblem, TeachingSession } from '../../types';

type SessionMode = 'paired' | 'explain' | 'teach';
type InputMode = 'voice' | 'text';

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
  handleTeachingTextSubmit: (text: string) => void;
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
  isJuniorThinking = false,
  setStep,
  setTtsEnabled,
  handleStartTeachingRecording,
  handleStopTeachingRecording,
  handleTeachingTextSubmit,
  handleEndTeachingSession,
  speakJuniorResponse
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  
  // Refs for auto-scrolling conversation areas
  const desktopConversationRef = useRef<HTMLDivElement>(null);
  const mobileConversationRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when conversation updates or junior is thinking
  useEffect(() => {
    const scrollToBottom = () => {
      if (desktopConversationRef.current) {
        desktopConversationRef.current.scrollTop = desktopConversationRef.current.scrollHeight;
      }
      if (mobileConversationRef.current) {
        mobileConversationRef.current.scrollTop = mobileConversationRef.current.scrollHeight;
      }
    };
    
    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [teachingSession?.turns.length, isJuniorThinking]);

  const onTextSubmit = () => {
    if (textInput.trim()) {
      handleTeachingTextSubmit(textInput.trim());
      setTextInput('');
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

      {/* Main Content Area - Desktop: 50/50 split with conversation on right | Mobile: Conversation focused */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Problem Content (scrollable) - 50% on desktop, hidden on mobile to show conversation */}
        <div className="hidden lg:block lg:w-1/2 overflow-y-auto px-4 py-4">
          <div className="pb-8">
            {/* Problem Title with LeetCode Number - Always on top */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
              {currentProblem?.leetcodeNumber && (
                <span className="text-purple-300">#{currentProblem.leetcodeNumber}. </span>
              )}
              {currentProblem?.title}
            </h2>
            
            {/* Problem Statement and Image - Stacked in left column */}
            <div className="flex flex-col gap-6">
              {/* Problem Statement */}
              <div className="bg-white/5 rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/10">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <BookOpen size={16} className="sm:w-5 sm:h-5 text-purple-300" />
                  <span className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-widest">Problem Statement</span>
                </div>
                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed font-light mb-6 sm:mb-8">{currentProblem?.prompt}</p>
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
          </div>
        </div>

        {/* Right Column: Conversation & Input - 50% on desktop, scrollable bottom on mobile */}
        <div className="lg:w-1/2 lg:border-l lg:border-white/10 lg:bg-black/30 flex flex-col">
          {/* Desktop: Full height conversation area */}
          <div className="hidden lg:flex flex-col h-full">
            {/* Conversation Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-purple-300" />
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Conversation</span>
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
                <span>TTS</span>
              </button>
            </div>

            {/* Conversation History - Scrollable */}
            <div ref={desktopConversationRef} className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {teachingSession?.turns.map((turn, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${turn.speaker === 'teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[90%] rounded-2xl p-3 ${
                        turn.speaker === 'teacher' 
                          ? 'bg-gold/20 border border-gold/30 text-white' 
                          : 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                          {turn.speaker === 'teacher' ? 'You (Teaching)' : 'Junior Engineer'}
                        </span>
                        {turn.speaker === 'junior' && (
                          <button 
                            onClick={() => speakJuniorResponse(turn.content)}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            title="Read aloud"
                          >
                            <Volume2 size={12} className="text-purple-300" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{turn.content}</p>
                    </div>
                  </div>
                ))}

                {/* Initial prompt if no conversation yet */}
                {(!teachingSession?.turns.length || teachingSession.turns.length === 0) && !isJuniorThinking && (
                  <div className="text-center py-8">
                    <MessageCircle size={28} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-500 text-sm italic">Start teaching the junior engineer...</p>
                    <p className="text-gray-600 text-xs mt-1">Explain the problem and your approach</p>
                  </div>
                )}

                {/* Junior thinking indicator bubble */}
                {isJuniorThinking && (
                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-2xl p-3 bg-purple-500/20 border border-purple-500/30 text-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                          Junior Engineer
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 size={14} className="animate-spin text-purple-300" />
                        <span className="text-purple-200 italic">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              {/* Input Mode Toggle */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => setInputMode('voice')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                    inputMode === 'voice'
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
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
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                      : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
                  }`}
                >
                  <Keyboard size={12} />
                  <span>Type</span>
                </button>
              </div>

              {/* Voice Recording UI */}
              {inputMode === 'voice' && isTeachingRecording ? (
                <div className="flex flex-col items-center">
                  <div className="w-full bg-white/5 backdrop-blur-2xl rounded-2xl p-3 mb-3 border border-red-500/30 min-h-[60px] max-h-[120px] overflow-y-auto text-gray-400 font-serif italic text-sm text-center">
                    {teachingRawTranscript || "Speaking..."}
                  </div>
                  <button 
                    onClick={handleStopTeachingRecording} 
                    className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl animate-pulse border-4 border-white/10 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
                  <span className="mt-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">Tap to Send</span>
                </div>
              ) : inputMode === 'voice' ? (
                // Voice mode - not recording
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleStartTeachingRecording} 
                      className="w-14 h-14 rounded-full bg-charcoal border-4 border-purple-500/30 flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-90 transition-all group"
                    >
                      <Mic size={20} className="group-hover:text-purple-300 transition-colors" />
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
              ) : (
                // Text mode UI
                <div className="flex flex-col gap-3">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your teaching response here..."
                    className="w-full bg-white/5 backdrop-blur-2xl rounded-xl p-3 border border-white/10 min-h-[100px] max-h-[200px] text-gray-200 font-serif text-sm resize-none focus:outline-none focus:border-purple-500/40 placeholder:text-gray-500 placeholder:italic"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        onTextSubmit();
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleEndTeachingSession}
                        className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:bg-white/20 hover:text-white transition-all"
                      >
                        End
                      </button>
                      <button 
                        onClick={onTextSubmit}
                        disabled={!textInput.trim()}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl border-2 transition-all ${
                          textInput.trim() 
                            ? 'bg-purple-600 hover:scale-110 active:scale-95 border-purple-500/40' 
                            : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      ⌘/Ctrl + Enter
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Full conversation-focused layout */}
          <div className="lg:hidden flex flex-col h-full">
            {/* Mobile Problem Header - Compact reference */}
            <div className="px-4 py-3 border-b border-white/10 bg-black/30">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-purple-300 shrink-0" />
                <h3 className="text-sm font-serif font-semibold truncate">
                  {currentProblem?.leetcodeNumber && (
                    <span className="text-purple-300">#{currentProblem.leetcodeNumber}. </span>
                  )}
                  {currentProblem?.title}
                </h3>
              </div>
            </div>

            {/* Conversation Header - Mobile */}
            <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-purple-300" />
                <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest">Conversation</span>
              </div>
              {/* TTS Toggle */}
              <button 
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider transition-all ${
                  ttsEnabled 
                    ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' 
                    : 'bg-white/5 border border-white/10 text-gray-500'
                }`}
              >
                {ttsEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
                <span>TTS</span>
              </button>
            </div>

            {/* Conversation History - Mobile (takes remaining space) */}
            <div ref={mobileConversationRef} className="flex-1 px-4 py-3 overflow-y-auto">
              <div className="space-y-3">
                {teachingSession?.turns.map((turn, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${turn.speaker === 'teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        turn.speaker === 'teacher' 
                          ? 'bg-gold/20 border border-gold/30 text-white' 
                          : 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                          {turn.speaker === 'teacher' ? 'You' : 'Junior'}
                        </span>
                        {turn.speaker === 'junior' && (
                          <button 
                            onClick={() => speakJuniorResponse(turn.content)}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            title="Read aloud"
                          >
                            <Volume2 size={12} className="text-purple-300" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed">{turn.content}</p>
                    </div>
                  </div>
                ))}

                {/* Initial prompt if no conversation yet */}
                {(!teachingSession?.turns.length || teachingSession.turns.length === 0) && !isJuniorThinking && (
                  <div className="text-center py-6">
                    <MessageCircle size={28} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-gray-500 text-sm italic">Start teaching the junior engineer...</p>
                    <p className="text-gray-600 text-xs mt-1">Explain the problem and your approach</p>
                  </div>
                )}

                {/* Junior thinking indicator bubble - Mobile */}
                {isJuniorThinking && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl p-3 bg-purple-500/20 border border-purple-500/30 text-purple-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                          Junior
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 size={14} className="animate-spin text-purple-300" />
                        <span className="text-purple-200 italic">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recording/Text Controls - Mobile */}
            <div className="p-4 sm:p-8 bg-gradient-to-t from-black via-black/95 to-transparent shrink-0">
              <div className="max-w-2xl mx-auto">
                {/* Mode Toggles Row */}
                <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                  {/* Input Mode Toggle */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setInputMode('voice')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all ${
                        inputMode === 'voice'
                          ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
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
                          ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                          : 'bg-white/5 border border-white/10 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      <Keyboard size={12} />
                      <span>Type</span>
                    </button>
                  </div>

                  {/* Separator */}
                  <div className="w-px h-4 bg-white/10" />

                  {/* TTS Toggle */}
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

                {/* Voice Recording UI */}
                {inputMode === 'voice' && isTeachingRecording ? (
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
                ) : inputMode === 'voice' ? (
                  // Voice mode - not recording
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
                ) : (
                  // Text mode UI - horizontal layout with send button inline
                  <div className="flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type your teaching response..."
                        className="flex-1 bg-white/5 backdrop-blur-2xl rounded-xl p-3 border border-white/10 min-h-[60px] max-h-[20vh] text-gray-200 font-serif text-sm resize-none focus:outline-none focus:border-purple-500/40 placeholder:text-gray-500 placeholder:italic"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            onTextSubmit();
                          }
                        }}
                      />
                      <button 
                        onClick={onTextSubmit}
                        disabled={!textInput.trim()}
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl border-2 transition-all shrink-0 ${
                          textInput.trim() 
                            ? 'bg-purple-600 hover:scale-110 active:scale-95 border-purple-500/40' 
                            : 'bg-gray-700 border-gray-600 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-center">
                      <button 
                        onClick={handleEndTeachingSession}
                        className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:bg-white/20 hover:text-white transition-all"
                      >
                        End Session
                      </button>
                    </div>
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

