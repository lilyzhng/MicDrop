/**
 * TeachingRevealStep Component
 * 
 * The teaching reveal/report screen after teaching session.
 */

import React from 'react';
import { Home } from 'lucide-react';
import { BlindProblem, TeachingReport, TeachingSession } from '../../types';
import TeachingReportComponent from '../TeachingReport';

interface TeachingRevealStepProps {
  currentProblem: BlindProblem | null;
  teachingReport: TeachingReport;
  teachingSession: TeachingSession;
  currentQueueIdx: number;
  problemQueueLength: number;
  
  // Actions
  onHome: (force: boolean) => void;
  handleTeachingContinue: () => void;
  handleTryAgain: () => void;
  handleReEvaluate: () => void;
}

export const TeachingRevealStep: React.FC<TeachingRevealStepProps> = ({
  currentProblem,
  teachingReport,
  teachingSession,
  currentQueueIdx,
  problemQueueLength,
  onHome,
  handleTeachingContinue,
  handleTryAgain,
  handleReEvaluate
}) => {
  return (
    <div className="h-full bg-cream text-charcoal flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 md:p-8 pr-14 sm:pr-20 md:pr-24 flex items-center justify-between shrink-0 bg-white border-b border-[#E6E6E6]">
        <div className="flex items-center gap-3 sm:gap-6">
          <button onClick={() => onHome(true)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-charcoal text-white flex items-center justify-center border border-white/10 shrink-0 hover:bg-black transition-colors">
            <Home size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div>
            <h2 className="text-base sm:text-xl font-serif font-bold text-charcoal">{currentProblem?.title || 'Teaching Report'}</h2>
            <p className="text-[8px] sm:text-[10px] font-bold text-purple-600 uppercase tracking-widest">Teaching Evaluation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 sm:pb-32">
        <div className="max-w-4xl mx-auto">
          <TeachingReportComponent
            report={teachingReport}
            juniorSummary={teachingSession.juniorSummary}
            problemTitle={currentProblem?.title || ''}
            leetcodeNumber={currentProblem?.leetcodeNumber}
            problem={currentProblem || undefined}
            onContinue={handleTeachingContinue}
            onTryAgain={handleTryAgain}
            onReEvaluate={handleReEvaluate}
            isLastProblem={currentQueueIdx >= problemQueueLength - 1}
            teachingSession={teachingSession}
          />
        </div>
      </div>
    </div>
  );
};

export default TeachingRevealStep;

