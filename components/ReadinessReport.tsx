/**
 * Readiness Report Component
 * 
 * Displays the "Readiness to Teach" evaluation after Pass 1 (Explain mode).
 * Shows what's ready and what's missing before moving to Pass 2 (Teach mode).
 */

import React from 'react';
import { 
    CheckCircle2, 
    XCircle, 
    AlertTriangle, 
    Lightbulb, 
    Clock, 
    Database, 
    Route, 
    Shield,
    ArrowRight,
    RotateCcw,
    Sparkles,
    FileText,
    FileJson
} from 'lucide-react';
import { ReadinessReport } from '../types';

interface ReadinessReportComponentProps {
    report: ReadinessReport;
    problemTitle: string;
    onContinueToTeach: () => void;
    onTryAgain: () => void;
    rawTranscript?: string;
    refinedTranscript?: string;
}

const ReadinessReportComponent: React.FC<ReadinessReportComponentProps> = ({
    report,
    problemTitle,
    onContinueToTeach,
    onTryAgain,
    rawTranscript,
    refinedTranscript
}) => {
    const { checklist, readinessScore, isReadyToTeach, missingElements, strengthElements, suggestion } = report;

    // Download helpers for debugging
    const downloadTranscript = () => {
        const content = `=== READINESS EVALUATION TRANSCRIPT ===
Problem: ${problemTitle}
Date: ${new Date().toISOString()}

=== RAW TRANSCRIPT (from speech recognition) ===
${rawTranscript || '(not available)'}

=== REFINED TRANSCRIPT (sent to AI for evaluation) ===
${refinedTranscript || '(not available)'}
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcript-${problemTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadEvaluation = () => {
        const content = JSON.stringify({
            problemTitle,
            timestamp: new Date().toISOString(),
            transcriptUsed: refinedTranscript || rawTranscript || '(not available)',
            evaluation: report
        }, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `evaluation-${problemTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Get quality icon and color
    const getQualityIndicator = (quality: string, present: boolean) => {
        if (!present || quality === 'missing') {
            return { icon: <XCircle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' };
        }
        if (quality === 'vague' || quality === 'hand-wavy' || quality === 'abstract') {
            return { icon: <AlertTriangle size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
        }
        return { icon: <CheckCircle2 size={16} />, color: 'text-green-400', bg: 'bg-green-500/10' };
    };

    // Checklist items configuration
    const checklistItems = [
        {
            key: 'coreInsight',
            label: 'Core Insight',
            icon: <Lightbulb size={18} />,
            data: checklist.coreInsight,
            description: 'One-sentence summary of the key idea'
        },
        {
            key: 'stateDefinition',
            label: 'State Definition',
            icon: <Database size={18} />,
            data: checklist.stateDefinition,
            description: 'What your data structure stores'
        },
        {
            key: 'exampleWalkthrough',
            label: 'Example Walkthrough',
            icon: <Route size={18} />,
            data: checklist.exampleWalkthrough,
            description: 'Traced through a concrete example'
        },
        {
            key: 'edgeCases',
            label: 'Edge Cases',
            icon: <Shield size={18} />,
            data: {
                present: checklist.edgeCases.mentioned.length > 0,
                quality: checklist.edgeCases.missing.length === 0 ? 'clear' : 
                         checklist.edgeCases.mentioned.length > 0 ? 'vague' : 'missing',
                feedback: checklist.edgeCases.feedback
            },
            description: 'Boundary conditions covered'
        },
        {
            key: 'complexity',
            label: 'Complexity Analysis',
            icon: <Clock size={18} />,
            data: {
                present: checklist.complexity.timeMentioned || checklist.complexity.spaceMentioned,
                quality: (checklist.complexity.timeCorrect && checklist.complexity.spaceCorrect) ? 'clear' :
                         (checklist.complexity.timeMentioned || checklist.complexity.spaceMentioned) ? 'vague' : 'missing',
                feedback: checklist.complexity.feedback
            },
            description: 'Time and space complexity'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Score Header */}
            <div className={`rounded-2xl p-6 border ${
                isReadyToTeach 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-yellow-500/10 border-yellow-500/30'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-serif font-bold text-charcoal">
                            Readiness to Teach: {problemTitle}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {isReadyToTeach 
                                ? "You've formed a teachable mental model!" 
                                : "Almost there — fill in the gaps below"}
                        </p>
                    </div>
                    <div className={`text-4xl font-bold font-mono ${
                        isReadyToTeach ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                        {readinessScore}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-700 ${
                            isReadyToTeach ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${readinessScore}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Not Ready</span>
                    <span className="text-gray-500 font-medium">70 = Ready to Teach</span>
                    <span>Expert</span>
                </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid gap-3">
                {checklistItems.map(item => {
                    const { icon, color, bg } = getQualityIndicator(item.data.quality, item.data.present);
                    const isEdgeCases = item.key === 'edgeCases';
                    
                    return (
                        <div 
                            key={item.key}
                            className={`rounded-xl p-4 border border-gray-200 bg-white ${bg}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-charcoal">{item.label}</span>
                                        <span className={color}>{icon}</span>
                                    </div>
                                    
                                    {/* Special detailed view for Edge Cases */}
                                    {isEdgeCases && (
                                        <div className="space-y-2 mb-2">
                                            {checklist.edgeCases.mentioned.length > 0 && (
                                                <div className="text-xs">
                                                    <span className="font-medium text-green-700">You mentioned: </span>
                                                    <span className="text-gray-600">
                                                        {checklist.edgeCases.mentioned.map((ec, i) => (
                                                            <span key={i} className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-1.5 py-0.5 rounded mr-1 mb-1">
                                                                <CheckCircle2 size={10} />
                                                                {ec}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                            {checklist.edgeCases.missing.length > 0 && (
                                                <div className="text-xs">
                                                    <span className="font-medium text-orange-700">Not covered: </span>
                                                    <span className="text-gray-600">
                                                        {checklist.edgeCases.missing.map((ec, i) => (
                                                            <span key={i} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded mr-1 mb-1">
                                                                <XCircle size={10} />
                                                                {ec}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {item.data.feedback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Strengths */}
            {strengthElements.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                        <Sparkles size={16} />
                        What You Explained Well
                    </h4>
                    <ul className="space-y-1">
                        {strengthElements.map((strength, idx) => (
                            <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                                <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
                                {strength}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Missing Elements */}
            {missingElements.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} />
                        What's Still Missing
                    </h4>
                    <ul className="space-y-1">
                        {missingElements.map((missing, idx) => (
                            <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                                <XCircle size={14} className="mt-0.5 shrink-0" />
                                {missing}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Suggestion */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                    <Lightbulb size={16} />
                    Before You Teach...
                </h4>
                <p className="text-sm text-blue-700">{suggestion}</p>
            </div>

            {/* Debug Download Buttons */}
            <div className="flex gap-2 pt-2">
                <button
                    onClick={downloadTranscript}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                    title="Download transcript for debugging"
                >
                    <FileText size={14} />
                    Download Transcript
                </button>
                <button
                    onClick={downloadEvaluation}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                    title="Download evaluation JSON for debugging"
                >
                    <FileJson size={14} />
                    Download Evaluation
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={onTryAgain}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-sm hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                    <RotateCcw size={18} />
                    Explain Again
                </button>
                <button
                    onClick={onContinueToTeach}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
                        isReadyToTeach
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                            : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                >
                    Continue to Teach
                    <ArrowRight size={18} />
                </button>
            </div>

            {!isReadyToTeach && (
                <p className="text-center text-xs text-gray-400 italic">
                    You can still teach, but filling the gaps first will make it more effective
                </p>
            )}
        </div>
    );
};

export default ReadinessReportComponent;
