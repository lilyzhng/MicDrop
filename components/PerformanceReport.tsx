
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Award, PenTool, Quote, Lightbulb, Bookmark, ThumbsUp, Star, Ear, AlertCircle, Mic2, FileText, MessageCircleQuestion, Target, Sparkles, Zap, History, MessageSquare, Code, CheckCircle, ChevronDown, ChevronRight, FileJson, Loader2, Image } from 'lucide-react';
import { PerformanceReport as ReportType, SavedItem } from '../types';
import html2canvas from 'html2canvas';
import { generateTeachingMetadata, SystemCodingReportData } from '../services/analysisService';
import { saveSystemCodingQuestion, findExistingSystemCodingQuestion } from '../services/databaseService';
import { useAuth } from '../contexts/AuthContext';

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
    const { user } = useAuth();
    const [showRewrite, setShowRewrite] = useState(false);
    const [activeHotTakeRound, setActiveHotTakeRound] = useState<'round1' | 'round2'>('round1');
    const [showProblemStatement, setShowProblemStatement] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [isSavingToQueue, setIsSavingToQueue] = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);
    const downloadMenuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
                setShowDownloadMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
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

    const downloadReportAsJSON = () => {
        // Calculate total score from rubric
        const totalScore = codingRubric ? (
            codingRubric.problemUnderstanding +
            codingRubric.solutionApproach +
            codingRubric.functionalCorrectness +
            codingRubric.codeHygiene +
            (codingRubric.communication ?? 0)
        ) : rating;

        const reportData = {
            exportDate: new Date().toISOString(),
            reportType: 'system-coding',
            
            // Problem
            problem: {
                title: formattedProblemStatement?.title || 'Untitled Problem',
                rawQuestion: codingQuestion,
                formattedSections: formattedProblemStatement?.sections || []
            },
            
            // Executive Summary
            executiveSummary: interpretationLayer ? {
                primaryFailureMode: interpretationLayer.primaryFailureMode,
                biggestImpactFix: interpretationLayer.biggestImpactFix,
                overallSignal: interpretationLayer.overallSignal
            } : {
                summary: summary
            },
            
            // Score
            score: {
                total: totalScore,
                maxScore: codingRubric?.communication !== null ? 100 : 75
            },
            
            // Rubric
            rubric: codingRubric ? {
                problemUnderstanding: { score: codingRubric.problemUnderstanding, maxScore: 25 },
                communication: codingRubric.communication !== null 
                    ? { score: codingRubric.communication, maxScore: 25 }
                    : { score: null, note: 'Not assessed - no transcript provided' },
                algorithmAndComplexity: { score: codingRubric.solutionApproach, maxScore: 25 },
                edgeCasesAndBugs: { score: codingRubric.functionalCorrectness, maxScore: 20 },
                codeQuality: { score: codingRubric.codeHygiene, maxScore: 5 }
            } : null,
            
            // Code
            code: {
                language: codeLanguage || 'unknown',
                submittedSolution: solutionCode || null,
                correctedSolution: correctedSolution || null
            },
            
            // Debugging (Code Issues)
            debugging: codeIssues?.map(issue => ({
                title: issue.title,
                type: issue.type,
                severity: issue.severity,
                impact: issue.impact,
                evidence: issue.evidence,
                suggestedFix: issue.fix
            })) || [],
            
            // Next Steps
            nextSteps: nextTimeHabits || [],
            
            // Key Strengths
            keyStrengths: highlights?.map(h => ({
                category: h.category,
                strength: h.strength,
                quote: h.quote
            })) || [],
            
            // Timeline (if available)
            problemSolvingTimeline: problemSolvingTimeline?.map(t => ({
                timestamp: t.timestamp,
                moment: t.moment,
                category: t.category,
                evidence: t.evidence
            })) || [],
            
            // Transcript
            transcript: transcript || null,
            interviewContext: context || null
        };

        const jsonString = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coding-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Go to Walkie-Talkie - checks for existing question or generates new one
    const goToWalkieTalkie = async () => {
        if (isSavingToQueue || !user) return;
        
        setIsSavingToQueue(true);
        try {
            // Extract title from problem
            const title = codingQuestion?.split('\n')[0]?.trim() || 'Untitled Problem';
            
            // Extract company from context (e.g., "Factory AI - Implement...")
            const companyMatch = context?.match(/^([^-–]+)/);
            const company = companyMatch ? companyMatch[1].trim() : null;
            
            // Check if question already exists for this report
            const existingQuestion = await findExistingSystemCodingQuestion(user.id, title);
            
            if (existingQuestion) {
                console.log('[GoToWalkieTalkie] Using existing question:', existingQuestion);
                // Navigate directly to Walkie-Talkie
                navigate('/walkie-talkie', { 
                    state: { 
                        teachAgainProblem: title,
                        isSystemCoding: true 
                    } 
                });
                return;
            }
            
            console.log('[GoToWalkieTalkie] No existing question found, generating...');
            
            // Build report data for teaching metadata generation
            const reportDataForAI: SystemCodingReportData = {
                title,
                prompt: codingQuestion || '',
                solutionCode: solutionCode || '',
                correctSolution: correctedSolution || null,
                codeLanguage: codeLanguage || 'python',
                company,
                knownBugs: (codeIssues || []).map(issue => ({
                    title: issue.title,
                    type: issue.type,
                    severity: issue.severity,
                    impact: issue.impact,
                    evidence: issue.evidence,
                    fix: issue.fix
                })),
                rubricScores: codingRubric || null,
                transcript: transcript || null,
                weakAreas: interpretationLayer ? {
                    primaryFailureMode: interpretationLayer.primaryFailureMode,
                    biggestImpactFix: interpretationLayer.biggestImpactFix
                } : null
            };
            
            // Generate teaching metadata using AI
            const teachingMetadata = await generateTeachingMetadata(reportDataForAI);
            
            console.log('[GoToWalkieTalkie] Teaching metadata generated:', teachingMetadata);
            
            // Save to database
            const result = await saveSystemCodingQuestion(user.id, {
                title,
                prompt: codingQuestion || '',
                solutionCode: solutionCode || '',
                correctSolution: teachingMetadata.correctSolution,
                codeLanguage: codeLanguage || 'python',
                company,
                keyIdea: teachingMetadata.keyIdea,
                pattern: teachingMetadata.pattern,
                steps: teachingMetadata.steps,
                timeComplexity: teachingMetadata.timeComplexity,
                spaceComplexity: teachingMetadata.spaceComplexity,
                detailedHint: teachingMetadata.detailedHint,
                expectedEdgeCases: teachingMetadata.expectedEdgeCases,
                knownBugs: (codeIssues || []).map(issue => ({
                    title: issue.title,
                    type: issue.type,
                    severity: issue.severity,
                    fix: issue.fix
                }))
            });
            
            if (!result) {
                throw new Error('Failed to save question to database');
            }
            
            console.log('[GoToWalkieTalkie] Question saved, navigating...:', result);
            
            // Navigate directly to Walkie-Talkie
            navigate('/walkie-talkie', { 
                state: { 
                    teachAgainProblem: title,
                    isSystemCoding: true 
                } 
            });
        } catch (error) {
            console.error('[GoToWalkieTalkie] Error:', error);
            alert('Failed to prepare question. Please try again.');
        } finally {
            setIsSavingToQueue(false);
        }
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
                    {/* Download Dropdown */}
                    <div className="relative" ref={downloadMenuRef}>
                        <button 
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 ${
                                isCoding ? 'bg-[#252525] border-[#333] hover:bg-[#2a2a2a] text-gray-400' : 'bg-white border-gray-200 hover:bg-gray-50 text-charcoal'
                            }`}
                        >
                            <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span>Download</span>
                            <ChevronDown size={12} className={`transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showDownloadMenu && (
                            <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl border shadow-xl z-50 overflow-hidden ${
                                isCoding ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-gray-200'
                            }`}>
                                {(transcript || hotTakeHistory || hotTakeRounds) && (
                                    <button 
                                        onClick={() => { downloadTranscript(); setShowDownloadMenu(false); }}
                                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 ${
                                            isCoding ? 'hover:bg-[#252525] text-gray-300' : 'hover:bg-gray-50 text-charcoal'
                                        }`}
                                    >
                                        <FileText size={16} className="text-gray-500" />
                                        <span>Transcript (.txt)</span>
                                    </button>
                                )}
                                {isCoding && (
                                    <button 
                                        onClick={() => { downloadReportAsJSON(); setShowDownloadMenu(false); }}
                                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 ${
                                            isCoding ? 'hover:bg-[#252525] text-gray-300' : 'hover:bg-gray-50 text-charcoal'
                                        }`}
                                    >
                                        <FileJson size={16} className="text-gray-500" />
                                        <span>Report (.json)</span>
                                    </button>
                                )}
                                <button 
                                    onClick={() => { downloadReportAsImage(); setShowDownloadMenu(false); }}
                                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 ${
                                        isCoding ? 'hover:bg-[#252525] text-gray-300' : 'hover:bg-gray-50 text-charcoal'
                                    }`}
                                >
                                    <Image size={16} className="text-gray-500" />
                                    <span>Screenshot (.png)</span>
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Go to Walkie-Talkie button (system coding only) */}
                    {isCoding && (
                        <button 
                            onClick={goToWalkieTalkie} 
                            disabled={isSavingToQueue}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-colors bg-gold/10 border-gold/30 hover:bg-gold/20 text-gold hover:border-gold/50"
                        >
                            {isSavingToQueue ? (
                                <Loader2 size={12} className="sm:w-3.5 sm:h-3.5 animate-spin" />
                            ) : (
                                <Mic2 size={12} className="sm:w-3.5 sm:h-3.5" />
                            )}
                            <span className="hidden sm:inline">
                                {isSavingToQueue ? 'Preparing...' : 'Go to Walkie-Talkie'}
                            </span>
                            <span className="sm:hidden">
                                {isSavingToQueue ? '...' : 'Walkie-Talkie'}
                            </span>
                        </button>
                    )}
                    
                    {/* Done button */}
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
                      
                      {/* Coding Reports: Bullet-to-the-Head Style */}
                      {isCoding && interpretationLayer ? (
                          <div className="space-y-3 text-left">
                              {/* Core Failure */}
                              <div className="flex items-start gap-3">
                                  <span className="text-red-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap mt-0.5">Core Failure:</span>
                                  <p className="text-sm text-gray-200">{interpretationLayer.primaryFailureMode}</p>
                              </div>
                              {/* Blind Spot */}
                              <div className="flex items-start gap-3">
                                  <span className="text-amber-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap mt-0.5">Blind Spot:</span>
                                  <p className="text-sm text-gray-200">{interpretationLayer.biggestImpactFix}</p>
                              </div>
                              {/* Communication */}
                              <div className="flex items-start gap-3">
                                  <span className="text-blue-400 font-bold text-xs uppercase tracking-widest whitespace-nowrap mt-0.5">Signal:</span>
                                  <p className="text-sm text-gray-200">{interpretationLayer.overallSignal}</p>
                              </div>
                          </div>
                      ) : (
                          <p className={`leading-relaxed whitespace-pre-line text-sm sm:text-base ${isCoding ? 'text-gray-400' : 'text-gray-600'}`}>{isHotTake ? displayedSummary : summary}</p>
                      )}
                      
                      {coachingRewrite && !isHotTake && !isCoding && (
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

            {/* KEY STRENGTHS - Signal vs. Evidence Table (Coding Reports) */}
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

            {/* Code Review Section - In-Situ Diagnostic Model */}
            {codeIssues && codeIssues.length > 0 && solutionCode && isCoding && (() => {
                // Parse code into lines and map issues to line numbers
                const codeLines = dedentCode(solutionCode).split('\n');
                
                // Create a map of line number -> issues for that line
                const issuesByLine: Record<number, typeof codeIssues> = {};
                codeIssues.forEach((issue) => {
                    const lineNums = issue.evidence?.lineNumbers || [];
                    if (lineNums.length > 0) {
                        // Place the diagnostic after the first mentioned line
                        const targetLine = Math.min(...lineNums);
                        if (!issuesByLine[targetLine]) issuesByLine[targetLine] = [];
                        issuesByLine[targetLine].push(issue);
                    }
                });
                
                // Issues without line numbers go to a summary section
                const orphanedIssues = codeIssues.filter(
                    issue => !issue.evidence?.lineNumbers || issue.evidence.lineNumbers.length === 0
                );

                return (
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
                            <div className="mt-2 bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                                {/* Code Header */}
                                <div className="px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        Your Solution ({codeLanguage || 'code'})
                                    </h4>
                                    <span className="text-[10px] text-gray-600">
                                        Click issues to see fixes inline
                                    </span>
                                </div>
                                
                                {/* In-Situ Code with Inline Diagnostics */}
                                <div className="p-4 overflow-x-auto">
                                    <div className="font-mono text-xs">
                                        {codeLines.map((line, lineIdx) => {
                                            const lineNum = lineIdx + 1;
                                            const lineIssues = issuesByLine[lineNum] || [];
                                            const hasIssue = lineIssues.length > 0;
                                            
                                            // Check if this line is referenced by any issue (for highlighting)
                                            const isReferencedLine = codeIssues.some(
                                                issue => issue.evidence?.lineNumbers?.includes(lineNum)
                                            );
                                            
                                            return (
                                                <React.Fragment key={lineIdx}>
                                                    {/* Code Line */}
                                                    <div className={`flex group ${isReferencedLine ? 'bg-red-500/5' : 'hover:bg-[#1a1a1a]'}`}>
                                                        <span className={`w-10 shrink-0 text-right pr-4 select-none ${
                                                            isReferencedLine ? 'text-red-400/60' : 'text-gray-600'
                                                        }`}>
                                                            {lineNum}
                                                        </span>
                                                        <span className={`flex-1 whitespace-pre ${
                                                            isReferencedLine ? 'text-gray-300' : 'text-gray-400'
                                                        }`}>
                                                            {line || ' '}
                                                        </span>
                                                        {isReferencedLine && !hasIssue && (
                                                            <span className="text-red-400/40 text-[10px] px-2">◄</span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Inline Diagnostic Portal - Obsidian Style */}
                                                    {hasIssue && lineIssues.map((issue, issueIdx) => {
                                                        const portalKey = `portal-${lineNum}-${issueIdx}`;
                                                        const isExpanded = expandedSections[portalKey] !== false; // Default open
                                                        
                                                        const diagnosisText = issue.impact?.correctness || 
                                                            issue.impact?.runtime || 
                                                            issue.impact?.robustness ||
                                                            `${issue.title} affects code correctness.`;
                                                        
                                                        const severityColor = issue.severity === 'critical' ? '#ff453a' :
                                                            issue.severity === 'major' ? '#ff9f0a' : '#ffd60a';
                                                        
                                                        return (
                                                            <div 
                                                                key={portalKey}
                                                                className="my-2 ml-10 mr-2 animate-in fade-in slide-in-from-top-1 duration-200"
                                                                style={{
                                                                    background: '#111111',
                                                                    borderLeft: `5px solid ${severityColor}`,
                                                                    borderRadius: '4px',
                                                                    fontFamily: 'system-ui, sans-serif',
                                                                }}
                                                            >
                                                                {/* Collapsible Header */}
                                                                <button
                                                                    onClick={() => toggleSection(portalKey)}
                                                                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors rounded-t"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <span style={{ color: severityColor }} className="text-[10px] font-bold uppercase tracking-widest">
                                                                            {issue.severity}: {issue.title}
                                                                        </span>
                                                                    </div>
                                                                    {isExpanded ? <ChevronDown size={12} className="text-gray-500" /> : <ChevronRight size={12} className="text-gray-500" />}
                                                                </button>
                                                                
                                                                {isExpanded && (
                                                                    <div className="px-3 pb-3">
                                                                        {/* Diagnosis */}
                                                                        <p className="text-[13px] text-gray-400 mb-3 leading-relaxed">
                                                                            {diagnosisText}
                                                                        </p>
                                                                        
                                                                        {/* The Fix - Code Snippet Style */}
                                                                        <div 
                                                                            className="p-2 rounded font-mono text-xs"
                                                                            style={{ background: '#1a1a1a' }}
                                                                        >
                                                                            {issue.fix.split(/\.\s+(?=[A-Z`])/).filter((s: string) => s.trim()).map((step: string, idx: number) => (
                                                                                <div key={idx} className="flex items-start gap-2 text-emerald-400">
                                                                                    <span className="text-emerald-500 select-none">+</span>
                                                                                    <span>{step.trim().endsWith('.') ? step.trim() : step.trim() + '.'}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {/* Orphaned Issues (no line numbers) */}
                                {orphanedIssues.length > 0 && (
                                    <div className="border-t border-[#2a2a2a] p-4">
                                        <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                                            General Issues
                                        </h5>
                                        <div className="space-y-3">
                                            {orphanedIssues.map((issue, i) => {
                                                const diagnosisText = issue.impact?.correctness || 
                                                    issue.impact?.runtime || 
                                                    issue.impact?.robustness ||
                                                    `${issue.title} affects code correctness.`;
                                                
                                                const severityColor = issue.severity === 'critical' ? '#ff453a' :
                                                    issue.severity === 'major' ? '#ff9f0a' : '#ffd60a';
                                                
                                                return (
                                                    <div 
                                                        key={i}
                                                        style={{
                                                            background: '#111111',
                                                            borderLeft: `5px solid ${severityColor}`,
                                                            borderRadius: '4px',
                                                        }}
                                                        className="p-3"
                                                    >
                                                        <div style={{ color: severityColor }} className="text-[10px] font-bold uppercase tracking-widest mb-1">
                                                            {issue.severity}: {issue.title}
                                                        </div>
                                                        <p className="text-[13px] text-gray-400 mb-2">{diagnosisText}</p>
                                                        <div className="p-2 rounded font-mono text-xs" style={{ background: '#1a1a1a' }}>
                                                            {issue.fix.split(/\.\s+(?=[A-Z`])/).filter((s: string) => s.trim()).map((step: string, idx: number) => (
                                                                <div key={idx} className="flex items-start gap-2 text-emerald-400">
                                                                    <span className="text-emerald-500 select-none">+</span>
                                                                    <span>{step.trim().endsWith('.') ? step.trim() : step.trim() + '.'}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Reveal Full Solution - Hidden by Default */}
                                <div className="border-t border-[#2a2a2a]">
                                    <button
                                        onClick={() => toggleSection('revealSolution')}
                                        className="w-full px-4 py-3 flex items-center justify-center gap-2 text-gray-500 hover:text-emerald-400 hover:bg-[#1a1a1a] transition-all group"
                                    >
                                        {expandedSections.revealSolution ? (
                                            <>
                                                <ChevronDown size={14} />
                                                <span className="text-xs font-bold uppercase tracking-widest">Hide Corrected Solution</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={14} />
                                                <span className="text-xs font-bold uppercase tracking-widest">Reveal Full Corrected Solution</span>
                                                <span className="text-[10px] text-gray-600 ml-2">(after reviewing issues above)</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    {expandedSections.revealSolution && (
                                        <div className="p-4 bg-[#0f1a0f] border-t border-emerald-900/30 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center gap-2 mb-3">
                                                <CheckCircle size={14} className="text-emerald-400" />
                                                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                                                    Corrected Solution
                                                </h4>
                                            </div>
                                            <pre className="text-xs font-mono text-gray-200 overflow-x-auto">
                                                <code>{dedentCode(correctedSolution || solutionCode)}</code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}
            
            {/* BATTLE PLAN - The Exit Strategy */}
            {nextTimeHabits && nextTimeHabits.length > 0 && isCoding && (
                <div className="mb-8 sm:mb-12">
                    {/* Battle Plan Header */}
                    <div className="mb-4 sm:mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Zap size={16} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-base font-bold text-emerald-400 uppercase tracking-widest">
                                Battle Plan
                            </h3>
                            <p className="text-[10px] sm:text-xs text-gray-500">Three commandments for your next attempt</p>
                        </div>
                    </div>
                    
                    {/* The Three Commandments */}
                    <div className="space-y-4">
                        {/* Phase 1: The Schematic Phase (Pre-Code) */}
                        {nextTimeHabits[0] && (
                            <div 
                                className="rounded-lg overflow-hidden"
                                style={{
                                    background: '#0d1117',
                                    borderLeft: '5px solid #34c759',
                                    borderRadius: '4px',
                                }}
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-widest">
                                            1. The Schematic Phase
                                        </span>
                                        <span className="text-[9px] text-gray-600 uppercase tracking-wider">(Pre-Code)</span>
                                    </div>
                                    <div className="mb-3 px-3 py-2 bg-[#1a1a1a] rounded border-l-2 border-emerald-500/50">
                                        <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest block mb-1">Rule</span>
                                        <p className="text-xs sm:text-sm text-gray-300 font-medium">Never touch the keyboard until the "Map" is drawn.</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold text-xs mt-0.5">→</span>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Action</span>
                                            <p className="text-sm text-gray-200">{nextTimeHabits[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Phase 2: The Structural Audit (In-Code) */}
                        {nextTimeHabits[1] && (
                            <div 
                                className="rounded-lg overflow-hidden"
                                style={{
                                    background: '#0d1117',
                                    borderLeft: '5px solid #34c759',
                                    borderRadius: '4px',
                                }}
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-widest">
                                            2. The Structural Audit
                                        </span>
                                        <span className="text-[9px] text-gray-600 uppercase tracking-wider">(In-Code)</span>
                                    </div>
                                    <div className="mb-3 px-3 py-2 bg-[#1a1a1a] rounded border-l-2 border-emerald-500/50">
                                        <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest block mb-1">Rule</span>
                                        <p className="text-xs sm:text-sm text-gray-300 font-medium">Test your data structure's "Memory."</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold text-xs mt-0.5">→</span>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Action</span>
                                            <p className="text-sm text-gray-200">{nextTimeHabits[1]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Phase 3: The Stress Test (Edge-Cases) */}
                        {nextTimeHabits[2] && (
                            <div 
                                className="rounded-lg overflow-hidden"
                                style={{
                                    background: '#0d1117',
                                    borderLeft: '5px solid #34c759',
                                    borderRadius: '4px',
                                }}
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-widest">
                                            3. The Stress Test
                                        </span>
                                        <span className="text-[9px] text-gray-600 uppercase tracking-wider">(Edge-Cases)</span>
                                    </div>
                                    <div className="mb-3 px-3 py-2 bg-[#1a1a1a] rounded border-l-2 border-emerald-500/50">
                                        <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest block mb-1">Rule</span>
                                        <p className="text-xs sm:text-sm text-gray-300 font-medium">Code for the "Overflow."</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-emerald-400 font-bold text-xs mt-0.5">→</span>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Action</span>
                                            <p className="text-sm text-gray-200">{nextTimeHabits[2]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Key Strengths - Collapsible footnote section */}
            {highlights && highlights.length > 0 && isCoding && (
                <div className="mb-8 sm:mb-12">
                    <button 
                        onClick={() => toggleSection('keyStrengths')}
                        className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl hover:bg-[#252525] transition-colors"
                    >
                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold tracking-widest uppercase">
                            <ThumbsUp size={14} /> Key Strengths
                            <span className="text-gray-600 font-normal normal-case">({highlights.length} noted)</span>
                        </div>
                        <div className="text-gray-500">
                            {expandedSections.keyStrengths ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                    </button>
                    {expandedSections.keyStrengths && (
                        <div className="mt-2 bg-[#1e1e1e] rounded-xl p-4 sm:p-6 border border-[#2a2a2a] animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="space-y-4">
                                {highlights.map((item, i) => {
                                    const saved = isSaved(item.strength, item.quote);
                                    return (
                                        <div key={i} className="group">
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className="text-gray-500 mt-0.5">✓</span>
                                                <div className="flex-1">
                                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">{item.category}</span>
                                                    <span className="text-sm sm:text-base font-medium text-gray-200">{item.strength}</span>
                                                </div>
                                                <button 
                                                    onClick={() => onToggleSave({
                                                        type: 'highlight',
                                                        category: item.category,
                                                        title: item.strength,
                                                        content: item.quote,
                                                        question: item.question || context,
                                                        reportData: createReportContext(report, transcript, context)
                                                    })}
                                                    className={`p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
                                                        saved ? 'text-gold bg-gold/10 opacity-100' : 'text-gray-600 hover:text-gold hover:bg-gold/10'
                                                    }`}
                                                    title={saved ? "Remove from database" : "Save to database"}
                                                >
                                                    <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                                                </button>
                                            </div>
                                            <div className="ml-5 pl-3 border-l border-gray-700 py-2">
                                                <p className="text-sm text-gray-400 italic leading-relaxed">
                                                    "{item.quote}"
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
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

            {/* Highlights - Mobile responsive (Non-coding reports only - coding uses the Signal vs Evidence table above) */}
            {highlights && highlights.length > 0 && !isCoding && (
                <>
                    <div className="mb-3 sm:mb-4 flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-8 sm:mt-12 text-charcoal">
                        <ThumbsUp size={12} className="sm:w-3.5 sm:h-3.5" /> Key Strengths
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {highlights.map((item, i) => {
                            const saved = isSaved(item.strength, item.quote);
                            return (
                                <div key={i} className="rounded-xl p-4 sm:p-5 relative group bg-white border border-[#EBE8E0]">
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
                                            saved ? 'text-gold bg-gold/10' : 'text-gray-300 hover:text-charcoal hover:bg-gray-50'
                                        }`}
                                        title={saved ? "Remove from database" : "Save to database"}
                                    >
                                        <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
                                    </button>

                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.category}</span>
                                    </div>
                                    
                                    <h4 className="text-sm font-bold mb-2 pr-6 text-charcoal">{item.strength}</h4>
                                    <p className="text-xs leading-relaxed text-gray-600">"{item.quote}"</p>
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
