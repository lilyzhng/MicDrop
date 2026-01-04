/**
 * InterviewReport Component
 * 
 * Report screen for ML System Design Interview mode.
 * Different from TeachingReport - evaluates interview performance, not teaching quality.
 */

import React, { useRef } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Users,
  Download, 
  AlertTriangle, 
  RotateCcw, 
  Code2, 
  Route,
  ThumbsUp,
  ThumbsDown,
  Zap,
  FileText
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { TeachingReport, TeachingSession, Problem } from '../types';

interface InterviewReportProps {
  report: TeachingReport;
  peerSummary?: string;
  problemTitle: string;
  problem?: Problem;
  onContinue: () => void;
  onTryAgain?: () => void;
  isLastProblem: boolean;
  teachingSession?: TeachingSession;
}

const InterviewReportComponent: React.FC<InterviewReportProps> = ({
  report,
  peerSummary,
  problemTitle,
  problem,
  onContinue,
  onTryAgain,
  isLastProblem,
  teachingSession
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  // Format text with escaped newlines/tabs
  const formatText = (text: string) => {
    if (!text) return '';
    return text.replace(/\\n/g, '\n').replace(/\\t/g, '    ').trim();
  };

  // Get interview-specific data (stored in interviewData field)
  const interviewData = (report as any).interviewData || {};
  const hiringSignal = interviewData.hiringSignal || 'lean_no_hire';
  const weakDefenses = interviewData.weakDefenses || [];
  const strongMoments = interviewData.strongMoments || [];
  const areasToImprove = interviewData.areasToImprove || report.topGaps || [];
  const interviewBreakdown = interviewData.interviewBreakdown || {};

  // Map breakdown - use interview-specific fields if available, otherwise map from teaching
  const breakdown = {
    designClarity: interviewBreakdown.designClarity ?? report.breakdown.clarity ?? 0,
    choiceJustification: interviewBreakdown.choiceJustification ?? report.breakdown.correctness ?? 0,
    tradeoffAwareness: interviewBreakdown.tradeoffAwareness ?? report.breakdown.completeness ?? 0,
    probeHandling: interviewBreakdown.probeHandling ?? report.breakdown.studentMastery ?? 0,
    adaptability: interviewBreakdown.adaptability ?? report.breakdown.scaffolding ?? 0,
    depthOfKnowledge: interviewBreakdown.depthOfKnowledge ?? 5
  };

  // Hiring signal styling
  const hiringSignalConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
    'strong_hire': { label: 'Strong Hire', color: 'text-green-600', bgColor: 'bg-green-100', icon: <ThumbsUp size={20} /> },
    'hire': { label: 'Hire', color: 'text-green-500', bgColor: 'bg-green-50', icon: <ThumbsUp size={20} /> },
    'lean_hire': { label: 'Lean Hire', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: <ThumbsUp size={20} className="opacity-60" /> },
    'lean_no_hire': { label: 'Lean No Hire', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: <ThumbsDown size={20} className="opacity-60" /> },
    'no_hire': { label: 'No Hire', color: 'text-red-600', bgColor: 'bg-red-100', icon: <ThumbsDown size={20} /> }
  };

  const signalConfig = hiringSignalConfig[hiringSignal] || hiringSignalConfig['lean_no_hire'];

  // Score color helper - based on percentage of max
  const getScoreColorByPercent = (percent: number) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    if (percent >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getBarColorByPercent = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 60) return 'bg-yellow-500';
    if (percent >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Overall score color
  const getOverallScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  // Breakdown dimensions with labels and max points (total = 100)
  const breakdownItems = [
    { key: 'designClarity', label: 'Design Clarity', description: 'Was the design clearly articulated?', score: breakdown.designClarity, max: 15 },
    { key: 'choiceJustification', label: 'Choice Justification', description: 'Could you explain WHY you made each choice?', score: breakdown.choiceJustification, max: 20 },
    { key: 'tradeoffAwareness', label: 'Trade-off Awareness', description: 'Did you acknowledge trade-offs proactively?', score: breakdown.tradeoffAwareness, max: 20 },
    { key: 'probeHandling', label: 'Probe Handling', description: 'How well did you respond to challenging questions?', score: breakdown.probeHandling, max: 20 },
    { key: 'adaptability', label: 'Adaptability', description: 'Did you adjust when given new constraints?', score: breakdown.adaptability, max: 15 },
    { key: 'depthOfKnowledge', label: 'Depth of Knowledge', description: 'Real understanding vs just buzzwords?', score: breakdown.depthOfKnowledge, max: 10 }
  ];
  
  // Calculate total score from breakdown (should equal interviewScore)
  const calculatedTotal = breakdownItems.reduce((sum, item) => sum + Math.min(item.score, item.max), 0);

  const downloadReportAsImage = async () => {
    if (!reportRef.current) return;
    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#FAF9F6',
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `interview-report-${problemTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (e) {
      console.error('Failed to export report:', e);
    }
  };

  // Download full session data as JSON for detailed analysis
  const downloadSessionJSON = () => {
    if (!teachingSession) return;

    const sessionData = {
      metadata: {
        problemTitle,
        mode: 'interview',
        exportedAt: new Date().toISOString(),
        totalTurns: teachingSession.turns.length,
      },
      conversation: teachingSession.turns.map((turn, idx) => ({
        turnNumber: idx + 1,
        speaker: turn.speaker === 'teacher' ? 'candidate' : 'peer_interviewer',
        timestamp: new Date(turn.timestamp).toISOString(),
        refinedContent: turn.content,
        rawContent: turn.rawContent || null,
      })),
      evaluation: {
        interviewScore: calculatedTotal,
        breakdown: breakdown,
        hiringSignal: hiringSignal,
        strongMoments: strongMoments,
        weakDefenses: weakDefenses,
        areasToImprove: areasToImprove,
      },
      peerSummary: peerSummary || null,
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-session-${problemTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <div className="flex justify-end gap-2 flex-wrap">
        {teachingSession && (
          <button 
            onClick={downloadSessionJSON} 
            className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-sm font-medium hover:bg-emerald-100 text-emerald-700 flex items-center gap-2 shadow-sm"
            title="Download full interview session data as JSON for analysis"
          >
            <FileText size={14} /> Export JSON
          </button>
        )}
        <button 
          onClick={downloadReportAsImage} 
          className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 text-charcoal flex items-center gap-2 shadow-sm"
        >
          <Download size={14} /> Export Image
        </button>
      </div>

      {/* Exportable content wrapper */}
      <div ref={reportRef} className="space-y-6 bg-cream p-4 rounded-3xl">
        
      {/* Header Card - Interview Score + Hiring Signal */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: Title and Score */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-charcoal mb-1">{problemTitle}</h3>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">Interview Evaluation</p>
          </div>
          
          {/* Right: Interview Score */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-4xl sm:text-5xl font-bold font-mono ${getOverallScoreColor(calculatedTotal)}`}>
                {calculatedTotal}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">/ 100 pts</div>
            </div>
          </div>
        </div>
        
        {/* Hiring Signal Banner */}
        <div className={`mt-6 rounded-xl p-4 ${signalConfig.bgColor} flex items-center justify-center gap-3`}>
          <span className={signalConfig.color}>{signalConfig.icon}</span>
          <span className={`text-lg font-bold ${signalConfig.color}`}>{signalConfig.label}</span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
        <h4 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-6 flex items-center gap-2">
          <Target size={16} className="text-emerald-600" />
          Score Breakdown
        </h4>
        
        <div className="space-y-5">
          {breakdownItems.map(item => {
            const clampedScore = Math.min(Math.max(0, item.score), item.max);
            const percent = (clampedScore / item.max) * 100;
            return (
              <div key={item.key}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="font-bold text-charcoal">{item.label}</span>
                  <span className={`font-mono font-bold ${getScoreColorByPercent(percent)}`}>
                    {clampedScore}/{item.max} pts
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBarColorByPercent(percent)} transition-all duration-500`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strong Moments */}
      {strongMoments.length > 0 && (
        <div className="bg-green-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-green-200">
          <h4 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap size={16} />
            Strong Moments
          </h4>
          <ul className="space-y-3">
            {strongMoments.map((moment: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
                <span className="text-sm text-green-800">{moment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weak Defenses */}
      {weakDefenses.length > 0 && (
        <div className="bg-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-orange-200">
          <h4 className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertTriangle size={16} />
            Weak Defenses
          </h4>
          <div className="space-y-4">
            {weakDefenses.map((defense: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-orange-200">
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">What you said:</span>
                  <p className="text-sm text-orange-900 italic mt-1">"{defense.whatCandidateSaid}"</p>
                </div>
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Why it was weak:</span>
                  <p className="text-sm text-orange-800 mt-1">{defense.whyWeak}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Stronger answer:</span>
                  <p className="text-sm text-green-800 mt-1">{defense.strongerAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Areas to Improve */}
      {areasToImprove.length > 0 && (
        <div className="bg-blue-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-blue-200">
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp size={16} />
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {areasToImprove.map((area: string, idx: number) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-blue-800">
                <span className="font-bold text-blue-600">{idx + 1}.</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Peer's Summary */}
      {peerSummary && (
        <div className="bg-emerald-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-emerald-200">
          <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={16} />
            Peer's Summary
          </h4>
          <div className="bg-white rounded-xl p-4 border border-emerald-200">
            <p className="text-sm text-emerald-900 leading-relaxed italic">"{peerSummary}"</p>
          </div>
        </div>
      )}

      {/* Model Answer Section (Dark Theme) */}
      {problem && (
        <div className="bg-[#1a1a1a] rounded-2xl sm:rounded-3xl border border-[#333] overflow-hidden">
          <div className="px-6 py-3 border-b border-[#333] bg-[#222]">
            <h4 className="text-sm font-bold text-gold uppercase tracking-widest flex items-center gap-2">
              <Lightbulb size={16} /> Model Answer
            </h4>
          </div>
          
          {/* Key Insight */}
          <div className="p-6 border-b border-[#333]">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Key Insight</h5>
            <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{problem.keyIdea}</p>
          </div>

          {/* Example Walkthrough */}
          {(problem.exampleWalkthrough || problem.example) && (
            <div className="p-6 border-b border-[#333]">
              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Route size={12} /> Example Walkthrough
              </h5>
              <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                {formatText(problem.exampleWalkthrough || problem.example || '')}
              </div>
            </div>
          )}

          {/* Solution Skeleton */}
          {(problem.solution || problem.solutionSkeleton) && (
            <div>
              <div className="px-6 py-2 border-b border-[#333] flex items-center gap-2 bg-[#1a1a1a]">
                <Code2 size={14} className="text-gold" />
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Solution Skeleton</span>
              </div>
              <pre className="p-6 overflow-x-auto text-sm leading-relaxed bg-[#0d0d0d]">
                <code className="text-gray-300 font-mono whitespace-pre">
                  {formatText(problem.solutionSkeleton || problem.solution || '')}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}
      </div>
      {/* End of exportable content */}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center pt-4">
        {onTryAgain && (
          <button
            onClick={onTryAgain}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        )}
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-xl bg-charcoal text-white hover:bg-black transition-all font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
        >
          {isLastProblem ? 'Complete Session' : 'Next Problem'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default InterviewReportComponent;

