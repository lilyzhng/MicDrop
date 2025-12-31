
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Award, PenTool, Quote, Lightbulb, Bookmark, ThumbsUp, Star, Ear, AlertCircle, Mic2, FileText, MessageCircleQuestion, Target, Sparkles, Zap, History, MessageSquare, Code, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { PerformanceReport as ReportType, SavedItem } from '../types';
import html2canvas from 'html2canvas';

type ReportDisplayType = 'walkie' | 'hot-take' | 'teach' | 'readiness' | 'system-coding' | 'role-fit';

interface PerformanceReportProps {
    report: ReportType;
    reportType?: ReportDisplayType; // Explicitly set report type for display
    transcript?: string;
    context?: string; // Interview context/question
    isSaved: (title: string, content: string) => boolean;
    onToggleSave: (item: Omit<SavedItem, 'id' | 'date'>) => void;
    onDone: (force: boolean) => void;
}

// Report display configuration
const REPORT_CONFIG: Record<ReportDisplayType, { title: string; subtitle: string; icon: string }> = {
    'hot-take': { title: 'Tech Drill Report', subtitle: 'Hot Take Protocol', icon: 'zap' },
    'walkie': { title: 'LeetCode Report', subtitle: 'Algorithm Analysis', icon: 'code' },
    'teach': { title: 'Teaching Report', subtitle: 'Teach Mode', icon: 'graduation-cap' },
    'readiness': { title: 'Explain Report', subtitle: 'Readiness Check', icon: 'layers' },
    'system-coding': { title: 'System Coding Report', subtitle: 'System Design Implementation', icon: 'code' },
    'role-fit': { title: 'Role Fit Report', subtitle: 'Role Fit / Why Me', icon: 'award' }
};

// Helper to create report data context for saving
const createReportContext = (report: ReportType, transcript?: string, context?: string) => ({
    report,
    transcript,
    context
});

const PerformanceReport: React.FC<PerformanceReportProps> = ({ report, reportType, transcript, context, isSaved, onToggleSave, onDone }) => {
    const { rating, summary, detailedFeedback, highlights, pronunciationFeedback, coachingRewrite, flipTheTable, hotTakeRubric, hotTakeMasterRewrite, hotTakeHistory, hotTakeRounds, mentalModelChecklist, missingEdgeCases, rubricScores, codingRubric, codeIssues, problemSolvingTimeline, codingQuestion, solutionCode, correctedSolution, codeLanguage, formattedProblemStatement, nextTimeHabits, interpretationLayer } = report;
    const [showRewrite, setShowRewrite] = useState(false);
    const [activeHotTakeRound, setActiveHotTakeRound] = useState<'round1' | 'round2'>('round1');
    const [showProblemStatement, setShowProblemStatement] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const reportRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Determine report type: explicit prop > auto-detect from content
    const isHotTake = !!hotTakeRubric || !!hotTakeRounds;
    const isWalkie = !!rubricScores || !!mentalModelChecklist || !!missingEdgeCases;
    const isCoding = !!codingRubric;
    const effectiveReportType: ReportDisplayType = reportType || (isCoding ? 'system-coding' : isHotTake ? 'hot-take' : isWalkie ? 'walkie' : 'role-fit');
    const reportConfig = REPORT_CONFIG[effectiveReportType];
    
    // Determine active data for Hot Take
    const currentRoundData = hotTakeRounds ? hotTakeRounds[activeHotTakeRound] : null;
    
    // Legacy fallback for rubric
    const displayedRubric = currentRoundData ? currentRoundData.rubric : hotTakeRubric;
    
    // CALCULATE SCORE: Sum the rubric values to ensure accuracy
    const calculatedScore = displayedRubric 
        ? Math.round(Object.values(displayedRubric).reduce((sum: number, val) => sum + (Number(val) || 0), 0))
        : Math.round(currentRoundData ? currentRoundData.score : rating);

    const displayedSummary = currentRoundData ? currentRoundData.critique : summary;
    const displayedRewrite = currentRoundData ? currentRoundData.rewrite : hotTakeMasterRewrite;
    const displayedQuestion = currentRoundData ? currentRoundData.question : null;
    const displayedTranscript = currentRoundData ? currentRoundData.transcript : null;

    const formatRubricLabel = (key: string) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    // Remove consistent leading whitespace from code (dedent)
    const dedentCode = (code: string | undefined): string => {
        if (!code) return '';
        const lines = code.split('\n');
        // Find minimum indentation (ignoring empty lines)
        const minIndent = lines
            .filter(line => line.trim().length > 0)
            .reduce((min, line) => {
                const match = line.match(/^(\s*)/);
                const indent = match ? match[1].length : 0;
                return Math.min(min, indent);
            }, Infinity);
        // Remove that indentation from all lines
        if (minIndent === Infinity || minIndent === 0) return code.trim();
        return lines.map(line => line.slice(minIndent)).join('\n').trim();
    };

    const downloadReportAsImage = async () => {
        if (!reportRef.current) return;
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                backgroundColor: isCoding ? '#1a1a1a' : '#FAF9F6',
                useCORS: true,
                windowWidth: 1920
            });
            const url = canvas.toDataURL("image/png");
            const a = document.createElement('a');
            a.href = url;
            a.download = `performance-report-${new Date().toISOString().split('T')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Snapshot failed:", error);
            alert("Could not save image.");
        }
    };

    const downloadTranscript = () => {
        let textToDownload = transcript || "";
        
        if (hotTakeRounds) {
            textToDownload = `ROUND 1: ${hotTakeRounds.round1.question}\nANSWER: ${hotTakeRounds.round1.transcript}\n\nROUND 2: ${hotTakeRounds.round2.question}\nANSWER: ${hotTakeRounds.round2.transcript}`;
        } else if (hotTakeHistory) {
            textToDownload = hotTakeHistory.map(t => `${t.stage.toUpperCase()}: ${t.query}\nYOU: ${t.response}\n`).join('\n\n');
        }
        
        if (!textToDownload) return;
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div ref={reportRef} className="min-h-full">
            {/* Header - Mobile responsive */}
            <div className={`mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div>
                     <div className="flex items-center gap-2 text-gold text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 sm:mb-2">
                        <Award size={12} className="sm:w-3.5 sm:h-3.5" /> {reportConfig.subtitle}
                     </div>
                     <h2 className={`text-2xl sm:text-4xl font-serif font-bold ${isCoding ? 'text-gray-200' : 'text-charcoal'}`}>{reportConfig.title}</h2>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {(transcript || hotTakeHistory || hotTakeRounds) && (
                        <button onClick={downloadTranscript} className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 ${
                            isCoding ? 'bg-[#252525] border-[#333] hover:bg-[#2a2a2a] text-gray-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-charcoal'
                        }`}>
                            <FileText size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Download</span> Transcript
                        </button>
                    )}
                    <button onClick={downloadReportAsImage} className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 ${
                        isCoding ? 'bg-[#252525] border-[#333] hover:bg-[#2a2a2a] text-gray-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-charcoal'
                    }`}>
                        <Download size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Export</span> Image
                    </button>
                    <button onClick={() => onDone(true)} className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
                        isCoding ? 'bg-gold text-[#1a1a1a] hover:bg-gold/90' : 'bg-charcoal text-white hover:bg-black'
                    }`}>
                        Done
                    </button>
                </div>
            </div>
            
            {/* PROBLEM STATEMENT - Collapsed by default, anchors the report */}
            {codingQuestion && isCoding && (
                <div className="mb-6 sm:mb-8">
                    <button 
                        onClick={() => setShowProblemStatement(!showProblemStatement)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl hover:bg-[#252525] transition-colors group"
                    >
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-widest uppercase">
                            <FileText size={14} /> Problem Statement
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-[10px] opacity-60">{showProblemStatement ? 'Hide' : 'Show'}</span>
                            {showProblemStatement ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    </button>
                    {showProblemStatement && (
                        <div className="mt-2 bg-[#1e1e1e] rounded-xl p-4 sm:p-6 border border-[#2a2a2a] animate-in fade-in slide-in-from-top-2 duration-200">
                            {formattedProblemStatement ? (
                                <div className="space-y-3">
                                    {formattedProblemStatement.title && (
                                        <h3 className="text-base font-bold text-gray-200 mb-3">{formattedProblemStatement.title}</h3>
                                    )}
                                    {formattedProblemStatement.sections.map((section, idx) => {
                                        switch (section.type) {
                                            case 'heading':
                                                return <h4 key={idx} className="text-sm font-bold text-gray-300 mt-4 mb-2 first:mt-0">{section.content}</h4>;
                                            case 'paragraph':
                                                return <p key={idx} className="text-sm text-gray-400 leading-relaxed">{section.content}</p>;
                                            case 'code':
                                                return <pre key={idx} className="bg-[#0a0a0a] p-3 rounded-lg border border-[#1e1e1e] overflow-x-auto"><code className="text-xs font-mono text-gray-300">{section.content}</code></pre>;
                                            case 'example':
                                                return (
                                                    <div key={idx} className="bg-[#252525] border-l-2 border-gray-600 p-3 rounded-r-lg">
                                                        {section.label && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{section.label}</p>}
                                                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">{section.content}</pre>
                                                    </div>
                                                );
                                            case 'list':
                                            case 'constraint':
                                                return (
                                                    <div key={idx} className="space-y-1 ml-2">
                                                        {section.items && section.items.length > 0 ? (
                                                            section.items.map((item, itemIdx) => (
                                                                <div key={itemIdx} className="flex items-start gap-2">
                                                                    <span className="text-gray-500 mt-1">•</span>
                                                                    <p className="text-sm text-gray-400">{item}</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="text-sm text-gray-400">{section.content}</p>
                                                        )}
                                                    </div>
                                                );
                                            default:
                                                return <p key={idx} className="text-sm text-gray-400 leading-relaxed">{section.content}</p>;
                                        }
                                    })}
                                </div>
                            ) : (
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">{codingQuestion}</pre>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* HOT TAKE TABS - Mobile responsive */}
            {hotTakeRounds && (
                <div className="flex justify-center mb-6 sm:mb-8">
                     <div className="bg-white p-1 sm:p-1.5 rounded-full border border-[#E6E6E6] flex gap-1 sm:gap-2 shadow-sm">
                          <button 
                            onClick={() => setActiveHotTakeRound('round1')}
                            className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest transition-all ${activeHotTakeRound === 'round1' ? 'bg-charcoal text-white shadow-md' : 'text-gray-400 hover:text-charcoal'}`}
                          >
                             Round 1
                          </button>
                          <button 
                            onClick={() => setActiveHotTakeRound('round2')}
                            className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest transition-all ${activeHotTakeRound === 'round2' ? 'bg-gold text-white shadow-md' : 'text-gray-400 hover:text-gold'}`}
                          >
                             Round 2
                          </button>
                     </div>
                </div>
            )}

            {/* Executive Summary Card - Mobile responsive */}
            <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start animate-in fade-in duration-300 ${
                isCoding ? 'bg-[#1e1e1e] border border-[#2a2a2a]' : 'bg-white border border-[#EBE8E0]'
            }`} key={activeHotTakeRound}>
                 <div className="shrink-0 relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#C7A965 ${isHotTake ? calculatedScore : rating}%, ${isCoding ? '#2a2a2a' : '#F0EBE0'} ${isHotTake ? calculatedScore : rating}% 100%)` }}></div>
                      <div className={`absolute inset-1.5 sm:inset-2 rounded-full flex flex-col items-center justify-center z-10 ${isCoding ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                          <span className={`text-2xl sm:text-4xl font-serif font-bold ${isCoding ? 'text-gold' : 'text-charcoal'}`}>{isHotTake ? calculatedScore : rating}</span>
                          <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-widest ${isCoding ? 'text-gray-500' : 'text-gray-400'}`}>/ 100</span>
                      </div>
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                      <h3 className={`text-lg sm:text-xl font-serif font-bold mb-2 sm:mb-3 ${isCoding ? 'text-gray-200' : 'text-charcoal'}`}>Executive Summary</h3>
                      <p className={`leading-relaxed whitespace-pre-line text-sm sm:text-base ${isCoding ? 'text-gray-400' : 'text-gray-600'}`}>{isHotTake ? displayedSummary : summary}</p>
                      
                      {coachingRewrite && !isHotTake && (
                        <div className="mt-6">
                            <button 
                                onClick={() => setShowRewrite(!showRewrite)}
                                className="text-sm font-bold text-gold hover:text-charcoal transition-colors flex items-center gap-2"
                            >
                                <PenTool size={14} /> {showRewrite ? 'Hide Story Rewrite' : 'View Story Rewrite'}
                            </button>

                            {showRewrite && (
                                <div className="mt-4 bg-[#FAF9F6] border-l-4 border-gold p-6 rounded-r-xl animate-in slide-in-from-top-2">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                                            <Quote size={14} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-1">The Diagnosis</h4>
                                            <p className="text-gray-600 italic text-sm">{coachingRewrite.diagnosis}</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                         <h4 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-2">The Fix</h4>
                                         <p className="text-gray-700 text-sm">{coachingRewrite.fix}</p>
                                    </div>
                                    <div>
                                         <h4 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-2">The Human Rewrite</h4>
                                         <div className="text-charcoal font-serif text-lg leading-relaxed pl-4 border-l-2 border-gray-200">
                                            "{coachingRewrite.rewrite}"
                                         </div>
                                    </div>
                                </div>
                            )}
                        </div>
                      )}
                 </div>
            </div>

            {/* INTERPRETATION LAYER - Bridges summary to evidence */}
            {isCoding && interpretationLayer && (
                <div className="mb-6 sm:mb-8 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-4 sm:p-6">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <AlertCircle size={12} className="text-red-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest">Primary Failure Mode</span>
                                <p className="text-sm text-gray-300 mt-1">{interpretationLayer.primaryFailureMode}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Target size={12} className="text-emerald-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Highest Impact Fix</span>
                                <p className="text-sm text-gray-300 mt-1">{interpretationLayer.biggestImpactFix}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Sparkles size={12} className="text-blue-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest">Overall Signal</span>
                                <p className="text-sm text-gray-300 mt-1">{interpretationLayer.overallSignal}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HOT TAKE SPECIFIC SECTIONS --- */}
            
            {/* 1. Hot Take Rubric - Mobile responsive */}
            {displayedRubric && isHotTake && (
                <div className="mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300" key={`rubric-${activeHotTakeRound}`}>
                     <div className="mb-3 sm:mb-4 flex items-center gap-2 text-charcoal text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        <Star size={12} className="sm:w-3.5 sm:h-3.5" /> Surgical Rubric
                     </div>
                     <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#EBE8E0] shadow-sm">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-8">
                             {Object.entries(displayedRubric).map(([key, val]) => (
                                <div key={key} className="space-y-1.5 sm:space-y-2">
                                    <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                        <span className="text-gray-500">{formatRubricLabel(key)}</span>
                                        <span className="text-gold">{val} / 25</span>
                                    </div>
                                    <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gold" style={{ width: `${(Number(val) || 0) * 4}%` }}></div>
                                    </div>
                                </div>
                             ))}
                         </div>
                     </div>
                </div>
            )}

            {/* Coding Interview Rubric */}
            {codingRubric && isCoding && (
                <div className="mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="mb-3 sm:mb-4 flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        <Star size={12} className="sm:w-3.5 sm:h-3.5" /> Coding Interview Rubric
                     </div>
                     <div className="bg-[#1e1e1e] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#2a2a2a]">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-12 sm:gap-y-8">
                             {/* 1. Problem Understanding */}
                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                    <span className="text-gray-400">Problem Understanding</span>
                                    <span className="text-gold">
                                        {codingRubric.problemUnderstanding} / 25
                                    </span>
                                </div>
                                <div className="h-1.5 sm:h-2 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                                    <div className="h-full bg-gold" style={{ width: `${(codingRubric.problemUnderstanding / 25) * 100}%` }}></div>
                                </div>
                                <p className="text-[8px] sm:text-[9px] text-gray-500/70">Understand before you code</p>
                            </div>
                            
                            {/* 2. Communication */}
                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                    <span className="text-gray-400">Communication</span>
                                    {codingRubric.communication === null ? (
                                        <span className="text-gray-500">Not Assessed</span>
                                    ) : (
                                        <span className="text-gold">
                                            {codingRubric.communication} / 25
                                        </span>
                                    )}
                                </div>
                                {codingRubric.communication !== null ? (
                                    <div className="h-1.5 sm:h-2 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                                        <div className="h-full bg-gold" style={{ width: `${(codingRubric.communication / 25) * 100}%` }}></div>
                                    </div>
                                ) : (
                                    <div className="h-1.5 sm:h-2 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#333] w-full"></div>
                                    </div>
                                )}
                                <p className="text-[8px] sm:text-[9px] text-gray-500/70">
                                    {codingRubric.communication === null 
                                        ? 'No transcript provided' 
                                        : 'Think out loud with your interviewer'}
                                </p>
                            </div>
                            
                            {/* 3. Algorithm & Complexity */}
                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                    <span className="text-gray-400">Algorithm & Complexity</span>
                                    <span className="text-gold">
                                        {codingRubric.solutionApproach} / 25
                                    </span>
                                </div>
                                <div className="h-1.5 sm:h-2 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                                    <div className="h-full bg-gold" style={{ width: `${(codingRubric.solutionApproach / 25) * 100}%` }}></div>
                                </div>
                                <p className="text-[8px] sm:text-[9px] text-gray-500/70">Pseudocode first, explain your approach</p>
                            </div>
                            
                            {/* 4. Edge Cases & Bugs */}
                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                    <span className="text-gray-400">Edge Cases & Bugs</span>
                                    <span className="text-gold">
                                        {codingRubric.functionalCorrectness} / 20
                                    </span>
                                </div>
                                <div className="h-1.5 sm:h-2 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                                    <div className="h-full bg-gold" style={{ width: `${(codingRubric.functionalCorrectness / 20) * 100}%` }}></div>
                                </div>
                                <p className="text-[8px] sm:text-[9px] text-gray-500/70">Don't break on corners</p>
                            </div>
                            
                            {/* 5. Code Quality */}
                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                    <span className="text-gray-400">Code Quality</span>
                                    <span className="text-gold">
                                        {codingRubric.codeHygiene} / 5
                                    </span>
                                </div>
                                <div className="h-1.5 sm:h-2 w-full bg-[#2a2a2a] rounded-full overflow-hidden">
                                    <div className="h-full bg-gold" style={{ width: `${(codingRubric.codeHygiene / 5) * 100}%` }}></div>
                                </div>
                                <p className="text-[8px] sm:text-[9px] text-gray-500/70">Write code humans like</p>
                            </div>
                         </div>
                     </div>
                </div>
            )}

            {/* Problem Solving Timeline - Collapsible with phase summary */}
            {problemSolvingTimeline && problemSolvingTimeline.length > 0 && isCoding && (() => {
                // Group timeline by phases
                const phases = problemSolvingTimeline.reduce((acc, moment) => {
                    const phase = moment.category === 'clarification' ? 'Clarification' :
                                  moment.category === 'approach' ? 'Approach' :
                                  (moment.category === 'coding_start' || moment.category === 'coding_main') ? 'Coding' :
                                  moment.category === 'debugging' ? 'Debugging' : 'Other';
                    if (!acc[phase]) acc[phase] = [];
                    acc[phase].push(moment);
                    return acc;
                }, {} as Record<string, typeof problemSolvingTimeline>);
                
                const phaseOrder = ['Clarification', 'Approach', 'Coding', 'Debugging', 'Other'];
                const orderedPhases = phaseOrder.filter(p => phases[p] && phases[p].length > 0);
                
                return (
                    <div className="mb-8 sm:mb-12">
                        <button 
                            onClick={() => toggleSection('timeline')}
                            className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl hover:bg-[#252525] transition-colors"
                        >
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-widest uppercase">
                                <History size={14} /> Problem-Solving Timeline
                                <span className="text-gray-600 font-normal normal-case">({problemSolvingTimeline.length} events)</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                {/* Phase summary pills */}
                                <div className="hidden sm:flex gap-1.5">
                                    {orderedPhases.map(phase => (
                                        <span key={phase} className={`text-[9px] px-2 py-0.5 rounded-full ${
                                            phase === 'Clarification' ? 'bg-blue-500/10 text-blue-400/70' :
                                            phase === 'Approach' ? 'bg-purple-500/10 text-purple-400/70' :
                                            phase === 'Coding' ? 'bg-emerald-500/10 text-emerald-400/70' :
                                            phase === 'Debugging' ? 'bg-amber-500/10 text-amber-400/70' :
                                            'bg-gray-500/10 text-gray-400/70'
                                        }`}>
                                            {phase}
                                        </span>
                                    ))}
                                </div>
                                {expandedSections.timeline ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </div>
                        </button>
                        {expandedSections.timeline && (
                            <div className="mt-2 bg-[#1e1e1e] rounded-xl p-4 sm:p-6 border border-[#2a2a2a] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-3">
                                    {problemSolvingTimeline.map((moment, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                moment.category === 'clarification' ? 'bg-blue-500/10 text-blue-400/60' :
                                                moment.category === 'approach' ? 'bg-purple-500/10 text-purple-400/60' :
                                                (moment.category === 'coding_start' || moment.category === 'coding_main') ? 'bg-emerald-500/10 text-emerald-400/60' :
                                                moment.category === 'debugging' ? 'bg-amber-500/10 text-amber-400/60' :
                                                'bg-gray-500/10 text-gray-400/60'
                                            }`}>
                                                {moment.category === 'clarification' ? <MessageCircleQuestion size={12} /> :
                                                 moment.category === 'approach' ? <Lightbulb size={12} /> :
                                                 (moment.category === 'coding_start' || moment.category === 'coding_main') ? <Code size={12} /> :
                                                 moment.category === 'debugging' ? <AlertCircle size={12} /> :
                                                 <CheckCircle size={12} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{moment.timestamp}</span>
                                                </div>
                                                <p className="text-sm text-gray-300">{moment.moment}</p>
                                                {moment.evidence && (
                                                    <p className="text-xs text-gray-500/70 italic mt-1 truncate">"{moment.evidence.substring(0, 80)}..."</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Code Review Section - Collapsible */}
            {codeIssues && codeIssues.length > 0 && solutionCode && isCoding && (
                <div className="mb-8 sm:mb-12">
                    <button 
                        onClick={() => toggleSection('codeReview')}
                        className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl hover:bg-[#252525] transition-colors"
                    >
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-widest uppercase">
                            <Code size={14} /> Code Review
                            <span className="text-gray-600 font-normal normal-case">({codeIssues.length} issues)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            {expandedSections.codeReview ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    </button>
                    {expandedSections.codeReview && (
                        <div className="mt-2 bg-[#1e1e1e] rounded-xl p-4 sm:p-6 border border-[#2a2a2a] animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Side-by-Side Code Comparison - neutral backgrounds */}
                            <div className="mb-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Your Solution - darker, muted */}
                                    <div className="flex flex-col">
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            Your Solution ({codeLanguage || 'code'})
                                        </h4>
                                        <div className="flex-1 bg-[#0a0a0a] p-4 rounded-lg overflow-x-auto border border-[#1e1e1e]">
                                            <pre className="text-xs font-mono max-h-96 overflow-y-auto">
                                                <code className="text-gray-400">{dedentCode(solutionCode)}</code>
                                            </pre>
                                        </div>
                                    </div>
                                    
                                    {/* Corrected Solution - slightly brighter, accent title */}
                                    <div className="flex flex-col">
                                        <h4 className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <CheckCircle size={12} /> Corrected Solution
                                        </h4>
                                        <div className="flex-1 bg-[#0f0f0f] p-4 rounded-lg overflow-x-auto border border-[#252525]">
                                            <pre className="text-xs font-mono max-h-96 overflow-y-auto">
                                                <code className="text-gray-200">{dedentCode(correctedSolution || solutionCode)}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Code Issues - Two-column layout with collapsible evidence */}
                            <div className="space-y-4">
                                {codeIssues.map((issue, i) => {
                                    const isEvidenceExpanded = expandedSections[`evidence-${i}`];
                                    
                                    // Generate diagnosis text from impact or use a default
                                    const diagnosisText = issue.impact?.correctness || 
                                        issue.impact?.runtime || 
                                        issue.impact?.robustness ||
                                        `${issue.title} affects code correctness.`;
                                    
                                    return (
                                        <div 
                                            key={i} 
                                            className="rounded mb-3"
                                            style={{
                                                background: '#111111',
                                                borderLeft: `5px solid ${
                                                    issue.severity === 'critical' ? '#ff453a' :
                                                    issue.severity === 'major' ? '#ff9f0a' :
                                                    '#ffd60a'
                                                }`,
                                                borderTop: '1px solid #222222',
                                                borderRight: '1px solid #222222',
                                                borderBottom: '1px solid #222222',
                                            }}
                                        >
                                            {/* Header row */}
                                            <div className="px-4 py-2 border-b border-[#222222] flex items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                    issue.severity === 'critical' ? 'text-red-400' :
                                                    issue.severity === 'major' ? 'text-amber-400' :
                                                    'text-yellow-400'
                                                }`}>
                                                    {issue.severity}
                                                </span>
                                                <span className="text-gray-600">·</span>
                                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{issue.type}</span>
                                            </div>
                                            
                                            {/* Title */}
                                            <div className="px-4 py-3 border-b border-[#222222]">
                                                <h5 className="text-sm font-bold text-gray-200">{issue.title}</h5>
                                            </div>
                                            
                                            {/* Two-column: Diagnosis | Fix */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#222222]">
                                                {/* Diagnosis */}
                                                <div className="p-4">
                                                    <h6 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Diagnosis</h6>
                                                    <p className="text-sm text-gray-400 leading-relaxed">{diagnosisText}</p>
                                                </div>
                                                
                                                {/* Fix */}
                                                <div className="p-4">
                                                    <h6 className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest mb-2">Fix</h6>
                                                    <ul className="space-y-1.5">
                                                        {issue.fix.split(/\.\s+(?=[A-Z`])/).filter((s: string) => s.trim()).map((step: string, idx: number) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                                                <span className="text-emerald-400/50 mt-0.5">•</span>
                                                                <span>{step.trim().endsWith('.') ? step.trim() : step.trim() + '.'}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            
                                            {/* Evidence - collapsible */}
                                            {issue.evidence && (
                                                <div className="border-t border-[#222222]">
                                                    <button
                                                        onClick={() => toggleSection(`evidence-${i}`)}
                                                        className="w-full px-4 py-2 flex items-center justify-between text-gray-500 hover:text-gray-400 hover:bg-[#1a1a1a] transition-colors"
                                                    >
                                                        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                            <Code size={12} />
                                                            Evidence
                                                            {issue.evidence.lineNumbers && issue.evidence.lineNumbers.length > 0 && (
                                                                <span className="text-gray-600 font-normal">
                                                                    (Lines {issue.evidence.lineNumbers.join(', ')})
                                                                </span>
                                                            )}
                                                        </span>
                                                        {isEvidenceExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                    </button>
                                                    {isEvidenceExpanded && (
                                                        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-150">
                                                            <pre className="text-xs font-mono text-gray-400 bg-[#0a0a0a] p-3 rounded overflow-x-auto border border-[#1e1e1e]">
                                                                {issue.evidence.codeSnippet}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Next Actions - Simple, at the end, 3 bullets max */}
            {nextTimeHabits && nextTimeHabits.length > 0 && isCoding && (
                <div className="mb-8 sm:mb-12">
                    <div className="mb-3 flex items-center gap-2 text-gray-400 text-xs font-bold tracking-widest uppercase">
                        <Target size={14} /> Next Actions
                    </div>
                    <div className="bg-[#1e1e1e] rounded-xl p-4 sm:p-5 border border-[#2a2a2a]">
                        <div className="space-y-3">
                            {nextTimeHabits.slice(0, 3).map((habit, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <span className="text-gold font-bold">{i + 1}.</span>
                                    <p className="text-sm text-gray-300 flex-1">{habit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* LeetCode Rubric Scores - Strict Evaluation */}
            {rubricScores && effectiveReportType === 'walkie' && (
                <div className="mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="mb-3 sm:mb-4 flex items-center gap-2 text-charcoal text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        <Target size={12} className="sm:w-3.5 sm:h-3.5" /> Rubric Evaluation
                     </div>
                     <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#EBE8E0] shadow-sm">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                             {/* Algorithm Score */}
                             <div className="space-y-2">
                                 <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                     <span className="text-gray-500">Algorithm</span>
                                     <span className={rubricScores.algorithmScore >= 20 ? 'text-green-600' : rubricScores.algorithmScore >= 10 ? 'text-yellow-600' : 'text-red-500'}>{rubricScores.algorithmScore} / 25</span>
                                 </div>
                                 <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                     <div className={`h-full ${rubricScores.algorithmScore >= 20 ? 'bg-green-500' : rubricScores.algorithmScore >= 10 ? 'bg-yellow-500' : 'bg-red-400'}`} style={{ width: `${(rubricScores.algorithmScore || 0) * 4}%` }}></div>
                                 </div>
                                 <p className="text-xs text-gray-500 leading-relaxed">{rubricScores.algorithmFeedback}</p>
                             </div>
                             
                             {/* Edge Cases Score */}
                             <div className="space-y-2">
                                 <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                     <span className="text-gray-500">Edge Cases</span>
                                     <span className={rubricScores.edgeCasesScore >= 20 ? 'text-green-600' : rubricScores.edgeCasesScore >= 10 ? 'text-yellow-600' : 'text-red-500'}>{rubricScores.edgeCasesScore} / 25</span>
                                 </div>
                                 <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                     <div className={`h-full ${rubricScores.edgeCasesScore >= 20 ? 'bg-green-500' : rubricScores.edgeCasesScore >= 10 ? 'bg-yellow-500' : 'bg-red-400'}`} style={{ width: `${(rubricScores.edgeCasesScore || 0) * 4}%` }}></div>
                                 </div>
                                 <p className="text-xs text-gray-500 leading-relaxed">{rubricScores.edgeCasesFeedback}</p>
                             </div>
                             
                             {/* Time Complexity Score */}
                             <div className="space-y-2">
                                 <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                     <span className="text-gray-500">Time Complexity</span>
                                     <span className={rubricScores.timeComplexityScore >= 20 ? 'text-green-600' : rubricScores.timeComplexityScore >= 10 ? 'text-yellow-600' : 'text-red-500'}>{rubricScores.timeComplexityScore} / 25</span>
                                 </div>
                                 <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                     <div className={`h-full ${rubricScores.timeComplexityScore >= 20 ? 'bg-green-500' : rubricScores.timeComplexityScore >= 10 ? 'bg-yellow-500' : 'bg-red-400'}`} style={{ width: `${(rubricScores.timeComplexityScore || 0) * 4}%` }}></div>
                                 </div>
                                 <p className="text-xs text-gray-500 leading-relaxed">{rubricScores.timeComplexityFeedback}</p>
                             </div>
                             
                             {/* Space Complexity Score */}
                             <div className="space-y-2">
                                 <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest">
                                     <span className="text-gray-500">Space Complexity</span>
                                     <span className={rubricScores.spaceComplexityScore >= 20 ? 'text-green-600' : rubricScores.spaceComplexityScore >= 10 ? 'text-yellow-600' : 'text-red-500'}>{rubricScores.spaceComplexityScore} / 25</span>
                                 </div>
                                 <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                     <div className={`h-full ${rubricScores.spaceComplexityScore >= 20 ? 'bg-green-500' : rubricScores.spaceComplexityScore >= 10 ? 'bg-yellow-500' : 'bg-red-400'}`} style={{ width: `${(rubricScores.spaceComplexityScore || 0) * 4}%` }}></div>
                                 </div>
                                 <p className="text-xs text-gray-500 leading-relaxed">{rubricScores.spaceComplexityFeedback}</p>
                             </div>
                         </div>
                         
                         {/* Missing Edge Cases */}
                         {missingEdgeCases && missingEdgeCases.length > 0 && (
                             <div className="mt-6 pt-6 border-t border-gray-100">
                                 <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                                     <AlertCircle size={12} /> Missing Edge Cases
                                 </div>
                                 <div className="flex flex-wrap gap-2">
                                     {missingEdgeCases.map((edgeCase, i) => (
                                         <span key={i} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">
                                             {edgeCase}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                </div>
            )}

            {/* 2. Specific Turn Context (Active Dialogue) */}
            {displayedQuestion && displayedTranscript && isHotTake && (
                 <div className="mb-12 animate-in fade-in slide-in-from-bottom-2 duration-700" key={`context-${activeHotTakeRound}`}>
                    <div className="mb-4 flex items-center gap-2 text-charcoal text-xs font-bold tracking-widest uppercase">
                        <History size={14} /> Active Dialogue
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBE8E0]">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] bg-gold/5 px-2 py-1 rounded">
                                {activeHotTakeRound === 'round1' ? 'Initial Context' : 'The Probe'}
                            </span>
                        </div>
                        <div className="flex gap-4 items-start mb-4 opacity-70">
                            <MessageSquare size={16} className="shrink-0 mt-1 text-gray-400" />
                            <p className="text-sm font-bold text-gray-700">"{displayedQuestion}"</p>
                        </div>
                        <div className="flex gap-4 items-start">
                            <Quote size={18} className="shrink-0 text-gold mt-1" />
                            <p className="text-gray-600 leading-relaxed font-serif whitespace-pre-wrap">"{displayedTranscript}"</p>
                        </div>
                    </div>
                 </div>
            )}

            {/* 3. Hot Take Master Rewrite */}
            {displayedRewrite && isHotTake && (
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500" key={`rewrite-${activeHotTakeRound}`}>
                     <div className="mb-4 flex items-center gap-2 text-charcoal text-xs font-bold tracking-widest uppercase">
                        <PenTool size={14} /> Master Coaching Rewrite
                     </div>
                     <div className="bg-white rounded-3xl p-10 border-l-4 border-gold shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={100} className="text-gold" /></div>
                         <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-6">The Unified Punchline</h4>
                         <div className="text-xl font-serif font-bold text-charcoal leading-relaxed whitespace-pre-wrap italic relative z-10">
                            "{displayedRewrite}"
                         </div>
                     </div>
                </div>
            )}
            
            {/* 4. Hot Take History (Fallback for Legacy Data) */}
            {hotTakeHistory && hotTakeHistory.length > 0 && !hotTakeRounds && (
                <div className="mb-12">
                    <div className="mb-4 flex items-center gap-2 text-charcoal text-xs font-bold tracking-widest uppercase">
                        <History size={14} /> Dialogue Archive
                    </div>
                    <div className="space-y-6">
                        {hotTakeHistory.map((turn, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-[#EBE8E0]">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] bg-gold/5 px-2 py-1 rounded">{turn.stage}</span>
                                </div>
                                <div className="flex gap-4 items-start mb-4 opacity-70">
                                    <MessageSquare size={16} className="shrink-0 mt-1 text-gray-400" />
                                    <p className="text-sm font-bold text-gray-700">"{turn.query}"</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <Quote size={18} className="shrink-0 text-gold mt-1" />
                                    <p className="text-gray-600 leading-relaxed font-serif whitespace-pre-wrap">"{turn.response}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Areas for Improvement - Mobile responsive (Skip for coding reports - codeIssues handles this) */}
            {!isCoding && detailedFeedback && detailedFeedback.length > 0 && (
                <>
                    <div className="mb-3 sm:mb-4 flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-8 sm:mt-12 text-charcoal">
                        <Lightbulb size={12} className="sm:w-3.5 sm:h-3.5" /> Areas for Improvement
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                        {detailedFeedback.map((item, i) => {
                            const saved = isSaved(item.issue, item.instance);
                            return (
                                <div key={i} className="rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm relative group bg-white border border-[#EBE8E0]">
                                    <button 
                                        onClick={() => onToggleSave({
                                            type: 'improvement',
                                            category: item.category,
                                            title: item.issue,
                                            content: item.instance,
                                            rewrite: item.rewrite,
                                            explanation: item.explanation,
                                            question: item.question || context,
                                            humanRewrite: item.rewrite,
                                            reportData: createReportContext(report, transcript, context)
                                        })}
                                        className={`absolute top-3 right-3 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-full transition-all ${
                                            saved ? 'text-gold bg-gold/10' : 'text-gray-300 hover:text-charcoal hover:bg-gray-50'
                                        }`}
                                        title={saved ? "Remove from database" : "Save to database"}
                                    >
                                        <Bookmark size={16} className="sm:w-[18px] sm:h-[18px]" fill={saved ? "currentColor" : "none"} />
                                    </button>
                                    
                                    {/* Practice Button */}
                                    <button 
                                        onClick={() => navigate('/hot-take', { 
                                            state: { 
                                                practiceQuestion: { 
                                                    title: item.question || item.issue, 
                                                    context: item.question ? `Practice improving: ${item.issue}` : item.instance,
                                                    source: context
                                                } 
                                            } 
                                        })}
                                        className="absolute top-3 right-10 sm:top-6 sm:right-16 p-1.5 sm:p-2 rounded-full transition-all text-gray-300 hover:text-gold hover:bg-gold/10"
                                        title="Practice this question in Hot Take"
                                    >
                                        <Zap size={16} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>

                                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400"></div>
                                        <span className="text-[9px] sm:text-[10px] font-bold text-gold uppercase tracking-widest">{item.category}</span>
                                    </div>
                                    
                                    {/* Question Context */}
                                    {item.question && (
                                        <div className="mb-3 sm:mb-4 mr-16 sm:mr-8">
                                            <h5 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-2 text-gray-400">Interview Question</h5>
                                            <p className="text-xs sm:text-sm italic text-gray-600">"{item.question}"</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl border-l-4 bg-[#FAF9F6] border-gray-200">
                                            <h5 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3 text-gray-400">What You Said</h5>
                                            <p className="font-serif text-base sm:text-lg leading-relaxed mb-2 sm:mb-3 text-charcoal">"{item.instance}"</p>
                                            <div className="pt-2 sm:pt-3 border-t border-gray-200">
                                                <h6 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 text-gray-400">The Issue</h6>
                                                <p className="text-xs sm:text-sm text-gray-600">{item.issue}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-6 rounded-lg sm:rounded-xl border-l-4 bg-green-50/50 border-green-400">
                                            <h5 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2 text-green-600">
                                            <PenTool size={10} className="sm:w-3 sm:h-3"/> The Human Rewrite
                                            </h5>
                                            <div className="font-serif text-base sm:text-lg leading-relaxed mb-3 sm:mb-4 text-charcoal">
                                            "{item.rewrite}"
                                            </div>
                                            <div className="pt-3 sm:pt-4 border-t border-green-200/50">
                                                <h6 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 text-green-600">Why this works</h6>
                                                <p className="text-xs sm:text-sm italic text-green-800">{item.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Highlights - Mobile responsive */}
            {highlights && highlights.length > 0 && (
                <>
                    <div className={`mb-3 sm:mb-4 flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-8 sm:mt-12 ${
                        isCoding ? 'text-gray-400' : 'text-charcoal'
                    }`}>
                        <ThumbsUp size={12} className="sm:w-3.5 sm:h-3.5" /> Key Strengths
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {highlights.map((item, i) => {
                            const saved = isSaved(item.strength, item.quote);
                            return (
                                <div key={i} className={`rounded-xl p-4 sm:p-5 relative group ${
                                    isCoding ? 'bg-[#1e1e1e] border border-[#2a2a2a]' : 'bg-white border border-[#EBE8E0]'
                                }`}>
                                    <button 
                                        onClick={() => onToggleSave({
                                            type: 'highlight',
                                            category: item.category,
                                            title: item.strength,
                                            content: item.quote,
                                            question: item.question || context,
                                            reportData: createReportContext(report, transcript, context)
                                        })}
                                        className={`absolute top-3 right-3 p-1.5 rounded-full z-10 transition-all ${
                                            saved ? 'text-gold bg-gold/10' : isCoding ? 'text-gray-600 hover:text-gold hover:bg-gold/10' : 'text-gray-300 hover:text-charcoal hover:bg-gray-50'
                                        }`}
                                        title={saved ? "Remove from database" : "Save to database"}
                                    >
                                        <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                                    </button>

                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isCoding ? 'text-gray-500' : 'text-gray-400'}`}>{item.category}</span>
                                    </div>
                                    
                                    <h4 className={`text-sm font-bold mb-2 pr-6 ${isCoding ? 'text-gray-200' : 'text-charcoal'}`}>{item.strength}</h4>
                                    <p className={`text-xs leading-relaxed ${isCoding ? 'text-gray-400' : 'text-gray-600'}`}>"{item.quote}"</p>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Flip The Table - Question Analysis - Mobile responsive */}
            {flipTheTable && (
                <div className="mt-8 sm:mt-12">
                    <div className="mb-3 sm:mb-4 flex items-center gap-2 text-charcoal text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        <MessageCircleQuestion size={12} className="sm:w-3.5 sm:h-3.5" /> Flip The Table: Your Questions
                    </div>
                    
                    {/* Overall Assessment */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-[#EBE8E0] mb-4 sm:mb-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                                <Target size={14} className="sm:w-[18px] sm:h-[18px]" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs sm:text-sm font-bold text-charcoal uppercase tracking-widest mb-1.5 sm:mb-2">Overall Assessment</h4>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{flipTheTable.overallAssessment}</p>
                            </div>
                        </div>
                    </div>

                    {/* Questions Asked by Candidate - Mobile responsive */}
                    {flipTheTable.candidateQuestions && flipTheTable.candidateQuestions.length > 0 && (
                        <>
                            <h4 className="text-xs sm:text-sm font-bold text-charcoal mb-3 sm:mb-4 flex items-center gap-2">
                                <Quote size={12} className="sm:w-3.5 sm:h-3.5 text-purple-600" />
                                Questions You Asked
                            </h4>
                            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                                {flipTheTable.candidateQuestions.map((q, i) => {
                                    const saved = isSaved(q.questionAsked, q.context);
                                    return (
                                        <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-[#EBE8E0] relative group">
                                            <button 
                                                onClick={() => onToggleSave({
                                                    type: 'candidate_question',
                                                    category: 'Question Analysis',
                                                    title: q.questionAsked,
                                                    content: q.context,
                                                    rewrite: q.improvedVersion,
                                                    context: q.context,
                                                    explanation: q.analysis + ' ' + q.reasoning,
                                                    reportData: createReportContext(report, transcript, context)
                                                })}
                                                className={`absolute top-3 right-3 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-full z-10 transition-all ${saved ? 'text-gold bg-gold/10' : 'text-gray-300 hover:text-charcoal hover:bg-gray-50'}`}
                                                title={saved ? "Remove from database" : "Save to database"}
                                            >
                                                <Bookmark size={14} className="sm:w-4 sm:h-4" fill={saved ? "currentColor" : "none"} />
                                            </button>

                                            {/* Context Banner */}
                                            <div className="bg-purple-50 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 mr-10 sm:mr-8">
                                                <h5 className="text-[9px] sm:text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Conversation Context</h5>
                                                <p className="text-xs sm:text-sm text-purple-800 italic">{q.context}</p>
                                            </div>

                                        {/* Question Asked */}
                                        <div className="mb-3 sm:mb-4">
                                            <h5 className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2">What You Asked</h5>
                                            <p className="text-charcoal font-serif text-base sm:text-lg">"{q.questionAsked}"</p>
                                        </div>

                                        {/* Analysis & Improved Version */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                            <div className="bg-[#FAF9F6] p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                                <h5 className="text-[9px] sm:text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5 sm:mb-2">Analysis</h5>
                                                <p className="text-xs sm:text-sm text-gray-700">{q.analysis}</p>
                                            </div>
                                            <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl ${q.improvedVersion ? 'bg-green-50 border-l-4 border-green-400' : 'bg-blue-50'}`}>
                                                {q.improvedVersion ? (
                                                    <>
                                                        <h5 className="text-[9px] sm:text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1.5 sm:mb-2 flex items-center gap-1">
                                                            <Sparkles size={10} className="sm:w-3 sm:h-3" /> Improved Version
                                                        </h5>
                                                        <p className="text-xs sm:text-sm text-charcoal font-serif mb-2 sm:mb-3">"{q.improvedVersion}"</p>
                                                        <div className="pt-2 border-t border-green-200">
                                                            <p className="text-[10px] sm:text-xs text-green-800">{q.reasoning}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h5 className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1.5 sm:mb-2">Why This Worked</h5>
                                                        <p className="text-xs sm:text-sm text-blue-800">{q.reasoning}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                                })}
                            </div>
                        </>
                    )}

                    {/* Missed Opportunities - Mobile responsive */}
                    {flipTheTable.missedOpportunities && flipTheTable.missedOpportunities.length > 0 && (
                        <>
                            <h4 className="text-xs sm:text-sm font-bold text-charcoal mb-3 sm:mb-4 flex items-center gap-2">
                                <Sparkles size={12} className="sm:w-3.5 sm:h-3.5 text-orange-600" />
                                <span className="hidden sm:inline">Missed Opportunities: Questions You Should Have Asked</span>
                                <span className="sm:hidden">Missed Opportunities</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {flipTheTable.missedOpportunities.map((opp, i) => {
                                    const saved = isSaved(opp.suggestedQuestion, opp.context);
                                    return (
                                        <div key={i} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-orange-200 relative group">
                                            <button 
                                                onClick={() => onToggleSave({
                                                    type: 'missed_opportunity',
                                                    category: 'Missed Opportunity',
                                                    title: opp.suggestedQuestion,
                                                    content: opp.context,
                                                    context: opp.context,
                                                    impact: opp.impact,
                                                    reportData: createReportContext(report, transcript, context)
                                                })}
                                                className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full z-10 transition-all ${saved ? 'text-gold bg-gold/10' : 'text-gray-300 hover:text-charcoal hover:bg-white'}`}
                                                title={saved ? "Remove from database" : "Save to database"}
                                            >
                                                <Bookmark size={14} className="sm:w-4 sm:h-4" fill={saved ? "currentColor" : "none"} />
                                            </button>

                                            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">
                                                    <Lightbulb size={10} className="sm:w-3 sm:h-3" />
                                                </div>
                                                <span className="text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest">Opportunity {i + 1}</span>
                                            </div>

                                        {/* Suggested Question */}
                                        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                                            <h5 className="text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1.5 sm:mb-2">Suggested Question</h5>
                                            <p className="text-charcoal font-serif text-sm sm:text-base">"{opp.suggestedQuestion}"</p>
                                        </div>

                                        {/* Context */}
                                        <div className="mb-2 sm:mb-3">
                                            <h5 className="text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">When to Ask</h5>
                                            <p className="text-xs sm:text-sm text-orange-900">{opp.context}</p>
                                        </div>

                                        {/* Impact */}
                                        <div className="pt-2 sm:pt-3 border-t border-orange-200">
                                            <h5 className="text-[9px] sm:text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">Why This Matters</h5>
                                            <p className="text-[10px] sm:text-xs text-orange-800 italic">{opp.impact}</p>
                                        </div>
                                    </div>
                                );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Pronunciation & Pacing - Mobile responsive */}
            {pronunciationFeedback && pronunciationFeedback.length > 0 && (
                <div className="mt-8 sm:mt-12">
                     <div className="mb-3 sm:mb-4 flex items-center gap-2 text-charcoal text-[10px] sm:text-xs font-bold tracking-widest uppercase">
                        <Ear size={12} className="sm:w-3.5 sm:h-3.5" /> Pronunciation, Pace & Presence
                     </div>
                     <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-[#EBE8E0] shadow-sm">
                         <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-base">Targeted drills to shift from "Machine Gun" delivery to "Executive Presence".</p>
                         <div className="grid gap-4 sm:gap-6">
                             {pronunciationFeedback.map((drill, i) => {
                                 const saved = isSaved(drill.issue, drill.phrase);
                                 return (
                                     <div key={i} className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100 bg-[#FAF9F6] relative group">
                                         <button 
                                            onClick={() => onToggleSave({
                                                type: 'drill',
                                                category: 'Pronunciation',
                                                title: drill.issue,
                                                content: drill.phrase,
                                                rewrite: drill.practiceDrill,
                                                question: drill.question || context,
                                                humanRewrite: drill.practiceDrill,
                                                reportData: createReportContext(report, transcript, context)
                                            })}
                                            className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full transition-all z-10 ${saved ? 'text-gold bg-gold/10' : 'text-gray-300 hover:text-charcoal hover:bg-white'}`}
                                            title={saved ? "Remove from database" : "Save to database"}
                                        >
                                            <Bookmark size={14} className="sm:w-4 sm:h-4" fill={saved ? "currentColor" : "none"} />
                                        </button>

                                         {/* Question Context */}
                                         {drill.question && (
                                             <div className="mr-10 sm:mr-8 mb-1 sm:mb-2">
                                                 <h5 className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Interview Question</h5>
                                                 <p className="text-gray-600 text-[10px] sm:text-xs italic">"{drill.question}"</p>
                                             </div>
                                         )}

                                         <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                                             <div className="md:w-1/3">
                                                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 text-red-500">
                                                    <AlertCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                                                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">The Trap</span>
                                                </div>
                                                <h5 className="font-bold text-charcoal mb-1 text-sm sm:text-base">{drill.issue}</h5>
                                                <p className="text-xs sm:text-sm text-gray-500 italic mb-2">"{drill.phrase}"</p>
                                             </div>

                                             <div className="flex-1 bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gold/20 shadow-sm">
                                                 <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-gold">
                                                    <Mic2 size={12} className="sm:w-3.5 sm:h-3.5" />
                                                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">The Drill</span>
                                                </div>
                                                <div className="font-serif text-base sm:text-xl text-charcoal tracking-wide mb-2 sm:mb-3 leading-relaxed">
                                                    {drill.practiceDrill}
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-gray-500 border-t border-gray-100 pt-2 sm:pt-3">
                                                    <span className="font-bold">Why:</span> {drill.reason}
                                                </p>
                                             </div>
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                     </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceReport;
