/**
 * RevealStep Component
 * 
 * The reveal/report screen after explaining a solution.
 */

import React from 'react';
import { 
  Home, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert 
} from 'lucide-react';
import { Problem, PerformanceReport, SavedItem } from '../../types';
import PerformanceReportComponent from '../PerformanceReport';

interface RevealStepProps {
  currentProblem: Problem | null;
  aiReport: PerformanceReport;
  transcript: string;
  usedHints: boolean;
  isSaved: (title: string, content: string) => boolean;
  currentQueueIdx: number;
  problemQueueLength: number;
  
  // Actions
  onHome: (force: boolean) => void;
  onToggleSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
  handleContinue: () => void;
}

export const RevealStep: React.FC<RevealStepProps> = ({
  currentProblem,
  aiReport,
  transcript,
  usedHints,
  isSaved,
  currentQueueIdx,
  problemQueueLength,
  onHome,
  onToggleSave,
  handleContinue
}) => {
  const score = aiReport.detectedAutoScore || 'partial';
  
  return (
    <div className="h-full bg-cream text-charcoal flex flex-col font-sans overflow-hidden">
      {/* Header - Mobile responsive */}
      <div className="p-4 sm:p-6 md:p-8 pr-14 sm:pr-20 md:pr-24 flex items-center justify-between shrink-0 bg-white border-b border-[#E6E6E6]">
           <div className="flex items-center gap-3 sm:gap-6">
               <button onClick={() => onHome(true)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-charcoal text-white flex items-center justify-center border border-white/10 shrink-0 hover:bg-black transition-colors">
                   <Home size={20} className="sm:w-6 sm:h-6" />
               </button>
               <div>
                   <h2 className="text-base sm:text-xl font-serif font-bold text-charcoal">{currentProblem?.title || 'LeetCode Report'}</h2>
                   <p className="text-[8px] sm:text-[10px] font-bold text-gold uppercase tracking-widest">Problem Review</p>
               </div>
           </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-24 sm:pb-32">
          <div className="max-w-4xl mx-auto">
              {/* AI Verdict Card - Mobile responsive */}
              <div className="bg-charcoal text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl mb-6 sm:mb-8 flex flex-col gap-4 sm:gap-6 border border-white/10">
                  <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1 sm:mb-2">AI Verdict</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Gemini has evaluated your solution correctness.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-6">
                      {score === 'good' && (
                           <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-green-500/20 border border-green-500/50 rounded-lg sm:rounded-xl text-green-300 w-full sm:w-auto justify-center">
                               <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
                               <div className="flex flex-col text-left">
                                   <span className="font-bold uppercase tracking-widest text-xs sm:text-sm">Excellent</span>
                                   <span className="text-[9px] sm:text-[10px] opacity-70 leading-tight">1 review required</span>
                               </div>
                           </div>
                       )}
                       {score === 'partial' && (
                           <div className="flex flex-col items-center gap-1">
                               <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg sm:rounded-xl text-yellow-300 w-full sm:w-auto justify-center">
                                   <AlertCircle size={20} className="sm:w-6 sm:h-6" />
                                   <div className="flex flex-col text-left">
                                       <span className="font-bold uppercase tracking-widest text-xs sm:text-sm">Passed</span>
                                       <span className="text-[9px] sm:text-[10px] opacity-70 leading-tight">2 reviews required</span>
                                   </div>
                               </div>
                               {usedHints && aiReport && aiReport.rating >= 75 && (
                                   <span className="text-[9px] sm:text-[10px] text-yellow-400/70 italic">Hints used — try again without hints for Excellent</span>
                               )}
                           </div>
                       )}
                       {score === 'missed' && (
                           <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-red-500/20 border border-red-500/50 rounded-lg sm:rounded-xl text-red-300 w-full sm:w-auto justify-center">
                               <ShieldAlert size={20} className="sm:w-6 sm:h-6" />
                               <div className="flex flex-col text-left">
                                   <span className="font-bold uppercase tracking-widest text-xs sm:text-sm">Relearn</span>
                                   <span className="text-[9px] sm:text-[10px] opacity-70 leading-tight">Score below 70 • Try again</span>
                               </div>
                           </div>
                       )}
                       
                      <button onClick={handleContinue} className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gold text-charcoal hover:bg-white transition-all font-bold text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                         {currentQueueIdx < problemQueueLength - 1 ? 'Next' : 'Complete'} <ArrowLeft className="rotate-180 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                  </div>
              </div>

              <PerformanceReportComponent
                 report={aiReport}
                 reportType="walkie"
                 transcript={transcript}
                 context={currentProblem?.title}
                 isSaved={isSaved}
                 onToggleSave={onToggleSave}
                 onDone={() => onHome(true)}
              />
          </div>
      </div>
    </div>
  );
};

export default RevealStep;

