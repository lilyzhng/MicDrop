/**
 * ReadinessRevealStep Component
 * 
 * The readiness reveal screen after Pass 1 in paired mode.
 */

import React from 'react';
import { Home, Layers } from 'lucide-react';
import { BlindProblem, ReadinessReport } from '../../types';
import ReadinessReportComponent from '../ReadinessReport';

interface ReadinessRevealStepProps {
  readinessReport: ReadinessReport;
  currentProblem: BlindProblem;
  rawTranscript: string;
  explainTranscript: string;
  dailyCleared: number;
  dailyCap: number;
  
  // Actions
  onHome: (force: boolean) => void;
  handleContinueToTeach: () => void;
  handleTryAgain: () => void;
}

export const ReadinessRevealStep: React.FC<ReadinessRevealStepProps> = ({
  readinessReport,
  currentProblem,
  rawTranscript,
  explainTranscript,
  dailyCleared,
  dailyCap,
  onHome,
  handleContinueToTeach,
  handleTryAgain
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
            <h2 className="text-base sm:text-xl font-serif font-bold text-charcoal">Pass 1 Complete</h2>
            <p className="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
              <Layers size={10} /> Paired Learning Flow
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            {dailyCleared}/{dailyCap} today
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 sm:pb-32">
        <div className="max-w-2xl mx-auto">
          <ReadinessReportComponent
            report={readinessReport}
            problemTitle={currentProblem.title}
            problem={currentProblem}
            onContinueToTeach={handleContinueToTeach}
            onTryAgain={handleTryAgain}
            rawTranscript={rawTranscript}
            refinedTranscript={explainTranscript}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadinessRevealStep;

