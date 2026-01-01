/**
 * SpotCard Component
 * 
 * Renders a practice spot card (The Daily Commute, Coffee Sanctuary, or Mysterious Forest).
 * Handles styling variations based on spot type.
 */

import React from 'react';
import { 
  ChevronRight, 
  Sparkles, 
  Lock, 
  Target, 
  AlertCircle, 
  RefreshCw,
  Coffee,
  Trees,
  Train,
  Zap,
  Building2,
  HeartHandshake
} from 'lucide-react';
import { SpotCardProps, SpotWithTopic, DAILY_NEW_GOAL, QUESTIONS_TO_UNLOCK } from './spotTypes';

// Get the appropriate icon for a spot
const getSpotIcon = (icon: string) => {
  const iconSize = 28;
  switch (icon) {
    case 'coffee':
      return <Coffee size={iconSize} className="sm:w-8 sm:h-8" />;
    case 'forest':
      return <Trees size={iconSize} className="sm:w-8 sm:h-8" />;
    case 'train':
      return <Train size={iconSize} className="sm:w-8 sm:h-8" />;
    case 'building':
      return <Building2 size={iconSize} className="sm:w-8 sm:h-8" />;
    case 'playground':
      return <HeartHandshake size={iconSize} className="sm:w-8 sm:h-8" />;
    default:
      return <Target size={iconSize} className="sm:w-8 sm:h-8" />;
  }
};

// Get container styles based on spot type
const getContainerStyles = (spot: SpotWithTopic): string => {
  if (spot.remaining === 0) {
    return 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed';
  }
  
  // Only forest gets special emerald styling
  // Everything else (including Daily Commute) uses the default neutral styling
  // The "reviews due" badge handles the red alert - no need for entire card to be red
  if (spot.isRandom) {
    return 'bg-emerald-950/30 border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-900/40';
  }
  
  return 'bg-white/5 border-white/5 hover:border-gold/40 hover:bg-gold/5';
};

// Get icon container styles
const getIconContainerStyles = (spot: SpotWithTopic): string => {
  // Only forest gets special emerald styling, everything else uses default
  if (spot.isRandom) {
    return 'bg-emerald-900/50 border-emerald-500/30 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-400 group-hover:text-charcoal';
  }
  return 'bg-charcoal border-white/10 text-white group-hover:scale-110 group-hover:bg-gold group-hover:text-charcoal';
};

// Get ritual label color
const getRitualColor = (spot: SpotWithTopic): string => {
  // Only forest gets emerald, everything else uses gold
  if (spot.isRandom) {
    return 'text-emerald-400';
  }
  return 'text-gold';
};

// Get topic tag styles
const getTopicTagStyles = (spot: SpotWithTopic): string => {
  if (spot.isRandom) {
    return 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300';
  }
  if (spot.locked) {
    return 'bg-amber-500/20 border border-amber-500/30 text-amber-300';
  }
  return 'bg-blue-500/20 border border-blue-500/30 text-blue-300';
};

// Get chevron container styles
const getChevronContainerStyles = (spot: SpotWithTopic): string => {
  // Only forest gets emerald, everything else uses default
  if (spot.isRandom) {
    return 'bg-emerald-500/10 text-emerald-500 group-hover:text-emerald-300';
  }
  return 'bg-white/5 text-gray-500 group-hover:text-gold';
};

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  studyStats,
  onStartSession,
  onRefresh,
  companies = [],
  isLoadingCompanies = false,
  onCompanySelect
}) => {
  const canRefresh = !spot.isRandom && !spot.locked && spot.remaining > 0 && !spot.onlyReviews && !spot.isCompanySpecific;
  const canCycleCompany = spot.isCompanySpecific && companies.length > 0 && !isLoadingCompanies;

  const handleClick = () => {
    // For company-specific spots, only proceed if a company is selected
    if (spot.isCompanySpecific && !spot.selectedCompanyId) {
      return; // Company must be selected first
    }
    if (spot.remaining > 0 || spot.isCompanySpecific) {
      onStartSession(spot);
    }
  };

  const handleRefresh = (e: React.MouseEvent) => {
    if (onRefresh) {
      onRefresh(spot.id, e);
    }
  };

  const handleCompanyCycle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger spot click
    if (companies.length === 0) return;
    
    const currentIndex = spot.selectedCompanyId 
      ? companies.findIndex(c => c.id === spot.selectedCompanyId)
      : -1;
    
    const nextIndex = (currentIndex + 1) % companies.length;
    const nextCompany = companies[nextIndex];
    
    if (nextCompany && onCompanySelect) {
      onCompanySelect(spot.id, nextCompany.id, nextCompany.name);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={spot.remaining === 0}
      className={`w-full rounded-2xl sm:rounded-[2.5rem] border-2 p-4 sm:p-6 md:p-8 flex items-center gap-4 sm:gap-6 md:gap-8 text-left transition-all group ${getContainerStyles(spot)}`}
    >
      {/* Icon */}
      <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl border flex items-center justify-center transition-all shrink-0 ${getIconContainerStyles(spot)}`}>
        {getSpotIcon(spot.icon)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Ritual label */}
        <div className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5 sm:mb-1 ${getRitualColor(spot)}`}>
          {spot.ritual}
        </div>

        {/* Spot name */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold mb-1 sm:mb-1.5 truncate">
          {spot.name}
        </h3>

        {/* Topic Tag Row */}
        <div className="flex items-center gap-2 mb-1 sm:mb-1.5 flex-wrap">
          {/* 1. Shuffle button - at the front for unlocked, non-random spots OR company cycle button */}
          {canRefresh && (
            <button
              onClick={handleRefresh}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all"
              title={`Shuffle ${spot.name} topic`}
            >
              <RefreshCw size={10} className="sm:w-3 sm:h-3" />
            </button>
          )}
          
          {/* Company cycle button for Himmel Park */}
          {canCycleCompany && (
            <button
              onClick={handleCompanyCycle}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all"
              title="Change company"
            >
              <RefreshCw size={10} className="sm:w-3 sm:h-3" />
            </button>
          )}

          {/* 2. Topic badge - hide for company-specific spots (they show company name instead) */}
          {!spot.isCompanySpecific && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium ${getTopicTagStyles(spot)}`}>
              {spot.isRandom ? (
                <Sparkles size={10} className="sm:w-3 sm:h-3" />
              ) : spot.locked ? (
                <Lock size={10} className="sm:w-3 sm:h-3" />
              ) : (
                <Target size={10} className="sm:w-3 sm:h-3" />
              )}
              {spot.topicDisplay}
            </span>
          )}
          
          {/* 2b. Company badge for Himmel Park - shows selected company */}
          {spot.isCompanySpecific && spot.selectedCompanyName && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium ${getTopicTagStyles(spot)}`}>
              <Target size={10} className="sm:w-3 sm:h-3" />
              {spot.selectedCompanyName}
            </span>
          )}

          {/* 3. Remaining count for this topic - show for non-reviews, non-company-specific spots */}
          {!spot.onlyReviews && !spot.isCompanySpecific && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium ${
              spot.remaining === 0 
                ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                : 'bg-gray-500/20 border border-gray-500/30 text-gray-300'
            }`}>
              {spot.remaining === 0 ? '✓ topic done' : `${spot.remaining} in topic`}
            </span>
          )}
          
          {/* 3b. Unlock progress for locked newProblemsOnly spots (Coffee Sanctuary) */}
          {spot.newProblemsOnly && spot.locked && (spot.questionsAnswered || 0) > 0 && (spot.questionsAnswered || 0) < QUESTIONS_TO_UNLOCK && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-purple-500/20 border border-purple-500/30 text-purple-300">
              {spot.questionsAnswered}/{QUESTIONS_TO_UNLOCK} to unlock
            </span>
          )}
          
          {/* 3b. Question count for Himmel Park - shows when company is selected */}
          {spot.isCompanySpecific && spot.selectedCompanyId && spot.remaining > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-gray-500/20 border border-gray-500/30 text-gray-300">
              {spot.remaining} question{spot.remaining !== 1 ? 's' : ''} due
            </span>
          )}


          {/* 4. Reviews Priority Badge (for Daily Commute) - p=1 priority */}
          {spot.reviewsPriority && (spot.onlyReviews ? spot.remaining > 0 : (studyStats && studyStats.dueToday > 0)) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-red-500/20 border border-red-500/40 text-red-300 animate-pulse">
              <AlertCircle size={10} className="sm:w-3 sm:h-3" />
              {spot.onlyReviews ? spot.remaining : studyStats?.dueToday} review{(spot.onlyReviews ? spot.remaining : studyStats?.dueToday) !== 1 ? 's' : ''} due
            </span>
          )}

          {/* 5. Daily New Goal Badge (for Coffee Sanctuary) - p=0 priority (highest) - AT THE END */}
          {/* Reminder: pass 5 new questions per day. Shows how many more needed. */}
          {spot.newProblemsOnly && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold ${
              (spot.dailyNewRemaining ?? DAILY_NEW_GOAL) > 0 
                ? 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 animate-pulse' 
                : 'bg-green-500/20 border border-green-500/40 text-green-300'
            }`}>
              <Zap size={10} className="sm:w-3 sm:h-3" />
              {(spot.dailyNewRemaining ?? DAILY_NEW_GOAL) > 0 
                ? `${spot.dailyNewRemaining ?? DAILY_NEW_GOAL} new due`
                : `✓ ${DAILY_NEW_GOAL} done!`
              }
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed line-clamp-1">
          {spot.description}
        </p>
      </div>

      {/* Chevron */}
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${getChevronContainerStyles(spot)}`}>
        <ChevronRight size={16} className="sm:w-5 sm:h-5" />
      </div>
    </button>
  );
};

export default SpotCard;

