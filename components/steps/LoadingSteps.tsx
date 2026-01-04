/**
 * Loading Step Components
 * 
 * Simple loading/processing screens for various flow states.
 */

import React from 'react';
import { Loader2, BrainCircuit, Layers, MessageCircle, GraduationCap, Award, Sparkles, Users, Briefcase } from 'lucide-react';

type SessionMode = 'paired' | 'explain' | 'teach' | 'interview';

// Curating problems loading
export const CuratingStep: React.FC<{ spotName?: string; modeLabel: string }> = ({ spotName, modeLabel }) => (
  <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6 sm:mb-8 animate-pulse border border-gold/20">
      <Sparkles size={32} className="sm:w-12 sm:h-12" />
    </div>
    <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4 px-4">
      Entering {spotName || 'Power Spot'}
    </h2>
    <p className="text-gray-400 font-light italic leading-relaxed max-w-sm text-sm sm:text-base px-4">
      Curating 5 related {modeLabel} problems for your ritual...
    </p>
    <Loader2 size={20} className="sm:w-6 sm:h-6 mt-8 sm:mt-12 animate-spin text-gold/40" />
  </div>
);

// Analyzing explanation loading
export const AnalyzingStep: React.FC<{ phase: 'refining' | 'evaluating' }> = ({ phase }) => (
  <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-6 sm:mb-8 animate-pulse border border-gold/20">
      <BrainCircuit size={32} className="sm:w-12 sm:h-12" />
    </div>
    <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4 px-4">
      {phase === 'refining' ? 'Polishing Logic' : 'Verifying Model'}
    </h2>
    <p className="text-gray-400 font-light italic leading-relaxed max-w-sm text-sm sm:text-base px-4">
      {phase === 'refining' ? "Refining speech data..." : "Checking Logic, Complexity, and Examples..."}
    </p>
    <Loader2 size={20} className="sm:w-6 sm:h-6 mt-8 sm:mt-12 animate-spin text-gold/40" />
  </div>
);

// Readiness evaluation loading
export const ReadinessEvaluatingStep: React.FC = () => (
  <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-300 mb-6 sm:mb-8 animate-pulse border border-blue-500/20">
      <Layers size={32} className="sm:w-12 sm:h-12" />
    </div>
    <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4 px-4">
      Checking Readiness to Teach
    </h2>
    <p className="text-gray-400 font-light italic leading-relaxed max-w-sm text-sm sm:text-base px-4">
      Evaluating your mental model: core insight, state definitions, examples, edge cases, complexity...
    </p>
    <Loader2 size={20} className="sm:w-6 sm:h-6 mt-8 sm:mt-12 animate-spin text-blue-400/40" />
  </div>
);

// Junior thinking/processing loading
export const JuniorThinkingStep: React.FC = () => (
  <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-300 mb-6 sm:mb-8 animate-pulse border border-purple-500/20">
      <MessageCircle size={32} className="sm:w-12 sm:h-12" />
    </div>
    <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4 px-4">Junior is Thinking...</h2>
    <p className="text-gray-400 font-light italic leading-relaxed max-w-sm text-sm sm:text-base px-4">
      Processing what you taught and forming a question...
    </p>
    <Loader2 size={20} className="sm:w-6 sm:h-6 mt-8 sm:mt-12 animate-spin text-purple-400/40" />
  </div>
);

// Junior/Peer summarizing loading
export const JuniorSummarizingStep: React.FC<{ sessionMode?: SessionMode }> = ({ sessionMode = 'teach' }) => {
  const isInterview = sessionMode === 'interview';
  
  return (
    <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
      <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-pulse border ${
        isInterview 
          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
          : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
      }`}>
        {isInterview ? (
          <Users size={32} className="sm:w-12 sm:h-12" />
        ) : (
          <GraduationCap size={32} className="sm:w-12 sm:h-12" />
        )}
      </div>
      <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4 px-4">
        {isInterview ? 'Peer Wrapping Up...' : 'Junior Summarizing...'}
      </h2>
      <p className="text-gray-400 font-light italic leading-relaxed max-w-sm text-sm sm:text-base px-4">
        {isInterview 
          ? 'The peer is summarizing the key points from your discussion...'
          : 'The junior is restating what they learned in their own words...'}
      </p>
      <Loader2 size={20} className={`sm:w-6 sm:h-6 mt-8 sm:mt-12 animate-spin ${
        isInterview ? 'text-emerald-400/40' : 'text-purple-400/40'
      }`} />
    </div>
  );
};

// Dean/Hiring Manager evaluating loading
export const DeanEvaluatingStep: React.FC<{ sessionMode?: SessionMode }> = ({ sessionMode = 'teach' }) => {
  const isInterview = sessionMode === 'interview';
  
  return (
    <div className="h-full bg-charcoal text-white flex flex-col items-center justify-center p-6 sm:p-8 text-center">
      <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-pulse border ${
        isInterview
          ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
          : 'bg-gold/10 text-gold border-gold/20'
      }`}>
        {isInterview ? (
          <Briefcase size={32} className="sm:w-12 sm:h-12" />
        ) : (
          <Award size={32} className="sm:w-12 sm:h-12" />
        )}
      </div>
      <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4 px-4">
        {isInterview ? 'Hiring Manager Evaluating...' : 'The Dean is Evaluating...'}
      </h2>
      <p className="text-gray-400 font-light italic leading-relaxed max-w-sm text-sm sm:text-base px-4">
        {isInterview
          ? 'Assessing your interview performance and design defense...'
          : 'Assessing your teaching effectiveness...'}
      </p>
      <Loader2 size={20} className={`sm:w-6 sm:h-6 mt-8 sm:mt-12 animate-spin ${
        isInterview ? 'text-blue-400/40' : 'text-gold/40'
      }`} />
    </div>
  );
};
