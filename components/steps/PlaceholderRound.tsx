/**
 * PlaceholderRound Component
 * 
 * A placeholder component for End Game rounds that are not yet implemented.
 * Currently used for ML System Design round.
 * 
 * Uses the unified onRoundComplete callback pattern.
 */

import React from 'react';
import { Construction, ArrowRight, User } from 'lucide-react';
import { PerformanceReport, EndGameRoundConfig } from '../../types';

interface PlaceholderRoundProps {
  roundConfig: EndGameRoundConfig;
  roundNumber: number;
  totalRounds: number;
  onRoundComplete: (report: PerformanceReport) => void;
  onExit?: () => void;
}

export const PlaceholderRound: React.FC<PlaceholderRoundProps> = ({
  roundConfig,
  roundNumber,
  totalRounds,
  onRoundComplete,
  onExit
}) => {
  const handleContinue = () => {
    // Create a placeholder report with minimal data
    const placeholderReport: PerformanceReport = {
      rating: 0,
      summary: `[Placeholder] ${roundConfig.title} - Module not yet implemented`,
      suggestions: [],
      pronunciationFeedback: [],
    };
    
    onRoundComplete(placeholderReport);
  };

  return (
    <div className="h-full bg-charcoal text-white flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-white/10 bg-black/20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
            <Construction className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-0.5">
              Round {roundNumber} of {totalRounds}
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-tight">
              {roundConfig.title}
            </h2>
          </div>
        </div>
        
        {onExit && (
          <button
            onClick={onExit}
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Exit Simulation
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <Construction className="w-12 h-12 text-gold" />
          </div>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
            Module Coming Soon
          </h1>
          
          {/* Description */}
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            The <span className="text-gold font-semibold">{roundConfig.title}</span> module 
            is still under development. For now, you can continue to the next round.
          </p>
          
          {/* Judge/Persona Info */}
          {(roundConfig.judge || roundConfig.persona) && (
            <div className="flex items-center justify-center gap-2 mb-10 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>
                {roundConfig.persona ? `Persona: ${roundConfig.persona}` : `Judge: ${roundConfig.judge}`}
              </span>
            </div>
          )}
          
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="group px-8 py-4 bg-gold text-charcoal rounded-full font-bold uppercase text-sm tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            Continue to Next Round
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Footer Progress Indicator */}
      <div className="p-6 border-t border-white/10 bg-black/20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Simulation Progress</span>
            <span>{roundNumber} / {totalRounds}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${(roundNumber / totalRounds) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderRound;

